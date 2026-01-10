import Hydra from '../src/hydra-synth.js';

export {
  fugitiveGeometry,
  exampleVideo,
  exampleResize,
  nonGlobalCanvas,
  exampleHelpers,
  exampleHelpersConstants,
  exampleArrayUniforms
};

function exampleResize() {
  window.addEventListener('resize', () => {
    setResolution(window.innerWidth, window.innerHeight)
    console.log('width', width, window.innerWidth)
  })
}

// from :
// not working on updated hydra-synth
function fugitiveGeometry2() {
  s = () =>
    shape(4)
      .scrollX([-0.5, -0.2, 0.3, -0.1, -0.1].smooth(0.1).fast(0.3))
      .scrollY([0.25, -0.2, 0.3, -0.1, 0.2].smooth(0.9).fast(0.15))

  //s().out()
  // //
  solid()
    .add(gradient(3, 0.05).rotate(0.05, -0.2).posterize(2).contrast(0.6), [1, 0, 1, 0.5, 0, 0.6].smooth(0.9))
    .add(s())
    .mult(s().scale(0.8).scrollX(0.01).scrollY(-0.01).rotate(0.2, 0.06).add(gradient(3).contrast(0.6), [1, 0, 1, 0.5].smooth(0.9), 0.5).mult(src(o0).scale(0.98), () => a.fft[0] * 9)
    )
    // .diff(s().modulate(shape(500)).scale([1.7,1.2].smooth(0.9).fast(0.05)))
    // .add(gradient(2).invert(),()=>a.fft[2])
    // .mult(gradient(()=>a.fft[3]*8))
    // .blend(src((o0),()=>a.fft[1]*40))
    // .add(voronoi(()=>a.fft[1],()=>a.fft[3],()=>a.fft[0]).thresh(0.7).posterize(2,4).luma(0.9).scrollY(1,()=>a.fft[0]/30).colorama(3).thresh(()=>a.fft[1]).scale(()=>a.fft[3]*2),()=>a.fft[0]/2)
    .out()
  // //
  // speed= 1
}

function fugitiveGeometry() {
  s = () =>
    shape(4)
      .scrollX([-0.5, -0.2, 0.3, -0.1, -0.1].smooth(0.1).fast(0.3))
      .scrollY([0.25, -0.2, 0.3, -0.1, 0.2].smooth(0.9).fast(0.15))
  //
  solid()
    .add(gradient(3, 0.05).rotate(0.05, -0.2).posterize(2).contrast(0.6), [1, 0, 1, 0.5, 0, 0.6].smooth(0.9))
    .add(s())
    .mult(s().scale(0.8).scrollX(0.01).scrollY(-0.01).rotate(0.2, 0.06).add(gradient(3).contrast(0.6), [1, 0, 1, 0.5].smooth(0.9), 0.5).mult(src(o0).scale(0.98), () => a.fft[0] * 9)
    )
    .diff(s().modulate(shape(500)).scale([1.7, 1.2].smooth(0.9).fast(0.05)))
    .add(gradient(2).invert(), () => a.fft[2])
    .mult(gradient(() => a.fft[3] * 8))
    .blend(src((o0), () => a.fft[1] * 40))
    .add(voronoi(() => a.fft[1], () => a.fft[3], () => a.fft[0]).thresh(0.7).posterize(2, 4).luma(0.9).scrollY(1, () => a.fft[0] / 30).colorama(3).thresh(() => a.fft[1]).scale(() => a.fft[3] * 2), () => a.fft[0] / 2)
    .out()
  //
  speed = 1
  a.setSmooth(0.96)
}
function exampleMultipleMasks() {
  setFunction({
    name: 'mask2',
    type: 'combine',
    inputs: [
    ],
    glsl:
      `   float a = _luminance(_c1.rgb);
     return vec4(_c0.rgb*a, a*_c0.a);`
  })

  gradient().layer(osc().luma().mask(noise(3))).out()
  gradient().layer(osc().luma().mask2(noise(3))).out(o1)
  render()
}
function exampleMultipleCanvases(num = 2) {
  for (var i = 0; i < num; i++) {
    nonGlobalCanvas()
  }
}

function nonGlobalCanvas() {
  const div = document.createElement('div')
  const canvas = document.createElement('canvas')
  canvas.style.backgroundColor = "#000"
  canvas.width = 800
  canvas.height = 200
  div.appendChild(canvas)
  document.body.appendChild(div)

  // canvas.style.width = '100%'
  // canvas.style.height = '100%'
  //  exampleCustomCanvas()
  const hydra = new Hydra({
    //detectAudio:false, 
    autoLoop: false,
    canvas: canvas,
    makeGlobal: false
  }).synth
  const { osc, o0, s0, src, noise } = hydra
  osc().rotate().blend(noise().repeat(), 0.99).out()
  window.c1 = hydra
  setInterval(() => {
    hydra.tick(1000)
  }, 1000)
}

