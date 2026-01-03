# Changelog

## [2.1.0] - 2026-01-03
### Added
- **`helpers` parameter for `setFunction`** - Define nested GLSL helper functions that are automatically included in the shader
  - Helper functions are added before the main shader function in the generated code
  - Automatic GLSL 1.0 to 3.0 conversion for helpers (same as `glsl` parameter)
  - **Smart deduplication with conflict resolution**:
    - Identical helper functions (same name, signature, and body) are included only once
    - If two shaders define a helper with the same name but different implementation, the second one is automatically renamed (e.g., `noise3d` → `shaderName_noise3d`)
    - References in the shader's `glsl` code are automatically updated to use the renamed function
    - Ensures unique names even with multiple conflicts (adds counter suffix if needed)
- **Dynamic Output Support** - Removed the hardcoded limit of 4 outputs.
  - You can now initialize Hydra with any number of outputs: `new Hydra({ numOutputs: 16 })`.
  - The render grid automatically adapts to the number of outputs.
  - Preserved legacy visual layout (column-major rendering) for 4 outputs.

  Example usage:
  ```javascript
  setFunction({
    name: 'coolShader',
    type: 'src',
    helpers: `
      float noise3d(vec3 p) { 
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); 
      }
      vec2 rotate(vec2 p, float a) { 
        float c = cos(a), s = sin(a);
        return vec2(p.x*c - p.y*s, p.x*s + p.y*c);
      }
    `,
    glsl: `
      vec2 st = rotate(_st - 0.5, time) + 0.5;
      float n = noise3d(vec3(st * 10.0, time));
      return vec4(vec3(n), 1.0);
    `
  });
  ```

## [2.0.0] - 2026-01-01
### Added
- **GLSL 3.0 ES (WebGL 2.0) support** - Hydra now uses GLSL 3.0 ES as default for improved shader compatibility
- **Automatic GLSL 1.0 to 3.0 conversion** - External plugins using `texture2D` are automatically converted in real-time
- **`glsl3` parameter for shader functions** - Custom functions can now provide both `glsl` and `glsl3` versions
- **New `glsl-converter.js` module** - Handles real-time GLSL 1.0 → 3.0 syntax conversion
- **Vite.js build system** - Modern bundler replacing browserify/budo
- **Root `index.html`** - Entry point for Vite dev server

### Changed
- **WebGL2 context by default** - `_initRegl()` now creates WebGL2 context, with WebGL1 fallback
- **Shader syntax updated to GLSL 3.0**:
  - `varying` → `in` (fragment) / `out` (vertex)
  - `attribute` → `in` (vertex)
  - `texture2D()` → `texture()`
  - `gl_FragColor` → `fragColor` (custom output variable)
  - Added `#version 300 es` directive to all shaders
- **`src()` and `prev()` functions** - Added `glsl3` parameter with `texture()` syntax
- **Package exports** - Now exports ES module (`hydra-synth.es.js`) and UMD (`hydra-synth.umd.js`)
- **Version bumped to 2.0.0** - Major version for breaking WebGL2 changes
- **Dev files converted to ES modules** - `dev/index.js` and `dev/examples.js`

### Fixed
- Code formatting and indentation consistency across source files

### Build
- `npm run dev` - Vite dev server on port 8000
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build
- `npm run build:legacy` - Legacy browserify build (for compatibility)

## [1.4] - 2025-09-24
### Fixed
- hard crashing when inputting invalid texture, fixed by @ojack and @ffd8
- multiple render passes on the same tick use the same time value by @geikha
- using `require()` to import by @ilesinge
- invalid indexing for arrays on initial load by @jacopo-salamina 

### Added
- shader optimizations by @glfmn
- `initCanvas` function by @recter
- updated meyda

