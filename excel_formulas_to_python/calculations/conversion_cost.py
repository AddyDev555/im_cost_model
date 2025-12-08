def production_calculations(
    annual_volume,
    mould_cavitation,
    mould_cycle_time_sec,
    available_hours_year,
    setups_per_year,
    rampups_per_year,
    setup_time_min=180,          # Default: 180 minutes per setup
    rampup_time_min=180,         # Default: 180 minutes per ramp-up
    efficiency_pct=75            # Capacity required uses 75% default
):
    
    # Convert efficiency percentage to decimal
    efficiency = efficiency_pct / 100

    # 1. Capacity Required
    capacity_required = annual_volume / efficiency

    # 2. Output per hour  (correct formula)
    # Output per hour = (3600 / cycle time) * cavitation
    output_per_hour = (3600 / mould_cycle_time_sec) * mould_cavitation

    # 3. Output per year
    output_per_year = output_per_hour * available_hours_year

    # 4. Hours Required for Setup (converted to hours)
    hours_setup = (setups_per_year * setup_time_min) / 60

    # 5. Hours Required for Ramp-up (converted to hours)
    hours_rampup = (rampups_per_year * rampup_time_min) / 60

    # 6. Hours Required for Production
    hours_required_production = capacity_required / output_per_hour

    # 7. Machines Required
    machines_required = capacity_required / output_per_year

    # 8. Capacity Utilized
    capacity_utilized = (annual_volume / output_per_year) * 4

    # 9. Actual Production Hours / Annum
    actual_hours_per_annum = annual_volume / output_per_hour

    # 10. Production Hours Allocated (Available hours / 3 machines)
    production_hours_allocated = available_hours_year / 3

    return {
        "Capacity Required": capacity_required,
        "Output per Hour": output_per_hour,
        "Output per Year": output_per_year,
        "Hours Required for Setup": hours_setup,
        "Hours Required for Ramp-up": hours_rampup,
        "Hours Required for Production": hours_required_production,
        "Machines Required": machines_required,
        "Capacity Utilized": capacity_utilized,
        "Actual Production Hours per Annum": actual_hours_per_annum,
        "Production Hours Allocated": production_hours_allocated
    }