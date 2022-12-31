import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { useTranslation } from '@pancakeswap/localization'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import useSWR from 'swr'
import { Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useBondContract, useDFSContract, useDFSMiningContract, usePairContract } from 'hooks/useContract'
import { getBond1Address, getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseEther } from '@ethersproject/units'
import { formatBigNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { useActiveChainId } from 'hooks/useActiveChainId'
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
  '0x18d22D226C113390C6e5dA47B5b5F80Bc7c1f2f2',
  '0x139Ffb31d9F366333fDAd40B9CCDF9E12E078b0B',
  '0x999c3ad27d6637eC4F8450065debb51672D3a06e',
  '0xf5677c2BBe031d9e45bC3d4FBF4747EE21C0C18e',
]
export const foundation = '0x380A223E78dDE979cebF3a73ba747eB9d4153d7e'

const unstakeNFTAddress = '0x0c39EC20E7dA68605Fe2f81Ea4D5A023Ba2a8745'

const nftMarketDestroyAddress = '0x9d32D02f15E0802a8C54d46A5Ca379875401645B'

const elementaryUnusedMintAddress = '0xF5E0Cc17BAf1f468a367E5a25A4a9e957e591228'

const advancedUnusedMintAddress = '0x2dF7d9751A041BBF437e6601476cc9644f63ce62'

const elementaryMintAddress = '0xF080E5De0d0D0f9fb18DE72B85aef60e3293613f'

const advancedMintAddress = '0xA5bDF766410C3846B8e782a1C6bcD2368DDc674b'

