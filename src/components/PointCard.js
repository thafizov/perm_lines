import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import '../styles/PointCard.css';

/**
 * Компонент карточки с информацией о точке интереса
 */
const PointCard = ({ point, onClose }) => {
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState('history');
  // Состояние для отслеживания активного аудио
  const [activeAudio, setActiveAudio] = useState(null);

  // Обработчик воспроизведения аудиогида
  const handlePlayAudio = (audio) => {
    setActiveAudio(audio);
  };

  // Обработчик закрытия аудиоплеера
  const handleCloseAudio = () => {
    setActiveAudio(null);
  };

  if (!point) {
    return null;
  }

  return (
    <>
      <div className="point-card">
        <div className="point-card-header">
          <h2>{point.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="point-card-image">
          <img src={point.image} alt={point.name} />
        </div>
        
        {/* Аудиогид */}
        <div className="point-card-audioguide">
          {point.audioGuide && point.audioGuide.map(audio => (
            <div key={audio.id} className="audio-item">
              <button 
                className="play-button" 
                onClick={() => handlePlayAudio(audio)}
              >
                ▶ Слушать: {audio.title} ({audio.duration})
              </button>
            </div>
          ))}
        </div>
        
        {/* Табы */}
        <div className="point-card-tabs">
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            История
          </button>
          <button 
            className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`} 
            onClick={() => setActiveTab('photos')}
          >
            Фото
          </button>
          <button 
            className={`tab-button ${activeTab === 'how-to-get' ? 'active' : ''}`} 
            onClick={() => setActiveTab('how-to-get')}
          >
            Как добраться
          </button>
        </div>
        
        {/* Контент вкладок */}
        <div className="point-card-content">
          {activeTab === 'history' && (
            <div className="tab-content">
              <p>{point.history}</p>
            </div>
          )}
          
          {activeTab === 'photos' && (
            <div className="tab-content photos-content">
              {point.photos && point.photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <img src={photo.url} alt={photo.title} />
                  <p className="photo-title">
                    {photo.title}
                    {photo.isHistorical && <span className="historical-badge">Исторический</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'how-to-get' && (
            <div className="tab-content">
              <p>{point.howToGet}</p>
            </div>
          )}
        </div>

        {/* Добавляем отступ внизу, чтобы плавающий аудиоплеер не перекрывал контент */}
        {activeAudio && <div style={{ height: '80px' }} />}
      </div>

      {/* Аудиоплеер */}
      {activeAudio && (
        <AudioPlayer 
          audio={activeAudio} 
          onClose={handleCloseAudio} 
        />
      )}
    </>
  );
};

export default PointCard; 