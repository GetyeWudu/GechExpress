# Django E-Commerce Backend Architecture

## Overview

This is a production-oriented Django REST Framework e-commerce backend designed to support an Etsy-like marketplace frontend. The backend is modular, maintainable, and ready for a React frontend.

---

## Project Structure

```
apps/
├── accounts/           # User authentication & authorization
├── products/           # Product catalog, variants, attributes
├── inventory/          # Warehouse & stock management
├── carts/              # Shopping cart & items
├── orders/             # Order management & checkout
├── payments/           # Payment processing (provider-agnostic)
├── shipping/           # Shipment & fulfillment
├── reviews/            # Product reviews & ratings
└── wishlist/           # Customer wishlists
```

---

## Core Apps

### 1. Accounts (apps/accounts)

**Models:**
- `User`: Custom user model with role-based access control
  - Roles: CUSTOMER, STAFF, MANAGER
  - Fields: email, phone_number, email_verified, role

**Authentication:**
- JWT-based authentication via SimpleJWT
- Email-based login (no username)
- Refresh token rotation
- Email verification support

**Endpoints:**
- POST `/api/v1/auth/login/` - Obtain JWT token
- POST `/api/v1/auth/token/refresh/` - Refresh access token

**Permissions:**
- `IsAuthenticated` - User must be logged in
- `IsManager` - Only managers can access
- `IsStaff` - Only staff members can access
- `IsEmailVerified` - User must verify email

---

### 2. Products (apps/products)

**Models:**
- `Product`: General catalog item
  - Fields: name, slug, description, categories, tags, is_active
  - Soft delete support
  - Auto-generates unique slugs

- `ProductVariant`: The actual purchasable item (SKU level)
  - **Price lives on variant, not product** ✓
  - Fields: product, sku, price, currency, is_default, is_active
  - One default variant per product constraint
  - Soft delete support

- `Attribute`: Product attribute types
  - Fields: name, is_active

- `AttributeValue`: Specific attribute values
  - Fields: attribute, value, is_active

- `VariantAttributeValue`: Links variants to attribute values
  - Allows multiple attributes per variant

- `ProductImage`: Multiple images per product/variant
  - Fields: product, variant, image_url, alt_text, display_order

- `Category`: Product categories
  - Hierarchical structure possible

- `Tag`: Product tags for merchandising

**Serializer Pattern:**
- `ProductReadSerializer` - Nested for public views
- `ProductWriteSerializer` - Flat for creates/updates
- Separate serializers for variants, images, attributes

**ViewSets:**
- `ProductViewSet` - CRUD with search, filter, pagination
- `ProductVariantViewSet` - Variant management
- `CategoryViewSet`, `TagViewSet`, `AttributeViewSet` - Metadata management
- Public browsing (GET) allowed for all
- Creates/updates restricted to managers

**Endpoints:**
- GET `/api/v1/catalog/products/` - List with filters, search, sort
- GET `/api/v1/catalog/products/{id}/` - Product detail
- GET `/api/v1/catalog/products/?search=...` - Full-text search
- POST, PUT, DELETE - Staff only

**Search & Discovery:**
- Search by name, description, categories, tags
- Filter by categories, tags, status
- Order by name, created_at, updated_at
- Pagination support (cursor or page-based)

---

### 3. Inventory (apps/inventory)

**Models:**
- `Warehouse`: Physical storage locations
  - Fields: name, code, address, city, country, is_active
  - Internal operational data (not exposed to customers) ✓
  - Soft delete support

- `Inventory`: Stock per warehouse + product variant
  - Fields: warehouse, product_variant, quantity, reserved_quantity
  - **Constraints:**
    - Quantity ≥ 0 (no negative stock) ✓
    - Reserved quantity ≥ 0
    - Reserved quantity ≤ quantity ✓
  - Methods:
    - `reserve()` - Atomically reserve stock
    - `release()` - Release reserved stock
    - `adjust()` - Add/remove stock
    - `reserve_for_variant()` - Reserve across warehouses for a variant

**Stock Management:**
- Multi-warehouse support
- FIFO reservation (oldest first)
- Atomic transactions for all operations
- Validation prevents invalid states

**Private API:**
- Stock management is **not exposed to public customers**
- Staff-only endpoints for inventory adjustments
- Internal service usage for checkout

---

### 4. Carts (apps/carts)

**Models:**
- `Cart`: One per authenticated user
  - Fields: user, created_at, updated_at
  - Get-or-create pattern

- `CartItem`: Items in cart
  - Fields: cart, product_variant, quantity
  - Unique constraint: one item per variant per cart
  - Uses current variant pricing ✓