## [1.3.29] - 2023-08-16
### Fixed
- skip accessing parent object, fixing [iframe issue](https://github.com/hydra-synth/hydra-synth/issues/139#issuecomment-1523755523)
- use `globalThis.eval` for vite compatibility

## [1.3.28] - 2023-05-22
### Fixed
- add explicit export of glsl-functions.js in package.json, see [here](https://github.com/hydra-synth/hydra-synth/issues/141)

### Added
- tips in readme for [iOS video autoplay](https://github.com/hydra-synth/hydra-synth/issues/137)

## [1.3.27] - 2023-04-26
### Fixed
- reverted changes from [1.3.25], see [here](https://github.com/hydra-synth/hydra-synth/pull/136#issuecomment-1523606639)

## [1.3.25] - 2023-04-19
### Changed
- Removed global eval() from sandbox

## [1.3.24] - 2022-10-27
### Fixed
- Fixed globally exposed transforms which broke multi hydra

## [1.3.22] - 2022-10-23
### Fixed
- Fixed bundled version that was broken in previous commit

## [1.3.21] - 2022-10-23
### Added
- support for ES6 modules and import syntax

### Removed
- removed extraneous files

## Changed
- 'window' to 'global.window' to work with es6 bundling

## [1.3.20] - 2022-07-07
### Fixed
- reverted Array typechecking as was causing error

## [1.3.19] - 2022-07-07
### Fixed
- better error handling for functions
- typechecking for arrays

## [1.3.18] - 2022-06-13
### Fixed
- updated Meyda to v5.5

## [1.3.17] - 2022-01-10
### Fixed
- Fix 'update' function error log 
- reset 'update' function when hush()
- `.tick()` working in non-global mode

## [1.3.16] - 2022-01-10
### Fixed 
- nested layers error

### Added 
- texture params to regl sources

### Changed
- hush() resets to source o0

## [1.3.15] - 2022-01-08
### Fixed 
- error in function argument formatting
### Added 
- texture params to regl sources

### Fixed
- arrayUtils imprted to formatArguents.js
## [1.3.14] - 2022-01-08
### Fixed
- arrayUtils imprted to formatArguents.js

### Changed
- mask function now preserves earlier transparency

## [1.3.12] - 2022-01-05
### Fixed
- bug with `src()` function in non-global mode

### Added
- additional multiple-canvas example including dereferencing
- link to `hydra-ts`

## [1.3.11] - 2021-12-13
- updated build version

## [1.3.10] - 2021-12-13
### Fixed
- camera working on ios

## [1.3.9] - 2021-11-02
### Fixed
- non-global mode

### Added
- documentation for non-global mode
- loadScript function to hydra-synth

## [1.3.8] - 2021-04-12
### Changed
- uses absolute position for mouse
- updated documentation

## [1.3.7] - 2021-04-06
### Fixed
- bug in precision for shaders

### Changed
- when no precision is specified, uses "highp" on ios, and "mediump" on everything else

## [1.3.5] - 2020-11-06
- Fixed divide by 0 on smoothstep

## [1.3.2] - 2020-11-04
### Fixed
- Typo on rotate function
- update for setResolution()
- warning of undefined type

### Changed
- video default to muted

## [1.3.0] - 2020-06-10
### Changed
- wrapping for scroll, scrollX, modulateScroll functions

### Added
- initVideo(url)
- initImage(url)

## [1.1.8] - 2020-04-13
### Changed
- updated format for glsl-functions

## [1.1.7] - 2020-04-10
### Added
 - added smooth(), ease(), and fit() to array utils

### Changed
 - changed resize() to setResolution()

### Bugs / to do
 - setResolution() not scaling correctly. check whether textures are being resized

## [1.1.6] - 2020-04-03
### Fixed
 - error in eval-sandbox

## [1.1.5] - 2020-04-03
### Added
 - fps to set target rendering speed `fps=30`, not setting a value or `fps=undefined` will render as fast as possible
 - when canvas is stretched, uses pixelated rendering rather than blurry
 - stats.fps shows current fps (read-only)
 - update function called each time a new frame is rendered. can be used like
 ```
update = (dt) => {
      // something i want to do
}
```

### Fixed
 - invalid function does not crash editor

## [1.1.4] - 2020-04-02

### Added
 - hush() function clears all screens and stops cameras
 - speed variable for controlling time

### Changed
 - s0.initScreen() now possible with no extension installed (in chrome)
 - source textures default to one pixel when no source is specified
 - screen share working in FireFox
 - s0.clear() stops webcam and clears texture
 - removed dependency on webrtc-adapter

## [1.1.2] - 2020-04-02
### Changed
 - changed format for defining custom functions

2.0.0

- resize() function
- updates to MakeGlobal
- eval() function on hydra synth
- dynamically add functions
- need to require hydra.synth rather than just base repo
- width and height globally defined
- update function


to do:
- ShaderGenerator [WIP], runs serverside
- check for errors on eval
- add outputs (o0, etc) and sources to shader generator
