# AidConnect+ Authentication Setup

This guide will help you set up the authentication system for AidConnect+.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=aid_connect
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Encryption Configuration (32-character hex key for AES-256-CBC)
ENCRYPTION_KEY=your-32-character-hex-encryption-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Generate Encryption Key

Generate a 32-character hex encryption key for AES-256-CBC encryption:

```bash
# Using the provided script (recommended)
cd backend
npm run generate-key

# Or using Node.js directly
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 16
```

### 4. Database Setup

1. Create a MySQL database named `aid_connect`
2. Run the SQL schema from `backend/database/schema.sql` to create the required tables

### 5. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Authentication Features

### Backend API Endpoints

**Authentication:**

- `POST /auth/user/login` - User (Donor) login
- `POST /auth/org/login` - Organization (NGO) login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile (protected)

**Registration:**

- `POST /donor/signup` - User (Donor) registration
- `POST /org/signup` - Organization (NGO) registration

### Frontend Features

- **Authentication Context**: Global state management for user authentication
- **Protected Routes**: Automatic token refresh and route protection
- **Login Forms**: Separate login forms for donors and NGOs
- **Navbar Integration**: Shows user status and logout functionality

### Security Features

- **JWT Tokens**: Secure access tokens with 15-minute expiration
- **Refresh Tokens**: Long-lived tokens for seamless user experience
- **HttpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Usage

1. **User Registration**: Users can sign up as either donors or NGOs
2. **Separate Login Endpoints**:
   - Donors use `/donor-login` page which calls `/auth/user/login`
   - NGOs use `/ngo-login` page which calls `/auth/org/login`
3. **Automatic Token Refresh**: The system automatically refreshes expired tokens
4. **Logout**: Users can log out, which invalidates their refresh token
5. **Profile Access**: Authenticated users can access their profile information

## Database Tables

- `users`: Stores donor information
- `organizations`: Stores NGO information
- `sessions`: Manages refresh tokens and user sessions
- `campaigns`: Stores fundraising campaigns
- `donations`: Records donation transactions

## Testing the Authentication

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Click on "Donor Login" or "NGO Login"
4. Use test credentials (you'll need to create test users in the database)
5. After successful login, you should see the user's email in the navbar
6. Click "Logout" to test the logout functionality

## Troubleshooting

- **CORS Issues**: Make sure the frontend URL is correctly configured in the backend CORS settings
- **Database Connection**: Verify your database credentials and ensure the database is running
- **Token Issues**: Check that JWT_SECRET is set in your environment variables
- **Cookie Issues**: Ensure both servers are running on the correct ports
