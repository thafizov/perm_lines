import React, { useEffect, useState } from 'react';
import telegramWebApp from '../utils/telegramWebApp';

/**
 * Компонент приветствия, который показывает разное сообщение
 * в зависимости от того, вошел ли пользователь через Telegram или как гость
 */
function UserGreeting() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Инициализируем Telegram WebApp
    telegramWebApp.init();
    
    // Получаем данные пользователя
    const telegramUser = telegramWebApp.getUser();
    setUser(telegramUser);
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
      </div>
    );
  }

  return (
    <div className="greeting">
      <h2>Привет, Гость!</h2>
      <p>Добро пожаловать в интерактивные линии Перми</p>
      <small>Для полного доступа к функциям, запустите приложение через Telegram</small>
    </div>
  );
}

export default UserGreeting; 