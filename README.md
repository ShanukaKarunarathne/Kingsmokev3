# Kingsmoke - Ultra Luxury Rolling Papers

A premium e-commerce website for Kingsmoke, a luxury rolling papers brand.

## Project Overview

This project is a fully responsive e-commerce website for Kingsmoke, featuring:

- Home page with hero section, featured products, about section, and contact form
- Products page with filtering options
- Product detail pages
- Shopping cart functionality
- Checkout process
- Order confirmation/receipt page

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase (for order processing)
- Local Storage (for cart management)

## Project Structure

```
kingsmoke/
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── receipt.js
│   │   └── firebase.js
│   ├── pages/
│   │   ├── products.html
│   │   ├── product-detail.html
│   │   ├── cart.html
│   │   ├── checkout.html
│   │   └── receipt.html
│   └── index.html
└── README.md
```

## Setup Instructions

1. Clone the repository
2. Configure Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore database
   - Update the Firebase configuration in `src/js/firebase.js` with your project details
3. Open `index.html` in your browser or use a local server

## Features

### Product Management

- Display of featured products on home page
- Complete product catalog with filtering options
- Detailed product pages with related products

### Shopping Cart

- Add products to cart
- Update quantities
- Remove items
- Persistent cart using localStorage

### Checkout Process

- Customer information collection
- Order summary
- Cash on delivery payment option

### Order Confirmation

- Order details display
- Printable receipt

## Responsive Design

The website is fully responsive and optimized for:

- Desktop
- Tablet
- Mobile devices

## Future Enhancements

- User authentication
- Additional payment methods
- Product reviews and ratings
- Admin dashboard for order management
- Inventory tracking
