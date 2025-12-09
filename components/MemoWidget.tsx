
import React, { useState } from 'react';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';
import { TodoItem } from '../types';

const MemoWidget: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Review PRs for Q3 release', completed: false },
    { id: '2', text: 'Gemini API Integration', completed: true },
    { id: '3', text: 'Update system metadata', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div 
        className="glass-panel w-full h-full rounded-2xl flex flex-col overflow-hidden text-white shadow-lg ring-1 ring-white/10"
        onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="h-12 bg-indigo-900/40 border-b border-white/5 flex items-center justify-between px-4 cursor-move">
        <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-300"/>
            <span className="font-semibold text-sm">Memo</span>
        </div>
        <span className="text-xs text-white/50">{todos.filter(t => !t.completed).length} pending</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 nodrag">
        {todos.map((todo) => (
          <div 
            key={todo.id}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
            onMouseDown={(e) => e.stopPropagation()} // Allow clicking inside without dragging container instantly if sensitive
          >
            <button 
              onClick={() => toggleTodo(todo.id)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-white/30 hover:border-white/60'}`}
            >
              {todo.completed && <Check size={10} className="text-white" />}
            </button>
            <span className={`flex-1 truncate ${todo.completed ? 'line-through text-white/30' : 'text-white/90'}`}>
              {todo.text}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={addTodo} className="p-2 border-t border-white/5 bg-black/20" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5 focus-within:bg-white/10 transition-colors">
          <Plus size={14} className="text-white/50" />
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task..."
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-white/30"
          />
        </div>
      </form>
    </div>
  );
};

export default MemoWidget;
