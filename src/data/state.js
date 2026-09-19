import Project from "./project.js";


const state = {
    projects: [],
    activeProjectId: null,
};

let onCommit = () => {
    throw new Error("state.js: 未注入 commit handler，请在 index.js 开头调用setCommitHandler(save)");
}

export function setCommitHandler(handler) {
    onCommit = handler;
}

function snapshot() {
       return { projects: state.projects, activeProjectId: state.activeProjectId };
}

function mutate(fn) {
    const result = fn();
    onCommit(snapshot());
    return result;
}

        //Innit
export function init(saved){
    if(saved){
        state.projects = saved.projects;
        state.activeProjectId = saved.activeProjectId;
    }else{
        addProject("Inbox");
    }
}

        //Read
export function getProjects(){ return [...state.projects];}
export function getActiveProject() {
    return state.projects.find((p) => p.id === state.activeProjectId) ?? null;
}

        //Write
export function addProject(name){
    return mutate(() => {
        const project = new Project(name);
        state.projects.push(project);
        state.activeProjectId = project.id;
        return project;
    });
    
}

export function setActiveProject(id) {
    mutate(() => { state.activeProjectId = id; });
}

export function addTodo(data) {
    return mutate(() => getActiveProject()?.addTodo(data) ?? null);
}

export function removeTodo(id) {
    mutate(() => getActiveProject()?.removeTodo(id));
}

export function updateTodo(id, patch) {
    return mutate(() => getActiveProject()?.updateTodo(id, patch) ?? null);
}