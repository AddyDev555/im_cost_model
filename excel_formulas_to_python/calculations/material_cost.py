def material_cost_per_piece(
    weight_g,
    shot1_ratio_pct, shot1_poly_rate,
    shot1_mb_dosage_pct, shot1_mb_rate,
    shot1_add_dosage_pct, shot1_add_rate,
    shot2_ratio_pct=0, shot2_poly_rate=0,
    shot2_mb_dosage_pct=0, shot2_mb_rate=0,
    shot2_add_dosage_pct=0, shot2_add_rate=0,
    regrind_ratio_pct=0, regrind_rate=0,
    waste_rate_pct=0, label_cost_per_piece=0
):
    W = weight_g / 1000.0  # converting g to kg per piece

    # Shot 2 calculations
    s2_resin = W * (shot2_ratio_pct/100) * shot2_poly_rate
    s2_mb    = W * (shot2_mb_dosage_pct/100) * shot2_mb_rate
    s2_add   = W * (shot2_add_dosage_pct/100) * shot2_add_rate

    # Regrind cost: here assumed to replace polymer portion of shot2
    regrind = W * (shot2_ratio_pct/100) * (regrind_ratio_pct/100) * regrind_rate

    resin_cost_inr = W * (shot1_ratio_pct/100) * shot1_poly_rate 
    resin_cost_eur = resin_cost_inr / 101.7
    resin_cost_per = resin_cost_inr % 100
    
    mb_cost_inr    = W * (shot1_mb_dosage_pct/100) * shot1_mb_rate
    mb_cost_eur = mb_cost_inr / 101.7
    mb_cost_per = mb_cost_inr % 100
    
    add_cost_inr   = W * (shot1_add_dosage_pct/100) * shot1_add_rate
    add_cost_eur = add_cost_inr / 101.7
    add_cost_per = add_cost_inr % 100
    
    # Subtotal and total calculations
    subtotal = resin_cost_inr + mb_cost_inr + add_cost_inr + s2_resin + s2_mb + s2_add + regrind
    wastage = subtotal * (waste_rate_pct/100)
    
    material_cost_inr = (subtotal + wastage + label_cost_per_piece) * 1000
    material_cost_eur = material_cost_inr / 101.7
    material_cost_per = material_cost_inr % 100

    return (
        {
        'resin_cost': resin_cost_inr,
        'resin_cost_eur': resin_cost_eur,
        'resin_cost_per': resin_cost_per,
        'mb_cost': mb_cost_inr,
        'mb_cost_eur': mb_cost_eur,
        'mb_cost_per': mb_cost_per,
        'add_cost': add_cost_inr,
        'add_cost_eur': add_cost_eur,
        'add_cost_per': add_cost_per,
        'material_cost': material_cost_inr,
        'material_cost_eur': material_cost_eur,
        'material_cost_per': material_cost_per
        }
    )