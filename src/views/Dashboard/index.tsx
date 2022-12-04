import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { useTranslation } from '@pancakeswap/localization'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import useSWR from 'swr'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useBondContract, useDFSContract, useDFSMiningContract, usePairContract } from 'hooks/useContract'
import { getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseEther } from '@ethersproject/units'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import { Paper } from './style'
import { DataCell } from './components/DataCell/DataCell'
import {
  EightGraph,
  ElevenGraph,
  FiveGraph,
  FourGraph,
  NineGraph,
  OneGraph,
  SevenGraph,
  SixGraph,
  TenGraph,
  ThirteenGraph,
  ThreeGraph,
  TwelveGraph,
  TwoGraph,
} from './components/Graph/Graph'
import { dashboardMock } from './MockData'

const useStyles = makeStyles((theme) => ({
  hasRLBorder: {
    [theme?.breakpoints?.up(981)]: {
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    },
  },
}))

const telegramLink =
  'https://api.telegram.org/bot5334696884:AAHzLTcSxbmnzHZUBNfCBN2SjXAyaT06hQo/getChatMembersCount?chat_id=@DiffusionDAO'
const discordLink = 'https://discord.com/api/invite/XYKQdqmuTe?with_counts=true'
const twitterLink = 'https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=DFSDIFFUSION'
const mediumLink = 'https://medium.com/@getdiffusion?format=json'

const { one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen } =
  dashboardMock.OverviewData

export const dao = [
  '0x31637FbB726314F01Aab2010Be0D4D0e1991fADD',
  '0xAdFe4B22487FC68Ad95fe99081F3BB4D08bBe5f2',
  '0x4cFE2C39Aab2788A396E67F7629a338944C35069',
  '0x02bC8e16B0c5d8D7743A866978773dd7837Bd173',
]
export const foundation = '0x1D922cB80505811206E745B91078AFBFA7d0EE4D'
const unstakeNFTAddress = '0xF04750aba81ED3aa683794D3816f61436c6B3FC6'
const nftMarketDestroyAddress = '0x214DB1d773f09160666d107962BA21e35d97018E'
const elementaryPayoutMintAddress = '0xC548Ee5760aA01897eF3907AFD4fe6E45ba22fE3'
const advancedPayoutMintAddress = '0x94cE75eE2e9671FEEb7c9D4ccA54cb6bf7420D7B'

const elementaryMintAddress = '0x61B93D8A4EBA34e1A49f5Da6d0Ac7c18bc618bEd'
const advancedMintAddress = '0xF8c23DA851a7E402cc91b822a16F40bdC104c532'

