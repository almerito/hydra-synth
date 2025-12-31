/*
Format for adding functions to hydra. For each entry in this file, hydra automatically generates a glsl function and javascript function with the same name. You can also add functions dynamically using setFunction(object).

{
  name: 'osc', // name that will be used to access function in js as well as in glsl
  type: 'src', // can be 'src', 'color', 'combine', 'combineCoord'. see below for more info
  inputs: [...],
  glsl: `...`,    // GLSL ES 1.0 (WebGL1)
  glsl3: `...`,   // GLSL ES 3.0 (WebGL2) - optional, falls back to glsl with texture2D->texture conversion
  wgsl: `...`     // WGSL (WebGPU) - optional
}

Types and default arguments for hydra functions.
The value in the 'type' field lets the parser know which type the function will be returned as well as default arguments.

const types = {
  'src': {
    returnType: 'vec4',
    args: [{ type: 'vec2', name: '_st' }]
  },
  'coord': {
    returnType: 'vec2',
    args: [{ type: 'vec2', name: '_st'}]
  },
  'color': {
    returnType: 'vec4',
    args: [{ type: 'vec4', name: '_c0'}]
  },
  'combine': {
    returnType: 'vec4',
    args: [
      { type: 'vec4', name: '_c0'},
      { type: 'vec4', name: '_c1'}
    ]
  },
  'combineCoord': {
    returnType: 'vec2',
    args: [
      { type: 'vec2', name: '_st'},
      { type: 'vec4', name: '_c0'},
    ]
  }
}

*/

