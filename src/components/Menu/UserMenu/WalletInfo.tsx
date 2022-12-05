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
import { useDFSContract, useBondContract, useIDOContract } from 'hooks/useContract'
import { formatUnits } from '@ethersproject/units'
import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
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
  const [pdfsBalance, setPdfsBalance] = useState<BigNumber>(BigNumber.from(0))
  const [pdfsReleased, setPdfsReleased] = useState<BigNumber>(BigNumber.from(0))
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  const bond = useBondContract()
  const dfs = useDFSContract()
  const ido = useIDOContract()

  const release = async (account) => {
    try {
      const released = await ido.release(account)
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
    }
  }
  const [dfsBalance, setBalance] = useState(BigNumber.from(0))
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  useEffect(() => {
    if (account) {
      dfs
        .balanceOf(account)
        .then((res) => {
          setBalance(res)
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
      ido
        .balances(account)
        .then((res) => {
          setPdfsBalance(res)
        })
        .catch((error) => console.log(error))
      ido
        .releaseInfo(account)
        .then((res) => {
          setPdfsReleased(res.balance)
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
        <Text color="textSubtle">{t('PDFS Balance')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(pdfsBalance, 9)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('PDFS Released')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(pdfsReleased, 9)}</Text>
        )}
      </Flex>

      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('DFS Balance')}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatUnits(dfsBalance)}</Text>
        )}
      </Flex>
      <Button variant="secondary" width="100%" onClick={async () => release(account)}>
        {t('Release PDFS')}
      </Button>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
