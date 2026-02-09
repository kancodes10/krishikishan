# 🌾 Krishi-Route - Profit & Logistics Optimizer

**"Google Maps for Farmers, optimized for PROFIT"**

A professional full-stack web application that helps Indian farmers make data-driven decisions about which mandi (market) to sell their crops to, maximizing net profit after factoring in transportation and handling costs.

## 🎯 Problem Statement

Most farmers today only ask: **"Which mandi is closest?"**

Krishi-Route changes this to: **"Which mandi gives me the highest net profit after all costs?"**

This system combines **geography + economics + real-time data** to optimize farmer logistics and profitability.

## ✨ Features

### Core Intelligence Layers

1. **Input Intelligence** - Collect farmer trip details (crop, quantity, vehicle, location)
2. **Market Intelligence** - Fetch real-time mandi prices from Agmarknet
3. **Logistics Intelligence** - Calculate accurate road distances using Google Maps
4. **Economic Intelligence** - Compute net profit considering all costs
5. **Decision Intelligence** - Select the most profitable mandi option

### User Experience

- 🎨 **Modern UI** with glassmorphism design and smooth animations
- 🗺️ **Interactive Maps** showing routes to all mandis with color-coded markers
- 📊 **Profit Charts** comparing net profit across different market options
- 💰 **Cost Breakdown** detailing transport, handling, and commission charges
- 🎯 **Smart Recommendations** with actionable insights
- 📱 **Responsive Design** works on desktop, tablet, and mobile

## 🛠️ Technology Stack

### Backend
- **Node.js + Express** - Fast, async REST API server
- **MongoDB + Mongoose** - Flexible database for mandi and price data
- **Axios** - External API integration (Agmarknet, Google Maps)
- **Express Validator** - Input validation and sanitization

### Frontend
- **React** - Component-based UI framework
- **Leaflet** - Interactive map visualization
- **Recharts** - Beautiful, responsive charts
- **Axios** - API client for backend communication

### External APIs
- **Agmarknet API** - Real-time agricultural market prices
- **Google Maps Distance Matrix API** - Accurate road distances
- **Fallback**: Haversine formula and mock data for development

## 📁 Project Structure

```
KrishiRoute/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   └── optimize.controller.js   # Request orchestration
│   ├── middleware/
│   │   └── validate.js              # Input validation
│   ├── models/
│   │   ├── MandiCache.js            # Mandi data schema
│   │   └── PriceHistory.js          # Historical prices schema
│   ├── routes/
│   │   └── optimize.routes.js       # API endpoints
│   ├── services/
│   │   ├── agmarknet.service.js     # Price fetching
│   │   ├── distance.service.js      # Distance calculation
│   │   ├── profit.service.js        # Profit calculation
│   │   └── decision.service.js      # Optimization logic
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   └── server.js                    # App entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.js         # Farmer input form
│   │   │   ├── ResultsDisplay.js    # Optimization results
│   │   │   ├── MapView.js           # Interactive map
│   │   │   └── ProfitChart.js       # Profit comparison chart
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.js                   # Main application
│   │   ├── App.css                  # Global styles
│   │   └── index.js                 # React entry point
│   └── package.json                 # Dependencies
│
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KrishiRoute
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/krishiroute
   
   # API Keys (optional for development)
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   AGMARKNET_API_KEY=your_agmarknet_api_key
   
   # App Config
   USE_MOCK_DATA=true
   MAX_MANDI_DISTANCE_KM=100
   ```

   > **Note**: The app works with mock data by default (`USE_MOCK_DATA=true`). To use real data, obtain API keys and set `USE_MOCK_DATA=false`.

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

4. **Access the Application**

   Open your browser and navigate to `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Krishi-Route API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "usingMockData": true
}
```

#### 2. Optimize Trip
```http
POST /api/optimize
```

