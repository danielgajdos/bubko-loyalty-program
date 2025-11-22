# Deployment Checklist

## ✅ Completed Steps

### Code Changes
- [x] Removed flying astronaut animation from Home page
- [x] Updated text to mention "1 hodina vstupu" (1 hour entry)
- [x] Created separate product type tracking (1 child vs 2 kids)
- [x] Updated Scanner with product type selector
- [x] Updated Profile with separate stats per product
- [x] Updated backend API to handle product types
- [x] Created database migration script
- [x] Updated all documentation

### Git & Deployment
- [x] Committed all changes to GitHub
- [x] Pushed to main branch
- [x] Backend auto-deploying on Railway
- [x] Frontend auto-deploying on Vercel

## ⏳ Pending Steps

### Database Migration
- [ ] **IMPORTANT**: Run database migration on Railway MySQL
  ```bash
  # Connect to Railway MySQL and run:
  mysql -h [railway-host] -u [username] -p [database] < database/schema_v2.sql
  ```
  
  Or execute in Railway MySQL console:
  - Add new columns to users table
  - Add new columns to visits table
  - Migrate existing data

### Verification
- [ ] Verify backend deployment is live
  - Check: https://perceptive-radiance-production.up.railway.app/api/health
  
- [ ] Verify frontend deployment is live
  - Check Vercel dashboard for latest deployment
  
- [ ] Test QR code scanning with both product types
  - Test "1 child" entry
  - Test "2 kids" entry
  
- [ ] Verify user profile shows separate stats
  - Check one_child stats
  - Check two_kids stats
  
- [ ] Test free visit redemption
  - Test with one_child product
  - Test with two_kids product

### Staff Training
- [ ] Train staff on new product selector in Scanner
- [ ] Explain separate loyalty tracking per product
- [ ] Clarify 1-hour free entry policy
- [ ] Update any internal documentation

### Customer Communication
- [ ] Update website/social media about 1-hour free entry
- [ ] Update any printed materials if needed
- [ ] Inform regular customers about the change

## 🔍 Testing Checklist

### Basic Functionality
- [ ] User registration works
- [ ] User login works
- [ ] QR code generation works
- [ ] Barcode generation works

### Scanner Functionality
- [ ] Product type selector appears
- [ ] Can select "1 child" product
- [ ] Can select "2 kids" product
- [ ] QR scanning works for both types
- [ ] Manual QR input works
- [ ] Free visit prompt shows correct product
- [ ] Visit recording works correctly

### Profile Functionality
- [ ] Profile loads correctly
- [ ] Shows separate stats for "1 child"
- [ ] Shows separate stats for "2 kids"
- [ ] Progress bars work for both types
- [ ] Visit history shows product types
- [ ] QR/Barcode tabs work
- [ ] Copy to clipboard works

### Admin Functionality
- [ ] Admin login works
- [ ] Dashboard shows statistics
- [ ] User management works
- [ ] Can edit user stats
- [ ] Can assign QR codes
- [ ] Export to CSV works

## 🚨 Rollback Plan

If issues occur:

1. **Revert Backend**
   ```bash
   # In Railway dashboard, rollback to previous deployment
   ```

2. **Revert Frontend**
   ```bash
   # In Vercel dashboard, rollback to previous deployment
   ```

3. **Database**
   - New columns are additive (no data loss)
   - Legacy fields still work
   - Can continue using old system

## 📞 Support Contacts

- **Technical Issues**: Check Railway/Vercel logs
- **Database Issues**: Access Railway MySQL console
- **Frontend Issues**: Check Vercel deployment logs
- **Backend Issues**: Check Railway deployment logs

## 📊 Success Metrics

After deployment, monitor:
- [ ] No increase in error rates
- [ ] Users can successfully scan QR codes
- [ ] Free visits are correctly tracked
- [ ] Both product types work as expected
- [ ] No customer complaints about tracking

## 🎉 Post-Deployment

Once everything is verified:
- [ ] Mark deployment as successful
- [ ] Archive old documentation
- [ ] Update team on new features
- [ ] Monitor for first few days
- [ ] Collect feedback from staff

---

**Deployment Date**: November 22, 2025
**Version**: 2.0.0
**Status**: In Progress

**Next Action**: Run database migration script on Railway MySQL