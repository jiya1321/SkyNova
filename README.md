# Weather Dashboard

A premium, production-quality weather application built with HTML5, CSS3, and Vanilla JavaScript.

## Features

- **Beautiful UI/UX**: Modern glassmorphism design with smooth animations
- **Authentication**: Login/Register system with localStorage persistence
- **Real-time Weather**: Live weather data using OpenWeatherMap API
- **Forecasts**: 3-day forecast and hourly forecast
- **Location Detection**: Browser geolocation API integration
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Recent Searches**: Track and quickly access recent city searches
- **Weather Details**: Humidity, wind, pressure, visibility, UV index, and more

## Project Structure

```
Weather Forecast/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── users.json              # Default users
├── README.md               # Documentation
├── css/
│   ├── style.css           # Login page styles
│   └── dashboard.css       # Dashboard styles
├── js/
│   ├── login.js            # Authentication logic
│   └── dashboard.js        # Weather API and dashboard logic
└── assets/
    ├── logo.png            # App logo
    ├── avatar.png          # User avatar
    └── weather-icons/      # Weather icon set
```

## Default Users

- **Username**: admin | **Password**: password123
- **Username**: student | **Password**: jsbasic2026

## Setup Instructions

1. Clone or download this repository
2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Replace `YOUR_API_KEY` in `js/dashboard.js` with your actual API key
4. Open `index.html` in a web browser
5. Login with default credentials or register a new account

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with glassmorphism, animations, and responsive design
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **OpenWeatherMap API**: Weather data provider
- **LocalStorage**: User data and preferences persistence

## Color Palette

- **Primary**: #2563EB
- **Secondary**: #0EA5E9
- **Accent**: #38BDF8
- **Dark**: #0F172A
- **Background**: #F8FAFC
- **Success**: #10B981
- **Warning**: #F59E0B
- **Danger**: #EF4444

## Typography

- **Font Family**: Poppins
- **Weights**: 300, 400, 500, 600, 700

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features Breakdown

### Login Page
- Split-screen layout with animated background
- Glassmorphism login card
- Login/Register toggle
- Form validation
- Password show/hide
- Remember me functionality
- Smooth animations and transitions

### Dashboard
- Dark vertical sidebar with navigation
- Modern white content area
- Large weather hero card
- Weather detail cards (humidity, wind, pressure, etc.)
- 3-day forecast
- Hourly forecast with horizontal scroll
- Recent searches
- Current location detection
- Search by city
- Dark/Light mode toggle
- Toast notifications
- Skeleton loading states

### Weather Data
- Current temperature and conditions
- Feels like temperature
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility distance
- UV Index
- Sunrise and sunset times
- Air quality index

## License

This project is for educational purposes.

## Author

Built for college evaluation project.
