# API Reference Guide

Base URL: `http://localhost:8000/api/v1/`

## Authentication

### Login
```
POST /auth/login/
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}

Response (201):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Include token in all requests:**
```
Authorization: Bearer {access_token}
```

---

## Products (Public)

### List Products
```
GET /catalog/products/
?search=laptop
&category=1
&ordering=-created_at
&page=1

Response (200):
{
  "count": 150,
  "next": "http://...?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "MacBook Pro",
      "slug": "macbook-pro",
      "description": "...",
      "categories": [1, 2],
      "tags": [3, 4],
      "is_active": true,
      "variants": [
        {
          "id": 1,
          "sku": "MBP-16-512-2024",
          "price": "1999.99",
          "currency": "USD",
          "is_default": true
        }
      ],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Product Details
```
GET /catalog/products/1/

Response (200):
{
  "id": 1,
  "name": "MacBook Pro",
  "slug": "macbook-pro",
  "description": "...",
  "categories": [1, 2],
  "tags": [3, 4],
  "is_active": true,
  "variants": [
    {
      "id": 1,
      "sku": "MBP-16-512-2024",
      "price": "1999.99",
      "currency": "USD",
      "is_default": true,
      "is_active": true,
      "attribute_values": [...]
    }
  ],
  "images": [
    {
      "id": 1,
      "image_url": "https://...",
      "alt_text": "Front view"
    }
  ]
}
```

### List Categories
```
GET /catalog/categories/

Response (200):
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  }
]
```

### List Tags
```
GET /catalog/tags/

Response (200):
[
  {
    "id": 1,
    "name": "Sale",
    "slug": "sale"
  }
]
```

---

## Shopping Cart

### Get Cart
```
GET /cart/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product_variant": 5,
      "quantity": 2,
      "product_name": "MacBook Pro",
      "sku": "MBP-16-512-2024",
      "price": "1999.99",
      "total": "3999.98"
    }
  ],
  "created_at": "2024-01-20T08:00:00Z",
  "updated_at": "2024-01-20T08:00:00Z"
}
```

### Add to Cart
```
POST /cart/items/
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_variant": 5,
  "quantity": 1
}

Response (201):
{
  "id": 1,
  "product_variant": 5,
  "quantity": 1,
  "product_name": "MacBook Pro",
  "sku": "MBP-16-512-2024",
  "price": "1999.99"
}
```

### Update Cart Item
```
PUT /cart/items/1/
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}

Response (200):
{
  "id": 1,
  "product_variant": 5,
  "quantity": 3,
  "product_name": "MacBook Pro",
  "sku": "MBP-16-512-2024",
  "price": "1999.99"
}
```

### Remove from Cart
```
DELETE /cart/items/1/
Authorization: Bearer {token}

Response (204):
```

### Clear Cart
```
POST /cart/clear/
Authorization: Bearer {token}

Response (204):
```

---

## Checkout & Orders

### Create Order (Checkout)
```
POST /orders/
Authorization: Bearer {token}
Content-Type: application/json

{
  "shipping_full_name": "John Doe",
  "shipping_phone": "1234567890",
  "shipping_address": "123 Main Street",
  "shipping_city": "San Francisco",
  "shipping_country": "USA",
  "shipping_cost": "10.00"
}

Response (201):
{
  "id": 1,
  "order_number": "ORD-ABC123XYZ789",
  "status": "pending",
  "subtotal": "3999.98",
  "shipping_cost": "10.00",
  "total": "4009.98",
  "shipping_full_name": "John Doe",
  "shipping_phone": "1234567890",
  "shipping_address": "123 Main Street",
  "shipping_city": "San Francisco",
  "shipping_country": "USA",
  "items": [
    {
      "id": 1,
      "product_variant": 5,
      "product_name": "MacBook Pro",
      "sku": "MBP-16-512-2024",
      "unit_price": "1999.99",
      "quantity": 2,
      "subtotal": "3999.98"
    }
  ],
  "created_at": "2024-01-20T10:00:00Z",
  "updated_at": "2024-01-20T10:00:00Z"
}
```

### List Orders
```
GET /orders/
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "order_number": "ORD-ABC123XYZ789",
    "status": "confirmed",
    "total": "4009.98",
    "items": [...],
    "created_at": "2024-01-20T10:00:00Z"
  }
]
```

### Get Order Details
```
GET /orders/1/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "order_number": "ORD-ABC123XYZ789",
  "status": "confirmed",
  "subtotal": "3999.98",
  "shipping_cost": "10.00",
  "total": "4009.98",
  "items": [
    {
      "id": 1,
      "product_variant": 5,
      "product_name": "MacBook Pro",
      "sku": "MBP-16-512-2024",
      "unit_price": "1999.99",
      "quantity": 2,
      "subtotal": "3999.98"
    }
  ],
  "created_at": "2024-01-20T10:00:00Z",
  "updated_at": "2024-01-20T10:00:00Z"
}
```

---

## Payments

### Initialize Payment
```
POST /payments/initialize/
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 1,
  "provider": "stripe"
}

Response (201):
{
  "id": 1,
  "order": 1,
  "amount": "4009.98",
  "currency": "USD",
  "status": "pending",
  "provider": "stripe",
  "created_at": "2024-01-20T10:00:00Z"
}
```

### Payment Callback (from Provider)
```
POST /payments/callback/
Content-Type: application/json
(No auth required - provider calls this)

{
  "order_id": 1,
  "transaction_id": "txn_1234567890",
  "status": "successful",
  "provider": "stripe",
  "provider_reference": "pi_1234567890"
}

Response (200):
{
  "id": 1,
  "order": 1,
  "amount": "4009.98",
  "status": "successful",
  "transaction_id": "txn_1234567890",
  "provider": "stripe"
}
```

### List Payments
```
GET /payments/
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "order": 1,
    "amount": "4009.98",
    "status": "successful",
    "provider": "stripe",
    "transaction_id": "txn_1234567890",
    "created_at": "2024-01-20T10:00:00Z"
  }
]
```

### Refund Payment (Staff Only)
```
POST /payments/1/refund/
Authorization: Bearer {staff_token}

Response (200):
{
  "id": 1,
  "order": 1,
  "amount": "4009.98",
  "status": "refunded",
  "provider": "stripe"
}
```

---

## Shipping

### List Shipping Methods
```
GET /shipping/methods/

Response (200):
[
  {
    "id": 1,
    "name": "Standard Shipping",
    "code": "STANDARD",
    "description": "3-5 business days",
    "base_cost": "10.00",
    "estimated_days_min": 3,
    "estimated_days_max": 5,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Express Shipping",
    "code": "EXPRESS",
    "description": "1-2 business days",
    "base_cost": "25.00",
    "estimated_days_min": 1,
    "estimated_days_max": 2,
    "is_active": true
  }
]
```

### Create Shipment (Staff Only)
```
POST /shipping/shipments/create/
Authorization: Bearer {staff_token}
Content-Type: application/json

{
  "order_id": 1,
  "shipping_method": 1,
  "recipient_full_name": "John Doe",
  "recipient_phone": "1234567890",
  "recipient_address": "123 Main Street",
  "recipient_city": "San Francisco",
  "recipient_country": "USA",
  "tracking_number": "1Z999AA10123456784",
  "carrier_url": "https://tracking.ups.com/...",
  "notes": "Left with neighbor"
}

Response (201):
{
  "id": 1,
  "order": 1,
  "shipping_method": 1,
  "status": "pending",
  "tracking_number": "1Z999AA10123456784",
  "shipped_at": null,
  "delivered_at": null,
  "items": []
}
```

### Update Shipment Status (Staff Only)
```
POST /shipping/shipments/1/update-status/
Authorization: Bearer {staff_token}
Content-Type: application/json

{
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784",
  "carrier_url": "https://tracking.ups.com/..."
}

Response (200):
{
  "id": 1,
  "order": 1,
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784",
  "shipped_at": "2024-01-21T14:00:00Z",
  "delivered_at": null,
  "items": []
}
```

### Get Shipment (Customer or Staff)
```
GET /shipping/shipments/1/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "order": 1,
  "shipping_method_name": "Standard Shipping",
  "status": "in_transit",
  "tracking_number": "1Z999AA10123456784",
  "carrier_url": "https://tracking.ups.com/...",
  "shipped_at": "2024-01-21T14:00:00Z",
  "delivered_at": null,
  "items": []
}
```

---

## Reviews

### List Reviews
```
GET /reviews/
?product_variant_id=5

Response (200):
[
  {
    "id": 1,
    "user_email": "customer@example.com",
    "product_variant": 5,
    "rating": 5,
    "title": "Excellent product!",
    "comment": "Works great, highly recommended",
    "status": "approved",
    "helpful_count": 12,
    "unhelpful_count": 1,
    "created_at": "2024-01-10T15:00:00Z"
  }
]
```

### Create Review
```
POST /reviews/create/
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_variant_id": 5,
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Works great, highly recommended",
  "order_item_id": 1
}

Response (201):
{
  "id": 1,
  "product_variant": 5,
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Works great, highly recommended",
  "status": "pending",
  "helpful_count": 0,
  "unhelpful_count": 0,
  "created_at": "2024-01-20T20:00:00Z"
}
```

### Update Review
```
PUT /reviews/1/update/
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Good, but could be better"
}

Response (200):
{
  "id": 1,
  "rating": 4,
  "comment": "Good, but could be better",
  "status": "pending"
}
```

### Vote on Review
```
POST /reviews/1/vote/
Authorization: Bearer {token}
Content-Type: application/json

{
  "vote_type": "helpful"
}

Response (200):
{
  "id": 1,
  "helpful_count": 13,
  "unhelpful_count": 1
}
```

### Approve Review (Staff Only)
```
POST /reviews/1/approve/
Authorization: Bearer {staff_token}

Response (200):
{
  "id": 1,
  "status": "approved"
}
```

---

## Wishlist

### Get Wishlist
```
GET /wishlist/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product_variant": 5,
      "product_name": "MacBook Pro",
      "sku": "MBP-16-512-2024",
      "price": "1999.99",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Add to Wishlist
```
POST /wishlist/add/
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_variant_id": 5
}

