import React, { useEffect, useState } from 'react';
import telegramWebApp from '../utils/telegramWebApp';

/**
 * Компонент приветствия, который показывает разное сообщение
 * в зависимости от того, вошел ли пользователь через Telegram или как гость
 */
function UserGreeting() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telegramStatus, setTelegramStatus] = useState('Проверка...');

  useEffect(() => {
    // Проверяем доступность Telegram WebApp
    const isTelegramAvailable = telegramWebApp.isAvailable();
    
    if (isTelegramAvailable) {
      // Инициализируем Telegram WebApp
      telegramWebApp.init();
      
      // Получаем данные пользователя
      const telegramUser = telegramWebApp.getUser();
      setUser(telegramUser);
      setTelegramStatus('Подключено к Telegram WebApp');
    } else {
      // Определяем режим запуска (локальный или на GitHub Pages)
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      setTelegramStatus(isLocalhost 
        ? 'Режим локальной разработки'
        : 'Запущено в браузере (без Telegram)');
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="greeting-loader">Загрузка...</div>;
  }

  if (user) {
    return (
      <div className="greeting">
        <h2>Привет, {user.first_name}!</h2>
        <p>Добро пожаловать в интерактивные линии Перми</p>
        <div className="user-details">
          <p><strong>ID:</strong> {user.id}</p>
          {user.username && <p><strong>Username:</strong> @{user.username}</p>}
          {user.language_code && <p><strong>Язык:</strong> {user.language_code}</p>}
        </div>
        <div className="telegram-status">{telegramStatus}</div>
      </div>
    );
  }

  return (
    <div className="greeting">
      <h2>Привет, Гость!</h2>
      <p>Добро пожаловать в интерактивные линии Перми</p>
      <small>Для полного доступа к функциям, запустите приложение через Telegram</small>
      <div className="telegram-status">{telegramStatus}</div>
    </div>
  );
}

export default UserGreeting; 