import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  // Начальные координаты центра Перми
  const [lng] = useState(58.0105); // долгота
  const [lat] = useState(56.2502); // широта
  const [zoom] = useState(12); // уровень масштабирования

  // Обработчик клика по точке на карте с useCallback для стабильной ссылки на функцию
  const handlePointClick = useCallback((e) => {
    if (!map.current) return;
    
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['blue-points']
    });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const { id } = feature.properties;

    // Вместо создания всплывающего окна, сразу вызываем callback с данными точки
    const point = blueLineData.points.find(p => p.id === id);
    if (point && onPointSelect) {
      onPointSelect(point);
    }
  }, [onPointSelect]);

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
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    // Добавляем контроллеры
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.AttributionControl({
      compact: true
    }));

    // Добавляем обработчик ошибок
    map.current.on('error', (e) => {
      console.error('MapLibre GL Error:', e);
    });

    // Обработчик загрузки карты
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setIsMapLoaded(true);
      
      // Логируем доступные данные для точек
      console.log('Blue line points data:', blueLineData.points);
      
      // Создаем линию между точками
      if (blueLineData.points.length >= 2) {
        const lineCoordinates = blueLineData.points.map(point => point.coordinates);
        
        map.current.addSource('blue-line-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: lineCoordinates
            }
          }
        });
        
        map.current.addLayer({
          id: 'blue-line-route',
          type: 'line',
          source: 'blue-line-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': blueLineData.color,
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
        
        console.log('Added line between points:', lineCoordinates);
      }
      
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
  }, [lng, lat, zoom, onPointSelect, handlePointClick]);

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