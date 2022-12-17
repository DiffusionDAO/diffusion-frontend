import { Box, LinearProgress, Typography } from '@material-ui/core'
import { useTranslation } from '@pancakeswap/localization'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { formatUnits } from '@ethersproject/units'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import DiffusionChart from '../../../../components/Recharts/DiffusionChart'
import { bulletpoints, dataKey, headerText, itemType, tooltipInfoMessages, tooltipItems } from '../../dashboardData'
import { dashboardMock } from '../../MockData'

// eslint-disable-next-line react/jsx-filename-extension
export const Graph = ({ children }) => <>{children}</>

const { dashboardData } = dashboardMock

const menuItemData = [
  { label: '1s', value: '1s' },
  { label: '1h', value: '1h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' },
  { label: '1m', value: '1m' },
]
export const OneGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="bar"
      data={dashboardData}
      menuItemData={menuItemData}
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      dataKey={dataKey().tvl}
      headerText={t(headerText().tvl)}
      stroke={['#0031FF']}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={t(tooltipInfoMessages().tvl)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      headerSubText={`${dashboardData && formatUnits(dashboardData[0]?.tvl)}`}
    />
  )
}
export const TwoGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().two}
      stopColor={[['#3D72FD', '#3D72FD']]}
      stroke={['#3D72FD']}
      headerText={t(headerText().two)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0]?.two)}`}
      bulletpointColors={bulletpoints.two}
      itemNames={tooltipItems.two}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().two)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

export const ThreeGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const HeaderSuElement = () => {
    return (
      <Box display="flex">
        {tooltipItems.three.map((item) => (
          <Box display="flex" alignItems="center" marginRight="20px">
            <Typography
              variant="h6"
              className="card-sub-title-fixation-text"
              style={{ fontWeight: 400, color: 'rgb(171, 182, 255)', fontSize: '14px' }}
            >
              {t(item)}
            </Typography>
            <Typography variant="h5" style={{ fontWeight: 'bold', marginRight: 5, color: '#fff', fontSize: '20px' }}>
              {`${dashboardData && formatUnits(dashboardData[0]?.one)}`}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      menuItemData={menuItemData}
      dataKey={dataKey().three}
      stopColor={[
        ['#3D72FD', '#3D72FD'],
        ['#F200FF', '#F200FF'],
      ]}
      stroke={['#3D72FD', '#F200FF']}
      headerText={t(headerText().three)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0]?.three1)}`}
      bulletpointColors={bulletpoints.three}
      itemNames={tooltipItems.three}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().three)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      // HeaderSuElement={<HeaderSuElement />}
    />
  )
}
export const FourGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="bar"
      data={dashboardData}
      menuItemData={menuItemData}
      itemType={itemType.dollar}
      itemNames={tooltipItems.four}
      dataKey={dataKey().four}
      headerText={t(headerText().four)}
      stroke={['#D257FF']}
      bulletpointColors={bulletpoints.four}
      infoTooltipMessage={t(tooltipInfoMessages().four)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      headerSubText={`${dashboardData && formatUnits(dashboardData[0]?.four)}`}
    />
  )
}

export const FiveGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="line"
      data={dashboardData}
      dataKey={dataKey().five}
      stroke={['#26E6C5']}
      headerText={t(headerText().five)}
      headerSubText={`${dashboardData && formatNumber(dashboardData[0].five, 1)} Days`}
      dataFormat="days"
      bulletpointColors={bulletpoints.five}
      itemNames={tooltipItems.five}
      itemType=""
      infoTooltipMessage={t(tooltipInfoMessages().five)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      minHeight={150}
    />
  )
}

export const SixGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="line"
      data={dashboardData}
      dataKey={dataKey().six}
      stroke={['#EC6EFF']}
      headerText={t(headerText().six)}
      headerSubText={`${dashboardData && formatNumber(dashboardData[0].six, 1)} Days`}
      dataFormat="days"
      bulletpointColors={bulletpoints.six}
      itemNames={tooltipItems.six}
      itemType=""
      infoTooltipMessage={t(tooltipInfoMessages().six)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      minHeight={150}
    />
  )
}

export const SevenGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="line"
      data={dashboardData}
      dataKey={dataKey().seven}
      stroke={['#DF741A']}
      headerText={t(headerText().seven)}
      headerSubText={`${dashboardData && formatNumber(dashboardData[0].seven, 1)}`}
      dataFormat="days"
      bulletpointColors={bulletpoints.seven}
      itemNames={tooltipItems.seven}
      itemType=""
      infoTooltipMessage={t(tooltipInfoMessages().seven)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      minHeight={150}
    />
  )
}

