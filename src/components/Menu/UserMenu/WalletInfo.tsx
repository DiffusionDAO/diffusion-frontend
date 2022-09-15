import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'

import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getDFSContract, getIDOContract, getBondContract } from 'utils/contractHelpers'
import React, { useEffect, useState } from "react"
import { Modal, Input } from 'antd';
import styled, { css } from 'styled-components'
import BigNumber from 'bignumber.js'
import CopyAddress from './CopyAddress'

export const MoneyInput = styled(Input)`
  height: 40px;
  margin-bottom: 10px;
  color: #fff;
  box-shadow: none !important;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
  :focus {
    box-shadow: none !important;
  }
  input.ant-input {
    background: none;
    color: #fff;
    :focus {
      box-shadow: none;
    }
  }
  .ant-input-suffix {
    color: rgba(210, 87, 255, 1);
  }
`

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.cake.address)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  const bond = getBondContract()
  const dfs = getDFSContract()
  const ido = getIDOContract()

  const swap = async () => {
    const balancePdfs = await ido.balances(account)
    const releasedPdfs = await ido.releaseInfo(account)
    const receipt = await ido.burn()
    const bondBalance = await bond.pendingPayoutFor(account)
    const amount = Math.min(balancePdfs-releasedPdfs.balance, bondBalance)
    await dfs.mint(2*amount)
  }
  const [dfsBalance, setBalance] = useState(new BigNumber(0))
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  useEffect(() => {
    if (account) {
      dfs.balanceOf(account).then(res => { if (!dfsBalance.eq(0)) { setBalance(res) } })
      ido.releaseStart().then(res => { if (start !== "") { setStart(res); } })
      ido.releaseEnd().then(res => { if (end !== "") { setEnd(res); } })
    }
  }, [dfsBalance, account])

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t('BNB Balance Low')}</Text>
            <Text as="p">{t('You need BNB for transaction fees.')}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('BNB Balance')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('PDFS Released')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{(end !== "" && start !== "") ? parseInt(end) - parseInt(start):0}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('Bond Purchased')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{0}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('DFS Balance')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{dfsBalance.toString()}</Text>
        )}
      </Flex>
      {/* <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal>
      </Flex> */}
      <Button variant="secondary" width="100%" onClick={swap}>
        {t('Swap')}
      </Button>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
