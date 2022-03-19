import React, {Fragment} from 'react'

const ImgPop = (props) => {
  return (
    <Fragment>

      <h1> {props.titulo} </h1>
      
      <img  
    
             src={ props.imagen}
             width="100%"
             height="100%"
             /> 
             
             <img /> 
    </Fragment>
)};

export default ImgPop;