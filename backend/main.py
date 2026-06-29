import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
import database_models
from models import Product
from sqlalchemy.orm import Session


app = FastAPI()


def get_allowed_origins() -> list[str]:
    origins = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def init_db():
    db = SessionLocal()
    count = db.query(database_models.Product).count()

    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))

        db.commit()
    db.close()

init_db()

@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).all()
    return db_products

@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        return db_product
    return "Product not found"

@app.post("/product")
def create_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**product.model_dump()))
    db.commit()
    return product

@app.put("/products/{id}")
# without db
# def update_product(id: int, updated_product: Product):
#     for i, product in enumerate(products):
#         if product.id == id:
#             products[i] = updated_product
#             return updated_product
#     return "Product not found"

# with db
def update_product(id: int, updated_product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db.query(database_models.Product).filter(database_models.Product.id == id).update(updated_product.model_dump())
        db.commit()
        return updated_product
    return "Product not found"

@app.delete("/products/{id}")
# def delete_product(id: int):
#     for i, product in enumerate(products):
#         if product.id == id:
#             del products[i]
#             return "Product deleted"
#     return "Product not found"

def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product deleted"
    return "Product not found"
