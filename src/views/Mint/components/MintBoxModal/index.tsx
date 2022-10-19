import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@material-ui/core'
import { StyledModal, ContentWrap, CardItem, CardImg, CardText, BtnWrap, TakeCardBtn, JumpBtnCont } from './styles'

interface BondModalProps {
  data: any[]
  onClose: () => void
}

const levelToName = {
  '0': 'Lord fragment',
  '1': 'Lord',
  '2': 'Golden Lord',
  '3': 'General',
  '4': 'Golden General',
  '5': 'Congressman',
  '6': 'Golden Congressman',
}

const MintBoxModal: React.FC<BondModalProps> = ({ data, onClose }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  return (
    <StyledModal width={528} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <Grid container spacing={2}>
          {data.length &&
            data.map((card) =>
              card.tokenIds.length ? (
                <Grid item lg={6} md={6} sm={6} xs={6} key={card.id}>
                  <CardItem key={card.id}>
                    <CardImg src={`/images/nfts/${card.level}`} />
                    <CardText>
                      {t('amount')}: {card.tokenIds.length} {levelToName[card.level]}{' '}
                      {card.tokenIds.map((tokenId) => `#${tokenId}`)}
                    </CardText>
                  </CardItem>
                </Grid>
              ) : null,
            )}
        </Grid>
        <BtnWrap>
          <TakeCardBtn onClick={onClose}>{t('Continue to Mint')}</TakeCardBtn>
          <TakeCardBtn onClick={() => router.push(`/profile/${account.toLowerCase()}`)}>
            <JumpBtnCont>{t('Continue to Compose NFTs >')}</JumpBtnCont>
          </TakeCardBtn>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default MintBoxModal
