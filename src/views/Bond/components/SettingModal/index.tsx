import { useTranslation } from 'contexts/Localization'
import { CloseIcon, ChevronLeftIcon, InfoIcon } from '@pancakeswap/uikit'
import { StyledModal, ContentWrap, HeaderWrap, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, ImgWrap, FromImg, ToImg, BondName, BondTime, TipsWrap, TipsText,  BondListItemBtn, ListItem, ListLable, ListContent } from './styles'

interface BondModalProps {
  bondData: any;
  onClose: () => void;
}

const SettingModal: React.FC<BondModalProps> = ({
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
          <ChevronLeftIcon width="24px" color="#ABB6FF" />
          <CloseIcon width="24px" color="#ABB6FF" onClick={onClose} />
        </HeaderWrap>
        {/* 中间内容 */}
        <BondListItem>
          <BondListItemHeader>
            <ImgWrap>
              <FromImg src={bondData.from} />
              <ToImg src={bondData.to} />
            </ImgWrap>
            <BondName>{bondData.name}</BondName>
            <BondTime>{bondData.duration}days</BondTime>
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
        <ListItem>
          <ListLable>Your Balance</ListLable>
          <ListContent>{bondData.balance}</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>Your Will Get</ListLable>
          <ListContent>{bondData.getFee}</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>Max You Can Buy</ListLable>
          <ListContent>{bondData.maxFee}</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>Your Balance</ListLable>
          <ListContent><TextColor isRise={bondData.discount>0}>{bondData.discount}</TextColor></ListContent>
        </ListItem>
        <ListItem>
          <ListLable>Duration</ListLable>
          <ListContent>{bondData.duration}days</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}

export default SettingModal