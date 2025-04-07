import React, { useEffect, useState } from 'react';
import UserGreeting from './components/UserGreeting';
import Map from './components/Map';
import PointCard from './components/PointCard';
import telegramWebApp from './utils/telegramWebApp';
import blueLineData from './data/blueLineData';
import './App.css';

function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);

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

  return (
    <div className="App">
      <main className="App-main">
        <UserGreeting />
        
        {/* Заменяем плейсхолдер карты на компонент Map */}
        <div className="map-wrapper">
          <Map onPointSelect={setSelectedPoint} />
        </div>

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
