# Frontend Setup & Getting Started

This is a production-ready Etsy-like marketplace frontend built with React 19, TypeScript, and Tailwind CSS.

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend Connection

The frontend expects the backend API at `http://localhost:8000/api/v1`

If you need to change this, update `API_BASE_URL` in `src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

Or use environment variables:

Create `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Marketplace
```

### 3. Start Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173`

The server has HMR (Hot Module Replacement) enabled for live reloading.

### 4. Build for Production

```bash
npm run build
```

Output goes to `dist/` directory. Deploy this folder to your hosting service.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout/          # Header, Footer, Layout wrapper
│   ├── pages/               # Page components (Home, Product, Cart, etc.)
│   ├── api/                 # API client and React Query hooks
│   ├── stores/              # Zustand state management
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite bundler config
├── postcss.config.js        # PostCSS config (Tailwind)
├── package.json             # Dependencies
└── README.md                # Full documentation
```

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with featured products & categories |
| `/search` | Product search with filters & sorting |
| `/category/:categoryId` | Browse products by category |
| `/product/:slug` | Product detail page with reviews |
| `/cart` | Shopping cart management |
| `/checkout` | Order creation & shipping info |
| `/orders` | Order history & tracking |
| `/wishlist` | Saved items |
| `/account` | User profile & settings |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |

## Key Features

### 🔐 Authentication
- JWT token-based auth
- Access tokens (15 min) + Refresh tokens (7 days)
- Automatic token refresh on API calls
- Redirects to login on auth failure

### 🛒 Shopping
- Add/remove/update cart items
- Real-time cart totals
- Inventory validation
- Shipping method selection
- Order creation & confirmation

### ❤️ Wishlist
- Save favorite products
- Quick add to cart from wishlist
- Persistent across sessions

### ⭐ Reviews
- Product ratings (1-5 stars)
- Customer reviews
- Helpful/unhelpful voting

### 🎨 UI/UX
- Responsive mobile-first design
- Smooth animations with Framer Motion
- Dark mode ready (extend with theme switcher)
- Accessible with semantic HTML & ARIA labels

## Development Workflow

### 1. Feature Development

Create a new page component:

```typescript
// src/pages/ExamplePage.tsx
import { useProducts } from '@api/queries'

export default function ExamplePage() {
  const { data: products, isLoading } = useProducts()
  
  return <div>Your content</div>
}
```

Add the route in `App.tsx`:

```typescript
<Route path="/example" element={<ExamplePage />} />
```

### 2. API Integration

Use React Query hooks from `src/api/queries.ts`:

```typescript
import { useProducts, useAddToCart } from '@api/queries'

// Fetching
const { data, isLoading, error } = useProducts({ search: 'laptop' })

// Mutation
const addToCart = useAddToCart()
await addToCart.mutateAsync({ product_variant: 1, quantity: 2 })
```

### 3. State Management

- **Global UI State**: Zustand stores in `src/stores/`
  - Auth (user, tokens)
  - Cart (items, totals)
  - Wishlist (saved items)

- **Server State**: React Query (automatic caching & invalidation)

### 4. Styling

Use Tailwind CSS utility classes:

```tsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-[#051822] mb-4">Title</h1>
  <button className="bg-[#F1641E] text-white px-6 py-2 rounded-lg hover:opacity-90">
    Action
  </button>
</div>
```

Custom theme colors available in `tailwind.config.js`:
- Primary: `#F1641E` (Orange)
- Secondary: `#F7F5F2` (Light)
- Accent: `#051822` (Dark)

## Common Issues & Solutions

### Issue: CORS errors from backend

**Solution**: Ensure backend CORS settings allow frontend domain:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Dev
    "https://yourdomain.com", # Production
]
```

### Issue: Stuck on login, no redirect

**Solution**: Check browser console for errors. Ensure:
1. Backend is running on `localhost:8000`
2. Login endpoint is working: `POST /api/v1/auth/login/`
3. Tokens are being stored in localStorage

### Issue: Products not loading

**Solution**: Verify API endpoints exist:
- `GET /api/v1/catalog/products/`
- `GET /api/v1/catalog/categories/`
- `GET /api/v1/catalog/tags/`

### Issue: Build fails with CSS errors

**Solution**: Ensure you're using Tailwind v4 format. Update `src/index.css`:

```css
@import "tailwindcss";

@layer base {
  /* your styles */
}
```

### Issue: HMR not working in development

**Solution**: Make sure Vite dev server is running. Check:
1. Port 5173 is not blocked
2. No other process using that port
3. Restart dev server: `npm run dev`

## Deployment

### Build Optimization

The current build is ~624 KB (uncompressed). To reduce:

1. **Code Splitting**: Use dynamic imports for routes
   ```typescript
   const HomePage = lazy(() => import('@pages/HomePage'))
   ```

2. **Tree Shaking**: Ensure unused code is removed in build

3. **Lazy Load Images**: Use native lazy loading
   ```tsx
   <img src={url} loading="lazy" alt="..." />
   ```

### Production Checklist

- [ ] Update API base URL for production
- [ ] Set `NODE_ENV=production`
- [ ] Enable gzip compression on server
- [ ] Set cache headers for static assets
- [ ] Configure CORS for production domain
- [ ] Enable security headers (CSP, X-Frame-Options, etc.)
- [ ] Set up SSL certificate
- [ ] Configure CDN for assets
- [ ] Monitor with Sentry or similar
- [ ] Set up analytics

### Hosting Options

**Vercel** (easiest for React):
```bash
npm install -g vercel
vercel
```

**Netlify**:
1. Push to Git
2. Connect repo in Netlify UI
3. Set build command: `npm run build`
4. Set publish directory: `dist`

**Traditional Server**:
```bash
# Build
npm run build

# Upload dist/ folder to server
# Serve with nginx/apache with proper headers
```

**Docker**:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Performance Tips

1. **Monitor Bundle Size**: `npm run build` shows bundle sizes

2. **Use React DevTools**: Install browser extension to profile components

3. **React Query Devtools**: Add for debugging queries (dev only):
   ```bash
   npm install @tanstack/react-query-devtools
   ```

4. **Lazy Load Routes**: Load page components only when needed

5. **Image Optimization**: Use WebP format, compress, lazy load

6. **Code Splitting**: Large dependencies should be code-split

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes following existing patterns
3. Test locally: `npm run dev`
4. Build & verify: `npm run build`
5. Commit & push
6. Create pull request

## Troubleshooting

### TypeScript Errors

- Run `npm run build` to see all errors
- Check `tsconfig.json` for strict mode settings
- Use `any` sparingly - define proper types in `src/types/`

### Runtime Errors

- Open browser DevTools Console
- Check Network tab for failed API calls
- Look for 401 (unauthorized) responses - means token expired
- Check localStorage for auth tokens

### Performance Issues

- Open DevTools Performance tab
- Look for long-running tasks (>50ms)
- Profile with Lighthouse in DevTools
- Check bundle size: `npm run build`

## Next Steps

1. ✅ Run `npm install` to set up dependencies
2. ✅ Start dev server: `npm run dev`
3. ✅ Browse to `http://localhost:5173`
4. ✅ Test login with backend credentials
5. ✅ Build for production: `npm run build`

## Support

- See `README.md` for full documentation
- Check backend README at `../backend/README.md`
- Review API Reference at `../backend/API_REFERENCE.md`

---

**Happy coding!** 🚀
