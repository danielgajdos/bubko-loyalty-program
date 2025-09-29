# 🎈 Bubko Kids Place - Loyalty Program

A complete loyalty program solution for kids' places with QR code-based visit tracking. After 5 visits, the 6th visit is free!

## Features

### For Customers
- 🎯 **User Registration & Login** - Simple registration with email
- 📱 **Personal QR Code** - Each user gets a unique QR code
- 📊 **Visit Tracking** - Track total visits and progress to free visits
- 🎁 **Free Visits** - Every 6th visit is free (after 5 paid visits)
- 📈 **Progress Visualization** - See progress towards next free visit
- 📱 **Mobile-Friendly** - Responsive design for all devices

### For Business Owners
- 🔐 **Admin Portal** - Secure admin login
- 📊 **Dashboard** - View statistics and recent visits
- 📱 **QR Scanner** - Scan customer QR codes to record visits
- 💰 **Free Visit Management** - Handle free visit redemptions
- 📈 **Analytics** - Track daily and monthly visit statistics

## Technology Stack

- **Frontend**: Vue.js 3 + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT tokens
- **QR Codes**: qrcode library
- **Styling**: Custom CSS with colorful, kid-friendly design

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### 1. Database Setup

```sql
-- Create database and run the schema
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Customer Portal**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin
- **API**: http://localhost:3001

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bubko_loyalty
JWT_SECRET=your_secret_key
PORT=3001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### User
- `GET /api/users/profile` - Get user profile
- `GET /api/users/visits` - Get user visit history

### Admin
- `POST /api/admin/scan` - Scan QR code
- `POST /api/admin/scan/free` - Confirm free visit usage
- `GET /api/admin/dashboard` - Get dashboard statistics

## How It Works

1. **Customer Registration**: Users register with email and get a unique QR code
2. **Visit Recording**: Staff scans QR codes to record visits
3. **Loyalty Tracking**: System automatically tracks visits (5 paid = 1 free)
4. **Free Visit Redemption**: When customers have free visits, staff can choose to use them
5. **Progress Tracking**: Users can see their progress in their profile

## Design Inspiration

The design is inspired by colorful, playful kids' place aesthetics with:
- Bright gradient backgrounds
- Rounded corners and soft shadows
- Kid-friendly icons and emojis
- Responsive mobile-first design
- Smooth animations and transitions

## Deployment

### Production Setup
1. Set up MySQL database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Deploy backend to your server
5. Serve frontend build files

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- CORS protection

## Future Enhancements

- 📷 Camera-based QR scanning
- 📧 Email notifications
- 🎯 Advanced analytics
- 🎁 Custom reward tiers
- 📱 Mobile app
- 🔔 Push notifications

## Support

For support or questions, please contact the development team.

---

Made with ❤️ for Bubko Kids Place