const Dashboard = () => {
  const {chainId} = useActiveChainId()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [holderLength, setHolderLength] = useState<number>(undefined)
  const pair = usePairContract(getPairAddress(chainId))

  const clickTab = (tab: string) => {
    setActiveTab(tab)
  }
  const dfsMining = useDFSMiningContract()
  const dfs = useDFSContract()
  const bond = useBondContract()
  const dfsAddress = getDFSAddress(chainId)
  const usdtAddress = getUSDTAddress(chainId)
  const bondAddress1 = getBond1Address()

  const pairOld = usePairContract("0xB5951ff6e65d1b3c07Ac1188039170A00aEF8de2")

  const { data } = useSWR('dashboard', async () => {
    const reserves = await pairOld.getReserves()
    const [numerator, denominator] =
      usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]]
    // const marketPrice = parseFloat(formatUnits(numerator)) / parseFloat(formatUnits(denominator))
    const marketPrice = await bond.price()

    const dashboard = {
      callFactor: await dfsMining.totalCalls(),
      initialSupply: await dfs.initialSupply(),
      DSGE: await dfsMining.DSGE(),
      houseHoldSavingsRate: await dfsMining.HouseHoldSavingsRate(),
      tvl: BigNumber.from(0),
      marketPrice,
      foundationDFS: await dfs.balanceOf(foundation),
      elementaryUnusedMintAddressDfs: await dfs.balanceOf(elementaryUnusedMintAddress),
      advancedUnusedMintAddressDfs: await dfs.balanceOf(advancedUnusedMintAddress),
      elementaryMintAddressDfs: await dfs.balanceOf(elementaryMintAddress),
      advancedMintAddressDfs: await dfs.balanceOf(advancedMintAddress),
      daoDFS: BigNumber.from(0),
      bondDfs: await dfs.balanceOf(bond.address),
      addLiquiditySupply: await bond.addLiquiditySupply(),
      customSupply: await bond.customSupply(),
      dfsTotalSupply: await dfs.totalSupply(),
      costSupply: await bond.costSupply(),
      totalPayout: await bond.totalPayout(),
      unstakeNFTDFS: await dfs.balanceOf(unstakeNFTAddress),
      nftMarketDestroyedDFS: await dfs.balanceOf(nftMarketDestroyAddress),
      withdrawedSocialReward: await dfsMining.withdrawedSocialReward(),
      withdrawedSavingReward: await dfsMining.withdrawedSavingReward(),
      bondUsed: BigNumber.from(0),
      bondRewardWithdrawed: BigNumber.from(0),
      solitaryReserves: 0,
      inflationRate: 0,
      debtRatio: 0,
      currentCirculationSupply: BigNumber.from(0),
      totalCirculationSupply: BigNumber.from(0),
      targetInflationRate: await bond.targetInflationRate(),
    }

    dashboard.tvl = numerator.mul(2).add(parseEther('10000'))

    dashboard.daoDFS = (await Promise.all(dao.map(async (d) => dfs.balanceOf(d)))).reduce((accum, curr) => {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      accum = accum.add(curr)
      return accum
    }, BigNumber.from(0))

    setHolderLength(await dfs.getHoldersLength())

    const buyers = await bond.getBuyers()

    await Promise.all(
      buyers.map(async (buyer) => {
        const referral = await bond.addressToReferral(buyer)
        dashboard.bondUsed = dashboard.bondUsed.add(referral.bondUsed)
        dashboard.bondRewardWithdrawed = dashboard.bondRewardWithdrawed.add(referral.bondRewardWithdrawed)
      }),
    )
    dashboard.currentCirculationSupply = dashboard.dfsTotalSupply
      .sub(dashboard.daoDFS)
      .sub(dashboard.foundationDFS)
      .sub(dashboard.bondDfs).sub(await dfs.balanceOf(bondAddress1))
      .sub(dashboard.unstakeNFTDFS)
      .sub(dashboard.nftMarketDestroyedDFS)
      .sub(dashboard.elementaryUnusedMintAddressDfs)
      .sub(dashboard.advancedUnusedMintAddressDfs)
      .sub(dashboard.elementaryMintAddressDfs)
      .sub(dashboard.advancedMintAddressDfs)
      .sub(dashboard.initialSupply)
      .add(dashboard.addLiquiditySupply)
      .add(dashboard.costSupply)

    dashboard.totalCirculationSupply = dashboard.totalPayout
      .mul(1250)
      .div(1000)
      .add(dashboard.withdrawedSocialReward)
      .add(dashboard.withdrawedSavingReward)
      .add(denominator)
      .add(dashboard.customSupply)
      .add(dashboard.costSupply)

    if (dashboard.currentCirculationSupply.gt(0)) {
      dashboard.solitaryReserves =
        parseFloat(formatUnits(numerator)) / parseFloat(formatUnits(dashboard.currentCirculationSupply))
      const debtRatio =
        (parseFloat(formatUnits(dashboard.totalPayout.sub(dashboard.bondUsed))) * 100) /
        parseFloat(formatUnits(dashboard.currentCirculationSupply))
      dashboard.debtRatio = debtRatio
      if (dashboard.marketPrice > 0 && dashboard.solitaryReserves > 0) {
        dashboard.inflationRate = (dashboard.marketPrice - dashboard.solitaryReserves) / dashboard.marketPrice
      }
    }

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
    return { ...dashboard, ...json }
  })

  const conentractions = Object.keys(data?.concentration ?? {}).map((key) => data?.concentration[key])
  // eslint-disable-next-line no-return-assign, no-param-reassign
  const avgConentraction = conentractions.reduce((acc, cur) => (acc += cur), 0) / conentractions.length

  const time = new Date()

  const expansionFund =
    data?.foundationDFS &&
    data?.marketPrice &&
    (parseFloat(formatUnits(data?.foundationDFS)) * data?.marketPrice).toFixed(2)
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
          {/* <div aria-hidden="true" className={`${activeTab === 'Chart' && 'active'}`} onClick={() => clickTab('Chart')}>
            {t('Chart')}
          </div> */}
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
                            <DataCell
                              title={t('TVL')}
                              data={data?.tvl && `$${formatBigNumber(data?.tvl, 2)}`}
                              style={{ fontSize: '32px' }}
                            />
                            <DataCell title="" data="" imgUrl="/images/dashboard/tvl.svg" />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className={`${classes.hasRLBorder} cell-sub-item`}>
                            <DataCell
                              title={t('Total circulation')}
                              data={
                                data?.totalCirculationSupply &&
                                `${formatBigNumber(data?.totalCirculationSupply, 2)} DFS`
                              }
                            />
                            <DataCell
                              title={t('Solitary Reserve')}
                              data={data?.solitaryReserves && `$${formatNumber(data?.solitaryReserves, 2)}`}
                            />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Current circulation volume')}
                              data={
                                data?.currentCirculationSupply &&
                                `${formatBigNumber(data?.currentCirculationSupply, 2)} DFS`
                              }
                              imgUrl="/images/dashboard/rf.svg"
                            />
                            <DataCell
                              title={t('Expansion Fund')}
                              data={expansionFund && `$${expansionFund}`}
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
                          {data?.targetInflationRate ? (
                            <div className="ctir-data">{data?.targetInflationRate}%</div>
                          ) : (
                            <Skeleton width={100} />
                          )}
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
                            <DataCell
                              title={t('Household savings rate')}
                              data={data?.houseHoldSavingsRate && `${data?.houseHoldSavingsRate}%`}
                              progressColor="#f200ff"
                            />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="cell-sub-item"
                            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <DataCell
                              title={t('DSGE suitability')}
                              data={data?.DSGE && `${data?.DSGE ?? 0}%`}
                              progressColor="#01ffed"
                            />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Inflation')}
                              data={data?.inflationRate && `${(data?.inflationRate * 100).toFixed(2)}%`}
                              progressColor="#f5d700"
                            />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Debt ratio')}
                              data={data?.debtRatio && `${formatNumber(data?.debtRatio ?? 0, 2)}%`}
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
                          data={holderLength && holderLength.toString()}
                          titleStyle={{ color: '#ABB6FF' }}
                        />
                        <DataCell
                          title={t('Attention Factor')}
                          data={conentractions && avgConentraction?.toString()}
                          titleStyle={{ color: '#ABB6FF' }}
                        />
                        <DataCell
                          title={t('Call Factor')}
                          data={data?.callFactor && data?.callFactor.toString()}
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
                          data={expansionFund && `$${expansionFund}`}
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

        {/* echarts */}
        {false && !(isMobile && activeTab !== 'Chart') ? (
          <>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={7} md={7} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
                    <OneGraph />
                  </Paper>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
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
                      <Paper className="dfs-card dfs-chart-card">
                        <ThreeGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="dfs-card dfs-chart-card">
                        <FourGraph />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="dfs-card dfs-chart-card" style={{ height: '238px' }}>
                        <FiveGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="dfs-card dfs-chart-card" style={{ height: '238px' }}>
                        <SixGraph />
                      </Paper>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Paper className="dfs-card dfs-chart-card" style={{ height: '238px' }}>
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
                  <Paper className="dfs-card dfs-chart-card">
                    <EightGraph />
                  </Paper>
                </Grid>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
                    <NineGraph />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Paper className="dfs-card dfs-chart-card">
                <TenGraph />
              </Paper>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
                    <ElevenGraph />
                  </Paper>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
                    <TwelveGraph />
                  </Paper>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Paper className="dfs-card dfs-chart-card">
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
