import generateGlsl from './generate-glsl.js'
// const formatArguments = require('./glsl-utils.js').formatArguments

// const glslTransforms = require('./glsl/composable-glsl-functions.js')
import utilityGlsl from './glsl/utility-functions.js'

var GlslSource = function (obj) {
  this.transforms = []
  this.transforms.push(obj)
  this.defaultOutput = obj.defaultOutput
  this.synth = obj.synth
  this.type = 'GlslSource'
  this.defaultUniforms = obj.defaultUniforms
  return this
}

GlslSource.prototype.addTransform = function (obj) {
  this.transforms.push(obj)
}

GlslSource.prototype.out = function (_output) {
  var output = _output || this.defaultOutput

  // output.renderPasses(glsl)
  if (output) try {
    var glsl = this.glsl(output)
    this.synth.currentFunctions = []
    output.render(glsl)
  } catch (error) {
    console.warn('shader could not compile', error)
  }
}

GlslSource.prototype.glsl = function () {
  //var output = _output || this.defaultOutput
  var self = this
  // uniforms included in all shaders
  //  this.defaultUniforms = output.uniforms
  var passes = []
  var transforms = []
  //  console.log('output', output)
  this.transforms.forEach((transform) => {
    if (transform.transform.type === 'renderpass') {
      // if (transforms.length > 0) passes.push(this.compile(transforms, output))
      // transforms = []
      // var uniforms = {}
      // const inputs = formatArguments(transform, -1)
      // inputs.forEach((uniform) => { uniforms[uniform.name] = uniform.value })
      //
      // passes.push({
      //   frag: transform.transform.frag,
      //   uniforms: Object.assign({}, self.defaultUniforms, uniforms)
      // })
      // transforms.push({name: 'prev', transform:  glslTransforms['prev'], synth: this.synth})
      console.warn('no support for renderpass')
    } else {
      transforms.push(transform)
    }
  })

  if (transforms.length > 0) passes.push(this.compile(transforms))

  return passes
}

GlslSource.prototype.compile = function (transforms) {
  var shaderInfo = generateGlsl(transforms, this.synth)
  var uniforms = {}
  shaderInfo.uniforms.forEach((uniform) => { uniforms[uniform.name] = uniform.value })

  // Process helpers with smart deduplication and conflict resolution
  const helpersResult = processHelpers(shaderInfo.glslFunctions);

  // Update shader glsl code with renamed function references
  helpersResult.renames.forEach(({ shaderName, oldName, newName }) => {
    const transform = shaderInfo.glslFunctions.find(t => t.name === shaderName);
    if (transform && transform.transform) {
      // Replace function calls in the shader's glsl code
      const regex = new RegExp(`\\b${oldName}\\b`, 'g');
      transform.transform.glsl = transform.transform.glsl.replace(regex, newName);
    }
  });

  var frag = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(shaderInfo.uniforms).map((uniform) => {
    let type = uniform.type
    switch (uniform.type) {
      case 'texture':
        type = 'sampler2D'
        break
    }
    return `
      uniform ${type} ${uniform.name};`
  }).join('')}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(utilityGlsl).map((transform) => {
    //  console.log(transform.glsl)
    return `
            ${transform.glsl}
          `
  }).join('')}

  ${helpersResult.helpers}

  ${shaderInfo.glslFunctions.map((transform) => {
    return `
            ${transform.transform.glsl}
          `
  }).join('')}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${shaderInfo.fragColor}
    fragColor = c;
  }
  `

  return {
    frag: frag,
    uniforms: Object.assign({}, this.defaultUniforms, uniforms)
  }

}

/**
 * Parse individual GLSL functions from a helpers string
 * Returns array of { name, signature, body, fullCode }
 */
function parseGlslFunctions(helpersCode) {
  const functions = [];
  if (!helpersCode || typeof helpersCode !== 'string') return functions;

  // Regex to match GLSL function definitions
  // Matches: returnType functionName(params) { body }
  const funcRegex = /\b(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;

  let match;
  while ((match = funcRegex.exec(helpersCode)) !== null) {
    const returnType = match[1];
    const funcName = match[2];
    const params = match[3];
    const startIndex = match.index;
    const bodyStart = match.index + match[0].length;

    // Find matching closing brace (handle nested braces)
    let braceCount = 1;
    let i = bodyStart;
    while (i < helpersCode.length && braceCount > 0) {
      if (helpersCode[i] === '{') braceCount++;
      else if (helpersCode[i] === '}') braceCount--;
      i++;
    }

    const body = helpersCode.substring(bodyStart, i - 1);
    const fullCode = helpersCode.substring(startIndex, i);
    const signature = `${returnType} ${funcName}(${params})`;

    functions.push({
      name: funcName,
      returnType,
      params,
      signature,
      body: body.trim(),
      fullCode
    });
  }

  return functions;
}

/**
 * Process all helpers from transforms, handling deduplication and conflicts
 * Returns { helpers: string, renames: [{ shaderName, oldName, newName }] }
 */
function processHelpers(glslFunctions) {
  // Map: functionName -> { signature, body, fullCode }
  const registeredFunctions = new Map();
  // Track all registered names (including renamed ones) to ensure uniqueness
  const allNames = new Set();
  // Track renames needed: { shaderName, oldName, newName }
  const renames = [];
  // Final helper code parts
  const helperParts = [];

  glslFunctions.forEach((transform) => {
    if (!transform.transform.helpers) return;

    const shaderName = transform.name;
    const parsedFunctions = parseGlslFunctions(transform.transform.helpers);

    parsedFunctions.forEach((func) => {
      const existing = registeredFunctions.get(func.name);

      if (!existing) {
        // New function, register it
        registeredFunctions.set(func.name, {
          signature: func.signature,
          body: func.body,
          fullCode: func.fullCode
        });
        allNames.add(func.name);
        helperParts.push(func.fullCode);
      } else {
        // Function with same name exists - check if identical
        if (existing.signature === func.signature && existing.body === func.body) {
          // Identical function, skip (shader will use the existing one)
          return;
        } else {
          // Different function with same name - need to rename
          let newName = `${shaderName}_${func.name}`;

          // Ensure the new name is unique
          let counter = 1;
          while (allNames.has(newName)) {
            newName = `${shaderName}_${func.name}_${counter}`;
            counter++;
          }

          // Register the renamed function
          const renamedFullCode = func.fullCode.replace(
            new RegExp(`\\b${func.name}\\b`),
            newName
          );

          registeredFunctions.set(newName, {
            signature: func.signature.replace(func.name, newName),
            body: func.body,
            fullCode: renamedFullCode
          });
          allNames.add(newName);
          helperParts.push(renamedFullCode);

          // Track the rename so we can update shader code
          renames.push({
            shaderName,
            oldName: func.name,
            newName
          });
        }
      }
    });
  });

  return {
    helpers: helperParts.join('\n\n'),
    renames
  };
}

export default GlslSource
