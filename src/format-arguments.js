import arrayUtils from './lib/array-utils.js'

// [WIP] how to treat different dimensions (?)
const DEFAULT_CONVERSIONS = {
  float: {
    'vec4': { name: 'sum', args: [[1, 1, 1, 1]] },
    'vec2': { name: 'sum', args: [[1, 1]] }
  }
}

function fillArrayWithDefaults(arr, len) {
  // fill the array with default values if it's too short
  while (arr.length < len) {
    if (arr.length === 3) { // push a 1 as the default for .a in vec4
      arr.push(1.0)
    } else {
      arr.push(0.0)
    }
  }
  return arr.slice(0, len)
}

const ensure_decimal_dot = (val) => {
  val = val.toString()
  if (val.indexOf('.') < 0) {
    val += '.'
  }
  return val
}



export default function formatArguments(transform, startIndex, synthContext) {
  const defaultArgs = transform.transform.inputs
  const userArgs = transform.userArgs
  const { generators } = transform.synth
  const { src } = generators // depends on synth having src() function
  return defaultArgs.map((input, index) => {
    const typedArg = {
      value: input.default,
      type: input.type, //
      isUniform: false,
      name: input.name,
      vecLen: 0
      //  generateGlsl: null // function for creating glsl
    }

    // Handle array types - copy properties from input definition
    if (input.isArrayType) {
      typedArg.isArrayType = true;
      typedArg.isArrayUniform = true;
      typedArg.arrayLength = input.arrayLength;
      typedArg.baseType = input.baseType;
      typedArg.isUniform = true;

      // Process default value for array types
      let arr = Array.isArray(input.default) ? [...input.default] : [];
      while (arr.length < input.arrayLength) {
        if (input.baseType === 'vec2') arr.push([0.0, 0.0]);
        else if (input.baseType === 'vec3') arr.push([0.0, 0.0, 0.0]);
        else if (input.baseType === 'vec4') arr.push([0.0, 0.0, 0.0, 1.0]);
        else arr.push(0.0);
      }
      arr = arr.slice(0, input.arrayLength);
      typedArg.value = arr;
    }

    if (typedArg.type === 'float') typedArg.value = ensure_decimal_dot(input.default)
    if (input.type.startsWith('vec') && !input.isArrayType) {
      try {
        typedArg.vecLen = Number.parseInt(input.type.substr(3))
      } catch (e) {
        console.log(`Error determining length of vector input type ${input.type} (${input.name})`)
      }
    }

    // if user has input something for this argument
    if (userArgs.length > index) {
      typedArg.value = userArgs[index]

      if (typedArg.type === 'vec4') {
        if (!(typedArg.value.type === "GlslSource" || typedArg.value.getTexture)) {
          throw new Error("Arguments must be a texture or GlslSource")
        }
      }
      // do something if a composite or transform

      if (typeof userArgs[index] === 'function') {
        // Check if this is an array type input with a function that returns array values
        if (input.isArrayType) {
          // For array types, the function should return an array
          // We wrap it to pad/truncate the result
          const userFunc = userArgs[index];
          const arrayLen = input.arrayLength;
          const baseType = input.baseType;

          typedArg.value = (context, props, batchId) => {
            try {
              let arr = userFunc(props);
              if (!Array.isArray(arr)) arr = [];

              // Pad with default values if too short
              while (arr.length < arrayLen) {
                if (baseType === 'vec2') arr.push([0.0, 0.0]);
                else if (baseType === 'vec3') arr.push([0.0, 0.0, 0.0]);
                else if (baseType === 'vec4') arr.push([0.0, 0.0, 0.0, 1.0]);
                else arr.push(0.0);
              }
              return arr.slice(0, arrayLen);
            } catch (e) {
              console.warn('Error in array function:', e);
              return typedArg.value; // Return current default
            }
          };
          // Note: isArrayUniform, arrayLength, baseType were already set during init
        } else {
          // Original behavior for non-array types
          typedArg.value = (context, props, batchId) => {
            try {
              const val = userArgs[index](props)
              if (typeof val === 'number') {
                return val
              } else {
                console.warn('function does not return a number', userArgs[index])
              }
              return input.default
            } catch (e) {
              console.warn('ERROR', e)
              return input.default
            }
          }
        }

        typedArg.isUniform = true
      } else if (userArgs[index].constructor === Array) {
        // Check if this input is an array type (uniform array) vs temporal sequence
        if (input.isArrayType) {
          // Handle as raw array uniform, not temporal sequence
          let arr = [...userArgs[index]]; // Clone the array
          const arrayLen = input.arrayLength;
          const baseType = input.baseType;

          // Pad with default values if too short
          while (arr.length < arrayLen) {
            if (baseType === 'vec2') arr.push([0.0, 0.0]);
            else if (baseType === 'vec3') arr.push([0.0, 0.0, 0.0]);
            else if (baseType === 'vec4') arr.push([0.0, 0.0, 0.0, 1.0]);
            else arr.push(0.0); // float or int
          }
          // Truncate if too long
          arr = arr.slice(0, arrayLen);

          typedArg.value = arr;
          typedArg.isUniform = true;
          typedArg.isArrayUniform = true;
          typedArg.arrayLength = arrayLen;
          typedArg.baseType = baseType;
        } else {
          // Original behavior: treat as temporal sequence
          typedArg.value = (context, props, batchId) => arrayUtils.getValue(userArgs[index])(props)
          typedArg.isUniform = true
        }
      }
    }

    if (startIndex < 0) {
    } else {
      if (typedArg.value && typedArg.value.transforms) {
        const final_transform = typedArg.value.transforms[typedArg.value.transforms.length - 1]

        if (final_transform.transform.glsl_return_type !== input.type) {
          const defaults = DEFAULT_CONVERSIONS[input.type]
          if (typeof defaults !== 'undefined') {
            const default_def = defaults[final_transform.transform.glsl_return_type]
            if (typeof default_def !== 'undefined') {
              const { name, args } = default_def
              typedArg.value = typedArg.value[name](...args)
            }
          }
        }

        typedArg.isUniform = false
      } else if (typedArg.type === 'float' && typeof typedArg.value === 'number') {
        typedArg.value = ensure_decimal_dot(typedArg.value)
      } else if (typedArg.type.startsWith('vec') && typeof typedArg.value === 'object' && Array.isArray(typedArg.value)) {
        typedArg.isUniform = false
        typedArg.value = `${typedArg.type}(${typedArg.value.map(ensure_decimal_dot).join(', ')})`
      } else if (input.type === 'sampler2D') {
        // typedArg.tex = typedArg.value
        var x = typedArg.value
        typedArg.value = () => (x.getTexture())
        typedArg.isUniform = true
      } else {
        // if passing in a texture reference, when function asks for vec4, convert to vec4
        if (typedArg.value.getTexture && input.type === 'vec4') {
          var x1 = typedArg.value
          typedArg.value = src(x1)
          typedArg.isUniform = false
        }
      }

      // add tp uniform array if is a function that will pass in a different value on each render frame,
      // or a texture/ external source

      if (typedArg.isUniform) {
        typedArg.name += startIndex
        //  shaderParams.uniforms.push(typedArg)
      }
    }
    return typedArg
  })
}

