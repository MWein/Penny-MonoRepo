import { useCache } from './cache'


describe('useCache', () => {
  it('2 calls. First calls mock function, second does not (because its cached)', async () => {
    const testFunction = jest.fn()
    testFunction.mockReturnValueOnce('Hello, there')
    testFunction.mockReturnValueOnce('General Kenobi')

    const result1 = await useCache('obi-wan', testFunction, 'uh oh', 8000)
    expect(result1).toEqual('Hello, there')

    // On the second call, the original return value is cached
    // So it wont return "General Kenobi"
    const result2 = await useCache('obi-wan', testFunction, 'uh oh')
    expect(result2).toEqual('Hello, there')
  })

  it('On failure, will return the onFail value', async () => {
    const testFunction = jest.fn()
    testFunction.mockImplementation(() => {
      const err = new Error('Oh no!!!')
      throw err
    })
    const result = await useCache('obi-two', testFunction, 'You have failed', 8000)
    expect(result).toEqual('You have failed')
  })
})