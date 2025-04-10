// Task type definition for the Kanban board
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
