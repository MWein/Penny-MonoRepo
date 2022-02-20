export const sleep = async (seconds: number) : Promise<void> =>
  new Promise<void>(resolve => setTimeout(() => resolve(), seconds * 1000))
