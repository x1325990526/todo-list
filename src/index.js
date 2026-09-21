import "./styles.css";
import {
    setCommitHandler,
    init,
    getProjects,
    getActiveProject,
    addProject,
    removeProject,
    setActiveProject,
    addTodo,
    removeTodo,
    updateTodo,
} from "./data/state.js";
import { save, load, clear } from "./data/storage.js";
import { render, view } from "./ui/render.js";

setCommitHandler((snapshot) => {
    save(snapshot);
    render();
});
init(load());
render();

Object.assign(window, {
    getProjects,
    getActiveProject,
    addProject,
    removeProject,
    setActiveProject,
    addTodo,
    removeTodo,
    updateTodo,
    clear,
    render,
    view,
});

console.log(getProjects());