**Request Body:**
```json
{
  "crop": "onion",
  "quantity": 20,
  "vehicleType": "truck",
  "source": {
    "lat": 22.5726,
    "lng": 88.3639
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimization": {
      "bestMandi": {
        "name": "Howrah Mandi",
        "netProfit": 24000,
        "distance": 50,
        "price": 1350
      },
      "extraProfit": 4000,
      "recommendation": "Travel to Howrah Mandi! You'll earn ₹4000 more..."
    },
    "results": [...]
  }
}
```

#### 3. Get Available Crops
```http
GET /api/crops
```

#### 4. Get Available Vehicles
```http
GET /api/vehicles
```

## 💡 How It Works

### Optimization Workflow

```
1. Farmer enters details (crop, quantity, vehicle, location)
   ↓
2. Backend fetches mandi prices from Agmarknet API
   ↓
3. Backend calculates distances using Google Maps API
   ↓
4. Backend computes profit for each mandi:
   - Revenue = Price × Quantity
   - Transport Cost = Distance × Vehicle Rate
   - Handling Cost = (Loading + Unloading + Commission) × Quantity
   - Net Profit = Revenue - Transport Cost - Handling Cost
   ↓
5. Decision engine selects mandi with MAXIMUM net profit
   ↓
6. Frontend displays results with visualizations
```

### Profit Calculation Formula

```javascript
Revenue = Price per Quintal × Quantity
Transport Cost = Distance (km) × Vehicle Rate (₹/km)
Handling Cost = (Loading + Unloading + Commission) × Quantity
Net Profit = Revenue - Transport Cost - Handling Cost
```

### Vehicle Rates (₹ per km)

| Vehicle | Rate (₹/km) |
|---------|-------------|
| Tractor | 12 |
| Tata Ace | 18 |
| Truck | 25 |
| Mini Truck | 20 |
| Tempo | 15 |

### Handling Charges (₹ per quintal)

| Charge | Amount (₹/Q) |
|--------|--------------|
| Loading | 20 |
| Unloading | 20 |
| Commission | 50 |

## 🧪 Testing

### Backend Testing

Test the API using sample data:

```bash
cd backend
npm start
```

Then use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "crop": "onion",
    "quantity": 20,
    "vehicleType": "truck",
    "source": {"lat": 22.5726, "lng": 88.3639}
  }'
```

### Frontend Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Fill out the form with sample data
4. Click "Find Best Mandi"
5. Verify results display correctly with charts and map

## 🌟 Key Highlights

### Why This Project is Strong

1. ✅ **Solves Real Problem** - Addresses actual farmer pain points
2. ✅ **Data-Driven** - Combines geospatial + economic intelligence
3. ✅ **Scalable Architecture** - Clean separation of concerns
4. ✅ **Production-Ready** - Error handling, validation, logging
5. ✅ **Professional UI/UX** - Modern design with smooth animations
6. ✅ **Extensible** - Easy to add new features

### Future Enhancements

- 🚗 **Ride Sharing** - Connect farmers traveling to same mandi
- 📱 **Mobile App** - Native iOS/Android applications
- 🔔 **Price Alerts** - Notify farmers when prices spike
- ⛽ **Fuel Prices** - Factor in real-time fuel costs
- 🤖 **ML Predictions** - Predict future price trends
- 🌐 **Multi-Language** - Support for regional languages
- 📊 **Analytics Dashboard** - Historical trends and insights
- 👥 **Farmer Community** - Reviews and recommendations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development

### Backend Development Mode

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Build for Production

```bash
cd frontend
npm run build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- The app will continue with mock data if MongoDB fails

### API Key Issues

- App works with `USE_MOCK_DATA=true` by default
- Obtain keys from:
  - Google Maps: https://console.cloud.google.com/
  - Agmarknet: https://data.gov.in/

### Port Already in Use

If port 5000 or 3000 is in use:

```bash
# Backend: Change PORT in .env
PORT=5001

# Frontend: Create .env file
REACT_APP_API_URL=http://localhost:5001/api
PORT=3001
```

## 💬 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for Indian Farmers**

*Empowering agricultural logistics through technology*
