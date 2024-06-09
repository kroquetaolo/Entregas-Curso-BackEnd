const profileMenu = document.getElementById('profile-menu');

document.addEventListener('DOMContentLoaded', () => {
    const toggleNavButton = document.getElementById('toggle-nav');
    const navElements = document.querySelectorAll('.nav, .nav-list');


    toggleNavButton.addEventListener('click', () => {
        toggleNavButton.classList.toggle('open');
        navElements.forEach(navElement => {
            navElement.classList.toggle('open');
        });
        profileMenu.classList.remove('show');
        
        const header = document.getElementById('main-header');
        const navList = document.querySelector('.nav');

        const navListHeight = navList.offsetHeight;
        header.style.height = `${navListHeight}px`;
    });
    
});

// PROFILE DROPDOWN 

const toggleProfile = document.getElementById('profile-menu-toggle');

toggleProfile.addEventListener('click', () => {
    profileMenu.classList.toggle('show');
})

// PROFILE MODAL

const profileModal = document.getElementById('modal-profile');

const toggleRegister = document.getElementById('profile-menu-register');
const menuRegister = document.getElementById('profile-register');


toggleRegister.addEventListener('click', () => {
    menuRegister.classList.add('show');
    profileMenu.classList.toggle('show');
    profileModal.classList.toggle('show');
})

const toggleLogin = document.getElementById('profile-menu-login');
const menuLogin = document.getElementById('profile-login');

toggleLogin.addEventListener('click', () => {
    menuLogin.classList.add('show');
    profileMenu.classList.toggle('show');
    profileModal.classList.toggle('show');
})

document.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-modal')) {
        const targetElement = event.target;
        if(!toggleRegister.contains(targetElement) && !toggleLogin.contains(targetElement)) {
            menuRegister.classList.remove('show');
            menuLogin.classList.remove('show');
            profileModal.classList.remove('show');
        }
    }
});

window.addEventListener('load', function() {
    const paginationMain = document.querySelector('.pagination-main');
    const activeItem = document.getElementById('pagination-main-active');

    if (paginationMain && activeItem) {
        const containerWidth = paginationMain.clientWidth;
        const itemWidth = activeItem.offsetWidth;
        const itemOffsetLeft = activeItem.offsetLeft;
        const scrollPosition = itemOffsetLeft - (containerWidth / 2) + (itemWidth / 2);
        const centerOffset = (containerWidth - itemWidth) / 2;
        const finalScrollPosition = scrollPosition - centerOffset;

        paginationMain.scroll({ left: finalScrollPosition, behavior: 'smooth' });
    }
});
