import CircularProgress from '@material-ui/core/CircularProgress'
import { Skeleton } from '@pancakeswap/uikit'

interface Props {
  title: string
  data: string
  style?: React.CSSProperties
  imgStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  imgUrl?: string
  progressColor?: string
  isLoading?: boolean
}
export const DataCell: React.FC<Props> = (props) => {
  return (
    <div className="data-box" style={props.style}>
      <div>
        <div className="data-cell-title" style={props.titleStyle}>
          {props.title}
        </div>
        {props.data !== undefined && props.data !== 'NaN' ? (
          <div className="data-cell-content">{props.data}</div>
        ) : (
          <Skeleton width={100} />
        )}
      </div>
      {props.imgUrl && (
        <div className="data-cell-img">
          <img src={props.imgUrl} style={props.imgStyle} alt="" />
        </div>
      )}
      {props.progressColor && (
        <div className="data-cell-img">
          <CircularProgress
            variant="determinate"
            style={{ color: 'rgba(171, 182, 255, 0.1)', position: 'absolute', left: 0, right: 0, margin: 'auto' }}
            size={44}
            thickness={8}
            value={100}
          />
          <CircularProgress
            variant="determinate"
            size={44}
            thickness={8}
            style={{ color: props.progressColor, position: 'absolute', left: 0, right: 0, margin: 'auto' }}
            value={parseInt(props.data)}
          />
        </div>
      )}
    </div>
  )
}
