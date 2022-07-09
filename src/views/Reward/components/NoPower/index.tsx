import { useTranslation } from 'contexts/Localization'
import { NoConnectWrap, NoConnectConLeft, NoConnectConLeftTitle, NoConnectConLeftDes, NoConnectConLeftBtn,
  NoConnectConRight, NoConnectConRightImg, NoConnectConRightLine } from "./style"
import { useMatchBreakpoints } from "../../../../../packages/uikit/src/hooks";

interface NoPowerProps {
  title: string;
  description: string;
  btnText: string;
  action: () => void;
}

const NoPower: React.FC<NoPowerProps> = ({
  title,
  description,
  btnText,
  action
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints();
  return (
    <NoConnectWrap>
      <NoConnectConLeft isMobile={isMobile}>
        <NoConnectConLeftTitle>{title}</NoConnectConLeftTitle>
        <NoConnectConLeftDes>{description}</NoConnectConLeftDes>
        <NoConnectConLeftBtn onClick={action}>{btnText}</NoConnectConLeftBtn>
      </NoConnectConLeft>
      <NoConnectConRight isMobile={isMobile}>
        <NoConnectConRightImg src="/images/reward/noPowerBg.png"/>
        <NoConnectConRightLine src="/images/reward/noPowerLine.png"/>
      </NoConnectConRight>
    </NoConnectWrap>
    )
}
export default NoPower;