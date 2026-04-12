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

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Show success message
    alert('Спасибо! Ваше сообщение было отправлено. Я свяжусь с вами в ближайшее время.');
    
    // Reset form
    form.reset();
}

// Video modal functionality
function openVideoModal(videoId) {
    console.log('Opening video modal for:', videoId);
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-modal-close" onclick="closeVideoModal()">&times;</span>
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);
    
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

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe gallery items, service cards, and testimonial cards
    const elements = document.querySelectorAll('.gallery-item, .service-card, .testimonial-card');
    elements.forEach(el => observer.observe(el));
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

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
let currentSlide = 0;
const totalSlides = 6;

function updateSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const offset = currentSlide * (100 / 6);
    sliderTrack.style.transform = `translateX(-${offset}%)`;
    
    // Update active slide class
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.classList.remove('active');
        // The center slide is at index (currentSlide + 2) % totalSlides  
        if (index === (currentSlide + 2) % totalSlides) {
            slide.classList.add('active');
        }
    });
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
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
    updateSlider();
});
