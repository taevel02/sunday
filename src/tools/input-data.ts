const createInputData = ({ value = '', error = '' } = {}) => ({ value, error })

export const mapData = (data = {}) => {
  return Object.keys(data).reduce((obj, value) => {
    obj[value] = data[value].value
    return obj
  }, {})
}

export const copyData = (data = {}, keys = []) => {
  const result = keys.reduce((obj, key) => {
    if (data[key] instanceof createInputData) {
      obj[key] = createInputData(data[key])
    }

    return obj
  }, {})
  return result
}

export const arrayFactory = (keys = []) => {
  return keys.reduce((obj, key) => {
    obj[key] = createInputData()
    return obj
  }, {})
}
