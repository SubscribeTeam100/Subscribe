import React, { useContext } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import {
  Container,
  Loader,
  Card,
  Button,
  Grid,
  Modal,
  Header,
  Icon,
  Input
} from "semantic-ui-react";
import moment from "moment";
//TODO: add edit subscription address/settlement options
export default function ManageSuscription(props) {
  let { user } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [firstOpen, setFirstOpen] = React.useState(false)
  const [secondOpen, setSecondOpen] = React.useState(false)
  const[resumeOpen, setResumeOpen] = React.useState(false)

  let subscriptionID = props.match.params.subscriptionID;
  const {
    data: subscriptiondata,
    loading: subscription_loading,
  } = useQuery(GETSUBSCTIPTION, {
    variables: { subscriptionId: subscriptionID },
  });
  const [deleteSub, { loading: deleteLoading }] = useMutation(
    DELETE_SUBSCRIPTION,
    {
      update(_, result) {
        alert("Successfully deleted Subscription.");
        window.setTimeout(props.history.push("../dashboard/profile"), 1000);
      },
      onError(err) {
        alert(err);
      },
    }
  );
  const [pauseSub, {loading: pauseLoading}] = useMutation(
    PAUSE_SUBSCRIPTION,
    {
      update(_, result){
        alert("successfully paused subscription");
        window.location.reload(true)
      }
    }
  )
  const [resumeSub, {loading: resumeLoading}] = useMutation(
    RESUME_SUBSCRIPTION,
    {
      update(_, result){
        alert("successfully resumed subscription");
        window.location.reload(true)
      }
    }
  )
 
   
 
  
  
  if (user == null) {
    return (
      <div>
        Please <a href="../../login">LOGIN</a>{" "}
      </div>
    );
  }
  if (subscription_loading) {
    return <Loader active />;
  }
  if (!subscriptiondata) {
    return <div className="error404">ERROR 404 This Page is unavailable</div>;
  }
  function AddressComponent (addressID){
     addressID =addressID.addressID
    const {data, loading:getShippingLoading} = useQuery(GET_SHIPPING, {variables:{subscriptionId:props.match.params.subscriptionID, addressId: addressID }})
   if(getShippingLoading){
     return <Loader active/>
   }
    return(<div>
     { data.getAddress.name}
     <br/>{data.getAddress.Address1}
     <br/>{data.getAddress.Address2}
     <br/>{data.getAddress.city}
     <br/>{data.getAddress.phone}
     </div>
    )
  }
  function SubscriptionProductCard(productID) {
    productID =  productID.productID
    
    const [pauseInput, setPauseInput] = React.useState()
    const {
      data: productdata,
      loading: product_loading,
    } = useQuery(FETCH_PRODUCT, {
      variables: { productId: productID },
    });
   
    if (product_loading ) {
      return <Loader active />;
    }
    
    function deleteSubscription(event) {
      deleteSub({
        variables: { subscriptionId: props.match.params.subscriptionID },
      });
    }
    function pausefromremove(event) {
      if (event) {
        console.log(event);
        document.getElementById("remove-remove-modal").click();
        document.getElementById("pause-subscription").click();
      }
    }
    function pauseSubscription(event){
     console.log('abc')
     //TODO: changepauseSubscription if PauseInput value 
     if(pauseInput == undefined){
      pauseSub({variables: {subscriptionId:  props.match.params.subscriptionID}})
     }

    }
    function resumeSubscription(event){
      resumeSub({variables:{subscriptionId: props.match.params.subscriptionID}})
    }
    return (
      <div className="SubscriptionProduct">
        <img
          src={productdata.getProduct.ImageLink[0]}
          className="manage-subscription-image"
        />
        <p>{productdata.getProduct.name}</p>
        <p>{productdata.getProduct.price}</p>
        <hr />
        <Grid columns="2">
          <Grid.Row padded="very">
            <Grid.Column>
              <Modal
                closeIcon
                open={open}
                trigger={<Button color="red">Delete Subscription </Button>}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
              >
                <Header icon="remove" content="Remove Subscription" />
                <Modal.Content>
                  <p>
                    Are you sure you want to remove this subscription?. You can
                    also <b>pause</b> a subscription for as long as you want.
                    <p><u>Deleting subscription will permanently remove it from the system. It cannot be undone.</u></p>
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    color="green"
                    id="remove-remove-modal"
                    onClick={() => setOpen(false)}
                  >
                    <Icon name="remove" /> No
                  </Button>
                  <Button
                    color="orange"
                    name={productID.productID}
                    onClick={deleteSubscription}
                  >
                    <Icon name="checkmark" /> Yes
                  </Button>
                  <Button
                    color="yellow"
                    id="pause-from-remove"
                    onClick={pausefromremove}
                  >
                    Pause Instead
                  </Button>
                </Modal.Actions>
              </Modal>{" "}
              <br />
            </Grid.Column>
            <Grid.Column>

              <Button
                id="pause-subscription"
                color={
                  subscriptiondata.getSubscription.isActive
                    ? "yellow"
                    : "green"
                }
                onClick={()=> subscriptiondata.getSubscription.isActive ? setFirstOpen(true) : setResumeOpen(true)}

              >
                {" "}
                {subscriptiondata.getSubscription.isActive
                  ? "Pause Subscription"
                  : "Resume Subscription"}
              </Button>

              
              <Modal
                closeIcon
                onClose={() => setResumeOpen(false)}
                onOpen={() => setResumeOpen(true)}
                open={resumeOpen}
              >
                <Modal.Header></Modal.Header>
                <Modal.Content image>
                  
                  <Modal.Description>
                    <p>Are you sure you would like to resume this subscription?</p>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  
                  <Button color = 'green' onClick= {()=> {
                    setResumeOpen(false);
                    resumeSubscription();
                }}>Resume</Button>
                
                </Modal.Actions>
                </Modal>


              <Modal
                closeIcon
                onClose={() => setFirstOpen(false)}
                onOpen={() => setFirstOpen(true)}
                open={firstOpen}
              >
                <Modal.Header></Modal.Header>
                <Modal.Content image>
                  
                  <Modal.Description>
                    <p>Are you sure you would like to pause this subscription?</p>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => {setSecondOpen(true)}} color = 'yellow'>
                    Pause for a selection period <Icon name='right chevron' />
                  </Button>
                  <Button onClick= {()=> {
                    setFirstOpen(false);
                    pauseSubscription();
                }}>Pause Indefinitely</Button>
                
                </Modal.Actions>
                </Modal>
                <Modal
                  onClose={() => {setSecondOpen(false); setFirstOpen(false)}}
                  open={secondOpen}
                  
                >
                  <Modal.Header>How many deliveries would you like to skip</Modal.Header>
                  <Modal.Content>
                    <input type='number' value ={pauseInput} onChange = {e=>{setPauseInput(e.target.value)}}></input>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      icon='check'
                      content='Pause Subscription'
                      color = 'yellow'
                      onClick={()=>{setSecondOpen(false); pauseSubscription()}}
                    />
                  </Modal.Actions>
                
              </Modal>

              
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
  
  return (
    <div>
      <Container>
        <Card centered raised>
          <h1
            style={{
              textAlign: "center",
              color: "gray",
              paddingTop: 10,
              paddingBottom: 0,
            }}
          >
            Subscription Details
          </h1>
          <Card style={{ padding: 10 }}>
            <SubscriptionProductCard
              productID={subscriptiondata.getSubscription.productID}
            />
          </Card>
          <Card cenetered="false" style={{ padding: 10 }}>
            <p>
              <b>Created at</b> :{" "}
              {`${moment(subscriptiondata.getSubscription.createdAt)}`}
            </p>
            <p>
              <b>Shipping Address: </b> <AddressComponent addressID={subscriptiondata.getSubscription.addressID} />
            </p>
            <p>
              <b>Seller </b> :{" "}
              <a
                href={`../seller/${subscriptiondata.getSubscription.sellerID}`}
              >
                {subscriptiondata.getSubscription.sellerID}
              </a>{" "}
            </p>
            {/* <p><b>Last delivered</b>: {subscriptiondata.getSubscription.delivered[0]}</p> */}
            <p>
              <b>Next delivery</b>:{" "}
              {subscriptiondata.getSubscription.nextDelivery.scheduledfor}
            </p>
            <p>
              <b></b>
            </p>
          </Card>
        </Card>
      </Container>
    </div>
  );
}

const GETSUBSCTIPTION = gql`
  query getSubscription($subscriptionId: ID!) {
    getSubscription(subscriptionId: $subscriptionId) {
      id
      frequency
      settlementID
      productID
      sellerID
      addressID
      userID
      createdAt
      isActive
      nextDelivery {
        scheduledfor
        settlementID
        shipped
        addressID
      }
    }
  }
`;

const FETCH_PRODUCT = gql`
  query getProduct($productId: ID!) {
    getProduct(productId: $productId) {
      id
      description
      price
      createdAt
      name
      sellerID
      isVisible
      reviews {
        reviewID
        userID
      }
      reviewPoints
      overallRating
      tags
      ImageLink
    }
  }
`;

const DELETE_SUBSCRIPTION = gql`
  mutation deleteSubscription($subscriptionId: ID!) {
    deleteSubscription(subscriptionId: $subscriptionId)
  }
`;

const PAUSE_SUBSCRIPTION = gql`
  mutation pauseSubscription($subscriptionId: ID!){
    pauseSubscription(subscriptionId: $subscriptionId){
      isActive
    }
      
    
  }
`
const RESUME_SUBSCRIPTION = gql`
  mutation resumeSubscription($subscriptionId: ID!){
    resumeSubscription(subscriptionId: $subscriptionId){
      isActive
    }
      
    
  }
`

const GET_SHIPPING = gql`
  query getAddress($addressId: ID!, $subscriptionId: ID!){
    getAddress(addressId: $addressId, subscriptionId: $subscriptionId){
     name
     Address1
      Address2
      city
      state
       country
      zip
    }
  }
`
