# Smart City Data Platform: Project Overview

The **Smart City Data Platform** is a sophisticated, real-time urban management application. It serves as a centralized hub for monitoring, analyzing, and predicting critical environmental factors in a city, such as air and water quality.

---

## 🏗️ Technical Architecture

The project follows a modern, decoupled **Full-Stack Architecture**:

### 1. Frontend (The Dashboard)
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **State Management**: React Hooks & Context API
- **Styling**: [Chakra UI](https://chakra-ui.com/) for a sleek, responsive, and accessible user interface.
- **Data Fetching**: Communicates with the FastAPI backend via RESTful endpoints.
- **Key Features**:
    - Real-time data visualization (charts, maps).
    - Interactive geospatial maps for tracking city landmarks and environmental sensors.
    - Role-based dashboard (Admin vs. User permissions).

### 2. Backend (The Engine)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM (Object Relational Mapping)**: SQLAlchemy
- **Authentication**: JWT-based secure login with password hashing.
- **External Integration**: Fetches live satellite and weather data from the **Open-Meteo API**.
- **Performance**: Leveraging Python's asynchronous capabilities for high-concurrency data handling.

### 3. Data & Machine Learning Layer
- **Database**: SQLite (local dev) / PostgreSQL (production).
- **ML Framework**: Scikit-learn
- **Core Model**: A **Random Forest Classifier** (`model.pkl`) used for predicting climate and air quality risk categories based on live weather data.
- **Sensors Managed**:
    - **AQI (Air Quality Index)**: Tracks PM2.5, PM10, etc.
    - **WQI (Water Quality Index)**: Tracks pH levels and other purity metrics.

---

## 📊 Database Schema

The system persists data across four primary tables:

1.  **`users`**: Manages authentication, user profiles, and roles (`admin`/`user`).
2.  **`places`**: Stores geographical landmarks, hospitals, police stations, and other city infrastructure.
3.  **`air_quality`**: Time-series telemetry tracking area-wise pollution metrics.
4.  **`water_quality`**: Tracks the purity and safety of urban water sources.

---

## 🧠 Core Intelligence & Algorithms

The "Smart" in Smart City comes from three key logic components:

### 1. Climate Risk Prediction (ML)
Uses a **Random Forest** ensemble model to analyze temperature, humidity, rainfall, wind speed, and pressure. It classifies the current environmental state into risk levels (e.g., "Low Risk", "High Risk").

### 2. Live Telemetry Aggregation
The platform doesn't just rely on static data. It dynamically pulls live satellite feeds based on the user's GPS coordinates (bounding box) to provide "up-to-the-minute" precision.

### 3. Geospatial Averaging
Processes large environmental datasets and applies mathematical moving averages to smooth out sensor noise and provide a clear picture of pollution trends in specific city zones.

---

## 📁 Project Structure

```text
smart-city-main/
├── frontend/ (Configuration only)
├── smart-city-main/ (Core Project)
│   ├── frontend/        # Next.js Source Code
│   │   ├── app/         # Dashboard & Routing
│   │   ├── components/  # Reusable UI Components
│   │   └── prisma/      # Database Schema Tools
│   └── backend/         # FastAPI Source Code
│       ├── app/         # API Logic & Models
│       ├── data/        # CSV/JSON Datasets
│       ├── model/       # Saved ML Weight Files (.pkl)
│       └── scripts/     # Utility scripts (e.g., data downloaders)
```

---

## 🚀 How to Run

1.  **Backend**: Navigate to `backend/`, activate the virtual environment, install requirements, and run `uvicorn app.main:app`.
2.  **Frontend**: Navigate to `frontend/`, run `npm install`, then `npm run dev`.

The application will be accessible at `http://localhost:3000`.
