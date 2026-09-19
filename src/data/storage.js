import Project from "./project.js";

const KEY = "todo-list";
const VERSION = 1;

export function save(data) {
    const payload = {
        version: VERSION,
        activeProjectId: data.activeProjectId,
        projects: data.projects,
    };
    try {
        localStorage.setItem(KEY, JSON.stringify(payload));
    }catch (err){
        console.error("保存失败:", err);
    }

}

export function load(){
    const raw  = localStorage.getItem(KEY);
    if(raw === null) return null;

    let data;
    try{
        data = JSON.parse(raw);
    }catch(err) {
        console.error("存档不是合法 JSON, 已忽略: ", err);
        return null;
    }
    
    if(data?.version !== VERSION) {
        console.warn(`存档版本 ${data?.version} 与当前 ${VERSION} 不符，已忽略`);
        return null;
    }

    const projects = ((data.projects ?? []).map((p) => Project.fromJSON(p)));
    return {
        projects,
        activeProjectId: projects.some((p) => p.id === data.activeProjectId)
        ? data.activeProjectId : projects[0]?.id ?? null,
    };
}

export function clear() {
    localStorage.removeItem(KEY);
}