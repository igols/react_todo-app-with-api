import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (value: number) => void;
  loading: boolean;
  handleUppCompleted: (todos: Todo) => void;
  newTitle: string;
  setNewTitle: (newTitle: string) => void;
  handleUppEdit: (todos: Todo) => void;
  setLoading: (value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  loading,
  handleUppCompleted,
  newTitle,
  setNewTitle,
  handleUppEdit,
  setLoading,
}) => {
  const [edited, setEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edited]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newTitle.trim() === todo.title) {
        setEdited(false);
      } else {
        inputRef.current?.blur();
      }
    }

    if (e.key === 'Escape') {
      setEdited(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`${todo.id}`}
          defaultChecked={todo.completed}
          disabled={loading}
          onClick={() => {
            handleUppCompleted(todo);
          }}
        />
      </label>

      {edited ? (
        <input
          ref={inputRef}
          type="text"
          className="todo__title-field"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value.trim())}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            handleUppEdit(todo);
            setEdited(false);
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEdited(true);
            setLoading(true);
            setNewTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={loading}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
