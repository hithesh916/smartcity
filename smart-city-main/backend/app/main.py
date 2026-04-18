from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import geo, auth, data, analytics
from app.db.session import engine, Base
from app.db import models # Import models to register them

app = FastAPI(title="Smart City API", version="1.0.3") # Bump again

# CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Create Tables
@app.on_event("startup")
def on_startup():
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Smart City Backend is Running", "status": "active"}

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(geo.router, prefix="/api/geocode", tags=["Geo"])
app.include_router(data.router, prefix="/api/data", tags=["Data"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
from app.api import traffic, probe
app.include_router(traffic.router, prefix="/api/data/traffic", tags=["Traffic"])
app.include_router(probe.router, prefix="/api/probe", tags=["Probe"])
