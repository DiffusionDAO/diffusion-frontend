import { useTranslation } from 'contexts/Localization'
import { NoConnectWrap, NoConnectConLeft, NoConnectConLeftTitle, NoConnectConLeftDes, NoConnectConLeftBtn,
  NoConnectConRight, NoConnectConRightImg, NoConnectConRightLine } from "./style"


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
  return (
    <NoConnectWrap>
      <NoConnectConLeft>
        <NoConnectConLeftTitle>{title}</NoConnectConLeftTitle>
        <NoConnectConLeftDes>{description}</NoConnectConLeftDes>
        <NoConnectConLeftBtn onClick={action}>{btnText}</NoConnectConLeftBtn>
      </NoConnectConLeft>
      <NoConnectConRight>
        <NoConnectConRightImg src="/images/reward/noPowerBg.png"/>
        <NoConnectConRightLine src="/images/reward/noPowerLine.png"/>
      </NoConnectConRight>
    </NoConnectWrap>
    )
}
export default NoPower;