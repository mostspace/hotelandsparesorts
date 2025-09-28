'use client'

import {useStripe, useElements} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';


const PaymentComponent = ({stripeResponse, submitCount, payment,savedCard,intentID}) => {
  

// #region CONSTANTS & STATE VARIABLES
  const stripe = useStripe();
  const elements = useElements();

  // const [errorMessage, setErrorMessage] = useState(null);
  const [addressCreated, setAddressCreated] = useState(false);

  
// #endregion


// #region SHOW COMPONENTS

// #endregion


// #region WEB REQUESTS 

// #endregion


// #region BUTTONS CLICKED

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    // event.preventDefault();

    console.log("PAYING")

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    
        var stripeResVar

        if(payment)
        {
          console.log("PAYING PAYMENT")

          if(savedCard)
          {
            console.log("PAYING SAVED CARD")


            stripeResVar = await stripe.confirmCardPayment(intentID,{
              payment_method:savedCard,
              
            });
          
          }
          else{
            stripeResVar = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: 'https://booking.hotelandsparesorts.com/pay',
            },
            redirect: "if_required"
            });
          }

          

        }
        else{

          stripeResVar = await stripe.confirmSetup({
            elements,
            confirmParams: {
              return_url: 'https://booking.hotelandsparesorts.com/pay',
          },
          redirect: "if_required"
          });

        }
      

      // console.log("IF ERROR", error)

      if (stripeResVar.hasOwnProperty("error")) {
    
        // setErrorMessage(stripeResVar.error.message);
        stripeResponse({success:false,error:stripeResVar.error.message});
        console.log("ERROR")

      } 
      else {
        stripeResponse({success:true,response:stripeResVar})
      }
    
  };

// #endregion


// #region OTHER

// #endregion
  



   
  useEffect(() => {

    if(elements !== null && !addressCreated)
    {
      
      // let billingAddres = elements.create('address',{mode:'billing'})
      const paymentElement = elements.create('payment');
      // billingAddres.mount('#billingAddress')
      paymentElement.mount('#payment');
      setAddressCreated(true)

    }

  },[elements]) // eslint-disable-line react-hooks/exhaustive-deps


  


  useEffect( () => {

    
    handleSubmit()


  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    
    <div className='servicePaymentRow w-full'>

      <div className='servicePaymentColumn '>
          
      
      {/* {!savedCard && <PaymentElement />} */}
      <div id='payment' />
      {/* <div id='billingAddress' /> */}
      </div>

      {/* <div className='servicePaymentColumn'>
          <div className='serviceInfoSubtitles'>
              <h3 variant='subtitle2'>Billing address</h3>
          </div>
          <div id='billingAddress' ></div>
      </div> */}
      
    </div>
  )
};

export {PaymentComponent};