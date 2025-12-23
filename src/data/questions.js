// questions.js
export const surveyQuestions = [
  {
    id: 'travel_frequency',
    type: 'radio',
    title: 'Как часто вы путешествуете?',
    description: 'Выберите наиболее подходящий вариант',
    options: [
      { value: '1', label: 'Раз в год или реже' },
      { value: '2', label: '2-4 раза в год' },
      { value: '3', label: '5+ раз в год' },
    ],
  },
  {
    id: 'travel_type',
    type: 'checkbox',
    title: 'Какие виды путешествий вам интересны?',
    options: [
      { value: '1', label: 'Пляжный отдых' },
      { value: '2', label: 'Горы и природа' },
      { value: '3', label: 'Города и культура' },
      { value: '4', label: 'Экстрим и приключения' },
      { value: '5', label: 'Spa и релакс' },
    ],
  },
  {
    id: 'budget',
    type: 'select',
    title: 'Какой бюджет вы обычно планируете на поездку?',
    options: [
      { value: '1', label: 'До $500' },
      { value: '2', label: '$500-$1000' },
      { value: '3', label: '$1000-$2000' },
      { value: '4', label: '$2000-$5000' },
      { value: '5', label: '$5000+' },
    ],
  },
  {
    id: 'dream_destination',
    type: 'text',
    title: 'Куда вы мечтаете поехать?',
    placeholder: 'Например: Исландия, Япония, Новая Зеландия',
  },
]