**Features:**
- Add items to cart (auto-creates cart)
- Update quantities
- Remove items
- Clear entire cart
- Lazy cart creation (only on first add)

**ViewSets:**
- `CartViewSet` - Get cart, clear action
- `CartItemViewSet` - CRUD cart items

**Endpoints:**
- GET `/api/v1/cart/` - Get user's cart with items
- POST `/api/v1/cart/items/` - Add to cart
- PUT `/api/v1/cart/items/{id}/` - Update quantity
- DELETE `/api/v1/cart/items/{id}/` - Remove item
- POST `/api/v1/cart/clear/` - Clear cart

---

### 5. Orders (apps/orders)

**Models:**
- `Order`: Customer order
  - Fields: user, order_number, status, subtotal, shipping_cost, total
  - Shipping info snapshot: full_name, phone, address, city, country
  - Timestamps: created_at, updated_at
  - **Status lifecycle:**
    - pending → confirmed → processing → shipped → delivered
    - cancelled (from any state)
    - refunded (after delivered)

- `OrderItem`: Individual items in order
  - Historical snapshots: product_name, sku, unit_price, quantity, subtotal
  - **Never affected by future catalog changes** ✓
  - Reference to variant for support/analytics

**Checkout Flow:**
1. Validate cart (not empty, all variants active)
2. Validate inventory availability
3. Reserve stock atomically
4. Create order with snapshots
5. Create order items with snapshots
6. Clear cart (only on success)
7. Return order in response

**Checkout Validation:**
- Cart must not be empty
- All variants must be active
- All products must be active
- Inventory must be sufficient
- Returns clean 400 errors (not 500) ✓
- Entire transaction rolls back on failure ✓

**ViewSets:**
- `OrderViewSet` - List, retrieve, create (checkout)

**Endpoints:**
- GET `/api/v1/orders/` - List user's orders
- GET `/api/v1/orders/{id}/` - Order detail
- POST `/api/v1/orders/` - Create order (checkout)

**Permissions:**
- Customers see only their own orders
- Staff can see all orders (future: add staff views)

---

### 6. Payments (apps/payments)

**Models:**
- `Payment`: Payment records per order
  - Fields: order, amount, currency, status, provider, transaction_id, provider_reference
  - Optional: payment_method, error_message
  - One payment per order (OneToOneField) ✓
  - **Status lifecycle:**
    - pending → processing → successful
    - failed
    - refunded (from successful)

- **Provider Support:** Stripe, PayPal, Chapa, Other
  - Provider-agnostic design ✓
  - Easy to add new providers

**Services:**
- `PaymentService.initialize_payment()` - Create pending payment
- `PaymentService.process_callback()` - Handle provider callbacks
- `PaymentService.refund_payment()` - Refund successful payment

**ViewSets:**
- `PaymentViewSet` - List, retrieve, initialize, callback, refund

**Endpoints:**
- GET `/api/v1/payments/` - List user's payments
- GET `/api/v1/payments/{id}/` - Payment detail
- POST `/api/v1/payments/initialize/` - Initialize payment (requires order_id)
- POST `/api/v1/payments/callback/` - Provider callback (public)
- POST `/api/v1/payments/{id}/refund/` - Refund (staff only)

**Flow:**
1. Customer creates order
2. POST to initialize payment → creates Payment(PENDING)
3. Frontend redirects to payment provider
4. Provider calls webhook callback
5. Backend updates Payment status
6. If successful: Order status → CONFIRMED
7. If failed: Order status → CANCELLED

**Security:**
- Sensitive payment details not exposed in API responses ✓
- Transaction IDs tracked for provider reconciliation
- Provider reference stored for dispute resolution

---

### 7. Shipping (apps/shipping)

**Models:**
- `ShippingMethod`: Available shipping options
  - Fields: name, code, description, base_cost, estimated_days_min/max, is_active
  - Public browsing (GET allowed)

- `Shipment`: Fulfillment record per order
  - Fields: order, shipping_method, status, tracking_number, carrier_url
  - Recipient info: full_name, phone, address, city, country
  - Timestamps: shipped_at, delivered_at
  - Carrier reference for provider integration
  - Notes for tracking issues
  - **Status lifecycle:**
    - pending → preparing → shipped → in_transit → delivered
    - failed, returned

- `ShipmentItem`: Line items in shipment
  - Allows partial shipments across multiple batches
  - Fields: shipment, product_variant, quantity

**Services:**
- `ShippingService.create_shipment()` - Create shipment for order
- `ShippingService.update_shipment_status()` - Update status, set timestamps
- `ShippingService.cancel_shipment()` - Cancel shipment

**ViewSets:**
- `ShippingMethodViewSet` - List, retrieve (public)
- `ShipmentViewSet` - List, retrieve, create, update status, cancel

