# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or use the convenience script:
```bash
npm run install:all
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   mongod
   ```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in server `.env` file

## Step 3: Configure Environment Variables

### Server Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/code-editor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

**Important**: 
- Change `JWT_SECRET` to a strong random string in production
- Update `MONGO_URI` if using MongoDB Atlas
- Update `CLIENT_URL` if deploying to production

### Client Configuration (Optional)

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Step 4: Run the Application

### Development Mode (Recommended)

Run both server and client together:
```bash
npm run dev
```

### Or Run Separately

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGO_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in server `.env` file
- Or kill the process using the port

### Socket.IO Connection Issues
- Ensure both server and client are running
- Check `CLIENT_URL` matches your frontend URL
- Check CORS settings in server code

### Module Not Found Errors
- Run `npm install` in the respective directory
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

1. Create an account by signing up
2. Create a new room
3. Share the Room ID with others
4. Start coding together!