const Dashboard = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [callFactor, setCallfactor] = useState<number>(0)
  const [tvl, setTvl] = useState<BigNumber>(BigNumber.from(0))
  const [singleCurrencyReserves, setSingleCurrencyReserves] = useState<number>(0)
  const [totalCirculation, setTotalCirculation] = useState<BigNumber>(BigNumber.from(0))
  const [circulationSupply, setCirculationSupply] = useState<BigNumber>(BigNumber.from(0))
  const [foundationDFS, setFoundationDFS] = useState<BigNumber>(BigNumber.from(0))
  const [totalBondUsed, setTotalBondUsed] = useState<BigNumber>(BigNumber.from(0))
  const [debtRatio, setDebtRatio] = useState<number>(0)
  const [holderLength, setHolderLength] = useState<number>(0)

  const clickTab = (tab: string) => {
    setActiveTab(tab)
  }
  const dfsMineContract = useDFSMiningContract()
  const dfs = useDFSContract()
  const bond = useBondContract()
  const { data } = useSWR('dashboard', async () => {
    const callFactor = await dfsMineContract.totalCalls()
    setCallfactor(callFactor.toNumber())
    // console.log('callFactor:', callFactor.toNumber())

    const reserves = await pair.getReserves()
    const [numerator, denominator] =
      usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]]
    setTvl(numerator.mul(2))

    const foundationDFS = await dfs.balanceOf(foundation)
    // console.log("foundationDFS:",formatUnits(foundationDFS))
    setFoundationDFS(foundationDFS)
    const dfsTotalSupply = await dfs.totalSupply()
    // console.log("dfsTotalSupply:",formatUnits(dfsTotalSupply))

    const totalPayout = await bond.totalPayout()

    const unstakeNFTDFS = await dfs.balanceOf(unstakeNFTAddress)

    const nftMarketDestroyedDFS = await dfs.balanceOf(nftMarketDestroyAddress)

    const elementaryPayoutMintAddressDfs = await dfs.balanceOf(elementaryPayoutMintAddress)
    const advancedPayoutMintAddressDfs = await dfs.balanceOf(advancedPayoutMintAddress)
    const elementaryMintAddressDfs = await dfs.balanceOf(elementaryMintAddress)
    const advancedMintAddressDfs = await dfs.balanceOf(advancedMintAddress)
    const daoDFS = (await Promise.all(dao.map(async (d) => dfs.balanceOf(d)))).reduce((accum, curr) => {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      accum = accum.add(curr)
      return accum
    }, BigNumber.from(0))

    console.log('daoDFS:', formatUnits(daoDFS))

    const holderLength = await dfs.getHoldersLength()
    setHolderLength(holderLength)
    const bondDfs = await dfs.balanceOf(bond.address)
    const circulationSupply = dfsTotalSupply
      .sub(daoDFS)
      .sub(foundationDFS)
      .sub(bondDfs)
      .sub(unstakeNFTDFS)
      .sub(nftMarketDestroyedDFS)
      .sub(elementaryPayoutMintAddressDfs)
      .sub(advancedPayoutMintAddressDfs)
      .sub(elementaryMintAddressDfs)
      .sub(advancedMintAddressDfs)

    setCirculationSupply(circulationSupply)

    const singleCurrencyReserves = parseFloat(formatUnits(numerator)) / parseFloat(formatUnits(circulationSupply))
    setSingleCurrencyReserves(singleCurrencyReserves)

    const withdrawedSocialReward = await dfsMineContract.withdrawedSocialReward()
    const withdrawedSavingReward = await dfsMineContract.withdrawedSavingReward()

    const initialSupply = await dfs.initialSupply()
    const totalCirculation = totalPayout
      .mul(1250)
      .div(1000)
      .add(withdrawedSocialReward)
      .add(withdrawedSavingReward)
      .add(initialSupply)
    setTotalCirculation(totalCirculation)

    const buyers = await bond.getBuyers()

    const bondUsed = await Promise.all(
      buyers.map(async (buyer) => {
        const referralBond = await bond.addressToReferral(buyer)
        return referralBond.bondUsed
      }),
    )
    const totalBondUsed = bondUsed.reduce((accum, curr) => {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      accum = accum.add(curr)
      return accum
    }, BigNumber.from(0))

    setTotalBondUsed(totalBondUsed)

    const debtRatio =
      (parseFloat(formatUnits(totalPayout.sub(totalBondUsed))) * 100) / parseFloat(formatUnits(circulationSupply))
    console.log('debtRatio:', debtRatio)
    setDebtRatio(debtRatio)
    // console.log("totalCirculation:",formatUnits(totalCirculation))

    // const telegram = await fetch(telegramLink)
    // const telegramJson = await telegram.json()
    // const telegramFollowers = telegramJson.result
    // console.log('telegramFollowers:', telegramFollowers)

    // const discord = await fetch(discordLink)
    // const discordJson = await discord.json()
    // const discordFollowers = discordJson.approximate_member_count
    // console.log('discordFollowers:', discordFollowers)

    // const twitter = await fetch(twitterLink)
    // const twitterJson = await twitter.json()
    // const twitterFollowers = twitterJson[0].followers_count
    // console.log('twitterFollowers:', twitterFollowers)

    // const medium = await fetch(mediumLink)
    // const text = await medium.text()
    // const mediumJson = JSON.parse(text.replace('])}while(1);</x>', ''))
    // console.log(mediumJson)
    // const userId = mediumJson.payload.user.userId
    // const mediumFollowers = mediumJson.payload.references.SocialStats.userId.usersFollowedByCount
    // console.log('mediumFollowers:', mediumFollowers)

    // const followers = {
    //   concentration: {
    //     telegram: telegramFollowers,
    //     discord: discordFollowers,
    //     twitter: twitterFollowers,
    //     medium: mediumFollowers,
    //   },
    // }
    // return followers

    const response = await fetch('https://middle.diffusiondao.org/dashboard')
    const json = await response.json()
    return json
  })
  const conentractions = Object.keys(data?.concentration ?? {}).map((key) => data?.concentration[key])
  // eslint-disable-next-line no-return-assign, no-param-reassign
  const avgConentraction = conentractions.reduce((acc, cur) => (acc += cur), 0) / conentractions.length

  const coefficient = avgConentraction + callFactor
  const time = new Date()

  const pair = usePairContract(getPairAddress())

  const usdtAddress = getUSDTAddress()
  const dfsAddress = getDFSAddress()

  return (
    <div className="dashboard-view">
      <Typography variant="h4" style={{ fontWeight: 700, overflow: 'hidden', color: '#fff' }}>
        {t('Dashboard')}
      </Typography>
      {isMobile ? (
        <div className="dashboard-tab">
          <div
            aria-hidden="true"
            className={`${activeTab === 'Overview' && 'active'}`}
            onClick={() => clickTab('Overview')}
          >
            {t('Overview')}
          </div>
          <div aria-hidden="true" className={`${activeTab === 'Chart' && 'active'}`} onClick={() => clickTab('Chart')}>
            {t('Chart')}
          </div>
        </div>
      ) : (
        <div style={{ fontWeight: 500, fontSize: '15px', overflow: 'hidden', lineHeight: '40px', color: '#fff' }}>
          {t('Overview')}
          <span style={{ color: 'grey', fontSize: '12px', fontWeight: 400, marginLeft: '16px' }}>
            {`${time.toLocaleDateString().replace(/\//g, '-')} ${time.toTimeString().slice(0, 8)}`}
          </span>
        </div>
      )}
      <Grid container spacing={2}>
        {!(isMobile && activeTab !== 'Overview') ? (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={9} md={9} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className="cell-box cell-item1">
                      <Grid container spacing={0}>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell title={t('TVL')} data={`$${formatUnits(tvl)}`} style={{ fontSize: '32px' }} />
                            <DataCell title="" data="" imgUrl="/images/dashboard/tvl.svg" />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className={`${classes.hasRLBorder} cell-sub-item`}>
                            <DataCell
                              title={t('Total circulation')}
                              data={`${formatBigNumber(totalCirculation, 5)} DFS`}
                            />
                            <DataCell
                              title={t('Solitary Reserve')}
                              data={`$${formatNumber(singleCurrencyReserves, 2)}`}
                            />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Current circulation volume')}
                              data={`${formatBigNumber(circulationSupply, 2)} DFS`}
                              imgUrl="/images/dashboard/rf.svg"
                            />
                            <DataCell
                              title={t('Expansion Fund')}
                              data={`$${formatBigNumber(foundationDFS, 5)}`}
                              imgUrl="/images/dashboard/rm.svg"
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <div className="cell-box cell-item2">
                      <div className="has-border cell-sub-item">
                        <div className="ctir-image">
                          <CircularProgress
                            variant="determinate"
                            style={{ color: 'rgba(171, 182, 255, 0.1)', margin: 'auto', width: '100%', height: '100%' }}
                            size={40}
                            thickness={4}
                            value={100}
                          />
                          <CircularProgress
                            variant="determinate"
                            size={40}
                            thickness={4}
                            style={{
                              color: '#0819ff',
                              width: '100%',
                              height: '100%',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                            }}
                            value={8}
                          />
                          <div className="ctir-data">{8}%</div>
                        </div>
                        <div className="ctir-title">{t('Target inflation rate')}</div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={8} md={8} sm={12} xs={12}>
                    <div className="cell-box cell-item3">
                      <Grid container spacing={0}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="cell-sub-item"
                            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <DataCell title={t('Household savings rate')} data={`${91.34}%`} progressColor="#f200ff" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="cell-sub-item"
                            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <DataCell title={t('DSGE suitability')} data={`${89.12}%`} progressColor="#01ffed" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell title={t('Inflation')} data={`${nine}%`} progressColor="#f5d700" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Debt ratio')}
                              data={`${formatNumber(debtRatio, 2)}%`}
                              progressColor="#0131ff"
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className="cell-box cell-item4" style={{ position: 'relative' }}>
                      <div className="cell-sub-item">
                        <img
                          alt=""
                          src="/images/dashboard/cell-bg4.png"
                          style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                        />
                        <div className="disvg">
                          <img src="/images/dashboard/di.png" style={{ width: '56px', height: '52px' }} alt="" />
                        </div>
                        <div className="di-font">{t('Diffusion index')}</div>
                        {/* {/* <h3 className="di-content">{eleven}</h3> */}
                        <DataCell
                          title={t('Diffusion Coefficient')}
                          data={holderLength.toString()}
                          titleStyle={{ color: '#ABB6FF' }}
                        />
                        <DataCell
                          title={t('Attention Factor')}
                          data={conentractions.length ? avgConentraction?.toString() : '0'}
                          titleStyle={{ color: '#ABB6FF' }}
                        />
                        <DataCell
                          title={t('Call Factor')}
                          data={callFactor.toString()}
                          imgUrl="/images/dashboard/cf.png"
                          titleStyle={{ color: '#ABB6FF' }}
                          imgStyle={{ height: '85px', width: '54px' }}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className="cell-box cell-item5">
                      <div className="cell-sub-item">
                        <DataCell
                          title={t('Expansion Fund')}
                          data={`$${formatBigNumber(foundationDFS, 5)}`}
                          imgUrl="/images/dashboard/rz.svg"
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : null}

        {/* echarts图表 */}
        {!(isMobile && activeTab !== 'Chart') ? (
          <>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={7} md={7} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <OneGraph />
                  </Paper>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <TwoGraph />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={7} md={7} sm={12} xs={12}>
                  <Grid container spacing={4}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="ohm-card ohm-chart-card">
                        <ThreeGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="ohm-card ohm-chart-card">
                        <FourGraph />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="ohm-card ohm-chart-card" style={{ height: '238px' }}>
                        <FiveGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="ohm-card ohm-chart-card" style={{ height: '238px' }}>
                        <SixGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="ohm-card ohm-chart-card" style={{ height: '238px' }}>
                        <SevenGraph />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={7} md={7} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <EightGraph />
                  </Paper>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <NineGraph />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <TenGraph />
              </Paper>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <ElevenGraph />
                  </Paper>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <TwelveGraph />
                  </Paper>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="ohm-card ohm-chart-card">
                    <ThirteenGraph />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
    </div>
  )
}

export default Dashboard