**Endpoints:**
- GET `/api/v1/shipping/methods/` - Available shipping methods
- GET `/api/v1/shipping/methods/{id}/` - Method detail
- GET `/api/v1/shipping/shipments/` - List shipments
- GET `/api/v1/shipping/shipments/{id}/` - Shipment detail
- POST `/api/v1/shipping/shipments/create/` - Create shipment (staff)
- POST `/api/v1/shipping/shipments/{id}/update-status/` - Update status (staff)
- POST `/api/v1/shipping/shipments/{id}/cancel/` - Cancel (staff)

**Customer Experience:**
- Customers can view tracking for their orders
- Automatic order status updates (pending → shipped → delivered)
- Tracking number and carrier URL available

---

### 8. Reviews (apps/reviews)

**Models:**
- `Review`: Product reviews
  - Fields: user, product_variant, order_item, rating (1-5), title, comment
  - Status: pending, approved, rejected (moderation)
  - Engagement: helpful_count, unhelpful_count
  - **Constraints:**
    - One active review per user per variant ✓
    - Rating 1-5 validated

- `ReviewVote`: Helpfulness votes
  - Fields: review, user, vote_type (helpful/unhelpful)
  - One vote per user per review

**Services:**
- `ReviewService.create_review()` - Create pending review
- `ReviewService.approve_review()` - Approve (staff)
- `ReviewService.reject_review()` - Reject (staff)
- `ReviewService.delete_review()` - Delete by owner
- `ReviewService.update_review()` - Update by owner
- `ReviewService.vote_on_review()` - Vote helpfulness

**ViewSets:**
- `ReviewViewSet` - Full CRUD with moderation

**Endpoints:**
- GET `/api/v1/reviews/` - List approved reviews (filter by product_variant_id)
- GET `/api/v1/reviews/{id}/` - Review detail
- POST `/api/v1/reviews/create/` - Create review
- PUT `/api/v1/reviews/{id}/update/` - Update (owner)
- DELETE `/api/v1/reviews/{id}/delete/` - Delete (owner)
- POST `/api/v1/reviews/{id}/approve/` - Approve (staff)
- POST `/api/v1/reviews/{id}/reject/` - Reject (staff)
- POST `/api/v1/reviews/{id}/vote/` - Vote helpfulness

**Features:**
- Purchase verification (optional: link to order_item)
- Moderation workflow (pending → approved/rejected)
- Helpfulness voting
- Duplicate prevention
- Public display of approved reviews only
- Staff can see all (pending + approved + rejected)

---

### 9. Wishlist (apps/wishlist)

**Models:**
- `Wishlist`: One per user
  - Fields: user, created_at, updated_at
  - Get-or-create on first access

- `WishlistItem`: Items in wishlist
  - Fields: wishlist, product_variant
  - Unique constraint: one item per variant per wishlist

**Services:**
- `WishlistService.get_or_create_wishlist()` - Lazy creation
- `WishlistService.add_to_wishlist()` - Add item
- `WishlistService.remove_from_wishlist()` - Remove item
- `WishlistService.clear_wishlist()` - Clear all

**ViewSets:**
- `WishlistViewSet` - Full management

**Endpoints:**
- GET `/api/v1/wishlist/` - Get user's wishlist
- POST `/api/v1/wishlist/add/` - Add item (product_variant_id)
- DELETE `/api/v1/wishlist/{id}/remove/` - Remove item
- POST `/api/v1/wishlist/clear/` - Clear all

**Features:**
- Duplicate prevention
- Lazy wishlist creation
- Variant-level wishlist (supports variants)
- Product info included in responses (name, sku, price)

---

## Authentication & Authorization

**JWT Flow:**
1. POST `/api/v1/auth/login/` with email + password
2. Response contains access_token + refresh_token
3. Client includes `Authorization: Bearer {access_token}` in headers
4. Access token valid 15 minutes, refresh token valid 7 days
5. Tokens rotate on refresh

**Permission Layers:**
- View-level: `permission_classes = [IsAuthenticated, IsStaff]`
- Object-level: Custom permissions for object ownership
- Field-level: Serializer validation

**Role-Based Access:**
- CUSTOMER: Browsing, cart, orders, reviews, wishlist
- STAFF: Order/shipment management, payment processing, review moderation
- MANAGER: Full system administration

---

## Data Integrity & Transactions

**Atomic Checkout:**
```python
@transaction.atomic
def checkout(...):
    # 1. Validate cart
    # 2. Validate inventory
    # 3. Reserve stock (with SELECT FOR UPDATE locks)
    # 4. Create order
    # 5. Create order items
    # 6. Clear cart
    # If ANY step fails, ALL changes roll back ✓
```

