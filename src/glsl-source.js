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
      // Replace function/variable calls in the shader's glsl code
      // We use word boundaries to avoid replacing partial matches
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
 * Parse individual GLSL items (functions, defines, consts) from a helpers string
 * Returns array of { type, name, fullCode, ...otherProps }
 */
function parseHelperItems(helpersCode) {
  const items = [];
  if (!helpersCode || typeof helpersCode !== 'string') return items;

  // 1. Parse #defines
  // Regex: start of line or space, #define, spaces, name, spaces, value (rest of line)
  const defineRegex = /^\s*#define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/gm;
  let match;
  while ((match = defineRegex.exec(helpersCode)) !== null) {
    items.push({
      type: 'define',
      name: match[1],
      value: match[2].trim(),
      fullCode: match[0].trim()
    });
  }

  // 2. Parse const/global variables
  // Regex: (optional const), type, spaces, name, spaces, =, spaces, value, ;
  // Does not handle multi-line assignments well, keeping it simple as per plan
  const varRegex = /\b(const\s+)?(float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);/g;
  while ((match = varRegex.exec(helpersCode)) !== null) {
    items.push({
      type: 'var',
      isConst: !!match[1],
      dataType: match[2],
      name: match[3],
      value: match[4].trim(),
      fullCode: match[0].trim()
    });
  }

  // 3. Parse Functions (existing logic)
  const funcRegex = /\b(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
  while ((match = funcRegex.exec(helpersCode)) !== null) {
    const returnType = match[1];
    const funcName = match[2];
    const params = match[3];
    const startIndex = match.index;
    const bodyStart = match.index + match[0].length;

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

    items.push({
      type: 'function',
      name: funcName,
      returnType,
      params,
      signature,
      body: body.trim(),
      fullCode
    });
  }

  return items;
}

/**
 * Process all helpers from transforms, handling deduplication and conflicts
 * Returns { helpers: string, renames: [{ shaderName, oldName, newName }] }
 */
function processHelpers(glslFunctions) {
  // Map: name -> { type, fullCode, ... }
  const registeredItems = new Map();
  // Track all registered names
  const allNames = new Set();
  // Track renames needed
  const renames = [];
  // Final helper code parts
  const helperParts = [];

  glslFunctions.forEach((transform) => {
    if (!transform.transform.helpers) return;

    const shaderName = transform.name;
    const parsedItems = parseHelperItems(transform.transform.helpers);

    parsedItems.forEach((item) => {
      const existing = registeredItems.get(item.name);

      if (!existing) {
        // New item, register it
        registeredItems.set(item.name, item);
        allNames.add(item.name);
        helperParts.push(item.fullCode);
      } else {
        // Item with same name exists - check if identical
        let isIdentical = false;

        if (existing.type === item.type) {
          if (item.type === 'define') {
            isIdentical = (existing.value === item.value);
          } else if (item.type === 'var') {
            isIdentical = (existing.value === item.value && existing.dataType === item.dataType);
          } else if (item.type === 'function') {
            isIdentical = (existing.signature === item.signature && existing.body === item.body);
          }
        }

        if (isIdentical) {
          // Identical, skip
          return;
        } else {
          // Conflict - rename
          let newName = `${shaderName}_${item.name}`;
          let counter = 1;
          while (allNames.has(newName)) {
            newName = `${shaderName}_${item.name}_${counter}`;
            counter++;
          }

          let renamedFullCode = item.fullCode;

          if (item.type === 'define') {
            // #define NAME VALUE -> #define NEWNAME VALUE
            // We only replace the NAME part
            renamedFullCode = item.fullCode.replace(
              new RegExp(`(#define\\s+)${item.name}(\\s+)`),
              `$1${newName}$2`
            );
          } else if (item.type === 'var') {
            // type NAME = value -> type NEWNAME = value
            // We replace "type NAME" with "type NEWNAME" to be safe
            // actually safe to just replace word boundary name before '='
            renamedFullCode = item.fullCode.replace(
              new RegExp(`\\b${item.name}\\b(\\s*=)`),
              `${newName}$1`
            );
          } else if (item.type === 'function') {
            renamedFullCode = item.fullCode.replace(
              new RegExp(`\\b${item.name}\\b`),
              newName
            );
          }

          registeredItems.set(newName, Object.assign({}, item, { name: newName, fullCode: renamedFullCode }));
          allNames.add(newName);
          helperParts.push(renamedFullCode);

          renames.push({
            shaderName,
            oldName: item.name,
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
