import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');
  const [lang, setLang] = useState('en'); // Default language is English
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        setError('Unable to retrieve your location');
      }
    );
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const apiKey = '0df052fdfc6cf9131637ec5db331bb15'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&lang=${lang}&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleLocationSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiKey = '0df052fdfc6cf9131637ec5db331bb15'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&lang=${lang}&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  const handleUnitChange = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const handleLanguageChange = (event) => {
    setLang(event.target.value);
  };

  const getBackgroundClass = () => {
    if (!weatherData) return '';
    const { weather } = weatherData;
    const condition = weather[0].main.toLowerCase();
    if (condition.includes('rain')) {
      return 'rainy';
    } else if (condition.includes('clear')) {
      return 'sunny';
    } else if (condition.includes('snow')) {
      return 'snowy';
    } else if (condition.includes('clouds')) {
      return 'cloudy';
    }
    return '';
  };

  const renderWeatherEffect = () => {
    if (!weatherData || !weatherData.weather) return null;
  
    const { weather } = weatherData;
    const isRaining = weather.some((w) => w.main.toLowerCase().includes('rain'));
    const isSunny = weather.some((w) => w.main.toLowerCase().includes('clear'));
  
    if (!isRaining && !isSunny) return null;
  
    const rainDrops = [];
    if (isRaining) {
      for (let i = 0; i < 100; i++) {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
  
        rainDrops.push(
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      }
    }
  
    return (
      <div className="weather-effect">
        {isRaining && <div className="rain-effect">{rainDrops}</div>}
        {isSunny && <div className="sun-effect" />}
      </div>
    );
  };
  
  const convertTemperature = (temp) => {
    if (unit === 'metric') {
      return temp;
    } else {
      return ((temp * 9) / 5 + 32).toFixed(2);
    }
  };

  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
       {renderWeatherEffect()}
      <div className="container">
        <h1 className="app-title">Weather Wise</h1>
        <p className="app-description">Wise & Accurate Weather Forecast</p>
        <form onSubmit={handleLocationSubmit} className="location-form">
          <input
            type="text"
            placeholder="Enter city or zip code"
            value={location}
            onChange={handleLocationChange}
            className="location-input"
          />
          <button type="submit" className="location-button">
            Get Weather
          </button>
        </form>
        <div>
          <label htmlFor="unit-select">Units:</label>
          <select id="unit-select" value={unit} onChange={handleUnitChange}>
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>
        <div>
          <label htmlFor="lang-select">Language:</label>
          <select id="lang-select" value={lang} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            {/* Add more language options as needed */}
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {weatherData && (
          <div className="weather-info">
            <h2 className="location-name">{weatherData.name}</h2>
            <div className="weather-details">
              <div className="weather-detail">
                <img
                  src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                  alt={weatherData.weather[0].description}
                  className="weather-icon"
                />
                <p className="weather-description">{weatherData.weather[0].description}</p>
              </div>
              <div className="weather-detail">
                <p className="weather-label">Temperature:</p>
                <p className="weather-value">{convertTemperature(weatherData.main.temp)} {unit === 'metric' ? '°C' : '°F'}</p>
              </div>
              <div className="weather-detail">
                <p className="weather-label">Humidity:</p>
                <p className="weather-value">{weatherData.main.humidity}%</p>
              </div>
              <div className="weather-detail">
                <p className="weather-label">Wind Speed:</p>
                <p className="weather-value">{weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
