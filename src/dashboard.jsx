import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import dotenv from 'dotenv';
// dotenv.config();

const iconMapping = {
  'c01d': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />,
  'c01n': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />, // Night clear
  'c02d': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
  'c02n': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />, // Night cloudy
  'c03d': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />, // Partly cloudy
  'c03n': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
  'c04d': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />, // Overcast
  'c04n': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
  'r01d': <ThunderstormIcon sx={{ fontSize: 48, color: '#FF5722' }} />, // Rainy
  'r01n': <ThunderstormIcon sx={{ fontSize: 48, color: '#FF5722' }} />,
};

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Raleigh'); // Default city
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
  console.log(API_KEY);
  const API_URL = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(''); // Clear error if the fetch is successful
    } catch (error) {
      setError(error.message);
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]); // Fetch new data when the city changes

  // Get the time in the specified timezone
  const getTimeInTimezone = (timestamp, timezone) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { timeZone: timezone, ...options });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundImage: 'url("./public/wallpaper.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px'
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', borderRadius: '20px' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Weatherdash
          </Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">About</Button>
        </Toolbar>
      </AppBar>

      {/* Search Card */}
      <Card
        sx={{
          width: '100%',
          backgroundColor: '#f5f5f5', // Light background
          marginBottom: '20px',
          boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.5)', // Blue shadow
          borderRadius: '15px', // Rounded corners
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for your preferred city..."
            sx={{ backgroundColor: '#fff', color: '#000', input: { color: '#000' } }}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchWeatherData}>
                  <SearchIcon sx={{ color: '#000' }} />
                </IconButton>
              ),
            }}
          />
        </CardContent>
      </Card>

      {error && <Typography color="error">{error}</Typography>}

      {/* Weather Info Cards */}
      {weatherData && weatherData.data && weatherData.data.length > 0 && (
        <Grid container spacing={2}>
          {/* Time and Date Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5', // Light background
                color: '#000', // Dark text
                boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.5)', // Blue shadow
                borderRadius: '15px', // Rounded corners
              }}
            >
              <CardContent>
                <Typography variant="h4" fontWeight="bold">{weatherData.data[0].city_name}</Typography>
                <Typography variant="h6" color="textSecondary">
                  {getTimeInTimezone(weatherData.data[0].ts, weatherData.data[0].timezone)}
                </Typography>
                <Typography color="textSecondary">
                  {new Date(weatherData.data[0].ts * 1000).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Temperature Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5', // Light background
                color: '#000', // Dark text
                boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.5)', // Blue shadow
                borderRadius: '15px', // Rounded corners
              }}
            >
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h3">{weatherData.data[0].temp}°C</Typography>
                    <Typography color="textSecondary">Feels like: {weatherData.data[0].app_temp}°C</Typography>
                  </Grid>
                  <Grid item>
                    {/* Dynamic Weather Icon */}
                    {iconMapping[weatherData.data[0].weather.icon] || <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />}
                    <Typography>{weatherData.data[0].weather.description}</Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} mt={2}>
                  <Grid item xs={3}>
                    <WaterDropIcon sx={{ color: '#2196F3' }} />
                    <Typography variant="body1" fontWeight="bold">{weatherData.data[0].rh}%</Typography>
                    <Typography color="textSecondary">Humidity</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <AirIcon sx={{ color: '#2196F3' }} />
                    <Typography variant="body1" fontWeight="bold">{weatherData.data[0].wind_spd} km/h</Typography>
                    <Typography color="textSecondary">Wind Speed</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <SpeedIcon sx={{ color: '#2196F3' }} />
                    <Typography variant="body1" fontWeight="bold">{weatherData.data[0].pres} hPa</Typography>
                    <Typography color="textSecondary">Pressure</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <WbSunnyIcon sx={{ color: '#FFD700' }} />
                    <Typography variant="body1" fontWeight="bold">{weatherData.data[0].uv}</Typography>
                    <Typography color="textSecondary">UV Index</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default WeatherDashboard;
