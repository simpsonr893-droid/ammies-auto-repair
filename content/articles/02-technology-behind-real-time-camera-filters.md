# The Technology Behind Real-Time Camera Filters in Web Apps

*Brand: Instant Camera for Events | Type: Technical Article | Target: Developers & Tech-Curious Users*

---

## Overview

When you open **Instant Camera for Events** on your phone and swipe through filters — watching the live viewfinder shift from warm to cool to black and white in real time — what you're experiencing is the convergence of several browser APIs that have matured significantly over the past five years.

This article explains the technical stack behind live camera filtering in a browser-based web application, and why it enables experiences that would previously have required a native app.

---

## The Camera Pipeline: getUserMedia

The entry point for any browser-based camera application is the `getUserMedia` API, part of the WebRTC specification. This API allows a web page to request access to the device's camera and microphone through the browser's permission model.

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment', // rear camera
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  },
  audio: false
});
```

The resulting `MediaStream` object is attached to a `<video>` element, which displays the live feed. Crucially, `getUserMedia` grants access to the full camera hardware — including both front and rear cameras, and on supported devices, the torch (flash).

---

## Applying Filters: CSS Filter on the Video Element

The simplest and most performant approach to live filter application is CSS `filter` on the `<video>` element itself. The browser's rendering pipeline applies filter effects at the GPU compositing stage, meaning they cost effectively nothing in terms of CPU and do not degrade frame rate.

```css
video {
  filter: saturate(1.8) contrast(1.1); /* Vivid */
}
```

The eight filters in Instant Camera for Events are all CSS filter compositions:

| Filter | CSS Value |
|--------|-----------|
| Normal | `none` |
| Vivid | `saturate(1.8) contrast(1.1)` |
| B&W | `grayscale(1)` |
| Sepia | `sepia(0.8)` |
| Faded | `saturate(0.6) brightness(1.15) contrast(0.9)` |
| Vintage | `sepia(0.4) contrast(0.85) brightness(0.85) hue-rotate(10deg)` |
| Cool | `hue-rotate(30deg) saturate(1.15) brightness(1.05)` |
| Warm | `sepia(0.2) saturate(1.4) hue-rotate(-10deg)` |

Since the filter is applied as a CSS property on the live video, switching filters is instantaneous — it requires only a style update, not any image processing.

---

## Capturing with Filters: Canvas API

The challenge with CSS filters is that they are display-only — they affect what the user sees on screen but do not change the underlying pixel data from the camera. When a photo is captured, the raw camera frame is what gets written to the output.

To capture a photo with the filter applied, the Canvas 2D API's `ctx.filter` property is used. This mirrors the CSS filter behavior but applies it to the pixel data being drawn onto the canvas.

```javascript
const canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
const ctx = canvas.getContext('2d');

ctx.filter = 'saturate(1.8) contrast(1.1)'; // same as CSS filter
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
```

The `toDataURL` call encodes the filtered canvas as a JPEG at 92% quality, producing a photo that looks identical to what the user saw through the viewfinder.

---

## Text Overlay: Event Name on Canvas

The event name overlay is applied in the same canvas pass, after the filtered video frame is drawn. The canvas text API places styled text at a specified coordinate:

```javascript
ctx.filter = 'none'; // reset filter before drawing text
ctx.font = `bold ${fontSize}px Inter, sans-serif`;
ctx.fillStyle = 'white';
ctx.shadowColor = 'rgba(0,0,0,0.75)';
ctx.shadowBlur = 12;
ctx.textAlign = 'center';
ctx.fillText(eventName, canvas.width / 2, canvas.height - fontSize * 1.4);
```

This burns the event name permanently into the captured image — it becomes part of the JPEG data, not a UI overlay. Every photo exported from the app carries the label regardless of where it is shared or viewed.

---

## Sharing: Web Share API

Photo distribution uses the Web Share API (`navigator.share`), which invokes the device's native sharing interface — the same sheet that appears when you hit "Share" in any native app.

```javascript
const blob = await (await fetch(photo.dataUrl)).blob();
const file = new File([blob], 'event-photo.jpg', { type: 'image/jpeg' });

await navigator.share({
  files: [file],
  title: 'Event Photo'
});
```

This API is now supported across Chrome on Android, Safari on iOS, and desktop Chrome/Edge. On browsers that don't support file sharing, the app falls back to a direct download.

---

## Why This Works Without a Native App

Five years ago, the combination of `getUserMedia` with full hardware access, `ctx.filter` with GPU acceleration, and `navigator.share` with file support did not exist reliably in mobile browsers. Each of these APIs has reached stable, broadly-supported status independently, and together they enable a camera experience that is functionally indistinguishable from a native app — without requiring the App Store, a download, or persistent storage permissions.

**Instant Camera for Events** is a demonstration of what the modern browser platform can do when these APIs are composed well.

**[instant-camera-for-events.rork.app](https://instant-camera-for-events.rork.app)**
