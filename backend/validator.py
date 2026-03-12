def validate_loc_file(df):
    errors = []

    # Define required string columns
    required_string_cols = ["CNTRYSCHEME", "OCCTYPE"]

    for index, row in df.iterrows():
        # Check required string columns are not empty
        for col in required_string_cols:
            if col not in row or row[col] is None or str(row[col]).strip() == "":
                errors.append(f"Row {index}: {col} is required and cannot be empty")

        # CNTRYSCHEME must be ISO2A
        if "CNTRYSCHEME" in row and str(row["CNTRYSCHEME"]).strip() != "ISO2A":
            errors.append(f"Row {index}: CNTRYSCHEME must be ISO2A")

        # OCCTYPE must be < 100
        if "OCCTYPE" in row:
            try:
                if float(row["OCCTYPE"]) >= 100:
                    errors.append(f"Row {index}: OCCTYPE must be < 100")
            except:
                errors.append(f"Row {index}: OCCTYPE must be a number")

        # Latitude & Longitude must be numeric
        for coord in ["LATITUDE", "LONGITUDE"]:
            if coord in row:
                try:
                    float(row[coord])
                except:
                    errors.append(f"Row {index}: {coord} must be numeric")

    return errors