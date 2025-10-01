# Admin Features Documentation

## Overview
The Bubko Loyalty System now includes comprehensive admin features for managing users, tracking visits, and analyzing business metrics.

## Admin Features

### 1. Admin Dashboard
- **Location**: `/admin/dashboard`
- **Features**:
  - Real-time statistics (total users, today's visits, monthly visits)
  - Recent visits history
  - Analytics with trends and charts
  - Peak hours analysis
  - Visit type breakdown (paid vs free)

### 2. User Management
- **Location**: `/admin/users`
- **Features**:
  - View all registered users with detailed information
  - Search and filter users
  - Quick registration for offline users
  - Edit user visit counts and statistics
  - Assign new QR codes to existing users
  - Bulk delete users
  - Export user data to CSV
  - QR code scanning integration

### 3. QR Code Scanner
- **Location**: `/admin/scanner`
- **Features**:
  - Camera-based QR code scanning
  - Manual QR code input
  - Automatic visit recording
  - Free visit management
  - Real-time user statistics display

### 4. Profile Enhancement
- **Features**:
  - Dual code display (QR code and barcode)
  - Tabbed interface for code types
  - Copy-to-clipboard functionality
  - Enhanced visual design

## Technical Implementation

### Frontend Components
1. **UserManagement.vue** - Complete user management interface
2. **QRScanner.vue** - Reusable QR scanning component
3. **AdminAnalytics.vue** - Dashboard analytics and charts
4. **Profile.vue** - Enhanced with barcode support

### Backend Endpoints
- `GET /admin/users` - Get all users with statistics
- `PUT /admin/users/:id` - Update user visit counts
- `PUT /admin/users/:id/qr-code` - Assign new QR code
- `POST /admin/quick-register` - Quick user registration
- `DELETE /admin/users/:id` - Delete user account
- `GET /admin/dashboard` - Dashboard statistics
- `POST /admin/scan` - QR code scanning
- `POST /admin/scan/free` - Free visit confirmation

### New Dependencies
- **jsbarcode** - Barcode generation library
- **html5-qrcode** - QR code scanning functionality

## Admin Access
1. Navigate to `/admin`
2. Login with admin credentials
3. Access dashboard and user management features

## Key Features

### Quick Registration
- Register users without requiring them to create accounts
- Assign QR codes immediately
- Perfect for busy periods

### Bulk Operations
- Select multiple users for bulk actions
- Export user data for external analysis
- Bulk delete functionality

### Real-time Analytics
- Live visit tracking
- Trend analysis
- Peak hours identification
- Visit type breakdown

### QR Code Management
- Scan QR codes with camera or manual input
- Assign new codes to existing users
- Handle both QR codes and barcodes

## Security Features
- Admin authentication required for all admin routes
- Separate admin token system
- Input validation and sanitization
- Protected API endpoints

## Mobile Responsive
All admin features are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones

## Export Functionality
- CSV export of all user data
- Includes visit statistics and registration dates
- Automatic filename with current date

## Future Enhancements
- Advanced analytics with charts
- Email notifications for admin actions
- Backup and restore functionality
- Advanced reporting features
- Integration with external systems