export default function displayAbout() {
    const content = document.querySelector("#content");

    const title = document.createElement("h1");
    title.textContent = "联系我们";
    const description = document.createElement("p");
    description.textContent = "我们期待您的光临。无论是订座、包间、宴会、外送、团餐，还是媒体合作，欢迎通过以下方式联系。";

    const contact = document.createElement("h1");
    contact.textContent = "联系方式";
    const contactAll = document.createElement("p");
    contactAll.textContent = "地址： 香港中环皇后大道中 999 号 明珠大厦 2 楼 201 室 电话： +852 5555 0101 WhatsApp: +852 5555 0102 邮箱： info@mingzhu.example 营业时间： 11:00-22:00(最后点餐 21:30)";

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(contact);
    content.appendChild(contactAll);
}