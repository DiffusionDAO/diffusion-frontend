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
      title: t('Contributors'),
      dataIndex: 'contributors',
      key: 'contributors',
    },
    {
      title: t('Contribution value'),
      dataIndex: 'results',
      key: 'results',
    },
  ]
  return (
    <StyledModal title={t('Detail')} width={600} onCancel={onClose} visible centered maskClosable={false} footer={[]}>
      <ContentWrap>
        {/* {detail} */}
        <DetailTable dataSource={detailData} columns={columns} pagination={false} />
      </ContentWrap>
    </StyledModal>
  )
}

export default DetailModal
