from typing import List
import asyncio

async def optimize_material_selection(materials: List[str], area: float):
    """Optimize material selection to handle overlaps and realistic usage"""
    optimized = {}
    
    # Material categories and their priorities (higher number = higher priority)
    material_categories = {
        # Flooring materials (mutually exclusive)
        "flooring": {
            "materials": ["tiles", "marble", "granite", "ceramic_tiles", "vitrified_tiles"],
            "max_usage": area * 1.1,  # Only need flooring for the area + waste
            "priority": {"marble": 3, "granite": 2, "vitrified_tiles": 2, "tiles": 1, "ceramic_tiles": 1}
        },
        # Wall materials (can overlap but with limits)
        "walls": {
            "materials": ["bricks", "concrete_blocks"],
            "max_usage": area * 0.8,  # Walls don't cover full area
            "priority": {"concrete_blocks": 2, "bricks": 1}
        },
        # Finishing materials (can overlap)
        "finishing": {
            "materials": ["paint", "putty", "primer"],
            "max_usage": area * 2.5,  # Interior + exterior surfaces
            "priority": {"paint": 3, "primer": 2, "putty": 1}
        },
        # Structural materials (essential)
        "structural": {
            "materials": ["cement", "steel", "sand", "aggregate"],
            "max_usage": None,  # No limit, essential materials
            "priority": {"cement": 3, "steel": 3, "sand": 2, "aggregate": 2}
        },
        # Specialty materials (selective usage)
        "specialty": {
            "materials": ["wood", "glass", "aluminum", "ms_sections"],
            "max_usage": area * 0.3,  # Limited usage
            "priority": {"wood": 2, "aluminum": 2, "glass": 1, "ms_sections": 1}
        }
    }
    
    # Base quantities per sq ft for different materials
    base_quantities = {
        "cement": 0.4,
        "steel": 3,
        "bricks": 35,
        "sand": 0.8,
        "aggregate": 0.6,
        "tiles": 1.1,
        "marble": 1.1,
        "granite": 1.1,
        "ceramic_tiles": 1.1,
        "vitrified_tiles": 1.1,
        "paint": 0.08,
        "putty": 0.05,
        "primer": 0.03,
        "wood": 0.2,
        "glass": 0.1,
        "aluminum": 0.15,
        "ms_sections": 0.1,
        "concrete_blocks": 30,
        "electrical_wire": 0.5,
        "electrical_fittings": 0.08,
        "switches_sockets": 0.06,
        "pvc_pipes": 0.3,
        "cp_fittings": 0.01,
        "sanitary_ware": 0.008,
        "roofing_tiles": 1.1,
        "waterproofing": 1.0,
        "insulation": 0.8,
        "hardware": 0.1,
        "adhesives": 0.05
    }
    
    # Process each material
    for material in materials:
        material_lower = material.lower()
        
        # Find which category this material belongs to
        category_info = None
        for cat_name, cat_data in material_categories.items():
            if material_lower in cat_data["materials"]:
                category_info = cat_data
                break
        
        # Calculate base quantity
        base_qty = base_quantities.get(material_lower, 0.5) * area
        
        # Apply category-specific optimization
        if category_info:
            # For flooring materials, only use the highest priority one
            if cat_name == "flooring":
                selected_flooring = max(
                    [m for m in materials if m.lower() in category_info["materials"]], 
                    key=lambda x: category_info["priority"].get(x.lower(), 0)
                )
                if material.lower() != selected_flooring.lower():
                    continue  # Skip non-selected flooring materials
                base_qty = min(base_qty, category_info["max_usage"])
            
            # For other categories, apply max usage limits
            elif category_info["max_usage"]:
                base_qty = min(base_qty, category_info["max_usage"] * 0.5)  # Reduce by 50%
        
        optimized[material] = {
            "quantity": base_qty,
            "category": cat_name if category_info else "other"
        }
    
    return optimized

