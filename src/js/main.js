// Product data
const products = [
    {
      id: 1,
      name: "Alien Puff Magnet White",
      description: "Luxury design with 33 unbleached premium brown papers and 33 tips, secured with a magnetic lock for style and convenience.",
      price: 1000,
      image: "../images/magent white.webp",
      collection: "classic",
      features: ["Unbleached brown papers", "Magnetic lock", "33 papers + 33 tips", "Luxury design"],
      inStock: true
    },
    {
      id: 2,
      name: "Alien Puff Black",
      description: "Sleek and bold black pack with 33 premium brown papers and 33 tips. A stylish choice for modern smokers.",
      price: 800,
      image: "../images/2.jpg",
      collection: "classic",
      features: ["Bold black design", "33 papers + 33 tips", "Premium white papers"],
      inStock: true
    },
    {
      id: 3,
      name: "Alien Puff Party Pack (5in1)",
      description: "All-in-one party pack with pink papers, tips, tray, wallet, and grinder. Designed for group fun and sharing.",
      price: 1500,
      image: "../images/5in1 2.jpg",
      collection: "party",
      features: ["5-in-1 bundle", "Pink papers", "Includes grinder + wallet", "Perfect for parties"],
      inStock: true
    },
    {
      id: 4,
      name: "Alien Puff Hemp Papers (3in1)",
      description: "Eco-friendly pack with a tray, 33 premium hemp papers, and 33 tips. Perfect for the conscious smoker.",
      price: 1000,
      image: "../images/hemp-3in1.jpg",
      collection: "eco",
      features: ["Eco-friendly hemp papers", "Includes tray", "33 papers + 33 tips", "Sustainable packaging"],
      inStock: true
    },
    {
      id: 5,
      name: "Alien Puff Magnet Blue Compact",
      description: "Compact magnetic pack with 33 premium white papers and 33 tips. Sleek and easy to carry.",
      price: 1000,
      image: "../images/magnet-blue.jpg",
      collection: "compact",
      features: ["Compact design", "Magnetic lock", "33 papers + 33 tips", "Premium white papers"],
      inStock: true
    },
    {
      id: 6,
      name: "Alien Puff Magnet Pink",
      description: "Specially designed for ladies, this luxury pink magnetic pack contains 33 premium white papers and 33 tips.",
      price: 1000,
      image: "../images/magnet-pink.jpg",
      collection: "ladies",
      features: ["Feminine design", "Magnetic lock", "33 papers + 33 tips", "Premium white papers"],
      inStock: true
    }
  ];
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCount();
  
  // Update cart count in the header
  function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
  }
  
  // Load products on the products page
  if (window.location.pathname.includes('products.html')) {
    displayProducts(products);
    
    // Add event listeners for filters
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', filterProducts);
    });
  }
  
  // Load product details on the product detail page
  if (window.location.pathname.includes('product-detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        displayProductDetail(product);
        displayRelatedProducts(product);
      } else {
        window.location.href = 'products.html';
      }
    } else {
      window.location.href = 'products.html';
    }
  }
  
  // Display products on the products page
  function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <h3>${product.name}</h3>
        <p>${product.description.substring(0, 80)}...</p>
        <p class="price">Rs.${product.price}</p>
        <a href="product-detail.html?id=${product.id}" class="btn-secondary">View Details</a>
      `;
      
      productGrid.appendChild(productCard);
    });
  }
  
  // Filter products based on selected filters
  function filterProducts() {
    const selectedCollections = Array.from(document.querySelectorAll('input[name="collection"]:checked')).map(el => el.value);
    const selectedPriceRanges = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(el => el.value);
    
    let filteredProducts = products;
    
    // Filter by collection
    if (selectedCollections.length > 0) {
      filteredProducts = filteredProducts.filter(product => selectedCollections.includes(product.collection));
    }
    
    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return selectedPriceRanges.some(range => {
          if (range === '500-1000') return product.price >= 500 && product.price <= 1000;
          if (range === '1000-1500') return product.price > 1000 && product.price <= 1500;
          if (range === '1500+') return product.price > 1500;
          return false;
        });
      });
    }
    
    displayProducts(filteredProducts);
  }
  
  // Display product details on the product detail page
  function displayProductDetail(product) {
    const productDetailContainer = document.getElementById('product-detail');
    if (!productDetailContainer) return;
    
    productDetailContainer.innerHTML = `
      <div class="product-images">
        <div class="main-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="price">Rs.${product.price}</p>
        <div class="product-description">
          <p>${product.description}</p>
        </div>
        <div class="product-features">
          <h3>Features</h3>
          <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="product-actions">
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <div class="quantity-controls">
              <button class="quantity-btn minus" data-action="decrease">-</button>
              <input type="number" id="quantity" name="quantity" value="1" min="1" max="10">
              <button class="quantity-btn plus" data-action="increase">+</button>
            </div>
          </div>
          <button id="add-to-cart" class="btn-primary">Add to Cart</button>
        </div>
      </div>
    `;
    
    // Add event listeners for quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.minus');
    const increaseBtn = document.querySelector('.quantity-btn.plus');
    
    decreaseBtn.addEventListener('click', () => {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      if (quantityInput.value < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      }
    });
    
    // Add event listener for add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      addToCart(product, quantity);
      
      // Show confirmation message
      const confirmationMessage = document.createElement('div');
      confirmationMessage.className = 'confirmation-message';
      confirmationMessage.innerHTML = `
        <p><i class="fas fa-check-circle"></i> ${product.name} added to cart!</p>
        <div class="confirmation-actions">
          <a href="cart.html" class="btn-primary">View Cart</a>
          <button class="btn-secondary continue-shopping">Continue Shopping</button>
        </div>
      `;
      
      document.body.appendChild(confirmationMessage);
      
      // Remove confirmation message when continue shopping is clicked
      const continueShoppingBtn = confirmationMessage.querySelector('.continue-shopping');
      continueShoppingBtn.addEventListener('click', () => {
        document.body.removeChild(confirmationMessage);
      });
      
      // Remove confirmation message after 5 seconds
      setTimeout(() => {
        if (document.body.contains(confirmationMessage)) {
          document.body.removeChild(confirmationMessage);
        }
      }, 5000);
    });
  }
  
  // Display related products
  function displayRelatedProducts(currentProduct) {
    const relatedProductsContainer = document.getElementById('related-products');
    if (!relatedProductsContainer) return;
    
    // Get 3 random products that are not the current product
    const relatedProducts = products
      .filter(product => product.id !== currentProduct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    relatedProductsContainer.innerHTML = '';
    
    relatedProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <h3>${product.name}</h3>
        <p>${product.description.substring(0, 80)}...</p>
        <p class="price">Rs.${product.price}</p>
        <a href="product-detail.html?id=${product.id}" class="btn-secondary">View Details</a>
      `;
      
      relatedProductsContainer.appendChild(productCard);
    });
  }
  
  // Add product to cart
  function addToCart(product, quantity) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
  }
  
  // Export products for use in other modules
  window.appProducts = products;
  