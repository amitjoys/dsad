import requests
import unittest
import json
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment variable
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

class TestEnhancedCalculator(unittest.TestCase):
    """Test suite for the enhanced calculator estimate endpoint"""

    def test_enhanced_calculator_estimate(self):
        """Test enhanced calculator estimate endpoint with complex parameters"""
        print("\n=== Testing Enhanced Calculator Estimate Endpoint ===")
        
        # Get available materials and labor types for testing
        materials_response = requests.get(f"{API_BASE_URL}/calculator/materials")
        labor_types_response = requests.get(f"{API_BASE_URL}/calculator/labor-types")
        
        self.assertEqual(materials_response.status_code, 200)
        self.assertEqual(labor_types_response.status_code, 200)
        
        available_materials = materials_response.json()
        available_labor_types = labor_types_response.json()
        
        # Select at least 8 materials and 8 labor types
        selected_materials = available_materials[:8] if len(available_materials) >= 8 else available_materials
        selected_labor_types = available_labor_types[:8] if len(available_labor_types) >= 8 else available_labor_types
        
        print(f"Selected materials: {selected_materials}")
        print(f"Selected labor types: {selected_labor_types}")
        
        # Comprehensive payload with all new parameters
        payload = {
            "project_type": "residential",
            "area": 2000,
            "location": "mumbai",
            "materials": selected_materials,
            "labor_types": selected_labor_types,
            "quality_level": "premium",
            "foundation_type": "basement",
            "roof_type": "sloped",
            "wall_type": "brick",
            "electrical_complexity": "smart_home",
            "plumbing_complexity": "luxury",
            "building_height": 3,
            "parking_spaces": 2,
            "garden_area": 500.0,
            "site_preparation": True,
            "include_permits": True,
            "include_transportation": True,
            "flooring_type": "premium",
            "finishing_level": "premium"
        }
        
        print("\n--- Testing with comprehensive parameters ---")
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{API_BASE_URL}/calculator/estimate", 
            json=payload
        )
        print(f"Response status: {response.status_code}")
        
        # Print error details if status code is not 200
        if response.status_code != 200:
            try:
                error_details = response.json()
                print(f"Error details: {json.dumps(error_details, indent=2)}")
            except:
                print(f"Error response text: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        result = response.json()
        
        # Print a summary of the response
        print(f"Total cost: {result['total_cost']}")
        print(f"Materials subtotal: {result['breakdown']['materials_subtotal']}")
        print(f"Labor subtotal: {result['breakdown']['labor_subtotal']}")
        print(f"Transportation subtotal: {result['breakdown']['transportation_subtotal']}")
        print(f"Additional costs subtotal: {result['breakdown']['additional_costs_subtotal']}")
        print(f"Cost per sq ft: {result['breakdown']['cost_per_sqft']}")
        print(f"Estimated timeline: {result['breakdown']['estimated_timeline_months']} months")
        
        # Validate response structure
        self.assertIn("total_cost", result)
        self.assertIn("material_costs", result)
        self.assertIn("labor_costs", result)
        self.assertIn("breakdown", result)
        self.assertIn("project_id", result)
        self.assertIn("location", result)
        
        # Validate material costs
        for material in selected_materials:
            self.assertIn(material, result["material_costs"])
            material_data = result["material_costs"][material]
            
            # Check material cost structure
            self.assertIn("base_quantity", material_data)
            self.assertIn("waste_factor", material_data)
            self.assertIn("adjusted_quantity", material_data)
            self.assertIn("unit_price", material_data)
            self.assertIn("total_cost", material_data)
            self.assertIn("unit", material_data)
            
            # Validate calculations (with tolerance for rounding)
            expected_adjusted_qty = material_data["base_quantity"] * (1 + material_data["waste_factor"])
            self.assertAlmostEqual(
                material_data["adjusted_quantity"], 
                expected_adjusted_qty,
                delta=expected_adjusted_qty * 0.01  # Allow 1% difference
            )
            
            expected_material_cost = material_data["adjusted_quantity"] * material_data["unit_price"]
            self.assertAlmostEqual(
                material_data["total_cost"], 
                expected_material_cost,
                delta=expected_material_cost * 0.01  # Allow 1% difference
            )
            
        # Validate labor costs
        for labor_type in selected_labor_types:
            self.assertIn(labor_type, result["labor_costs"])
            labor_data = result["labor_costs"][labor_type]
            
            # Check labor cost structure
            self.assertIn("rate_per_sqft", labor_data)
            self.assertIn("effective_rate", labor_data)
            self.assertIn("productivity_factor", labor_data)
            self.assertIn("total_cost", labor_data)
            self.assertIn("area", labor_data)
            self.assertIn("location", labor_data)
            self.assertIn("skill_level", labor_data)
            
            # Validate calculations (with tolerance for rounding)
            expected_labor_cost = labor_data["effective_rate"] * labor_data["area"]
            self.assertAlmostEqual(
                labor_data["total_cost"], 
                expected_labor_cost,
                delta=expected_labor_cost * 0.01  # Allow 1% difference
            )
            
        # Validate breakdown
        breakdown = result["breakdown"]
        self.assertIn("materials_subtotal", breakdown)
        self.assertIn("labor_subtotal", breakdown)
        self.assertIn("transportation_subtotal", breakdown)
        self.assertIn("additional_costs_subtotal", breakdown)
        self.assertIn("quality_level", breakdown)
        self.assertIn("quality_multiplier", breakdown)
        self.assertIn("overhead_profit", breakdown)
        self.assertIn("overhead_rate", breakdown)
        self.assertIn("area", breakdown)
        self.assertIn("location", breakdown)
        self.assertIn("cost_per_sqft", breakdown)
        self.assertIn("estimated_timeline_months", breakdown)
        
        # Validate project details
        self.assertIn("project_details", breakdown)
        project_details = breakdown["project_details"]
        self.assertEqual(project_details["project_type"], payload["project_type"])
        self.assertEqual(project_details["foundation_type"], payload["foundation_type"])
        self.assertEqual(project_details["roof_type"], payload["roof_type"])
        self.assertEqual(project_details["wall_type"], payload["wall_type"])
        self.assertEqual(project_details["building_height"], payload["building_height"])
        self.assertEqual(project_details["electrical_complexity"], payload["electrical_complexity"])
        self.assertEqual(project_details["plumbing_complexity"], payload["plumbing_complexity"])
        self.assertEqual(project_details["parking_spaces"], payload["parking_spaces"])
        self.assertEqual(project_details["garden_area"], payload["garden_area"])
        
        # Validate transportation costs (if included)
        if payload["include_transportation"]:
            self.assertIn("transportation_costs", breakdown)
            self.assertGreater(breakdown["transportation_subtotal"], 0)
            
            transportation_costs = breakdown["transportation_costs"]
            self.assertGreater(len(transportation_costs), 0)
            
            # Check transportation cost structure for each type
            for transport_type, transport_data in transportation_costs.items():
                self.assertIn("rate_per_sqft", transport_data)
                self.assertIn("total_cost", transport_data)
                self.assertIn("area", transport_data)
                self.assertIn("location", transport_data)
                
                # Validate calculations (with tolerance for rounding)
                expected_transport_cost = transport_data["rate_per_sqft"] * transport_data["area"]
                self.assertAlmostEqual(
                    transport_data["total_cost"], 
                    expected_transport_cost,
                    delta=expected_transport_cost * 0.01  # Allow 1% difference
                )
        
        # Validate additional costs (if permits included)
        if payload["include_permits"]:
            self.assertIn("additional_costs", breakdown)
            self.assertGreater(breakdown["additional_costs_subtotal"], 0)
            
            additional_costs = breakdown["additional_costs"]
            self.assertGreater(len(additional_costs), 0)
            
            # Check additional cost structure for each type
            for cost_type, cost_data in additional_costs.items():
                self.assertIn("rate_per_sqft", cost_data)
                self.assertIn("total_cost", cost_data)
                self.assertIn("area", cost_data)
                self.assertIn("location", cost_data)
                
                # Validate calculations (with tolerance for rounding)
                expected_additional_cost = cost_data["rate_per_sqft"] * cost_data["area"]
                self.assertAlmostEqual(
                    cost_data["total_cost"], 
                    expected_additional_cost,
                    delta=expected_additional_cost * 0.01  # Allow 1% difference
                )
        
        # Validate total cost calculation
        expected_total = (
            breakdown["materials_subtotal"] + 
            breakdown["labor_subtotal"] + 
            breakdown["transportation_subtotal"] + 
            breakdown["additional_costs_subtotal"] + 
            breakdown["overhead_profit"]
        )
        
        print(f"\nTotal cost validation:")
        print(f"  Result total cost: {result['total_cost']}")
        print(f"  Expected total from components: {expected_total}")
        print(f"  Difference: {result['total_cost'] - expected_total}")
        
        # Check that the difference is small (less than 0.1%)
        difference_percentage = abs((result['total_cost'] - expected_total) / result['total_cost']) * 100
        print(f"  Difference percentage: {difference_percentage}%")
        self.assertLess(difference_percentage, 0.1, "Total cost difference is too large")
        
        # Validate cost per sq ft calculation
        expected_cost_per_sqft = result["total_cost"] / payload["area"]
        self.assertAlmostEqual(
            breakdown["cost_per_sqft"], 
            expected_cost_per_sqft, 
            delta=expected_cost_per_sqft * 0.01  # Allow 1% difference
        )
        
        # Test with different parameters to verify changes in costs
        print("\n--- Testing with different parameters for comparison ---")
        
        # Change to standard quality and slab foundation
        comparison_payload = payload.copy()
        comparison_payload["quality_level"] = "standard"
        comparison_payload["foundation_type"] = "slab"
        comparison_payload["electrical_complexity"] = "basic"
        comparison_payload["plumbing_complexity"] = "basic"
        
        comparison_response = requests.post(
            f"{API_BASE_URL}/calculator/estimate", 
            json=comparison_payload
        )
        self.assertEqual(comparison_response.status_code, 200)
        comparison_result = comparison_response.json()
        
        print(f"Standard quality total cost: {comparison_result['total_cost']}")
        print(f"Premium quality total cost: {result['total_cost']}")
        
        # Premium should be more expensive than standard
        self.assertGreater(result["total_cost"], comparison_result["total_cost"])
        
        # Foundation type should affect cost
        self.assertGreater(
            result["breakdown"]["materials_subtotal"], 
            comparison_result["breakdown"]["materials_subtotal"]
        )
        
        # Electrical complexity should affect labor costs
        premium_electrical_cost = 0
        standard_electrical_cost = 0
        
        if "electrical" in result["labor_costs"] and "electrical" in comparison_result["labor_costs"]:
            premium_electrical_cost = result["labor_costs"]["electrical"]["total_cost"]
            standard_electrical_cost = comparison_result["labor_costs"]["electrical"]["total_cost"]
            self.assertGreater(premium_electrical_cost, standard_electrical_cost)
            
        print(f"Smart home electrical cost: {premium_electrical_cost}")
        print(f"Basic electrical cost: {standard_electrical_cost}")
        
        # Plumbing complexity should affect labor costs
        premium_plumbing_cost = 0
        standard_plumbing_cost = 0
        
        if "plumbing" in result["labor_costs"] and "plumbing" in comparison_result["labor_costs"]:
            premium_plumbing_cost = result["labor_costs"]["plumbing"]["total_cost"]
            standard_plumbing_cost = comparison_result["labor_costs"]["plumbing"]["total_cost"]
            self.assertGreater(premium_plumbing_cost, standard_plumbing_cost)
            
        print(f"Luxury plumbing cost: {premium_plumbing_cost}")
        print(f"Basic plumbing cost: {standard_plumbing_cost}")
        
        print("\n--- Enhanced calculator estimate test completed successfully ---")


if __name__ == "__main__":
    unittest.main()