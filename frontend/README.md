# Etsy-like Marketplace Frontend

A production-ready React + TypeScript marketplace frontend built with modern tools and best practices.

## Features

- 🛍️ Browse products with advanced filtering and search
- 🎨 Beautiful Etsy-inspired UI with Tailwind CSS
- 🛒 Full shopping cart and checkout flow
- 👤 User authentication and account management
- ❤️ Wishlist/favorites functionality
- ⭐ Reviews and ratings system
- 📦 Order tracking and history
- 📱 Fully responsive mobile-first design
- ♿ Accessible with semantic HTML and ARIA labels
- 🚀 Fast and optimized with Vite

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (local UI) + React Query (server state)
- **HTTP Client**: Axios with JWT interceptors
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: shadcn/ui patterns + custom components
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer, Layout wrapper
│   └── ProductCard.tsx # Product card component
├── pages/              # Page components
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── HomePage.tsx
│   ├── SearchResultsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── WishlistPage.tsx
│   ├── CategoryPage.tsx
│   └── AccountPage.tsx
├── api/                # API client and queries
│   ├── client.ts       # Axios instance with JWT interceptors
│   └── queries.ts      # React Query hooks
├── stores/             # Zustand stores
│   ├── auth.ts         # Auth state
│   ├── cart.ts         # Cart state
│   └── wishlist.ts     # Wishlist state
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## API Integration

The frontend connects to the Django REST Framework backend at `http://localhost:8000/api/v1`. 

### Key API Endpoints

- **Auth**: `/auth/login/`, `/auth/token/refresh/`
- **Products**: `/catalog/products/`, `/catalog/categories/`, `/catalog/tags/`
- **Cart**: `/cart/`, `/cart/items/`
- **Orders**: `/orders/`
- **Payments**: `/payments/initialize/`, `/payments/callback/`
- **Reviews**: `/reviews/`
- **Wishlist**: `/wishlist/`
- **Shipping**: `/shipping/methods/`

See the backend's `API_REFERENCE.md` for full documentation.

## Authentication Flow

1. User signs in with email/password
2. Backend returns `access` and `refresh` tokens
3. Tokens stored in localStorage
4. Access token attached to all API requests via Authorization header
5. On 401, refresh token automatically used to get new access token
6. If refresh fails, user is logged out and redirected to login

## State Management

### Zustand Stores

- **Auth Store**: User and authentication state
- **Cart Store**: Shopping cart items and totals
- **Wishlist Store**: Saved items

### React Query

- Server state management with automatic caching
- Query invalidation on mutations
- Built-in loading and error states
- Optimistic updates support

## Styling

Uses Tailwind CSS with custom theme:

- **Primary Color**: #F1641E (Orange marketplace feel)
- **Secondary Color**: #F7F5F2 (Light neutral)
- **Accent Color**: #051822 (Dark text)
- **Light Background**: #FAFAF8

Custom components in `tailwind.config.js` include soft shadows, rounded borders, and animations.

## Component Patterns

### ProductCard

Reusable component for displaying products across different sections:

```tsx
<ProductCard product={product} onQuickView={handleQuickView} />
```

Features:
- Image gallery with hover effects
- Price and ratings display
- Add to cart button
- Wishlist toggle
- Sale badges

## Responsive Design

- Mobile-first approach
- Tablet optimizations (768px)
- Desktop enhancements (1024px)
- Touch-friendly controls on mobile
- Collapsible navigation on smaller screens

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Alt text for all images
- Screen reader friendly

## Error Handling

- API errors caught and displayed to users
- Form validation with user-friendly messages
- Network error recovery
- Loading states for async operations
- Toast notifications for feedback (can be added)

## Performance Optimizations

- Code splitting with React Router lazy loading
- Image optimization with lazy loading
- Query caching to reduce API calls
- Memoization of expensive components
- Efficient re-renders with Zustand
- Production build minification via Vite

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Marketplace
```

## Development Tips

- **HMR**: Hot Module Replacement enabled for fast development
- **Debugging**: Use React DevTools browser extension
- **Network**: Open Network tab in DevTools to inspect API calls
- **State**: Use Zustand DevTools for store debugging
- **Queries**: React Query DevTools for server state inspection

## Building & Deployment

```bash
# Build for production
npm run build

# Output goes to dist/ directory
# Deploy dist/ folder to your hosting service
```

### Deployment Considerations

- Set `VITE_API_BASE_URL` to production backend URL
- Configure CORS on backend to allow frontend domain
- Use environment-specific API URLs
- Enable gzip compression on server
- Cache static assets with appropriate headers
- Monitor performance with real user monitoring (RUM)

## Common Issues

### CORS Errors
- Ensure backend is running on correct port
- Check backend CORS settings
- Verify API base URL in environment

### Token Expiration
- Access token expires after 15 minutes
- Refresh token automatically requested
- If both expire, user logged out

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

## Future Enhancements

- [ ] Toast notifications system
- [ ] Product image upload
- [ ] Advanced search with facets
- [ ] User reviews with images
- [ ] Real-time inventory updates
- [ ] Payment gateway integration
- [ ] Seller dashboard
- [ ] Social sharing
- [ ] Email notifications
- [ ] Analytics integration

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure code passes linting
4. Submit a pull request

## License

MIT

## Support

For backend issues, see the backend README at `../backend/README.md`
