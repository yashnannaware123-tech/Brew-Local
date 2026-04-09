/* ============================================
   BREWLOCAL — JavaScript Functionality
   ============================================ */

(function () {
    'use strict';

    // ===========================
    // DOM REFERENCES
    // ===========================
    const nav = document.getElementById('nav');
    const backToTop = document.getElementById('backToTop');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const toastEl = document.getElementById('toast');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    // ===========================
    // TOAST NOTIFICATION SYSTEM
    // ===========================
    let toastTimeout = null;

    function showToast(message, icon) {
        if (!toastEl) return;

        // Clear any existing timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        const toastIcon = toastEl.querySelector('.toast-icon');
        const toastMessage = toastEl.querySelector('.toast-message');

        if (toastIcon) toastIcon.textContent = icon || '✅';
        if (toastMessage) toastMessage.textContent = message;

        // Remove and re-add class for re-trigger animation
        toastEl.classList.remove('show');

        // Force reflow
        void toastEl.offsetWidth;

        toastEl.classList.add('show');

        toastTimeout = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 3500);
    }

    // ===========================
    // NAVIGATION — SCROLL EFFECT
    // ===========================
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        var scrollY = window.scrollY || window.pageYOffset;

        // Add shadow on scroll
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // ===========================
    // BACK TO TOP
    // ===========================
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===========================
    // MOBILE MENU
    // ===========================
    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMobileMenu() {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===========================
    // SMOOTH SCROLL
    // ===========================
    smoothScrollLinks.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');

            if (href && href !== '#' && href.startsWith('#')) {
                var target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    var navHeight = nav ? nav.offsetHeight : 72;
                    var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===========================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ===========================
    function initScrollAnimations() {
        var animatedElements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            var observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            };

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var element = entry.target;
                        var delay = parseInt(element.getAttribute('data-delay')) || 0;

                        setTimeout(function () {
                            element.classList.add('visible');
                        }, delay);

                        observer.unobserve(element);
                    }
                });
            }, observerOptions);

            animatedElements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all elements immediately
            animatedElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    // ===========================
    // ADD TO CART
    // ===========================
    function handleAddToCart(e) {
        var button = e.currentTarget;
        var productName = button.getAttribute('data-product');
        var productPrice = button.getAttribute('data-price');

        // Visual feedback
        var originalHTML = button.innerHTML;
        button.innerHTML = '<span>✓ Added!</span>';
        button.style.background = 'var(--green-medium)';
        button.disabled = true;

        showToast(productName + ' added to cart — ₹' + productPrice, '🛒');

        // Reset button after delay
        setTimeout(function () {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    }

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', handleAddToCart);
    });

    // ===========================
    // EMAIL FORM SUBMISSION
    // ===========================
    if (emailForm) {
        emailForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = emailInput.value.trim();

            if (!email) {
                showToast('Please enter a valid email address.', '⚠️');
                return;
            }

            // Email validation regex
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', '⚠️');
                emailInput.focus();
                return;
            }

            // Simulate form submission
            var submitBtn = emailForm.querySelector('button[type="submit"]');
            var originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(function () {
                showToast('Welcome! Check your email for your ₹100 discount code.', '🎉');
                emailInput.value = '';
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    // ===========================
    // SUBSCRIPTION BUTTON
    // ===========================
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function () {
            var btn = this;
            var originalText = btn.textContent;

            btn.textContent = 'Setting up...';
            btn.disabled = true;

            setTimeout(function () {
                showToast('Subscription setup started! Redirecting...', '🎉');
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // ===========================
    // COUNTER ANIMATION (for stats)
    // ===========================
    function animateCounter(element, target, duration) {
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    // Animate the "500+" customer count when visible
    function initCounterAnimation() {
        var customerCard = document.querySelector('.card-customers .floating-card-value');
        if (!customerCard) return;

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target, 500, 2000);
                        entry.target.dataset.animated = 'true';
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterObserver.observe(customerCard);
        }
    }

    // ===========================
    // NAVBAR ACTIVE LINK HIGHLIGHTING
    // ===========================
    function initActiveNavHighlighting() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

        if (!sections.length || !navLinks.length) return;

        if ('IntersectionObserver' in window) {
            var sectionObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.getAttribute('id');

                        navLinks.forEach(function (link) {
                            link.style.color = '';
                            var href = link.getAttribute('href');
                            if (href === '#' + id) {
                                link.style.color = 'var(--brown-dark)';
                            }
                        });
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-80px 0px -50% 0px'
            });

            sections.forEach(function (section) {
                sectionObserver.observe(section);
            });
        }
    }

    // ===========================
    // LAZY LOADING ENHANCEMENT
    // ===========================
    function initLazyLoading() {
        // Add lazy loading to any images that might be added later
        var images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy-placeholder');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '200px' });

            images.forEach(function (img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback
            images.forEach(function (img) {
                img.src = img.dataset.src;
            });
        }
    }

    // ===========================
    // KEYBOARD ACCESSIBILITY
    // ===========================
    function initAccessibility() {
        // Focus styles for keyboard users
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function () {
            document.body.classList.remove('keyboard-nav');
        });
    }

    // ===========================
    // PRODUCT CARD HOVER EFFECT (TOUCH)
    // ===========================
    function initTouchHover() {
        if ('ontouchstart' in window) {
            var productCards = document.querySelectorAll('.product-card');
            productCards.forEach(function (card) {
                card.addEventListener('touchstart', function () {
                    // Remove hover from all other cards
                    productCards.forEach(function (c) {
                        c.classList.remove('touch-hover');
                    });
                    this.classList.add('touch-hover');
                }, { passive: true });
            });
        }
    }

    // ===========================
    // PERFORMANCE: Debounce utility
    // ===========================
    function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    }

    // ===========================
    // WHATSAPP BUTTON: Hide while scrolling fast
    // ===========================
    function initWhatsAppVisibility() {
        var whatsappBtn = document.getElementById('whatsappBtn');
        if (!whatsappBtn) return;

        var scrollTimeout;

        window.addEventListener('scroll', function () {
            whatsappBtn.style.opacity = '0.4';
            whatsappBtn.style.transform = 'scale(0.9)';

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                whatsappBtn.style.opacity = '1';
                whatsappBtn.style.transform = 'scale(1)';
            }, 300);
        }, { passive: true });
    }

    // ===========================
    // INITIALIZE EVERYTHING
    // ===========================
    function init() {
        initScrollAnimations();
        initCounterAnimation();
        initActiveNavHighlighting();
        initLazyLoading();
        initAccessibility();
        initTouchHover();
        initWhatsAppVisibility();

        // Trigger initial nav state
        updateNav();

        console.log(
            '%c☕ BrewLocal — Farm to Cup in 48 Hours',
            'background: #2C1810; color: #F5F0E8; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: bold;'
        );
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();