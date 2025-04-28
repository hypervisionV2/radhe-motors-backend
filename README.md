# TVS-RS Automotive Dealer Backend

Backend API for TVS-RS Automotive Dealer Website built with Node.js, Express, and MongoDB.

## Project Overview

This project provides the backend REST API for a TVS automotive dealership website. The initial phase focuses on:

- Displaying vehicle information for customers
- Enabling users to book appointments for test rides or purchases
- Storing customer information when they express interest in vehicles
- Providing showroom information
- Serving carousel content for the website homepage 

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tvs-rs-automotive-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit the `.env` file and set your MongoDB connection string and other configuration options.

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Vehicles

- `GET /api/vehicles` - Get all vehicles with optional filtering
    - Query Parameters:
        - `type`: Filter by vehicle type (Scooter, Motorcycle, 3-Wheeler)
        - `minPrice`: Minimum price filter
        - `maxPrice`: Maximum price filter
        - `isPopular`: Filter by popularity (true/false)
        - `page`: Page number (default: 1)
        - `limit`: Items per page (default: 10)

- `GET /api/vehicles/:id` - Get vehicle details by ID

### Appointments

- `POST /api/appointments` - Create a new appointment
    - Required fields:
        - `vehicleId`: ID of the vehicle of interest
        - `showroomId`: ID of the showroom for the appointment
        - `date`: Appointment date (must be in the future)
        - `time`: Appointment time
        - `name`: Customer name
        - `phone`: Customer phone number
    - Optional fields:
        - `email`: Customer email
        - `purpose`: Purpose of visit (default: "Test Ride")
        - `vehicleColor`: Preferred vehicle color

### Showrooms

- `GET /api/showrooms` - Get all active showrooms
- `GET /api/showrooms/:id` - Get showroom details by ID

### Carousel

- `GET /api/carousel` - Get all active carousel items for the homepage

## Project Structure

```
tvs-rs-automotive-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.js          # Express app
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── server.js           # Application entry point
```

## Future Enhancements

Future phases of the project will include:
- Admin portal for managing vehicle inventory
- Employee management system
- Sales tracking
- Service scheduling and reminders
- Analytics and reporting

## License

ISC