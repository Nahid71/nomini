'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { api } from '@/lib/api';
import { Task, TaskStatus, User } from '@/types';
import { useAuthStore } from '@/lib/store/authStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { StaffManagementModal } from '../admin/StaffManagementModal';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review / QA' },
  { id: 'COMPLETED', title: 'Completed' },
];

export const KanbanBoard: React.FC = () => {
  const { currentUser, token } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'ALL' | TaskStatus>('ALL');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [employees, setEmployees] = useState<User[]>([]);

  const isAdmin = currentUser?.role === 'ADMIN';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px drag to initiate drag, avoiding unintended clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      setIsRefreshing(true);
      const employeeFilter = selectedEmployee !== 'ALL' ? selectedEmployee : undefined;
      const data = await api.getTasks(employeeFilter);
      setTasks(data);
      setErrorNotification(null);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setErrorNotification(err.message || 'Failed to fetch tasks from backend');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, selectedEmployee]);

  const loadEmployees = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
    loadEmployees();
  }, [fetchTasks, loadEmployees, currentUser]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const foundTask = tasks.find((t) => t.id === active.id);
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Check if over a column or over another task
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    let targetStatus: TaskStatus;

    if (isOverColumn) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
    }

    if (activeTaskItem.status !== targetStatus) {
      setTasks((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, status: targetStatus } : t)),
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Determine intended status
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    let newStatus: TaskStatus;

    if (isOverColumn) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      newStatus = overTask ? overTask.status : 'TODO';
    }

    const currentTask = tasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    const previousStatus = currentTask.status;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null,
            }
          : t,
      ),
    );

    // Call Section 7 Backend API: PATCH /api/v1/tasks/:id/status
    try {
      await api.updateTaskStatus(activeId, newStatus);
      setSuccessNotification(`Task updated to ${newStatus}`);
      setTimeout(() => setSuccessNotification(null), 3000);
    } catch (err: any) {
      console.error('PATCH /api/v1/tasks/:id/status failed:', err);
      // Revert optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, status: previousStatus } : t)),
      );
      setErrorNotification(
        `Update failed: ${err.message || 'Permission denied or network error'}`,
      );
      setTimeout(() => setErrorNotification(null), 5000);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const original = tasks.find((t) => t.id === id);
    if (!original) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );

    try {
      await api.updateTaskStatus(id, newStatus);
      setSuccessNotification(`Task status updated to ${newStatus}`);
      setTimeout(() => setSuccessNotification(null), 3000);
    } catch (err: any) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: original.status } : t)),
      );
      setErrorNotification(err.message || 'Status update failed');
      setTimeout(() => setErrorNotification(null), 5000);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessNotification('Task deleted successfully');
      setTimeout(() => setSuccessNotification(null), 3000);
    } catch (err: any) {
      setErrorNotification(err.message || 'Failed to delete task');
      setTimeout(() => setErrorNotification(null), 5000);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.employee?.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      selectedPriority === 'ALL' || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  // Calculate metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReviewCount = tasks.filter((t) => t.status === 'IN_REVIEW').length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 border border-forest-200">
                Operations & Team RBAC
              </span>
              <span className="text-xs text-slate-400">
                Active Role: <strong className="text-slate-800">{currentUser?.role || 'Guest'}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Agritech Team Management Kanban
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live drag-and-drop workflow tracking farm duties, cold-chain checks, and harvest operations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchTasks}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh tasks"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-forest-600' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsStaffModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-xs"
                >
                  <UserPlus className="w-4 h-4 text-rose-600" />
                  <span>Manage Staff</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md shadow-forest-600/20 transition-all flex items-center space-x-1.5 hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign New Task</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span>Staff Clearance Active ({currentUser?.role})</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Tasks</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{totalCount}</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase">To Do</div>
            <div className="text-xl font-black text-slate-700 mt-0.5">{todoCount}</div>
          </div>
          <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100">
            <div className="text-[11px] font-bold text-blue-600 uppercase">In Progress</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">{inProgressCount}</div>
          </div>
          <div className="bg-amber-50/60 rounded-2xl p-3.5 border border-amber-100">
            <div className="text-[11px] font-bold text-amber-600 uppercase">In Review</div>
            <div className="text-xl font-black text-amber-900 mt-0.5">{inReviewCount}</div>
          </div>
          <div className="bg-emerald-50/60 rounded-2xl p-3.5 border border-emerald-100 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold text-emerald-600 uppercase">Completed</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xl font-black text-emerald-900">{completedCount}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorNotification && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorNotification}</span>
          </div>
          <button onClick={() => setErrorNotification(null)} className="text-rose-500 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {successNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successNotification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, staff, lots..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Employee Filter (Active for Admin) */}
          {isAdmin && (
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500">Staff:</span>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="ALL">All Assignees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-500">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Column Switcher Tab Bar */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 text-xs">
        <button
          onClick={() => setActiveMobileTab('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeMobileTab === 'ALL'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({filteredTasks.length})
        </button>
        {COLUMNS.map((col) => {
          const count = filteredTasks.filter((t) => t.status === col.id).length;
          const isActive = activeMobileTab === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-forest-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{col.title}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-forest-800 text-forest-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Drag & Drop Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const isHiddenOnMobile = activeMobileTab !== 'ALL' && activeMobileTab !== col.id;
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className={isHiddenOnMobile ? 'hidden md:block' : 'block'}>
                <KanbanColumn
                  id={col.id}
                  title={col.title}
                  tasks={columnTasks}
                  isAdmin={isAdmin}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              </div>
            );
          })}
        </div>

        {/* Drag Overlay when moving a card */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              isAdmin={isAdmin}
              onStatusChange={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={fetchTasks}
      />

      {/* Staff Management Modal for Admin */}
      {isAdmin && (
        <StaffManagementModal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          onStaffChanged={loadEmployees}
        />
      )}
    </div>
  );
};
