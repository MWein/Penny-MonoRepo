import { logModel, cronModel } from '@penny/db-models'
jest.mock('@penny/db-models')

import {
  _logWithObject,
  _logWithMessage,
  log,
  logCron,
  getLogs,
  getCronLogs,
  clearOldLogs
} from './index'


describe('_logWithObject', () => {
  const originalConsoleLog = console.log
  let saveFunc

  beforeEach(() => {
    saveFunc = jest.fn()
    // @ts-ignore
    logModel.mockReturnValue({
      save: saveFunc,
    })
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('On failure, console logs', async () => {
    // @ts-ignore
    logModel.mockImplementation(() => {
      throw new Error('Oh no!!!!!!')
    })
    await _logWithObject({ message: 'something' })
    expect(logModel).toHaveBeenCalledWith({ message: 'something' })
    expect(console.log).toHaveBeenCalledWith('Error reaching database')
  })

  it('On success, saves and console logs the message', async () => {
    await _logWithObject({ type: 'error', message: 'something' })
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ type: 'error', message: 'something' })
    expect(console.log).toHaveBeenCalledWith('error', ':', 'something')
  })

  it('Does not console log if type is \'ping\'', async () => {
    await _logWithObject({ type: 'ping', message: 'something' })
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ type: 'ping', message: 'something' })
    expect(console.log).not.toHaveBeenCalled()
  })

  it('Console log says \'info\' if type is not provided', async () => {
    await _logWithObject({ message: 'something' })
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ message: 'something' })
    expect(console.log).toHaveBeenCalledWith('info', ':', 'something')
  })
})


describe('_logWithMessage', () => {
  const originalConsoleLog = console.log
  let saveFunc

  beforeEach(() => {
    saveFunc = jest.fn()
    // @ts-ignore
    logModel.mockReturnValue({
      save: saveFunc,
    })
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('On failure, console logs', async () => {
    // @ts-ignore
    logModel.mockImplementation(() => {
      throw new Error('Oh no!!!!!!')
    })
    await _logWithMessage('something')
    expect(logModel).toHaveBeenCalledWith({ message: 'something' })
    expect(console.log).toHaveBeenCalledWith('Error reaching database')
  })

  it('On success, saves and console logs the message', async () => {
    await _logWithMessage('something')
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ message: 'something' })
    expect(console.log).toHaveBeenCalledWith('info', ':', 'something')
  })
})


describe('log', () => {
  const originalConsoleLog = console.log
  let saveFunc

  beforeEach(() => {
    saveFunc = jest.fn()
    // @ts-ignore
    logModel.mockReturnValue({
      save: saveFunc,
    })
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('Calls correct function if given an object', async () => {
    await log({ type: 'info', message: 'something' })
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ type: 'info', message: 'something' })
    expect(console.log).toHaveBeenCalledWith('info', ':', 'something')
  })

  it('Calls correct function if given a string', async () => {
    await log('something')
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(logModel).toHaveBeenCalledWith({ message: 'something' })
    expect(console.log).toHaveBeenCalledWith('info', ':', 'something')
  })
})


describe('logCron', () => {
  const originalConsoleLog = console.log
  let saveFunc

  beforeEach(() => {
    saveFunc = jest.fn()
    // @ts-ignore
    cronModel.mockReturnValue({
      save: saveFunc,
    })
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('Saves the log with an error message', async () => {
    await logCron('CloseExp', false, 'Something happened')
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(cronModel).toHaveBeenCalledWith({
      cronName: 'CloseExp',
      success: false,
      errorMessage: 'Something happened'
    })
  })

  it('Saves the log without an error message', async () => {
    await logCron('CloseExp', true)
    expect(saveFunc).toHaveBeenCalledTimes(1)
    expect(cronModel).toHaveBeenCalledWith({
      cronName: 'CloseExp',
      success: true,
    })
  })

  it('On failure, console logs', async () => {
    // @ts-ignore
    cronModel.mockImplementation(() => {
      throw new Error('Oh no!!!!!!')
    })
    await logCron('CloseExp', true)
    expect(cronModel).toHaveBeenCalledWith({
      cronName: 'CloseExp',
      success: true,
    })
    expect(console.log).toHaveBeenCalledWith('Error reaching database')
  })
})


describe('getLogs', () => {
  it('Gets the logs', async () => {
    const select = jest.fn()
    const sort = jest.fn().mockReturnValue({
      select,
    })
    logModel.find = jest.fn().mockReturnValue({
      sort,
    })

    select.mockReturnValue([
      'some',
      'logs'
    ])

    const result = await getLogs()
    expect(result).toEqual([
      'some',
      'logs'
    ])
  })
})


describe('getCronLogs', () => {
  it('Gets the cron logs', async () => {
    const select = jest.fn()
    const sort = jest.fn().mockReturnValue({
      select,
    })
    cronModel.find = jest.fn().mockReturnValue({
      sort,
    })

    select.mockReturnValue([
      'some',
      'logs'
    ])

    const result = await getCronLogs()
    expect(result).toEqual([
      'some',
      'logs'
    ])
  })
})


describe('clearOldLogs', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
    logModel.deleteMany = jest.fn()
    cronModel.deleteMany = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
    jest.useRealTimers()
  })

  it('Console logs on logModel failure', async () => {
    // @ts-ignore
    logModel.deleteMany.mockImplementation(() => {
      throw new Error('Shit')
    })
    await clearOldLogs()
    expect(console.log).toHaveBeenCalledWith('Error reaching database')
  })

  it('Console logs on cronModel failure', async () => {
    // @ts-ignore
    cronModel.deleteMany.mockImplementation(() => {
      throw new Error('Shit')
    })
    await clearOldLogs()
    expect(console.log).toHaveBeenCalledWith('Error reaching database')
  })

  it('Calls clear logs query 30 days ago', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    await clearOldLogs()
    expect(logModel.deleteMany).toHaveBeenCalledWith({ date: { $lte: 1631404800000}})
    expect(cronModel.deleteMany).toHaveBeenCalledWith({ date: { $lte: 1631404800000}})
  })
})