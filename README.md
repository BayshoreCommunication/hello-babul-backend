# Hello Babul Website Backend API

A comprehensive Node.js, Express.js, and TypeScript backend API for the Hello Babul Website with authentication, file uploads, and community engagement features.

## Features

- ✅ User authentication (Sign up, Sign in)
- ✅ JWT access tokens with role-based access
- ✅ Password hashing with bcrypt
- ✅ MongoDB database with Mongoose
- ✅ TypeScript for type safety
- ✅ File uploads to Digital Ocean Spaces
- ✅ Development Ideas collection
- ✅ Your Opinion submissions
- ✅ Your Suggest with media upload
- ✅ Volunteer registration with media
- ✅ Pagination and search functionality
- ✅ Protected routes with authentication middleware

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=8001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/hello_babul
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES=7d
ACTIVATION_SECRET=your-activation-secret-key

# Email Configuration (SMTP)
SMPT_SERVICE=gmail
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_PASSWORD=your-app-password
SMPT_MAIL=your-email@gmail.com

# Client URL
CLIENT_URL=http://localhost:3000

# Digital Ocean Spaces Configuration
DIGITALOCEAN_ENDPOINT=https://nyc3.digitaloceanspaces.com
DIGITALOCEAN_API_KEY=your-api-key
DIGITALOCEAN_SECRET_ACCESS_KEY=your-secret-key
DIGITALOCEAN_SPACE_NAME=your-space-name
DIGITALOCEAN_FOLDER=hello-babul
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the variables above

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Public Routes

- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "01234567890",
    "role": "customer" // optional: "customer" | "admin" | "staff" | "student" | "teacher"
  }
  ```

- `POST /api/auth/login` - Login with credentials
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Protected Routes (Require Bearer Token)

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <accessToken>`

- `POST /api/auth/logout` - Logout
  - Headers: `Authorization: Bearer <accessToken>`

---

### User Routes (`/api/users`)

#### Protected Routes

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

### Development Ideas Routes (`/api/development-ideas`)

#### Public Routes

- `POST /api/development-ideas` - Submit development idea
  ```json
  {
    "fullname": "John Doe",
    "mobile": "01234567890",
    "area": "Dhaka",
    "comment": "My development idea...",
    "typeOfIdea": "Infrastructure"
  }
  ```

- `GET /api/development-ideas?page=1&limit=10&search=keyword` - Get all ideas with pagination
- `GET /api/development-ideas/:id` - Get idea by ID
- `PUT /api/development-ideas/:id` - Update idea
- `DELETE /api/development-ideas/:id` - Delete idea

---

### Your Opinion Routes (`/api/your-opinions`)

#### Public Routes

- `POST /api/your-opinions` - Submit opinion
  ```json
  {
    "fullname": "John Doe",
    "mobile": "01234567890",
    "area": "Dhaka",
    "comment": "My opinion..."
  }
  ```

- `GET /api/your-opinions?page=1&limit=10&search=keyword` - Get all opinions with pagination
- `GET /api/your-opinions/:id` - Get opinion by ID
- `PUT /api/your-opinions/:id` - Update opinion
- `DELETE /api/your-opinions/:id` - Delete opinion

---

### Your Suggest Routes (`/api/your-suggests`)

#### Public Routes

- `POST /api/your-suggests` - Submit suggestion with media
  - Content-Type: `multipart/form-data`
  ```
  fullname: "John Doe"
  mobile: "01234567890"
  area: "Dhaka"
  comment: "My suggestion..."
  media: [image/video file] (optional)
  ```

- `GET /api/your-suggests?page=1&limit=10&search=keyword` - Get all suggestions
- `GET /api/your-suggests/:id` - Get suggestion by ID
- `PUT /api/your-suggests/:id` - Update suggestion with optional new media
- `DELETE /api/your-suggests/:id` - Delete suggestion

---

### Volunteer Routes (`/api/volunteers`)

#### Public Routes

- `POST /api/volunteers` - Register as volunteer
  - Content-Type: `multipart/form-data`
  ```
  fullname: "John Doe"
  fathername: "Father Name"
  mothername: "Mother Name"
  dateofbirth: "2000-01-15" (YYYY-MM-DD format)
  mobile: "01234567890"
  education: "BSc in Computer Science"
  area: "Dhaka"
  agree: "true"
  media: [image file] (optional)
  ```

- `GET /api/volunteers?page=1&limit=10&search=keyword` - Get all volunteers
- `GET /api/volunteers/:id` - Get volunteer by ID
- `PUT /api/volunteers/:id` - Update volunteer
- `DELETE /api/volunteers/:id` - Delete volunteer

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development)"
}
```

## File Upload

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP (up to 10MB)
- **Videos**: MP4, WebM, MOV (up to 50MB for suggestions)

### Storage
Files are uploaded to **Digital Ocean Spaces** with the following structure:
```
hello-babul/
├── suggestions/
│   └── timestamp-filename.ext
└── volunteers/
    └── timestamp-filename.ext
```

Public URLs are returned in the format:
```
https://your-space-name.nyc3.digitaloceanspaces.com/hello-babul/folder/timestamp-filename.ext
```

## Project Structure

```
backend/
├── config/
│   ├── db.ts                    # Database connection
│   └── jwt.ts                   # JWT utilities
├── controller/
│   ├── authController.ts        # Authentication logic
│   ├── developmentIdeaController.ts
│   ├── yourOpinionController.ts
│   ├── yourSuggestController.ts
│   └── volunteerController.ts
├── middleware/
│   └── auth.ts                  # Authentication middleware
├── modal/
│   ├── user.ts                  # User model
│   ├── developmentIdea.ts       # Development idea model
│   ├── yourOpinion.ts           # Opinion model
│   ├── yourSuggest.ts           # Suggestion model
│   └── volunteer.ts             # Volunteer model
├── routes/
│   ├── auth.ts                  # Auth routes
│   ├── users.ts                 # User routes
│   ├── developmentIdea.ts       # Development idea routes
│   ├── yourOpinion.ts           # Opinion routes
│   ├── yourSuggest.ts           # Suggestion routes
│   └── volunteer.ts             # Volunteer routes
├── utils/
│   └── uploadToDigitalOcean.ts  # File upload utility
├── server.ts                    # Express app setup
├── nodemon.json                 # Nodemon configuration
└── package.json
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building

## Notes

- All public routes (development ideas, opinions, suggestions, volunteers) do not require authentication
- User management routes require authentication
- Date format for volunteer registration: **YYYY-MM-DD** (e.g., 2000-01-15)
- Agreement field is required for volunteer registration
- Search functionality works across multiple fields in each model
- Pagination is available on all list endpoints

## Database Models

### User
- name, email, password, phone, role
- Roles: customer, admin, staff, student, teacher

### Development Idea
- fullname, mobile, area, comment, typeOfIdea

### Your Opinion
- fullname, mobile, area, comment

### Your Suggest
- fullname, mobile, area, comment, media, mediaType

### Volunteer
- fullname, fathername, mothername, dateofbirth, mobile, education, area, media, agree
