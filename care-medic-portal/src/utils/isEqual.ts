export default function isEqual<T>(obj1: T, obj2: T): boolean {
  const stack = [{ obj1, obj2 }]

  while (stack.length > 0) {
    const { obj1, obj2 } = stack.pop()

    // Check if both objects are null or undefined
    if (
      obj1 === null ||
      obj1 === undefined ||
      obj2 === null ||
      obj2 === undefined
    ) {
      if (obj1 !== obj2) {
        return false
      }
      continue
    }

    // Check if both objects are of the same type
    if (typeof obj1 !== typeof obj2) {
      return false
    }

    // If the objects are arrays, compare each element
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false
      }
      for (let i = 0; i < obj1.length; i++) {
        stack.push({ obj1: obj1[i], obj2: obj2[i] })
      }
      continue
    }

    // If the objects are objects, compare each key and value
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) {
        return false
      }
      for (const key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
          return false
        }
        stack.push({ obj1: obj1[key], obj2: obj2[key] })
      }
      continue
    }

    // Otherwise, compare the values directly
    if (obj1 !== obj2) {
      return false
    }
  }

  return true
}
