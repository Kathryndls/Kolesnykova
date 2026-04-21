# Baseline Performance Snapshot

Date: 2026-04-20
Scope: `/index.html` (static landing page)

## Core file sizes (bytes)

- `index.html`: 17592
- `css/style.css`: 27820
- `js/script.js`: 5340

## Local gallery image sizes (bytes)

- `photo/header.jpg`: 145500
- `photo/ph-1.jpg`: 1745326
- `photo/ph-2.jpg`: 871289
- `photo/ph-3.jpg`: 1853334
- `photo/ph-4.jpg`: 2444045
- `photo/ph-5.jpg`: 2225115

Total local gallery images: 9284609 bytes (~8.86 MB)

## Markup/media baseline

- `<img>` tags in `index.html`: 19
- Local image sources in main page: 12
- YouTube preview sources in main page: 6
- Contact icon images in main page: 7

## Initial optimization targets

- Reduce local gallery image transfer by 60%+ with responsive WebP assets.
- Defer non-critical gallery/image loading with `loading="lazy"` and `decoding="async"`.
- Cut initial JS work by deferring slider initialization until gallery section is in viewport.
