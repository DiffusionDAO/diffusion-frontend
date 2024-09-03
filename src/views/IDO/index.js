import { useRef} from 'react'
import Page from '../Page'

import { featured, IDOPool } from './pool'
import Referral from './referral'


function IDO(props) {
  let { account } = props
  let inputEle = useRef(null)
  return (
    <Page>
      {/* <Referral account={account} inputEle={inputEle}/> */}
      <IDOPool account={account} inputEle={inputEle}/>
    </Page>
  )
}

export default IDO
