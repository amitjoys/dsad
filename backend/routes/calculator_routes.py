from fastapi import APIRouter, HTTPException
from typing import List
from models import CalculatorRequest, CalculatorResult
from database import calculations_collection
from cost_calculator import (
    scrape_material_prices,
    calculate_granular_material_quantities,
    calculate_labor_costs,
    calculate_transportation_costs,
    calculate_additional_costs
)

router = APIRouter()

@router.post("/estimate", response_model=CalculatorResult)
async def calculate_construction_cost(request: CalculatorRequest):
    """Enhanced construction cost calculation with comprehensive cost breakdown"""
    try:
        # Import the optimization function
        from cost_calculator import optimize_material_selection
        
        # Optimize material selection to avoid duplicates and unrealistic quantities
        optimized_materials = await optimize_material_selection(request.materials, request.area)
        
        # Get enhanced material prices
        material_prices = await scrape_material_prices(request.location, request.materials)
        
        # Get granular material quantities using optimized materials
        material_quantities = await calculate_granular_material_quantities(
            request.area, request.model_dump(), request.materials
        )
        
        # Calculate enhanced labor costs
        labor_costs = await calculate_labor_costs(
            request.location, request.labor_types, request.area, request.model_dump()
        )
        
        # Calculate transportation costs
        transportation_costs = await calculate_transportation_costs(
            request.location, request.area, request.materials, request.model_dump()
        ) if request.include_transportation else {}
        
        # Calculate additional costs (permits, inspections, etc.)
        additional_costs = await calculate_additional_costs(
            request.location, request.area, request.model_dump()
        )
        
        # Calculate total material costs with enhanced quantities
        total_material_cost = 0
        material_breakdown = {}
        
        for material, price_info in material_prices.items():
            # Get enhanced quantity calculation
            if material in material_quantities:
                quantity = material_quantities[material]["total_quantity"]
                breakdown_info = material_quantities[material]["breakdown"]
            else:
                # Fallback to REALISTIC basic calculation - OPTIMIZED QUANTITIES
                quantity = request.area * 0.5  # Reduced default multiplier
                if material.lower() in ["cement"]:
                    quantity = request.area * 0.4  # Reduced from 0.8 to 0.4 bags per sq ft
                elif material.lower() in ["steel"]:
                    quantity = request.area * 3.5  # Reduced from 8 to 3.5 kg per sq ft
                elif material.lower() in ["bricks"]:
                    quantity = request.area * 35   # Reduced from 55 to 35 pieces per sq ft
                elif material.lower() in ["sand", "aggregate"]:
                    quantity = request.area * 0.8  # Reduced from 1.2 to 0.8 cft per sq ft
                elif material.lower() in ["tiles", "marble", "granite"]:
                    quantity = request.area * 1.1  # Keep same - reasonable for flooring
                elif material.lower() in ["paint"]:
                    quantity = request.area * 0.08  # Reduced from 0.15 to 0.08 litre per sq ft
                
                breakdown_info = {"standard": quantity}
            
            # Apply waste factor
            waste_factor = price_info.get("waste_factor", 0.05)
            adjusted_quantity = quantity * (1 + waste_factor)
            
            material_cost = adjusted_quantity * price_info["price"]
            total_material_cost += material_cost
            
            material_breakdown[material] = {
                "base_quantity": round(quantity, 2),
                "waste_factor": waste_factor,
                "adjusted_quantity": round(adjusted_quantity, 2),
                "unit_price": price_info["price"],
                "total_cost": round(material_cost, 2),
                "unit": price_info["unit"],
                "breakdown": breakdown_info if material in material_quantities else {}
            }
        
        # Calculate total labor costs
        total_labor_cost = sum(labor["total_cost"] for labor in labor_costs.values())
        
        # Calculate total transportation costs
        total_transportation_cost = sum(transport["total_cost"] for transport in transportation_costs.values())
        
        # Calculate total additional costs
        total_additional_cost = sum(additional["total_cost"] for additional in additional_costs.values())
        
        # Quality level adjustments
        quality_multipliers = {
            "standard": 1.0,
            "premium": 1.4,
            "luxury": 1.8
        }
        
        quality_multiplier = quality_multipliers.get(request.quality_level, 1.0)
        
        # Calculate subtotals
        adjusted_material_cost = total_material_cost * quality_multiplier
        adjusted_labor_cost = total_labor_cost * quality_multiplier
        
        # Calculate base total (before overhead)
        base_total = (adjusted_material_cost + adjusted_labor_cost + 
                     total_transportation_cost + total_additional_cost)
        
        # Add overhead and profit (8% realistic margin for competitive pricing)
        overhead_profit_rate = 0.08
        overhead_profit = base_total * overhead_profit_rate
        
        # Final total
        final_total = base_total + overhead_profit
        
        # Calculate cost per sq ft
        cost_per_sqft = final_total / request.area
        
        # Estimate timeline (in months)
        timeline_months = max(2, round(request.area / 1000 * 3))
        if request.building_height > 1:
            timeline_months += request.building_height - 1
        
        result = CalculatorResult(
            total_cost=round(final_total, 2),
            material_costs=material_breakdown,
            labor_costs=labor_costs,
            breakdown={
                "materials_subtotal": round(adjusted_material_cost, 2),
                "labor_subtotal": round(adjusted_labor_cost, 2),
                "transportation_subtotal": round(total_transportation_cost, 2),
                "additional_costs_subtotal": round(total_additional_cost, 2),
                "quality_level": request.quality_level,
                "quality_multiplier": quality_multiplier,
                "overhead_profit": round(overhead_profit, 2),
                "overhead_rate": overhead_profit_rate,
                "area": request.area,
                "location": request.location,
                "cost_per_sqft": round(cost_per_sqft, 2),
                "estimated_timeline_months": timeline_months,
                "project_details": {
                    "project_type": request.project_type,
                    "foundation_type": request.foundation_type,
                    "roof_type": request.roof_type,
                    "wall_type": request.wall_type,
                    "building_height": request.building_height,
                    "electrical_complexity": request.electrical_complexity,
                    "plumbing_complexity": request.plumbing_complexity,
                    "parking_spaces": request.parking_spaces,
                    "garden_area": request.garden_area
                },
                "transportation_costs": transportation_costs,
                "additional_costs": additional_costs
            },
            location=request.location
        )
        
        # Save calculation to database
        result_dict = result.model_dump()
        await calculations_collection.insert_one(result_dict)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating costs: {str(e)}")

