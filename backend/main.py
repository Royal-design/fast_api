from fastapi import FastAPI

from models import Product


app = FastAPI()

@app.get("/")
def greet():
    return "Welcome to FastAPI"

products = [
    Product(id=1, name="Product 1", description="Product 1 description", price=100, quantity=10),
    Product(id=2, name="Product 2", description="Product 2 description", price=200, quantity=20),
    Product(id=3, name="Product 3", description="Product 3 description", price=300, quantity=30),
    Product(id=4, name="Product 4", description="Product 4 description", price=400, quantity=40),
    Product(id=5, name="Product 5", description="Product 5 description", price=500, quantity=50),
]

@app.get("/products")
def get_all_products():
    return products

@app.get("/products/{id}")
def get_product_by_id(id: int):
    for product in products:
        if product.id == id:
            return product
    return "Product not found"

@app.post("/product")
def create_product(product: Product):
    products.append(product)
    return product

@app.put("/products/{id}")
def update_product(id: int, updated_product: Product):
    for i, product in enumerate(products):
        if product.id == id:
            products[i] = updated_product
            return updated_product
    return "Product not found"

@app.delete("/products/{id}")
def delete_product(id: int):
    for i, product in enumerate(products):
        if product.id == id:
            del products[i]
            return "Product deleted"
    return "Product not found"

