import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Briefcase,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

interface TaskManagerProps {
  onOpenNewTask: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onOpenNewTask }) => {
  const { tasks, updateTaskStatus, setSelectedMatterId, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('');

  const columns: { status: TaskStatus; label: string; countColor: string }[] = [
    { status: 'Pending', label: 'Pending / Assigned', countColor: 'bg-slate-700 text-slate-300' },
    { status: 'In Progress', label: 'In Progress', countColor: 'bg-amber-500/20 text-amber-300' },
    { status: 'Review', label: 'Partner Review', countColor: 'bg-purple-500/20 text-purple-300' },
    { status: 'Complete', label: 'Completed', countColor: 'bg-emerald-500/20 text-emerald-300' }
  ];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAssignee = assigneeFilter === 'all' || t.assignedToName.includes(assigneeFilter);
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesDate = !dueDateFilter || t.deadline === dueDateFilter;

    return matchesSearch && matchesAssignee && matchesPriority && matchesDate;
  });

  const nextStatus = (curr: TaskStatus): TaskStatus => {
    if (curr === 'Pending') return 'In Progress';
    if (curr === 'In Progress') return 'Review';
    if (curr === 'Review') return 'Complete';
    return 'Complete';
  };

  const prevStatus = (curr: TaskStatus): TaskStatus => {
    if (curr === 'Complete') return 'Review';
    if (curr === 'Review') return 'In Progress';
    if (curr === 'In Progress') return 'Pending';
    return 'Pending';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Task Management & Workflow Allocation
          </h1>
          <p className="text-xs text-slate-400">
            Matter-linked legal actions, court filings, partner review cycles, and clerk summons services
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="tasks"
            reportTitle="Statutory Deadlines & Task Performance Register"
            reportSubtitle="Official register of matter-linked filings, partner review cycles, and limitation deadlines"
            sectorName="Practice Tasks & Deadlines"
            statutoryReference="Law Society of Kenya Practice Standards"
            filenamePrefix="LexisFirm_Task_Schedule"
            headers={['Task Title', 'Matter No', 'Assigned Advocate', 'Priority', 'Due Date', 'Status', 'Notes']}
            rows={filteredTasks.map(t => [
              t.title,
              t.matterNumber,
              t.assignedToName,
              t.priority,
              t.deadline,
              t.status,
              t.notes || ''
            ])}
            summaryStats={[
              { label: 'Total Tasks', value: filteredTasks.length, highlight: true },
              { label: 'Urgent Priority', value: filteredTasks.filter(t => t.priority === 'Urgent').length },
              { label: 'Pending Action', value: filteredTasks.filter(t => t.status === 'Pending').length },
              { label: 'Completed', value: filteredTasks.filter(t => t.status === 'Complete').length }
            ]}
          />

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, matter name, or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Due Date Filter with Dropdown Calendar */}
          <div className="w-40">
            <DropdownDatePicker
              value={dueDateFilter}
              onChange={(d) => setDueDateFilter(d)}
              placeholder="Due Date..."
              showPresets={true}
            />
          </div>
          {dueDateFilter && (
            <button
              onClick={() => setDueDateFilter('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Assignees</option>
            <option value="Phosta">Phosta Colliner (Partner)</option>
            <option value="Brian">Brian Mutua (Clerk)</option>
            <option value="David">David Kiprop (Senior Assoc)</option>
            <option value="Faith">Faith Akinyi (Associate)</option>
            <option value="Beatrice">Beatrice Ndinda (Accounts)</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.status);
          return (
            <div
              key={col.status}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[580px]"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {col.label}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[700px]">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                    No tasks in this lane
                  </div>
                ) : (
                  colTasks.map(task => {
                    const isOverdue = task.status !== 'Complete' && task.deadline < '2026-09-28';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all shadow-sm ${
                          isOverdue
                            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                            : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        {/* Matter Pill & Priority */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            onClick={() => {
                              setSelectedMatterId(task.matterId);
                              setActiveTab('matters');
                            }}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-bold border border-slate-700 truncate cursor-pointer hover:border-amber-400"
                          >
                            {task.matterNumber}
                          </span>

                          <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                            task.priority === 'Urgent'
                              ? 'bg-rose-500 text-white'
                              : task.priority === 'High'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="font-semibold text-white leading-snug">
                          {task.title}
                        </p>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          Matter: {task.matterTitle}
                        </p>

                        {/* Assignee & Deadline */}
                        <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[100px]">{task.assignedToName}</span>
                          </div>

                          <div className={`flex items-center gap-1 font-mono font-medium ${
                            isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{task.deadline}</span>
                          </div>
                        </div>

                        {/* Kanban Stage Advance Buttons */}
                        <div className="pt-1 flex items-center justify-between gap-1 text-[10px]">
                          {col.status !== 'Pending' ? (
                            <button
                              onClick={() => updateTaskStatus(task.id, prevStatus(task.status))}
                              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                            >
                              ← Move Back
                            </button>
                          ) : <div />}

                          {col.status !== 'Complete' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, nextStatus(task.status))}
                              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Next Stage</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
