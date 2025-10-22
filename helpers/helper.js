function toTitleCase(str) {
  const words = str.toLowerCase().split(' ')
  const capitalized = words.map(el => {
    if (el === 'dan') {
      return el
    }
    return el.charAt(0).toUpperCase() + el.slice(1)
  })
  return capitalized.join(' ')
}

module.exports = { toTitleCase }

