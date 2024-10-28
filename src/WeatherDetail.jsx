// import PropTypes from 'prop-types';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   IconButton,
//   AppBar,
//   Toolbar,
//   Button,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import WbSunnyIcon from '@mui/icons-material/WbSunny';
// import CloudIcon from '@mui/icons-material/Cloud';
// import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import HistoricalWeatherChart from './HistoricalWeatherChart';

// // Icon mapping based on weather conditions
// const iconMapping = {
//   'c01d': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />,
//   'c01n': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />,
//   'c02d': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
//   'c02n': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
//   'r01d': <ThunderstormIcon sx={{ fontSize: 48, color: '#FF5722' }} />,
// };

// const WeatherDashboard = ({ initialCity = 'Raleigh' }) => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [city, setCity] = useState(initialCity);
//   const [error, setError] = useState('');
//   const [historicalData, setHistoricalData] = useState(null);

//   const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
//   const API_URL = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}`;

//   const fetchWeatherData = useCallback(async () => {
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error('City not found');
//       const data = await response.json();
//       setWeatherData(data);
//       setError('');
//     } catch (error) {
//       setError(error.message);
//       console.error('Error fetching weather data:', error);
//     }
//   }, [API_URL]);

//   const fetchHistoricalData = useCallback(async () => {
//     const today = new Date();
//     const endDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//     const startDate = new Date(today);
//     startDate.setDate(today.getDate() - 6); // Get date 6 days before today
//     const formattedStartDate = startDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
//     const HISTORICAL_URL = `https://api.weatherbit.io/v2.0/history/daily?key=${API_KEY}&city=${city}&start_date=${formattedStartDate}&end_date=${endDate}`;
  
