import React from 'react';
import '../styles/SideMenu.css';
import blueLineData from '../data/blueLineData';
import greenLineData from '../data/greenLineData';
import redLineData from '../data/redLineData';

/**
 * Компонент бокового меню для выбора линий и настроек
 */
const SideMenu = ({ isOpen, onClose, activeLine, onSelectLine }) => {
  const lines = [
    blueLineData,
    greenLineData,
    redLineData
  ];

  return (
    <>
      {/* Затемнение фона при открытом меню */}
      {isOpen && (
        <div className="menu-backdrop" onClick={onClose}></div>
      )}
      
      {/* Боковое меню */}
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Линии Перми</h2>
          <button className="close-menu-button" onClick={onClose}>×</button>
        </div>
        
        <div className="menu-content">
          <div className="lines-section">
            <h3>Выберите линию</h3>
            
            <div className="lines-list">
              {lines.map(line => (
                <button
                  key={line.id}
                  className={`line-button ${activeLine === line.id ? 'active' : ''}`}
                  style={{ 
                    '--line-color': line.color,
                    '--line-text-color': activeLine === line.id ? '#fff' : '#333'
                  }}
                  onClick={() => {
                    onSelectLine(line.id);
                    onClose();
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