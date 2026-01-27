// Global variables
let particles = [];
let mouseX = 0;
let mouseY = 0;

// Add loading class to body immediately
document.body.classList.add('loading');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeLoader();
    initializeCursor();
    initializeNavigation();
    initializeParticles();
    initializeScrollAnimations();
    initializeProjectFilters();
    initializeProjectModal();
    initializeSkillsAnimations();
    initializeCounters();
    initializeFormAnimations();
    initializeMobileMenu();
    
    // Remove loading screen after 2.5 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        document.body.classList.remove('loading');
        loadingScreen.classList.add('fade-out');
        
        // Ensure body can scroll again
        setTimeout(() => {
            document.body.style.overflow = 'visible';
        }, 500);
    }, 2500);
}

// Loading Screen Animation
function initializeLoader() {
    // Keep body from scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Animate loader text with typewriter effect
    const loaderText = document.querySelector('.loader-text');
    if (loaderText) {
        let text = 'HICHAM ADERDOUR';
        loaderText.textContent = ''; // Start empty
        let currentText = '';
        let index = 0;
        
        // Start typing after a short delay
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    currentText += text[index];
                    loaderText.textContent = currentText;
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 80);
        }, 500);
    }
}

// Custom Cursor
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    // Cursor animations
    function animateCursor() {
        // Main cursor follows mouse immediately
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        // Follower cursor lags behind
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;
        
        follower.style.left = followerX - 20 + 'px';
        follower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, .nav-link, .cta-button, .submit-button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.2)';
            follower.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
    });
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // CTA Button scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = aboutSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Particle System
function initializeParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 80; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: x,
            y: y,
            originalX: x,
            originalY: y
        });
    }
    
    // Mouse interaction with particles
    particlesContainer.addEventListener('mousemove', (e) => {
        const rect = particlesContainer.getBoundingClientRect();
        const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;
        
        particles.forEach((particle, index) => {
            const distance = Math.sqrt(
                Math.pow(particle.x - mouseXPercent, 2) +
                Math.pow(particle.y - mouseYPercent, 2)
            );
            
            if (distance < 15) {
                const angle = Math.atan2(particle.y - mouseYPercent, particle.x - mouseXPercent);
                const force = (15 - distance) / 15;
                const moveX = Math.cos(angle) * force * 3;
                const moveY = Math.sin(angle) * force * 3;
                
                particle.x = particle.originalX + moveX;
                particle.y = particle.originalY + moveY;
                
                particle.element.style.left = particle.x + '%';
                particle.element.style.top = particle.y + '%';
                particle.element.style.transform = 'scale(1.5)';
                particle.element.style.opacity = '1';
            } else {
                // Return to original position
                particle.x += (particle.originalX - particle.x) * 0.1;
                particle.y += (particle.originalY - particle.y) * 0.1;
                
                particle.element.style.left = particle.x + '%';
                particle.element.style.top = particle.y + '%';
                particle.element.style.transform = 'scale(1)';
                particle.element.style.opacity = '0.8';
            }
        });
    });
    
    // Reset particles when mouse leaves
    particlesContainer.addEventListener('mouseleave', () => {
        particles.forEach(particle => {
            particle.element.style.transform = 'scale(1)';
            particle.element.style.opacity = '0.8';
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Specific animations for different elements
                if (entry.target.classList.contains('skill-item')) {
                    setTimeout(() => animateSkillBar(entry.target), 200);
                }
                
                if (entry.target.classList.contains('stat-item')) {
                    setTimeout(() => animateCounter(entry.target.querySelector('.stat-number')), 300);
                }
                
                if (entry.target.classList.contains('circle-skill')) {
                    setTimeout(() => animateCircularProgress(entry.target), 400);
                }
                
                // Stagger animation for project cards
                if (entry.target.classList.contains('project-card')) {
                    const cards = document.querySelectorAll('.project-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = (index * 0.1) + 's';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(`
        .section-title, 
        .section-line, 
        .about-description, 
        .stat-item, 
        .project-card, 
        .skill-item, 
        .circle-skill,
        .contact-info,
        .contact-form
    `);
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Project Filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'Tous' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Project Modal
function initializeProjectModal() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.querySelector('.modal-image img');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');

    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        overlay.addEventListener('click', () => {
            const title = card.querySelector('.project-title').textContent;
            const description = card.querySelector('.project-description').textContent;
            const imgSrc = card.querySelector('.project-image img').src;

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalImage.src = imgSrc;

            modal.classList.add('show');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Skills Animations
function initializeSkillsAnimations() {
    function animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress');
        const targetWidth = progressBar.getAttribute('data-width');
        
        // Reset width first
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = targetWidth + '%';
        }, 100);
    }
    
    function animateCircularProgress(circleSkill) {
        const percentage = circleSkill.getAttribute('data-percentage');
        const degrees = (percentage / 100) * 360;
        
        // Reset background first
        circleSkill.style.background = 'conic-gradient(#fff 0deg, #333 0deg)';
        
        setTimeout(() => {
            circleSkill.style.background = `conic-gradient(#fff ${degrees}deg, #333 ${degrees}deg)`;
        }, 200);
    }
    
    // Make functions available globally
    window.animateSkillBar = animateSkillBar;
    window.animateCircularProgress = animateCircularProgress;
}

// Counter Animation
function initializeCounters() {
    function animateCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'));
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second at 60fps
        const duration = 2000;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counterElement.textContent = Math.floor(current);
        }, stepTime);
    }
    
    // Make function available globally
    window.animateCounter = animateCounter;
}

