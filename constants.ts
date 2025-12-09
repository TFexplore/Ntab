
import { SidebarTab, SearchEngine, Widget } from './types';
import { 
  Home, 
  Bot, 
  StickyNote, 
  Code2, 
  Palette, 
  Wrench, 
  Settings,
  Briefcase,
  Gamepad2,
  Coffee,
  Music,
  Video,
  Book,
  Globe,
  Zap
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { id: SidebarTab.HOME, icon: Home, label: 'Home' },
];

export const BOTTOM_SIDEBAR_ITEMS = [
  { id: SidebarTab.SETTINGS, icon: Settings, label: 'Settings' },
];

export const ICON_MAP: Record<string, any> = {
  'Home': Home,
  'Briefcase': Briefcase,
  'Code': Code2,
  'Design': Palette,
  'Game': Gamepad2,
  'Life': Coffee,
  'Music': Music,
  'Video': Video,
  'Study': Book,
  'Web': Globe,
  'Tools': Wrench,
  'Zap': Zap,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const SEARCH_ENGINES: SearchEngine[] = [
  { 
    name: 'Bing', 
    url: 'https://www.bing.com/search?q=', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_Fluent_Logo.svg',
    placeholder: 'Search Bing...'
  },
  { 
    name: 'Baidu', 
    url: 'https://www.baidu.com/s?wd=', 
    icon: 'https://www.baidu.com/favicon.ico',
    placeholder: '百度一下...'
  },
  { 
    name: 'Google', 
    url: 'https://www.google.com/search?q=', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    placeholder: 'Search Google...'
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/DuckDuckGo_Logo.svg',
    placeholder: 'Search DuckDuckGo...'
  }
];

export const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1635326444826-06c8f7110110?q=80&w=2940&auto=format&fit=crop'; // Mecha/Sci-fi aesthetic

export const INITIAL_WIDGETS: Widget[] = [
  {
    id: 'memo-1',
    type: 'memo',
    position: { x: 50, y: 50 },
    size: 'large',
    zIndex: 1
  },
  {
    id: 'theme-1',
    type: 'shortcut',
    title: 'Gradient',
    url: '#',
    iconText: 'G',
    backgroundColor: 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)',
    position: { x: 380, y: 160 },
    size: 'small',
    zIndex: 1
  }
];

export const WIDGET_COLORS = [
  { name: 'white', value: 'rgba(255, 255, 255, 0.95)', label: 'White' },
  { name: 'blue', value: 'rgba(59, 130, 246, 0.9)', label: 'Blue' },
  { name: 'green', value: 'rgba(34, 197, 94, 0.9)', label: 'Green' },
  { name: 'orange', value: 'rgba(245, 158, 11, 0.9)', label: 'Orange' },
  { name: 'red', value: 'rgba(239, 68, 68, 0.9)', label: 'Red' },
  { name: 'transparent', value: 'rgba(255, 255, 255, 0.1)', label: 'Glass' },
];
