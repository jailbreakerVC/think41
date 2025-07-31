from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DB_PATH = "tutorial.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/products", methods=["GET"])
def get_all_products():
    conn = get_db_connection()
    products = conn.execute("SELECT * FROM products limit 10").fetchall()
    conn.close()
    return jsonify([dict(p) for p in products]),200

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    conn = get_db_connection()
    product = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    conn.close()
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(dict(product))

if __name__ == "__main__":
    app.run(debug=True)
