// ================================
// Portfolio JavaScript - Professional Implementation
// ================================

'use strict';

// ================================
// Global Variables and Configuration
// ================================

const CONFIG = {
    typing: {
        roles: [
            'Electrical Engineer',
            'MEP Specialist', 
            'Quality Control Expert',
            'Circuit Designer',
            'Embedded Systems Developer'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        delay: 2000
    },
    animations: {
        observerOptions: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        skillsDelay: 500
    },
    skills: {
        data: [
            { label: 'Circuit Design', value: 90 },
            { label: 'MATLAB/Simulink', value: 85 },
            { label: 'C Programming', value: 80 },
            { label: 'Quality Control', value: 88 },
            { label: 'MEP Systems', value: 85 },
            { label: 'Embedded Systems', value: 75 }
        ]
    }
};

// ================================
// DOM Elements Cache
// ================================

const elements = {
    loader: document.getElementById('loader'),
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    typedText: document.getElementById('typed-text'),
    contactForm: document.getElementById('contactForm'),
    skillBars: document.querySelectorAll('.skill-progress'),
    statNumbers: document.querySelectorAll('.stat-number'),
    sections: document.querySelectorAll('.section'),
    cursor: document.querySelector('.cursor'),
    cursorFollower: document.querySelector('.cursor-follower'),
    skillsChart: document.getElementById('skillsChart'),
    scrollIndicator: document.querySelector('.scroll-indicator')
};

// ================================
// Utility Functions
// ================================

const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Linear interpolation for smooth animations
    lerp: (start, end, factor) => start + (end - start) * factor,

    // Get element offset from top
    getOffset: (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    },

    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Format phone number
    formatPhone: (phone) => {
        return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};

// ================================
// Loading Screen Handler
// ================================

class LoadingScreen {
    constructor() {
        this.loader = elements.loader;
        this.loadingBar = document.querySelector('.loader-bar');
        this.progress = 0;
        this.init();
    }

    init() {
        this.simulateLoading();
        this.preloadAssets();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
            this.updateProgress();
        }, 150);
    }

    updateProgress() {
        if (this.loadingBar) {
            this.loadingBar.style.width = `${this.progress}%`;
        }
    }

    preloadAssets() {
        const images = document.querySelectorAll('img[src]');
        let loadedImages = 0;
        
        if (images.length === 0) return;

        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        this.progress = 100;
                        setTimeout(() => this.hide(), 300);
                    }
                });
            }
        });
    }

    hide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            document.body.style.overflow = '';
            // Initialize other components after loading
            setTimeout(() => {
                this.loader.style.display = 'none';
                app.init();
            }, 500);
        }
    }
}

// ================================
// Custom Cursor Handler
// ================================

class CustomCursor {
    constructor() {
        this.cursor = elements.cursor;
        this.follower = elements.cursorFollower;
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        if (this.cursor && this.follower && window.innerWidth > 768) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        });

        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = `translate(-50%, -50%) scale(1.5)`;
                this.follower.style.transform = `translate(-50%, -50%) scale(1.2)`;
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
                this.follower.style.transform = `translate(-50%, -50%) scale(1)`;
            });
        });
    }

    render() {
        // Smooth cursor movement
        this.followerX = utils.lerp(this.followerX, this.mouseX, 0.1);
        this.followerY = utils.lerp(this.followerY, this.mouseY, 0.1);

        if (this.cursor) {
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;
        }

        if (this.follower) {
            this.follower.style.left = `${this.followerX}px`;
            this.follower.style.top = `${this.followerY}px`;
        }

        requestAnimationFrame(() => this.render());
    }
}

// ================================
// Navigation Handler
// ================================

class Navigation {
    constructor() {
        this.navbar = elements.navbar;
        this.navToggle = elements.navToggle;
        this.navMenu = elements.navMenu;
        this.navLinks = elements.navLinks;
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleActiveSection();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 16));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = utils.getOffset(targetSection) - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu after clicking
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    handleActiveSection() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;
                    this.updateActiveNavLink(activeId);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ================================
// Typing Animation
// ================================

