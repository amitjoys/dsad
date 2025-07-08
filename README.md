# ConstructPune - Professional Construction Services Website

A comprehensive full-stack construction company website with cost calculator functionality, built with React, FastAPI, and MongoDB.

## 🏗️ Project Overview

ConstructPune is a professional construction company website that provides:
- **Interactive Cost Calculator** - Real-time construction cost estimation with location-based pricing
- **Service Portfolio** - Detailed construction service offerings from simple to luxury projects
- **Project Gallery** - Showcase of completed construction projects
- **Contact Management** - Professional contact forms and customer inquiry handling
- **Responsive Design** - Mobile-first, professional UI/UX design

## 🚀 Key Features

### Cost Calculator
- **Real-time Calculations** - Instant cost estimates based on project parameters
- **Location-based Pricing** - Pricing adjustments for different cities (Mumbai, Pune, Bangalore, etc.)
- **Material & Labor Selection** - Comprehensive selection of construction materials and labor types
- **Quality Levels** - Standard, Premium, and Luxury construction options
- **Detailed Breakdown** - Complete cost breakdown with material and labor costs
- **Export & Share** - Print and share functionality for estimates

### Professional Website
- **Modern Design** - Clean, professional design with construction industry focus
- **Service Pages** - Detailed information about construction services
- **Project Gallery** - Interactive gallery with project categorization
- **Contact System** - Advanced contact forms with service type selection
- **About Company** - Company history, team, and values showcase

### Technical Excellence
- **Production-Ready** - Fully optimized for production deployment
- **Secure APIs** - JWT authentication and secure API endpoints
- **Database Integration** - MongoDB for scalable data storage
- **Performance Optimized** - Fast loading times and optimized images
- **SEO Friendly** - Structured for search engine optimization

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **React Router 6.20.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Heroicons** - Professional icon library
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI 0.104.1** - Modern Python web framework
- **Motor 3.3.2** - Async MongoDB driver
- **Pydantic 2.5.0** - Data validation and settings management
- **JWT Authentication** - Secure user authentication
- **CORS Support** - Cross-origin resource sharing
- **Environment Configuration** - Secure environment variable management

### Database
- **MongoDB** - NoSQL database for flexible data storage
- **Async Operations** - Non-blocking database operations
- **UUID Primary Keys** - JSON-serializable unique identifiers

## 📋 API Endpoints

### Calculator Endpoints
```
GET  /api/calculator/materials      - Get available materials list
GET  /api/calculator/labor-types    - Get available labor types
GET  /api/calculator/locations      - Get supported locations
POST /api/calculator/estimate       - Calculate construction costs
```

### Contact & Projects
```
POST /api/contact                   - Submit contact form
GET  /api/projects                  - Get projects list
POST /api/projects                  - Create new project
```

### Authentication
```
POST /api/auth/register            - User registration
POST /api/auth/login               - User login
GET  /api/auth/me                  - Get current user
```

### Health Check
```
GET  /api/                         - API health check
```

## 🗂️ Project Structure

```
/app/
├── backend/                       # FastAPI backend
│   ├── server.py                 # Main application file
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Environment variables
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js
│   │   │   ├── Calculator.js
│   │   │   ├── Services.js
│   │   │   ├── Gallery.js
│   │   │   ├── About.js
│   │   │   └── Contact.js
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Custom styles
│   │   └── index.css            # Tailwind imports
│   ├── package.json             # Node dependencies
│   ├── tailwind.config.js       # Tailwind configuration
│   └── .env                     # Frontend environment
└── README.md                    # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.11+
- MongoDB

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
yarn install
```

### Environment Configuration
Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017/constructpune_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Running the Application
The application is designed to run in a containerized environment with supervisor managing the services:

```bash
# Restart all services
sudo supervisorctl restart all

# Check service status
sudo supervisorctl status
```

Services run on:
- Frontend: Port 3000
- Backend: Port 8001
- MongoDB: Port 27017

## 💰 Calculator Functionality

### Supported Locations
- Mumbai, Pune, Bangalore, Delhi, Hyderabad, Chennai, Kolkata, Ahmedabad

### Materials Covered
- Cement, Steel, Bricks, Sand, Tiles, Paint, Wood, Glass, Electrical, Plumbing

