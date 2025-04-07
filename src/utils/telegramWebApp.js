/**
 * Утилиты для работы с Telegram WebApp
 */

// Проверяет, запущено ли приложение в Telegram WebApp
export const isTelegramWebApp = () => {
  return window.Telegram && window.Telegram.WebApp;
};

// Получение данных пользователя Telegram
export const getTelegramUser = () => {
  if (isTelegramWebApp()) {
    const webApp = window.Telegram.WebApp;
    return webApp.initDataUnsafe && webApp.initDataUnsafe.user 
      ? webApp.initDataUnsafe.user 
      : null;
  }
  return null;
};

// Получение цвета темы Telegram
export const getTelegramThemeParams = () => {
  if (isTelegramWebApp()) {
    return window.Telegram.WebApp.themeParams || {};
  }
  return {};
};

// Инициализация Telegram WebApp
export const initTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    const webApp = window.Telegram.WebApp;
    
    // Сообщаем Telegram, что приложение готово
    webApp.ready();
    
    // Расширяем на весь экран
    webApp.expand();
    
    return true;
  }
  
  return false;
};

// Закрыть WebApp
export const closeTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.close();
  }
};

// Оборачиваем Telegram WebApp API для безопасного использования
export const telegramWebApp = {
  isAvailable: isTelegramWebApp,
  getUser: getTelegramUser,
  getThemeParams: getTelegramThemeParams,
  init: initTelegramWebApp,
  close: closeTelegramWebApp
};

export default telegramWebApp; 