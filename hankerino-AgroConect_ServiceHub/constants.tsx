import { MarketItem, ServiceItem, ViewState, ProductItem, ForumPost, SensorItem, SystemTestResult, LearningResource, Consultant } from './types';
import { LineChart, CloudSun, Calendar, Users, Store, BookOpen, Activity, Cpu, Settings, Map, Globe } from 'lucide-react';

export const MARKET_DATA: MarketItem[] = [
  { id: '1', name: 'Soja', price: 168.20, unit: 'sc 60kg', location: 'Rondonópolis, MT', change: 1.85, currency: 'R$' },
  { id: '2', name: 'Milho', price: 58.40, unit: 'sc 60kg', location: 'Cascavel, PR', change: -0.68, currency: 'R$' },
  { id: '3', name: 'Café', price: 980.50, unit: 'sc 60kg', location: 'Varginha, MG', change: 8.50, currency: 'R$' },
  { id: '4', name: 'Cana', price: 0.12, unit: 'kg ATR', location: 'Ribeirão Preto, SP', change: 0.12, currency: 'R$' },
  { id: '5', name: 'Trigo', price: 120.10, unit: 'sc 60kg', location: 'Passo Fundo, RS', change: 0.45, currency: 'R$' },
  { id: '6', name: 'Boi', price: 245.00, unit: '@', location: 'Barretos, SP', change: -0.20, currency: 'R$' },
  { id: '7', name: 'Algodão', price: 4.85, unit: 'lb', location: 'Luís Eduardo, BA', change: 1.20, currency: 'U$' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'alpha-earth',
    title: 'Alpha Earth',
    subtitle: 'Global Intelligence',
    icon: Globe,
    view: ViewState.ALPHA_EARTH,
    color: 'bg-indigo-600',
  },
  {
    id: 'geospatial',
    title: 'Geospatial Maps',
    subtitle: 'Field analytics',
    icon: Map,
    view: ViewState.GEOSPATIAL,
    color: 'bg-purple-600',
  },
  {
    id: 'my-sensors',
    title: 'My Sensors',
    subtitle: 'Manage devices',
    icon: Activity,
    view: ViewState.MY_SENSORS,
    color: 'bg-emerald-600',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    subtitle: 'Buy and sell products',
    icon: Store,
    view: ViewState.MARKETPLACE,
    color: 'bg-orange-500',
  },
  {
    id: 'learning',
    title: 'Learning Center',
    subtitle: 'Educational resources',
    icon: BookOpen,
    view: ViewState.LEARNING,
    color: 'bg-emerald-500',
  },
   {
    id: 'system-test',
    title: 'System Health',
    subtitle: 'Diagnostics',
    icon: Settings,
    view: ViewState.SYSTEM_TEST,
    color: 'bg-slate-600',
  },
  {
    id: 'weather',
    title: 'Weather Forecast',
    subtitle: 'Crop weather',
    icon: CloudSun,
    view: ViewState.WEATHER,
    color: 'bg-cyan-500',
  },
  {
    id: 'market',
    title: 'Market Prices',
    subtitle: 'Commodity trends',
    icon: LineChart,
    view: ViewState.MARKET_PRICES,
    color: 'bg-blue-500',
  },
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Subproduto de Soja (Farelo)',
    description: 'Farelo de soja para alimentação animal. Alto teor proteico e boa digestibilidade.',
    price: 1.50,
    priceUnit: '40kg bag',
    category: 'Byproducts',
    rating: 4.8,
    availability: 'Available',
    tags: [{ label: 'Byproducts', color: 'bg-blue-100 text-blue-800' }]
  },
  {
    id: '2',
    name: 'Compostagem Orgânica Premium',
    description: 'Composto orgânico rico em matéria orgânica, ideal para melhoria da estrutura do solo.',
    price: 80.00,
    priceUnit: 'm³',
    category: 'Composting',
    rating: 4.5,
    availability: 'Available',
    tags: [{ label: 'Composting', color: 'bg-blue-100 text-blue-800' }]
  },
  {
    id: '3',
    name: 'Fertilizante NPK 10-10-10',
    description: 'Fertilizante completo para uso geral em diversas culturas. Rico em nitrogênio, fósforo e potássio.',
    price: 120.00,
    priceUnit: '50kg bag',
    category: 'Fertilizers',
    rating: 4.9,
    availability: 'Available',
    tags: [{ label: 'Organic Fertilizers', color: 'bg-blue-100 text-blue-800' }]
  },
  {
    id: '4',
    name: 'Drone de Pulverização DJI Agras',
    description: 'Drone de alta capacidade para pulverização de precisão. Tanque de 30L.',
    price: 1200.00,
    priceUnit: 'per day',
    category: 'Services',
    rating: 5.0,
    availability: 'Available',
    tags: [{ label: 'Drone Services', color: 'bg-blue-100 text-blue-800' }]
  },
  {
    id: '5',
    name: 'Aluguel de GPS Agrícola',
    description: 'Sistema de orientação por satélite para tratores. Aumente a precisão do plantio.',
    price: 250.00,
    priceUnit: 'per day',
    category: 'Rentals',
    rating: 4.7,
    availability: 'Limited',
    tags: [{ label: 'GPS Rental', color: 'bg-blue-100 text-blue-800' }]
  },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  { id: '1', author: 'Roberto Mendes', avatar: 'RM', title: 'Best time to plant soybeans in Mato Grosso?', preview: 'I am planning my next cycle and wondering about the rain forecasts for late September...', replies: 24, likes: 156, tag: 'Planting', time: '2h ago' },
  { id: '2', author: 'Ana Silva', avatar: 'AS', title: 'Fighting Coffee Borer Beetle organically', preview: 'Has anyone had success with Beauveria bassiana this season? My infestation levels are...', replies: 12, likes: 89, tag: 'Pest Control', time: '5h ago' },
  { id: '3', author: 'Carlos Fermin', avatar: 'CF', title: 'New credit lines for small machinery', preview: 'The local bank just announced new rates for compact tractors. Sharing the details here...', replies: 45, likes: 342, tag: 'Finance', time: '1d ago' },
];

