import React, {useState} from 'react';

import {Image, Loader} from 'semantic-ui-react'

export default function ImageCard(ImageLink){
   
    const ImageLinks = ImageLink.ImageLink
    const [i, seti] = useState(ImageLinks[0])
    const ImageHandler = (event)=>{
            seti(event.target.name)
    }


    if(ImageLink){

            return(
            
                <div className = 'CurrentImage' >
                    <div className='profile-image'>
                    <Image src= {i} wrapped key = {i}  circular/>
                    </div>
                    
                    
                    <div className = 'small-grid'>
                    <Image.Group size = 'tiny' >
                    {ImageLinks.map((image) =>(
                            <Image key = {image} name = {image}  src = {image} onClick = {ImageHandler} padding = '20px'/>
                    ))}
                    </Image.Group>
                    </div> 

                </div>
            
            )

    }
}

