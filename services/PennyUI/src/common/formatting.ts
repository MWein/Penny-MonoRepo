export const round = (num: number, places: number = 2) => Number(num.toFixed(places))

export const moneyFormat = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export const moneyColor = (value: number, positiveColor: string = 'green') => {
  return value >= 0 ? positiveColor : 'red'
}

export const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]