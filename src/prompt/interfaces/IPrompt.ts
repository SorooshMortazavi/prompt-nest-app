export interface IPrompt {
  id: string;
  title: string;
  description: string;
  category: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'archived';
  isFavorite: boolean;
}
