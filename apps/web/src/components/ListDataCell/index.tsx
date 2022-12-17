import { useTranslation } from '@pancakeswap/localization'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { CellWrap, LabelDiv, ValueDiv } from './style'

interface DataCellProps {
  label: string
  value: string
  position?: string
  valueDivStyle?: React.CSSProperties
}

const DataCell: React.FC<DataCellProps> = ({ label, value, position = 'vertical', valueDivStyle }) => {
  const { t } = useTranslation()
  return (
    <CellWrap position={position}>
      <LabelDiv>{label}</LabelDiv>
      <ValueDiv style={valueDivStyle}>{value}</ValueDiv>
    </CellWrap>
  )
}
export default DataCell
