import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import PointCard from './components/PointCard';
import UserGreeting from './components/UserGreeting';
import SideMenu from './components/SideMenu';
import telegramWebApp from './utils/telegramWebApp';
import blueLineData from './data/blueLineData';
import greenLineData from './data/greenLineData';
import redLineData from './data/redLineData';
import './App.css';

function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLine, setActiveLine] = useState('blue-line');

  // Данные для разных линий
  const lineDataMap = {
    'blue-line': blueLineData,
    'green-line': greenLineData,
    'red-line': redLineData
  };
  
  // Текущие данные активной линии
  const activeLineData = lineDataMap[activeLine];

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
    // Поиск в активной линии
    return activeLineData.points.find(point => point.id === pointId);
  };

  // Закрывает карточку с деталями точки
  const handleClosePointCard = () => {
    setSelectedPoint(null);
  };

  // Показывает/скрывает информационный баннер
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  // Открывает/закрывает меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Обрабатывает выбор линии
  const handleLineSelect = (lineId) => {
    setActiveLine(lineId);
    setSelectedPoint(null); // Сбрасываем выбранную точку при смене линии
  };

  return (
    <div className="App">
      <main className="App-main">
        {/* Карта на весь экран */}
        <div className="map-wrapper fullscreen">
          <Map 
            onPointSelect={setSelectedPoint} 
            hideControls={true} 
            lineData={activeLineData}
          />
        </div>

        {/* Кнопка меню */}
        <button className="menu-button" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        {/* Кнопка информации */}
        <button className="info-button" onClick={toggleInfo}>
          ℹ️
        </button>

        {/* Боковое меню */}
        <SideMenu 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
          activeLine={activeLine}
          onSelectLine={handleLineSelect}
        />

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
