// index.js

import "./styles.css";

import displayHome from "./home.js";
import displayMenu from "./menu.js";
import displayAbout from "./about.js";

displayHome();

const nav = document.querySelector("nav");
const content =document.querySelector("#content");

nav.addEventListener("click", (e) => {
    const selected = e.target
    if(!selected.matches("button")) return;
    if(selected.classList.contains("home")) {
        content.textContent = "";
        displayHome();
    }
    if(selected.classList.contains("menu")) {
        content.textContent = "";
        displayMenu();
    }
    if(selected.classList.contains("about")) {
        content.textContent = "";
        displayAbout();
    }
});