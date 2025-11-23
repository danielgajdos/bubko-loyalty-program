# Kebab na Kyjevskom - Quick Start Guide

## What's Different?

This is a **product-based loyalty system** where customers earn stamps for each product type:
- Buy 10 Kebabs → 11th Kebab free
- Buy 10 Pizzas → 11th Pizza free
- Each product tracked separately!

## Local Development

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Admin Workflow

### Scanning Customers (New Multi-Product Flow)

1. **Navigate to**: Admin Dashboard → "Scan & Add Products"
2. **Scan QR Code**: Customer shows their QR code
3. **Customer Info Appears**: Verify it's the right customer
4. **Select Products**: 
   - Click on products to add them
   - Use +/- to adjust quantities
   - Check "Free" if customer has stamps available
5. **Add Notes** (optional): Any special info about the visit
6. **Complete Visit**: Submit to record everything

### Example Visit
Customer orders:
- 2x Kebab v placke
- 1x Pizza Margherita  
- 1x Coca Cola

Admin:
1. Scans QR once
2. Clicks "Kebab v placke" twice (or click once and use +)
3. Clicks "Pizza Margherita"
4. Clicks "Coca Cola"
5. Sees customer has 9 Kebab stamps → 10th will be free next time!
6. Clicks "Complete Visit"

## Product Management

### Adding New Products
```bash
POST /api/products
{
  "name": "Kebab XXL",
  "category": "kebab",
  "price": 6.50
}
```

### Categories
- `kebab` - All kebab variations
- `pizza` - Pizzas
- `burger` - Burgers
- `wrap` - Wraps
- `salad` - Salads
- `drink` - Beverages
- `side` - Sides (fries, onion rings, etc.)
- `other` - Other items

## Customer Experience

1. **Register**: Get unique QR code
2. **Show QR**: At checkout
3. **Earn Stamps**: Automatically for each product
4. **Track Progress**: See stamps in profile
5. **Get Free**: When you have 10 stamps for a product

## Database Schema

### Key Tables
- `products` - Menu items
- `product_stamps` - User stamps per product
- `visits` - Customer visits
- `visit_items` - Products in each visit

### Stamp Logic
- 1 product purchased = 1 stamp
- 10 stamps = 1 free product earned
- Free product uses 10 stamps
- Each product type tracked separately

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/category/:category` - Products by category
- `GET /api/products/stamps` - User's stamps (auth required)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Visits
- `POST /api/visits` - Record visit with products (admin)
- `GET /api/visits/my-visits` - User's visit history (auth)
- `GET /api/visits/:id` - Visit details
- `GET /api/visits/stats/summary` - Statistics (admin)

### Admin
- `GET /api/admin/user-by-qr/:qrCode` - Find user by QR
- `GET /api/admin/user-stamps/:userId` - User's stamps

## Deployment

See `DEPLOYMENT_KEBAB.md` for full deployment instructions.

### Quick Deploy Checklist
- [ ] Railway MySQL database created
- [ ] Database schema initialized
- [ ] Railway backend deployed
- [ ] Vercel frontend deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Admin password changed
- [ ] Test products added
- [ ] Staff trained

## Support

For issues or questions:
1. Check `TROUBLESHOOTING.md`
2. Review `KEBAB_CHANGES.md` for what changed
3. Check Railway/Vercel logs

## Website
http://www.kebab-bb.sk/
