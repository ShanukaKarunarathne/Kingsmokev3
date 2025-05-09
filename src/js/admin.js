 
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // DOM Elements
  const loginContainer = document.getElementById('login-container');
  const dashboardContainer = document.getElementById('dashboard-container');
  const ordersContainer = document.getElementById('orders-container');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Simple admin credentials (in a real app, use Firebase Authentication)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'kingsmoke123';
  
  // Check if admin is logged in
  function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      showDashboard();
      loadOrders();
    } else {
      showLogin();
    }
  }
  
  // Show login form
  function showLogin() {
    loginContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
  }
  
  // Show dashboard
  function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
  }
  
  // Handle admin login
  function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      showDashboard();
      loadOrders();
    } else {
      alert('Invalid username or password');
    }
  }
  
  // Handle admin logout
  function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
  }
  
  // Load orders from Firebase
  function loadOrders() {
    ordersContainer.innerHTML = '<p>Loading orders...</p>';
    
    db.collection('orders')
      .orderBy('date', 'desc')
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          ordersContainer.innerHTML = '<p>No orders found.</p>';
          return;
        }
        
        ordersContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const orderId = doc.id;
          const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const orderCard = document.createElement('div');
          orderCard.className = 'admin-card';
          
          // Create status badge class
          const statusClass = `status-${order.status || 'pending'}`;
          
          orderCard.innerHTML = `
            <div class="order-header">
              <div>
                <h3>Order #${orderId.substring(0, 8)}</h3>
                <p>${orderDate}</p>
              </div>
              <div>
                <span class="status-badge ${statusClass}">${order.status || 'Pending'}</span>
                <select class="status-select" data-order-id="${orderId}">
                  <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <p><strong>Customer:</strong> ${order.customer.fullname}</p>
              <p><strong>Total:</strong> Rs.${order.total}</p>
              <button class="toggle-details" data-order-id="${orderId}">Show Details</button>
            </div>
            <div class="order-details" id="details-${orderId}">
              <div class="customer-info">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customer.fullname}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
                <p><strong>Payment Method:</strong> ${order.customer.paymentMethod}</p>
              </div>
              <div class="order-items">
                <h4>Order Items</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items.map(item => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs.${item.price}</td>
                        <td>Rs.${item.price * item.quantity}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <div class="order-summary">
                <p><strong>Subtotal:</strong> Rs.${order.subtotal}</p>
                <p><strong>Delivery Fee:</strong> Rs.${order.deliveryFee}</p>
                <p><strong>Total:</strong> Rs.${order.total}</p>
              </div>
            </div>
          `;
          
          ordersContainer.appendChild(orderCard);
        });
        
        // Add event listeners to toggle buttons
        document.querySelectorAll('.toggle-details').forEach(button => {
          button.addEventListener('click', toggleOrderDetails);
        });
        
        // Add event listeners to status selects
        document.querySelectorAll('.status-select').forEach(select => {
          select.addEventListener('change', updateOrderStatus);
        });
      })
      .catch((error) => {
        console.error("Error loading orders: ", error);
        ordersContainer.innerHTML = '<p>Error loading orders. Please try again.</p>';
      });
  }
  
  // Toggle order details visibility
  function toggleOrderDetails(event) {
    const orderId = event.target.getAttribute('data-order-id');
    const detailsElement = document.getElementById(`details-${orderId}`);
    
    if (detailsElement.classList.contains('active')) {
      detailsElement.classList.remove('active');
      event.target.textContent = 'Show Details';
    } else {
      detailsElement.classList.add('active');
      event.target.textContent = 'Hide Details';
    }
  }
  
  // Update order status
  function updateOrderStatus(event) {
    const orderId = event.target.getAttribute('data-order-id');
    const newStatus = event.target.value;
    
    db.collection('orders').doc(orderId).update({
      status: newStatus
    })
    .then(() => {
    const statusBadge = event.target.previousElementSibling;
    statusBadge.className = `status-badge status-${newStatus}`;
    statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    // Show success message
    alert(`Order status updated to ${newStatus}`);
  })
  .catch((error) => {
    console.error("Error updating order status: ", error);
    alert('Error updating order status. Please try again.');
    // Reset the select to the previous value
    event.target.value = statusBadge.textContent.toLowerCase();
  });
}

// Export orders to CSV
function exportOrdersToCSV() {
  db.collection('orders')
    .orderBy('date', 'desc')
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        alert('No orders to export');
        return;
      }
      
      // Create CSV header
      let csv = 'Order ID,Date,Customer Name,Email,Phone,Address,City,State,Pincode,Payment Method,Status,Subtotal,Delivery Fee,Total\n';
      
      // Add order data
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        const orderId = doc.id;
        const date = new Date(order.date).toLocaleDateString('en-IN');
        
        // Format address to handle commas
        const address = `"${order.customer.address}"`;
        
        csv += `${orderId},${date},${order.customer.fullname},${order.customer.email},${order.customer.phone},${address},${order.customer.city},${order.customer.state},${order.customer.pincode},${order.customer.paymentMethod},${order.status || 'pending'},${order.subtotal},${order.deliveryFee},${order.total}\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'kingsmoke_orders.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error("Error exporting orders: ", error);
      alert('Error exporting orders. Please try again.');
    });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  checkAdminLogin();
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Add export button to admin header
  const adminHeader = document.querySelector('.admin-header');
  if (adminHeader) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-primary';
    exportBtn.textContent = 'Export Orders';
    exportBtn.addEventListener('click', exportOrdersToCSV);
    
    // Insert before logout button
    adminHeader.insertBefore(exportBtn, logoutBtn);
  }
});
 