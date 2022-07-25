import { Flex, Text, Button, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'


const BtnWrap = styled(Button)`
border:none !important;
width: 100%;
font-size: 14px;
height: 40px;
line-height: 40px;
color: #fff;
text-align: center;
border-radius: 7px;
cursor: pointer;
background: linear-gradient(135deg,#3C00FF, #EC6EFF);
background-size: 400% 400%;
animation: gradient 5s ease infinite;
`

interface ConfirmStageProps {
  isConfirming: boolean
  handleConfirm: () => void
}

// Buy Flow:
// Shown in case user wants to pay with BNB
// or if user wants to pay with WBNB and it is already approved
// Sell Flow:
// Shown if user adjusts the price or removes NFT from the market
const ConfirmStage: React.FC<ConfirmStageProps> = ({ isConfirming, handleConfirm }) => {
  const { t } = useTranslation()
  return (
    <Flex p="16px" flexDirection="column">
      <Flex alignItems="center">
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Text fontSize="20px" bold color="secondary">
              {t('Confirm')}
            </Text>
          </Flex>
          <Text small color="textSubtle">
            {t('Please confirm the transaction in your wallet')}
          </Text>
        </Flex>
        <Flex flex="0 0 64px" height="72px" width="64px">
          {isConfirming && <Spinner size={64} />}
        </Flex>
      </Flex>
      <BtnWrap mt="24px" disabled={isConfirming} onClick={handleConfirm} variant="secondary">
        {isConfirming ? `${t('Confirming')}...` : t('Confirm')}
      </BtnWrap>
    </Flex>
  )
}

export default ConfirmStage
