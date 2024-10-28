import PropTypes from 'prop-types';
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
  Button,
  Link as MuiLink
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Icon mapping based on weather conditions
const iconMapping = {
  'c01d': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />,
  'c01n': <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />,
  'c02d': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
  'c02n': <CloudIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />,
  'r01d': <ThunderstormIcon sx={{ fontSize: 48, color: '#FF5722' }} />,
};

const WeatherDashboard = ({ initialCity = 'Raleigh' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(initialCity);
  const [error, setError] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  const [cityName, setCityName] = useState('');

  const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
  const API_URL = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}`;
  const HISTORICAL_URL = `https://api.weatherbit.io/v2.0/history/daily?key=${API_KEY}&city=${city}&days=7`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (error) {
      setError(error.message);
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(HISTORICAL_URL);
      if (!response.ok) throw new Error('Failed to fetch historical data');
      const data = await response.json();
      setHistoricalData(data.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    fetchHistoricalData();
  }, [city]);

  // Chart Data Preparation
  const chartData = historicalData && {
    labels: historicalData.map(day => new Date(day.datetime).toLocaleDateString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(day => day.temp),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        fill: true,
      },
    ],
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
        backgroundImage: 'url("./public/wallpaper.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px'
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', borderRadius: '20px' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Weatherdash</Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">About</Button>
        </Toolbar>
      </AppBar>

      {/* Search Card */}
      <Card
        sx={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          marginBottom: '20px',
          boxShadow: '0px 4px 12px rgba(0, 0, 255, 0.5)',
          borderRadius: '15px',
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for your preferred city..."
            sx={{ backgroundColor: '#fff', color: '#000', input: { color: '#000' } }}
            onChange={(e) => {
              setCity(e.target.value);
              setCityName(e.target.value); // Update cityName on input change
            }}
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
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', color: '#000', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold">{weatherData.data[0].city_name}</Typography>
                <Typography variant="h6" color="textSecondary">
                  {new Date(weatherData.data[0].ts * 1000).toLocaleTimeString()}
                </Typography>
                <Typography color="textSecondary">
                  {new Date(weatherData.data[0].ts * 1000).toLocaleDateString()}
                </Typography>
                {/* Conditional Rendering of the Link */}
                {cityName && (
                  <MuiLink
                    component={Link}
                    to={`/city/${cityName}`}
                    sx={{ mt: 2, display: 'block', textDecoration: 'none', color: '#1976d2' }}
                  >
                    View Weather Details for {cityName}
                  </MuiLink>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#f5f5f5', color: '#000', borderRadius: '15px' }}>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h3">{weatherData.data[0].temp}°C</Typography>
                    <Typography color="textSecondary">Feels like: {weatherData.data[0].app_temp}°C</Typography>
                  </Grid>
                  <Grid item>
                    {iconMapping[weatherData.data[0].weather.icon] || <WbSunnyIcon sx={{ fontSize: 48, color: '#FFD700' }} />}
                    <Typography>{weatherData.data[0].weather.description}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Temperature Line Chart */}
      {historicalData && (
        <Card sx={{ width: '100%', marginTop: '20px', padding: '10px' }}>
          <Typography variant="h6" align="center" gutterBottom>7-Day Temperature Trend</Typography>
          <Line data={chartData} />
        </Card>
      )}
    </Container>
  );
};

// PropTypes for prop validation
WeatherDashboard.propTypes = {
  initialCity: PropTypes.string,
};

export default WeatherDashboard;



//333333333333333333333333333333333333333333333333333333333333333333333333333333333
// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
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
//   MuiLink
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import WbSunnyIcon from '@mui/icons-material/WbSunny';
// import CloudIcon from '@mui/icons-material/Cloud';
// import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import { Line } from 'react-chartjs-2';

// import { Link } from 'react-router-dom';
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
//   const [cityName, setCityName] = useState('');




//   const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
//   const API_URL = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}`;
//   const HISTORICAL_URL = `https://api.weatherbit.io/v2.0/history/daily?key=${API_KEY}&city=${city}&days=7`;

//   const fetchWeatherData = async () => {
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
//   };

//   const fetchHistoricalData = async () => {
//     try {
//       const response = await fetch(HISTORICAL_URL);
//       if (!response.ok) throw new Error('Failed to fetch historical data');
//       const data = await response.json();
//       setHistoricalData(data.data);
//     } catch (error) {
//       console.error('Error fetching historical data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchWeatherData();
//     fetchHistoricalData();
//   }, [city]);

//   // Chart Data Preparation
//   const chartData = historicalData && {
//     labels: historicalData.map(day => new Date(day.datetime).toLocaleDateString()),
//     datasets: [
//       {
//         label: 'Temperature (°C)',
//         data: historicalData.map(day => day.temp),
//         borderColor: '#1976d2',
//         backgroundColor: 'rgba(25, 118, 210, 0.2)',
//         fill: true,
//       },
//     ],
//   };

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
//         padding: '20px'
//       }}
//     >
//       {/* Navigation Bar */}
//       <AppBar position="static" sx={{ backgroundColor: '#1976d2', borderRadius: '20px' }}>
//         <Toolbar>
//           <Typography variant="h4" sx={{ flexGrow: 1 }}>Weatherdash</Typography>
//           <Button color="inherit">Dashboard</Button>
//           <Button color="inherit">About</Button>
//         </Toolbar>
//       </AppBar>

//       {/* Search Card */}
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
      
//       {/* Weather Info Cards */}
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
//                 {/* Conditional Rendering of the Link */}
//                 {cityName && (
//                   <MuiLink
                  
//                     component={Link}
//                     to={`/city/${cityName}`}
//                     sx={{ mt: 2, display: 'block', textDecoration: 'none', color: '#1976d2' }}
//                   >
//                     View Weather Details for {cityName}
//                   </MuiLink>
//                 )}
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

//       {/* Temperature Line Chart */}
//       {historicalData && (
//         <Card sx={{ width: '100%', marginTop: '20px', padding: '10px' }}>
//           <Typography variant="h6" align="center" gutterBottom>7-Day Temperature Trend</Typography>
//           <Line data={chartData} />
//         </Card>
//       )}

        




//     </Container>
//   );
// };

// // PropTypes for prop validation
// WeatherDashboard.propTypes = {
//   initialCity: PropTypes.string,
// };

// export default WeatherDashboard;

//34333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333


