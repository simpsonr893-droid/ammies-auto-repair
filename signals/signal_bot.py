"""EUR/USD binary-options signal generator.

Pulls 5-minute EUR/USD candles, looks for EMA9/EMA21 crossovers confirmed by
RSI(14), and emails up to 3 setups per day inside a configurable window
(default 09:00-13:00 local time). Trades are NOT placed automatically -
this only notifies; the user enters them manually on the broker.

Run continuously:
    python signal_bot.py

Configuration is loaded from environment variables (see .env.example).
"""

from __future__ import annotations

import logging
import os
import smtplib
import time
from dataclasses import dataclass
from datetime import date, datetime, time as dtime
from email.message import EmailMessage
from zoneinfo import ZoneInfo

import pandas as pd
import yfinance as yf

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("signal_bot")


@dataclass(frozen=True)
class Config:
    symbol: str
    expiry_minutes: int
    stake_usd: float
    max_signals_per_day: int
    cooldown_minutes: int
    window_start: dtime
    window_end: dtime
    timezone: ZoneInfo
    poll_seconds: int
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_password: str
    email_to: str


def load_config() -> Config:
    tz = ZoneInfo(os.environ.get("TIMEZONE", "America/Chicago"))
    start_h, start_m = (int(x) for x in os.environ.get("WINDOW_START", "09:00").split(":"))
    end_h, end_m = (int(x) for x in os.environ.get("WINDOW_END", "13:00").split(":"))
    return Config(
        symbol=os.environ.get("SYMBOL", "EURUSD=X"),
        expiry_minutes=int(os.environ.get("EXPIRY_MINUTES", "1")),
        stake_usd=float(os.environ.get("STAKE_USD", "1")),
        max_signals_per_day=int(os.environ.get("MAX_SIGNALS_PER_DAY", "3")),
        cooldown_minutes=int(os.environ.get("COOLDOWN_MINUTES", "30")),
        window_start=dtime(start_h, start_m),
        window_end=dtime(end_h, end_m),
        timezone=tz,
        poll_seconds=int(os.environ.get("POLL_SECONDS", "60")),
        smtp_host=os.environ["SMTP_HOST"],
        smtp_port=int(os.environ.get("SMTP_PORT", "587")),
        smtp_user=os.environ["SMTP_USER"],
        smtp_password=os.environ["SMTP_PASSWORD"],
        email_to=os.environ["EMAIL_TO"],
    )


def fetch_candles(symbol: str) -> pd.DataFrame:
    """Pull the last few days of 5-minute candles for the symbol."""
    df = yf.download(
        symbol,
        period="5d",
        interval="5m",
        progress=False,
        auto_adjust=False,
    )
    if df.empty:
        raise RuntimeError(f"No data returned for {symbol}")
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    return df


def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    close = df["Close"]
    df = df.copy()
    df["ema_fast"] = close.ewm(span=9, adjust=False).mean()
    df["ema_slow"] = close.ewm(span=21, adjust=False).mean()

    delta = close.diff()
    gain = delta.clip(lower=0).ewm(alpha=1 / 14, adjust=False).mean()
    loss = (-delta.clip(upper=0)).ewm(alpha=1 / 14, adjust=False).mean()
    rs = gain / loss.replace(0, pd.NA)
    df["rsi"] = 100 - (100 / (1 + rs))
    return df


def latest_signal(df: pd.DataFrame) -> str | None:
    """Return 'CALL' (price up), 'PUT' (price down), or None.

    Looks at the most recently *closed* candle. A signal fires when the
    fast EMA crosses the slow EMA on that candle and RSI confirms momentum
    but isn't already extreme (avoid chasing exhausted moves).
    """
    if len(df) < 25:
        return None
    last, prev = df.iloc[-1], df.iloc[-2]
    if pd.isna(last[["ema_fast", "ema_slow", "rsi"]]).any():
        return None
    if pd.isna(prev[["ema_fast", "ema_slow"]]).any():
        return None

    crossed_up = prev["ema_fast"] <= prev["ema_slow"] and last["ema_fast"] > last["ema_slow"]
    crossed_down = prev["ema_fast"] >= prev["ema_slow"] and last["ema_fast"] < last["ema_slow"]
    rsi = last["rsi"]

    if crossed_up and 50 <= rsi < 70:
        return "CALL"
    if crossed_down and 30 < rsi <= 50:
        return "PUT"
    return None


def send_email(cfg: Config, subject: str, body: str) -> None:
    msg = EmailMessage()
    msg["From"] = cfg.smtp_user
    msg["To"] = cfg.email_to
    msg["Subject"] = subject
    msg.set_content(body)
    with smtplib.SMTP(cfg.smtp_host, cfg.smtp_port) as s:
        s.starttls()
        s.login(cfg.smtp_user, cfg.smtp_password)
        s.send_message(msg)


def in_window(now: datetime, cfg: Config) -> bool:
    t = now.timetz().replace(tzinfo=None)
    return cfg.window_start <= t <= cfg.window_end


def format_alert(direction: str, price: float, cfg: Config, now: datetime) -> tuple[str, str]:
    arrow = "UP" if direction == "CALL" else "DOWN"
    subject = f"[Signal {arrow}] {cfg.symbol} @ {price:.5f}"
    body = (
        f"Direction:    {direction} ({arrow})\n"
        f"Symbol:       {cfg.symbol}\n"
        f"Price:        {price:.5f}\n"
        f"Time:         {now.strftime('%Y-%m-%d %H:%M:%S %Z')}\n"
        f"Expiry:       {cfg.expiry_minutes} minute(s)\n"
        f"Stake:        ${cfg.stake_usd:.2f}\n"
        f"\n"
        f"Place the trade manually on your broker. This is a notification only.\n"
    )
    return subject, body


def main() -> None:
    cfg = load_config()
    log.info(
        "Starting. symbol=%s window=%s-%s tz=%s max/day=%d cooldown=%dm",
        cfg.symbol,
        cfg.window_start,
        cfg.window_end,
        cfg.timezone.key,
        cfg.max_signals_per_day,
        cfg.cooldown_minutes,
    )

    signals_today: int = 0
    current_day: date | None = None
    last_signal_at: datetime | None = None
    last_bar_time: pd.Timestamp | None = None

    while True:
        try:
            now = datetime.now(cfg.timezone)

            if current_day != now.date():
                current_day = now.date()
                signals_today = 0
                last_signal_at = None
                last_bar_time = None
                log.info("New trading day %s; counters reset", current_day)

            if not in_window(now, cfg):
                time.sleep(cfg.poll_seconds)
                continue

            if signals_today >= cfg.max_signals_per_day:
                time.sleep(cfg.poll_seconds)
                continue

            if last_signal_at and (now - last_signal_at).total_seconds() < cfg.cooldown_minutes * 60:
                time.sleep(cfg.poll_seconds)
                continue

            df = compute_indicators(fetch_candles(cfg.symbol))
            bar_time = df.index[-1]
            if last_bar_time is not None and bar_time == last_bar_time:
                time.sleep(cfg.poll_seconds)
                continue
            last_bar_time = bar_time

            direction = latest_signal(df)
            if direction is None:
                time.sleep(cfg.poll_seconds)
                continue

            price = float(df["Close"].iloc[-1])
            subject, body = format_alert(direction, price, cfg, now)
            send_email(cfg, subject, body)
            signals_today += 1
            last_signal_at = now
            log.info("Sent %s signal #%d at %.5f", direction, signals_today, price)

        except Exception:
            log.exception("Loop error; will retry")

        time.sleep(cfg.poll_seconds)


if __name__ == "__main__":
    main()
