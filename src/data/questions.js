export const surveyQuestions = [
  {
    id: 'travel_frequency',
    type: 'radio',
    title: 'Как часто вы путешествуете?',
    description: 'Выберите наиболее подходящий вариант',
    options: [
      { value: 'rarely', label: 'Раз в год или реже' },
      { value: 'sometimes', label: '2-4 раза в год' },
      { value: 'often', label: '5+ раз в год' },
    ],
  },

  {
    id: 'travel_type',
    type: 'checkbox',
    title: 'Какие виды путешествий вам интересны?',
    options: [
      { value: 'beach', label: 'Пляжный отдых' },
      { value: 'mountains', label: 'Горы и природа' },
      { value: 'cities', label: 'Города и культура' },
      { value: 'adventure', label: 'Экстрим и приключения' },
      { value: 'wellness', label: 'Spa и релакс' },
    ],
  },

  {
    id: 'budget',
    type: 'select',
    title: 'Какой бюджет вы обычно планируете на поездку?',
    options: [
      { value: 1, label: 'До $500' },
      { value: 5, label: '$1000–2000' },
      { value: 10, label: '$5000+' },
    ],
  },

  {
    id: 'dream_destination',
    type: 'text',
    title: 'Куда вы мечтаете поехать?',
    placeholder: 'Например: Исландия, Япония, Новая Зеландия',
  },
]
