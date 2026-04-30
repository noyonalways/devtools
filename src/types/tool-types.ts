import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'formatters' | 'encoders' | 'generators' | 'converters' | 'security' | 'utilities' | 'visual' | 'ai';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
}

export interface ToolState {
  activeToolId: string;
}