function exampleLoadScript() {
  (async () => {
    await loadScript("https://unpkg.com/tone")
    console.log('loaded script!!')
  })()
}

function exampleCamera() {
  s0.initCam()
  src(s0).out()
}

function exampleVideo() {
  s0.initVideo("https://media.giphy.com/media/26ufplp8yheSKUE00/giphy.mp4", { flipY: false })
  src(s0).out()
}

function exampleEasingFunctions() {
  //  //
  //  // // Example array sequences
  //  // shape([4, 5, 3]).out()
  //  //
  //  // // array easing
  //  // shape([4, 3, 2].ease('easeInQuad')).out()
  //  //
  //  // // array smoothing
  //  // shape([4, 3, 2].smooth()).out()
}

// fixing smoothstep issue so that 0 is not passed as a parameter
function exampleSmoothstep() {
  shape(4, 0.3, 0.01).out()
  shape(4, 0.5, 0).out()
  osc(89, 0.01, 1.8).luma(0.5, 0).out()
  osc(89, 0.01, 1.8).thresh(0.5, 0).out()
}



function exampleNonGlobal() {
  const hydra = new Hydra({ makeGlobal: false, detectAudio: false })
  console.log('instance', hydra)
  const h = hydra.synth
  h.osc().diff(h.shape()).out()
  h.gradient().out(h.o1)
  h.render()

  const h2 = new Hydra({ makeGlobal: false, detectAudio: false }).synth
  h2.shape(4).diff(h2.osc(2, 0.1, 1.2)).out()
}

function exampleExtendTransforms() {
  var hydra = new Hydra({
    extendTransforms: {
      name: 'myOsc', // name that will be used to access function as well as within glsl
      type: 'src', // can be src: vec4(vec2 _st), coord: vec2(vec2 _st), color: vec4(vec4 _c0), combine: vec4(vec4 _c0, vec4 _c1), combineCoord: vec2(vec2 _st, vec4 _c0)
      inputs: [
        {
          name: 'freq',
          type: 'float', // 'float'   //, 'texture', 'vec4'
          default: 0.2
        },
        {
          name: 'sync',
          type: 'float',
          default: 0.1
        },
        {
          name: 'offset',
          type: 'float',
          default: 0.0
        }
      ], glsl: `
         vec2 st = _st;
        float r = sin((st.x-offset*20./freq-time*sync)*freq)*0.5  + 0.5;
        float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
        float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
        return vec4(r, g, b, 1.0);
       `}
  })
  myOsc(10, 0.2, 0.8).out()

}

function exampleImage() {
  s0.initImage("https://upload.wikimedia.org/wikipedia/commons/2/25/Hydra-Foto.jpg")
  src(s0).out()
}

