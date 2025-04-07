import React, { useState, useRef, useEffect } from 'react';
import '../styles/AudioPlayer.css';

/**
 * Компонент аудиоплеера для воспроизведения аудиогидов
 */
const AudioPlayer = ({ audio, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Временный URL аудио для демонстрации (заменить на реальные файлы)
  const tempAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  // Обработчик загрузки метаданных аудио
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Функция обновления времени воспроизведения
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Воспроизведение/пауза аудио
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Изменение позиции воспроизведения
  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Переключение режима минимизации
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Закрытие плеера
  const closePlayer = () => {
    if (isPlaying) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    if (onClose) {
      onClose();
    }
  };

  // Форматирование времени в мм:сс
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Запускаем/останавливаем интервал обновления времени
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateTime, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className={`audio-player ${isMinimized ? 'minimized' : ''}`}>
      <audio 
        ref={audioRef} 
        src={audio?.url || tempAudioUrl} 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      {isMinimized ? (
        // Минимизированный плеер
        <div className="mini-player">
          <button className="play-pause-button" onClick={togglePlay}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <div className="mini-info">
            <span className="mini-title">{audio?.title || 'Аудиогид'}</span>
            <span className="mini-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <button className="maximize-button" onClick={toggleMinimize}>↑</button>
        </div>
      ) : (
        // Полный плеер
        <div className="full-player">
          <div className="player-header">
            <h3 className="audio-title">{audio?.title || 'Аудиогид'}</h3>
            <div className="player-controls-top">
              <button className="minimize-button" onClick={toggleMinimize}>↓</button>
              <button className="close-button" onClick={closePlayer}>×</button>
            </div>
          </div>
          
          <div className="player-progress">
            <input 
              type="range" 
              min="0" 
              max={duration || 0} 
              value={currentTime} 
              step="0.1"
              onChange={handleTimeChange}
              className="progress-slider"
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="player-controls">
            <button className="play-pause-button large" onClick={togglePlay}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer; 