// Task type definition for the Kanban board
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'interested' | 'applied' | 'interview' | 'offer' | 'rejected';
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
