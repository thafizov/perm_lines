import React, { useState, useEffect } from 'react';
import '../styles/SideMenu.css';
import blueLineData from '../data/blueLineData';
import greenLineData from '../data/greenLineData';
import redLineData from '../data/redLineData';
import { IoCloseOutline } from 'react-icons/io5';

/**
 * Компонент бокового меню для выбора линий и настроек
 */
const SideMenu = ({ isOpen, onClose, activeLine, onSelectLine }) => {
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const lines = [
    blueLineData,
    greenLineData,
    redLineData
  ];

  // Эффект для управления анимациями
  useEffect(() => {
    if (isOpen) {
      // Сначала показываем backdrop
      setIsBackdropVisible(true);
      // Затем запускаем анимацию появления меню
      setTimeout(() => {
        setAnimationClass('open animate-in');
      }, 50);
    } else {
      // Сначала запускаем анимацию исчезновения
      setAnimationClass('animate-out');
      // Затем полностью скрываем backdrop через 400мс
      setTimeout(() => {
        setIsBackdropVisible(false);
      }, 400);
    }
  }, [isOpen]);

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    setAnimationClass('animate-out');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <>
      {/* Затемнение фона при открытом меню */}
      {isBackdropVisible && (
        <div 
          className={`menu-backdrop ${isOpen ? 'fade-in' : 'fade-out'}`} 
          onClick={handleClose}
        ></div>
      )}
      
      {/* Боковое меню */}
      <div className={`side-menu ${animationClass}`}>
        <div className="menu-header">
          <h2>Линии Перми</h2>
          <button className="close-menu-button" onClick={handleClose}>
            <IoCloseOutline />
          </button>
        </div>
        
        <div className="menu-content">
          <div className="lines-section">
            <h3>Выберите линию</h3>
            
            <div className="lines-list">
              {lines.map((line, index) => (
                <button
                  key={line.id}
                  className={`line-button ${activeLine === line.id ? 'active' : ''}`}
                  style={{ 
                    '--line-color': line.color,
                    '--line-text-color': activeLine === line.id ? '#fff' : '#333',
                    animationDelay: `${100 + index * 50}ms`
                  }}
                  onClick={() => {
                    onSelectLine(line.id);
                    handleClose();
                  }}
                >
                  <div className="line-icon" style={{ backgroundColor: line.color }}></div>
                  <div className="line-info">
                    <span className="line-name">{line.name}</span>
                    <span className="line-description">{line.description}</span>
                  </div>
                  <div className="line-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="about-section">
            <h3>О проекте</h3>
            <p>
              Интерактивные линии Перми — некоммерческий проект для популяризации 
              городской среды, туризма и предпринимательской истории города Перми.
            </p>
            <div className="project-version">Версия 1.0</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu; 