// MongoDB initialization script for ConstructPune

// Switch to the application database
db = db.getSiblingDB('constructpune_db');

// Create application user
db.createUser({
  user: 'constructpune_user',
  pwd: 'constructpune_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'constructpune_db'
    }
  ]
});

// Create collections with indexes
db.createCollection('contacts');
db.createCollection('projects');
db.createCollection('calculations');
db.createCollection('users');

// Create indexes for better performance
db.contacts.createIndex({ 'email': 1 });
db.contacts.createIndex({ 'created_at': 1 });

db.projects.createIndex({ 'name': 1 });
db.projects.createIndex({ 'category': 1 });
db.projects.createIndex({ 'created_at': 1 });

db.calculations.createIndex({ 'created_at': 1 });
db.calculations.createIndex({ 'location': 1 });

db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'created_at': 1 });

// Insert sample projects data
db.projects.insertMany([
  {
    id: "project-1",
    name: "Modern Living Space",
    description: "Contemporary design meets functionality in this stunning residential project.",
    image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a",
    category: "residential",
    location: "Pune",
    area: "2500 sq ft",
    type: "Luxury Construction",
    year: "2023",
    created_at: new Date()
  },
  {
    id: "project-2", 
    name: "Luxury Villa",
    description: "Mediterranean-inspired architecture with modern amenities and premium finishes.",
    image_url: "https://images.unsplash.com/photo-1481026469463-66327c86e544",
    category: "villa",
    location: "Mumbai", 
    area: "4500 sq ft",
    type: "Premium Luxury",
    year: "2023",
    created_at: new Date()
  },
  {
    id: "project-3",
    name: "Commercial Office Space", 
    description: "Modern office design optimized for productivity and employee satisfaction.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    category: "commercial",
    location: "Bangalore",
    area: "8000 sq ft", 
    type: "Commercial Construction",
    year: "2023",
    created_at: new Date()
  },
  {
    id: "project-4",
    name: "Residential Apartment",
    description: "Efficient space utilization with modern design elements.",
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", 
    category: "residential",
    location: "Pune",
    area: "1200 sq ft",
    type: "Simple Construction", 
    year: "2022",
    created_at: new Date()
  },
  {
    id: "project-5",
    name: "Industrial Warehouse",
    description: "Large-scale industrial construction with advanced logistics design.",
    image_url: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
    category: "industrial", 
    location: "Chennai",
    area: "15000 sq ft",
    type: "Industrial Construction",
    year: "2023", 
    created_at: new Date()
  },
  {
    id: "project-6",
    name: "Luxury Penthouse",
    description: "Ultra-premium penthouse with breathtaking city views and luxury amenities.",
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    category: "villa",
    location: "Mumbai",
    area: "3500 sq ft",
    type: "Premium Luxury", 
    year: "2023",
    created_at: new Date()
  }
]);

print('Database initialization completed successfully!');