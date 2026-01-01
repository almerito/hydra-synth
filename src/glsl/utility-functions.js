// functions that are only used within other functions

export default {
  _luminance: {
    type: 'util',
    glsl: `float _luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`,
    wgsl: `fn _luminance(rgb: vec3<f32>) -> f32 {
      let W = vec3<f32>(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`
  },
  _noise: {
    type: 'util',
    glsl: `
    //	Simplex 3D Noise
    //	by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float _noise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
    `,
    wgsl: `
    // Simplex 3D Noise
    // by Ian McEwan, Ashima Arts - WGSL version
    fn permute_wgsl(x: vec4<f32>) -> vec4<f32> {
      return ((x * 34.0 + 1.0) * x) % vec4<f32>(289.0);
    }
    fn taylorInvSqrt_wgsl(r: vec4<f32>) -> vec4<f32> {
      return vec4<f32>(1.79284291400159) - 0.85373472095314 * r;
    }

    fn _noise(v: vec3<f32>) -> f32 {
      let C = vec2<f32>(1.0/6.0, 1.0/3.0);
      let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

      // First corner
      var i = floor(v + dot(v, vec3<f32>(C.y, C.y, C.y)));
      let x0 = v - i + dot(i, vec3<f32>(C.x, C.x, C.x));

      // Other corners
      let g = step(x0.yzx, x0.xyz);
      let l = vec3<f32>(1.0) - g;
      let i1 = min(g.xyz, l.zxy);
      let i2 = max(g.xyz, l.zxy);

      let x1 = x0 - i1 + vec3<f32>(C.x, C.x, C.x);
      let x2 = x0 - i2 + 2.0 * vec3<f32>(C.x, C.x, C.x);
      let x3 = x0 - vec3<f32>(1.0) + 3.0 * vec3<f32>(C.x, C.x, C.x);

      // Permutations
      i = i % vec3<f32>(289.0);
      let p = permute_wgsl(permute_wgsl(permute_wgsl(
                 i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));

      // Gradients
      let n_: f32 = 1.0/7.0;
      let ns = n_ * D.wyz - D.xzx;

      let j = p - 49.0 * floor(p * ns.z * ns.z);

      let x_ = floor(j * ns.z);
      let y_ = floor(j - 7.0 * x_);

      let xx = x_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let yy = y_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let h = vec4<f32>(1.0) - abs(xx) - abs(yy);

      let b0 = vec4<f32>(xx.xy, yy.xy);
      let b1 = vec4<f32>(xx.zw, yy.zw);

      let s0 = floor(b0) * 2.0 + vec4<f32>(1.0);
      let s1 = floor(b1) * 2.0 + vec4<f32>(1.0);
      let sh = -step(h, vec4<f32>(0.0));

      let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      let a1 = b1.xzyw + s1.xzyw * sh.zzww;

      var p0 = vec3<f32>(a0.xy, h.x);
      var p1 = vec3<f32>(a0.zw, h.y);
      var p2 = vec3<f32>(a1.xy, h.z);
      var p3 = vec3<f32>(a1.zw, h.w);

      // Normalise gradients
      let norm = taylorInvSqrt_wgsl(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 = p0 * norm.x;
      p1 = p1 * norm.y;
      p2 = p2 * norm.z;
      p3 = p3 * norm.w;

      // Mix final noise value
      var m = max(vec4<f32>(0.6) - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
      m = m * m;
      return 42.0 * dot(m*m, vec4<f32>(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    `
  },


  _rgbToHsv: {
    type: 'util',
    glsl: `vec3 _rgbToHsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`,
    wgsl: `fn _rgbToHsv(c: vec3<f32>) -> vec3<f32> {
            let K = vec4<f32>(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            let p = mix(vec4<f32>(c.bg, K.wz), vec4<f32>(c.gb, K.xy), step(c.b, c.g));
            let q = mix(vec4<f32>(p.xyw, c.r), vec4<f32>(c.r, p.yzx), step(p.x, c.r));

            let d = q.x - min(q.w, q.y);
            let e: f32 = 1.0e-10;
            return vec3<f32>(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`
  },
  _hsvToRgb: {
    type: 'util',
    glsl: `vec3 _hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`,
    wgsl: `fn _hsvToRgb(c: vec3<f32>) -> vec3<f32> {
        let K = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        let p = abs(fract(vec3<f32>(c.x, c.x, c.x) + K.xyz) * 6.0 - vec3<f32>(K.w, K.w, K.w));
        return c.z * mix(vec3<f32>(K.x, K.x, K.x), clamp(p - vec3<f32>(K.x, K.x, K.x), vec3<f32>(0.0), vec3<f32>(1.0)), c.y);
    }`
  }
}
