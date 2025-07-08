# ConstructPune - Complete Construction Website Clone

A complete clone of ConstructPune.in with additional construction cost calculator features. Built with React frontend, FastAPI backend, and MongoDB database, fully containerized with Docker.

## 🏗️ Features

### Original Website Features
- **Home Page**: Hero section, services overview, projects showcase, client testimonials
- **Services**: Three-tier construction services (Simple, Luxury, Premium)
- **Gallery**: Project portfolio with filtering and modal view
- **About Us**: Company information, team, timeline, awards
- **Contact**: Contact form, company details, FAQ section

### New Calculator Features
- **Material Cost Calculator**: Real-time pricing for cement, steel, bricks, etc.
- **Labor Cost Calculator**: Cost estimation for mason, electrical, plumbing work
- **Location-Based Pricing**: Adjusted costs for different Indian cities
- **Quality Level Selection**: Standard, Premium, Luxury construction options
- **Detailed Cost Breakdown**: Comprehensive project cost analysis
- **PDF Export & Sharing**: Print and share cost estimates

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Heroicons**: Beautiful SVG icons
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.11**: Latest Python with async/await support
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver
- **JWT Authentication**: Secure user authentication
- **Pydantic**: Data validation and settings management

### DevOps & Deployment
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-container application orchestration
- **Nginx**: Reverse proxy and static file serving
- **Supervisor**: Process management for production
- **MongoDB**: Persistent data storage with automated backups

## 📁 Project Structure

```
/app/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main React component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── .env              # Frontend environment variables
├── docker/                # Docker configuration
│   ├── nginx.conf         # Nginx configuration
│   ├── supervisord.conf   # Process management
│   ├── entrypoint.sh      # Container startup script
│   └── backup.sh          # Database backup script
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Production deployment
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
```bash
git clone <repository-url>
cd constructpune
```

2. **Configure environment variables**:
```bash
cp docker/production.env .env
# Edit .env file with your configuration
```

3. **Start the application**:
```bash
docker-compose up -d
```

4. **Access the application**:
- Frontend: http://localhost
- API Documentation: http://localhost/api/docs
- MongoDB: localhost:27017

### Local Development Setup

1. **Backend Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

2. **Frontend Setup**:
```bash
cd frontend
yarn install
yarn start
```

3. **Database Setup**:
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/constructpune_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Production Configuration

For production deployment, copy `docker/production.env` to `.env` and update:

```env
MONGO_URL=mongodb://admin:secure_password@mongodb:27017/constructpune_db?authSource=admin
SECRET_KEY=your-super-secure-production-secret-key
ENVIRONMENT=production
DOMAIN_NAME=your-domain.com
PROTOCOL=https
```

## 🧮 Calculator Features

### Material Pricing
The calculator includes real-time pricing for:
- Cement (per bag)
- Steel (per kg)
- Bricks (per piece)
- Sand (per cubic feet)
- Tiles (per sq ft)
- Paint (per litre)
- Wood (per sq ft)
- Glass (per sq ft)

### Labor Cost Calculation
Labor costs are calculated for:
- Mason work
- Electrical work
- Plumbing
- Painting
- Tiling
- Carpentry
- Interior design
- Foundation work
- Grills installation
- Glass doors/windows

### Location-Based Pricing
Pricing is adjusted for different cities:
- Mumbai (1.3x multiplier)
- Pune (1.0x base)
- Bangalore (1.1x)
- Delhi (1.2x)
- Hyderabad (0.9x)
- Chennai (1.0x)
- Kolkata (0.8x)
- Ahmedabad (0.85x)

## 🚀 API Endpoints

### Public Endpoints
- `GET /api/` - API health check
- `POST /api/contact` - Submit contact form
- `GET /api/projects` - Get all projects
- `POST /api/calculator/estimate` - Calculate construction costs
- `GET /api/calculator/materials` - Get available materials
- `GET /api/calculator/labor-types` - Get labor types
- `GET /api/calculator/locations` - Get supported locations

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Admin Endpoints (Protected)
- `POST /api/projects` - Create new project
- Management endpoints for content administration

## 🐳 Docker Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
docker-compose up -d
```

### Scaling
```bash
docker-compose up -d --scale constructpune_app=3
```

## 📊 Monitoring & Maintenance

### Health Checks
- Application: `http://localhost/health`
- API: `http://localhost/api/`
- Database: Built-in MongoDB health checks

### Logs
```bash
# View application logs
docker-compose logs -f constructpune_app

# View specific service logs
docker-compose logs -f mongodb
```

### Backups
Automated database backups are configured:
- Schedule: Daily at 2 AM
- Retention: 30 days
- Location: `./backups/`

Manual backup:
```bash
docker-compose run --rm backup
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Security headers (HSTS, CSP, etc.)
- Input validation and sanitization
- SQL injection prevention (NoSQL)

## 🎨 Customization

### Adding New Materials
1. Update the `base_prices` dictionary in `backend/server.py`
2. Add the material to the frontend calculator form
3. Update location multipliers if needed

### Adding New Locations
1. Add location to `location_multipliers` in `backend/server.py`
2. Update the locations endpoint
3. Add to frontend location selector

### Custom Styling
- Modify `frontend/src/index.css` for global styles
- Update `frontend/tailwind.config.js` for theme customization
- Component-specific styles in respective files

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
yarn test
```

### Integration Testing
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📈 Performance Optimization

- Image optimization and lazy loading
- Code splitting and lazy imports
- MongoDB indexing for faster queries
- Nginx caching for static assets
- Gzip compression
- CDN integration ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@constructpune.in
- Phone: +91-1234567890
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Original ConstructPune.in website for design inspiration
- Unsplash and Pexels for high-quality images
- Open source community for excellent tools and libraries

---

**ConstructPune** - Building dreams since 2018 🏗️