export default () => [
  // ============================================================
  // SOURCE FUNCTIONS
  // ============================================================
  {
    name: 'noise',
    type: 'src',
    inputs: [
      { type: 'float', name: 'scale', default: 10 },
      { type: 'float', name: 'offset', default: 0.1 }
    ],
    glsl: `   return vec4(vec3(_noise(vec3(_st*scale, offset*time))), 1.0);`,
    wgsl: `   return vec4<f32>(vec3<f32>(_noise(vec3<f32>(_st*scale, offset*uniforms.time))), 1.0);`
  },
  {
    name: 'voronoi',
    type: 'src',
    inputs: [
      { type: 'float', name: 'scale', default: 5 },
      { type: 'float', name: 'speed', default: 0.3 },
      { type: 'float', name: 'blending', default: 0.3 }
    ],
    glsl: `   vec3 color = vec3(.0);
   _st *= scale;
   vec2 i_st = floor(_st);
   vec2 f_st = fract(_st);
   float m_dist = 10.;
   vec2 m_point;
   for (int j=-1; j<=1; j++ ) {
   for (int i=-1; i<=1; i++ ) {
   vec2 neighbor = vec2(float(i),float(j));
   vec2 p = i_st + neighbor;
   vec2 point = fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
   point = 0.5 + 0.5*sin(time*speed + 6.2831*point);
   vec2 diff = neighbor + point - f_st;
   float dist = length(diff);
   if( dist < m_dist ) {
   m_dist = dist;
   m_point = point;
   }
   }
   }
   color += dot(m_point,vec2(.3,.6));
   color *= 1.0 - blending*m_dist;
   return vec4(color, 1.0);`,
    wgsl: `   var color = vec3<f32>(0.0);
   let st2 = _st * scale;
   let i_st = floor(st2);
   let f_st = fract(st2);
   var m_dist: f32 = 10.0;
   var m_point: vec2<f32> = vec2<f32>(0.0);
   for (var j: i32 = -1; j <= 1; j++) {
   for (var i: i32 = -1; i <= 1; i++) {
   let neighbor = vec2<f32>(f32(i), f32(j));
   let p = i_st + neighbor;
   var point = fract(sin(vec2<f32>(dot(p,vec2<f32>(127.1,311.7)),dot(p,vec2<f32>(269.5,183.3))))*43758.5453);
   point = 0.5 + 0.5*sin(uniforms.time*speed + 6.2831*point);
   let diff = neighbor + point - f_st;
   let dist = length(diff);
   if dist < m_dist {
   m_dist = dist;
   m_point = point;
   }
   }
   }
   color += dot(m_point, vec2<f32>(0.3, 0.6));
   color *= 1.0 - blending*m_dist;
   return vec4<f32>(color, 1.0);`
  },
  {
    name: 'osc',
    type: 'src',
    inputs: [
      { type: 'float', name: 'frequency', default: 60 },
      { type: 'float', name: 'sync', default: 0.1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   vec2 st = _st;
   float r = sin((st.x-offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   float g = sin((st.x+time*sync)*frequency)*0.5 + 0.5;
   float b = sin((st.x+offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   return vec4(r, g, b, 1.0);`,
    wgsl: `   let st = _st;
   let r = sin((st.x-offset/frequency+uniforms.time*sync)*frequency)*0.5 + 0.5;
   let g = sin((st.x+uniforms.time*sync)*frequency)*0.5 + 0.5;
   let b = sin((st.x+offset/frequency+uniforms.time*sync)*frequency)*0.5 + 0.5;
   return vec4<f32>(r, g, b, 1.0);`
  },
  {
    name: 'shape',
    type: 'src',
    inputs: [
      { type: 'float', name: 'sides', default: 3 },
      { type: 'float', name: 'radius', default: 0.3 },
      { type: 'float', name: 'smoothing', default: 0.01 }
    ],
    glsl: `   vec2 st = _st * 2. - 1.;
   float a = atan(st.x,st.y)+3.1416;
   float r = (2.*3.1416)/sides;
   float d = cos(floor(.5+a/r)*r-a)*length(st);
   return vec4(vec3(1.0-smoothstep(radius,radius + smoothing + 0.0000001,d)), 1.0);`,
    wgsl: `   let st = _st * 2.0 - 1.0;
   let a = atan2(st.x, st.y) + 3.1416;
   let r = (2.0*3.1416)/sides;
   let d = cos(floor(0.5+a/r)*r-a)*length(st);
   return vec4<f32>(vec3<f32>(1.0-smoothstep(radius, radius + smoothing + 0.0000001, d)), 1.0);`
  },
  {
    name: 'gradient',
    type: 'src',
    inputs: [
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   return vec4(_st, sin(time*speed), 1.0);`,
    wgsl: `   return vec4<f32>(_st, sin(uniforms.time*speed), 1.0);`
  },
  {
    name: 'src',
    type: 'src',
    inputs: [
      { type: 'sampler2D', name: 'tex', default: NaN }
    ],
    glsl: `   return texture2D(tex, fract(_st));`,
    glsl3: `   return texture(tex, fract(_st));`,
    wgsl: `   return textureSample(tex, texSampler, fract(_st));`
  },
  {
    name: 'solid',
    type: 'src',
    inputs: [
      { type: 'float', name: 'r', default: 0 },
      { type: 'float', name: 'g', default: 0 },
      { type: 'float', name: 'b', default: 0 },
      { type: 'float', name: 'a', default: 1 }
    ],
    glsl: `   return vec4(r, g, b, a);`,
    wgsl: `   return vec4<f32>(r, g, b, a);`
  },

  // ============================================================
  // COORDINATE FUNCTIONS
  // ============================================================
  {
    name: 'rotate',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'angle', default: 10 },
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   vec2 xy = _st - vec2(0.5);
   float ang = angle + speed *time;
   xy = mat2(cos(ang),-sin(ang), sin(ang),cos(ang))*xy;
   xy += 0.5;
   return xy;`,
    wgsl: `   var xy = _st - vec2<f32>(0.5);
   let ang = angle + speed * uniforms.time;
   let c = cos(ang);
   let s = sin(ang);
   xy = mat2x2<f32>(c, s, -s, c) * xy;
   xy += 0.5;
   return xy;`
  },
  {
    name: 'scale',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'amount', default: 1.5 },
      { type: 'float', name: 'xMult', default: 1 },
      { type: 'float', name: 'yMult', default: 1 },
      { type: 'float', name: 'offsetX', default: 0.5 },
      { type: 'float', name: 'offsetY', default: 0.5 }
    ],
    glsl: `   vec2 xy = _st - vec2(offsetX, offsetY);
   xy*=(1.0/vec2(amount*xMult, amount*yMult));
   xy+=vec2(offsetX, offsetY);
   return xy;`,
    wgsl: `   var xy = _st - vec2<f32>(offsetX, offsetY);
   xy *= (1.0/vec2<f32>(amount*xMult, amount*yMult));
   xy += vec2<f32>(offsetX, offsetY);
   return xy;`
  },
  {
    name: 'pixelate',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'pixelX', default: 20 },
      { type: 'float', name: 'pixelY', default: 20 }
    ],
    glsl: `   vec2 xy = vec2(pixelX, pixelY);
   return (floor(_st * xy) + 0.5)/xy;`,
    wgsl: `   let xy = vec2<f32>(pixelX, pixelY);
   return (floor(_st * xy) + 0.5)/xy;`
  },
  {
    name: 'repeat',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'repeatX', default: 3 },
      { type: 'float', name: 'repeatY', default: 3 },
      { type: 'float', name: 'offsetX', default: 0 },
      { type: 'float', name: 'offsetY', default: 0 }
    ],
    glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) * offsetX;
   st.y += step(1., mod(st.x,2.0)) * offsetY;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x += step(1.0, st.y % 2.0) * offsetX;
   st.y += step(1.0, st.x % 2.0) * offsetY;
   return fract(st);`
  },
  {
    name: 'repeatX',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'reps', default: 3 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   vec2 st = _st * vec2(reps, 1.0);
   st.y += step(1., mod(st.x,2.0))* offset;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y += step(1.0, st.x % 2.0) * offset;
   return fract(st);`
  },
  {
    name: 'repeatY',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'reps', default: 3 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   vec2 st = _st * vec2(1.0, reps);
   st.x += step(1., mod(st.y,2.0))* offset;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(1.0, reps);
   st.x += step(1.0, st.y % 2.0) * offset;
   return fract(st);`
  },
  {
    name: 'kaleid',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'nSides', default: 4 }
    ],
    glsl: `   vec2 st = _st;
   st -= 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return r*vec2(cos(a), sin(a));`,
    wgsl: `   var st = _st - 0.5;
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi = 2.0*3.1416;
   a = a % (pi/nSides);
   a = abs(a-pi/nSides/2.0);
   return r*vec2<f32>(cos(a), sin(a));`
  },
  {
    name: 'scroll',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'scrollX', default: 0.5 },
      { type: 'float', name: 'scrollY', default: 0.5 },
      { type: 'float', name: 'speedX', default: 0 },
      { type: 'float', name: 'speedY', default: 0 }
    ],
    glsl: `
   _st.x += scrollX + time*speedX;
   _st.y += scrollY + time*speedY;
   return fract(_st);`,
    wgsl: `   var st = _st;
   st.x += scrollX + uniforms.time*speedX;
   st.y += scrollY + uniforms.time*speedY;
   return fract(st);`
  },
  {
    name: 'scrollX',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'scrollX', default: 0.5 },
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   _st.x += scrollX + time*speed;
   return fract(_st);`,
    wgsl: `   var st = _st;
   st.x += scrollX + uniforms.time*speed;
   return fract(st);`
  },
  {
    name: 'scrollY',
    type: 'coord',
    inputs: [
      { type: 'float', name: 'scrollY', default: 0.5 },
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   _st.y += scrollY + time*speed;
   return fract(_st);`,
    wgsl: `   var st = _st;
   st.y += scrollY + uniforms.time*speed;
   return fract(st);`
  },

  // ============================================================
  // COLOR FUNCTIONS
  // ============================================================
  {
    name: 'posterize',
    type: 'color',
    inputs: [
      { type: 'float', name: 'bins', default: 3 },
      { type: 'float', name: 'gamma', default: 0.6 }
    ],
    glsl: `   vec4 c2 = pow(_c0, vec4(gamma));
   c2 *= vec4(bins);
   c2 = floor(c2);
   c2/= vec4(bins);
   c2 = pow(c2, vec4(1.0/gamma));
   return vec4(c2.xyz, _c0.a);`,
    wgsl: `   var c2 = pow(_c0, vec4<f32>(gamma));
   c2 *= vec4<f32>(bins);
   c2 = floor(c2);
   c2 /= vec4<f32>(bins);
   c2 = pow(c2, vec4<f32>(1.0/gamma));
   return vec4<f32>(c2.xyz, _c0.a);`
  },
  {
    name: 'shift',
    type: 'color',
    inputs: [
      { type: 'float', name: 'r', default: 0.5 },
      { type: 'float', name: 'g', default: 0 },
      { type: 'float', name: 'b', default: 0 },
      { type: 'float', name: 'a', default: 0 }
    ],
    glsl: `   vec4 c2 = vec4(_c0);
   c2.r += fract(r);
   c2.g += fract(g);
   c2.b += fract(b);
   c2.a += fract(a);
   return vec4(c2.rgba);`,
    wgsl: `   var c2 = _c0;
   c2.r += fract(r);
   c2.g += fract(g);
   c2.b += fract(b);
   c2.a += fract(a);
   return c2;`
  },
  {
    name: 'invert',
    type: 'color',
    inputs: [
      { type: 'float', name: 'amount', default: 1 }
    ],
    glsl: `   return vec4((1.0-_c0.rgb)*amount + _c0.rgb*(1.0-amount), _c0.a);`,
    wgsl: `   return vec4<f32>((1.0-_c0.rgb)*amount + _c0.rgb*(1.0-amount), _c0.a);`
  },
  {
    name: 'contrast',
    type: 'color',
    inputs: [
      { type: 'float', name: 'amount', default: 1.6 }
    ],
    glsl: `   vec4 c = (_c0-vec4(0.5))*vec4(amount) + vec4(0.5);
   return vec4(c.rgb, _c0.a);`,
    wgsl: `   let c = (_c0-vec4<f32>(0.5))*vec4<f32>(amount) + vec4<f32>(0.5);
   return vec4<f32>(c.rgb, _c0.a);`
  },
  {
    name: 'brightness',
    type: 'color',
    inputs: [
      { type: 'float', name: 'amount', default: 0.4 }
    ],
    glsl: `   return vec4(_c0.rgb + vec3(amount), _c0.a);`,
    wgsl: `   return vec4<f32>(_c0.rgb + vec3<f32>(amount), _c0.a);`
  },
  {
    name: 'luma',
    type: 'color',
    inputs: [
      { type: 'float', name: 'threshold', default: 0.5 },
      { type: 'float', name: 'tolerance', default: 0.1 }
    ],
    glsl: `   float a = smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb));
   return vec4(_c0.rgb*a, a);`,
    wgsl: `   let a = smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb));
   return vec4<f32>(_c0.rgb*a, a);`
  },
  {
    name: 'thresh',
    type: 'color',
    inputs: [
      { type: 'float', name: 'threshold', default: 0.5 },
      { type: 'float', name: 'tolerance', default: 0.04 }
    ],
    glsl: `   return vec4(vec3(smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb))), _c0.a);`,
    wgsl: `   return vec4<f32>(vec3<f32>(smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb))), _c0.a);`
  },
  {
    name: 'color',
    type: 'color',
    inputs: [
      { type: 'float', name: 'r', default: 1 },
      { type: 'float', name: 'g', default: 1 },
      { type: 'float', name: 'b', default: 1 },
      { type: 'float', name: 'a', default: 1 }
    ],
    glsl: `   vec4 c = vec4(r, g, b, a);
   vec4 pos = step(0.0, c);
   return vec4(mix((1.0-_c0)*abs(c), c*_c0, pos));`,
    wgsl: `   let c = vec4<f32>(r, g, b, a);
   let pos = step(vec4<f32>(0.0), c);
   return mix((1.0-_c0)*abs(c), c*_c0, pos);`
  },
  {
    name: 'saturate',
    type: 'color',
    inputs: [
      { type: 'float', name: 'amount', default: 2 }
    ],
    glsl: `   const vec3 W = vec3(0.2125, 0.7154, 0.0721);
   vec3 intensity = vec3(dot(_c0.rgb, W));
   return vec4(mix(intensity, _c0.rgb, amount), _c0.a);`,
    wgsl: `   let W = vec3<f32>(0.2125, 0.7154, 0.0721);
   let intensity = vec3<f32>(dot(_c0.rgb, W));
   return vec4<f32>(mix(intensity, _c0.rgb, amount), _c0.a);`
  },
  {
    name: 'hue',
    type: 'color',
    inputs: [
      { type: 'float', name: 'hue', default: 0.4 }
    ],
    glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c.r += hue;
   return vec4(_hsvToRgb(c), _c0.a);`,
    wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c.r += hue;
   return vec4<f32>(_hsvToRgb(c), _c0.a);`
  },
  {
    name: 'colorama',
    type: 'color',
    inputs: [
      { type: 'float', name: 'amount', default: 0.005 }
    ],
    glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c += vec3(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4(c, _c0.a);`,
    wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c += vec3<f32>(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4<f32>(c, _c0.a);`
  },
  {
    name: 'r',
    type: 'color',
    inputs: [
      { type: 'float', name: 'scale', default: 1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   return vec4(_c0.r * scale + offset);`,
    wgsl: `   return vec4<f32>(_c0.r * scale + offset);`
  },
  {
    name: 'g',
    type: 'color',
    inputs: [
      { type: 'float', name: 'scale', default: 1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   return vec4(_c0.g * scale + offset);`,
    wgsl: `   return vec4<f32>(_c0.g * scale + offset);`
  },
  {
    name: 'b',
    type: 'color',
    inputs: [
      { type: 'float', name: 'scale', default: 1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   return vec4(_c0.b * scale + offset);`,
    wgsl: `   return vec4<f32>(_c0.b * scale + offset);`
  },
  {
    name: 'a',
    type: 'color',
    inputs: [
      { type: 'float', name: 'scale', default: 1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   return vec4(_c0.a * scale + offset);`,
    wgsl: `   return vec4<f32>(_c0.a * scale + offset);`
  },

  // ============================================================
  // COMBINE FUNCTIONS
  // ============================================================
  {
    name: 'add',
    type: 'combine',
    inputs: [
      { type: 'float', name: 'amount', default: 1 }
    ],
    glsl: `   return (_c0+_c1)*amount + _c0*(1.0-amount);`,
    wgsl: `   return (_c0+_c1)*amount + _c0*(1.0-amount);`
  },
  {
    name: 'sub',
    type: 'combine',
    inputs: [
      { type: 'float', name: 'amount', default: 1 }
    ],
    glsl: `   return (_c0-_c1)*amount + _c0*(1.0-amount);`,
    wgsl: `   return (_c0-_c1)*amount + _c0*(1.0-amount);`
  },
  {
    name: 'layer',
    type: 'combine',
    inputs: [],
    glsl: `   return vec4(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));`,
    wgsl: `   return vec4<f32>(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));`
  },
  {
    name: 'blend',
    type: 'combine',
    inputs: [
      { type: 'float', name: 'amount', default: 0.5 }
    ],
    glsl: `   return _c0*(1.0-amount)+_c1*amount;`,
    wgsl: `   return _c0*(1.0-amount)+_c1*amount;`
  },
  {
    name: 'mult',
    type: 'combine',
    inputs: [
      { type: 'float', name: 'amount', default: 1 }
    ],
    glsl: `   return _c0*(1.0-amount)+(_c0*_c1)*amount;`,
    wgsl: `   return _c0*(1.0-amount)+(_c0*_c1)*amount;`
  },
  {
    name: 'diff',
    type: 'combine',
    inputs: [],
    glsl: `   return vec4(abs(_c0.rgb-_c1.rgb), max(_c0.a, _c1.a));`,
    wgsl: `   return vec4<f32>(abs(_c0.rgb-_c1.rgb), max(_c0.a, _c1.a));`
  },
  {
    name: 'mask',
    type: 'combine',
    inputs: [],
    glsl: `   float a = _luminance(_c1.rgb);
  return vec4(_c0.rgb*a, a*_c0.a);`,
    wgsl: `   let a = _luminance(_c1.rgb);
   return vec4<f32>(_c0.rgb*a, a*_c0.a);`
  },

  // ============================================================
  // MODULATE FUNCTIONS
  // ============================================================
  {
    name: 'modulate',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'amount', default: 0.1 }
    ],
    glsl: `   return _st + _c0.xy*amount;`,
    wgsl: `   return _st + _c0.xy*amount;`
  },
  {
    name: 'modulateScale',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'multiple', default: 1 },
      { type: 'float', name: 'offset', default: 1 }
    ],
    glsl: `   vec2 xy = _st - vec2(0.5);
   xy*=(1.0/vec2(offset + multiple*_c0.r, offset + multiple*_c0.g));
   xy+=vec2(0.5);
   return xy;`,
    wgsl: `   var xy = _st - vec2<f32>(0.5);
   xy *= (1.0/vec2<f32>(offset + multiple*_c0.r, offset + multiple*_c0.g));
   xy += vec2<f32>(0.5);
   return xy;`
  },
  {
    name: 'modulatePixelate',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'multiple', default: 10 },
      { type: 'float', name: 'offset', default: 3 }
    ],
    glsl: `   vec2 xy = vec2(offset + _c0.x*multiple, offset + _c0.y*multiple);
   return (floor(_st * xy) + 0.5)/xy;`,
    wgsl: `   let xy = vec2<f32>(offset + _c0.x*multiple, offset + _c0.y*multiple);
   return (floor(_st * xy) + 0.5)/xy;`
  },
  {
    name: 'modulateRotate',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'multiple', default: 1 },
      { type: 'float', name: 'offset', default: 0 }
    ],
    glsl: `   vec2 xy = _st - vec2(0.5);
   float angle = offset + _c0.x * multiple;
   xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
   xy += 0.5;
   return xy;`,
    wgsl: `   var xy = _st - vec2<f32>(0.5);
   let angle = offset + _c0.x * multiple;
   let c = cos(angle);
   let s = sin(angle);
   xy = mat2x2<f32>(c, s, -s, c) * xy;
   xy += 0.5;
   return xy;`
  },
  {
    name: 'modulateHue',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'amount', default: 1 }
    ],
    glsl: `   return _st + (vec2(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0/resolution);`,
    wgsl: `   return _st + (vec2<f32>(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0/uniforms.resolution);`
  },
  {
    name: 'modulateKaleid',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'nSides', default: 4 }
    ],
    glsl: `   vec2 st = _st - 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return (_c0.r+r)*vec2(cos(a), sin(a));`,
    wgsl: `   let st = _st - 0.5;
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi = 2.0*3.1416;
   a = a % (pi/nSides);
   a = abs(a-pi/nSides/2.0);
   return (_c0.r+r)*vec2<f32>(cos(a), sin(a));`
  },
  {
    name: 'modulateRepeat',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'repeatX', default: 3 },
      { type: 'float', name: 'repeatY', default: 3 },
      { type: 'float', name: 'offsetX', default: 0.5 },
      { type: 'float', name: 'offsetY', default: 0.5 }
    ],
    glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offsetX;
   st.y += step(1., mod(st.x,2.0)) + _c0.g * offsetY;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x += step(1.0, st.y % 2.0) + _c0.r * offsetX;
   st.y += step(1.0, st.x % 2.0) + _c0.g * offsetY;
   return fract(st);`
  },
  {
    name: 'modulateRepeatX',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'reps', default: 3 },
      { type: 'float', name: 'offset', default: 0.5 }
    ],
    glsl: `   vec2 st = _st * vec2(reps, 1.0);
   st.y += step(1., mod(st.x,2.0)) + _c0.r * offset;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y += step(1.0, st.x % 2.0) + _c0.r * offset;
   return fract(st);`
  },
  {
    name: 'modulateRepeatY',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'reps', default: 3 },
      { type: 'float', name: 'offset', default: 0.5 }
    ],
    glsl: `   vec2 st = _st * vec2(reps, 1.0);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offset;
   return fract(st);`,
    wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.x += step(1.0, st.y % 2.0) + _c0.r * offset;
   return fract(st);`
  },
  {
    name: 'modulateScrollX',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'scrollX', default: 0.5 },
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   _st.x += _c0.r*scrollX + time*speed;
   return fract(_st);`,
    wgsl: `   var st = _st;
   st.x += _c0.r*scrollX + uniforms.time*speed;
   return fract(st);`
  },
  {
    name: 'modulateScrollY',
    type: 'combineCoord',
    inputs: [
      { type: 'float', name: 'scrollY', default: 0.5 },
      { type: 'float', name: 'speed', default: 0 }
    ],
    glsl: `   _st.y += _c0.r*scrollY + time*speed;
   return fract(_st);`,
    wgsl: `   var st = _st;
   st.y += _c0.r*scrollY + uniforms.time*speed;
   return fract(st);`
  },

  // ============================================================
  // SPECIAL FUNCTIONS
  // ============================================================
  {
    name: 'prev',
    type: 'src',
    inputs: [],
    glsl: `   return texture2D(prevBuffer, fract(_st));`,
    glsl3: `   return texture(prevBuffer, fract(_st));`,
    wgsl: `   return textureSample(prevBuffer, prevBufferSampler, fract(_st));`
  },
  {
    name: 'sum',
    type: 'color',
    inputs: [
      { type: 'vec4', name: 'scale', default: 1 }
    ],
    glsl: `   vec4 v = _c0 * s;
   return v.r + v.g + v.b + v.a;
   }
   float sum(vec2 _st, vec4 s) {
   vec2 v = _st.xy * s.xy;
   return v.x + v.y;`,
    wgsl: `   let v = _c0 * scale;
   return vec4<f32>(v.r + v.g + v.b + v.a);`
  }
]
