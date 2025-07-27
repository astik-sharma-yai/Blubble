# Blubble - Personal Blogging Platform

A simple, robust, and elegant personal blogging website built with React TypeScript frontend, Node.js backend, and Firebase database.

## Features

- **📝 Blog Management**: Create, edit, and publish blogs with Markdown support
- **💬 Comments**: Readers can leave comments on blog posts
- **❤️ Likes**: Like blogs and comments
- **🏷️ Tags**: Organize blogs with tags for easy discovery
- **🔍 Search & Filter**: Search blogs and filter by tags
- **📱 Responsive**: Mobile-friendly design
- **⚡ Fast**: Optimized for performance
- **🔒 Secure**: Built with security best practices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **React Markdown** for content rendering
- **Lucide React** for icons
- **Date-fns** for date formatting

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **Firebase Admin SDK** for database operations
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

### Database
- **Firebase Firestore** for data storage

## Project Structure

```
Blubble/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── ...
├── backend/                 # Node.js TypeScript backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for database)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blubble
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 4. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

#### Development Mode

```bash
# From the root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) in development mode.

#### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
cd backend && npm start
```

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all published blogs (with pagination and filtering)
- `GET /api/blogs/:id` - Get a specific blog
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog
- `POST /api/blogs/:id/like` - Like a blog

### Comments
- `GET /api/comments/:blogId` - Get comments for a blog
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment
- `POST /api/comments/:id/like` - Like a comment

## Deployment

### Free Deployment Options

#### Frontend (Vercel/Netlify)
1. **Vercel** (Recommended):
   - Connect your GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/dist`
   - Add environment variables

2. **Netlify**:
   - Connect your GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/dist`

#### Backend (Railway/Render)
1. **Railway**:
   - Connect your GitHub repository
   - Set root directory: `backend`
   - Add environment variables
   - Deploy

2. **Render**:
   - Connect your GitHub repository
   - Set root directory: `backend`
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Add environment variables

### Environment Variables for Production

Make sure to update the environment variables for production:

```env
# Backend
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
FIREBASE_SERVICE_ACCOUNT_KEY=your-service-account-json
FIREBASE_DATABASE_URL=your-firebase-database-url

# Frontend
VITE_API_URL=https://your-backend-domain.com/api
```

## Customization

### Styling
- Modify CSS files in `frontend/src/` to customize the appearance
- The design uses a clean, modern aesthetic with a blue color scheme
- All components are responsive and mobile-friendly

### Content
- Update the About page content in `frontend/src/pages/About.tsx`
- Modify the navigation in `frontend/src/components/Navbar.tsx`
- Customize the hero section in `frontend/src/pages/Home.tsx`

### Features
- Add authentication by extending the Firebase Auth integration
- Implement image uploads using Firebase Storage
- Add analytics tracking
- Implement email notifications for comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the Firebase console for database issues
2. Verify environment variables are set correctly
3. Check browser console for frontend errors
4. Check server logs for backend errors

## Roadmap

- [ ] User authentication
- [ ] Image uploads
- [ ] Rich text editor
- [ ] Email notifications
- [ ] Social media sharing
- [ ] RSS feeds
- [ ] SEO optimization
- [ ] Analytics dashboard 