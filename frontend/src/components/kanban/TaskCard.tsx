'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '@/types';
import { Calendar, Clock, CheckCircle2, AlertCircle, GripVertical, Trash2, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete?: (id: string) => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isAdmin,
  onStatusChange,
  onDelete,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isOverdue =
    task.dueDate &&
    task.status !== 'COMPLETED' &&
    new Date(task.dueDate).getTime() < Date.now();

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-xl p-4 border transition-all duration-200 ${
        isDragging
          ? 'opacity-40 border-forest-400 shadow-sm'
          : isOverlay
          ? 'shadow-2xl ring-2 ring-forest-500 scale-105 rotate-1 border-forest-300'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Header: Priority Badge & Drag Handle */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${getPriorityBadge(
            task.priority,
          )}`}
        >
          {task.priority || 'NORMAL'}
        </span>

        <div className="flex items-center space-x-1">
          {isAdmin && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this task?')) onDelete(task.id);
              }}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1.5 rounded transition-all"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Footer Info: Due Date, Assignee, Status quick switcher */}
      <div className="pt-2.5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          {/* Assignee Avatar */}
          <div className="flex items-center space-x-2">
            {task.employee?.avatarUrl ? (
              <img
                src={task.employee.avatarUrl}
                alt={task.employee.fullName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                title={`Assigned to: ${task.employee.fullName} (${task.employee.department || task.employee.role})`}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                <User className="w-3 h-3" />
              </div>
            )}
            <span className="text-[11px] font-medium text-slate-700 truncate max-w-[90px] sm:max-w-[110px]">
              {task.employee?.fullName?.split(' ')[0] || 'Unassigned'}
            </span>
          </div>

          {/* Due Date or Completed Timestamp */}
          <div className="flex items-center space-x-1 text-[11px]">
            {task.status === 'COMPLETED' ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            ) : formattedDueDate ? (
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium ${
                  isOverdue
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-600 bg-slate-50'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400" />
                )}
                {formattedDueDate}
              </span>
            ) : null}
          </div>
        </div>

        {/* Quick mobile status dropdown */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
          <span>Move to:</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:ring-1 focus:ring-forest-500 focus:outline-none"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
