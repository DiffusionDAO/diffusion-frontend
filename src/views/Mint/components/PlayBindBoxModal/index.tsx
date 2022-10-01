import { StyledModal, PlayImage } from './styles'

interface PlayModalProps {
  onClose: () => void
  gifUrl: string
}

const PlayBindBoxModal: React.FC<PlayModalProps> = ({ onClose, gifUrl }) => {
  return (
    <StyledModal width={320} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <PlayImage src={gifUrl} />
    </StyledModal>
  )
}

export default PlayBindBoxModal
