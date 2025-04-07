import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/Map.css';
import blueLineData from '../data/blueLineData';

/**
 * Компонент карты для отображения интерактивных линий Перми
 */
function Map({ onPointSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeLine, setActiveLine] = useState('blue-line');

  // Начальные координаты центра Перми
  const [lng] = useState(56.2502); // долгота
  const [lat] = useState(58.0105); // широта
  const [zoom] = useState(12); // уровень масштабирования

  // Обработчик клика по точке на карте
  const handlePointClick = (e) => {
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['blue-points']
    });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const coordinates = feature.geometry.coordinates.slice();
    const { id } = feature.properties;

    // Вместо создания всплывающего окна, сразу вызываем callback с данными точки
    const point = blueLineData.points.find(p => p.id === id);
    if (point && onPointSelect) {
      onPointSelect(point);
    }
  };

  // Инициализация карты при монтировании компонента
  useEffect(() => {
    if (map.current) return; // если карта уже инициализирована, выходим
    
    // Создаем карту
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // временный стиль (заменим на кастомный)
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    // Добавляем контроллеры
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.AttributionControl({
      compact: true
    }));

    // Обработчик загрузки карты
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setIsMapLoaded(true);
      
      // Добавляем источник данных для синей линии
      map.current.addSource('blue-line-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: blueLineData.points.map(point => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: point.coordinates
            },
            properties: {
              id: point.id,
              name: point.name,
              description: point.description,
              image: point.image
            }
          }))
        }
      });

      // Добавляем слой с точками синей линии
      map.current.addLayer({
        id: 'blue-points',
        type: 'circle',
        source: 'blue-line-source',
        paint: {
          'circle-radius': 12,
          'circle-color': blueLineData.color,
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Добавляем слой с номерами точек
      map.current.addLayer({
        id: 'blue-points-numbers',
        type: 'symbol',
        source: 'blue-line-source',
        layout: {
          'text-field': ['get', 'id'],
          'text-font': ['Open Sans Bold'],
          'text-size': 12,
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Добавляем обработчик клика по точке
      map.current.on('click', 'blue-points', handlePointClick);

      // Изменяем курсор при наведении на точку
      map.current.on('mouseenter', 'blue-points', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Возвращаем стандартный курсор при уходе с точки
      map.current.on('mouseleave', 'blue-points', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });

    // Очистка при размонтировании
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom, onPointSelect]);

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

export default Map; 