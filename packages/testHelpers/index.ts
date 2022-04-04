// These functions generate mock orders and position objects for use in automated tests

type EquityType = 'stock' | 'call' | 'put'
type OrderSide = 'sell_to_open' | 'sell_to_close' | 'buy_to_open' | 'buy_to_close'
type OrderClass = 'option' | 'equity'

type MockOrderObject = {
  id: number,
  type: string,
  symbol: string,
  side: OrderSide,
  quantity: number,
  status: string,
  duration: string,
  avg_fill_price: number,
  exec_quantity: number,
  last_fill_price: number,
  last_fill_quantity: number,
  remaining_quantity: number,
  create_date: string,
  transaction_date: string,
  class: OrderClass,
  option_symbol?: string,
}

type MockPositionObject = {
  cost_basis: number,
  date_acquired: string,
  id: number,
  quantity: number,
  symbol: string,
}



export const generateSymbol = (
  symbol: string,
  type: EquityType,
  customExp: string | null = null,
  customStrike: number | null = null
) => {
  const expText = customExp ? customExp.replace(/-/g, '').slice(2) : '1234'

  let strikeText = '3214'
  if (customStrike) {
    const beforeDecimalDigits = `${customStrike}`.split('.')[0].split('')
    const afterDecimalDigits = `${customStrike}`.split('.')[1]?.split('') || []

    while (beforeDecimalDigits.length !== 5) {
      beforeDecimalDigits.unshift('0')
    }

    while (afterDecimalDigits.length !== 3) {
      afterDecimalDigits.push('0')
    }

    strikeText = beforeDecimalDigits.join('') + afterDecimalDigits.join('')
  }

  switch (type) {
  case 'stock':
    return symbol
  case 'call':
    return `${symbol}${expText}C${strikeText}`
  case 'put':
    return `${symbol}${expText}P${strikeText}`
  }
}


export const generateOrderObject = (
    symbol: string,
    quantity: number = 1,
    type: EquityType = 'stock',
    side: OrderSide = 'sell_to_open',
    status: string ='pending',
    id: number = 123456
  ) : MockOrderObject => {
  const ordClass: OrderClass = type === 'call' || type === 'put' ? 'option' : 'equity'

  const orderObj = {
    id,
    type: 'market',
    symbol,
    side,
    quantity,
    status,
    duration: 'pre',
    avg_fill_price: 0.00000000,
    exec_quantity: 0.00000000,
    last_fill_price: 0.00000000,
    last_fill_quantity: 0.00000000,
    remaining_quantity: 0.00000000,
    create_date: '2018-06-06T20:16:17.342Z',
    transaction_date: '2018-06-06T20:16:17.357Z',
    class: ordClass,
    //option_symbol: 'AAPL180720C00274000'
  }

  if (ordClass === 'option') {
    return {
      ...orderObj,
      option_symbol: generateSymbol(symbol, type)
    }
  }

  return orderObj
}


export const generatePositionObject = (
    symbol: string,
    quantity: number = 1,
    type: EquityType ='stock',
    cost_basis: number = 100,
    date_acquired: string = '2019-01-31T17:05',
    id: number = 123456
  ) : MockPositionObject =>
  ({
    cost_basis,
    date_acquired,
    id,
    quantity,
    symbol: generateSymbol(symbol, type)
  })