export default function displayMenu(){

    const content = document.querySelector("#content");

    const dish1 = document.createElement("div")
    dish1.classList.add("dish");

    const dish1Title = document.createElement("h2");
    dish1Title.textContent = "菜单一：双人雅集套餐（2位）";
    const dish1Description = document.createElement("p");
    dish1Description.textContent = "凉菜：桂花糯米藕、椒麻鸡 热菜：清蒸鲈鱼、宫保鸡丁、蒜蓉时蔬汤羹：西湖牛肉羹主食：扬州炒饭 / 米饭2碗甜品：桂花酒酿圆子价格：【￥198/套】适合：情侣约会、两人便餐";
    dish1.appendChild(dish1Title);
    dish1.appendChild(dish1Description);

    content.appendChild(dish1);
}