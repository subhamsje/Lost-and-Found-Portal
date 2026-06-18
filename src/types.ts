export type ItemStatus = 'lost' | 'found' | 'reunited';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Documents' | 'Keys' | 'Accessories' | 'Study Gear' | 'Clothing' | 'Valuables';
  location: string;
  dateReported: string; // ISO string or simple date
  status: ItemStatus;
  reward?: string;
  contactEmail: string;
  founderOrLoserName: string;
  accentColor: 'blue' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';
  icon: string; // emoji or lucide icon name
  specs?: string; // specific details (serial, stickers, etc.)
  views: number;
}

export interface SuccessStory {
  id: string;
  title: string;
  itemTitle: string;
  description: string;
  author: string;
  dateReunited: string;
  emoji: string;
  accent: string;
}

export interface UniversityStat {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  isPositive: boolean;
  color: string;
}
