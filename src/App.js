import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file
import wae from '../src/weathericon.png'
const App = () => {
    const [city, setCity] = useState('Delhi,IN');
    const [temperature, setTemperature] = useState('26 °C');
    const [clouds, setClouds] = useState('Broken Clouds');
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);

    const apiKey = "895284fb2d2c50a520ea537456963d9c";

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

                fetch(weatherUrl)
                    .then((res) => res.json())
                    .then((data) => {
                        weatherReport(data);
                    });
            });
        }
    }, []);

    const searchByCity = () => {
        const place = document.getElementById('input').value;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}`;

        fetch(weatherUrl)
            .then((res) => res.json())
            .then((data) => {
                weatherReport(data);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
            });

        document.getElementById('input').value = '';
    }

    const weatherReport = (data) => {
        setCity(`${data.name}, ${data.sys.country}`);
        setTemperature(`${Math.floor(data.main.temp - 273)} °C`);
        setClouds(data.weather[0].description);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}`;

        fetch(forecastUrl)
            .then((res) => res.json())
            .then((forecast) => {
                displayWeather(data, forecast);
            })
            .catch((error) => {
                console.error('Error fetching forecast data:', error);
            });
    }

    const displayWeather = (data, forecast) => {
        setHourlyForecast(forecast.list.slice(0, 5));
        setDailyForecast(forecast.list.filter((item, index) => index >= 8 && index % 8 === 0));
    }

    const hourForecast = () => {
        return hourlyForecast.map((item, index) => {
            const date = new Date(item.dt * 1000);
            const time = date.toLocaleTimeString(undefined, 'Asia/Kolkata').replace(':00', '');
            const tempMax = Math.floor(item.main.temp_max - 273);
            const tempMin = Math.floor(item.main.temp_min - 273);
            const description = item.weather[0].description;

            return (
                <div className="next" key={index}>
                    <div>
                        <p className="time">{time}</p>
                        <p>{tempMax} °C / {tempMin} °C</p>
                    </div>
                    <p className="desc">{description}</p>
                </div>
            );
        });
    }

    const dayForecast = () => {
        return dailyForecast.map((item, index) => {
            const date = new Date(item.dt * 1000).toDateString(undefined, 'Asia/Kolkata');
            const tempMax = Math.floor(item.main.temp_max - 273);
            const tempMin = Math.floor(item.main.temp_min - 273);
            const description = item.weather[0].description;

            return (
                <div className="dayF" key={index}>
                    <p className="date">{date}</p>
                    <p>{tempMax} °C / {tempMin} °C</p>
                    <p className="desc">{description}</p>
                </div>
            );
        });
    }

    return (
        <div>
            <div className="header">
                <h1>WEATHER APP</h1>
                <div>
                    <input type="text"  className='input'id="input" placeholder="Enter city name" />
                    <button  className='search'onClick={searchByCity}>Search</button>
                </div>
            </div>
            <main>
                <div className="weather">
                    <h2 id="city">{city}</h2>
                    <div className="temp-box">
                        <img src={wae} alt="" />
                        <p id="temperature">{temperature}</p>
                    </div>
                    <span id="clouds">{clouds}</span>
                </div>
                <div className="divider1"></div>
                <div className="forecstH">
                    <p className="cast-header">Upcoming forecast</p>
                    <div className="templist">
                        {hourForecast()}
                    </div>
                </div>
            </main>
            <div className="forecstD">
                <div className="divider2"></div>
                <p className="cast-header">Next 4 days forecast</p>
                <div className="weekF">
                    {dayForecast()}
                </div>
            </div>
        </div>
    );
}

export default App;
