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

    # Shot 1 calculations
    s1_resin = W * (shot1_ratio_pct/100) * shot1_poly_rate 
    s1_mb    = W * (shot1_mb_dosage_pct/100) * shot1_mb_rate
    s1_add   = W * (shot1_add_dosage_pct/100) * shot1_add_rate

    # Shot 2 calculations
    s2_resin = W * (shot2_ratio_pct/100) * shot2_poly_rate
    s2_mb    = W * (shot2_mb_dosage_pct/100) * shot2_mb_rate
    s2_add   = W * (shot2_add_dosage_pct/100) * shot2_add_rate

    # Regrind cost: here assumed to replace polymer portion of shot2
    regrind = W * (shot2_ratio_pct/100) * (regrind_ratio_pct/100) * regrind_rate

    # Subtotal and total calculations
    subtotal = s1_resin + s1_mb + s1_add + s2_resin + s2_mb + s2_add + regrind
    wastage = subtotal * (waste_rate_pct/100)
    total_per_piece = subtotal + wastage + label_cost_per_piece # Total Material cost per piece

    return (
        total_per_piece,
        total_per_piece * 1000
    )