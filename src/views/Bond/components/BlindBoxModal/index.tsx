import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@material-ui/core'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal, ContentWrap, CardItem, CardImg, BtnWrap, TakeCardBtn, JumpBtnCont } from './styles'

interface BondModalProps {
  nftData: NftToken[]
  onClose: () => void
}

const MintBoxModal: React.FC<BondModalProps> = ({ nftData, onClose }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  return (
    <StyledModal width={528} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <Grid container spacing={2}>
          {nftData.length &&
            nftData.map((nft) => (
              <Grid item lg={6} md={6} sm={6} xs={6} key={nft.tokenId}>
                <CardItem key={`${nft?.tokenId}-${nft?.collectionName}`}>
                  <CardImg src={nft?.image.thumbnail} />
                </CardItem>
              </Grid>
            ))}
        </Grid>
        <BtnWrap>
          <TakeCardBtn>{t('Continue to Mint')}</TakeCardBtn>
          <TakeCardBtn onClick={() => router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)}>
            <JumpBtnCont>{t('Continue to Compose NFTs')}</JumpBtnCont>
          </TakeCardBtn>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default MintBoxModal
