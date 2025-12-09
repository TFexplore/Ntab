
export interface SearchEngine {
  name: string;
  url: string;
  icon: string;
  placeholder: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum SidebarTab {
  HOME = 'home',
  AI = 'ai',
  MEMO = 'memo',
  DEV = 'dev',
  DESIGN = 'design',
  TOOLS = 'tools',
  SETTINGS = 'settings'
}

export type WidgetType = 'shortcut' | 'memo';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface Widget {
  id: string;
  type: WidgetType;
  title?: string;
  url?: string;
  icon?: string; // Image URL
  iconText?: string; // Text to display if no image
  backgroundColor?: string;
  position: { x: number; y: number };
  size: WidgetSize;
  zIndex: number;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetId?: string; // ID of the widget clicked, or undefined if background
}

export interface Desktop {
  id: string;
  label: string;
  icon: string; // Key for the icon component
  wallpaper: string;
}
