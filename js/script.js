// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const burgerBtn = document.getElementById('burgerBtn');
    
    navMenu.classList.toggle('active');
    burgerBtn.classList.toggle('active');
}

// Close mobile menu
function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    const burgerBtn = document.getElementById('burgerBtn');
    
    navMenu.classList.remove('active');
    burgerBtn.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.getElementById('navMenu');
    const burgerBtn = document.getElementById('burgerBtn');
    
    if (!navbar.contains(event.target) && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        closeMenu();
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Video modal functionality
function openVideoModal(videoId) {
    console.log('Opening video modal for:', videoId);
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-modal-close" onclick="closeVideoModal()">&times;</span>
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);

    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.addEventListener('error', function() {
            closeVideoModal();
            window.open(watchUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('video-modal')) {
        closeVideoModal();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            scrollToSection(href.substring(1));
        }
    });
});

// Photo slider functionality
const galleryImages = [
    'photo/ph-1.jpg',
    'photo/ph-2.jpg',
    'photo/ph-3.jpg',
    'photo/ph-4.jpg',
    'photo/ph-5.jpg'
];

let currentSlide = 0;
let totalSlides = galleryImages.length;

function buildGallerySlides() {
    const sliderTrack = document.querySelector('.slider-track');
    const sliderDots = document.querySelector('.slider-dots');
    if (!sliderTrack || !sliderDots) return;

    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';

    galleryImages.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery photo ${index + 1}`;
        img.onload = () => {
            if (index === currentSlide) {
                requestAnimationFrame(updateSlider);
            }
        };
        slide.appendChild(img);
        sliderTrack.appendChild(slide);

        const dot = document.createElement('span');
        dot.className = `dot${index === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
}

function updateSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const container = document.querySelector('.slider-container');
    if (!sliderTrack || !container || slides.length === 0) return;

    const slideWidth = container.clientWidth;
    const offset = currentSlide * slideWidth;
    sliderTrack.style.transform = `translateX(-${offset}px)`;

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Initialize slider on page load
document.addEventListener('DOMContentLoaded', function() {
    buildGallerySlides();
    requestAnimationFrame(updateSlider);
});

window.addEventListener('load', updateSlider);
window.addEventListener('resize', () => requestAnimationFrame(updateSlider));