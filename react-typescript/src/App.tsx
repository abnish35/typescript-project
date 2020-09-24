import React, { useState } from 'react';
import './App.css';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { Todo } from './components/Todo.model';

const App: React.FC =()=> {
  const [todos, setTodos] = useState<Todo[]>([])

  const todoAddHandler=(text: string)=>{
    setTodos( prevState=> [...prevState, {id: Math.random().toString(), text: text}])
  }

  const onDeletehandler=(todoId: string)=>{
     setTodos( prevTodos=>{
      return prevTodos.filter(todo=>  todo.id !== todoId);
     });
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
     <TodoList item={todos} onDeleteItem={onDeletehandler} />
    </div>
  );
}

export default App;
