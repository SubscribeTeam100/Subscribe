import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import HorizontalSlider from 'react-horizontal-slider'
import {ProductCard} from '../components/ProductCard'

export default class Promotedproducts extends React.Component {
    render(){
        return(
            <HorizontalSlider
                title= "promoted Product"
                data = {product.name}
                height = {300}
                width = {300}
                id = {product.id}
            />
        )
    }
}
