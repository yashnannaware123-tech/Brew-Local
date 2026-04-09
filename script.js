// Mobile menu toggle
const toggle = document.querySelector(".nav-mobile-toggle");

toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
});

// Scroll effect
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".nav");
    nav.classList.toggle("scrolled", window.scrollY > 50);
});

// Animation on scroll
const elements = document.querySelectorAll(".animate-on-scroll");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("visible");
        }
    });
});