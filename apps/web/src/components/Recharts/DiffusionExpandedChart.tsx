import { Box, Typography } from '@material-ui/core'
import { Tooltip as InfoTooltip, Modal } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import React from 'react'
import { ResponsiveContainer } from 'recharts'

function DiffusionExpandedChart({
  open,
  handleClose,
  renderChart,
  data,
  infoTooltipMessage,
  headerText,
  headerSubText,
  runwayExtraInfo,
  HeaderSuElement,
}: {
  open: boolean
  handleClose: () => void
  renderChart: React.ReactElement
  data: any[]
  infoTooltipMessage: string
  headerText: string
  headerSubText: string
  runwayExtraInfo?: string
  HeaderSuElement?: JSX.IntrinsicElements
}) {
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width="calc(100% - 40px)"
      style={{
        minHeight: '450px',
      }}
    >
      <div className="chart-card-header">
        <Box display="flex" alignItems="center" style={{ display: 'flex' }}>
          <Typography
            variant="h4"
            className="card-title-text"
            style={{ fontWeight: 600, overflow: 'hidden', color: '#6495f9', fontSize: '18px' }}
          >
            {headerText}
          </Typography>
          <InfoTooltip title={infoTooltipMessage}>
            <InfoCircleOutlined
              style={{ color: 'rgb(153, 153, 153)', marginLeft: '10px', fontSize: '18px', cursor: 'pointer' }}
            />
          </InfoTooltip>
        </Box>

        {/* {HeaderSuElement || (
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              className="card-sub-title-fixation-text"
              style={{ fontWeight: 400, color: "#ABB6FF", fontSize: "14px" }}
            >
              Today
            </Typography>
            <Typography variant="h5" style={{ fontWeight: "bold", marginRight: 5, color: "#fff", fontSize: "20px" }}>
              {headerSubText}
            </Typography>
          </Box>
        )} */}
      </div>
      <div>
        <Box minWidth={300} width="100%">
          {data && data.length > 0 && (
            <ResponsiveContainer minHeight={260} minWidth={300}>
              {renderChart}
            </ResponsiveContainer>
          )}
        </Box>
        <Box display="flex" style={{ width: '100%', margin: '15px' }}>
          <Typography variant="h6" style={{ fontWeight: 400, color: '#ABB6FF', fontSize: '14px' }}>
            {infoTooltipMessage}
          </Typography>
        </Box>
      </div>
    </Modal>
  )
}

export default DiffusionExpandedChart
