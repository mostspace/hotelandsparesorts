'use client'

import {useStripe, useElements} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';


const BillingAddressComponent = ({submitCount, intentID}) => {
  

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



// #endregion


// #region OTHER

// #endregion
  



   
  useEffect(() => {

    if(elements !== null && !addressCreated)
    {
      
      let billingAddres = elements.create('address',{mode:'billing'})
      billingAddres.mount('#billingAddress')
      setAddressCreated(true)

    }

  },[elements]) // eslint-disable-line react-hooks/exhaustive-deps


  


 // eslint-disable-line react-hooks/exhaustive-deps


  return (
    
    <div className='servicePaymentRow w-full'>

          

    
          <div id='billingAddress' ></div>
     
      
    </div>
  )
};

export {BillingAddressComponent};