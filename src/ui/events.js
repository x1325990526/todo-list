import {
    getProjects,
    getActiveProject,
    addProject,
    removeProject,
    setActiveProject,
    addTodo,
    removeTodo,
    updateTodo,
} from "../data/state.js";
import { render, view } from "./render.js";

/**
 * 事件层：整个界面只在 document 上挂一次委托监听，把 DOM 操作翻译成 state 的调用。
 * 写操作统一由 commit handler 负责保存和重绘，这里只在需要时改动 view（纯界面状态）。
 */
const ACTIONS = {
    "add-project": handleAddProject,
    "select-project": handleSelectProject,
    "remove-project": handleRemoveProject,
    "add-todo": handleAddTodo,
    "open-todo": handleOpenTodo,
    "close-detail": handleCloseDetail,
    "remove-todo": handleRemoveTodo,
};

export function initEvents() {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("change", onDocumentChange);
    document.addEventListener("submit", onDocumentSubmit);
    document.addEventListener("keydown", onDocumentKeydown);
}

/* ---------------------------------- 分发 ---------------------------------- */

function onDocumentClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    ACTIONS[trigger.dataset.action]?.(trigger);
}

function onDocumentChange(event) {
    const trigger = event.target.closest('[data-action="toggle-todo"]');
    if (!trigger) return;

    const id = datasetId(trigger);
    if (id) updateTodo(id, { completed: trigger.checked });
}

function onDocumentSubmit(event) {
    const form = event.target.closest('[data-role="todo-form"]');
    if (!form) return;

    event.preventDefault();
    submitTodoForm(form);
}

function onDocumentKeydown(event) {
    if (event.key === "Escape" && view.detailId !== null) closeDetail();
}

/* --------------------------------- 项目操作 -------------------------------- */

function handleAddProject() {
    const input = window.prompt("新项目名称");
    if (input === null) return;

    const name = input.trim();
    if (!name) return;

    view.detailId = null;
    addProject(name);
}

function handleSelectProject(trigger) {
    const id = datasetId(trigger);
    if (!id || id === getActiveProject()?.id) return;

    view.detailId = null;
    setActiveProject(id);
}

function handleRemoveProject(trigger) {
    const id = datasetId(trigger);
    const project = getProjects().find((item) => item.id === id);
    if (!project) return;

    if (!window.confirm(`删除项目「${project.name}」？该项目下的任务会一起删除。`)) return;

    view.detailId = null;
    removeProject(id);
}

/* --------------------------------- 任务操作 -------------------------------- */

function handleAddTodo() {
    if (!getActiveProject()) return;

    view.detailId = "new";
    render();
    document.querySelector('[data-mount="detail"] input[name="title"]')?.focus();
}

function handleOpenTodo(trigger) {
    const id = datasetId(trigger);
    if (!id) return;

    view.detailId = id;
    render();
}

function handleRemoveTodo(trigger) {
    const id = datasetId(trigger);
    if (!id) return;

    if (view.detailId === id) view.detailId = null;
    removeTodo(id);
}

function handleCloseDetail() {
    closeDetail();
}

function submitTodoForm(form) {
    const target = view.detailId;
    if (target === null) return;

    const fields = Object.fromEntries(new FormData(form));
    const patch = {
        title: String(fields.title ?? "").trim(),
        description: String(fields.description ?? "").trim(),
        dueDate: fields.dueDate || null,
        priority: fields.priority,
        notes: String(fields.notes ?? "").trim(),
    };

    if (!patch.title) return;

    view.detailId = null;
    if (target === "new") addTodo(patch);
    else updateTodo(target, patch);
}

/* ---------------------------------- 工具 ---------------------------------- */

function closeDetail() {
    view.detailId = null;
    render();
}

function datasetId(element) {
    const scope = element.closest("[data-id]");
    const id = scope?.dataset.id;
    if (!id || id === "new") return null;
    return id;
}
