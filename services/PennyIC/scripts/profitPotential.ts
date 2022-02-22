require('dotenv').config({ path: '../../../.env' })

import * as tradier from '@penny/tradier'


const profitPotential = async () => {
  const positions = await tradier.getPositions()

  const numberOfSpreads = positions.length / 2
  const totalCostBasis = positions.reduce((acc, x) => acc + x.cost_basis, 0) * -1

  console.log(numberOfSpreads)
  console.log(totalCostBasis)


}


profitPotential()