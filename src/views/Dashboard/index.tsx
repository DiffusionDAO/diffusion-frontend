import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { useTranslation } from '@pancakeswap/localization'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import useSWR from 'swr'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
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
    [theme.breakpoints.up(981)]: {
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    },
  },
}))

const { one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen } =
  dashboardMock.OverviewData

const Dashboard = () => {
  const { t } = useTranslation()

  // xs, extra-small: 0px or larger
  // sm, small: 600px or larger
  // md, medium: 960px or larger
  // lg, large: 1280px or larger
  // xl, xlarge: 1920px or larger
  const { isMobile } = useMatchBreakpoints()
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const clickTab = (tab: string) => {
    setActiveTab(tab)
  }
  const { data } = useSWR('dashboard', async () => {
    const response = await fetch('https://middle.diffusiondao.org/dashboard')
    const json = await response.json()
    return json
  })
  const conentractions = Object.keys(data?.concentration ?? {}).map((key) => data?.concentration[key])
  // eslint-disable-next-line no-return-assign, no-param-reassign
  const avgConentraction = conentractions.reduce((acc, cur) => (acc += cur), 0) / conentractions.length

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
            2020/09/09 22:22:22
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
                            <DataCell title={t('TVL')} data={`$${one}M`} style={{ fontSize: '32px' }} />
                            <DataCell title="" data="" imgUrl="/images/dashboard/tvl.svg" />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className={`${classes.hasRLBorder} cell-sub-item`}>
                            <DataCell title={t('Total circulation')} data={`$${two}M`} />
                            <DataCell title={t('Internal Reserves')} data={`$${three}M`} />
                          </div>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell
                              title={t('Current circulation volume')}
                              data={`$${four}M`}
                              imgUrl="/images/dashboard/rf.svg"
                            />
                            <DataCell title={t('Reserve Fund')} data={`$${five}M`} imgUrl="/images/dashboard/rm.svg" />
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
                            value={parseInt(six)}
                          />
                          <div className="ctir-data">{six}</div>
                        </div>
                        <div className="ctir-title">{t('Current inflation rate target')}</div>
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
                            <DataCell title={t('Household savings rate')} data={`${seven}%`} progressColor="#f200ff" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div
                            className="cell-sub-item"
                            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <DataCell title={t('DSGE suitability')} data={`${eight}%`} progressColor="#01ffed" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell title={t('Inflation')} data={`${nine}%`} progressColor="#f5d700" />
                          </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <div className="cell-sub-item">
                            <DataCell title={t('Debt ratio')} data={`${ten}%`} progressColor="#0131ff" />
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
                          title={t('Factors of attention')}
                          data={conentractions.length ? avgConentraction?.toString() : '0'}
                          titleStyle={{ color: '#ABB6FF' }}
                        />
                        <DataCell
                          title="Call factor"
                          data={thirteen}
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
                        <DataCell title={t('Reserve Fund')} data={`$${fourteen}M`} imgUrl="/images/dashboard/rz.svg" />
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
                {/* <Grid item lg={4} md={4} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <ElevenGraph />
              </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <TwelveGraph />
              </Paper>
            </Grid> */}
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