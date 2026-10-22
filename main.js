tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        navy: {
                            900: '#0a192f',
                            800: '#112240',
                            700: '#1d3557',
                        },
                        gold: {
                            500: '#d4af37',
                            600: '#aa8c2c',
                            400: '#e5c158'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif']
                    }
                }
            }
        }


        //js + jquery logic
        $(document).ready(function() {
            // 1. Dark / Light Mode Toggle
            function setTheme(isDark) {
                if (isDark) {
                    $('html').addClass('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    $('html').removeClass('dark');
                    localStorage.setItem('theme', 'light');
                }
            }

            // Check initial system or stored preference
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                setTheme(true);
            } else {
                setTheme(false);
            }

            $('#themeToggle, #themeToggleMobile').on('click', function() {
                const isDark = $('html').hasClass('dark');
                setTheme(!isDark);
            });

            // 2. Mobile Menu Toggle
            $('#mobileMenuBtn').on('click', function() {
                $('#mobileMenu').toggleClass('hidden');
            });

            $('.mobile-link').on('click', function() {
                $('#mobileMenu').addClass('hidden');
            });

            // 3. Scroll Reveal Animations (Intersection Observer)
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        $(entry.target).addClass('active');
                    }
                });
            }, observerOptions);

            $('.fade-in-up').each(function() {
                observer.observe(this);
            });

            // 4. Animated Counters on Scroll
            let countersStarted = false;
            const statsSection = $('#about')[0];

            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersStarted) {
                        countersStarted = true;
                        $('.counter').each(function() {
                            const $this = $(this);
                            const target = parseInt($this.attr('data-target'));
                            let current = 0;
                            const increment = Math.ceil(target / 40);
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    $this.text(target);
                                    clearInterval(timer);
                                } else {
                                    $this.text(current);
                                }
                            }, 40);
                        });
                    }
                });
            }, { threshold: 0.3 });

            if (statsSection) {
                statsObserver.observe(statsSection);
            }

            // 5. Testimonial Slider
            let currentSlide = 0;
            const $slides = $('.testimonial-slide');
            const $dots = $('.dot-btn');
            const totalSlides = $slides.length;

            function showSlide(index) {
                $slides.addClass('hidden').removeClass('active');
                $dots.removeClass('bg-gold-500').addClass('bg-slate-300 dark:bg-slate-600');

                $slides.eq(index).removeClass('hidden').addClass('active');
                $dots.eq(index).removeClass('bg-slate-300 dark:bg-slate-600').addClass('bg-gold-500');
                currentSlide = index;
            }

            $('#nextTestimonial').on('click', function() {
                let next = (currentSlide + 1) % totalSlides;
                showSlide(next);
            });

            $('#prevTestimonial').on('click', function() {
                let prev = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(prev);
            });

            $dots.on('click', function() {
                let index = parseInt($(this).attr('data-index'));
                showSlide(index);
            });

            // Auto slide every 6 seconds
            setInterval(() => {
                let next = (currentSlide + 1) % totalSlides;
                showSlide(next);
            }, 6000);

            // 6. Back to Top Button
            $(window).on('scroll', function() {
                if ($(window).scrollTop() > 400) {
                    $('#backToTop').removeClass('opacity-0 invisible').addClass('opacity-100 visible');
                } else {
                    $('#backToTop').removeClass('opacity-100 visible').addClass('opacity-0 invisible');
                }
            });

            $('#backToTop').on('click', function() {
                $('html, body').animate({ scrollTop: 0 }, 'smooth');
            });

            // 7. Contact Form Validation and AJAX simulation
            $('#consultationForm').on('submit', function(e) {
                e.preventDefault();
                let isValid = true;

                // Reset errors
                $('.error-msg').addClass('hidden');
                $('input, select, textarea').removeClass('border-red-500');

                // Full Name validation
                const fullName = $('#fullName').val().trim();
                if (!fullName) {
                    $('#fullName').addClass('border-red-500');
                    $('#fullName').siblings('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                // Email validation
                const email = $('#email').val().trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    $('#email').addClass('border-red-500');
                    $('#email').siblings('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                // Phone validation
                const phone = $('#phone').val().trim();
                if (!phone || phone.length < 7) {
                    $('#phone').addClass('border-red-500');
                    $('#phone').siblings('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                // Practice Area validation
                const practiceArea = $('#practiceArea').val();
                if (!practiceArea) {
                    $('#practiceArea').addClass('border-red-500');
                    $('#practiceArea').parent().find('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                // Message validation
                const message = $('#message').val().trim();
                if (!message) {
                    $('#message').addClass('border-red-500');
                    $('#message').siblings('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                // Consent checkbox validation
                const consent = $('#consent').is(':checked');
                if (!consent) {
                    $('#consent').parent().find('.error-msg').removeClass('hidden');
                    isValid = false;
                }

                if (isValid) {
                    // Simulate AJAX submission delay
                    const $submitBtn = $(this).find('button[type="submit"]');
                    const originalText = $submitBtn.html();
                    $submitBtn.html('<i class="fa-solid fa-spinner fa-spin"></i> Submitting...').prop('disabled', true);

                    setTimeout(() => {
                        $submitBtn.html(originalText).prop('disabled', false);
                        $('#formSuccessMessage').removeClass('hidden');
                    }, 1000);
                }
            });

            $('#resetFormBtn').on('click', function() {
                $('#consultationForm')[0].reset();
                $('#formSuccessMessage').addClass('hidden');
            });
        });