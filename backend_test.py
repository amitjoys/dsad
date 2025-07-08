import requests
import unittest
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment variable
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

class TestConstructPuneAPI(unittest.TestCase):
    """Test suite for ConstructPune API endpoints"""

    def test_01_api_health(self):
        """Test API health endpoint"""
        print("\n=== Testing API Health Endpoint ===")
        response = requests.get(f"{API_BASE_URL}/")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("running", response.json()["message"].lower())

    def test_02_calculator_materials(self):
        """Test calculator materials endpoint"""
        print("\n=== Testing Calculator Materials Endpoint ===")
        response = requests.get(f"{API_BASE_URL}/calculator/materials")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        # Check for expected materials
        expected_materials = ["cement", "steel", "bricks"]
        for material in expected_materials:
            self.assertIn(material, response.json())

    def test_03_calculator_labor_types(self):
        """Test calculator labor types endpoint"""
        print("\n=== Testing Calculator Labor Types Endpoint ===")
        response = requests.get(f"{API_BASE_URL}/calculator/labor-types")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        # Check for expected labor types
        expected_labor_types = ["mason", "electrical", "plumbing"]
        for labor_type in expected_labor_types:
            self.assertIn(labor_type, response.json())

    def test_04_calculator_locations(self):
        """Test calculator locations endpoint"""
        print("\n=== Testing Calculator Locations Endpoint ===")
        response = requests.get(f"{API_BASE_URL}/calculator/locations")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        # Check for expected locations
        expected_locations = ["Pune", "Mumbai"]
        for location in expected_locations:
            self.assertIn(location, response.json())

    def test_05_calculator_estimate(self):
        """Test calculator estimate endpoint"""
        print("\n=== Testing Calculator Estimate Endpoint ===")
        
        # Sample data for cost estimation
        payload = {
            "project_type": "residential",
            "area": 1500,
            "location": "pune",
            "materials": ["cement", "steel", "bricks", "tiles"],
            "labor_types": ["mason", "electrical", "plumbing"],
            "quality_level": "standard"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/calculator/estimate", 
            json=payload
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {json.dumps(response.json(), indent=2)}")
        
        self.assertEqual(response.status_code, 200)
        result = response.json()
        
        # Validate response structure
        self.assertIn("total_cost", result)
        self.assertIn("material_costs", result)
        self.assertIn("labor_costs", result)
        self.assertIn("breakdown", result)
        self.assertIn("project_id", result)
        
        # Validate material costs
        for material in payload["materials"]:
            self.assertIn(material, result["material_costs"])
            
        # Validate labor costs
        for labor_type in payload["labor_types"]:
            self.assertIn(labor_type, result["labor_costs"])
            
        # Validate breakdown
        self.assertIn("materials_subtotal", result["breakdown"])
        self.assertIn("labor_subtotal", result["breakdown"])
        self.assertIn("quality_level", result["breakdown"])
        self.assertEqual(result["breakdown"]["quality_level"], payload["quality_level"])
        
        # Test with different quality level
        print("\n--- Testing with premium quality level ---")
        payload["quality_level"] = "premium"
        response = requests.post(
            f"{API_BASE_URL}/calculator/estimate", 
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        premium_result = response.json()
        print(f"Premium quality total cost: {premium_result['total_cost']}")
        
        # Premium should be more expensive than standard
        self.assertGreater(premium_result["total_cost"], result["total_cost"])

    def test_06_contact_form(self):
        """Test contact form submission endpoint"""
        print("\n=== Testing Contact Form Endpoint ===")
        
        # Sample contact form data
        payload = {
            "name": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "phone": "+91 9876543210",
            "message": "I need a quote for renovating my 2BHK apartment in Baner, Pune.",
            "service_type": "renovation"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/contact", 
            json=payload
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("id", response.json())
        self.assertIn("submitted successfully", response.json()["message"].lower())

    def test_07_projects(self):
        """Test projects endpoint"""
        print("\n=== Testing Projects Endpoint ===")
        response = requests.get(f"{API_BASE_URL}/projects")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        
        # Note: The projects list might be empty if no projects have been added yet
        # This is not an error condition, so we don't assert on the length

    def test_08_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid calculator estimate request
        print("\n--- Testing invalid calculator estimate ---")
        invalid_payload = {
            "project_type": "residential",
            "area": "not_a_number",  # Invalid area
            "location": "pune",
            "materials": ["cement"],
            "labor_types": ["mason"]
        }
        
        response = requests.post(
            f"{API_BASE_URL}/calculator/estimate", 
            json=invalid_payload
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertGreaterEqual(response.status_code, 400)
        self.assertIn("detail", response.json())
        
        # Test invalid contact form
        print("\n--- Testing invalid contact form ---")
        invalid_contact = {
            "name": "Test User",
            # Missing required email field
            "phone": "1234567890",
            "message": "Test message"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/contact", 
            json=invalid_contact
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        self.assertGreaterEqual(response.status_code, 400)
        self.assertIn("detail", response.json())


if __name__ == "__main__":
    unittest.main()