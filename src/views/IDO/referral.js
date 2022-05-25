import useSWR from 'swr'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import poolabi from './poolabi'
import usdtabi from './usdtabi'
import oneabi from './one'
import twoabi from './two'
import { ethers, BigNumber } from 'ethers'
import { Box, Flex, FlexProps, useMatchBreakpoints, StyledButton } from '@pancakeswap/uikit'
import { featured } from './pool'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import styled from 'styled-components'
import { ToastDescriptionWithTx } from 'components/Toast'

const zeroAddress = '0x0000000000000000000000000000000000000000'
let usdt = null;
let pdfs = null;
let diffusionOne = null;
let diffusionTwo = null;

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`
const Address = styled.div`
  flex: 1;
  position: relative;
  padding-left: 16px;

  & > input {
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.colors.text};
    display: block;
    font-weight: 600;
    font-size: 16px;
    padding: 0;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.background}00,
      ${({ theme }) => theme.colors.background}E6
    );
    content: '';
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }
`
function Referral(props) {
    var { account, inputEle } = props
    const { isMobile } = useMatchBreakpoints()
    const { t } = useTranslation()
    const { toastSuccess, toastError } = useToast()
    const { chainID, library } = useActiveWeb3React()
    const signer = library.getSigner()

    usdt = new ethers.Contract(featured.usdt, JSON.stringify(usdtabi), signer)
    pdfs = new ethers.Contract(featured.address, JSON.stringify(poolabi), signer)
    diffusionOne = new ethers.Contract(featured.one, JSON.stringify(oneabi), signer)
    diffusionTwo = new ethers.Contract(featured.two, JSON.stringify(twoabi), signer)

    const [referral, setReferral] = useState()
    const [disableInput, setDisableInput] = useState(false)
    const [oneBalanceOfSender, setOneBalanceOfSender] = useState(BigNumber.from(0))
    const [twoBalanceOfSender, setTwoBalanceOfSender] = useState(BigNumber.from(0))

    const getReferral = useCallback(async () => {
        const r = await diffusionTwo.referral(account)
        setReferral(r)
    })
    const getDiffusionBalance = useCallback(async () => {
        const one = await diffusionOne.balanceOf(account)
        setOneBalanceOfSender(one)
        const two = await diffusionTwo.balanceOf(account)
        setTwoBalanceOfSender(two)

        return { one, two }
    })
    useEffect(() => {
        if (account) {
            getReferral()
            getDiffusionBalance()
        }
    }, [account])
    return (
        <Box position="relative" style={isMobile ? { width: '89%' } : { width: '600px' }}>
            <Wrapper>
                <Address className="ido-view">
                    <input ref={inputEle}
                        type="text"
                        value={referral}
                        onChange={async (e) => {
                            if (!disableInput) {
                                setReferral(e.target.value)
                                await getDiffusionBalance()
                            }
                        }}
                        onFocus={async (e) => {
                            var isSenderWhiteList = await pdfs.isWhiteList(account)
                            if (isSenderWhiteList) {
                                setDisableInput(isSenderWhiteList)
                            } else {
                                setDisableInput(false)
                            }
                        }}
                        readOnly={oneBalanceOfSender.eq(1) || twoBalanceOfSender.eq(1) || disableInput}
                    />
                </Address>
                <Flex margin="12px">
                    {!referral ? (
                        <StyledButton
                            style={{ padding: '5px' }}
                            onClick={async () => {
                                getReferral()
                                getDiffusionBalance()
                            }}
                        >
                            {t('Get')}
                        </StyledButton>
                    ) : (<StyledButton
                        style={{ padding: '5px' }}
                        disabled={oneBalanceOfSender.eq(1) || twoBalanceOfSender.eq(1)}
                        onClick={async () => {
                            const { one, two } = await getDiffusionBalance()
                            let oneBalanceOfReferral = BigNumber.from(0)
                            let twoBalanceOfReferral = BigNumber.from(0)
                            if (inputEle.current.value != zeroAddress) {
                                oneBalanceOfReferral = await diffusionOne.balanceOf(inputEle.current.value)
                                twoBalanceOfReferral = await diffusionTwo.balanceOf(inputEle.current.value)
                            }
                            var isSenderWhiteList = await pdfs.isWhiteList(account)
                            var isReferralWhiteList = await pdfs.isWhiteList(inputEle.current.value)
                            if (isSenderWhiteList && isReferralWhiteList) {
                                toastError(t('Error'), t("Cannot be both in whitelist"))
                                return
                            }
                            if (one.eq(1) || two.eq(1)) {
                                toastError(t('Error'), t("already casted"))
                                return
                            }
                            if (isSenderWhiteList) {
                                try {
                                    var receipt = await diffusionOne.casting()
                                    await receipt.wait()
                                    toastSuccess(t('Mint successfully'), <ToastDescriptionWithTx txHash={receipt.hash} />)
                                    await getDiffusionBalance()
                                } catch (error) {
                                    if (error.data && error.data.message) {
                                        toastError(t('Error'), t(error.data.message))
                                    } else {
                                        toastError(t('Error'), t(error.message))
                                    }
                                }
                            } else if (isReferralWhiteList) {
                                try {
                                    var receipt = await diffusionTwo.casting(inputEle.current.value)
                                    await receipt.wait()
                                    toastSuccess(t('Mint successfully'), <ToastDescriptionWithTx txHash={receipt.hash} />)
                                    await getDiffusionBalance()
                                } catch (error) {
                                    if (error.data && error.data.message) {
                                        toastError(t('Error'), t(error.data.message))
                                    } else {
                                        toastError(t('Error'), t(error.message))
                                    }
                                }
                            } else if (twoBalanceOfReferral.eq(1)) {
                                toastError(t('Error'), t('Cannot cast with the second level referral'))
                                return
                            } else {
                                toastError(t('Error'), t('Not in whitelist'))
                            }
                        }}
                    >
                        {t('Mint Honor Token')}
                    </StyledButton>)}

                </Flex>
            </Wrapper>
        </Box>
    )
}


export default Referral;
