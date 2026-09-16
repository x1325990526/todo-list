import resImg from "./restaurant.png";

export default function displayHome(){
    const content = document.querySelector("#content");

    const headline = document.createElement("h1");
    headline.textContent = "食意阁";

    const image = document.createElement("img");
    image.src = resImg;

    const intro = document.createElement("p");
    intro.textContent = "我们专注经典中式菜肴，兼顾南北风味。从灶火翻腾的爆炒，到文火慢炖的老汤；从江河湖海的时鲜，到田间地头的时蔬，皆由经验丰富的厨师团队每日甄选、现点现做。招牌【菜品一】皮脆肉嫩、【菜品二】鲜香醇厚、【菜品三】清润入味，再配上一壶好茶与手工点心，让一餐一饭都吃出中式饮食的讲究与温度。";

    content.appendChild(headline);
    content.appendChild(image);
    content.appendChild(intro);
}

