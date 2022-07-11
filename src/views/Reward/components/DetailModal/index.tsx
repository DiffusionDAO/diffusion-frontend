
import { useTranslation } from 'contexts/Localization'
import { StyledModal, ContentWrap, DetailTable} from './styles'

interface DetailModalProps {
  detailData: any[];
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  detailData,
  onClose,
}) => {
  const { t } = useTranslation()
  const columns = [
    {
      title: 'Contributors',
      dataIndex: 'contributors',
      key: 'contributors',
    },
    {
      title: 'Results',
      dataIndex: 'results',
      key: 'results',
    },
  ];
  return (
    <StyledModal
      title="Detail"
      width={528}
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <ContentWrap>
        {/* {detail} */}
        <DetailTable dataSource={detailData} columns={columns} pagination={false} />
      </ContentWrap>
    </StyledModal>
  )
}

export default DetailModal