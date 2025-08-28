import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  // Other fields
}

const ProjectBoard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // Group tasks by status
  const onDragEnd = (result: DropResult) => {
    // Handle status update via API
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Render columns */}
    </DragDropContext>
  );
};

export default ProjectBoard;