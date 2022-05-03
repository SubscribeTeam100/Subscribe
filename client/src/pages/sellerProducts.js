import React, { useContext } from 'react'
import { AuthContext } from "../context/auth";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag'
import { Card, Feed, Grid, Loader, Icon, Button, Modal, Header, Input } from 'semantic-ui-react';
import ProductCard from '../components/ProductCard'


function SellerProducts() {
    const { user } = useContext(AuthContext)
    const { data: sellerProducts, loading: loading_sellerProducts } = useQuery(GET_SELLER_PRODUCTS)
    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const [deleteTyperModal, setDeleteTyperModal] = React.useState(false)
    const [RemoveListener, setRemoveListener] = React.useState('')
    const [removeProduct, { loading_removeProduct }] = useMutation(REMOVE_PRODUCT, {
        update(_, result) {
            alert('Removed this Product and notified all the customers');
            window.location.reload();

        }, onerror(err) {
            alert(err)
        }
    })
    if (user === null || !user.isSeller) {
        return (<div>
            Sorry you cannot access the website :D
        </div>)
    }
    if (loading_sellerProducts) {
        return <Loader active />
    }

    return (<div>
        <Grid columns={3} equal>
            <Grid.Row>
                {sellerProducts.getSellerProducts.map(product => (
                    <Card>
                        <ProductCard product={product} />
                        <Card.Content>
                            <Feed>
                                <Feed.Label ><Icon name="male" /><b>Total Subscribers: </b>{product.subscription_analytics.total_subscribers}</Feed.Label>
                                <Feed.Label><Icon name="sync green" /><b>Active Subscribers: </b> {product.subscription_analytics.active_subscribers}</Feed.Label>
                                <Feed.Label><Icon name="pause orange" /><b>Paused Subscribers: </b> {product.subscription_analytics.paused_subscribers}</Feed.Label>
                                <Feed.Label><Icon name="times red" /><b>Cancelled Subscribers: </b> {product.subscription_analytics.cancelled_subscribers}</Feed.Label>

                            </Feed>
                            <Feed>
                                <Grid columns='2'>
                                    <Grid.Row padded='very'>
                                        <Grid.Column>
                                            <Modal closeIcon open={deleteOpen} trigger={<Button color='red'>Delete Product</Button>} onClose={() => setDeleteOpen(false)} onOpen={() => setDeleteOpen(true)}>
                                                <Header icon='remove' content='Remove Product?' />
                                                <Modal.Content>
                                                    <p>
                                                        Are you sure you want to delete this product? All your subscribers will be notified that the product has been discontinued and you will not be paid for the unshipped items.
                                                    </p>
                                                    <p><b><u><h3>This action cannot be undone. Please only delete this product if you're 100% sure that you want to.</h3></u></b></p>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Modal closeIcon open={deleteTyperModal} trigger={<Button color='red' id='remove-product-modal-button' onClick={() => setDeleteTyperModal(true)} >
                                                        Delete</Button>} onClose={() => setDeleteTyperModal(false)} onOpen={() => setDeleteTyperModal(true)}>
                                                        <Header icon='remove' content='Remove Product' />
                                                        <Modal.Content>
                                                            <p>
                                                                Please type <b>"RemoveProduct My Guy" </b>in the text box below

                                                            </p>
                                                            <Input type='text' value={RemoveListener} onChange={(e) => { setRemoveListener(e.target.value) }}></Input>
                                                        </Modal.Content>
                                                        <Modal.Actions>
                                                            <Button color='red' onClick={() =>RemoveListener === 'RemoveProduct My Guy' ? removeProduct({ variables: { productId:product.id} }) : console.log('wrong answer')}>Delete Product</Button>
                                                        </Modal.Actions>

                                                    </Modal>
                                                </Modal.Actions>
                                            </Modal>


                                        </Grid.Column>
                                        <Grid.Column>
                                            <Button color='Blue'>Edit Product</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Feed>
                        </Card.Content>
                    </Card>


                ))}
            </Grid.Row>
        </Grid>
    </div>)
}

const GET_SELLER_PRODUCTS = gql`
    query getSellerProducts{
        getSellerProducts{
            id
            name
            overallRating
            subscription_analytics{
              total_subscribers
              active_subscribers
              cancelled_subscribers
              paused_subscribers  
            }
        }
    }
`
const REMOVE_PRODUCT = gql`
  mutation deleteProduct($productId:ID!){
    deleteProduct(productId:$productId)

}`

export default SellerProducts;
