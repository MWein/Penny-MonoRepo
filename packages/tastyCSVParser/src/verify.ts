// Confirms that the correct CSV was given

export const verify = (csvData: string): boolean =>
  csvData.slice(0, csvData.indexOf('\n')) === 'Date/Time,Transaction Code,Transaction Subcode,Symbol,Buy/Sell,Open/Close,Quantity,Expiration Date,Strike,Call/Put,Price,Fees,Amount,Description,Account Reference'