### Labor Types
- Mason, Electrical, Plumbing, Painting, Tiling, Carpenter, Interior, Foundation, Grills, Glass Doors, Windows

### Quality Levels
- **Standard (1.0x)** - Good quality materials with standard finishes
- **Premium (1.4x)** - High-quality materials with premium finishes  
- **Luxury (1.8x)** - Ultra-premium materials with luxury finishes

### Cost Calculation Logic
1. **Base Pricing** - Location-specific material and labor rates
2. **Quantity Estimation** - Area-based material quantity calculations
3. **Quality Adjustments** - Multipliers based on selected quality level
4. **Overhead & Profit** - 15% markup for business operations
5. **Final Breakdown** - Detailed cost breakdown with all components

## 🎨 Design Features

### Visual Design
- **Professional Color Scheme** - Blue primary with accent colors
- **Construction Industry Focus** - Industry-appropriate imagery and icons
- **Mobile-First Design** - Responsive across all devices
- **Accessibility** - WCAG compliant design elements

### User Experience
- **Intuitive Navigation** - Clear menu structure and page flow
- **Interactive Elements** - Hover effects and smooth animations
- **Loading States** - Professional loading indicators
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Clear confirmation messages

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure user authentication
- **Password Hashing** - Bcrypt password encryption
- **Token Expiration** - Configurable token lifetimes
- **Protected Routes** - Secure API endpoints

### Data Protection
- **Input Validation** - Pydantic model validation
- **SQL Injection Prevention** - NoSQL database with safe queries
- **CORS Configuration** - Controlled cross-origin access
- **Environment Variables** - Secure configuration management

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Features
- **Adaptive Navigation** - Collapsible mobile menu
- **Flexible Layouts** - CSS Grid and Flexbox
- **Optimized Images** - Responsive image loading
- **Touch-Friendly** - Mobile-optimized interactions

## 🚀 Production Deployment

### Environment Requirements
- **Containerized Environment** - Docker/Kubernetes ready
- **Supervisor Process Management** - Service orchestration
- **MongoDB Database** - Production database setup
- **Load Balancing** - Support for multiple instances

### Performance Optimizations
- **Code Splitting** - Optimized JavaScript bundles
- **Image Optimization** - WebP and responsive images
- **Caching Strategies** - Browser and API caching
- **Minification** - Production-ready asset optimization

### Monitoring & Logging
- **API Health Checks** - Endpoint monitoring
- **Error Tracking** - Comprehensive error logging
- **Performance Metrics** - Response time monitoring
- **User Analytics** - Usage tracking capabilities

## 📈 Business Features

### Lead Generation
- **Contact Forms** - Professional inquiry handling
- **Cost Calculator** - Interactive cost estimation tool
- **Service Showcase** - Detailed service presentations
- **Project Portfolio** - Visual project demonstrations

### Customer Experience
- **Instant Quotes** - Real-time cost calculations
- **Professional Design** - Trust-building visual elements
- **Comprehensive Information** - Detailed service descriptions
- **Easy Communication** - Multiple contact methods

## 🧪 Testing

### Backend Testing
All API endpoints have been comprehensively tested:
- ✅ Health check endpoint
- ✅ Calculator functionality (materials, labor, locations, estimates)
- ✅ Contact form processing
- ✅ Project management
- ✅ Authentication system

### Frontend Testing
- ✅ Calculator form submission and result display
- ✅ Contact form submission with success confirmation
- ✅ Navigation and routing
- ✅ Responsive design across devices
- ✅ Interactive elements and user feedback

## 🔧 Customization

### Brand Customization
- **Colors**: Update Tailwind config for brand colors
- **Typography**: Modify font families in Tailwind config
- **Logo**: Replace logo in Navbar component
- **Content**: Update text content in page components

### Functionality Extensions
- **Additional Materials**: Add new materials to backend pricing
- **New Locations**: Extend location coverage with pricing data
- **Service Types**: Add new construction service categories
- **Calculator Features**: Enhance cost calculation logic

## 📞 Support & Contact

For technical support or business inquiries:
- **Email**: info@constructpune.in
- **Phone**: +91-1234567890
- **Address**: 123 Construction Street, Pune, Maharashtra 411001, India

## 📄 License

This project is proprietary software developed for ConstructPune. All rights reserved.

---

**ConstructPune** - Building Dreams Since 2018 🏗️