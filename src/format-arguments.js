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

    if (typedArg.type === 'float') typedArg.value = ensure_decimal_dot(input.default)
    if (input.type.startsWith('vec')) {
      try {
        typedArg.vecLen = Number.parseInt(input.type.substr(3))
      } catch (e) {
        console.log(`Error determining length of vector input type ${input.type} (${input.name})`)
      }
    }

    // if user has input something for this argument
    // For combine/combineCoord, the first argument in userArgs is the modulator (texture),
    // so we shift by 1 to match inputs definitions.
    const isCombine = transform.transform.type === 'combine' || transform.transform.type === 'combineCoord';
    const userArgIndex = isCombine ? index + 1 : index;

    if (userArgs.length > userArgIndex) {
      typedArg.value = userArgs[userArgIndex]

      if (typedArg.type === 'vec4') {
        if (!(typedArg.value.type === "GlslSource" || typedArg.value.getTexture || typedArg.value.transforms)) {
          throw new Error("Arguments must be a texture or GlslSource")
        }
      }
      // do something if a composite or transform

      if (typeof userArgs[userArgIndex] === 'function') {
        // if (typedArg.vecLen > 0) { // expected input is a vector, not a scalar
        //    typedArg.value = (context, props, batchId) => (fillArrayWithDefaults(userArgs[userArgIndex](props), typedArg.vecLen))
        // } else {
        typedArg.value = (context, props, batchId) => {
          try {
            const val = userArgs[userArgIndex](props)
            if (typeof val === 'number') {
              return val
            } else {
              console.warn('function does not return a number', userArgs[userArgIndex])
            }
            return input.default
          } catch (e) {
            console.warn('ERROR', e)
            return input.default
          }
        }
        //  }

        typedArg.isUniform = true
      } else if (userArgs[userArgIndex].constructor === Array) {
        //   if (typedArg.vecLen > 0) { // expected input is a vector, not a scalar
        //     typedArg.isUniform = true
        //     typedArg.value = fillArrayWithDefaults(typedArg.value, typedArg.vecLen)
        //  } else {
        //  console.log("is Array")
        // filter out values that are not a number
        // const filteredArray = userArgs[userArgIndex].filter((val) => typeof val === 'number')
        // typedArg.value = (context, props, batchId) => arrayUtils.getValue(filteredArray)(props)
        typedArg.value = (context, props, batchId) => arrayUtils.getValue(userArgs[userArgIndex])(props)
        typedArg.isUniform = true
        // }
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
      } else {
        // if passing in a texture reference, when function asks for vec4, convert to vec4
        // Also handle cases where getTexture exists but type might be inferred differently
        if (typedArg.value && typedArg.value.getTexture) {
          if (input.type === 'sampler2D') {
            var x = typedArg.value
            typedArg.value = () => (x.getTexture())
            typedArg.isUniform = true
          } else {
            // assume it should be treated as a source (vec4 color)
            var x1 = typedArg.value
            typedArg.value = src(x1)
            typedArg.isUniform = false
          }
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

