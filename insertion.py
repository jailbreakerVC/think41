import sqlite3
import pandas as pd

# Load CSV
csv_file = "products.csv"  # Ensure this is in the same folder as this script
df = pd.read_csv(csv_file)

# Connect to SQLite DB (it will create if it doesn't exist)
conn = sqlite3.connect("tutorial.db")
cursor = conn.cursor()

# Insert data
for _, row in df.iterrows():
    cursor.execute("""
    INSERT OR IGNORE INTO products (
        id, cost, category, name, brand,
        retail_price, department, sku, distribution_center_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        int(row["id"]),
        float(row["cost"]),
        row["category"],
        row["name"],
        row["brand"],
        float(row["retail_price"]),
        row["department"],
        row["sku"],
        int(row["distribution_center_id"])
    ))

# Commit and close
conn.commit()
conn.close()

print("Data imported successfully.")
