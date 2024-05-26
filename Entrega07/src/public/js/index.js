document.addEventListener('DOMContentLoaded', () => {
    const toggleNavButton = document.getElementById('toggle-nav');
    const navElements = document.querySelectorAll('.nav, .nav-list');

    
    toggleNavButton.addEventListener('click', () => {
        toggleNavButton.classList.toggle('open');
        navElements.forEach(navElement => {
            navElement.classList.toggle('open');
        });
        
        const header = document.getElementById('main-header');
        const navList = document.querySelector('.nav');

        const navListHeight = navList.offsetHeight;
        header.style.height = `${navListHeight}px`;
    });
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
