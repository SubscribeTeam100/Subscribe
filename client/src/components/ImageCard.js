import React, {useState} from 'react';

import {Image, Loader} from 'semantic-ui-react'

export default function ImageCard(ImageLink){
  const [i, seti] = useState(0)
   const ImageLinks = ImageLink.ImageLink
   const ImageHandler = (event)=>{
        console.log(event)
   }

if(ImageLink){

        return(
           
            <div className = 'CurrentImage' >
                <Image src= {ImageLinks[i]} wrapped />
                
                
                 <div className = 'small-grid'>
                <Image.Group size = 'tiny' >
                {ImageLinks.map((image) =>(
                        <Image key = {image} src = {image} onClick = {ImageHandler} padding = '8px'/>
                ))}
                </Image.Group>
                </div> 

            </div>
          
        )

        }
}

