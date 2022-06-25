import { FC, useState } from 'react'
import Typed from 'react-typed';
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { RewardPageWrap, Icon } from './style'
import styled, { css } from 'styled-components'

import {  
  TenGraph 
} from "../Dashboard/components/Graph/Graph"
import ExtractModal from './components/SettingModal'
import TopBanner from './components/banner'


const Reward: FC = () => {
  
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
  const TopBannerWrap = styled.div`
  
  margin-top:60px;
  margin-bottom:55px;
  `
  return (
  <RewardPageWrap>
     <div style={{display:'flex',justifyContent:'center',position:'absolute',top:'-120px',left:'50%',
     width:'300px',height:'313px',transform:'translateX(-50%)'}}><img style={{width:'300px',height:'313px'}} src="/images/reward/bg1.png"/></div>
      
    <TopBannerWrap>  
    <div style={{backgroundImage:`url('/images/reward/path.png')`,height:'331px',backgroundSize:'100% 100%',
      padding:'0 48px'
    }}>
      <TopBanner />
    </div>
    
    </TopBannerWrap>
    
    <Grid container spacing={2}> 
       
          <Grid item lg={3} md={3} sm={12} xs={12}>
          
            <div style={{backgroundImage:`url('/images/reward/leftbg.png')`,opacity: '0.4',
            display:'flex',flexDirection:'column',alignItems:'center',
            height:'408px',backgroundRepeat:'no-repeat'}}>
              <img src="/images/reward/circel.png" alt="" style={{marginTop:'45px',marginBottom:'25px'}} />
              <h4 style={{fontSize:'22px',color:'#FFFFFF',marginBottom:'25px'}}>reward</h4>
              <h3 style={{fontSize:'44px',color:'#FFFFFF',marginBottom:'50px'}}>123,123</h3>

              <div style={{background: 'linear-gradient(90deg, #3C00FF 0%, #EC6EFF 100%)',borderRadius:'12px',
              height:'48px',width:'156px',textAlign:'center',lineHeight:'48px',position:'relative'}}>
                <span style={{color:'#ffffff'}}>Extract</span>
                <span style={{backgroundImage:`url('/images/reward/start.png')`,width:'32px',height:'32px',
                position:'absolute',right:'-12px',top:'-12px'
              }}></span>

                <span style={{backgroundImage:`url('/images/reward/start.png')`,width:'14px',height:'14px',
                backgroundSize:'100% 100%',
                position:'absolute',right:'20px',top:'10px'}}></span>

              </div>
           </div>
            
          </Grid>
          <Grid item lg={9} md={9} sm={12} xs={12}>
          
          
          <div style={{backgroundImage:`url('/images/reward/rightbg.png')`,height:'408px',backgroundSize:'100% 100%',
           paddingTop:'30px',paddingLeft:'24px'
        }}>
            <h3 style={{color:'#ffffff',fontSize:'16px',marginBottom:'30px'}}>Overal diffustion effect</h3>
            <div><span>Today:</span><span>$12323.22M</span></div>
            <div >
            <TenGraph/>
            </div>
          </div>  
        </Grid>
        
      
    </Grid>
  </RewardPageWrap>)
}
export default Reward;