const navList = document.querySelector(".nav-list");
document.querySelector(".hamburger").onclick = () => {
    navList.classList.add("show")
}
document.querySelector(".close").onclick = () => {
    navList.classList.remove("show")
}
// var Swiper = new Swiper(".myswiper", {
//     navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//     },
// });

