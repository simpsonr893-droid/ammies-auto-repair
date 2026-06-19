# EUR/USD Signal Generator

A notify-only bot. Watches 5-minute EUR/USD candles, fires up to **3 signals
per day** in a configurable window (default 9 AM - 1 PM), and emails you when
a setup appears. **It does not place trades** - you enter them manually on
your broker.

## Strategy

- 5-minute candles, EMA(9) / EMA(21) crossover
- RSI(14) confirmation: must be 50-70 for CALL, 30-50 for PUT
  (filters out chasing already-exhausted moves)
- 30-minute cooldown between signals
- Hard cap of 3 signals/day

This is a starting point, not a holy grail. Backtest and tune before relying
on it.

## Setup

```bash
cd signals
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env - SMTP creds + window
```

For Gmail you'll need an [App Password](https://myaccount.google.com/apppasswords)
(regular passwords won't work over SMTP).

## Run

```bash
set -a && source .env && set +a
python signal_bot.py
```

It loops forever, polling once a minute during the window and sleeping
otherwise. Counters reset at midnight local time.

## Honest disclaimers

- Binary options have negative expected value at typical 92% payouts unless
  your win rate is above ~52%. A simple crossover bot usually doesn't clear
  that bar. Paper-trade it for a few weeks before risking real money.
- Pocket Option's TOS prohibit automated order placement, which is why this
  tool only notifies. Do not wire it up to click buttons.
- Binary options are restricted or banned for retail traders in the EU, UK,
  and Australia. Know your local rules.