**Stock Safety:**
- `select_for_update()` locks rows during reservation
- Reserved quantity never exceeds quantity
- Historical snapshots prevent data loss from updates

**Order Immutability:**
- Order items snapshot all data (name, sku, price)
- Future catalog changes don't break historical orders ✓

---

## API Design Principles

**Read/Write Serializer Separation:**
```python
def get_serializer_class(self):
    if self.action in ["list", "retrieve"]:
        return ProductReadSerializer  # Nested, rich data
    return ProductWriteSerializer    # Flat, minimal data
```

**Service Layer for Complex Logic:**
- Views orchestrate
- Services contain business logic
- Models handle storage

**Error Responses:**
```json
{
  "field_name": ["Error message"],
  "non_field_errors": ["General error"]
}
```
Status 400 for validation errors, 500 only for unexpected failures

**Pagination:**
- Default: 20 items per page
- Cursor pagination available for large datasets

**Filtering:**
- DjangoFilterBackend for precise filters
- SearchFilter for full-text search
- OrderingFilter for sorting

---

## Performance Optimization

**Query Optimization:**
- `select_related()` for foreign keys
- `prefetch_related()` for many-to-many and reverse relations
- Index on frequently queried fields

**Example (Product List):**
```python
queryset = (
    Product.objects
    .filter(is_active=True)
    .prefetch_related(
        "categories",
        "tags",
        "variants",
    )
)
```

**Caching Strategy (Future):**
- Product catalog: Cache 1 hour (or on update)
- User cart: Session/cache 1 hour
- Reviews: Cache 1 day (or invalidate on approve/reject)

---

## Testing

**Test Suites:**
- Unit tests for models and services
- Integration tests for workflows (checkout, payment, shipping)
- API tests for endpoints

**Run Tests:**
```bash
python manage.py test apps.orders.tests
python manage.py test
```

---

## Migration Strategy

**Created via Django migrations:**
1. `makemigrations` - Auto-generate from models
2. `migrate` - Apply to database
3. Migrations track schema history
4. Reversible if needed

**All migrations tracked in git for collaboration**

---

## Security Best Practices

**Implemented:**
- JWT authentication (stateless, scalable)
- Role-based access control
- Object-level permissions
- Input validation in serializers
- SQL injection prevention (ORM parameterized queries)
- CSRF protection on session endpoints

**Not Exposed:**
- Warehouse/inventory data (internal only)
- Sensitive payment details
- Other users' orders/carts/wishlists
- Staff endpoints protected

---

## Future Enhancements

1. **Notifications App** - Event-based emails/SMS
   - Order created, confirmed, shipped
   - Payment success/failure
   - Review moderation

2. **Addresses App** - Separate address management
   - Multiple addresses per user
   - Address book
   - Default billing/shipping

3. **Coupons & Discounts**
   - Promo codes
   - Bulk discounts
   - Seasonal sales

4. **Analytics**
   - Popular products
   - Search trends
   - Order metrics

5. **Admin Dashboard**
   - DRF browsable admin
   - Reporting views
   - Bulk operations

6. **Social Features**
   - Seller profiles
   - Followers/following
   - Featured shops

---

## Deployment Considerations

**Production Setup:**
- PostgreSQL database (SQLite for dev only)
- Redis for sessions/caching
- Celery for async tasks
- Nginx reverse proxy
- Gunicorn application server
- SSL/TLS certificates
- Environment variables for secrets

**Environment Variables:**
```
DEBUG=False
SECRET_KEY=<random-key>
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=yourdomain.com
STRIPE_API_KEY=<key>
STRIPE_WEBHOOK_SECRET=<secret>
```

**Monitoring:**
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Log aggregation (ELK Stack)

---

## Quick Start

**Local Development:**
```bash
# Setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

# Access
- API: http://localhost:8000/api/v1/
- Admin: http://localhost:8000/admin/
```

**Run Tests:**
```bash
python manage.py test
```

---

## Summary

This backend provides a **production-ready, modular, and scalable** foundation for an Etsy-like marketplace:

✓ Role-based authentication & authorization  
✓ Multi-variant product catalog with search/filter  
✓ Multi-warehouse inventory management  
✓ Atomic checkout with stock reservation  
✓ Order management with historical preservation  
✓ Provider-agnostic payment processing  
✓ Shipment tracking & fulfillment  
✓ Product reviews with moderation  
✓ Customer wishlists  
✓ Clean API design for frontend consumption  
✓ Comprehensive tests & error handling  
✓ Performance optimized queries  

The backend is ready for a React frontend to build an Etsy-like shopping experience!
