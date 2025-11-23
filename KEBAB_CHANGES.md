# Kebab na Kyjevskom - Changes Summary

## Branch: kebabnakyjevskom

This branch contains a complete adaptation of the Bubko loyalty system for Kebab na Kyjevskom fast food restaurant.

## Key Changes

### 1. Branding & Theme
- **Colors**: Changed from blue space theme to red/orange kebab theme
  - Primary: #D32F2F (Red)
  - Secondary: #FF6F00 (Orange)
  - Accent: #FFA726 (Light Orange)
- **Background**: Warm red-to-orange gradient
- **Messaging**: Updated from space/kids theme to food/restaurant theme

### 2. Database Schema (schema_kebab.sql)
- **Products table**: Stores menu items (kebabs, pizzas, burgers, etc.)
- **Product stamps table**: Tracks stamps per user per product
- **Visits table**: Records customer visits
- **Visit items table**: Multiple products per visit support
- **Logic**: Buy 10, get 11th free (instead of points-based)

### 3. Backend Changes
- **New Models**:
  - `Product.js`: Manage menu products
  - `ProductStamp.js`: Track product-specific stamps
  - `Visit.js`: Handle multi-product visits
  
- **New Routes**:
  - `/api/products`: Product management
  - `/api/visits`: Visit tracking with multiple products
  - `/api/admin/user-by-qr/:qrCode`: Get user by QR
  - `/api/admin/user-stamps/:userId`: Get user's stamps

### 4. Frontend Changes
- **New Page**: `AdminScanMultiple.vue`
  - Scan QR once per visit
  - Add multiple products with quantities
  - Mark products as free if stamps available
  - Category-based product selection
  - Real-time stamp tracking
  
- **Updated Pages**:
  - `Home.vue`: Kebab branding and messaging
  - `App.vue`: Red/orange color scheme
  
- **Router**: Added `/admin/scan-multiple` route

### 5. Configuration Files
- `package.json`: Updated project names
- `vercel_kebab.json`: Vercel deployment config
- `DEPLOYMENT_KEBAB.md`: Deployment instructions

## Deployment Strategy

### Railway (Backend + Database)
- Create new MySQL service: `kebab-mysql`
- Create new backend service: `kebab-backend`
- Both services in same Railway account as Bubko
- Separate from Bubko services

### Vercel (Frontend)
- Domain: `kebabnakyjevskom.vercel.app`
- Deploy from `kebabnakyjevskom` branch
- Environment variable points to Railway backend

## How It Works

1. **Customer Registration**: User registers and gets unique QR code
2. **Visit**: Customer shows QR code at checkout
3. **Admin Scans**: Admin scans QR once
4. **Add Products**: Admin adds all purchased products with quantities
5. **Stamps**: Each product gets stamps (10 stamps = 1 free)
6. **Free Products**: When available, admin can mark product as free
7. **Complete**: Visit is recorded with all items

## Key Features

- ✅ Product-based loyalty (not visit-based)
- ✅ Multiple products per visit
- ✅ Individual product tracking
- ✅ 11th product free logic
- ✅ Category-based product selection
- ✅ Real-time stamp display
- ✅ Free product validation
- ✅ Visit notes support

## Testing Checklist

- [ ] User registration works
- [ ] QR code generation works
- [ ] Admin can scan QR code
- [ ] Products load correctly
- [ ] Can add multiple products
- [ ] Quantity controls work
- [ ] Free product checkbox works
- [ ] Stamps increment correctly
- [ ] 11th product becomes free
- [ ] Visit history shows correctly

## Default Credentials

**Admin**:
- Username: `admin`
- Password: `admin123`
- Email: `admin@kebab-bb.sk`

**Change immediately after deployment!**

## Next Steps

1. Deploy MySQL database on Railway
2. Run schema_kebab.sql to initialize
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Test complete flow
6. Add real products from menu
7. Change admin password
8. Train staff on new system
