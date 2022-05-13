# barquo.de
Create UPCA and EAN13 barcodes for use on packaging.


## Tools
Some of the build tools aren't properly configured in package.json, so might hit some errors on build until they're installed.
* typescript compiler
* uglifyjs (might switch to terser, right now the build compiles both and uses only uglify)
* npm-watch

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