function exampleAddFunction(hydra) {
  // example custom function
  setFunction({
    name: 'myOsc', // name that will be used to access function as well as within glsl
    type: 'src', // can be src: vec4(vec2 _st), coord: vec2(vec2 _st), color: vec4(vec4 _c0), combine: vec4(vec4 _c0, vec4 _c1), combineCoord: vec2(vec2 _st, vec4 _c0)
    inputs: [
      {
        name: 'freq',
        type: 'float', // 'float'   //, 'texture', 'vec4'
        default: 0.2
      },
      {
        name: 'sync',
        type: 'float',
        default: 0.1
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ], glsl: `
    vec2 st = _st;
   float r = sin((st.x-offset*20./freq-time*sync)*freq)*0.5  + 0.5;
   float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
   float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
   return vec4(r, g, b, 1.0);
  `})

  myOsc(10, 0.2, 0.8).out()
  //
  //  // ooo(10, 0.01, 1.2).blur().out()
}

function exampleScreen() {
  s0.initScreen()
  //src(s0).out()
}

function exampleGetGLSL() {
  src(s0).blend(o0).glsl()
}

function exampleCustomCanvas() {
  const canvas = document.createElement('canvas')
  canvas.style.backgroundColor = "#000"
  canvas.width = 800
  canvas.height = 200

  canvas.style.width = '100%'
  canvas.style.height = '100%'

  //canvas.style.imageRe

  var ctx = canvas.getContext('2d')
  ctx.moveTo(0, 0);
  ctx.lineTo(200, 100);
  ctx.stroke();

  s0.init({ src: canvas })
}


function exampleSmoothing() {
  var shapes = [
    shape(4)
      .scale(1, 0.5, [0.5, 1, 2])
      .scrollX(0.3),
    shape(4)
      .scale(1, 0.5, [0.5, 1, 2].smooth(0.5))
      .scrollX(0.0),
    shape(4)
      .scale(1, 0.5, [0.5, 1, 2].smooth())
      .scrollX(-0.3),
  ]

  solid()
    .add(shapes[0])
    .add(shapes[1])
    .add(shapes[2])
    .out(o0)
}

function exampleSetResolution() {
  setResolution(20, 20)
}

// Example demonstrating the new helpers feature for nested shader functions
// This tests: deduplication, conflict resolution, and automatic renaming
function exampleHelpers() {
  // Shader 1: uses noise3d and rotate
  setFunction({
    name: 'coolShader',
    type: 'src',
    inputs: [],
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

  // Shader 2: uses noise3d (DIFFERENT implementation!) and the same rotate
  // - noise3d will be renamed to otherShader_noise3d
  // - rotate is identical, so it will be reused
  setFunction({
    name: 'otherShader',
    type: 'src',
    inputs: [],
    helpers: `
      float noise3d(vec3 p) { 
        // Different implementation - creates stripes instead of dots
        return fract(sin(p.x * 100.0 + p.y * 50.0 + p.z) * 43758.5453); 
      }
      
      vec2 rotate(vec2 p, float a) { 
        float c = cos(a), s = sin(a);
        return vec2(p.x*c - p.y*s, p.x*s + p.y*c);
      }
    `,
    glsl: `
      vec2 st = rotate(_st - 0.5, time * 0.5) + 0.5;
      float n = noise3d(vec3(st * 5.0, time));
      return vec4(n, n * 0.5, n * 0.2, 1.0);
    `
  });

  // Blend both shaders - this will trigger the helper processing
  // coolShader uses original noise3d, otherShader uses otherShader_noise3d
  coolShader().blend(otherShader(), 0.5).out();
}

// Example verifying constants and defines in helpers
function exampleHelpersConstants() {
  // Shader 1: Defines PI and SCALE (1.0)
  setFunction({
    name: 'circle1',
    type: 'src',
    inputs: [],
    helpers: `
      #define PI 3.14159
      #define SCALE 1.0
      const float INTENSITY = 0.5;
      
      float getCircle(vec2 st, float s) {
        return smoothstep(s, s-0.01, length(st));
      }
    `,
    glsl: `
      vec2 st = _st - 0.5;
      return vec4(vec3(getCircle(st, SCALE * 0.3) * INTENSITY), 1.0);
    `
  });

  // Shader 2: Defines PI (Identical), SCALE (2.0 - Conflict), INTENSITY (1.0 - Conflict)
  setFunction({
    name: 'circle2',
    type: 'src',
    inputs: [],
    helpers: `
      #define PI 3.14159
      #define SCALE 0.5
      const float INTENSITY = 1.0;
      
      float getCircle(vec2 st, float s) {
        return smoothstep(s, s-0.01, length(st));
      }
    `,
    glsl: `
      vec2 st = _st - 0.5;
      // Should use renamed SCALE (e.g. circle2_SCALE) and INTENSITY
      return vec4(vec3(getCircle(st, SCALE * 0.3) * INTENSITY), 1.0);
    `
  });

  // circle1 should be smaller and dimmer
  // circle2 should be larger and brighter
  circle1().add(circle2().scrollX(0.5)).out();
}

// Test for GLSL array uniforms (float[], vec2[], etc.)
function exampleArrayUniforms() {
  // Example 1: Basic float array - gradient with custom stops
  setFunction({
    name: 'gradientStops',
    type: 'src',
    inputs: [
      { name: 'stops', type: 'float[]', length: 5, default: [0.0, 0.25, 0.5, 0.75, 1.0] }
    ],
    glsl: `
      // Use array values to create a stepped gradient
      float x = _st.x;
      float v = 0.0;
      if (x < 0.25) v = mix(stops[0], stops[1], x * 4.0);
      else if (x < 0.5) v = mix(stops[1], stops[2], (x - 0.25) * 4.0);
      else if (x < 0.75) v = mix(stops[2], stops[3], (x - 0.5) * 4.0);
      else v = mix(stops[3], stops[4], (x - 0.75) * 4.0);
      return vec4(vec3(v), 1.0);
    `
  });

  // Example 2: vec3 array - color palette
  setFunction({
    name: 'colorPalette',
    type: 'src',
    inputs: [
      { name: 'colors', type: 'vec3[4]', default: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0]] }
    ],
    glsl: `
      int idx = int(_st.x * 4.0);
      if (idx > 3) idx = 3;
      vec3 col = colors[idx];
      return vec4(col, 1.0);
    `
  });

  // Test the gradientStops function with custom values
  gradientStops([0.1, 0.3, 0.5, 0.7, 0.9]).out();
}