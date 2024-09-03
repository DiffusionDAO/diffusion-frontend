import { useMemo, useState, useCallback, useEffect, useRef, Component } from 'react'
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from '@material-ui/core'
import { Box, Flex, FlexProps, useMatchBreakpoints, StyledButton } from '@pancakeswap/uikit'

import { ethers, BigNumber } from 'ethers'
import { Skeleton } from '@material-ui/lab'
import { shorten, trim } from '../../helpers'
import copy from 'copy-to-clipboard'
import { formatUnits } from 'ethers/lib/utils'
import { extend } from 'lodash'
import { render } from 'react-dom'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { AppDispatch, AppState } from '../../state'
import Page from '../Page'
import styled from 'styled-components'
import Timer from 'views/Lottery/components/Countdown/Timer'
import useNextEventCountdown from 'views/Lottery/hooks/useNextEventCountdown'
import { useAppDispatch } from 'state'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { space, layout, variant } from 'styled-system'
import useSWR from 'swr'
import poolabi from './poolabi'
import usdtabi from './usdtabi'
import oneabi from './one'
import twoabi from './two'

export const featured = {
  closes_in: 'Ended',
  distribute_token: 0,
  _id: '',
  start_date: Date.parse(new Date('2022-04-22 09:00:00 GMT+0800')),
  end_date: Date.parse(new Date('2022-12-31 09:00:00 GMT+0800')),
  pool_type: 'featured',
  title: 'BITV',
  up_pool_raise: 10,
  usd_per_share: 1,
  content: 'これは新しい時代の幕開けです。',
  images: '',
  min_allocation: '',
  max_allocation: '',
  up_pool_access: 'Public 1',
  participants: 0,
  swap_amount: null,
  min_swap_level: '',
  symbol: 'BITV',
  decimal: 18,
  // testnet
  // usdt: '0xc362B3ed5039447dB7a06F0a3d0bd9238E74d57c',
  // one: '0x41a13AA4ac289558DF6bb46a53af505236d7a975',
  // two: '0xA29d4455b3e0Bae5Aacf63c770531823ec7baf01',
  // address: '0x1E1Aae92bF4798C4186e8262E0dA31323d894406',
  //mainnet
  usdt: '0x55d398326f99059fF775485246999027B3197955',
  one: '0x7B1015a820c9cA137634A0631aa73feF15220F7A',
  two: '0x39AFCb05e2B776De42AE4Ac8FB41F948f9e6c9f4',
  address: '0x0e6dfbCe936ABe08cda0Caf576E3CfcF13A11830',

  token_address: 'TBA',
  abi_name: '',
  raised: 0,
  total_supply: 500000,
  idoPercent: 1,
  description: '<p>BITV Eco</p>',
  twitter_link: '',
  git_link: '',
  telegram_link: '',
  reddit_link: '',
  medium_link: '',
  browser_web_link: '',
  youtube: '',
  instagram: '',
  discord: '',
  white_paper: '',
  network_type: 'BSC',
  crypto_type: 'USDT',
  idophase: 'Public 1',
  token_distribution_date: '',
  fblink: '',
  contract_type: '',
  createdAt: '',
  updatedAt: Date.now(),
  __v: 0,
  Owner: null,
  price: null,
  time_duration: Date.now(),
}
var startDate = new Date(featured.start_date)
let year = startDate.getFullYear()
let month = startDate.getMonth() + 1
let day = startDate.getDate()
let hour = startDate.getHours()
let minute = startDate.getMinutes()
let second = startDate.getSeconds()
const start = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

const endDate = new Date(featured.end_date)
year = endDate.getFullYear()
month = endDate.getMonth() + 1
day = endDate.getDate()
hour = endDate.getHours()
minute = endDate.getMinutes()
second = endDate.getSeconds()
const endTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

const uint256MAX = BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935')
const zeroAddress = '0x0000000000000000000000000000000000000000'

let closed = 0
let closesIn = 0
let startIn = 0
let filled = 0
let y = 0
let closes_seconds = ''
let usdt = null;
let pdfs = null;
let diffusionOne = null;
let diffusionTwo = null;