@router.get("/materials", response_model=List[str])
async def get_available_materials():
    """Get comprehensive list of available materials"""
    materials = [
        # Basic Construction Materials
        "cement", "steel", "bricks", "sand", "aggregate", "concrete_blocks",
        
        # Flooring Materials
        "tiles", "marble", "granite", "ceramic_tiles", "vitrified_tiles",
        
        # Finishing Materials
        "paint", "putty", "primer",
        
        # Structural Materials
        "wood", "glass", "aluminum", "ms_sections",
        
        # Electrical Materials
        "electrical_wire", "electrical_fittings", "switches_sockets", "mcb_db",
        
        # Plumbing Materials
        "pvc_pipes", "cp_fittings", "sanitary_ware", "water_tank",
        
        # Roofing Materials
        "roofing_tiles", "waterproofing", "insulation",
        
        # Others
        "hardware", "adhesives"
    ]
    return materials

@router.get("/labor-types", response_model=List[str])
async def get_labor_types():
    """Get comprehensive list of available labor types"""
    labor_types = [
        "mason", "electrical", "plumbing", "painting", "tiling", "carpenter", 
        "interior", "foundation", "roofing", "waterproofing", "grills", 
        "glass_doors", "windows", "false_ceiling", "aluminum_work", "steel_work",
        "excavation", "concrete_work", "plastering", "flooring", "finishing",
        "hvac", "landscaping"
    ]
    return labor_types

@router.get("/locations", response_model=List[str])
async def get_supported_locations():
    """Get comprehensive list of supported locations"""
    locations = [
        "Mumbai", "Pune", "Bangalore", "Delhi", "Noida", "Gurgaon", "Hyderabad", 
        "Chennai", "Kolkata", "Ahmedabad", "Surat", "Lucknow", "Kanpur", "Nagpur",
        "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri Chinchwad", "Patna",
        "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
        "Rajkot", "Kalyan Dombivli", "Vasai Virar", "Varanasi", "Srinagar", "Aurangabad",
        "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", "Ranchi", "Gwalior",
        "Jabalpur", "Coimbatore"
    ]
    return locations