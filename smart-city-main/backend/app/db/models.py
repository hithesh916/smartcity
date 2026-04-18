from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, TypeDecorator
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.db.session import Base

# Custom Type for Coordinates if PostGIS fails (fallback)
class Coordinates(TypeDecorator):
    impl = String
    def process_bind_param(self, value, dialect):
        return f"{value[0]},{value[1]}" if value else None
    def process_result_value(self, value, dialect):
        if value:
            lat, lng = map(float, value.split(","))
            return [lat, lng]
        return None

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # 'admin' or 'user'

class Place(Base):
    __tablename__ = "places"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # hospital, police, etc.
    latitude = Column(Float)
    longitude = Column(Float)
    details = Column(String, nullable=True) # JSON stored as string for simplicity

class AirQuality(Base):
    __tablename__ = "air_quality"
    id = Column(Integer, primary_key=True, index=True)
    area_name = Column(String)
    aqi = Column(Integer)
    pm25 = Column(Float)
    pm10 = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class WaterQuality(Base):
    __tablename__ = "water_quality"
    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String)
    wqi = Column(Float)
    ph = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
