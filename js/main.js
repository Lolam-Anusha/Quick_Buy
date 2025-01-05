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

/* ========== User Form =========== */
const formWrapper = document.querySelector(".form-wrapper");
const inputs = document.querySelectorAll(".form-box input[type = 'password']");
const icons = [...document.querySelectorAll(".form-icon")];
const spans = [...document.querySelectorAll(".form-box .top span")];
const userForm = document.querySelector(".user-form");

[".user-icon", ".user-link"].forEach((p) => {
  document.querySelector(p).onclick = () => {
    userForm.classList.add("show");
    navList.classList.remove("show");
  };
});

document.querySelector(".close-form").onclick = () => {
  userForm.classList.remove("show");
};

spans.map((span) => {
  span.addEventListener("click", (e) => {
    const color = e.target.dataset.id;
    formWrapper.classList.toggle("active");
    userForm.classList.toggle("active");
    document.querySelector(":root").style.setProperty("--custom", color);
  });
});

Array.from(inputs).map((input) => {
  icons.map((icon) => {
    icon.innerHTML = `<i class="fas fa-eye">`;

    icon.addEventListener("click", () => {
      const type = input.getAttribute("type");
      if (type === "password") {
        input.setAttribute("type", "text");
        icon.innerHTML = `<i class='bx bxs-low-vision'></i>`;
      } else if (type === "text") {
        input.setAttribute("type", "password");
        icon.innerHTML = `<i class="fas fa-eye">`;
      }
    });
  });
});