export function IDOPool(props) {
  let { account, inputEle } = props
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { chainID, library } = useActiveWeb3React()
  const signer = library.getSigner()

  usdt = new ethers.Contract(featured.usdt, JSON.stringify(usdtabi), signer)
  pdfs = new ethers.Contract(featured.address, JSON.stringify(poolabi), signer)
  diffusionOne = new ethers.Contract(featured.one, JSON.stringify(oneabi), signer)
  diffusionTwo = new ethers.Contract(featured.two, JSON.stringify(twoabi), signer)

  const [pool, setPool] = useState({ approved: false, number1: 0, number2: 0, balance: BigNumber.from(0), PDFSBalance: BigNumber.from(0), startTime: "", startTimeMobile: "" })
  const [amount, setAmount] = useState(BigNumber.from(0))

  const updatePool = useCallback(async () => {
    // pool.startTime = startTime
    // pool.startTimeMobile = startTimeMobile
    var total = await pdfs.IDOTotal()
    featured.raised = total
    var price = await pdfs.getPrice()
    featured.up_pool_raise = 10 / price;
    pool.number1 = ((featured.raised * featured.up_pool_raise) / 10 ** 18 / (featured.total_supply * featured.idoPercent)) * 100
    pool.number2 = featured.raised / 10 ** 18
    if (account) {
      var allowance = await usdt.allowance(account, featured.address)
      pool.approved = BigNumber.from(allowance) >= uint256MAX / 2

      var balance = await pdfs.getIDOBalance(account)
      pool.balance = balance

      var pdfsBalance = await pdfs.balances(account)
      pool.PDFSBalance = pdfsBalance
    }
    setPool(pool)
  }, [secondsRemaining, account])


  const useNextEventCountdown = (startDate, endDate) => {
    const [secondsRemaining, setSecondsRemaining] = useState(null)
    const timer = useRef(null)
    useEffect(() => {
      const now = Date.now()
      const startUnixStamp = Date.parse(startDate)
      const endUnixStamp = Date.parse(endDate)
      const currentSeconds = Math.floor(now / 1000)
      let secondsRemainingCalc = 0
      if (now < startUnixStamp) {
        secondsRemainingCalc = startUnixStamp - now
      } else if (startUnixStamp < now && now < endUnixStamp) {
        secondsRemainingCalc = endUnixStamp - now
      }
      setSecondsRemaining(secondsRemainingCalc)
      timer.current = setInterval(() => {
        update()

        setSecondsRemaining((prevSecondsRemaining) => {
          if (prevSecondsRemaining <= 1) {
            clearInterval(timer.current)
          }
          return prevSecondsRemaining - 1
        })
      }, 1000)
      return () => clearInterval(timer.current)
    }, [setSecondsRemaining, timer, account])
    return secondsRemaining
  }

  const secondsRemaining = useNextEventCountdown(startDate, endDate)
  const update = useCallback(() => {
    let date = new Date()
    let now_utc = Date.parse(date)
    if (pool.number1 > '99.98') {
      startIn = 0
      closesIn = 0
      closed = 0
      filled = 1
      y = 1
    } else if (endDate < now_utc) {
      closed = 1
      y = 1
    } else if (now_utc < startDate) {
      startIn = 1
      y = 1
    } else if (endDate >= now_utc && now_utc >= startDate) {
      closesIn = 1
      startIn = 0
      y = 0
    } else {
      startIn = 0
      closesIn = 0
      y = 1
    }

    let closes_in_days = ''
    let closes_in_hours = ''
    let closes_in_minutes = ''
    let desktopTimer = ''
    let mobileTimer = ''
    let closes_in_sec = ''
    if (startDate && startIn) {
      closes_in_sec = (startDate - now_utc) / 1000
      closes_in_days = Math.floor(closes_in_sec / (3600 * 24))
      closes_in_sec -= closes_in_days * 86400
      closes_in_hours = Math.floor(closes_in_sec / 3600) % 24
      closes_in_sec -= closes_in_hours * 3600
      closes_in_minutes = Math.floor(closes_in_sec / 60) % 60
      closes_in_sec -= closes_in_minutes * 60
      closes_seconds = Math.floor(closes_in_sec % 60)
      desktopTimer = `${closes_in_days} days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_in_sec} seconds`
      mobileTimer = `${closes_in_days} d: ${closes_in_hours} h: ${closes_in_minutes} m: ${closes_in_sec} s`
    }

    if (endDate && closesIn) {
      closes_in_sec = (endDate - now_utc) / 1000
      closes_in_days = Math.floor(closes_in_sec / (3600 * 24))
      closes_in_sec -= closes_in_days * 86400
      closes_in_hours = Math.floor(closes_in_sec / 3600) % 24
      closes_in_sec -= closes_in_hours * 3600
      closes_in_minutes = Math.floor(closes_in_sec / 60) % 60
      closes_in_sec -= closes_in_minutes * 60
      closes_seconds = Math.floor(closes_in_sec % 60)

      desktopTimer = `${closes_in_days} days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_seconds} seconds`
      mobileTimer = `${closes_in_days}d: ${closes_in_hours}h: ${closes_in_minutes}m: ${closes_seconds}s`
    }
    updatePool()
  }, [secondsRemaining, account])

  async function buyToken() {
    const usdPerShare = featured.usd_per_share
    let stake = BigNumber.from(10).pow(18).mul(amount).mul(usdPerShare)

    var balance = await usdt.balanceOf(account)
    if (balance.toString() == '0') {
      toastError(t('Error'), t('No USDT'))
      return
    }
    var inputValue = inputEle.current.value
    var usdtPercent1 = 0;
    var usdtPercent2 = 0;
    var referral1 = zeroAddress;
    var referral2 = zeroAddress;

    var twoBalanceOfSender = await diffusionTwo.balanceOf(account)
    var oneBalanceOfSender = 0
    if (twoBalanceOfSender == 0) {
      oneBalanceOfSender = await diffusionOne.balanceOf(account)
    }
    var hundred = BigNumber.from(10).pow(18).mul(100)

    var thousand = BigNumber.from(10).pow(18).mul(1000)
    var fiveThousand = BigNumber.from(10).pow(18).mul(5000)
    if (!inputValue) {
      if (twoBalanceOfSender.eq(0) && stake.gt(hundred)) {
        toastError(t('Error'), t('Limted to 100'))
        return
      }
    } else {
      if (inputValue == zeroAddress) { 
        var isWhiteList = await pdfs.isWhiteList(account)
        if (isWhiteList) { 
          if (stake.lt(thousand)) { 
            toastError(t('Error'), t('Limted to 1000-10000'))
            return
          }
        } else {
          if (twoBalanceOfSender.eq(0) && stake.gt(hundred)) {
            toastError(t('Error'), t('Limted to 100'))
            return
          }
        }
      } else if (inputValue != zeroAddress) { 
        if (twoBalanceOfSender.eq(1)) { 
          if (stake.lt(thousand)) { 
            toastError(t('Error'), t('Limted to 1000-10000'))
            return
          }
        } 
        var idoBalanceOfReferral = await pdfs.IDOBalance(inputValue)

        var twoBalanceOfReferral = await diffusionTwo.balanceOf(inputValue)
        var oneBalanceOfReferral = await diffusionOne.balanceOf(inputValue)
        if (twoBalanceOfReferral.eq(1)) { 
          var ref = await diffusionTwo.referral(account)
          if (ref == zeroAddress) {
            await diffusionTwo.setReferral(inputValue)
          }
          if (stake.lt(thousand)) { 
            toastError(t('Error'), t('Limted to 1000-10000'))
            return
          }
          if (idoBalanceOfReferral.gte(fiveThousand)) { 
            usdtPercent2 = 25
          }
          referral2 = inputValue
          var referral1 = await diffusionTwo.referral(inputValue)
          var idoBalance1 = await pdfs.IDOBalance(referral1)
          if (idoBalance1.gte(fiveThousand)) { 
            usdtPercent1 = 25
          }
        } else if (oneBalanceOfReferral.eq(1)) { 
          var ref = await diffusionTwo.referral(account)
          if (ref == zeroAddress) {
            await diffusionTwo.setReferral(inputValue)
          }
          if (stake.lt(thousand)) { 
            toastError(t('Error'), t('Limted to 1000-10000'))
            return
          }
          referral1 = inputValue
          if (idoBalanceOfReferral.gte(fiveThousand)) {
            usdtPercent1 = 50
            usdtPercent2 = 0
          }
        } else {
          toastError(t('Error'), t('Referral has no Honor Tokens'))
          return
        }
      }
    }
    try {
      await pdfs.attendIDO(referral1, referral2, stake, usdtPercent1, usdtPercent2)
    } catch (error) {
      if (error.data && error.data.message) {
        toastError(t('Error'), t(error.data.message))
      } else {
        toastError(t('Error'), t(error.message))
      }
    }
  }


  let full = ''
  let length = featured.content && featured.content.length && featured.content.length > 210
  let num = Math.ceil(pool.number1 / 2)
  let allocation = pool.number2 * featured.up_pool_raise
  if (num === 50) {
    full = 'fullupload'
  }
  return (
    <div className="ido-view" style={isMobile ? { margin: 'unset' } : {}}>
      <Zoom in={true}>
        <div className="ido-card">
          <div className="home">
            <div className="pools feat_ured">
              <div className="container_cust">
                <div className="inner_pools">
                  <div className="pool_grid home">
                    {' '}
                    <div className="pool_card">
                      <div className="pool-link">
                        <div className="tit_le">
                          <div className="title-img">
                            <div className="image_circle" />
                          </div>
                          <div className="title-head">
                            <h3>
                              {/* <div className="h-title">{title}</div> */}
                              <span>
                                1 {featured.symbol} = {1 / featured.up_pool_raise}{' '}
                                {featured.crypto_type === 'USDT' ? 'USDT' : 'BNB'}
                              </span>
                            </h3>
                            <div className="title-info">
                              <p>
                                {length ? featured.content.substring(0, 170) : t(featured.content)}
                                {length ? '...' : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="title-head-mob">
                          {/* <h3>
                              <div className="h-title">{title}</div>
                            </h3> */}
                          <div className="title-info">
                            <p>
                              {length ? featured.content.substring(0, 170) : t(featured.content)}
                              {length ? '...' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="center-bg"></div>
                      <div className="home-progress">
                        <div className="raise-three mob">
                          <div className="raise">
                            <p className="total_raise">{t('Total Raised')}</p>
                            <h2>
                              {pool.number2 ? pool.number2.toFixed(2) : '0'} {featured.crypto_type === 'USDT' ? 'USDT' : 'BNB'}
                            </h2>
                          </div>
                          <div className="allocation">
                            <div>
                              <p className="feature_max">{t('Maximum')}</p>
                              <h3>
                                {featured.max_allocation
                                  ? featured.max_allocation + (featured.crypto_type === 'USDT' ? ' USDT' : ' BNB')
                                  : 'TBA'}
                              </h3>
                            </div>
                            <div>
                              <p className="feature_max">{t('Access')}</p>
                              <h3>{featured.up_pool_access}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="allocation-mob">
                          <div>
                            <p className="feature_max">{t('Maximum')}</p>
                            <h3>
                              {featured.max_allocation
                                ? featured.max_allocation + (featured.crypto_type === 'USDT' ? ' USDT' : ' BNB')
                                : 'TBA'}
                            </h3>
                          </div>
                          <div>
                            <p className="feature_max">{t('Access')}</p>
                            <h3>{featured.up_pool_access}</h3>
                          </div>
                        </div>
                        {/* <div className="rts">
                          {startIn ? <p className="status-p">{t('Starts in')}</p> : ''}
                          <div className="timer_desktop">
                            {startIn === 1 ? (
                              <h3 style={{ color: 'white', fontSize: 18 }} id="poolonpagestart">
                                {pool.startTime}
                              </h3>
                            ) : (
                              ''
                            )}
                          </div>
                          <div className="timer_mobile">
                            {startIn === 1 ? (
                              <h3 style={{ color: 'white', fontSize: 14 }} id="poolonpagestart">
                                {pool.startTimeMobile}
                              </h3>
                            ) : (
                              ''
                            )}
                          </div>
                          {closesIn ? <p className="status-p">{t('Ends in')}</p> : ''}
                          <div className="timer_desktop">
                            {closesIn === 1 ? (
                              <h3 style={{ color: 'white', fontSize: 18 }} id="poolonpagestart">
                                {pool.startTime}
                              </h3>
                            ) : (
                              ''
                            )}
                          </div>
                          <div className="timer_mobile">
                            {closesIn === 1 ? (
                              <h3 style={{ color: 'white', fontSize: 14 }} id="poolonpagestart">
                                {pool.startTimeMobile}
                              </h3>
                            ) : (
                              ''
                            )}
                          </div>
                          {closed ? <p className="status-p">{t('Status')}</p> : ''}
                          {closed ? <h3>Closed</h3> : ''}
                          {filled ? <h3>Filled</h3> : ''}
                        </div> */}
                        <div className="prog_bar">
                          <div className="prog_bar_grd">
                            <span className="prog">{t('Progress')}</span>
                            {/* <span className="parti">
                                                            Max Participants <span className="white_text">{participants.toString()}</span>
                                                        </span> */}
                          </div>
                          <div className={`battery ${full}`}>
                            {num
                              ? [...Array(num)].map((item, index) => (
                                <div className="bar active" key={index} data-power="10"></div>
                              ))
                              : ''}
                          </div>
                          <div className="prog_bar_grd">
                            {<span className="prog _percent">{pool.number1 ? pool.number1.toFixed(2) : '0'}%</span>}
                            {
                              <span className="parti _nls">
                                {allocation ? allocation.toFixed(2) : '0'}/{featured.total_supply} {featured.symbol}
                              </span>
                            }
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="buy-btnbtc">
                            <div className="buy-token">
                              {pool.approved ? (
                                <OutlinedInput
                                  id="buy-button"
                                  className="btnn_white"
                                  style={{ color: 'white', border: '2px solid #2f2f37', width: '165px' }}
                                  type="number"
                                  placeholder="Amount"
                                  value={amount}
                                  onChange={async (e) => {
                                    var value = e.target.value
                                    setAmount(value)

                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <div
                                        style={{ cursor: 'pointer' }}
                                        className="wrap-action-input-btn"
                                        onClick={async () => {
                                          if (endDate && closesIn) {
                                            if (!account) {
                                              toastError(t('Error'), t('Not connected'))
                                              return
                                            }
                                            if (amount == 0) {
                                              toastError(t('Error'), t('zero'))
                                              return
                                            }
                                            await buyToken(amount)
                                          } else {
                                            toastError(t('Error'), t('Not start yet'))
                                          }
                                        }}
                                      >
                                        <p>USDT {t('Buy')}</p>
                                      </div>
                                    </InputAdornment>
                                  }
                                ></OutlinedInput>
                              ) : (
                                <button
                                  className="btnn_white"
                                  onClick={async () => {
                                    if (!account) {
                                      toastError(t('Error'), t('Not connected'))
                                      return
                                    }
                                    if (endDate && closesIn) {
                                      await usdt.approve(featured.address, uint256MAX)
                                    } else {
                                      toastError(t('Error'), t('Not start yet'))
                                    }
                                  }}
                                >
                                  {t('Approve')}
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            {isMobile ? (
                              <>
                                <p>BITV: {trim(formatUnits(pool.PDFSBalance, 18), 9)}</p>
                              </>
                            ) : (
                              <>
                                <p>
                                  IDO {t('Balance')}: {formatUnits(pool.balance, 18)} USDT
                                </p>
                                <p>BITV: {formatUnits(pool.PDFSBalance, 18)}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Zoom >
    </div >
  )
}

