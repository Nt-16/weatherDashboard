// // HistoricalWeatherChart.jsx
// import { Line } from 'react-chartjs-2';
// import PropTypes from 'prop-types';
// import {Card, Typography} from '@mui/material';
// const HistoricalWeatherChart = ({ chartData }) => {
//   return (
//     <Card sx={{ width: '100%', marginTop: '20px', padding: '10px' }}>
//       <Typography variant="h6" align="center" gutterBottom>7-Day Temperature Trend</Typography>
//       <Line data={chartData} />
//     </Card>
//   );
// };

// HistoricalWeatherChart.propTypes = {
//   chartData: PropTypes.object.isRequired,
// };

// export default HistoricalWeatherChart;


import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const HistoricalWeatherChart = ({ lat, lon, startDate, endDate, key }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.weatherbit.io/v2.0/history/subhourly`, {
          params: {
            lat,
            lon,
            start_date: startDate,
            end_date: endDate,
            key,  // Use the prop name 'key' here
          },
        });

        const historicalData = response.data.data;

        const labels = historicalData.map(item => 
          new Date(item.timestamp * 1000).toLocaleString()  // Adjust for seconds
        );
        const temperatures = historicalData.map(item => item.temp);

        setData({
          labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: temperatures,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error(err);  // Log the error for debugging
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon, startDate, endDate, key]);  // Update the dependency array

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return <Line data={data} options={{ responsive: true }} />;
};

// Prop validation
HistoricalWeatherChart.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,  // Update prop type to 'key'
};

export default HistoricalWeatherChart;
