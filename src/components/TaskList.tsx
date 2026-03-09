import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Check, Circle, Trash2, Clock } from 'lucide-react';
import './TaskList.css';

interface Task {
  id: string;
  title: string;
  tag: string;
  pomodoros: number;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Read OS chapter 1', tag: 'OS', pomodoros: 2, completed: false },
  { id: '2', title: 'DBMS ER diagram assignment', tag: 'DBMS', pomodoros: 1, completed: false },
  { id: '3', title: 'Practice DSA problems (arrays)', tag: 'DSA', pomodoros: 3, completed: false }
];

// Sortable Item Component
const SortableTaskItem: React.FC<{
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    boxShadow: isDragging ? 'var(--shadow-md)' : 'none',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      
      <button className="task-checkbox" onClick={() => onToggle(task.id)}>
        {task.completed ? <Check size={18} className="check-icon" /> : <Circle size={18} />}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span className="task-tag">{task.tag}</span>
          {task.pomodoros > 0 && (
            <span className="task-pomo-badge">
              <Clock size={12} /> {task.pomodoros}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions group">
        <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};


const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomo, setNewTaskPomo] = useState('');

  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      tag: 'General',
      pomodoros: parseInt(newTaskPomo) || 0,
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskPomo('');
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="card task-list-card">
      <div className="task-list-header">
        <h2 className="card-title">Tasks for Today</h2>
      </div>

      <form className="task-add-form" onSubmit={addTask}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="What are you working on?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="task-input"
          />
          <input 
            type="number" 
            placeholder="Est. Pomodoros" 
            value={newTaskPomo}
            onChange={(e) => setNewTaskPomo(e.target.value)}
            className="task-pomo-input"
            min="1"
            max="10"
          />
        </div>
        <button type="submit" className="add-task-btn" disabled={!newTaskTitle.trim()}>
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </form>

      <div className="tasks-container">
        {activeTasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks for today — add one to get started</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeTasks} strategy={verticalListSortingStrategy}>
            <div className="task-list active-tasks">
              {activeTasks.map(task => (
                <SortableTaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {completedTasks.length > 0 && (
          <div className="completed-section">
            <h3 className="section-title">Completed ({completedTasks.length})</h3>
            <div className="task-list completed-tasks">
              {completedTasks.map(task => (
                <div key={task.id} className="task-item completed">
                  <div className="task-drag-handle disabled">
                    <GripVertical size={16} />
                  </div>
                  <button className="task-checkbox" onClick={() => toggleTask(task.id)}>
                    <Check size={18} className="check-icon" />
                  </button>
                  <div className="task-content">
                    <span className="task-title">{task.title}</span>
                  </div>
                  <button className="icon-btn undo-btn" onClick={() => toggleTask(task.id)}>
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
