import { verify } from './verify'
import fs from 'fs'
import path from 'path'


describe('verify', () => {
  it('Returns true if given the history csv', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/history.csv'), 'utf-8')
    expect(verify(csvText)).toEqual(true)
  })

  it('Returns false if given the position csv', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/positions.csv'), 'utf-8')
    expect(verify(csvText)).toEqual(false)
  })

  it('Returns false if given some other csv', async () => {
    const csvText = await fs.readFileSync(path.resolve(__dirname, '../mockCSVs/random.csv'), 'utf-8')
    expect(verify(csvText)).toEqual(false)
  })
})