async def scrape_material_prices(location: str, materials: List[str]):
    """Enhanced material prices with more realistic 2025 pricing"""
    prices = {}
    
    # Updated realistic prices for 2025 (in INR) - OPTIMIZED FOR REALISTIC PRICING
    base_prices = {
        # Basic Materials - FURTHER REDUCED FOR TARGET PRICING
        "cement": {"price": 320, "unit": "per bag (50kg)", "location": location, "waste_factor": 0.05},
        "steel": {"price": 58, "unit": "per kg", "location": location, "waste_factor": 0.03},
        "bricks": {"price": 7, "unit": "per piece", "location": location, "waste_factor": 0.05},
        "sand": {"price": 25, "unit": "per cft", "location": location, "waste_factor": 0.10},
        "aggregate": {"price": 28, "unit": "per cft", "location": location, "waste_factor": 0.08},
        "concrete_blocks": {"price": 18, "unit": "per piece", "location": location, "waste_factor": 0.03},
        
        # Flooring Materials - FURTHER REDUCED FOR TARGET PRICING
        "tiles": {"price": 35, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "marble": {"price": 100, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "granite": {"price": 80, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "ceramic_tiles": {"price": 22, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "vitrified_tiles": {"price": 50, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        
        # Finishing Materials - REDUCED PRICES
        "paint": {"price": 140, "unit": "per litre", "location": location, "waste_factor": 0.05},
        "putty": {"price": 18, "unit": "per kg", "location": location, "waste_factor": 0.08},
        "primer": {"price": 120, "unit": "per litre", "location": location, "waste_factor": 0.05},
        
        # Structural Materials - REDUCED PRICES
        "wood": {"price": 50, "unit": "per sq ft", "location": location, "waste_factor": 0.15},
        "glass": {"price": 85, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        "aluminum": {"price": 180, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "ms_sections": {"price": 70, "unit": "per kg", "location": location, "waste_factor": 0.05},
        
        # Electrical Materials - REDUCED PRICES
        "electrical_wire": {"price": 35, "unit": "per meter", "location": location, "waste_factor": 0.10},
        "electrical_fittings": {"price": 150, "unit": "per point", "location": location, "waste_factor": 0.05},
        "switches_sockets": {"price": 120, "unit": "per point", "location": location, "waste_factor": 0.02},
        "mcb_db": {"price": 2000, "unit": "per unit", "location": location, "waste_factor": 0.00},
        
        # Plumbing Materials - REDUCED PRICES
        "pvc_pipes": {"price": 65, "unit": "per meter", "location": location, "waste_factor": 0.10},
        "cp_fittings": {"price": 2500, "unit": "per set", "location": location, "waste_factor": 0.05},
        "sanitary_ware": {"price": 6000, "unit": "per set", "location": location, "waste_factor": 0.02},
        "water_tank": {"price": 8000, "unit": "per unit", "location": location, "waste_factor": 0.00},
        
        # Roofing Materials - REDUCED PRICES
        "roofing_tiles": {"price": 35, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "waterproofing": {"price": 28, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "insulation": {"price": 18, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        
        # Others - REDUCED PRICES
        "hardware": {"price": 100, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        "adhesives": {"price": 18, "unit": "per sq ft", "location": location, "waste_factor": 0.10}
    }
    
    # Enhanced location-based price adjustments (2025 realistic multipliers)
    location_multipliers = {
        "mumbai": 1.45,
        "pune": 1.0,
        "bangalore": 1.15,
        "delhi": 1.35,
        "noida": 1.30,
        "gurgaon": 1.40,
        "hyderabad": 0.95,
        "chennai": 1.05,
        "kolkata": 0.85,
        "ahmedabad": 0.90,
        "surat": 0.88,
        "lucknow": 0.85,
        "kanpur": 0.82,
        "nagpur": 0.90,
        "indore": 0.88,
        "thane": 1.35,
        "bhopal": 0.85,
        "visakhapatnam": 0.90,
        "pimpri_chinchwad": 0.98,
        "patna": 0.80,
        "vadodara": 0.92,
        "ghaziabad": 1.25,
        "ludhiana": 0.95,
        "agra": 0.85,
        "nashik": 0.95,
        "faridabad": 1.28,
        "meerut": 0.90,
        "rajkot": 0.90,
        "kalyan_dombivli": 1.32,
        "vasai_virar": 1.30,
        "varanasi": 0.82,
        "srinagar": 0.95,
        "aurangabad": 0.88,
        "dhanbad": 0.85,
        "amritsar": 0.90,
        "navi_mumbai": 1.38,
        "allahabad": 0.80,
        "howrah": 0.88,
        "ranchi": 0.88,
        "gwalior": 0.85,
        "jabalpur": 0.82,
        "coimbatore": 0.95
    }
    
    multiplier = location_multipliers.get(location.lower(), 1.0)
    
    for material in materials:
        if material.lower() in base_prices:
            price_info = base_prices[material.lower()].copy()
            price_info["price"] = round(price_info["price"] * multiplier, 2)
            prices[material] = price_info
    
    return prices

async def calculate_labor_costs(location: str, labor_types: List[str], area: float, project_details: dict):
    """Enhanced labor cost calculation with realistic 2025 rates"""
    labor_costs = {}
    
    # Updated realistic labor rates per sq ft (2025 pricing) - OPTIMIZED FOR REAL-WORLD COSTS
    base_rates = {
        "mason": {"rate": 20, "productivity": 1.0, "skill_level": "skilled"},
        "electrical": {"rate": 30, "productivity": 0.8, "skill_level": "skilled"},
        "plumbing": {"rate": 25, "productivity": 0.9, "skill_level": "skilled"},
        "painting": {"rate": 12, "productivity": 1.2, "skill_level": "semi_skilled"},
        "tiling": {"rate": 18, "productivity": 1.0, "skill_level": "skilled"},
        "carpenter": {"rate": 35, "productivity": 0.7, "skill_level": "skilled"},
        "interior": {"rate": 40, "productivity": 0.6, "skill_level": "skilled"},
        "foundation": {"rate": 28, "productivity": 0.8, "skill_level": "skilled"},
        "roofing": {"rate": 20, "productivity": 0.9, "skill_level": "skilled"},
        "waterproofing": {"rate": 15, "productivity": 1.1, "skill_level": "skilled"},
        "grills": {"rate": 150, "productivity": 0.5, "skill_level": "skilled"},
        "glass_doors": {"rate": 200, "productivity": 0.4, "skill_level": "skilled"},
        "windows": {"rate": 180, "productivity": 0.5, "skill_level": "skilled"},
        "false_ceiling": {"rate": 28, "productivity": 0.8, "skill_level": "skilled"},
        "aluminum_work": {"rate": 120, "productivity": 0.6, "skill_level": "skilled"},
        "steel_work": {"rate": 55, "productivity": 0.7, "skill_level": "skilled"},
        "excavation": {"rate": 10, "productivity": 1.5, "skill_level": "unskilled"},
        "concrete_work": {"rate": 25, "productivity": 0.9, "skill_level": "skilled"},
        "plastering": {"rate": 12, "productivity": 1.3, "skill_level": "semi_skilled"},
        "flooring": {"rate": 20, "productivity": 1.0, "skill_level": "skilled"},
        "finishing": {"rate": 15, "productivity": 1.1, "skill_level": "semi_skilled"},
        "hvac": {"rate": 35, "productivity": 0.7, "skill_level": "skilled"},
        "landscaping": {"rate": 20, "productivity": 0.8, "skill_level": "skilled"}
    }
    
    # Enhanced location-based multipliers (2025 realistic rates)
    location_multipliers = {
        "mumbai": 1.55,
        "pune": 1.0,
        "bangalore": 1.25,
        "delhi": 1.45,
        "noida": 1.35,
        "gurgaon": 1.50,
        "hyderabad": 0.95,
        "chennai": 1.10,
        "kolkata": 0.85,
        "ahmedabad": 0.90,
        "surat": 0.88,
        "lucknow": 0.85,
        "kanpur": 0.80,
        "nagpur": 0.90,
        "indore": 0.88,
        "thane": 1.45,
        "bhopal": 0.85,
        "visakhapatnam": 0.90,
        "pimpri_chinchwad": 0.98,
        "patna": 0.78,
        "vadodara": 0.92,
        "ghaziabad": 1.30,
        "ludhiana": 0.95,
        "agra": 0.83,
        "nashik": 0.95,
        "faridabad": 1.32,
        "meerut": 0.88,
        "rajkot": 0.88,
        "kalyan_dombivli": 1.40,
        "vasai_virar": 1.35,
        "varanasi": 0.80,
        "srinagar": 0.95,
        "aurangabad": 0.88,
        "dhanbad": 0.83,
        "amritsar": 0.90,
        "navi_mumbai": 1.48,
        "allahabad": 0.78,
        "howrah": 0.85,
        "ranchi": 0.85,
        "gwalior": 0.83,
        "jabalpur": 0.80,
        "coimbatore": 0.95
    }
    
    # Project complexity multipliers
    complexity_multipliers = {
        "foundation_type": {
            "slab": 1.0,
            "basement": 1.4,
            "crawl_space": 1.2
        },
        "building_height": {
            1: 1.0,
            2: 1.2,
            3: 1.4,
            4: 1.6
        },
        "electrical_complexity": {
            "basic": 1.0,
            "advanced": 1.3,
            "smart_home": 1.8
        },
        "plumbing_complexity": {
            "basic": 1.0,
            "premium": 1.4,
            "luxury": 1.8
        }
    }
    
    multiplier = location_multipliers.get(location.lower(), 1.0)
    
    # Height multiplier
    height_multiplier = complexity_multipliers["building_height"].get(project_details.get("building_height", 1), 1.0)
    
    for labor_type in labor_types:
        if labor_type.lower() in base_rates:
            labor_info = base_rates[labor_type.lower()]
            base_rate = labor_info["rate"]
            productivity = labor_info["productivity"]
            
            # Apply location multiplier
            adjusted_rate = base_rate * multiplier
            
            # Apply complexity multipliers based on labor type
            if labor_type.lower() == "electrical":
                complexity_mult = complexity_multipliers["electrical_complexity"].get(
                    project_details.get("electrical_complexity", "basic"), 1.0
                )
                adjusted_rate *= complexity_mult
            elif labor_type.lower() == "plumbing":
                complexity_mult = complexity_multipliers["plumbing_complexity"].get(
                    project_details.get("plumbing_complexity", "basic"), 1.0
                )
                adjusted_rate *= complexity_mult
            elif labor_type.lower() == "foundation":
                complexity_mult = complexity_multipliers["foundation_type"].get(
                    project_details.get("foundation_type", "slab"), 1.0
                )
                adjusted_rate *= complexity_mult
            
            # Apply height multiplier
            adjusted_rate *= height_multiplier
            
            # Apply productivity factor
            effective_rate = adjusted_rate / productivity
            
            # Calculate total cost
            total_cost = effective_rate * area
            
            labor_costs[labor_type] = {
                "rate_per_sqft": round(adjusted_rate, 2),
                "effective_rate": round(effective_rate, 2),
                "productivity_factor": productivity,
                "total_cost": round(total_cost, 2),
                "area": area,
                "location": location,
                "skill_level": labor_info["skill_level"]
            }
    
    return labor_costs

async def calculate_transportation_costs(location: str, area: float, materials: List[str], project_details: dict):
    """Calculate transportation costs for materials and equipment"""
    transportation_costs = {}
    
    # Base transportation rates per sq ft (2025 realistic pricing) - OPTIMIZED FOR REAL-WORLD COSTS
    base_transport_rates = {
        "material_transport": 2,  # per sq ft for all materials
        "equipment_transport": 1,  # per sq ft for equipment
        "labor_transport": 0.5,  # per sq ft for labor transportation
        "waste_disposal": 1  # per sq ft for construction waste disposal
    }
    
    # Distance-based multipliers (assuming city center as base)
    location_transport_multipliers = {
        "mumbai": 1.6,
        "pune": 1.0,
        "bangalore": 1.3,
        "delhi": 1.5,
        "noida": 1.4,
        "gurgaon": 1.5,
        "hyderabad": 1.1,
        "chennai": 1.2,
        "kolkata": 1.0,
        "ahmedabad": 1.0,
        "surat": 0.9,
        "lucknow": 0.9,
        "kanpur": 0.8,
        "nagpur": 0.9,
        "indore": 0.9,
        "thane": 1.5,
        "bhopal": 0.9,
        "visakhapatnam": 1.0,
        "pimpri_chinchwad": 1.0,
        "patna": 0.8,
        "vadodara": 0.9,
        "ghaziabad": 1.3,
        "ludhiana": 1.0,
        "agra": 0.8,
        "nashik": 0.9,
        "faridabad": 1.4,
        "meerut": 0.9,
        "rajkot": 0.9,
        "kalyan_dombivli": 1.4,
        "vasai_virar": 1.4,
        "varanasi": 0.8,
        "srinagar": 1.2,
        "aurangabad": 0.9,
        "dhanbad": 0.8,
        "amritsar": 1.0,
        "navi_mumbai": 1.5,
        "allahabad": 0.8,
        "howrah": 0.9,
        "ranchi": 0.9,
        "gwalior": 0.8,
        "jabalpur": 0.8,
        "coimbatore": 1.0
    }
    
    # Project complexity adjustments
    height_multiplier = 1.0 + (project_details.get("building_height", 1) - 1) * 0.2
    
    multiplier = location_transport_multipliers.get(location.lower(), 1.0)
    
    for transport_type, base_rate in base_transport_rates.items():
        adjusted_rate = base_rate * multiplier * height_multiplier
        total_cost = adjusted_rate * area
        
        transportation_costs[transport_type] = {
            "rate_per_sqft": round(adjusted_rate, 2),
            "total_cost": round(total_cost, 2),
            "area": area,
            "location": location,
            "height_multiplier": height_multiplier
        }
    
    return transportation_costs

async def calculate_additional_costs(location: str, area: float, project_details: dict):
    """Calculate permits, inspections, and other additional costs"""
    additional_costs = {}
    
    # Base rates for additional costs (2025 realistic pricing) - SIGNIFICANTLY REDUCED FOR REAL-WORLD PRICING
    base_additional_rates = {
        "building_permit": 3,
        "plan_approval": 2,
        "structural_approval": 2,
        "electrical_permit": 1,
        "plumbing_permit": 1,
        "fire_safety_approval": 1,
        "environmental_clearance": 1,
        "site_survey": 1,
        "soil_testing": 1,
        "architect_fees": 40,
        "structural_engineer": 25,
        "project_management": 20,
        "insurance": 1,
        "temporary_utilities": 2,
        "safety_equipment": 2,
        "tool_equipment_rental": 3,
        "site_security": 1,
        "quality_inspection": 1,
        "final_inspection": 1,
        "occupancy_certificate": 1,
        "utility_connections": 5,
        "contingency_fund": 10
    }
    
    # Location-based multipliers for additional costs
    location_additional_multipliers = {
        "mumbai": 1.8,
        "pune": 1.0,
        "bangalore": 1.4,
        "delhi": 1.6,
        "noida": 1.5,
        "gurgaon": 1.7,
        "hyderabad": 1.2,
        "chennai": 1.3,
        "kolkata": 1.0,
        "ahmedabad": 1.1,
        "surat": 1.0,
        "lucknow": 0.9,
        "kanpur": 0.8,
        "nagpur": 0.9,
        "indore": 0.9,
        "thane": 1.7,
        "bhopal": 0.9,
        "visakhapatnam": 1.0,
        "pimpri_chinchwad": 1.0,
        "patna": 0.8,
        "vadodara": 1.0,
        "ghaziabad": 1.4,
        "ludhiana": 1.0,
        "agra": 0.8,
        "nashik": 0.9,
        "faridabad": 1.5,
        "meerut": 0.9,
        "rajkot": 0.9,
        "kalyan_dombivli": 1.6,
        "vasai_virar": 1.6,
        "varanasi": 0.8,
        "srinagar": 1.1,
        "aurangabad": 0.9,
        "dhanbad": 0.8,
        "amritsar": 1.0,
        "navi_mumbai": 1.7,
        "allahabad": 0.8,
        "howrah": 0.9,
        "ranchi": 0.9,
        "gwalior": 0.8,
        "jabalpur": 0.8,
        "coimbatore": 1.0
    }
    
    # Project complexity adjustments
    complexity_multiplier = 1.0
    if project_details.get("building_height", 1) > 2:
        complexity_multiplier += 0.3
    if project_details.get("electrical_complexity") == "smart_home":
        complexity_multiplier += 0.2
    if project_details.get("plumbing_complexity") == "luxury":
        complexity_multiplier += 0.15
    
    multiplier = location_additional_multipliers.get(location.lower(), 1.0)
    
    # Filter costs based on project requirements
    required_costs = []
    
    # Always required
    required_costs.extend([
        "building_permit", "plan_approval", "architect_fees", "project_management",
        "insurance", "safety_equipment", "tool_equipment_rental", "quality_inspection",
        "final_inspection", "occupancy_certificate", "contingency_fund"
    ])
    
    # Conditional costs
    if project_details.get("include_permits", True):
        required_costs.extend([
            "structural_approval", "electrical_permit", "plumbing_permit",
            "fire_safety_approval", "environmental_clearance"
        ])
    
    if project_details.get("site_preparation", True):
        required_costs.extend([
            "site_survey", "soil_testing", "temporary_utilities", "site_security"
        ])
    
    if project_details.get("building_height", 1) > 1:
        required_costs.append("structural_engineer")
    
    if area > 5000:  # Large projects
        required_costs.append("utility_connections")
    
    for cost_type in required_costs:
        if cost_type in base_additional_rates:
            base_rate = base_additional_rates[cost_type]
            
            # Fixed fees should not be multiplied by area - calculate as minimum fee
            if cost_type in ["architect_fees", "structural_engineer", "project_management"]:
                # Calculate as percentage of base construction cost or minimum fee
                minimum_fee = base_rate * multiplier * complexity_multiplier
                # Cap the total fee to make it realistic
                if area > 1000:
                    adjusted_rate = minimum_fee / area  # Reduce rate for larger areas
                else:
                    adjusted_rate = minimum_fee / 1000  # Fixed rate for smaller areas
                
                total_cost = adjusted_rate * area
                # Cap maximum fees
                if cost_type == "architect_fees":
                    total_cost = min(total_cost, 150000)  # Cap at 1.5 lakhs
                elif cost_type == "structural_engineer":
                    total_cost = min(total_cost, 75000)   # Cap at 75k
                elif cost_type == "project_management":
                    total_cost = min(total_cost, 100000)  # Cap at 1 lakh
                
                adjusted_rate = total_cost / area
            else:
                adjusted_rate = base_rate * multiplier * complexity_multiplier
                total_cost = adjusted_rate * area
            
            additional_costs[cost_type] = {
                "rate_per_sqft": round(adjusted_rate, 2),
                "total_cost": round(total_cost, 2),
                "area": area,
                "location": location,
                "complexity_multiplier": complexity_multiplier
            }
    
    return additional_costs

async def calculate_granular_material_quantities(area: float, project_details: dict, materials: List[str]):
    """Calculate detailed material quantities based on construction practices"""
    material_quantities = {}
    
    # Detailed quantity calculations per sq ft - OPTIMIZED for realistic consumption
    quantity_calculations = {
        "cement": {
            "foundation": 0.5,
            "walls": 0.3,
            "plastering": 0.1,
            "flooring": 0.2
        },
        "steel": {
            "foundation": 4,
            "structure": 3,
            "reinforcement": 2
        },
        "bricks": {
            "walls": 40,
            "partition": 30
        },
        "sand": {
            "foundation": 0.8,
            "plastering": 0.5,
            "flooring": 0.3
        },
        "aggregate": {
            "foundation": 1.0,
            "concrete": 0.8
        }
    }
    
    # Building height multiplier
    height_multiplier = project_details.get("building_height", 1)
    
    # Foundation type multiplier
    foundation_multipliers = {
        "slab": 1.0,
        "basement": 1.8,
        "crawl_space": 1.3
    }
    foundation_mult = foundation_multipliers.get(project_details.get("foundation_type", "slab"), 1.0)
    
    # Wall type multiplier
    wall_multipliers = {
        "brick": 1.0,
        "concrete": 1.2,
        "wood_frame": 0.6
    }
    wall_mult = wall_multipliers.get(project_details.get("wall_type", "brick"), 1.0)
    
    for material in materials:
        if material.lower() in quantity_calculations:
            quantities = quantity_calculations[material.lower()]
            total_quantity = 0
            
            for component, base_qty in quantities.items():
                component_qty = base_qty * area
                
                # Apply multipliers based on component
                if component in ["foundation"]:
                    component_qty *= foundation_mult
                elif component in ["walls", "partition"]:
                    component_qty *= wall_mult * height_multiplier
                elif component in ["structure", "reinforcement"]:
                    component_qty *= height_multiplier
                
                total_quantity += component_qty
            
            material_quantities[material] = {
                "total_quantity": round(total_quantity, 2),
                "breakdown": {comp: round(qty * area, 2) for comp, qty in quantities.items()},
                "multipliers_applied": {
                    "height": height_multiplier,
                    "foundation": foundation_mult,
                    "wall": wall_mult
                }
            }
    
    return material_quantities