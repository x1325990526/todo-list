
import TodoItem from "./todoItem";


const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
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
    
    sorted(){
        return this.todos.sort(
            (a, b) => 
                a.completed - b.completed ||
                PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
                a.dueDate.localeCompare(b.dueDate)
        );
    }
}