export const EightGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const HeaderSuElement = () => {
    return (
      <Box display="flex">
        {tooltipItems.three.map((item) => (
          <Box display="flex" alignItems="center" marginRight="20px">
            <Typography
              variant="h6"
              className="card-sub-title-fixation-text"
              style={{ fontWeight: 400, color: 'rgb(171, 182, 255)', fontSize: '14px' }}
            >
              {item}
            </Typography>
            <Typography variant="h5" style={{ fontWeight: 'bold', marginRight: 5, color: '#fff', fontSize: '20px' }}>
              {`${dashboardData && formatUnits(dashboardData[0].one)}`}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      menuItemData={menuItemData}
      dataKey={dataKey().eight}
      stopColor={[
        ['#3D72FD', '#3D72FD'],
        ['#F200FF', '#F200FF'],
      ]}
      stroke={['#3D72FD', '#F200FF']}
      lineType="linear"
      headerText={t(headerText().eight)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].eight1)}`}
      bulletpointColors={bulletpoints.eight}
      itemNames={tooltipItems.eight}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().eight)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      // HeaderSuElement={<HeaderSuElement />}
    />
  )
}

export const NineGraph = () => {
  const { t } = useTranslation()
  // const useStyles = makeStyles({
  //   root: {
  //     height: 10,
  //     borderRadius: 5,
  //   },
  //   bar: {
  //     borderRadius: 5,
  //     background: `linear-gradient(228deg, #F576FF 0%, #7200FF 50%, #3900FF 100%)`,
  //   },
  // });
  // const classes = useStyles();
  // const HeaderSuElement = () => {
  //   return (
  //     <Box display="flex" alignItems="center">
  //       <Typography
  //         variant="h6"
  //         className="card-sub-title-fixation-text"
  //         style={{ fontWeight: 400, color: "rgb(171, 182, 255)", fontSize: "14px" }}
  //       >
  //         Today
  //       </Typography>
  //       <Box width="100%" marginRight="10px">
  //         <LinearProgress variant="determinate" classes={{ root: classes.root, bar: classes.bar }} value={20} />
  //       </Box>
  //       <Typography variant="body2" color="textSecondary">{`${20}%`}</Typography>
  //     </Box>
  //   );
  // };
  return (
    <DiffusionChart
      type="verticalBar"
      data={dashboardData}
      dataKey={dataKey().nine}
      stopColor={[['#00A1FF', '#26E6C5']]}
      stroke={['#00A1FF']}
      headerText={t(headerText().nine)}
      dataFormat="days"
      menuItemData={menuItemData}
      bulletpointColors={bulletpoints.nine}
      itemType={itemType.dollar}
      itemNames={tooltipItems.nine}
      infoTooltipMessage={t(tooltipInfoMessages().nine)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].nine)}`}
      // HeaderSuElement={<HeaderSuElement />}
    />
  )
}

export const TenGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="line"
      data={dashboardData}
      menuItemData={menuItemData}
      dataKey={dataKey().ten}
      stroke={['#DF741A']}
      lineType="linear"
      headerText={t(headerText().ten)}
      headerSubText={`${dashboardData && formatNumber(dashboardData[0].ten, 1)} Days`}
      dataFormat="days"
      bulletpointColors={bulletpoints.ten}
      itemNames={tooltipItems.ten}
      itemType=""
      infoTooltipMessage={t(tooltipInfoMessages().ten)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

export const ElevenGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().eleven}
      stopColor={[['#FB0158', '#FB0158']]}
      stroke={['#FB0158']}
      headerText={t(headerText().eleven)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].eleven)}`}
      bulletpointColors={bulletpoints.eleven}
      itemNames={tooltipItems.eleven}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().eleven)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

// 第12个指标
export const TwelveGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().twelve}
      stopColor={[['#DF741A', '#DF741A']]}
      stroke={['#DF741A']}
      headerText={t(headerText().twelve)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].twelve)}`}
      bulletpointColors={bulletpoints.twelve}
      itemNames={tooltipItems.twelve}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().twelve)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

// 第13个指标
export const ThirteenGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().thirteen}
      stopColor={[['#1C6CFF', '#1C6CFF']]}
      stroke={['#1C6CFF']}
      headerText={t(headerText().thirteen)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].thirteen)}`}
      bulletpointColors={bulletpoints.thirteen}
      itemNames={tooltipItems.thirteen}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().thirteen)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

export const MarketValueGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().coin}
      stopColor={[
        ['#c2efdb', '#c2efdb'],
        ['#bdd2fd', '#bdd2fd'],
      ]}
      stroke={['#c2efdb', '#bdd2fd']}
      headerText={t(headerText().coin)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].treasuryDaiMarketValue)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().mvt)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

export const AreaGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="area"
      data={dashboardData}
      dataKey={dataKey().coin}
      stopColor={[['#c2efdb', '#c2efdb']]}
      headerText={t(headerText().coin)}
      headerSubText={`${dashboardData && formatUnits(dashboardData[0].treasuryDaiMarketValue)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={t(tooltipInfoMessages().mvt)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}

export const RunwayAvailableGraph = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <DiffusionChart
      type="line"
      data={dashboardData}
      dataKey={dataKey().runway}
      stroke={['#5d91f9']}
      headerText={t(headerText().runway)}
      headerSubText={`${dashboardData && formatNumber(dashboardData[0].runwayCurrent, 1)} Days`}
      dataFormat="days"
      bulletpointColors={bulletpoints.runway}
      itemNames={tooltipItems.runway}
      itemType=""
      infoTooltipMessage={t(tooltipInfoMessages().runway)}
      expandedGraphStrokeColor="rgba(171, 182, 255, 0.05)"
    />
  )
}
