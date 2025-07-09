from datetime import datetime
from database import service_pages_collection

# Service pages data to be initialized
SERVICE_PAGES_DATA = [
    {
        "slug": "painting-services",
        "title": "Professional Painting Services in Pune",
        "description": "Transform your space with our expert painting services. From interior to exterior, residential to commercial - we deliver quality results.",
        "content": """
        <div class="service-content">
            <h2>Professional Painting Services</h2>
            <p>Our expert painting team delivers exceptional results for both interior and exterior painting projects. We use premium quality paints and modern techniques to ensure long-lasting, beautiful finishes.</p>
            
            <h3>Our Painting Services Include:</h3>
            <ul>
                <li>Interior Wall Painting</li>
                <li>Exterior Wall Painting</li>
                <li>Ceiling Painting</li>
                <li>Texture Painting</li>
                <li>Stencil and Decorative Painting</li>
                <li>Wood and Metal Painting</li>
                <li>Waterproofing with Paint</li>
                <li>Color Consultation</li>
            </ul>
            
            <h3>Why Choose Our Painting Services?</h3>
            <ul>
                <li>Skilled and experienced painters</li>
                <li>Premium quality paints from trusted brands</li>
                <li>Proper surface preparation</li>
                <li>Clean and efficient work process</li>
                <li>Competitive pricing</li>
                <li>Warranty on workmanship</li>
            </ul>
        </div>
        """,
        "features": [
            "Interior & Exterior Painting",
            "Texture & Decorative Painting",
            "Premium Quality Paints",
            "Professional Color Consultation",
            "Surface Preparation",
            "Clean Work Process",
            "Warranty Included"
        ],
        "pricing_info": {
            "starting_price": 15,
            "unit": "per sq ft",
            "factors": [
                "Surface condition",
                "Paint quality",
                "Number of coats",
                "Complexity of work",
                "Location accessibility"
            ]
        },
        "images": [
            "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop"
        ],
        "seo_data": {
            "title": "Professional Painting Services in Pune | Interior & Exterior Painting",
            "description": "Get expert painting services in Pune for interior and exterior walls. Professional painters, quality paints, competitive pricing. Free consultation available.",
            "keywords": ["painting services pune", "interior painting", "exterior painting", "professional painters", "wall painting"]
        },
        "is_active": True
    },
    # Additional service pages would go here but truncated for brevity
]

async def initialize_service_pages():
    """Initialize service pages in the database"""
    # Check if service pages already exist
    existing_count = await service_pages_collection.count_documents({})
    if existing_count == 0:
        # Insert service pages
        for service_data in SERVICE_PAGES_DATA:
            service_data["created_at"] = datetime.now()
            service_data["updated_at"] = datetime.now()
            await service_pages_collection.insert_one(service_data)
        print(f"Initialized {len(SERVICE_PAGES_DATA)} service pages")
    else:
        print(f"Service pages already exist ({existing_count} found)")