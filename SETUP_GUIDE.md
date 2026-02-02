# NFSU University Portal - Complete Setup Guide

## ✅ What Has Been Completed

### 1. Project Structure
- ✅ Next.js 15 with TypeScript and App Router
- ✅ PostgreSQL database with Prisma ORM
- ✅ Brutalism + Glassmorphism design system
- ✅ Dark/Light mode toggle
- ✅ Responsive mobile design

### 2. Backend APIs
- ✅ `/api/auth/send-otp` - Send OTP to university email
- ✅ `/api/auth/verify-otp` - Verify OTP and login
- ✅ `/api/auth/me` - Get current user
- ✅ `/api/auth/logout` - Logout user
- ✅ `/api/posts` - Create and view posts (images, videos, blogs)
- ✅ `/api/notices` - View and create notices (admin only)
- ✅ `/api/events` - View and create events (admin only)
- ✅ `/api/notes` - Upload and view notes (batch-wise)

### 3. Frontend Pages
- ✅ **Home** (`/`) - Public landing page with features
- ✅ **Feed** (`/feed`) - Social feed with post creation
- ✅ **Events** (`/events`) - Public events listing
- ✅ **Login** (`/login`) - OTP-based authentication
- ✅ **Notices** (`/notices`) - Protected, student access
- ✅ **Notes** (`/notes`) - Protected, batch-wise notes
- ✅ **Admin** (`/admin`) - Admin dashboard for notices/events

### 4. Features Implemented
- ✅ OTP-based email authentication (@as.nfsu.edu.in only)
- ✅ Role-based access control (Student/Admin)
- ✅ File upload for posts and notes
- ✅ Background images from `/public/backgrounds`
- ✅ Glassmorphic navigation bar
- ✅ Brutalist card designs with bold borders
- ✅ Theme toggle (Dark/Light mode)

## 🚀 Next Steps to Make It Fully Functional

### Step 1: Setup PostgreSQL Database

You have two options:

#### Option A: Use Prisma's Local PostgreSQL (Easiest)
```bash
npx prisma dev
```
This will start a local PostgreSQL instance automatically.

#### Option B: Use Your Own PostgreSQL
1. Install PostgreSQL locally or use a hosted service (e.g., Supabase, Neon, Railway)
2. Update `.env` with your connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nfsu_portal"
```

### Step 2: Push Database Schema
```bash
npx prisma db push
```

This creates all the tables (User, Post, Notice, Event, Note) in your database.

### Step 3: Configure Email Service (SMTP)

Update `.env` with your email credentials:

**For Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Update `.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
SMTP_FROM="NFSU Portal <noreply@nfsu.edu.in>"
```

**For SendGrid (Alternative):**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="NFSU Portal <noreply@nfsu.edu.in>"
```

### Step 4: Create an Admin User

1. Start the server: `npm run dev`
2. Visit http://localhost:3000/login
3. Login with any `@as.nfsu.edu.in` email (you'll receive an OTP)
4. Open Prisma Studio: `npx prisma studio`
5. Go to the `User` table
6. Find your user and change `role` from `STUDENT` to `ADMIN`
7. Refresh the portal - you'll now see the "Admin" link

### Step 5: Test the Application

1. **Public Access** (no login):
   - Visit `/` (Home)
   - Visit `/feed` (view only)
   - Visit `/events` (view only)

2. **Student Access** (login required):
   - Login at `/login`
   - Create posts at `/feed`
   - View notices at `/notices`
   - Upload/download notes at `/notes`

3. **Admin Access**:
   - Login as admin
   - Visit `/admin`
   - Post notices and events

## 📁 Project Structure

```
/Users/sudiptaranjanbaruah/Public/kriti_demo/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── admin/            # Admin dashboard
│   │   ├── feed/             # Social feed
│   │   ├── events/           # Events page
│   │   ├── login/            # Login page
│   │   ├── notices/          # Notices page
│   │   ├── notes/            # Notes page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   └── Navbar.tsx        # Navigation component
│   ├── lib/
│   │   ├── auth.ts           # Auth utilities
│   │   ├── email.ts          # Email service
│   │   └── prisma.ts         # Prisma client
│   └── generated/            # Prisma generated files
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   ├── backgrounds/          # Background images (5 images)
│   └── uploads/              # User uploaded files
├── .env                      # Environment variables
├── README.md                 # Documentation
└── package.json              # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: `#2d5016` (Forest Green)
- **Admin**: `#fffde4` (Cream Yellow)
- **Accent**: `#d4a574` (Tan)

### Typography
- **Headings**: Space Mono (monospace)
- **Body**: Inter (sans-serif)

### Design Principles
- **Brutalism**: 2-4px black borders, high contrast, visible grids
- **Glassmorphism**: Backdrop blur, semi-transparent backgrounds

## 🔐 Access Control Matrix

| Page | Public | Student | Admin |
|------|--------|---------|-------|
| Home | ✅ | ✅ | ✅ |
| Feed (View) | ✅ | ✅ | ✅ |
| Feed (Post) | ❌ | ✅ | ✅ |
| Events | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Notices | ❌ | ✅ | ✅ |
| Notes | ❌ | ✅ | ✅ |
| Admin | ❌ | ❌ | ✅ |

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Ensure PostgreSQL is running and `DATABASE_URL` in `.env` is correct.

### Email Not Sending
```
Error: Failed to send OTP
```
**Solution**: 
- Check SMTP credentials in `.env`
- For Gmail, use App Password, not regular password
- Check spam folder

### Build Errors
```
Error: Module not found
```
**Solution**:
```bash
rm -rf .next node_modules
npm install
npx prisma generate
npm run build
```

## 📦 Dependencies

### Core
- `next` - React framework
- `react`, `react-dom` - UI library
- `typescript` - Type safety

### Database
- `prisma` - ORM
- `@prisma/client` - Prisma client
- `@prisma/adapter-pg` - PostgreSQL adapter for Prisma 7
- `pg` - PostgreSQL driver

### Authentication & Email
- `jsonwebtoken` - JWT tokens
- `cookie` - Cookie parsing
- `nodemailer` - Email sending

### File Upload
- `busboy` - File upload handling

## 🚀 Deployment

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret-at-least-32-characters"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="NFSU Portal <noreply@nfsu.edu.in>"
```

### Recommended Platforms
- **Vercel** (easiest for Next.js) - https://vercel.com
- **Railway** (includes PostgreSQL) - https://railway.app
- **Render** - https://render.com

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📝 Notes

- The server is currently running at http://localhost:3000
- All background images are loaded from `/public/backgrounds/`
- Uploaded files are stored in `/public/uploads/`
- Database schema is defined in `/prisma/schema.prisma`

## 🎯 Implementation Checklist

- [x] Project initialization
- [x] Database schema design
- [x] Backend API routes
- [x] Authentication system
- [x] Frontend pages
- [x] Design system (Brutalism + Glassmorphism)
- [x] Dark/Light mode
- [x] File upload system
- [x] Role-based access control
- [ ] Configure PostgreSQL database (USER ACTION REQUIRED)
- [ ] Configure SMTP email service (USER ACTION REQUIRED)
- [ ] Create admin user (USER ACTION REQUIRED)
- [ ] Test all features
- [ ] Deploy to production

## 💡 Tips

1. **Testing OTP without email**: During development, check the server console for the OTP code
2. **Quick admin access**: Use Prisma Studio (`npx prisma studio`) to manage users
3. **Database reset**: `npx prisma db push --force-reset` (⚠️ deletes all data)
4. **View logs**: Check terminal for API errors and OTP codes

---

**Status**: ✅ Build successful, server running, ready for database and email configuration!
