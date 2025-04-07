/**
 * Утилиты для работы с Telegram WebApp
 */

// Проверяет, запущено ли приложение в Telegram WebApp
export const isTelegramWebApp = () => {
  const isAvailable = window.Telegram && window.Telegram.WebApp;
  
  // Дополнительная проверка для исключения ложных срабатываний
  const hasValidInitData = isAvailable && 
                          window.Telegram.WebApp.initData && 
                          window.Telegram.WebApp.initData.length > 0;
  
  // В режиме разработки объект может быть доступен, но без реальных данных
  const isRealTelegramWebApp = isAvailable && hasValidInitData;
  
  console.log('Telegram WebApp check:', { 
    isAvailable, 
    hasValidInitData, 
    isRealTelegramWebApp 
  });
  
  return isRealTelegramWebApp;
};

// Получение данных пользователя Telegram
export const getTelegramUser = () => {
  if (isTelegramWebApp()) {
    const webApp = window.Telegram.WebApp;
    
    // Проверяем наличие данных пользователя
    if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      console.log('Telegram user data:', webApp.initDataUnsafe.user);
      return webApp.initDataUnsafe.user;
    } else {
      console.log('Telegram WebApp available, but no user data found');
      
      // Отладочная информация о доступных данных
      if (webApp.initDataUnsafe) {
        console.log('Available initDataUnsafe:', webApp.initDataUnsafe);
      }
      
      return null;
    }
  }
  console.log('Telegram WebApp not available, cannot get user');
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