# Next Steps for Kebab na Kyjevskom Deployment

## ✅ Completed
- [x] Created new branch `kebabnakyjevskom`
- [x] Updated branding to red/orange kebab theme
- [x] Implemented product-based loyalty system
- [x] Created multi-product visit support
- [x] Built admin interface for easy product entry
- [x] Updated database schema
- [x] Created deployment documentation
- [x] Pushed to GitHub

## 🚀 Ready to Deploy

### Step 1: Railway MySQL Database (5 minutes)
1. Go to https://railway.app
2. Click "New Project" → "Provision MySQL"
3. Name it: `kebab-mysql`
4. Wait for deployment
5. Copy connection details from Variables tab

### Step 2: Initialize Database (2 minutes)
Option A - Railway Dashboard:
1. Click on MySQL service
2. Go to "Data" tab
3. Click "Query"
4. Copy/paste contents of `database/schema_kebab.sql`
5. Execute

Option B - Local MySQL Client:
```bash
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] < database/schema_kebab.sql
```

### Step 3: Railway Backend (10 minutes)
1. In Railway, click "New" → "GitHub Repo"
2. Select your repository
3. Select branch: `kebabnakyjevskom`
4. Click "Add variables" and add:
   ```
   DB_HOST=<from MySQL service>
   DB_PORT=<from MySQL service>
   DB_USER=<from MySQL service>
   DB_PASSWORD=<from MySQL service>
   DB_NAME=<from MySQL service>
   JWT_SECRET=<generate random 32+ char string>
   PORT=3001
   ```
5. Settings → Set root directory: `backend`
6. Deploy!
7. Copy the public URL (e.g., `https://kebab-backend-xxx.up.railway.app`)

### Step 4: Vercel Frontend (10 minutes)
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select branch: `kebabnakyjevskom`
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=<your Railway backend URL>
   ```
7. Deploy!
8. Go to Settings → Domains
9. Add custom domain: `kebabnakyjevskom.vercel.app`

### Step 5: Update Backend CORS (2 minutes)
1. Edit `backend/server.js` in GitHub or locally
2. Update CORS origin to include:
   ```javascript
   'https://kebabnakyjevskom.vercel.app'
   ```
3. Commit and push
4. Railway will auto-redeploy

### Step 6: Test Everything (10 minutes)
1. Visit `https://kebabnakyjevskom.vercel.app`
2. Register a test user
3. Login as admin:
   - Username: `admin`
   - Password: `admin123`
4. Go to "Scan & Add Products"
5. Test scanning with test user's QR code
6. Add some products
7. Verify stamps are recorded
8. Check user profile shows correct stamps

### Step 7: Add Real Products (15 minutes)
From http://www.kebab-bb.sk/, add your actual menu items:

Using Postman or curl:
```bash
# Get admin token first
curl -X POST https://your-backend.up.railway.app/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Add products
curl -X POST https://your-backend.up.railway.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Kebab v placke",
    "category": "kebab",
    "price": 4.50
  }'
```

Or use the admin interface (you may need to build a product management page).

### Step 8: Security (5 minutes)
1. Change admin password immediately!
2. Create staff accounts if needed
3. Review and update JWT_SECRET
4. Enable HTTPS only (should be default on Vercel/Railway)

### Step 9: Train Staff (30 minutes)
1. Show them the admin interface
2. Practice scanning QR codes
3. Practice adding multiple products
4. Show them how to mark products as free
5. Explain the stamp system
6. Give them the admin credentials

### Step 10: Go Live! 🎉
1. Announce to customers
2. Print QR codes for existing customers
3. Encourage new registrations
4. Monitor first few days closely

## 📋 Deployment Checklist

- [ ] Railway MySQL created and initialized
- [ ] Railway backend deployed with correct env vars
- [ ] Vercel frontend deployed with correct API URL
- [ ] Backend CORS updated with Vercel domain
- [ ] Test user registration works
- [ ] Test QR code scanning works
- [ ] Test multi-product entry works
- [ ] Test stamp accumulation works
- [ ] Test free product redemption works
- [ ] Real menu products added
- [ ] Admin password changed
- [ ] Staff trained
- [ ] Customers notified

## 🆘 Troubleshooting

### Can't connect to database
- Check Railway MySQL is running
- Verify environment variables match exactly
- Check Railway backend logs

### CORS errors
- Verify Vercel domain in backend CORS list
- Check VITE_API_URL in Vercel env vars
- Redeploy backend after CORS changes

### QR scanning not working
- Ensure HTTPS (required for camera)
- Try manual QR entry first
- Check user exists in database
- Verify QR code format

### Products not showing
- Check database has products
- Verify API endpoint works: `/api/products`
- Check browser console for errors

## 📞 Support Resources

- **Deployment Guide**: `DEPLOYMENT_KEBAB.md`
- **Changes Summary**: `KEBAB_CHANGES.md`
- **Quick Start**: `QUICK_START_KEBAB.md`
- **Database Schema**: `database/schema_kebab.sql`
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

## 🎯 Success Metrics

After 1 week, check:
- Number of registered users
- Number of visits recorded
- Most popular products
- Free products redeemed
- Staff feedback
- Customer feedback

## 🔮 Future Enhancements

Consider adding:
- Product management UI for admin
- Analytics dashboard
- Email notifications
- SMS notifications
- Promotional campaigns
- Special offers
- Customer feedback system
- Loyalty tiers

---

**Ready to deploy? Start with Step 1!** 🚀
