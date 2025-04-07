import React, { useState, useEffect } from 'react';
import '../styles/PointCard.css';
import { IoCloseOutline } from 'react-icons/io5';
import { FaPlay, FaPause } from 'react-icons/fa';
// Импортируем изображение
import buildingImage from '../assets/images/dom-meshkova.png';

// Константы для анимаций
const TRANSITION_DURATION = 300; // в миллисекундах

/**
 * Компонент карточки с информацией о точке интереса
 */
const PointCard = ({ point, onClose }) => {
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState('info');
  // Состояние для отслеживания активного аудио
  const [activeAudio, setActiveAudio] = useState(null);
  // Состояние для анимации входа и выхода
  const [isVisible, setIsVisible] = useState(false);
  // Состояние для анимации контента вкладок
  const [isContentTransitioning, setIsContentTransitioning] = useState(false);
  
  // Эффект при монтировании компонента для запуска анимации появления
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основного контента
    
    // Запускаем анимацию появления
    setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => {
      document.body.style.overflow = 'auto'; // Возвращаем прокрутку при размонтировании
    };
  }, []);
  
  // Обработчик переключения вкладок с анимацией
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    // Запускаем анимацию исчезновения контента
    setIsContentTransitioning(true);
    
    // После завершения анимации исчезновения меняем вкладку
    setTimeout(() => {
      setActiveTab(tabId);
      
      // Запускаем анимацию появления нового контента
      setTimeout(() => {
        setIsContentTransitioning(false);
      }, 50);
    }, TRANSITION_DURATION);
  };

  // Обработчик воспроизведения аудиогида
  const toggleAudio = (audioId) => {
    if (activeAudio === audioId) {
      // Если нажатие на активный аудио - останавливаем
      setActiveAudio(null);
    } else {
      // Включаем новое аудио
      setActiveAudio(audioId);
    }
  };

  // Обработчик закрытия карточки с анимацией
  const handleClose = () => {
    setIsVisible(false);
    
    // Запускаем анимацию исчезновения
    setTimeout(() => {
      onClose();
    }, TRANSITION_DURATION);
  };

  // Проверяем, играет ли аудио
  const isPlaying = (audioId) => activeAudio === audioId;

  // Метод для отображения контента в зависимости от вкладки
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="tab-content">
            <p>{point.description || 'Информация отсутствует'}</p>
          </div>
        );
      case 'history':
        return (
          <div className="tab-content">
            <p>{point.history || 'Историческая информация отсутствует'}</p>
          </div>
        );
      case 'photos':
        return (
          <div className="photos-content">
            {point.photos && point.photos.length > 0 ? (
              point.photos.map((photo, index) => (
                <div className="photo-item" key={photo.id || index}>
                  <img src={buildingImage} alt={photo.title || `Фото ${index + 1}`} />
                  <div className="photo-title">
                    {photo.title || `Фото ${index + 1}`}
                    {photo.isHistorical && (
                      <span className="historical-badge">Архивное</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Фотографии отсутствуют</p>
            )}
          </div>
        );
      default:
        return <p>Информация недоступна</p>;
    }
  };

  if (!point) {
    return null;
  }

  return (
    <div className={`point-card-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <div className={`point-card-fullscreen ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="point-card-header">
          <h2>{point.name}</h2>
          <button className="close-button" onClick={handleClose}>
            <IoCloseOutline />
          </button>
        </div>
        
        {/* Изображение */}
        <div className="point-card-image">
          <img src={buildingImage} alt={point.name} />
        </div>
        
        {/* Аудиогид */}
        {point.audioGuide && point.audioGuide.length > 0 && (
          <div className="point-card-audioguide">
            <h3>Аудиогид</h3>
            {point.audioGuide.map((audio, index) => (
              <div className="audio-item" key={audio.id || index}>
                <button 
                  className="play-button" 
                  onClick={() => toggleAudio(`audio-${index}`)}
                >
                  <span className="play-icon">
                    {isPlaying(`audio-${index}`) ? <FaPause /> : <FaPlay />}
                  </span>
                  {isPlaying(`audio-${index}`) ? 'Пауза' : audio.title || 'Прослушать аудиогид'}
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Табы */}
        <div className="point-card-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => handleTabChange('info')}
          >
            <span>Информация</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            <span>История</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => handleTabChange('photos')}
          >
            <span>Фотографии</span>
          </button>
        </div>
        
        {/* Контент вкладок с анимацией */}
        <div className={`point-card-content ${isContentTransitioning ? 'transitioning' : ''}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PointCard; 