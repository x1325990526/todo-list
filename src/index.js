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

setCommitHandler(save);
init(load());

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
});

console.log(getProjects());