// Form Animations
function initializeFormAnimations() {
    const form = document.querySelector('.contact-form');
    const inputs = document.querySelectorAll('.form-input');
    
    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentNode.classList.remove('focused');
            }
        });
        
        // Check for pre-filled values
        if (input.value !== '') {
            input.parentNode.classList.add('focused');
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (name && email && message) {
                // Simulate sending
                const submitButton = form.querySelector('.submit-button');
                const originalText = submitButton.querySelector('span').textContent;
                
                submitButton.querySelector('span').textContent = 'Envoi en cours...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                
                setTimeout(() => {
                    submitButton.querySelector('span').textContent = 'Message envoyé !';
                    submitButton.style.background = '#28a745';
                    submitButton.style.borderColor = '#28a745';
                    
                    setTimeout(() => {
                        submitButton.querySelector('span').textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.background = 'transparent';
                        submitButton.style.borderColor = '#fff';
                        form.reset();
                        
                        // Reset input focus states
                        inputs.forEach(input => {
                            input.parentNode.classList.remove('focused');
                        });
                    }, 2000);
                }, 1500);
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Parallax Effect (subtle)
function initializeParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Hero section parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroOffset = scrolled * 0.2;
            hero.style.transform = `translateY(${heroOffset}px)`;
        }
        
        // Morphing shape parallax
        const morphingShape = document.querySelector('.morphing-shape');
        if (morphingShape) {
            const shapeOffset = scrolled * 0.1;
            morphingShape.style.transform = `translateY(${-shapeOffset}px) rotate(${scrolled * 0.05}deg)`;
        }
        
        ticking = false;
    }
    
    function requestParallaxTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxTick);
}

// Add dynamic CSS animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        .project-card {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
            transform: translateY(30px);
        }
        
        .project-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .about-description.animate {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .contact-info.animate,
        .contact-form.animate {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .glitch-effect {
            position: relative;
            animation: glitch 2s infinite;
        }
        
        @keyframes glitch {
            0%, 90%, 100% {
                transform: translate(0);
            }
            10% {
                transform: translate(-2px, 1px);
            }
            20% {
                transform: translate(2px, -1px);
            }
            30% {
                transform: translate(-1px, 2px);
            }
            40% {
                transform: translate(1px, -2px);
            }
            50% {
                transform: translate(-2px, 1px);
            }
            60% {
                transform: translate(2px, -1px);
            }
            70% {
                transform: translate(-1px, 2px);
            }
            80% {
                transform: translate(1px, -2px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize enhanced effects after DOM load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addDynamicStyles();
        initializeParallax();
    }, 3000); // Start after loading screen
});

// Smooth page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle additional scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add some extra visual feedback
document.addEventListener('DOMContentLoaded', () => {
    // Add loading complete event
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Trigger entrance animations
        const elementsToAnimate = document.querySelectorAll('.hero-content > *');
        elementsToAnimate.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = `fadeInUp 0.8s ease forwards`;
            }, index * 200);
        });
    }, 3000);
});