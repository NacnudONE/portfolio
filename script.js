// Крок 4.3: мобільне меню (бургер)
const navToggle = document.querySelector('.main-nav__toggle');
const navList = document.querySelector('.main-nav__list');

function closeMenu() {
    navList.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle.addEventListener('click', toggleMenu);

navList.querySelectorAll('.main-nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

// ---------- Галерея/lightbox для скріншотів проєктів ----------
const lightbox = document.querySelector('.lightbox');
const lightboxDialog = lightbox.querySelector('.lightbox__dialog');
const lightboxStage = lightbox.querySelector('.lightbox__stage');
const lightboxCloseEls = lightbox.querySelectorAll('[data-lightbox-close]');
const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
const lightboxNext = lightbox.querySelector('.lightbox__nav--next');

let galleryImages = [];
let galleryIndex = 0;
let galleryTrigger = null;

function renderGallerySlide() {
    const src = galleryImages[galleryIndex];
    lightboxStage.innerHTML = src
        ? `<img class="lightbox__image" src="${src}" alt="">`
        : `<div class="lightbox__placeholder"><span>screenshot-${galleryIndex + 1}.png</span></div>`;
}

const LIGHTBOX_TRANSITION_MS = 300;

function openLightbox(images, trigger) {
    galleryImages = images;
    galleryIndex = 0;
    galleryTrigger = trigger;
    renderGallerySlide();
    lightbox.hidden = false;
    requestAnimationFrame(() => {
        lightbox.classList.add('is-visible');
    });
    lightboxDialog.focus();
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
    lightbox.classList.remove('is-visible');
    document.removeEventListener('keydown', handleLightboxKeydown);
    if (galleryTrigger) {
        galleryTrigger.focus();
    }
    setTimeout(() => {
        lightbox.hidden = true;
    }, LIGHTBOX_TRANSITION_MS);
}

function showPrevSlide() {
    galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    renderGallerySlide();
}

function showNextSlide() {
    galleryIndex = (galleryIndex + 1) % galleryImages.length;
    renderGallerySlide();
}

function handleLightboxKeydown(event) {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrevSlide();
    if (event.key === 'ArrowRight') showNextSlide();
}

document.querySelectorAll('.project-card__preview[data-gallery]').forEach((preview) => {
    const openFromPreview = () => {
        const images = JSON.parse(preview.dataset.gallery);
        openLightbox(images, preview);
    };

    preview.addEventListener('click', openFromPreview);
    preview.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFromPreview();
        }
    });
});

lightboxCloseEls.forEach((el) => el.addEventListener('click', closeLightbox));
lightboxPrev.addEventListener('click', showPrevSlide);
lightboxNext.addEventListener('click', showNextSlide);

// ---------- Модалка запуску гри (iframe) ----------
const PLAY_TRANSITION_MS = 300;

const playModal = document.querySelector('.play-modal');
const playModalIframe = playModal.querySelector('.play-modal__iframe');
const playModalCloseEls = playModal.querySelectorAll('[data-play-close]');

let playTrigger = null;

function openPlayModal(url, trigger) {
    playTrigger = trigger;
    playModalIframe.src = url;
    playModal.hidden = false;
    requestAnimationFrame(() => {
        playModal.classList.add('is-visible');
    });
    document.addEventListener('keydown', handlePlayModalKeydown);
}

playModalIframe.addEventListener('load', () => {
    if (playModalIframe.src) {
        playModalIframe.focus();
    }
});

function closePlayModal() {
    playModal.classList.remove('is-visible');
    document.removeEventListener('keydown', handlePlayModalKeydown);
    if (playTrigger) {
        playTrigger.focus();
    }
    setTimeout(() => {
        playModal.hidden = true;
        playModalIframe.src = '';
    }, PLAY_TRANSITION_MS);
}

function handlePlayModalKeydown(event) {
    if (event.key === 'Escape') closePlayModal();
}

document.querySelectorAll('[data-play-url]').forEach((button) => {
    button.addEventListener('click', () => {
        openPlayModal(button.dataset.playUrl, button);
    });
});

playModalCloseEls.forEach((el) => el.addEventListener('click', closePlayModal));
