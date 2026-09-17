export default class TodoItem {
    constructor({
        id = crypto.randomUUID(),
        title,
        description = "",
        dueDate = null,        // "YYYY-MM-DD" 字符串，不是 Date 对象
        priority = "medium",   // "low" | "medium" | "high"
        notes = "",
        completed = false,
        createdAt = new Date().toISOString(),
    } = {}){
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    toggle(){
        this.completed = !this.completed;
    }

    isOverdue(today = new Date()){
        if(!this.dueDate || this.completed) return false;
        return new Date(`${this.dueDate}T00:00:00`) < new Date(today.toDateString());
    }

    toJSON() {
        return{
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            notes: this.notes,
            completed: this.completed,
            createdAt: this.createdAt,
        };
    }

}
