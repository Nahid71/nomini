'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle, Eye, Sparkles } from 'lucide-react';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  isAdmin: boolean;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete?: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  isAdmin,
  onStatusChange,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  const getColumnConfig = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return {
          icon: <Circle className="w-4 h-4 text-slate-500" />,
          accent: 'border-t-slate-400',
          badgeBg: 'bg-slate-100 text-slate-700',
          containerBg: 'bg-slate-50/60',
        };
      case 'IN_PROGRESS':
        return {
          icon: <Clock className="w-4 h-4 text-blue-500 animate-spin-slow" />,
          accent: 'border-t-blue-500',
          badgeBg: 'bg-blue-100 text-blue-800',
          containerBg: 'bg-blue-50/30',
        };
      case 'IN_REVIEW':
        return {
          icon: <Eye className="w-4 h-4 text-amber-500" />,
          accent: 'border-t-amber-500',
          badgeBg: 'bg-amber-100 text-amber-800',
          containerBg: 'bg-amber-50/30',
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
          accent: 'border-t-emerald-500',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          containerBg: 'bg-emerald-50/30',
        };
    }
  };

  const config = getColumnConfig(id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 w-full max-w-full md:max-w-sm rounded-2xl border border-slate-200/80 ${
        config.containerBg
      } transition-colors border-t-4 ${config.accent} ${
        isOver ? 'ring-2 ring-forest-500/50 bg-forest-50/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {config.icon}
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            {title}
          </h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.badgeBg}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Task List */}
      <div className="flex-1 p-2 space-y-2.5 overflow-y-auto min-h-[350px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isAdmin={isAdmin}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
            <Sparkles className="w-5 h-5 text-slate-300 mb-1" />
            <p className="text-xs text-slate-400 font-medium">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};