export const MOCK_SENSORS: SensorItem[] = [
  { id: '1', name: 'DIRTS', type: 'Degradable Intelligent', installedDate: '1/10/2025', status: 'active', iconType: 'chart', location: 'Sector A', coords: [-16.465, -54.635] },
  { id: '2', name: 'ndvi_camera', type: 'Spectral Camera', installedDate: '1/8/2025', status: 'active', iconType: 'camera', location: 'Drone Field 1', coords: [-16.468, -54.640] },
  { id: '3', name: 'Soil Moisture', type: 'Capacitive Sensor', installedDate: '1/5/2025', status: 'active', iconType: 'water', location: 'Greenhouse B', coords: [-16.470, -54.638] },
  { id: '4', name: 'Weather Station', type: 'Meteorological', installedDate: '12/15/2024', status: 'active', iconType: 'cloud', location: 'Main Office', coords: [-16.462, -54.632] },
  { id: '5', name: 'DIRTS', type: 'Degradable Intelligent', installedDate: '6/1/2024', status: 'active', iconType: 'chart', location: 'Sector C', coords: [-16.475, -54.645] },
  { id: '6', name: 'Nutrients', type: 'NPK Sensor', installedDate: '5/12/2024', status: 'active', iconType: 'lightning', location: 'Sector A', coords: [-16.466, -54.636] },
  { id: '7', name: 'ph_sensor', type: 'Chemical', installedDate: '4/5/2024', status: 'active', iconType: 'chart', location: 'Hydroponics', coords: [-16.463, -54.639] },
  { id: '8', name: 'DIRTS', type: 'Degradable Intelligent', installedDate: '3/15/2024', status: 'active', iconType: 'chart', location: 'Sector B', coords: [-16.472, -54.634] },
  { id: '9', name: 'Soil Moisture', type: 'Capacitive Sensor', installedDate: '2/10/2024', status: 'active', iconType: 'water', location: 'Sector A', coords: [-16.464, -54.637] },
];

export const MOCK_TEST_RESULTS: SystemTestResult[] = [
  {
    id: 'auth',
    name: 'User Authentication',
    status: 'success',
    message: 'Logged in as: henryquinones101@gmail.com'
  },
  {
    id: 'ai',
    name: 'AI Model (Ollama) Connection',
    status: 'failure',
    message: 'Connection failed.',
    details: 'Failed to connect. Error: Request failed with status code 500.'
  },
  {
    id: 'db',
    name: 'Database Connection',
    status: 'success',
    message: 'Connection successful!'
  }
];