//     try {
//       const response = await fetch(HISTORICAL_URL);
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch historical data: ${errorText}`);
//       }
//       const data = await response.json();
//       setHistoricalData(data.data);
//     } catch (error) {
//       console.error('Error fetching historical data:', error);
//     }
//   }, [API_KEY, city]); // Add city as a dependency

//   useEffect(() => {
//     fetchWeatherData();
//     fetchHistoricalData();
//   }, [fetchWeatherData, fetchHistoricalData]); // Include the fetch functions

//   return (
//     <Container
//       maxWidth="lg"
//       sx={{
//         minHeight: '100vh',
//         width: '100vw',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         backgroundImage: 'url("./public/wallpaper.jpg")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         padding: '20px',
//       }}
//     >
//       <AppBar position="static" sx={{ backgroundColor: '#1976d2', borderRadius: '20px' }}>
//         <Toolbar>
//           <Typography variant="h4" sx={{ flexGrow: 1 }}>Weatherdash</Typography>
//           <Button color="inherit">Dashboard</Button>
//           <Button color="inherit">About</Button>
//         </Toolbar>
//       </AppBar>

//       <Card
//         sx={{
//           width: '100%',
//           backgroundColor: '#f5f5f5',
//           marginBottom: '20px',
//           boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.5)',
//           borderRadius: '15px',
//         }}
//       >
//         <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Search for your preferred city..."
//             sx={{ backgroundColor: '#fff', color: '#000', input: { color: '#000' } }}
//             onChange={(e) => setCity(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <IconButton onClick={fetchWeatherData}>
//                   <SearchIcon sx={{ color: '#000' }} />
//                 </IconButton>
//               ),
//             }}
//           />
//         </CardContent>
//       </Card>

//       {error && <Typography color="error">{error}</Typography>}

//       {weatherData && weatherData.data && weatherData.data.length > 0 && (
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ backgroundColor: '#f5f5f5', color: '#000', borderRadius: '15px' }}>
//               <CardContent>
//                 <Typography variant="h4" fontWeight="bold">{weatherData.data[0].city_name}</Typography>
//                 <Typography variant="h6" color="textSecondary">
//                   {new Date(weatherData.data[0].ts * 1000).toLocaleTimeString()}
//                 </Typography>
//                 <Typography color="textSecondary">
//                   {new Date(weatherData.data[0].ts * 1000).toLocaleDateString()}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={8}>
//             <Card sx={{ backgroundColor: '#f5f5f5', color: '#000', borderRadius: '15px' }}>
//               <CardContent>
//                 <Grid container justifyContent="space-between" alignItems="center">
//                   <Grid item>
//                     <Typography variant="h3">{weatherData.data[0].temp}°C</Typography>
//                     <Typography color="textSecondary">Feels like: {weatherData.data[0].app_temp}°C</Typography>
//                   </Grid>
//                   <Grid item>
//                     {iconMapping[weatherData.data[0].weather.icon] || <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />}
//                     <Typography>{weatherData.data[0].weather.description}</Typography>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}

//       {/* Historical Weather Chart */}
//       {historicalData && (
//         <HistoricalWeatherChart
//           lat={weatherData.data[0].lat}  // Pass latitude
//           lon={weatherData.data[0].lon}  // Pass longitude
//           startDate={historicalData[historicalData.length - 1].datetime}  // Start date for historical data
//           endDate={historicalData[0].datetime}  // End date for historical data
//           key={API_KEY}  // Pass the API key
//         />
//       )}
//     </Container>
//   );
// };

// // PropTypes for prop validation
// WeatherDashboard.propTypes = {
//   initialCity: PropTypes.string,
// };

// export default WeatherDashboard;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import SpeedIcon from '@mui/icons-material/Speed';
import { Link } from 'react-router-dom';


const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
const WeatherDetail = () => {
  const { cityName } = useParams();
  const [cityWeather, setCityWeather] = useState(null);

  useEffect(() => {
    const fetchCityWeather = async () => {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?city=${cityName}&key=${API_KEY}`
      );
      const data = await response.json();
      setCityWeather(data?.data[0]);
    };

    fetchCityWeather();
  }, [cityName]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {cityWeather ? (
        <>
          <Typography variant="h3" gap={10}>City: {cityWeather.city_name}</Typography>
          <Card
            sx={{
              backgroundColor: '#e0f7fa',
              boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.2)',
              borderRadius: '15px',
              padding: '20px'
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Weather Details
              </Typography>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
                Current weather conditions in {cityWeather.city_name}
              </Typography>
  
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <WbSunnyIcon sx={{ color: '#FFD700', fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">{cityWeather.temp}°C</Typography>
                    <Typography variant="body2" color="text.secondary">Temperature</Typography>
                  </Box>
                </Grid>
  
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <WaterDropIcon sx={{ color: '#2196F3', fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">{cityWeather.rh}%</Typography>
                    <Typography variant="body2" color="text.secondary">Humidity</Typography>
                  </Box>
                </Grid>
  
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AirIcon sx={{ color: '#81D4FA', fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">{cityWeather.wind_spd} km/h</Typography>
                    <Typography variant="body2" color="text.secondary">Wind Speed</Typography>
                  </Box>
                </Grid>
  
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SpeedIcon sx={{ color: '#FF8A65', fontSize: 40 }} />
                    <Typography variant="h6" fontWeight="bold">{cityWeather.pres} hPa</Typography>
                    <Typography variant="body2" color="text.secondary">Pressure</Typography>
                  </Box>
                </Grid>
              </Grid>
  
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                Data provided by Weatherbit.io
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading weather details for {cityName}...</Typography>
        </Box>
      )}

        
    </Container>
  );
  
};

export default WeatherDetail;

export const generateWeatherLink = (cityName) => {
    if (!cityName) return null; // Return null if no city name is provided
    
    return (
      <Link
        to={`/weather/${cityName}`}
        style={{ textDecoration: 'none', color: '#1976d2', display: 'block', marginTop: '20px' }}
      >
        View Weather Details for {cityName}
      </Link>
    );
  };