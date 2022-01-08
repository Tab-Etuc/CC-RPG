/**
 * Create a discord emoji bar
 * @param {Number} value - The value to fill the bar
 * @param {Number} maxValue - The max value of the bar
 * @return {{Bar: string, percentageText: string}} - The bar
 */
// 功力不足，待補
module.exports = (value, maxValue, type) => {
  const a1X = '<:e:919425301061173259>',
    aX = '<:e:919425301203800114>',
    a2X = '<:e_:919425301392523295>'
  let a1O
  let aO
  let a2O
  switch (type) {
    case 'HP':
      a1O = '<a:HP:919449618218119228>'
      aO = '<a:HP2:919451860891500634>'
      a2O = '<a:HP3:919458260698927114>'
      break
    case 'MP':
      a1O = '<a:MP:919462246889955349>'
      aO = '<a:MP2:919462247091286056>'
      a2O = '<a:MP3:919462246583787562>'
  }
  const percentage = value / maxValue
  let progress = Math.round(9 * percentage)
  let a1
  let a2
  let emptyProgress = 9 - progress
  if (progress >= 1) {
    a1 = a1O
    progress -= 1
  } else {
    a1 = a1X
    emptyProgress -= 1
  }
  emptyProgress == 0 ? (a2 = a2O) : (a2 = a2X)
  const progressText = aO.repeat(progress),
    emptyProgressText = aX.repeat(emptyProgress),
    percentageText = Math.round(percentage * 100) + '%',
    Bar = a1 + progressText + emptyProgressText + a2
  return { Bar, percentageText }
}
