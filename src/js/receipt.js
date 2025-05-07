// Get order details from localStorage
const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

// If no order details, redirect to home page
if (!lastOrder) {
  window.location.href = '../index.html';
}

// Initialize receipt page
function initReceipt() {
  displayOrderDetails();
  
  // Add event listener for print button
  const printButton = document.getElementById('print-receipt');
  if (printButton) {
    printButton.addEventListener('click', () => {
      window.print();
    });
  }
}

// Display order details on receipt
function displayOrderDetails() {
  // Set order ID and date
  const orderIdElement = document.getElementById('order-id');
  const orderDateElement = document.getElementById('order-date');
  
  if (orderIdElement) orderIdElement.textContent = lastOrder.id;
  if (orderDateElement) {
    const orderDate = new Date(lastOrder.date);
    orderDateElement.textContent = orderDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Display customer information
  const customerInfoContainer = document.getElementById('customer-info');
  if (customerInfoContainer) {
    customerInfoContainer.innerHTML = `
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${lastOrder.customer.fullname}</p>
      <p><strong>Email:</strong> ${lastOrder.customer.email}</p>
      <p><strong>Phone:</strong> ${lastOrder.customer.phone}</p>
      <p><strong>Shipping Address:</strong> ${lastOrder.customer.address}, ${lastOrder.customer.city}, ${lastOrder.customer.state} - ${lastOrder.customer.pincode}</p>
    `;
  }
  
  // Display order items
  const receiptItemsContainer = document.getElementById('receipt-items');
  if (receiptItemsContainer) {
    receiptItemsContainer.innerHTML = '';
    
    lastOrder.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>Rs.${item.price}</td>
        <td>Rs.${item.price * item.quantity}</td>
      `;
      
      receiptItemsContainer.appendChild(row);
    });
  }
  
  // Update totals
  const subtotalElement = document.getElementById('receipt-subtotal');
  const totalElement = document.getElementById('receipt-total');
  
  if (subtotalElement) subtotalElement.textContent = `Rs.${lastOrder.subtotal}`;
  if (totalElement) totalElement.textContent = `Rs.${lastOrder.total}`;
}

// Initialize receipt page when DOM is loaded
document.addEventListener('DOMContentLoaded', initReceipt);
