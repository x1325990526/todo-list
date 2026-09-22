import { getProjects, getActiveProject } from "../data/state.js";

/**
 * 视图状态：只影响界面，不属于领域数据，因此不走 state.js，也不会被写进 localStorage。
 * detailId: null = 抽屉收起 | "new" = 新建表单 | 其它值 = 正在查看的 todo id
 */
export const view = {
    detailId: null,
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

const GROUPS = [
    ["overdue", "逾期"],
    ["today", "今天"],
    ["tomorrow", "明天"],
    ["week", "未来 7 天"],
    ["later", "以后"],
    ["none", "无日期"],
];

const ICONS = {
    trash: '<path d="M4 7h16M6 7l1 13h10l1-13M9 7V4h6v3M10 11v6M14 11v6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
};

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

let lastDetailKey = null;

const $ = (selector) => document.querySelector(selector);

export function render() {
    const projects = getProjects();
    const active = getActiveProject();

    renderSidebar(projects, active);
    renderHeader(active);
    renderTodos(active);
    renderDetail(active);
}

/* ---------------------------------- 侧栏 ---------------------------------- */

function renderSidebar(projects, active) {
    const mount = $('[data-mount="projects"]');

    if (projects.length === 0) {
        mount.innerHTML = `<p class="hint">还没有项目</p>`;
        return;
    }

    mount.innerHTML = projects
        .map((project) => {
            const isActive = project.id === active?.id;

            return `
                <div class="project${isActive ? " is-active" : ""}" data-id="${esc(project.id)}">
                    <button class="project__open" type="button" data-action="select-project">
                        <span class="project__name">${esc(project.name)}</span>
                    </button>
                    <button class="icon-btn project__remove" type="button" data-action="remove-project"
                        aria-label="删除项目 ${esc(project.name)}">${icon("trash")}</button>
                </div>`;
        })
        .join("");
}

/* --------------------------------- 主区表头 -------------------------------- */

function renderHeader(active) {
    const title = $('[data-bind="project-name"]');
    const sub = $('[data-bind="project-sub"]');
    const addButton = $('.main [data-action="add-todo"]');

    if (!active) {
        title.textContent = "没有项目";
        sub.textContent = "先在左侧新建一个项目";
        addButton.disabled = true;
        return;
    }

    const total = active.todos.length;
    const open = active.todos.filter((todo) => !todo.completed).length;

    title.textContent = active.name;
    sub.textContent = total === 0
        ? "还没有任务"
        : `${open} 项未完成 · ${total - open} 项已完成`;
    addButton.disabled = false;
}

/* --------------------------------- 主区列表 -------------------------------- */

function renderTodos(active) {
    const mount = $('[data-mount="todos"]');

    if (!active) {
        mount.innerHTML = emptyState("先在左侧新建一个项目，再开始添加任务");
        return;
    }
    if (active.todos.length === 0) {
        mount.innerHTML = emptyState("这个项目还没有任务，点右上角「新建任务」开始");
        return;
    }

    const today = toDateString(new Date());
    const tomorrow = addDays(today, 1);
    const weekEnd = addDays(today, 6);

    const buckets = new Map(GROUPS.map(([key]) => [key, []]));
    for (const todo of active.todos) {
        buckets.get(groupKey(todo, today, tomorrow, weekEnd)).push(todo);
    }

    mount.innerHTML = GROUPS
        .filter(([key]) => buckets.get(key).length > 0)
        .map(([key, label]) => {
            const items = buckets.get(key).sort(compareTodos);
            return `
                <section class="group" data-group="${key}">
                    <h3 class="group__label">
                        ${label}<span class="group__count">${items.length}</span>
                    </h3>
                    <ul class="todos">
                        ${items.map((todo) => todoRow(todo, key)).join("")}
                    </ul>
                </section>`;
        })
        .join("");
}

function todoRow(todo, group) {
    const overdue = todo.isOverdue();
    const showDate = todo.dueDate && group !== "today" && group !== "tomorrow";
    const title = String(todo.title ?? "").trim() || "（无标题）";

    return `
        <li class="todo${todo.completed ? " is-done" : ""}" data-id="${esc(todo.id)}">
            <input class="todo__check" type="checkbox" data-action="toggle-todo"
                aria-label="${esc(title)}"${todo.completed ? " checked" : ""}>
            <button class="todo__open" type="button" data-action="open-todo">
                <span class="todo__title">${esc(title)}</span>
                <span class="todo__meta">
                    ${showDate
                        ? `<span class="todo__date${overdue ? " is-overdue" : ""}">${overdue ? "逾期 · " : ""}${esc(formatDate(todo.dueDate))}</span>`
                        : ""}
                    <span class="tag tag--${esc(todo.priority)}">${esc(PRIORITY_LABEL[todo.priority] ?? todo.priority)}</span>
                </span>
            </button>
            <button class="icon-btn todo__remove" type="button" data-action="remove-todo"
                aria-label="删除任务 ${esc(title)}">${icon("trash")}</button>
        </li>`;
}

function compareTodos(a, b) {
    return (
        Number(a.completed) - Number(b.completed) ||
        (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1) ||
        (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31")
    );
}

/* ---------------------------------- 详情 ---------------------------------- */

function renderDetail(active) {
    const panel = $('[data-mount="detail"]');
    const isNew = view.detailId === "new";
    const todo = (!isNew && active) ? (active.getTodo(view.detailId) ?? null) : null;

    if (!isNew && !todo) {
        lastDetailKey = null;
        panel.removeAttribute("data-open");
        delete panel.dataset.id;
        panel.innerHTML = "";
        return;
    }

    const key = isNew ? "new" : todo.id;

    // 同一条任务正在被输入时跳过重建，否则未保存的内容会被冲掉
    if (key === lastDetailKey && isTypingIn(panel)) return;

    lastDetailKey = key;
    panel.setAttribute("data-open", "");
    panel.dataset.id = key;
    panel.innerHTML = detailForm(todo, isNew);
}

function detailForm(todo, isNew) {
    const priority = todo?.priority ?? "medium";

    return `
        <form class="detail__form" data-role="todo-form">
            <header class="detail__header">
                <h2 class="detail__title">${isNew ? "新建任务" : "任务详情"}</h2>
                <button class="icon-btn" type="button" data-action="close-detail" aria-label="关闭">
                    ${icon("close")}
                </button>
            </header>

            <label class="field">
                <span class="field__label">标题</span>
                <input class="field__input" name="title" type="text" required autocomplete="off"
                    placeholder="要做什么？" value="${esc(todo?.title ?? "")}">
            </label>

            <label class="field">
                <span class="field__label">描述</span>
                <textarea class="field__input" name="description" rows="3"
                    placeholder="补充说明">${esc(todo?.description ?? "")}</textarea>
            </label>

            <div class="field-row">
                <label class="field">
                    <span class="field__label">截止日期</span>
                    <input class="field__input" name="dueDate" type="date" value="${esc(todo?.dueDate ?? "")}">
                </label>
                <label class="field">
                    <span class="field__label">优先级</span>
                    <select class="field__input" name="priority">
                        ${["high", "medium", "low"].map((value) => `
                            <option value="${value}"${value === priority ? " selected" : ""}>
                                ${PRIORITY_LABEL[value]}
                            </option>`).join("")}
                    </select>
                </label>
            </div>

            <label class="field">
                <span class="field__label">备注</span>
                <textarea class="field__input" name="notes" rows="4"
                    placeholder="其它信息">${esc(todo?.notes ?? "")}</textarea>
            </label>

            <footer class="detail__footer">
                ${isNew ? "" : `
                    <button class="btn btn--danger" type="button" data-action="remove-todo">删除</button>`}
                <span class="detail__spacer"></span>
                <button class="btn btn--ghost" type="button" data-action="close-detail">取消</button>
                <button class="btn btn--primary" type="submit">${isNew ? "创建" : "保存"}</button>
            </footer>
        </form>`;
}

/* ---------------------------------- 工具 ---------------------------------- */

function groupKey(todo, today, tomorrow, weekEnd) {
    if (!todo.dueDate) return "none";
    if (todo.dueDate < today) return "overdue";
    if (todo.dueDate === today) return "today";
    if (todo.dueDate === tomorrow) return "tomorrow";
    if (todo.dueDate <= weekEnd) return "week";
    return "later";
}

function formatDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const today = toDateString(new Date());
    if (dateStr === today) return "今天";
    if (dateStr === addDays(today, 1)) return "明天";
    if (dateStr === addDays(today, -1)) return "昨天";

    const [year, month, day] = dateStr.split("-").map(Number);
    return year === new Date().getFullYear()
        ? `${month}月${day}日`
        : `${year}年${month}月${day}日`;
}

function toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function addDays(dateStr, days) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return toDateString(new Date(year, month - 1, day + days));
}

function isTypingIn(root) {
    const el = document.activeElement;
    if (!el || !root.contains(el)) return false;
    return el.matches('textarea, input:not([type="checkbox"])');
}

function emptyState(message) {
    return `<p class="empty">${esc(message)}</p>`;
}

function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">${ICONS[name]}</svg>`;
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);
}
