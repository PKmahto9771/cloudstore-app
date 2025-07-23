# ☁️ Cloud File Storage

A secure, scalable cloud file storage system with advanced folder management, file versioning, and sharing capabilities. Built with modern web technologies for optimal performance and security.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://cloud-file-storage-gtw3.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Key Features

### 📁 **Folder Management**
- Create unlimited nested folders and subfolders
- Intuitive folder navigation with breadcrumb trails
- Organize files in a hierarchical structure

### 📤 **File Operations**
- Drag-and-drop file uploads up to 800MB
- Automatic file versioning for duplicate names
- Download files with original names preserved
- Secure file deletion with instant cleanup

### 🔗 **Sharing & Access**
- Generate time-limited signed URLs for secure sharing
- Revoke access to shared files instantly
- Public access without requiring login

### 🛡️ **Security & Authentication**
- JWT-based secure authentication
- User data isolation and privacy protection
- HTTPS encryption for all communications
- Protected API endpoints with middleware validation

---

## 🚀 Live Demo

🌐 **Try it now:** [https://cloud-file-storage-gtw3.onrender.com](https://cloud-file-storage-gtw3.onrender.com)

> **Note:** Hosted on Render's free tier - initial load may take 30-60 seconds.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** database
- **Cloudflare R2** storage bucket

### 1. Clone the Repository
```bash
git clone https://github.com/PKmahto9771/cloud-file-storage.git
cd cloud-file-storage/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY=your_r2_access_key
CLOUDFLARE_R2_SECRET_KEY=your_r2_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=5000
```

### 4. Setup Cloudflare R2
1. Create a Cloudflare account and navigate to R2 Object Storage
2. Create a new bucket for file storage
3. Generate API tokens with R2 read/write permissions
4. Copy your account ID for the endpoint URL

### 5. MongoDB Setup
- Create a MongoDB Atlas account or use local MongoDB
- Create a new database and get the connection string
- Whitelist your IP address in Atlas security settings

### 6. Start the Backend Server
```bash
# Development mode with auto-restart
npm start
```

The application will be available at `http://localhost:5000`


## Frontend Installation

### 1. Go to Frontend Directory
```bash
cd cloud-file-storage/frontend
```
 
### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev
```
---

## 📱 Usage Guide

### Getting Started
1. **Create Account** - Sign up with email and secure password
2. **Login** - Access your personal file storage dashboard
3. **Create Folders** - Organize files in custom folder structures
4. **Upload Files** - Drag & drop or browse to upload files
5. **Manage Files** - Download, share, or delete files as needed

### File Versioning
- Upload files with identical names to automatically create versions
- Access previous versions through the file management interface
- Version history maintained per folder location

### Sharing Files
- Generate secure, time-limited URLs for any file
- Share links without requiring recipient registration
- Revoke access by deleting the shared URL

---

## 🏗️ Architecture & Tech Stack

### Backend Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework

### Database & Storage
- **MongoDB Atlas** - Document database for metadata
- **Cloudflare R2** - S3-compatible object storage
- **Mongoose** - MongoDB object modeling

### Security & Authentication
- **JWT** - JSON Web Tokens for secure sessions
- **bcrypt** - Password hashing and validation
- **Cookie-based** - Secure authentication storage

### File Handling
- **Multer** - Multipart form data processing
- **AWS SDK v3** - S3-compatible R2 integration
- **Signed URLs** - Time-limited secure file access

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### File Management
- `POST /api/files/upload` - Upload files
- `GET /api/files/download/:id` - Download files
- `DELETE /api/files/:id` - Delete files
- `GET /api/files/:id/versions` - Get file versions

### Folder Management
- `POST /api/folders` - Create folder
- `GET /api/folders/:id` - Get folder contents
- `DELETE /api/folders/:id` - Delete folder

---

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy with automatic builds on git push

### Manual Deployment
```bash
# Install production dependencies
npm install --production

# Start the server (for production use PM2 or similar process manager)
node server.js

# Or with PM2 for production (recommended)
npm install -g pm2
pm2 start server.js --name "cloud-file-storage"
pm2 save
pm2 startup
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**PKmahto9771**
- GitHub: [@PKmahto9771](https://github.com/PKmahto9771)
- Project: [Cloud File Storage](https://github.com/PKmahto9771/cloud-file-storage)

---

## 🐛 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/PKmahto9771/cloud-file-storage/issues) page
2. Create a new issue with detailed description
3. Include error logs and environment details

---

*⭐ Star this repository if you found it helpful!*
