import React, { useRef } from 'react'
import './NewTodo.css';

type NewTodoProps={
    onAddTodo: (todoProps: string)=> void;
}

const NewTodo: React.FC<NewTodoProps> =(props)=>{

    const inputItem = useRef<HTMLInputElement>(null)

    const handleTodoSubmit=(e: React.FormEvent)=>{
        e.preventDefault();
        const enteredText = inputItem.current!.value;
        props.onAddTodo(enteredText)
    }

    return (
        <form onSubmit={handleTodoSubmit}>
            <div className="form-control">
                <label htmlFor="todo element">Todo Element</label>
                <input type="text" placeholder="enter the item" ref={inputItem} />
            </div>
            <button type="submit">ADD TODO</button>
        </form>
    )
}

export default NewTodo;