export const MOCK_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'Guia Completo de Sensores Biodegradáveis DIRTS',
    description: '## Sensores DIRTS: Revolução na Agricultura de Precisão ### O que são Sensores DIRTS? Os DIRTS (Degradable Intelligent...',
    tags: [{ label: 'Sensors', color: 'bg-purple-100 text-purple-700' }, { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' }],
    duration: '15 minutes',
    author: 'AgroConect Research Team',
    level: 'Intermediate'
  },
  {
    id: '2',
    title: 'Mapeamento NDVI com Drones: Guia Prático',
    description: '## Mapeamento NDVI: Detectando a Saúde das Plantas ### O que é NDVI? O Índice de Vegetação por Diferença Normalizada (...',
    tags: [{ label: 'Remote Sensing', color: 'bg-cyan-100 text-cyan-700' }, { label: 'Advanced', color: 'bg-orange-100 text-orange-700' }],
    duration: '25 minutes',
    author: 'Instituto de Agricultura de Precisão',
    level: 'Advanced'
  },
  {
    id: '3',
    title: 'Implementação de Sensores Inteligentes na Fazenda',
    description: '## Implementando Sensores Inteligentes: Do Planejamento à Colheita ### Tipos de Sensores Disponíveis: #### 1. Sensores...',
    tags: [{ label: 'Sensors', color: 'bg-purple-100 text-purple-700' }, { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' }],
    duration: '30 minutes',
    author: 'Centro de Inovação Agrícola',
    level: 'Intermediate'
  },
  {
    id: '4',
    title: 'Boas Práticas para Uso de Drones Agrícolas',
    description: '## Segurança e Eficiência no Voo ### Checklist Pré-voo #### Verificação de Baterias... ',
    tags: [{ label: 'Drones', color: 'bg-blue-100 text-blue-700' }, { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' }],
    duration: '20 minutes',
    author: 'AgroFly Academy',
    level: 'Intermediate'
  },
   {
    id: '5',
    title: 'Agricultura de Precisão: O Futuro é Agora',
    description: '## Introdução à Agricultura de Precisão ### Tecnologias Habilitadoras #### GPS, GIS e IoT...',
    tags: [{ label: 'Precision Agriculture', color: 'bg-emerald-100 text-emerald-700' }, { label: 'Advanced', color: 'bg-orange-100 text-orange-700' }],
    duration: '40 minutes',
    author: 'University of Agriculture',
    level: 'Advanced'
  }
];

export const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: '1',
    name: 'Dr. Fernando Souza',
    specialty: 'Soil Health & Nutrition',
    rate: 150,
    rating: 4.9,
    availability: 'Available Today',
  },
  {
    id: '2',
    name: 'Eng. Mariana Costa',
    specialty: 'Irrigation Systems',
    rate: 120,
    rating: 4.8,
    availability: 'Next Available: Tomorrow',
  },
  {
    id: '3',
    name: 'Carlos Eduardo',
    specialty: 'Precision Agriculture',
    rate: 200,
    rating: 5.0,
    availability: 'Available Today',
  }
];

export const SYSTEM_INSTRUCTION = `You are AgroConect, an expert agronomist and data science assistant for farmers.
Your goal is to provide accurate, helpful, and concise information about agriculture, market prices, weather patterns, and crop management.
You have a friendly, professional tone.
When asked about market prices, refer to general trends or ask for specific crops.
When asked about weather, emphasize the importance of local data.
You can help with:
- Pest identification and control
- Soil health and fertilization
- Market trend analysis
- Weather impact on crops
- Sustainable farming practices
`;

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    alphaEarth: 'Alpha Earth',
    geospatialMaps: 'Geospatial Maps',
    marketPrices: 'Market Prices',
    weather: 'Weather',
    learningCenter: 'Learning Center',
    marketplace: 'Marketplace',
    community: 'Community',
    systemHealth: 'System Health',
    mySensors: 'My Sensors',
    backToDashboard: 'Back to Dashboard',
    heroTitle: 'AgroConect ServiceHub',
    welcomeBack: 'Welcome back',
    connected: 'Connected',
    ourServices: 'Our Services',
    featuredCourseTitle: 'Featured Course',
    featuredCourseDesc: 'Explore our latest agricultural courses and improve your farming techniques.',
    startLearning: 'Start Learning',
  },
  de: {
    dashboard: 'Armaturenbrett',
    alphaEarth: 'Alpha Earth',
    geospatialMaps: 'Georäumliche Karten',
    marketPrices: 'Marktpreise',
    weather: 'Wetter',
    learningCenter: 'Lernzentrum',
    marketplace: 'Marktplatz',
    community: 'Gemeinschaft',
    systemHealth: 'Systemgesundheit',
    mySensors: 'Meine Sensoren',
    backToDashboard: 'Zurück zum Dashboard',
    heroTitle: 'AgroConect ServiceHub',
    welcomeBack: 'Willkommen zurück',
    connected: 'Verbunden',
    ourServices: 'Unsere Dienstleistungen',
    featuredCourseTitle: 'Empfohlener Kurs',
    featuredCourseDesc: 'Entdecken Sie unsere neuesten landwirtschaftlichen Kurse und verbessern Sie Ihre Anbautechniken.',
    startLearning: 'Lernen starten',
  },
  pt: {
    dashboard: 'Painel',
    alphaEarth: 'Alpha Earth',
    geospatialMaps: 'Mapas Geoespaciais',
    marketPrices: 'Preços de Mercado',
    weather: 'Clima',
    learningCenter: 'Centro de Aprendizagem',
    marketplace: 'Mercado',
    community: 'Comunidade',
    systemHealth: 'Saúde do Sistema',
    mySensors: 'Meus Sensores',
    backToDashboard: 'Voltar ao Painel',
    heroTitle: 'AgroConect ServiceHub',
    welcomeBack: 'Bem-vindo de volta',
    connected: 'Conectado',
    ourServices: 'Nossos Serviços',
    featuredCourseTitle: 'Curso em Destaque',
    featuredCourseDesc: 'Explore nossos cursos agrícolas mais recentes e melhore suas técnicas de cultivo.',
    startLearning: 'Começar a Aprender',
  }
};