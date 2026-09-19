
import TodoItem from "./todoItem.js";


const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
export default class Project {

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
    
    sortTodo(){
        return this.todos.sort(
            (a, b) => 
                a.completed - b.completed ||
                PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
                (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31")
        );
    }

    toJSON() {
        return { 
            id: this.id, 
            name: this.name, 
            todos: this.todos 
        };
    }

    static fromJSON({id, name, todos = [] }){
        const project = new Project(name);
        if(id) project.id = id;
        project.todos = todos.map((t) => new TodoItem(t));
        return project;
    }
}