Response (201):
{
  "id": 1,
  "product_variant": 5,
  "product_name": "MacBook Pro",
  "sku": "MBP-16-512-2024",
  "price": "1999.99"
}
```

### Remove from Wishlist
```
DELETE /wishlist/1/remove/
Authorization: Bearer {token}

Response (204):
```

### Clear Wishlist
```
POST /wishlist/clear/
Authorization: Bearer {token}

Response (204):
```

---

## Error Responses

### Validation Error (400)
```json
{
  "field_name": ["Error message"],
  "non_field_errors": ["General error"]
}
```

### Authentication Error (401)
```json
{
  "detail": "Invalid authentication credentials"
}
```

### Permission Denied (403)
```json
{
  "detail": "Permission denied"
}
```

### Not Found (404)
```json
{
  "detail": "Not found"
}
```

### Server Error (500)
```json
{
  "detail": "Internal server error"
}
```

---

## Status Codes Reference

- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE or action
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - User lacks permission
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Unexpected error

---

## Common Query Parameters

**Pagination:**
```
?page=1&page_size=20
```

**Filtering:**
```
?status=pending
?category=electronics
```

**Searching:**
```
?search=laptop
```

**Ordering:**
```
?ordering=-created_at
?ordering=price
```

**Combining:**
```
?search=laptop&category=1&ordering=-price&page=1
```

---

## Frontend Integration Tips

1. **Store auth tokens in secure cookies or localStorage**
2. **Refresh token before expiry** (access: 15 min, refresh: 7 days)
3. **Display pending reviews to staff only**
4. **Show approved reviews to customers**
5. **Handle stock errors gracefully** (check inventory before checkout)
6. **Listen to shipment status updates** (poll or webhook)
7. **Cache product catalog** (expires after 1 hour or on update)
8. **Validate on both frontend and backend**

---

## Example Checkout Flow

```javascript
// 1. Add items to cart
POST /cart/items/ { product_variant: 5, quantity: 2 }

// 2. Create order
POST /orders/ { 
  shipping_full_name: "John Doe",
  shipping_phone: "1234567890",
  shipping_address: "123 Main Street",
  shipping_city: "San Francisco",
  shipping_country: "USA",
  shipping_cost: "10.00"
}
// Response: order_id = 1

// 3. Initialize payment
POST /payments/initialize/ { order_id: 1, provider: "stripe" }
// Response: payment_id = 1

// 4. Redirect to payment provider
window.location = "https://stripe.com/checkout/..."

// 5. Provider calls webhook with callback
POST /payments/callback/ { 
  order_id: 1,
  transaction_id: "txn_123",
  status: "successful",
  provider: "stripe"
}

// 6. Order automatically confirmed
// Customer can now view order and tracking
```
