import { FC, useState } from 'react'
import Typed from 'react-typed';
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { RewardPageWrap, Icon } from './style'
import rewardDatasMock from './MockBondData'
import ExtractModal from './components/SettingModal'
import { Carousel } from 'antd'

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
}

const Banner: React.FC = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  }
  const leftClick = () => {
     
  }

  return (
    <div>
      <button onClick={leftClick}>左</button>
      <Carousel afterChange={onChange} >
      <div>
       
        <h3 style={contentStyle}>

        </h3>
       
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
    <button>右</button>
    </div>
    
  );
};


const Reward: FC = () => {
  const [rewardData, setRewardData] = useState<any[]>(rewardDatasMock);
  
  const [extractModalVisible, setExtractModalVisible] = useState<boolean>(false);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const { account } = useWeb3React()

  // 打开窗口
  const openExtractModal = () => {
    setExtractModalVisible(true)
  }
  const closeExtractModal = () => {
    setExtractModalVisible(false)
  }
  
  return (
  <RewardPageWrap>
    <Banner/>   

    <Grid container spacing={2}>      
       
          <Grid item lg={6} md={6} sm={12} xs={12}>
            
            {/* extract的弹窗 */}
          
            {/* {
              extractModalVisible ? <ExtractModal account={account}   onClose={closeExtractModal} /> 
              : null
            } */}
          </Grid>
        
      
    </Grid>
  </RewardPageWrap>)
}
export default Reward;