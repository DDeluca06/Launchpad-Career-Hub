import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/basic/card';
import { useState, useEffect } from 'react';

// Application statuses
const STATUSES = ['applied', 'screening', 'interview', 'offer', 'rejected'] as const;

interface Job {
  title: string;
  company: string;
}

interface Application {
  id: string;
  status: string;
  job: Job;
  updatedAt: string;
}

interface KanbanPageProps {
  applications: Application[];
  isLoading?: boolean;
}

export function KanbanPage({ applications = [], isLoading = false }: KanbanPageProps) {
  const [items, setItems] = useState(applications);

  // Update items when applications prop changes
  useEffect(() => {
    setItems(applications);
  }, [applications]);

  // Group applications by status
  const columns = STATUSES.reduce((acc, status) => {
    acc[status] = items.filter(item => item.status === status);
    return acc;
  }, {} as Record<string, Application[]>);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Don't do anything if dropped in same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Update the status locally
    const newItems = [...items];
    const itemIndex = newItems.findIndex(item => item.id === draggableId);
    if (itemIndex !== -1) {
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        status: destination.droppableId
      };
      setItems(newItems);
    }

    // Update the status in the database
    try {
      const response = await fetch(`/api/applicant/applications/${draggableId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: destination.droppableId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      // Revert the local state on error
      setItems(applications);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-5 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col space-y-4">
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 min-h-[500px] space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 space-y-2 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-5 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col space-y-4">
                <div className="font-medium capitalize text-gray-700">
                  {status} ({columns[status]?.length || 0})
                </div>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 bg-gray-50 rounded-lg p-3 min-h-[500px]"
                    >
                      {columns[status]?.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 mb-3 bg-white cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                            >
                              <h3 className="font-medium">{item.job.title}</h3>
                              <p className="text-sm text-gray-600">{item.job.company}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                Updated: {new Date(item.updatedAt).toLocaleDateString()}
                              </p>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
} 