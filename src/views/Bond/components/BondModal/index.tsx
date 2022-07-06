import { FC, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { CloseIcon, CogIcon, InfoIcon } from '@pancakeswap/uikit'
import { StyledModal, ContentWrap, HeaderWrap, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, ImgWrap, FromImg, ToImg, BondName, BondTime, TipsWrap, TipsText,  BondListItemBtn, ListItem, ListLable, ListContent,
  TabList, TabItem, MoneyLable, MoneyInput, RecomandWrap, CheckBoxWrap, CheckBox, RecomandLable, RecomandInput } from './styles'

interface BondModalProps {
  bondData: any;
  isApprove: boolean;
  account: string;
  getApprove: () => void;
  onClose: () => void;
  openSettingModal: () => void;
}

const BondModal: React.FC<BondModalProps> = ({
  bondData,
  isApprove,
  account,
  getApprove,
  onClose,
  openSettingModal
}) => {
  const { t } = useTranslation();
  const [hasRecomand, sethasRecomand] = useState<boolean>(false);
  const [recomander, setRecomander] = useState<string>();
  const [money, setMoney] = useState<number>();
  const [activeTab, setActiveTab] = useState<string>("mint");
  const changeRecomand = () => {
    setRecomander('')
    sethasRecomand(!hasRecomand)
  }
  const clickTab = (key) => {
    setActiveTab(key)
  }

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
        <CogIcon width="24px" color="#ABB6FF" onClick={openSettingModal} />
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
      {/* mint or redeem choice */}
      {
        account && 
        <TabList>
          <TabItem className={`${activeTab === "mint" && "active"}`} onClick={() => clickTab("mint")}>
            {t('mint')}
          </TabItem>
          <TabItem className={`${activeTab === "redeem" && "active"}`} onClick={() => clickTab("redeem")}>
            {t('redeem')}
          </TabItem>
        </TabList>
      }
      { account && isApprove && activeTab === "mint" &&
          <>
            <MoneyLable>Money</MoneyLable>
            <MoneyInput prefix="￥" suffix="ALL" value={money} />
            <RecomandWrap>
              <CheckBoxWrap onClick={changeRecomand}>
                {
                  hasRecomand ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: "4px" }} /> : <CheckBox />
                }
              </CheckBoxWrap>
              <RecomandLable onClick={changeRecomand}>Does anyone recommend</RecomandLable>
              {
                hasRecomand ? <RecomandInput value={recomander} placeholder="Please enter references" /> : null
              }
            </RecomandWrap>
            <BondListItemBtn>{t('Buy')}</BondListItemBtn>
          </>
        }
        {
          account && isApprove && activeTab === "redeem"  && <BondListItemBtn>{t('Claim')}</BondListItemBtn>
        }
        {
          account && !isApprove && 
          <>
            <TipsWrap>
              <InfoIcon  width="20px" color="#ABB6FF" />
              <TipsText>First time bonding LUSD-OHM LP?Please approve Olympus Dao to useyourLUSD-OHMLP for bonding</TipsText>
            </TipsWrap>
            <BondListItemBtn onClick={getApprove}>Approve</BondListItemBtn>
          </>
        }

        { !account && 
          <>
            <TipsWrap>
                <InfoIcon  width="20px" color="#ABB6FF" />
                <TipsText>You need to connect the wallet to operate</TipsText>
              </TipsWrap>
            <BondListItemBtn>Connection</BondListItemBtn>
          </>
        }
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

export default BondModal