import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import React, { useEffect, useState } from 'react'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { useBalance, useSigner } from 'wagmi'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { bscTestnetTokens } from '@pancakeswap/tokens'
import { Modal, Input } from 'antd'
import styled, { css } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useBondContract, useDFSContract, useDFSMineContract, useIDOContract } from 'hooks/useContract'
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
  hasLowNativeBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  const dfsMining = useDFSMineContract()
  const dfs = useDFSContract()
  const ido = useIDOContract()

  const swap = async () => {
    const balancePdfs = await ido.balances(account)
    const receipt = await ido.burn()
    await receipt.wait()
    const releasedPdfs = await ido.releaseInfo(account)
    const bondBalance = await dfsMining.pendingPayoutFor(account)
    const amount = Math.min(balancePdfs - releasedPdfs.balance, bondBalance)
    await dfs.mint(2 * amount)
  }
  const [dfsBalance, setBalance] = useState(new BigNumber(0))
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  useEffect(() => {
    if (account) {
      dfs
        .balanceOf(account)
        .then((res) => {
          if (!dfsBalance.eq(0)) {
            setBalance(res)
          }
        })
        .catch((error) => console.log(error))
      ido
        .releaseStart()
        .then((res) => {
          if (start !== '') {
            setStart(res)
          }
        })
        .catch((error) => console.log(error))
      ido
        .releaseEnd()
        .then((res) => {
          if (end !== '') {
            setEnd(res)
          }
        })
        .catch((error) => console.log(error))
    }
  }, [dfsBalance, account])

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowNativeBalance && (
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
          <Text>{end !== '' && start !== '' ? parseInt(end) - parseInt(start) : 0}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('Bond Purchased')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? <Skeleton height="22px" width="60px" /> : <Text>{0}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('DFS Balance')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{dfsBalance.toString()}</Text>
        )}
      </Flex>
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
