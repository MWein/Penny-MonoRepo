import { callTradierHelper } from './callTradierHelper'

export type TimeSeries = {
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

export const getHistory = async (ticker, start, end): Promise<TimeSeries[]> => {
  const url = `markets/history?symbol=${ticker}&interval=daily&start=${start}&end=${end}`
  const timeSeries = await callTradierHelper(url, 'history', 'day', true)
  return timeSeries
}