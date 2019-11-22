export function toMoney (money = 0) {
  let m = parseFloat(money) || 0
  return m.toFixed(2)
}

export function toTime (timeData) {
  if (timeData !== '') {
    let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(timeData)
    return newDate
  }
}
