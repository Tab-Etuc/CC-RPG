function numberFormat (num) {
  let numberFormats = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  let i
  for (i = numberFormats.length - 1; i > 0; i--) {
    if (num >= numberFormats[i].value) break
  }
  return (
    (num / numberFormats[i].value)
      .toFixed(2)
      .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + numberFormats[i].symbol
  )
}

//產生min到max之間的亂數
function getBetweenRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 產生亂數
function getRandom (x) {
  return Math.floor(Math.random() * x) + 1
}
module.exports = { numberFormat, getBetweenRandom, getRandom }
