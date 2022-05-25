import { useWeb3React } from '@web3-react/core'
import IDO from '../views/IDO'

const IDOPage = () => {
  const { account } = useWeb3React()
  console.log("account:",account)
  
  return (
    <IDO
      account={account}
    />
  )
}

export default IDOPage
