import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBondContract } from 'hooks/useContract'
import { useEffect,useState } from 'react'
import bondDatas from 'views/Bond/bondData'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { StyledModal, ContentWrap, DetailTable } from './styles'

interface DetailModalProps {
  detailData: any[]
  onClose: () => void
  isBond?: boolean
}

const DetailModal: React.FC<DetailModalProps> = ({ detailData, onClose, isBond=true }) => {
  const [bondReward, setBondReward] = useState<BigNumber>(BigNumber.from(0))
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const bond = useBondContract()
  const columns = [
    {
      title: t('Address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('Value'),
      dataIndex: 'value',
      key: 'value',
    },
  ]
  useEffect(()=>{
    bond.bondRewardOf(account).then(res=>{setBondReward(res)})
  },[account])
  return (
    <StyledModal title={isBond?`${t('Detail')}: ${formatUnits(bondReward)}`:`${t('Detail')}`} width={600} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        {/* {detail} */}
        <DetailTable dataSource={detailData} columns={columns} pagination={false} />
      </ContentWrap>
    </StyledModal>
  )
}

export default DetailModal
