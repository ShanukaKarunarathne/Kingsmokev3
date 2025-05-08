// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// If cart is empty, redirect to cart page
document.addEventListener('DOMContentLoaded', function() {
  if (cart.length === 0) {
    window.location.href = 'cart.html';
  }
  
  // Initialize checkout page
  initCheckout();
});

// Update cart count in the header
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Initialize checkout page
function initCheckout() {
  updateCartCount();
  displayOrderSummary();
  
  // Add event listener for checkout form submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }
}

// Display order summary
function displayOrderSummary() {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const subtotalElement = document.getElementById('checkout-subtotal');
  const deliveryFeeElement = document.getElementById('checkout-delivery');
  const totalElement = document.getElementById('checkout-total');
  
  if (!checkoutItemsContainer || !subtotalElement || !totalElement) return;
  
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 400;
  const total = subtotal + deliveryFee;
  
  // Update subtotal and total
  subtotalElement.textContent = `Rs.${subtotal}`;
  if (deliveryFeeElement) deliveryFeeElement.textContent = `Rs.${deliveryFee}`;
  totalElement.textContent = `Rs.${total}`;
  
  // Clear checkout items container
  checkoutItemsContainer.innerHTML = '';
  
  // Add each item to the order summary
  cart.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    orderItem.innerHTML = `
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <div class="item-price">
        <p>Rs.${item.price * item.quantity}</p>
      </div>
    `;
    
    checkoutItemsContainer.appendChild(orderItem);
  });
}

// Handle checkout form submission
function handleCheckout(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const customerData = {
    fullname: formData.get('fullname'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    pincode: formData.get('pincode'),
    paymentMethod: formData.get('payment')
  };
  
  // Calculate order totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 400;
  const total = subtotal + deliveryFee;
  
  // Format order details for Google Form
  const orderDetails = cart.map(item => 
    `${item.name} (Rs.${item.price} x ${item.quantity} = Rs.${item.price * item.quantity})`
  ).join('\n');
  
  // Show loading state
  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  
  // Generate order ID
  const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
  
  // Create order object
  const order = {
    id: orderId,
    customer: customerData,
    items: cart,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    total: total,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  // Store order details in localStorage for receipt page
  localStorage.setItem('lastOrder', JSON.stringify(order));
  
  // Create and submit Google Form
  submitToGoogleForm(customerData, orderDetails, subtotal, deliveryFee, total);
}

// Submit to Google Form
function submitToGoogleForm(customerData, orderDetails, subtotal, deliveryFee, total) {
  // Your actual Google Form entry IDs
  const formEntryIds = {
    fullname: '25246851',      // Full Name
    email: '1302480202',       // Email
    phone: '625549381',        // Phone
    address: '17574211',       // Address
    city: '481782514',         // City
    state: '512167118',        // State
    pincode: '137781304',      // Pincode
    orderDetails: '1834291666', // Order Details
    subtotal: '18281987',      // Subtotal
    deliveryFee: '1652416490', // Delivery Fee
    total: '1437753705',       // Total
    paymentMethod: '611817269' // Payment Method
  };
  
  // Your actual Google Form ID
  const formId = '1FAIpQLScAZhY1roqPN2Rji-UwSQR3Cvc5D42dayi1GFwLxV_NB0Vptw';
  
  // Create a form element
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  form.target = '_blank'; // Open in new tab
  
  // Create input fields for each form entry
  const createInput = (value, entryId) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `entry.${entryId}`;
    input.value = value;
    return input;
  };
  
  // Add all input fields to the form
  form.appendChild(createInput(customerData.fullname, formEntryIds.fullname));
  form.appendChild(createInput(customerData.email, formEntryIds.email));
  form.appendChild(createInput(customerData.phone, formEntryIds.phone));
  form.appendChild(createInput(customerData.address, formEntryIds.address));
  form.appendChild(createInput(customerData.city, formEntryIds.city));
  form.appendChild(createInput(customerData.state, formEntryIds.state));
  form.appendChild(createInput(customerData.pincode, formEntryIds.pincode));
  form.appendChild(createInput(orderDetails, formEntryIds.orderDetails));
  form.appendChild(createInput(subtotal, formEntryIds.subtotal));
  form.appendChild(createInput(deliveryFee, formEntryIds.deliveryFee));
  form.appendChild(createInput(total, formEntryIds.total));
  form.appendChild(createInput(customerData.paymentMethod, formEntryIds.paymentMethod));
  
  // Append form to body
  document.body.appendChild(form);
  
  // Submit the form
  form.submit();
  
  // Remove form from DOM
  setTimeout(() => {
    document.body.removeChild(form);
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to receipt page
    window.location.href = 'receipt.html';
  }, 2000);
}
