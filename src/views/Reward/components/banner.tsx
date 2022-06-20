import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import rewardDatasMock from '../MockBondData'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
const CenterStyle = styled.div`
 padding:0; 
`
const settings = {
  className: "center",
  centerMode: true,
  infinite: true,      
  slidesToShow: 5,
  speed: 500
};
export default class CenterMode extends Component {
  render() {
  
    return (
          
        <Slider {...settings} >
        {rewardDatasMock.map(item => (
         <CenterStyle key={item.key}> 
              <div   style={{color:'white',display:'flex',flexDirection:'column',alignItems:'center'
              
            }}>
              <img src={item.pic}></img>
              <h3 style={{color:'white'}}>{item.name}</h3>
              <h4>Gains bonus</h4>
              <h2 style={{border:'1px solid #ffffff',width:'40px',textAlign:'center'}}>{item.percentage}</h2>        
              </div> 
          </CenterStyle> 
       ))}
        </Slider>
               
      
    );
  }
}