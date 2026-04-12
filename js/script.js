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
