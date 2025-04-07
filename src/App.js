import React, { useEffect, useState } from 'react';
import UserGreeting from './components/UserGreeting';
import Map from './components/Map';
import PointCard from './components/PointCard';
import telegramWebApp from './utils/telegramWebApp';
import blueLineData from './data/blueLineData';
import './App.css';

function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Инициализируем Telegram WebApp
    const initialized = telegramWebApp.init();
    if (initialized) {
      console.log('Telegram WebApp успешно инициализирован');
    } else {
      console.log('Запуск вне Telegram WebApp или ошибка инициализации');
    }

    // Глобальный обработчик для открытия деталей точки
    window.openPointDetails = (pointId) => {
      const point = findPointById(pointId);
      if (point) {
        setSelectedPoint(point);
      }
    };

    return () => {
      delete window.openPointDetails;
    };
  }, []);

  // Функция для поиска точки по ID
  const findPointById = (pointId) => {
    // Пока работаем только с синей линией
    return blueLineData.points.find(point => point.id === pointId);
  };

  // Закрывает карточку с деталями точки
  const handleClosePointCard = () => {
    setSelectedPoint(null);
  };

  // Показывает/скрывает информационный баннер
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="App">
      <main className="App-main">
        {/* Убираем UserGreeting из основного потока */}
        
        {/* Карта на весь экран */}
        <div className="map-wrapper fullscreen">
          <Map onPointSelect={setSelectedPoint} hideControls={true} />
        </div>

        {/* Кнопка информации */}
        <button className="info-button" onClick={toggleInfo}>
          ℹ️
        </button>

        {/* Информационный баннер (появляется при клике) */}
        {showInfo && (
          <div className="info-panel">
            <button className="close-button" onClick={toggleInfo}>×</button>
            <UserGreeting />
          </div>
        )}

        {/* Показываем карточку только если выбрана точка */}
        {selectedPoint && (
          <PointCard 
            point={selectedPoint} 
            onClose={handleClosePointCard} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
