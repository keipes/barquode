# barquo.de
Create UPCA and EAN13 barcodes for use on packaging.

## Build
```
npm install
npm run build
```

## Develop
Not using a bundler at the moment, build script in `scripts/build.ts`.

I'm going for a minimal target size here. No libraries or frameworks are needed by the build artifact. Right now the site is about ~6kB uncompressed.

### Build on change
```
npm run watch
```

### View
I'm using IntelliJ's built in web browser to host build/web/index.html and viewing in Chrome.

### Attribution

OCR-B digit glyphs adapted from "ocrb" by Matthew Anderson. License [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). Site [archive](https://web.archive.org/web/20190328165040/https://wehtt.am/ocr-b/), [original](https://wehtt.am/ocr-b/).