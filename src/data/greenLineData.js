/**
 * Данные зелёной линии (туристическая)
 */

const greenLineData = {
  id: 'green-line',
  name: 'Зелёная линия',
  description: 'Туристический маршрут по достопримечательностям Перми',
  color: '#27ae60',
  // Точки интереса на зелёной линии
  points: [
    {
      id: 'green-1',
      name: 'Пермская художественная галерея',
      description: 'Одна из крупнейших художественных галерей на Урале с коллекцией деревянной скульптуры',
      coordinates: [56.249583, 58.022187], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Художественная+галерея',
      audioGuide: [
        {
          id: 'audio-green-1-1',
          title: 'История галереи',
          url: '/audio/green-line/art-gallery-history.mp3',
          duration: '2:45'
        }
      ],
      history: `Пермская государственная художественная галерея основана в 1922 году. 
      Здесь хранится уникальная коллекция пермской деревянной скульптуры, иконопись, 
      русское искусство XVIII-XX веков, а также западноевропейское искусство.`,
      photos: [
        {
          id: 'photo-green-1-1',
          title: 'Здание галереи',
          url: 'https://via.placeholder.com/600x400?text=Галерея+Здание',
          isHistorical: false
        },
        {
          id: 'photo-green-1-2',
          title: 'Пермская деревянная скульптура',
          url: 'https://via.placeholder.com/600x400?text=Деревянная+скульптура',
          isHistorical: true
        }
      ],
      howToGet: 'Галерея находится в здании бывшего Спасо-Преображенского собора по адресу Комсомольский проспект, 4. Добраться можно на автобусах до остановки "ЦУМ".',
      type: 'building'
    },
    {
      id: 'green-2',
      name: 'Эспланада',
      description: 'Главная площадь и прогулочная зона в центре Перми',
      coordinates: [56.244681, 58.012212], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Эспланада',
      audioGuide: [
        {
          id: 'audio-green-2-1',
          title: 'Прогулка по Эспланаде',
          url: '/audio/green-line/esplanade-walk.mp3',
          duration: '2:10'
        }
      ],
      history: `Эспланада — главная площадь Перми, расположенная между улицами Ленина, Петропавловской, 
      Попова и Борчанинова. Здесь проводятся основные городские мероприятия, фестивали и праздники. 
      Зимой на Эспланаде строят ледовый городок, а в тёплое время года здесь любят отдыхать горожане.`,
      photos: [
        {
          id: 'photo-green-2-1',
          title: 'Эспланада летом',
          url: 'https://via.placeholder.com/600x400?text=Эспланада+Лето',
          isHistorical: false
        },
        {
          id: 'photo-green-2-2',
          title: 'Ледовый городок',
          url: 'https://via.placeholder.com/600x400?text=Эспланада+Зима',
          isHistorical: false
        }
      ],
      howToGet: 'Эспланада находится в самом центре города между улицами Ленина и Петропавловской. Добраться можно на любом транспорте, идущем через центр города.',
      type: 'building'
    },
    {
      id: 'green-3',
      name: 'Пермский краеведческий музей',
      description: 'Один из старейших музеев Урала с богатой экспозицией об истории и природе края',
      coordinates: [56.250148, 58.011352], // [lng, lat]
      image: 'https://via.placeholder.com/300x200?text=Краеведческий+музей',
      audioGuide: [
        {
          id: 'audio-green-3-1',
          title: 'История музея',
          url: '/audio/green-line/museum-history.mp3',
          duration: '3:25'
        }
      ],
      history: `Пермский краеведческий музей был основан в 1890 году. Сегодня это один из крупнейших 
      музеев Урала, рассказывающий об истории, культуре и природе Пермского края. Особенно известна 
      палеонтологическая коллекция и экспозиция, посвящённая пермскому геологическому периоду.`,
      photos: [
        {
          id: 'photo-green-3-1',
          title: 'Здание музея',
          url: 'https://via.placeholder.com/600x400?text=Здание+музея',
          isHistorical: false
        },
        {
          id: 'photo-green-3-2',
          title: 'Экспозиция',
          url: 'https://via.placeholder.com/600x400?text=Экспозиция+музея',
          isHistorical: false
        }
      ],
      howToGet: 'Музей находится по адресу Монастырская, 11. Добраться можно на автобусах до остановки "Драмтеатр" или "ЦУМ".',
      type: 'building'
    }
  ]
};

export default greenLineData; 