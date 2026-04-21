const sliderState = {
    currentSlide: 0,
    isReady: false,
    slides: [],
    dots: [],
    sliderTrack: null,
    sliderContainer: null,
};

function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    const burgerBtn = document.getElementById("burgerBtn");
    if (!navMenu || !burgerBtn) return;

    navMenu.classList.toggle("active");
    burgerBtn.classList.toggle("active");
}

function closeMenu() {
    const navMenu = document.getElementById("navMenu");
    const burgerBtn = document.getElementById("burgerBtn");
    if (!navMenu || !burgerBtn) return;

    navMenu.classList.remove("active");
    burgerBtn.classList.remove("active");
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    closeMenu();
    element.scrollIntoView({ behavior: "smooth" });
}

function openVideoModal(videoId) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const modal = document.createElement("div");

    modal.className = "video-modal";
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-modal-close" onclick="closeVideoModal()">&times;</span>
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" style="border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);

    const iframe = modal.querySelector("iframe");
    if (iframe) {
        iframe.addEventListener("error", () => {
            closeVideoModal();
            window.open(watchUrl, "_blank", "noopener,noreferrer");
        });
    }

    document.body.style.overflow = "hidden";
}

function closeVideoModal() {
    const modal = document.querySelector(".video-modal");
    if (!modal) return;

    modal.remove();
    document.body.style.overflow = "auto";
}

function updateSlider() {
    const { sliderTrack, sliderContainer, slides, dots, currentSlide } = sliderState;
    if (!sliderTrack || !sliderContainer || slides.length === 0) return;

    const slideWidth = sliderContainer.clientWidth;
    const offset = currentSlide * slideWidth;
    sliderTrack.style.transform = `translateX(-${offset}px)`;

    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

function goToSlide(index) {
    if (!sliderState.isReady) return;
    sliderState.currentSlide = index;
    updateSlider();
}

function prevSlide() {
    if (!sliderState.isReady) return;
    const totalSlides = sliderState.slides.length;
    sliderState.currentSlide = (sliderState.currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function nextSlide() {
    if (!sliderState.isReady) return;
    const totalSlides = sliderState.slides.length;
    sliderState.currentSlide = (sliderState.currentSlide + 1) % totalSlides;
    updateSlider();
}

function debounce(callback, delay) {
    let timeoutId;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => callback(...args), delay);
    };
}

function initSlider() {
    if (sliderState.isReady) return;

    const sliderTrack = document.querySelector(".slider-track");
    const sliderContainer = document.querySelector(".slider-container");
    const sliderDots = document.querySelector(".slider-dots");
    if (!sliderTrack || !sliderContainer || !sliderDots) return;

    const slides = Array.from(sliderTrack.querySelectorAll(".slide"));
    if (slides.length === 0) return;

    sliderDots.innerHTML = "";
    const dots = slides.map((_, index) => {
        const dot = document.createElement("span");
        dot.className = `dot${index === 0 ? " active" : ""}`;
        dot.addEventListener("click", () => goToSlide(index));
        sliderDots.appendChild(dot);
        return dot;
    });

    sliderState.sliderTrack = sliderTrack;
    sliderState.sliderContainer = sliderContainer;
    sliderState.slides = slides;
    sliderState.dots = dots;
    sliderState.currentSlide = 0;
    sliderState.isReady = true;

    requestAnimationFrame(updateSlider);
}

function initSliderWhenVisible() {
    const photoSection = document.getElementById("photo");
    if (!photoSection) return;

    if (!("IntersectionObserver" in window)) {
        initSlider();
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (!isVisible) return;

        initSlider();
        currentObserver.disconnect();
    }, { rootMargin: "120px 0px" });

    observer.observe(photoSection);
}

document.addEventListener("click", (event) => {
    const navbar = document.querySelector(".navbar");
    const navMenu = document.getElementById("navMenu");
    if (!navbar || !navMenu) return;

    if (!navbar.contains(event.target) && navMenu.classList.contains("active")) {
        closeMenu();
    }

    if (event.target.classList.contains("video-modal")) {
        closeVideoModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function onAnchorClick(e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            e.preventDefault();
            scrollToSection(href.substring(1));
        });
    });

    initSliderWhenVisible();
});

window.addEventListener("load", () => {
    if (sliderState.isReady) {
        updateSlider();
    }
});
window.addEventListener("resize", debounce(() => {
    if (sliderState.isReady) {
        requestAnimationFrame(updateSlider);
    }
}, 120));

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.scrollToSection = scrollToSection;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;