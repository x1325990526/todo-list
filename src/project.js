
import TodoItem from "./todoItem";



export class Project {

    constructor(name = "Inbox"){
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }

    addTodo(data){
        const todo = new TodoItem(data);
        this.todos.push(todo);
        return todo;
    }

    removeTodo(id){
        this.todos = this.todos.filter((t) => t.id !== id);
    }
    getTodo(id) { 
        return this.todos.find((t) => t.id === id); 
    }

    updateTodo(id, patch) {
        const todo = this.getTodo(id);
        if(!todo) throw new Error(`Todo not found: ${id}`);
        Object.assign(todo, patch);
        return todo;
    }
    
}