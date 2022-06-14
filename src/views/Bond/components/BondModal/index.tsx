import { useTranslation } from 'contexts/Localization'
import { Button } from 'antd'
import { CloseIcon, CogIcon, InfoIcon } from '@pancakeswap/uikit'
import { StyledModal, ContentWrap, HeaderWrap, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, ImgWrap, FromImg, ToImg, BondName, BondTime, TipsWrap, TipsText,  BondListItemBtn } from './styles'

interface BondModalProps {
  bondData: any;
  onClose: () => void;
}

const BondModal: React.FC<BondModalProps> = ({
  bondData,
  onClose,
}) => {
  const { t } = useTranslation()

  return (
    <StyledModal
      width={500}
      className="no-header"
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <ContentWrap>
        {/* 头部按钮 */}
        <HeaderWrap>
          <CogIcon width="24px" color="#ABB6FF" />
          <CloseIcon width="24px" color="#ABB6FF" />
        </HeaderWrap>
        {/* 中间内容 */}
        <BondListItem>
          <BondListItemHeader>
            <ImgWrap>
              <FromImg src={bondData.from} />
              <ToImg src={bondData.to} />
            </ImgWrap>
            <BondName>{bondData.name}</BondName>
            <BondTime>{bondData.duration}day</BondTime>
          </BondListItemHeader>
          <BondListItemContent>
            <ContentCell>
              <CellTitle>Bond Price</CellTitle>
              <CellText >${bondData.price}</CellText>
            </ContentCell>
            <ContentCell>
              <CellTitle>Market Price</CellTitle>
              <CellText >${bondData.price}</CellText>
            </ContentCell>
          </BondListItemContent>
        </BondListItem>
        <TipsWrap>
          <InfoIcon  width="20px" color="#ABB6FF" />
          <TipsText>First time bonding LUSD-OHM LP?Please approve Olympus Dao to useyourLUSD-OHMLP for bonding</TipsText>
        </TipsWrap>
        {/* 按钮 */}
        <BondListItemBtn>Connection</BondListItemBtn>
      </ContentWrap>
    </StyledModal>
  )
}

export default BondModal