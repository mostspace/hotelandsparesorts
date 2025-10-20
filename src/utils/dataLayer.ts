/**
 * DataLayer Utility for Google Tag Manager
 * Handles ecommerce event tracking with deduplication
 */

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// TypeScript Interfaces
export interface DataLayerItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export interface DataLayerEvent {
  event: string;
  currency: string;
  value: number;
  items: DataLayerItem[];
  transaction_id?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  customer?: {
    email?: string;
    name?: string;
  };
  shipping_tier?: string;
  payment_type?: string;
  payment_reference?: string;
}

/**
 * Initialize dataLayer if it doesn't exist
 */
const initDataLayer = (): void => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Check if event was already fired to prevent duplicates
 * Uses sessionStorage for session-based deduplication
 * Uses localStorage for permanent deduplication (purchase events)
 */
const hasEventFired = (eventKey: string, permanent: boolean = false): boolean => {
  if (typeof window === 'undefined') return false;
  
  const storage = permanent ? localStorage : sessionStorage;
  return storage.getItem(eventKey) === 'true';
};

/**
 * Mark event as fired
 */
const markEventFired = (eventKey: string, permanent: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  const storage = permanent ? localStorage : sessionStorage;
  storage.setItem(eventKey, 'true');
};

/**
 * Clear event tracking (useful for testing or when user logs out)
 */
export const clearEventTracking = (eventKey?: string): void => {
  if (typeof window === 'undefined') return;
  
  if (eventKey) {
    sessionStorage.removeItem(eventKey);
    localStorage.removeItem(eventKey);
  } else {
    // Clear all GTM-related keys
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('gtm_')) {
        sessionStorage.removeItem(key);
      }
    });
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gtm_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

/**
 * Push event to dataLayer with deduplication
 */
export const pushToDataLayer = (
  eventData: DataLayerEvent,
  options: {
    deduplicate?: boolean;
    deduplicationKey?: string;
    permanent?: boolean; // For purchase events - use localStorage
  } = {}
): void => {
  if (typeof window === 'undefined') return;

  initDataLayer();

  const { 
    deduplicate = true, 
    deduplicationKey, 
    permanent = false 
  } = options;

  // Generate deduplication key
  const eventKey = deduplicationKey || `gtm_${eventData.event}_${eventData.transaction_id || Date.now()}`;

  // Check if event already fired
  if (deduplicate && hasEventFired(eventKey, permanent)) {
    console.log(`[GTM] Event already fired: ${eventData.event} (${eventKey})`);
    return;
  }

  // Push to dataLayer
  console.log('[GTM] Pushing event:', eventData.event, eventData);
  window.dataLayer.push(eventData);

  // Mark as fired
  if (deduplicate) {
    markEventFired(eventKey, permanent);
  }
};

/**
 * Helper function to format price as number
 */
export const formatPrice = (price: string | number): number => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return Math.round(numPrice * 100) / 100; // Round to 2 decimal places
};

/**
 * Helper function to create item object
 */
export const createItem = (
  itemId: string,
  itemName: string,
  price: number,
  quantity: number,
  category?: string
): DataLayerItem => {
  return {
    item_id: itemId,
    item_name: itemName,
    item_category: category || 'Hotel Room',
    price: formatPrice(price),
    quantity,
  };
};

// ============================================
// ECOMMERCE EVENT FUNCTIONS
// ============================================

/**
 * 1. View Item Event
 * Fired when user views a hotel profile
 */
export const trackViewItem = (
  hotelId: string,
  hotelName: string,
  price: number,
  currency: string = 'EUR'
): void => {
  const items = [createItem(hotelId, hotelName, price, 1, 'Hotel')];
  
  pushToDataLayer({
    event: 'view_item',
    currency,
    value: formatPrice(price),
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_view_item_${hotelId}`,
  });
};

/**
 * 2. Add to Cart Event
 * Fired when user clicks BOOK and booking is created
 */
export const trackAddToCart = (
  bookingId: string,
  roomName: string,
  price: number,
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'add_to_cart',
    currency,
    value: formatPrice(price * quantity),
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_add_to_cart_${bookingId}`,
  });
};

/**
 * 3. View Cart Event
 * Fired when user reaches booking page (step 2)
 */
export const trackViewCart = (
  bookingId: string,
  roomName: string,
  price: number,
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'view_cart',
    currency,
    value: formatPrice(price * quantity),
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_view_cart_${bookingId}`,
  });
};

/**
 * 4. Begin Checkout Event
 * Fired when user moves from personal details to payment
 */
export const trackBeginCheckout = (
  bookingId: string,
  roomName: string,
  price: number,
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'begin_checkout',
    currency,
    value: formatPrice(price * quantity),
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_begin_checkout_${bookingId}`,
  });
};

/**
 * 5. Add Shipping Info Event
 * For hotels: adapted to represent check-in/check-out dates
 */
export const trackAddShippingInfo = (
  bookingId: string,
  roomName: string,
  price: number,
  shippingTier: string = 'Standard Booking',
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'add_shipping_info',
    currency,
    value: formatPrice(price * quantity),
    shipping_tier: shippingTier,
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_add_shipping_${bookingId}`,
  });
};

/**
 * 6. Add Payment Info Event
 * Fired when payment form is displayed/interacted with
 */
export const trackAddPaymentInfo = (
  bookingId: string,
  roomName: string,
  price: number,
  paymentType: string = 'Card',
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'add_payment_info',
    currency,
    value: formatPrice(price * quantity),
    payment_type: paymentType,
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_add_payment_${bookingId}`,
  });
};

/**
 * 7. Payment Initiated Event
 * Fired when Stripe payment processing starts
 */
export const trackPaymentInitiated = (
  bookingId: string,
  roomName: string,
  price: number,
  paymentReference: string,
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(bookingId, roomName, price, quantity)];
  
  pushToDataLayer({
    event: 'payment_initiated',
    currency,
    value: formatPrice(price * quantity),
    payment_reference: paymentReference,
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_payment_initiated_${bookingId}`,
  });
};

/**
 * 8. Purchase Event
 * Fired on order confirmation page
 * CRITICAL: Uses permanent deduplication to prevent duplicate conversions on refresh
 */
export const trackPurchase = (
  transactionId: string,
  roomName: string,
  price: number,
  tax: number = 0,
  shipping: number = 0,
  coupon: string = '',
  customerEmail?: string,
  customerName?: string,
  quantity: number = 1,
  currency: string = 'EUR'
): void => {
  const items = [createItem(transactionId, roomName, price, quantity)];
  
  const totalValue = formatPrice(price * quantity + tax + shipping);
  
  pushToDataLayer({
    event: 'purchase',
    currency,
    value: totalValue,
    transaction_id: transactionId,
    tax: formatPrice(tax),
    shipping: formatPrice(shipping),
    coupon: coupon || undefined,
    customer: customerEmail || customerName ? {
      email: customerEmail,
      name: customerName,
    } : undefined,
    items,
  }, {
    deduplicate: true,
    deduplicationKey: `gtm_purchase_${transactionId}`,
    permanent: true, // Use localStorage to prevent duplicate on refresh
  });
};

/**
 * Helper: Track custom event
 * For any additional custom events needed
 */
export const trackCustomEvent = (
  eventName: string,
  eventData: Record<string, any>
): void => {
  initDataLayer();
  
  console.log('[GTM] Pushing custom event:', eventName, eventData);
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });
};


