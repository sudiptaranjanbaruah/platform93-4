# NFSU University Portal

A comprehensive university portal built with Next.js, PostgreSQL, and featuring Brutalism + Glassmorphism design aesthetics.

## Features

- 🔐 **OTP-based Authentication** - Secure login using university email (@as.nfsu.edu.in)
- 📱 **Social Feed** - Students can post images, videos, and blogs
- 📢 **Notices & Events** - Admin-only posting for official announcements
- 📚 **Notes Repository** - Batch-wise organized study materials
- 🎨 **Modern Design** - Brutalism meets Glassmorphism
- 🌓 **Dark/Light Mode** - Theme toggle for user preference
- 👥 **Role-based Access** - Student and Admin roles with different permissions

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Email**: Nodemailer for OTP delivery

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- SMTP email service (Gmail, SendGrid, etc.)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Edit the `.env` file with your actual credentials:

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/nfsu_portal"

# JWT Secret - Generate a strong random string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# SMTP Configuration - For sending OTP emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="NFSU Portal <noreply@nfsu.edu.in>"
```

**For Gmail SMTP:**
1. Enable 2-factor authentication
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the app password in `SMTP_PASS`

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Creating an Admin User

By default, all users are created as STUDENTS. To create an admin:

1. Login with any @as.nfsu.edu.in email
2. Open Prisma Studio: `npx prisma studio`
3. Navigate to the `User` table
4. Find your user and change `role` from `STUDENT` to `ADMIN`
5. Refresh the portal - you'll now see the Admin link in the navbar

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── posts/        # Social feed endpoints
│   │   ├── notices/      # Notices endpoints
│   │   ├── events/       # Events endpoints
│   │   └── notes/        # Notes endpoints
│   ├── admin/            # Admin dashboard page
│   ├── feed/             # Social feed page
│   ├── events/           # Events page
│   ├── notices/          # Notices page
│   ├── notes/            # Notes page
│   ├── login/            # Login page
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   └── Navbar.tsx        # Navigation bar
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── email.ts          # Email service
│   └── prisma.ts         # Prisma client
└── generated/            # Prisma generated files

prisma/
└── schema.prisma         # Database schema

public/
├── backgrounds/          # Background images
└── uploads/              # User uploaded files
```

## Pages & Access Control

| Page | Public Access | Student Access | Admin Access |
|------|--------------|----------------|--------------|
| Home | ✅ | ✅ | ✅ |
| Feed | ✅ (view only) | ✅ (post & view) | ✅ (post & view) |
| Events | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Notices | ❌ | ✅ | ✅ |
| Notes | ❌ | ✅ | ✅ |
| Admin | ❌ | ❌ | ✅ |

## Design System

### Colors
- **Primary**: `#2d5016` (Forest Green)
- **Admin**: `#fffde4` (Cream)
- **Accent**: `#d4a574` (Tan)

### Typography
- **Headings**: Space Mono (monospace)
- **Body**: Inter (sans-serif)

### Design Principles
- **Brutalism**: Bold borders (2-4px), high contrast, visible grids
- **Glassmorphism**: Backdrop blur, semi-transparent backgrounds
- **Responsive**: Mobile-first approach

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Try: `npx prisma db push --force-reset` (⚠️ This will delete all data)

### Email Not Sending
- Check SMTP credentials in `.env`
- For Gmail, ensure you're using an App Password, not your regular password
- Check spam folder

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npx prisma generate`

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Strong `JWT_SECRET`
- Production `DATABASE_URL`
- Valid SMTP credentials

### Build
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (easiest for Next.js)
- **Railway** (includes PostgreSQL)
- **Render**
- **DigitalOcean App Platform**

## License

MIT

## Support

For issues or questions, contact the development team.
