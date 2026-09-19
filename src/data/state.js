import Project from "./project.js";
import {save} from "./storage.js"

const state = {
    projects: [],
    activeProjectId: null,
};

export function init(saved){
    if(saved){
        state.projects = saved.projects;
        state.activeProjectId = saved.activeProjectId;
    }else{
        addProject("Inbox");
    }
}

export function getProjects(){ return [...state.projects];}
export function getActiveProject() {
    return state.projects.find((p) => p.id === state.activeProjectId) ?? null;
}

export function addProject(name){
    const project = new Project(name);
    state.projects.push(project);
    state.activeProjectId = project.id;
    persist();
    return project;
    
}

export function setActiveProject(id) {
    state.activeProjectId = id;
    persist();
}

function persist() {
    save({ projects: state.projects, activeProjectId: state.activeProjectId});
}