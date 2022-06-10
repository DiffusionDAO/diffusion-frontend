import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface Props {
  title: string;
  data: string;
  style?: CSSProperties;
  imgStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  imgUrl?: string;
}
export const DataCell: React.FC<Props> = props => {
  return (
    <div className="data-box" style={props.style}>
      <div>
        <div className="data-cell-title" style={props.titleStyle}>
          {props.title}
        </div>
        <div className="data-cell-content">{props.data}</div>
      </div>
      {props.imgUrl && (
        <div className="data-cell-img">
          <img src={props.imgUrl} style={props.imgStyle} alt="" />
        </div>
      )}
    </div>
  );
};
