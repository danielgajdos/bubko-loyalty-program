# Migration Guide - Product Type Separation

## Overview
This update separates visit tracking for two different product types:
- **One Child Entry** (1 dieťa)
- **Two Kids Entry** (2 deti - špeciálna cena)

Each product type now has its own loyalty tracking, meaning customers earn free visits separately for each product type.

## Database Changes

### New Columns Added to `users` Table:
- `barcode` - VARCHAR(255) UNIQUE
- `one_child_visits` - INT DEFAULT 0
- `one_child_free_earned` - INT DEFAULT 0
- `one_child_free_used` - INT DEFAULT 0
- `two_kids_visits` - INT DEFAULT 0
- `two_kids_free_earned` - INT DEFAULT 0
- `two_kids_free_used` - INT DEFAULT 0

### New Columns Added to `visits` Table:
- `product_type` - ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child'
- `notes` - TEXT

## Migration Steps

### 1. Run Database Migration

Execute the migration script on your Railway MySQL database:

```bash
# Connect to your Railway MySQL database
mysql -h [your-railway-host] -u [username] -p [database_name] < database/schema_v2.sql
```

Or run the SQL commands directly in Railway's MySQL console.

### 2. Migrate Existing Data

The migration script automatically:
- Copies `total_visits` to `one_child_visits`
- Copies `free_visits_earned` to `one_child_free_earned`
- Copies `free_visits_used` to `one_child_free_used`
- Sets `barcode` = `qr_code` for existing users
- Sets all existing visits to `product_type = 'one_child'`

### 3. Deploy Backend Changes

The backend has been updated to:
- Accept `productType` parameter in scan endpoints
- Track visits separately for each product type
- Return product-specific statistics

### 4. Deploy Frontend Changes

The frontend now includes:
- Product type selector in Scanner
- Separate stats for each product type in Profile
- Product type display in visit history
- Updated text about free visits (1 hour entry)

## Key Changes

### Free Visit Policy
- **Before**: Every 6th visit was free (unlimited time)
- **After**: Every 6th visit is free with **1 hour entry time**
- Free visits are tracked separately for each product type

### Product Types
1. **One Child Entry** (`one_child`)
   - Standard single child entry
   - Separate loyalty tracking
   - Every 6th visit = 1 hour free

2. **Two Kids Entry** (`two_kids`)
   - Special price for two children
   - Separate loyalty tracking
   - Every 6th visit = 1 hour free

### Admin Scanner Updates
- Admins must select product type before scanning
- Default is "One Child Entry"
- Free visit prompts show product type
- Visit confirmation includes product information

### User Profile Updates
- Shows separate progress for each product type
- Displays available free visits per product
- Visit history includes product type
- Clear indication of 1-hour free entry

## API Changes

### POST /api/admin/scan
**New Parameter:**
```json
{
  "qrCode": "string",
  "productType": "one_child" | "two_kids"  // NEW
}
```

### POST /api/admin/scan/free
**New Parameter:**
```json
{
  "qrCode": "string",
  "useFreeVisit": boolean,
  "productType": "one_child" | "two_kids"  // NEW
}
```

### GET /api/users/profile
**New Response Fields:**
```json
{
  "oneChildVisits": number,
  "oneChildFreeEarned": number,
  "oneChildFreeUsed": number,
  "oneChildFreeAvailable": number,
  "twoKidsVisits": number,
  "twoKidsFreeEarned": number,
  "twoKidsFreeUsed": number,
  "twoKidsFreeAvailable": number
}
```

## Backward Compatibility

The system maintains backward compatibility:
- Legacy fields (`total_visits`, `free_visits_earned`, `free_visits_used`) are preserved
- Existing data is automatically migrated to `one_child` product type
- Old API responses still include legacy fields

## Testing Checklist

- [ ] Database migration completed successfully
- [ ] Existing users can still log in
- [ ] QR codes still work
- [ ] Scanner shows product type selector
- [ ] Visits are recorded with correct product type
- [ ] Free visits work for both product types
- [ ] Profile shows separate stats for each product
- [ ] Visit history displays product types
- [ ] Admin dashboard shows updated statistics

## Rollback Plan

If issues occur, you can rollback by:
1. Reverting to previous backend deployment
2. Reverting to previous frontend deployment
3. Database changes are additive (no data loss)
4. Legacy fields remain functional

## Support

For issues or questions:
- Check Railway logs for backend errors
- Check Vercel logs for frontend errors
- Verify database migration completed
- Test with a new user account first

---

**Migration Date**: October 1, 2025
**Version**: 2.0.0