import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/Map.css';

/**
 * Компонент карты для отображения интерактивных линий Перми
 */
function Map({ onPointSelect, hideControls, lineData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeLineId, setActiveLineId] = useState(null);

  // Начальные координаты центра Перми (точные координаты из Яндекс.Карт)
  const [lng] = useState(56.256681); // долгота
  const [lat] = useState(58.015129); // широта
  const [zoom] = useState(12); // уровень масштабирования

  // Обработчик клика по точке на карте с useCallback для стабильной ссылки на функцию
  const handlePointClick = useCallback((e) => {
    if (!map.current || !lineData) return;
    
    const pointLayerId = `${lineData.id}-points`;
    
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: [pointLayerId]
    });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const { id } = feature.properties;

    // Находим точку в данных линии
    const point = lineData.points.find(p => p.id === id);
    if (point && onPointSelect) {
      onPointSelect(point);
    }
  }, [onPointSelect, lineData]);

  // Очистка всех слоев и источников линий
  const clearLineLayers = useCallback(() => {
    if (!map.current || !isMapLoaded) return;

    // Удаляем слои и источники предыдущей линии, если они существуют
    if (activeLineId) {
      try {
        const layers = [
          `${activeLineId}-route`,
          `${activeLineId}-points`,
          `${activeLineId}-points-numbers`
        ];
        
        // Удаляем слои
        layers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.removeLayer(layerId);
          }
        });
        
        // Удаляем источники
        const sources = [
          `${activeLineId}-route-source`,
          `${activeLineId}-points-source`
        ];
        
        sources.forEach(sourceId => {
          if (map.current.getSource(sourceId)) {
            map.current.removeSource(sourceId);
          }
        });
        
        // Удаляем обработчики событий
        map.current.off('click', `${activeLineId}-points`, handlePointClick);
        map.current.off('mouseenter', `${activeLineId}-points`);
        map.current.off('mouseleave', `${activeLineId}-points`);
      } catch (error) {
        console.error('Error clearing line layers:', error);
      }
    }
  }, [activeLineId, isMapLoaded, handlePointClick]);

  // Добавление слоев для новой линии
  const addLineLayers = useCallback(() => {
    if (!map.current || !isMapLoaded || !lineData) return;
    
    const lineId = lineData.id;
    
    try {
      console.log(`Adding layers for line: ${lineId}`);
      
      // Добавляем источник данных для точек
      map.current.addSource(`${lineId}-points-source`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: lineData.points.map(point => ({
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
      
      // Добавляем слой с точками линии
      map.current.addLayer({
        id: `${lineId}-points`,
        type: 'circle',
        source: `${lineId}-points-source`,
        paint: {
          'circle-radius': 12,
          'circle-color': lineData.color,
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
      
      // Добавляем слой с номерами точек
      map.current.addLayer({
        id: `${lineId}-points-numbers`,
        type: 'symbol',
        source: `${lineId}-points-source`,
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
      
      // Создаем линию между точками
      if (lineData.points.length >= 2) {
        const lineCoordinates = lineData.points.map(point => point.coordinates);
        
        map.current.addSource(`${lineId}-route-source`, {
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
          id: `${lineId}-route`,
          type: 'line',
          source: `${lineId}-route-source`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': lineData.color,
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
        
        console.log(`Added line between ${lineData.points.length} points:`, lineCoordinates);
      }
      
      // Добавляем обработчик клика по точке
      map.current.on('click', `${lineId}-points`, handlePointClick);
      
      // Изменяем курсор при наведении на точку
      map.current.on('mouseenter', `${lineId}-points`, () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      
      // Возвращаем стандартный курсор при уходе с точки
      map.current.on('mouseleave', `${lineId}-points`, () => {
        map.current.getCanvas().style.cursor = '';
      });
      
      // Обновляем ID активной линии
      setActiveLineId(lineId);
      
    } catch (error) {
      console.error('Error adding line layers:', error);
    }
  }, [lineData, isMapLoaded, handlePointClick]);

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
            tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>'
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