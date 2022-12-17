import { Box, Paper, Typography } from '@material-ui/core'
import { CSSProperties } from 'react'

interface TooltipPayloadItem {
  value: number
  payload: {
    timestamp: number
  }
}
const renderDate = (index: number, payload: TooltipPayloadItem[], item: TooltipPayloadItem) => {
  return index === 0 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000).toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString('default', { month: 'long' }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ''
  )
}

const renderItem = (type: string, item: number) => {
  return type === '$' ? (
    <Typography variant="body2">{`${type}${Math.round(item).toLocaleString('en-US')}`}</Typography>
  ) : (
    <Typography variant="body2">{`${Math.round(item).toLocaleString('en-US')}${type}`}</Typography>
  )
}

const renderTooltipItems = (
  payload: TooltipPayloadItem[],
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
) => {
  return payload.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Box key={index}>
      <Box style={{ marginBottom: '20px' }}>{renderDate(index, payload, item)}</Box>
      <Box className="item" display="flex">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">
            <span className="tooltip-bulletpoint" style={bulletpointColors[index]} />
            {`${itemNames[index]}`}
          </Typography>
        </Box>
        {renderItem(itemType, item.value)}
      </Box>
    </Box>
  ))
}
function CustomDiffusionTooltip({
  active,
  payload,
  bulletpointColors,
  itemNames,
  itemType,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  bulletpointColors: CSSProperties[]
  itemNames: string[]
  itemType: string
}) {
  if (active && payload && payload.length) {
    return (
      <Paper className="tooltip-container">{renderTooltipItems(payload, bulletpointColors, itemNames, itemType)}</Paper>
    )
  }
  return null
}

export default CustomDiffusionTooltip
