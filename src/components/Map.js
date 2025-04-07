import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/Map.css';
// Импортируем изображение маркера
import buildingMarker from '../assets/images/dom-meshkova.png';

/**
 * Компонент карты для отображения интерактивных линий Перми
 */
function Map({ onPointSelect, hideControls, lineData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeLineId, setActiveLineId] = useState(null);

  // Начальные координаты центра Перми (точные координаты из Яндекс.Карт)
  const [lng] = useState(56.256681); // долгота
  const [lat] = useState(58.015129); // широта
  const [zoom] = useState(12); // уровень масштабирования

  // Функция для обработки выбора точки интереса
  const selectPoint = useCallback((pointData) => {
    console.log('Выбрана точка:', pointData);
    if (onPointSelect) {
      onPointSelect(pointData);
    }
  }, [onPointSelect]);

  // Очистка всех слоев и источников линий
  const clearLineLayers = useCallback(() => {
    if (!map.current || !isMapLoaded) return;

    // Удаляем кастомные маркеры
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Обновляем ID активной линии
    setActiveLineId(null);
  }, [isMapLoaded]);

  // Добавление слоев для новой линии
  const addLineLayers = useCallback(() => {
    if (!map.current || !isMapLoaded || !lineData) return;
    
    const lineId = lineData.id;
    
    try {
      console.log(`Adding layers for line: ${lineId}`);
      
      // Добавляем кастомные маркеры для каждой точки
      lineData.points.forEach(point => {
        try {
          // Создаем элемент для кастомного маркера
          const el = document.createElement('div');
          el.className = 'custom-marker';
          
          // Извлекаем RGB-компоненты цвета линии
          let color = lineData.color;
          let r, g, b;

          if (color.startsWith('#')) {
            // Преобразуем hex в RGB
            const hex = color.slice(1);
            const bigint = parseInt(hex, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
          } else if (color.startsWith('rgb')) {
            // Извлекаем RGB из строки
            const matches = color.match(/\d+/g);
            if (matches && matches.length >= 3) {
              r = parseInt(matches[0]);
              g = parseInt(matches[1]);
              b = parseInt(matches[2]);
            }
          }
          
          // Настраиваем градиентную полосу с использованием цвета линии
          const style = document.createElement('style');
          style.textContent = `
            .custom-marker[data-id="${point.id}"]:after {
              background: linear-gradient(90deg, 
                rgba(${r},${g},${b},0.85) 0%, 
                rgba(${r},${g},${b},1) 50%, 
                rgba(${r},${g},${b},0.85) 100%);
              box-shadow: 0 0 10px rgba(${r},${g},${b},0.4);
            }
          `;
          document.head.appendChild(style);
          
          // Добавляем data-id для стилизации
          el.setAttribute('data-id', point.id);
          
          // Используем импортированное изображение маркера
          const img = document.createElement('img');
          img.src = buildingMarker;
          img.alt = point.name;
          
          el.appendChild(img);
          
          // Создаем маркер и добавляем на карту
          const marker = new maplibregl.Marker({
            element: el,
            anchor: 'bottom'
          })
            .setLngLat(point.coordinates)
            .addTo(map.current);
          
          // Добавляем обработчик клика на маркер
          el.onclick = () => {
            console.log('Клик по маркеру:', point);
            selectPoint(point);
          };
          
          // Сохраняем ссылку на маркер для последующего удаления
          markers.current.push(marker);
        } catch (e) {
          console.error('Ошибка при создании маркера:', e);
        }
      });
      
      // Обновляем ID активной линии
      setActiveLineId(lineId);
      
    } catch (error) {
      console.error('Error adding line layers:', error);
    }
  }, [lineData, isMapLoaded, selectPoint]);

  // Инициализация карты при монтировании компонента
  useEffect(() => {
    if (map.current) return; // если карта уже инициализирована, выходим
    
    console.log('Initializing map with coordinates:', { lng, lat, zoom });
    
    // Создаем карту
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            maxzoom: 22,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      // Включаем поддержку pitch (наклона) для карты
      pitchWithRotate: true,
      dragRotate: true,
      pitch: 45, // Устанавливаем постоянный 3D режим с наклоном 45 градусов
      bearing: 0,
      // Улучшаем качество рендеринга
      antialias: true,
      maxPitch: 85
    });

    // Добавляем контроллеры только если не требуется их скрыть
    if (!hideControls) {
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.AttributionControl({
        compact: true
      }));
    }

    // Добавляем обработчик ошибок
    map.current.on('error', (e) => {
      console.error('MapLibre GL Error:', e);
    });
    
    // Обработчик загрузки карты
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      
      // Улучшаем качество отображения карты
      const pixelRatio = window.devicePixelRatio || 1;
      const canvas = map.current.getCanvas();
      
      // Устанавливаем более высокое разрешение для холста
      canvas.width = canvas.width * pixelRatio;
      canvas.height = canvas.height * pixelRatio;
      canvas.style.width = (canvas.width / pixelRatio) + 'px';
      canvas.style.height = (canvas.height / pixelRatio) + 'px';
      map.current.transform.pixelRatio = pixelRatio;
      map.current.resize();
      
      // Добавляем слой с эффектом атмосферы для улучшения визуализации в 3D
      map.current.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15,
          'sky-atmosphere-halo-color': 'rgba(255, 255, 255, 0.4)',
          'sky-atmosphere-color': 'rgba(186, 210, 235, 0.4)'
        }
      });
      
      setIsMapLoaded(true);
    });

    // Очистка при размонтировании
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom, hideControls]);

  // Обновление слоев при изменении lineData
  useEffect(() => {
    if (!map.current || !isMapLoaded || !lineData) return;
    
    console.log('Line data changed:', lineData.id);
    
    // Очищаем предыдущие слои
    clearLineLayers();
    
    // Добавляем новые слои
    addLineLayers();
    
  }, [lineData, isMapLoaded, clearLineLayers, addLineLayers]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map-canvas" />
      {!isMapLoaded && (
        <div className="map-loader">
          Загрузка карты...
        </div>
      )}
    </div>
  );
}

// Устанавливаем значения пропсов по умолчанию
Map.defaultProps = {
  hideControls: false
};

export default Map; 