class TypingAnimation {
    constructor() {
        this.element = elements.typedText;
        this.roles = CONFIG.typing.roles;
        this.currentRoleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        if (this.element) {
            this.init();
        }
    }

    init() {
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const currentRole = this.roles[this.currentRoleIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentRole.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentRole.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? CONFIG.typing.backSpeed : CONFIG.typing.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
            typeSpeed = CONFIG.typing.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ================================
// Intersection Observer for Animations
// ================================

class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            CONFIG.animations.observerOptions
        );
        this.init();
    }

    init() {
        // Observe sections
        elements.sections.forEach(section => {
            this.observer.observe(section);
        });

        // Observe skill bars
        elements.skillBars.forEach(bar => {
            this.observer.observe(bar.parentElement);
        });

        // Observe stat numbers
        elements.statNumbers.forEach(stat => {
            this.observer.observe(stat);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle section animations
                if (entry.target.classList.contains('section')) {
                    entry.target.classList.add('visible');
                }

                // Handle skill bar animations
                if (entry.target.closest('.skills-list')) {
                    setTimeout(() => {
                        this.animateSkillBars(entry.target);
                    }, CONFIG.animations.skillsDelay);
                }

                // Handle stat number counting
                if (entry.target.querySelector('.stat-number')) {
                    this.animateStatNumbers(entry.target);
                }

                // Unobserve after animation
                this.observer.unobserve(entry.target);
            }
        });
    }

    animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.dataset.progress;
                bar.style.width = `${progress}%`;
            }, index * 200);
        });
    }

    animateStatNumbers(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count) || 0;
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 30);
        });
    }
}

// ================================
// Skills Radar Chart
// ================================

class SkillsChart {
    constructor() {
        this.canvas = elements.skillsChart;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.skills = CONFIG.skills.data;
        this.animationProgress = 0;
        
        if (this.ctx) {
            this.init();
        }
    }

    init() {
        this.setupCanvas();
        this.startAnimation();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 40;
    }

    startAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.canvas);
    }

    animate() {
        const animateFrame = () => {
            this.animationProgress += 0.02;
            if (this.animationProgress > 1) this.animationProgress = 1;

            this.draw();

            if (this.animationProgress < 1) {
                requestAnimationFrame(animateFrame);
            }
        };
        animateFrame();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.drawGrid();
        
        // Draw skill areas
        this.drawSkillArea();
        
        // Draw labels
        this.drawLabels();
    }

    drawGrid() {
        const levels = 5;
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 1;

        // Draw concentric circles
        for (let i = 1; i <= levels; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, (this.radius / levels) * i, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw radial lines
        const angleStep = (Math.PI * 2) / this.skills.length;
        for (let i = 0; i < this.skills.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = this.centerX + Math.cos(angle) * this.radius;
            const y = this.centerY + Math.sin(angle) * this.radius;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    drawSkillArea() {
        const angleStep = (Math.PI * 2) / this.skills.length;
        
        // Draw filled area
        this.ctx.beginPath();
        this.skills.forEach((skill, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const value = (skill.value / 100) * this.radius * this.animationProgress;
            const x = this.centerX + Math.cos(angle) * value;
            const y = this.centerY + Math.sin(angle) * value;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.closePath();
        
        // Fill with gradient
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.radius
        );
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = '#6366f1';
        this.skills.forEach((skill, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const value = (skill.value / 100) * this.radius * this.animationProgress;
            const x = this.centerX + Math.cos(angle) * value;
            const y = this.centerY + Math.sin(angle) * value;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawLabels() {
        const angleStep = (Math.PI * 2) / this.skills.length;
        this.ctx.fillStyle = '#374151';
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        
        this.skills.forEach((skill, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const labelRadius = this.radius + 25;
            const x = this.centerX + Math.cos(angle) * labelRadius;
            const y = this.centerY + Math.sin(angle) * labelRadius + 4;
            
            this.ctx.fillText(skill.label, x, y);
        });
    }
}

// ================================
// Contact Form Handler
// ================================

class ContactForm {
    constructor() {
        this.form = elements.contactForm;
        this.submitBtn = this.form ? this.form.querySelector('.btn-submit') : null;
        this.btnText = this.submitBtn ? this.submitBtn.querySelector('.btn-text') : null;
        this.btnLoading = this.submitBtn ? this.submitBtn.querySelector('.btn-loading') : null;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    setupValidation() {
        // Add validation styles
        const style = document.createElement('style');
        style.textContent = `
            .form-group.error input,
            .form-group.error textarea {
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.1) !important;
            }
            .form-group.success input,
            .form-group.success textarea {
                border-color: #10b981 !important;
            }
            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 4px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            .error-message.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous states
        formGroup.classList.remove('error', 'success');
        this.removeErrorMessage(formGroup);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        } else if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            formGroup.classList.add('error');
            this.showErrorMessage(formGroup, errorMessage);
        } else if (value) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    clearErrors(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        this.removeErrorMessage(formGroup);
    }

    showErrorMessage(formGroup, message) {
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        setTimeout(() => errorElement.classList.add('show'), 10);
    }

    removeErrorMessage(formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
            setTimeout(() => errorElement.remove(), 300);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate form submission
            await this.simulateSubmission();
            
            // Success
            this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.form.reset();
            this.clearAllErrors();
            
        } catch (error) {
            this.showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    setLoadingState(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.classList.toggle('loading', isLoading);
            this.submitBtn.disabled = isLoading;
        }
    }

    clearAllErrors() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            this.removeErrorMessage(group);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles for notification
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                .notification-success { background: #10b981; }
                .notification-error { background: #ef4444; }
                .notification-info { background: #3b82f6; }
                .notification.show { transform: translateX(0); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification i { font-size: 1.2rem; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ================================
// Parallax Effects
// ================================

class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length > 0) {
            window.addEventListener('scroll', utils.throttle(() => {
                this.updateParallax();
            }, 16));
        }
    }

    updateParallax() {
        const scrollY = window.pageYOffset;

        this.elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ================================
// Scroll Indicator
// ================================

class ScrollIndicator {
    constructor() {
        this.indicator = elements.scrollIndicator;
        this.init();
    }

    init() {
        if (this.indicator) {
            window.addEventListener('scroll', utils.throttle(() => {
                this.updateVisibility();
            }, 100));

            this.indicator.addEventListener('click', () => {
                this.scrollToNext();
            });
        }
    }

    updateVisibility() {
        const scrollY = window.pageYOffset;
        const opacity = scrollY > 100 ? 0 : 1;
        
        if (this.indicator) {
            this.indicator.style.opacity = opacity;
        }
    }

    scrollToNext() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ================================
// Performance Monitoring
// ================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            firstPaint: 0,
            domContentLoaded: 0
        };
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePerformance();
        });

        // Monitor long tasks (for debugging)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    measurePerformance() {
        if ('performance' in window) {
            const perfData = window.performance.getEntriesByType('navigation')[0];
            
            this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            // Log performance metrics (for development)
            console.log('Performance Metrics:', this.metrics);
        }
    }
}

// ================================
// Main Application Controller
// ================================

class PortfolioApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        try {
            // Initialize core components
            this.components.cursor = new CustomCursor();
            this.components.navigation = new Navigation();
            this.components.typing = new TypingAnimation();
            this.components.observer = new AnimationObserver();
            this.components.skillsChart = new SkillsChart();
            this.components.contactForm = new ContactForm();
            this.components.parallax = new ParallaxEffects();
            this.components.scrollIndicator = new ScrollIndicator();
            this.components.performanceMonitor = new PerformanceMonitor();

            this.isInitialized = true;
            console.log('Portfolio application initialized successfully');

        } catch (error) {
            console.error('Error initializing portfolio application:', error);
        }
    }

    // Public API for external access
    getComponent(name) {
        return this.components[name] || null;
    }

    // Graceful error handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        // Could send error reports to analytics service here
    }
}

// ================================
// Application Initialization
// ================================

// Global app instance
const app = new PortfolioApp();

// Start with loading screen
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
});

// Fallback initialization if loading screen fails
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!app.isInitialized) {
            app.init();
        }
    }, 3000);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations when tab is not visible
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when tab becomes visible
        console.log('Page visible - resuming animations');
    }
});

// Export for global access (if needed)
window.PortfolioApp = app;