/**
 * Данные красной линии (романтическая)
 */

const redLineData = {
  id: 'red-line',
  name: 'Красная линия',
  description: 'Романтический маршрут по самым атмосферным местам Перми',
  color: '#e74c3c',
  // Точки интереса на красной линии
  points: [
    {
      id: 'red-1',
      name: 'Набережная Камы',
      description: 'Живописная набережная реки Камы – одно из самых романтичных мест города',
      coordinates: [56.231481, 58.011092], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Набережная+Камы',
      audioGuide: [
        {
          id: 'audio-red-1-1',
          title: 'Истории набережной',
          url: '/audio/red-line/kama-embankment.mp3',
          duration: '2:30'
        }
      ],
      history: `Набережная реки Камы – одно из любимых мест отдыха пермяков. Отсюда открывается
      живописный вид на реку и противоположный берег. После реконструкции набережная стала
      современным пространством для прогулок, отдыха и романтических встреч.`,
      photos: [
        {
          id: 'photo-red-1-1',
          title: 'Закат на набережной',
          url: 'https://via.placeholder.com/600x400?text=Закат+на+набережной',
          isHistorical: false
        },
        {
          id: 'photo-red-1-2',
          title: 'Набережная в 1970-х',
          url: 'https://via.placeholder.com/600x400?text=Набережная+1970',
          isHistorical: true
        }
      ],
      howToGet: 'Набережная Камы расположена в центре города. Можно добраться на автобусах до остановки "Речной вокзал" или "Кафедральный собор".',
      type: 'landmark'
    },
    {
      id: 'red-2',
      name: 'Мост влюбленных',
      description: 'Железнодорожный мост через Каму, который стал символичным местом для влюбленных пар',
      coordinates: [56.264681, 58.004172], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Мост+влюбленных',
      audioGuide: [
        {
          id: 'audio-red-2-1',
          title: 'Романтические истории моста',
          url: '/audio/red-line/love-bridge.mp3',
          duration: '2:15'
        }
      ],
      history: `Пермские молодожены облюбовали это место, повесив на перила моста множество замочков как символ крепкой любви. 
      Отсюда открывается великолепный вид на город и реку Каму. По вечерам здесь особенно красиво – можно
      наблюдать закат и огни города.`,
      photos: [
        {
          id: 'photo-red-2-1',
          title: 'Замочки на мосту',
          url: 'https://via.placeholder.com/600x400?text=Замочки+любви',
          isHistorical: false
        },
        {
          id: 'photo-red-2-2',
          title: 'Вид на реку',
          url: 'https://via.placeholder.com/600x400?text=Вид+на+Каму',
          isHistorical: false
        }
      ],
      howToGet: 'Мост находится недалеко от железнодорожного вокзала Пермь-I. Можно добраться на автобусах и трамваях до остановки "Пермь-I".',
      type: 'landmark'
    },
    {
      id: 'red-3',
      name: 'Сад им. Миндовского',
      description: 'Уютный сад с романтическими аллеями и фонтаном',
      coordinates: [56.258492, 57.997513], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Сад+Миндовского',
      audioGuide: [
        {
          id: 'audio-red-3-1',
          title: 'Прогулка по саду',
          url: '/audio/red-line/mindovsky-garden.mp3',
          duration: '1:55'
        }
      ],
      history: `Сад имени Миндовского назван в честь пермского купца и мецената Николая Миндовского. 
      Это уютное место для отдыха с аллеями, скамейками и фонтаном привлекает влюбленные пары своей
      атмосферой спокойствия и тишины, особенно в вечернее время.`,
      photos: [
        {
          id: 'photo-red-3-1',
          title: 'Аллеи сада',
          url: 'https://via.placeholder.com/600x400?text=Аллеи+сада',
          isHistorical: false
        },
        {
          id: 'photo-red-3-2',
          title: 'Фонтан',
          url: 'https://via.placeholder.com/600x400?text=Фонтан+в+саду',
          isHistorical: false
        }
      ],
      howToGet: 'Сад им. Миндовского находится в Индустриальном районе Перми. Добраться можно на автобусах и трамваях до остановки "Сад Миндовского".',
      type: 'landmark'
    }
  ]
};

export default redLineData; 