// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartDisplay();

// Update cart count in the header
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Update cart display
function updateCartDisplay() {
  updateCartCount();
  
  const cartItemsContainer = document.getElementById('cart-items');
  const cartContainer = document.getElementById('cart-container');
  const emptyCartMessage = document.getElementById('empty-cart');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  
  if (!cartItemsContainer || !cartContainer || !emptyCartMessage) return;
  
  // Show empty cart message if cart is empty
  if (cart.length === 0) {
    cartContainer.style.display = 'none';
    emptyCartMessage.style.display = 'block';
    return;
  }
  
  // Show cart if it has items
  cartContainer.style.display = 'flex';
  emptyCartMessage.style.display = 'none';
  
  // Clear cart items container
  cartItemsContainer.innerHTML = '';
  
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 400;
  const total = subtotal + deliveryFee;
  
  // Update subtotal and total
  if (subtotalElement) subtotalElement.textContent = `Rs.${subtotal}`;
  if (totalElement) totalElement.textContent = `Rs.${total}`;
  
  // Add each item to the cart
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">Rs.${item.price}</p>
      </div>
      <div class="item-quantity">
        <button class="quantity-btn minus" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus" data-index="${index}">+</button>
      </div>
      <div class="item-total">
        <p>Rs.${item.price * item.quantity}</p>
      </div>
      <button class="remove-item" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Add event listeners for quantity buttons
  const minusButtons = document.querySelectorAll('.quantity-btn.minus');
  const plusButtons = document.querySelectorAll('.quantity-btn.plus');
  const removeButtons = document.querySelectorAll('.remove-item');
  
  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
      }
    });
  });
  
  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      if (cart[index].quantity < 10) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
      }
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    });
  });
  
  // Add event listener for checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
  
  // Add event listener for continue shopping button
  const continueShoppingBtn = document.getElementById('continue-shopping');
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  }
}
