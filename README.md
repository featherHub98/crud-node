# CRUD Node.js Application

A Node.js CRUD application with JWT authentication, built with Express.js and handlebars/EJS templating.

## Features

- User authentication (login/signup)
- JWT token with refresh token support
- Product CRUD operations
- User CRUD operations
- Cookie-based session management
- Docker support for production and development

## Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory:
```env
JWT_SECRET=Your_Very_Long_And_Random_Secret_Key_Here_1234567890
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
```

### 3. Run the Application
```bash
# Production mode
npm start

# Development mode (with hot reload using nodemon)
npm run dev
```

The app will be available at `http://localhost:3000`

## Docker Deployment

### Production Build
```bash
# Build the image
docker build -t crud-node .

# Run the container
docker run -p 3000:3000 \
  -e JWT_SECRET="Your_Very_Long_And_Random_Secret_Key_Here_1234567890" \
  -e REFRESH_TOKEN_SECRET="your_refresh_token_secret_key" \
  -v $(pwd)/data:/app/data \
  crud-node
```

### Development Build (with Hot Reload)
```bash
# Build the development image
docker build -f Dockerfile.dev -t crud-node:dev .

# Run with hot reload support
docker run -p 3000:3000 \
  -e JWT_SECRET="Your_Very_Long_And_Random_Secret_Key_Here_1234567890" \
  -e REFRESH_TOKEN_SECRET="your_refresh_token_secret_key" \
  -v $(pwd):/app \
  crud-node:dev
```

### Using Docker Compose
```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
crud-node/
├── controller/           # Route handlers
│   ├── productController.js
│   └── usersController.js
├── services/            # Business logic
│   ├── jwtService.js
│   ├── serviceProduct.js
│   └── serviceUsers.js
├── views/               # Template files
│   ├── index.hbs
│   ├── users.ejs
│   └── about.ejs
├── public/              # Static files
│   └── css/
├── data/                # JSON database
│   └── db.json
├── Dockerfile           # Production container
├── Dockerfile.dev       # Development container
├── docker-compose.yml   # Docker services definition
├── server.js            # Entry point
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/refresh` - Refresh access token
- `POST /api/logout` - User logout

### Products
- `GET /api/products` - Get all products (requires auth)
- `POST /api/products` - Add product (requires auth)
- `PUT /api/products/update` - Update product (requires auth)
- `DELETE /api/products/delete` - Delete product (requires auth)

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Authentication Flow

1. User logs in with credentials
2. Server validates and generates JWT access token (1h expiry) and refresh token (7d expiry)
3. Tokens are stored in HTTP-only cookies
4. Access token used for protected routes
5. When access token expires, refresh token used to get new access token
6. User must re-login if refresh token expires

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for signing access tokens |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh tokens |
| `NODE_ENV` | Environment (development/production) |

## License

ISC
