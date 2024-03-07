let hamburger = document.querySelector('.hamburger');
let userContainer = document.querySelector('.userContainer');
hamburger.addEventListener('click', () => {
    userContainer.classList.toggle('open');
    hamburger.classList.toggle('rotate');
});