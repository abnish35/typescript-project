import * as React from 'react';
import './TodoList.css';

interface todoItems{
    item: {id: string, text: string}[];
    onDeleteItem: (id: string)=>void;
}

const TodoList: React.FC<todoItems> =(props)=>{
    return <ul>
        {props.item.map(todo=>
        <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={props.onDeleteItem.bind(null, todo.id)}>DELETE</button>
        </li>)}
    </ul>
}

export default TodoList;