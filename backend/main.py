from fastapi import FastAPI

from model import Product


app = FastAPI()

@app.get("/")
def greet():
    return "Welcome to FastAPI"

products = [
    Product(1, "Product 1", "Product 1 description", 100, 10),
    Product(2, "Product 2", "Product 2 description", 200, 20),
]

@app.get("/products")
def get_all_products():
    return products