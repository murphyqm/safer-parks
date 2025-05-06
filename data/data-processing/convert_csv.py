import csv
import json

def csv_to_geojson(csv_file, geojson_file):
    features = []
    
    with open(csv_file, newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        for i, row in enumerate(reader, start=1):
            coords = json.loads(row['Co-ordinates'])  # Parse coordinates
            
            # Remove 'Co-ordinates' from properties (we're using it as geometry)
            properties = {k: v for k, v in row.items() if k != 'Co-ordinates'}

            # Optionally convert numeric fields to float or int
            for key, value in properties.items():
                try:
                    if '.' in value:
                        properties[key] = float(value)
                    else:
                        properties[key] = int(value)
                except ValueError:
                    pass  # Keep as string if not numeric

            feature = {
                "type": "Feature",
                "properties": properties,
                "geometry": {
                    "type": "Point",
                    "coordinates": coords
                },
                "id": i
            }
            features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(geojson_file, 'w', encoding='utf-8') as outfile:
        json.dump(geojson, outfile, indent=2)

# Example usage
csv_to_geojson("example-parks.csv", "example-parks.geojson")
