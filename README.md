# E-commerce-Platform-Backend
A comprehensive e-commerce platform backend that caters for users being able to browse products, make purchases, manage their accounts, and interact with customer support.


///tsc && node dist/server.js

##Features:
-User Management(Resource: Users)
**Sign Up User (Create User and Hashed Password)
**Login User (JWT authentication with refresh and access token // RBAC token for User and Admin roles)
**Authenticate User (Authentication Middleware)
**User Profile (Fetch , Update, & Delete  data // User address for billing information and payment details) 


-Product Management(Resource: Products)
**Admin (Resource: Admin // Can create(add), update, delete  products)
** Store product details (name, price, description, image, category).
**Users (Fetch products by filtering, pagination and search functionality)


-Shopping Cart Management(Resource: Cart)
**Add, update, remove products in the cart
**Maintain cart state in Supabase.


-Order Management (Resource: Order)
**Users can track orders, view order history.
**Admins can update order status, process refunds

-Payment Management (Resource: Payment)
**Integrate with Stripe for secure payments.
**Implement order summary, payment processing, and confirmation.

##Security, Optimization & Deployment:
-Use Helmet.js, input validation, and CORS.
-Rate limiting, XSS/SQL injection protection.
-Implement caching (Supabase cache).
-Optimize database queries.


//USER TABLE (users - User data):
- Full Name, Email, Password, role

//BILLING ADDRESS TABLE (billing_addresses - Single/Multiple addresses):

//PAYMENT DETAILS TABLE (payments -  Payment methods used by a user):

//PRODUCT TABLE (products - Stores product details or information):
- Stores all product-related data like name, price, and stock count.

//CATEGORIES TABLE (categories - Classifies products into categories):
- Helps organize products ("Electronics", "Clothing", "Books")

//ORDER ITEM TABLE (Order Items Table – Tracks which products were purchased in each order):
- Since a single order can have multiple products, we create a junction table to connect orders and products.

//ORDER TABLE (orders):

/ecommerce-app  
│── /src  
│   ├── /routes  
│   │   ├── auth.routes.ts  
│   │   ├── product.routes.ts  
│   │   ├── order.routes.ts  
│   │   ├── user.routes.ts  
│   ├── /controllers  
│   │   ├── auth.controller.ts  
│   │   ├── product.controller.ts  
│   │   ├── order.controller.ts  
│   │   ├── user.controller.ts  
│   ├── /middlewares  
│   ├── /services  
│   ├── /config  
│   ├── /utils  
│   ├── app.ts  
│   ├── server.ts  
│── .env  
│── package.json  
│── tsconfig.json  
│── README.md  
