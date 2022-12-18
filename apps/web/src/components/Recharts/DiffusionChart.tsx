import { Box, CircularProgress, MenuItem, Select, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { Tooltip as InfoTooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CSSProperties, useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CategoricalChartProps } from 'recharts/types/chart/generateCategoricalChart'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

import CustomDiffusionTooltip from './CustomDiffusionTooltip'
import DiffusionExpandedChart from './DiffusionExpandedChart'

const tickCount = 3
const expandedTickCount = 5

const renderExpandedChartStroke = (isExpanded: boolean, color: string) => {
  return isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : ''
}

interface MenuItemObj {
  label: string
  value: string | number
}
type LineType =
  | 'basis'
  | 'basisClosed'
  | 'basisOpen'
  | 'linear'
  | 'linearClosed'
  | 'natural'
  | 'monotoneX'
  | 'monotoneY'
  | 'monotone'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'

const renderAreaChart = (
  data: any[],
  dataKey: string[],
  stopColor: string[][],
  stroke: string[],
  dataFormat: string,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps['margin'],
  lineType: LineType,
) => (
  <AreaChart data={data} margin={margin}>
    <defs>
      {stopColor &&
        stopColor.map((item: string[], index: number) => (
          <linearGradient id={`color-${dataKey[index]}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={item[0]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={item[1]} stopOpacity={0} />
          </linearGradient>
        ))}
    </defs>
    <XAxis dataKey="timestamp" padding={{ right: 20 }} />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === 'percent' ? 33 : 55}
      tickFormatter={(number) =>
        number !== 0
          ? dataFormat !== 'percent'
            ? `${formatNumber(parseFloat(number) / 1000000)}M`
            : `${formatNumber(parseFloat(number), 2)}%`
          : ''
      }
      domain={[0, 'auto']}
      dx={3}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomDiffusionTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />
      }
    />
    {dataKey.map((item: string, index: number) => (
      <Area
        type={lineType}
        dataKey={item}
        stroke={stroke && stroke[index] ? stroke[index] : 'none'}
        fill={stopColor && stopColor.length ? `url(#color-${dataKey[index]})` : stroke[index]}
        fillOpacity={1}
      />
    ))}
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
)

const renderMultiLineChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  color: string,
  dataFormat: string,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps['margin'],
  lineType: LineType,
) => (
  <LineChart data={data} margin={margin}>
    <XAxis dataKey="timestamp" padding={{ right: 20 }} />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={25}
      tickFormatter={(number) => (number !== 0 ? `${formatNumber(parseFloat(number), 2)}` : '')}
      domain={[0, 'auto']}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomDiffusionTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />
      }
    />
    {dataKey.map((item: string, index: number) => (
      <Line type={lineType} dataKey={item} stroke={stroke[index]} dot={false} />
    ))}
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
)

// JTBD: Bar chart for Holders
const renderBarChart = (
  data: any[],
  dataKey: string[],
  stopColor: string[][],
  stroke: string[],
  dataFormat: string,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps['margin'],
) => (
  <BarChart data={data} margin={margin}>
    <defs>
      {stopColor &&
        stopColor.map((item: string[], index: number) => (
          <linearGradient id={`color-${dataKey[index]}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={item[0]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={item[1]} stopOpacity={0} />
          </linearGradient>
        ))}
    </defs>
    <XAxis dataKey="timestamp" padding={{ right: 20 }} />
    <YAxis
      axisLine={false}
      tickLine={false}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      width={33}
      domain={[0, 'auto']}
      allowDataOverflow={false}
      tickFormatter={(number) => (number !== 0 ? number : '')}
    />
    <Tooltip
      cursor={{ fill: 'rgba(255,255,255,0.1)' }}
      content={
        <CustomDiffusionTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />
      }
    />
    {dataKey.map((item: string, index: number) => (
      <Bar
        dataKey={dataKey[0]}
        radius={4}
        maxBarSize={18}
        fill={stopColor && stopColor.length ? `url(#color-${dataKey[index]})` : stroke[index]}
      />
    ))}
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </BarChart>
)

const renderVerticalBarChart = (
  data: any[],
  dataKey: string[],
  stopColor: string[][],
  stroke: string[],
  dataFormat: string,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps['margin'],
) => (
  <BarChart data={data} margin={margin} layout="vertical">
    <defs>
      {stopColor &&
        stopColor.map((item: string[], index: number) => (
          // 渐变遵循svg的设置
          // 当y1和y2相等，x1和x2不同时，创建水平渐变
          // 当x1和x2相等，y1和y2不同时，创建垂直渐变
          <linearGradient id={`color-${dataKey[index]}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor={item[0]} stopOpacity={1} />
            <stop offset="95%" stopColor={item[1]} stopOpacity={1} />
          </linearGradient>
        ))}
    </defs>
    <XAxis type="number" axisLine={false} tickLine={false} />
    <YAxis dataKey="timestamp" type="category" scale="band" axisLine={false} tickLine={false} />
    <Tooltip
      content={
        <CustomDiffusionTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />
      }
    />
    {dataKey.map((item: string, index: number) => (
      <Bar
        dataKey={item}
        fillOpacity={1}
        fill={stopColor && stopColor.length ? `url(#color-${dataKey[index]})` : stroke[index]}
        radius={5}
        maxBarSize={10}
        background={{
          radius: 5,
          fill: 'rgba(171, 182, 255, 0.1)',
        }}
        label={{ fill: '#fff', fontSize: 12, position: 'right' }}
      />
    ))}
  </BarChart>
)

function DiffusionChart({
  type,
  data,
  scale,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  infoTooltipMessage,
  expandedGraphStrokeColor,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 10,
  },
  menuItemData,
  lineType = 'monotone',
  HeaderSuElement,
  minHeight = 260,
}: {
  type: string
  data: any[]
  scale: string
  dataKey: string[]
  color: string
  stopColor: string[][]
  stroke: string[]
  headerText: string
  dataFormat: string
  headerSubText: string
  bulletpointColors: CSSProperties[]
  itemNames: string[]
  itemType: string
  infoTooltipMessage: string
  expandedGraphStrokeColor: string
  margin?: CategoricalChartProps['margin']
  menuItemData: MenuItemObj[]
  lineType: LineType
  HeaderSuElement?: JSX.IntrinsicElements
  minHeight: number
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderChart = (type: string, isExpanded = false) => {
    if (type === 'line')
      return renderMultiLineChart(
        data,
        dataKey,
        stroke,
        color,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
        lineType,
      )
    if (type === 'area')
      return renderAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
        lineType,
      )
    if (type === 'bar')
      return renderBarChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
      )
    if (type === 'verticalBar')
      return renderVerticalBarChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
      )
    return <></>
  }

  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  }, [data])

  return loading ? (
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box style={{ width: '100%', height: '100%' }}>
      <div className="chart-card-header">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'space-between' }}
        >
          <Box display="flex" alignItems="center" style={{ display: 'flex' }}>
            <Typography
              variant="h4"
              className="card-title-text"
              style={{ fontWeight: 600, overflow: 'hidden', color: '#6495f9', fontSize: '18px' }}
            >
              {t(headerText)}
            </Typography>
            <InfoTooltip title={t(infoTooltipMessage)}>
              <InfoCircleOutlined
                style={{ color: 'rgb(153, 153, 153)', marginLeft: '10px', fontSize: '18px', cursor: 'pointer' }}
              />
            </InfoTooltip>
          </Box>
          <Box display="flex" alignItems="center" style={{ display: 'flex' }}>
            {menuItemData && menuItemData.length && (
              <Select
                label="Time"
                className="charts-select"
                style={{ width: '120px', height: '30px', marginRight: '8px' }}
              >
                {menuItemData.map((item) => {
                  return <MenuItem value={item.value}>{item.label}</MenuItem>
                })}
              </Select>
            )}

            <div
              aria-hidden="true"
              onClick={handleOpen}
              style={{ borderRadius: '5px', background: 'rgba(171, 182, 255, 0.1)', padding: '8px' }}
            >
              <img
                src="/images/dashboard/fullscreen.png"
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                alt=""
              />
            </div>
          </Box>

          <DiffusionExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
            HeaderSuElement={HeaderSuElement}
          />
        </Box>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          // HeaderSuElement || (
          <Box style={{ display: 'flex' }}>
            <Typography
              variant="h6"
              className="card-sub-title-fixation-text"
              style={{ fontWeight: 400, color: '#ABB6FF', fontSize: '14px' }}
            >
              Today
            </Typography>
            <Typography variant="h5" style={{ fontWeight: 'bold', marginRight: 5, color: '#fff', fontSize: '20px' }}>
              {headerSubText}
            </Typography>
          </Box>
          // )
        )}
      </div>
      <Box width="100%" minWidth={310} className="dfs-chart">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={minHeight} width="100%">
            {renderChart(type, true)}
          </ResponsiveContainer>
        ) : (
          <Skeleton variant="rect" width="100%" height={260} />
        )}
      </Box>
    </Box>
  )
}

export default DiffusionChart
