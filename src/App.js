import React, { useEffect } from 'react';
import UserGreeting from './components/UserGreeting';
import telegramWebApp from './utils/telegramWebApp';
import './App.css';

function App() {
  useEffect(() => {
    // Инициализируем Telegram WebApp
    const initialized = telegramWebApp.init();
    if (initialized) {
      console.log('Telegram WebApp успешно инициализирован');
    } else {
      console.log('Запуск вне Telegram WebApp или ошибка инициализации');
    }
  }, []);

  return (
    <div className="App">
      <main className="App-main">
        <UserGreeting />
        <div className="map-placeholder">
          <p>Карта будет здесь в следующем этапе</p>
        </div>
      </main>
    </div>
  );
}

export default App;
