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

  // Process uniforms, expanding array uniforms into indexed properties
  shaderInfo.uniforms.forEach((uniform) => {
    if (uniform.isArrayUniform && uniform.arrayLength) {
      // Array uniform - need to expand into indexed properties for regl
      // e.g., stops0 with value [0.1, 0.2, 0.3] becomes:
      // 'stops0[0]': 0.1, 'stops0[1]': 0.2, 'stops0[2]': 0.3

      if (typeof uniform.value === 'function') {
        // Value is a function that returns an array - create indexed accessor functions
        const fn = uniform.value;
        for (let i = 0; i < uniform.arrayLength; i++) {
          const idx = i; // Capture index for closure
          uniforms[`${uniform.name}[${idx}]`] = (context, props, batchId) => {
            const arr = fn(context, props, batchId);
            return Array.isArray(arr) && arr[idx] !== undefined ? arr[idx] : 0.0;
          };
        }
      } else if (Array.isArray(uniform.value)) {
        // Value is a static array - expand directly
        const arr = uniform.value;
        for (let i = 0; i < uniform.arrayLength; i++) {
          uniforms[`${uniform.name}[${i}]`] = arr[i] !== undefined ? arr[i] : 0.0;
        }
      } else {
        // Fallback: treat as single value, fill array with it
        for (let i = 0; i < uniform.arrayLength; i++) {
          uniforms[`${uniform.name}[${i}]`] = uniform.value || 0.0;
        }
      }
    } else {
      uniforms[uniform.name] = uniform.value;
    }
  });

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
    // Check if this is an array uniform
    if (uniform.isArrayUniform && uniform.arrayLength) {
      return `
      uniform ${uniform.baseType} ${uniform.name}[${uniform.arrayLength}];`
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

  let depth = 0;
  let currentToken = '';
  let lineStart = 0;

  // Simple state machine to parse top-level items
  // We identify: 
  // 1. #define (always single line)
  // 2. const/var declarations (terminated by ;)
  // 3. functions (terminated by })

  // Regexes for identifying pattern starts at top level
  // Function start: type name(params) {
  const funcStartRegex = /^\s*(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/;
  // Var start: (const) type name = value;
  const varStartRegex = /^\s*(const\s+)?(float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
  // Define start: #define
  const defineRegex = /^\s*#define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/;

  // Split by lines for easier #define and var scanning, 
  // but we need to handle multi-line functions carefully.
  // Actually, let's scan the string manually to handle brace nesting correctly.

  const len = helpersCode.length;
  let i = 0;

  while (i < len) {
    // Skip whitespace at current position
    while (i < len && /\s/.test(helpersCode[i])) i++;
    if (i >= len) break;

    // Check for comments
    if (helpersCode.startsWith('//', i)) {
      // Skip single line comment
      let newline = helpersCode.indexOf('\n', i);
      if (newline === -1) break;
      i = newline + 1;
      continue;
    }
    if (helpersCode.startsWith('/*', i)) {
      // Skip block comment
      let close = helpersCode.indexOf('*/', i);
      if (close === -1) break;
      i = close + 2;
      continue;
    }

    // Capture potential start of a statement
    // We scan until we hit ;, {, or newline (for #define)
    // to determine what we are looking at.

    let stmtEnd = i;
    let foundBrace = false;
    let foundSemi = false;
    let foundNewline = false;

    // Look ahead to classify
    while (stmtEnd < len) {
      const char = helpersCode[stmtEnd];
      if (char === '{') { foundBrace = true; break; }
      if (char === ';') { foundSemi = true; break; }
      if (char === '\n') { foundNewline = true; if (helpersCode[i] === '#') break; } // #define ends at newline
      stmtEnd++;
    }

    const potentialStmt = helpersCode.substring(i, stmtEnd + 1); // +1 to include delimiter

    // 1. Check for #define
    if (potentialStmt.trim().startsWith('#define')) {
      // #define continues until newline
      let newline = helpersCode.indexOf('\n', i);
      if (newline === -1) newline = len;

      const defineLine = helpersCode.substring(i, newline).trim();
      const match = defineRegex.exec(defineLine);
      if (match) {
        items.push({
          type: 'define',
          name: match[1],
          value: match[2].trim(),
          fullCode: defineLine
        });
      }
      i = newline + 1;
      continue;
    }

    // 2. Check for Function
    // If we hit a '{', it suggests a function definition signature before it
    if (foundBrace) {
      // Extract signature: text before '{'
      const signatureText = helpersCode.substring(i, stmtEnd + 1).trim(); // includes {
      // Regex check against the signature part
      const match = funcStartRegex.exec(signatureText);

      if (match) {
        // It's a function! 
        // We need to consume the body block.
        let braceCount = 1;
        let bodyI = stmtEnd + 1;
        while (bodyI < len && braceCount > 0) {
          if (helpersCode[bodyI] === '{') braceCount++;
          else if (helpersCode[bodyI] === '}') braceCount--;
          bodyI++;
        }

        const fullFuncCode = helpersCode.substring(i, bodyI);
        items.push({
          type: 'function',
          name: match[2],
          signature: `${match[1]} ${match[2]}(${match[3]})`,
          body: helpersCode.substring(stmtEnd + 1, bodyI - 1).trim(),
          fullCode: fullFuncCode
        });

        i = bodyI;
        continue;
      }
    }

    // 3. Check for Global Variable
    if (foundSemi) {
      // extract text until ;
      const varText = helpersCode.substring(i, stmtEnd + 1).trim(); // includes ;
      const match = varStartRegex.exec(varText);
      if (match) {
        // Find the full declaration including value
        // varStartRegex matches up to '=', we need the rest
        // We know it ends with ;
        const valuePart = varText.substring(varText.indexOf('=') + 1, varText.length - 1).trim();
        items.push({
          type: 'var',
          isConst: !!match[1],
          dataType: match[2],
          name: match[3],
          value: valuePart,
          fullCode: varText
        });
        i = stmtEnd + 1;
        continue;
      }
    }

    // If undefined pattern or parse error, skip token to avoid infinite loop
    // But we should try to advance past current delimiter
    i = stmtEnd + 1;
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
