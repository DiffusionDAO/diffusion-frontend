import { useTranslation } from '@pancakeswap/localization'
import { StyledModal, ContentWrap, DetailTable } from './styles'

interface DetailModalProps {
  detailData: any[]
  onClose: () => void
}

const DetailModal: React.FC<DetailModalProps> = ({ detailData, onClose }) => {
  const { t } = useTranslation()
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
  return (
    <StyledModal title={t('Detail')} width={600} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        {/* {detail} */}
        <DetailTable dataSource={detailData} columns={columns} pagination={false} />
      </ContentWrap>
    </StyledModal>
  )
}

export default DetailModal
