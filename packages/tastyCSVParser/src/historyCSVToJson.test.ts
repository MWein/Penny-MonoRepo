import { historyCSVToJson } from './historyCSVToJson'
import fs from 'fs'
import path from 'path'


describe('historyCSVToJson', () => {
  it('Returns empty array if given the wrong kind of csv', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/positions.csv'), 'utf-8')
    expect(historyCSVToJson(csvText)).toEqual([])
  })

  it('Returns empty array if there are no rows', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/historyEmpty.csv'), 'utf-8')
    expect(historyCSVToJson(csvText)).toEqual([])
  })

  it('Parses history csv, ignores non-Trade rows', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/history.csv'), 'utf-8')
    expect(historyCSVToJson(csvText)).toMatchSnapshot()
  })
})