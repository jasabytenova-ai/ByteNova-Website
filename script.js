/* ========================================
   BYTENOVA - JAVASCRIPT
   Library: jQuery 3.7.1
   ======================================== */

// Menggunakan jQuery dengan sintaks $(document).ready untuk memastikan
// semua elemen DOM sudah dimuat sebelum script dijalankan
$(document).ready(function () {

    /* ========== INITIALIZE AOS ANIMATION ========== */
    // AOS (Animate On Scroll) untuk animasi saat scroll
    // offset: jarak dari viewport sebelum animasi dimulai
    // duration: durasi animasi dalam milidetik
    // easing: jenis easing untuk animasi
    // once: animasi hanya terjadi sekali (true) atau setiap kali scroll (false)
    AOS.init({
        offset: 100,
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    /* ========== NAVBAR SCROLL EFFECT ========== */
    // Menambahkan class 'scrolled' pada navbar saat user scroll ke bawah
    // Ini akan mengubah background navbar dari transparan menjadi solid
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            // Jika scroll lebih dari 50px, tambahkan class 'scrolled'
            $('#mainNav').addClass('scrolled');
        } else {
            // Jika kurang dari 50px, hapus class 'scrolled'
            $('#mainNav').removeClass('scrolled');
        }
    });

    /* ========== SMOOTH SCROLL FOR NAVIGATION LINKS ========== */
    // Scroll halus saat mengklik link navigasi yang mengarah ke section dengan ID
    $('a[href^="#"]').on('click', function (e) {
        // Ambil href attribute dari link yang diklik
        var target = $(this).attr('href');

        // Pastikan target adalah ID yang valid (bukan hanya '#')
        if (target !== '#' && $(target).length) {
            e.preventDefault(); // Mencegah default behavior (jump langsung)

            // Animasi scroll ke target dengan durasi 800ms
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70 // Offset 70px untuk navbar
            }, 800, 'swing');

            // Tutup mobile menu jika sedang terbuka
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }
        }
    });

    /* ========== ACTIVE NAVIGATION LINK ON SCROLL ========== */
    // Menandai link navigasi yang sesuai dengan section yang sedang dilihat
    $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + 100; // Offset 100px

        // Loop semua section dan cek posisinya
        $('section').each(function () {
            var sectionTop = $(this).offset().top;
            var sectionBottom = sectionTop + $(this).outerHeight();
            var sectionId = $(this).attr('id');

            // Jika posisi scroll berada di dalam section
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Hapus class 'active' dari semua nav-link
                $('.nav-link').removeClass('active');
                // Tambahkan class 'active' pada link yang sesuai
                $('.nav-link[href="#' + sectionId + '"]').addClass('active');
            }
        });
    });

    /* ========== BACK TO TOP BUTTON ========== */
    // Tombol untuk scroll kembali ke atas halaman

    // Show/hide button berdasarkan posisi scroll
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            // Tampilkan tombol jika scroll lebih dari 300px
            $('#backToTop').fadeIn(400).css('display', 'flex');
        } else {
            // Sembunyikan tombol jika kurang dari 300px
            $('#backToTop').fadeOut(400);
        }
    });

    // Scroll ke atas saat tombol diklik
    $('#backToTop').click(function (e) {
        e.preventDefault();
        // Animasi scroll ke top dengan durasi 600ms
        $('html, body').animate({
            scrollTop: 0
        }, 600, 'swing');
        return false;
    });

    /* ========== SERVICE CAROUSEL FUNCTIONALITY ========== */
    // Carousel untuk service cards dengan efek 3D dan smooth transition

    $(document).ready(function () {
        // ... (kode existing tetap ada)

        // Service Carousel Configuration
        var serviceCarousel = {
            track: $('#serviceTrack'),
            cards: $('.service-card-wrapper'),
            prevBtn: $('#servicePrev'),
            nextBtn: $('#serviceNext'),
            indicators: $('#serviceIndicators'),
            currentIndex: 0,
            totalCards: $('.service-card-wrapper').length,
            cardWidth: 0,
            gap: 30,
            autoPlayInterval: null,
            autoPlayDelay: 5000, // 5 detik
            isAnimating: false
        };

        // Initialize carousel
        function initServiceCarousel() {
            // Calculate card width
            updateCardWidth();

            // Create indicators
            createIndicators();

            // Set initial position (center first card)
            updateCarouselPosition();

            // Apply active classes
            updateActiveCards();

            // Enable auto-play
            startAutoPlay();

            // Event listeners
            serviceCarousel.prevBtn.on('click', function () {
                navigateCarousel('prev');
            });

            serviceCarousel.nextBtn.on('click', function () {
                navigateCarousel('next');
            });

            // Indicator click events
            $(document).on('click', '.indicator-dot', function () {
                var index = $(this).data('index');
                goToSlide(index);
            });

            // Touch/Swipe support for mobile
            enableTouchSwipe();

            // Pause autoplay on hover
            serviceCarousel.track.on('mouseenter', function () {
                stopAutoPlay();
            });

            serviceCarousel.track.on('mouseleave', function () {
                startAutoPlay();
            });

            // Update on window resize
            $(window).on('resize', function () {
                clearTimeout(window.resizeCarouselTimer);
                window.resizeCarouselTimer = setTimeout(function () {
                    updateCardWidth();
                    updateCarouselPosition();
                }, 250);
            });
        }

        // Calculate card width based on viewport
        function updateCardWidth() {
            var containerWidth = serviceCarousel.track.parent().width();
            var windowWidth = $(window).width();

            if (windowWidth <= 575) {
                // Mobile: 1 card
                serviceCarousel.cardWidth = containerWidth;
            } else if (windowWidth <= 767) {
                // Small Mobile: 1 card (90%)
                serviceCarousel.cardWidth = containerWidth * 0.9;
            } else if (windowWidth <= 991) {
                // Tablet: 2 cards
                serviceCarousel.cardWidth = (containerWidth - serviceCarousel.gap) / 2;
            } else {
                // Desktop: 3 cards
                serviceCarousel.cardWidth = (containerWidth - serviceCarousel.gap * 2) / 3;
            }
        }

        // Create indicator dots
        function createIndicators() {
            serviceCarousel.indicators.empty();

            for (var i = 0; i < serviceCarousel.totalCards; i++) {
                var dot = $('<span class="indicator-dot"></span>');
                dot.attr('data-index', i);

                if (i === serviceCarousel.currentIndex) {
                    dot.addClass('active');
                }

                serviceCarousel.indicators.append(dot);
            }
        }

        // Update carousel position
        function updateCarouselPosition(animated = true) {
            var windowWidth = $(window).width();
            var offset = 0;

            if (windowWidth > 991) {
                // Desktop: center the active card
                offset = -(serviceCarousel.currentIndex * (serviceCarousel.cardWidth + serviceCarousel.gap));
                offset += (serviceCarousel.track.parent().width() - serviceCarousel.cardWidth) / 2;
            } else if (windowWidth > 767) {
                // Tablet: show 2 cards, align properly
                offset = -(serviceCarousel.currentIndex * (serviceCarousel.cardWidth + serviceCarousel.gap));
            } else {
                // Mobile: center single card
                offset = -(serviceCarousel.currentIndex * (serviceCarousel.cardWidth + serviceCarousel.gap));
                offset += (serviceCarousel.track.parent().width() - serviceCarousel.cardWidth) / 2;
            }

            if (animated) {
                serviceCarousel.track.css('transition', 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)');
            } else {
                serviceCarousel.track.css('transition', 'none');
            }

            serviceCarousel.track.css('transform', 'translateX(' + offset + 'px)');
        }

        // Update active card classes
        function updateActiveCards() {
            serviceCarousel.cards.removeClass('active adjacent');

            // Active card (center)
            serviceCarousel.cards.eq(serviceCarousel.currentIndex).addClass('active');

            // Adjacent cards (left and right)
            if (serviceCarousel.currentIndex > 0) {
                serviceCarousel.cards.eq(serviceCarousel.currentIndex - 1).addClass('adjacent');
            }
            if (serviceCarousel.currentIndex < serviceCarousel.totalCards - 1) {
                serviceCarousel.cards.eq(serviceCarousel.currentIndex + 1).addClass('adjacent');
            }

            // Update indicators
            $('.indicator-dot').removeClass('active');
            $('.indicator-dot').eq(serviceCarousel.currentIndex).addClass('active');
        }

        // Navigate carousel
        function navigateCarousel(direction) {
            if (serviceCarousel.isAnimating) return;

            serviceCarousel.isAnimating = true;
            stopAutoPlay();

            if (direction === 'next') {
                serviceCarousel.currentIndex++;
                if (serviceCarousel.currentIndex >= serviceCarousel.totalCards) {
                    serviceCarousel.currentIndex = 0;
                }
            } else {
                serviceCarousel.currentIndex--;
                if (serviceCarousel.currentIndex < 0) {
                    serviceCarousel.currentIndex = serviceCarousel.totalCards - 1;
                }
            }

            updateCarouselPosition();
            updateActiveCards();

            setTimeout(function () {
                serviceCarousel.isAnimating = false;
                startAutoPlay();
            }, 500);
        }

        // Go to specific slide
        function goToSlide(index) {
            if (serviceCarousel.isAnimating || index === serviceCarousel.currentIndex) return;

            serviceCarousel.isAnimating = true;
            stopAutoPlay();

            serviceCarousel.currentIndex = index;

            updateCarouselPosition();
            updateActiveCards();

            setTimeout(function () {
                serviceCarousel.isAnimating = false;
                startAutoPlay();
            }, 500);
        }

        // Auto-play functionality
        function startAutoPlay() {
            if (serviceCarousel.autoPlayInterval) return;

            serviceCarousel.autoPlayInterval = setInterval(function () {
                navigateCarousel('next');
            }, serviceCarousel.autoPlayDelay);
        }

        function stopAutoPlay() {
            if (serviceCarousel.autoPlayInterval) {
                clearInterval(serviceCarousel.autoPlayInterval);
                serviceCarousel.autoPlayInterval = null;
            }
        }

        // Touch/Swipe support
        function enableTouchSwipe() {
            var touchStartX = 0;
            var touchEndX = 0;
            var minSwipeDistance = 50;

            serviceCarousel.track.on('touchstart', function (e) {
                touchStartX = e.touches[0].clientX;
            });

            serviceCarousel.track.on('touchmove', function (e) {
                touchEndX = e.touches[0].clientX;
            });

            serviceCarousel.track.on('touchend', function () {
                var swipeDistance = touchEndX - touchStartX;

                if (Math.abs(swipeDistance) > minSwipeDistance) {
                    if (swipeDistance > 0) {
                        // Swipe right - go to previous
                        navigateCarousel('prev');
                    } else {
                        // Swipe left - go to next
                        navigateCarousel('next');
                    }
                }

                touchStartX = 0;
                touchEndX = 0;
            });
        }

        // Keyboard navigation
        $(document).on('keydown', function (e) {
            if ($('#services').isInViewport()) {
                if (e.keyCode === 37) {
                    // Left arrow
                    navigateCarousel('prev');
                } else if (e.keyCode === 39) {
                    // Right arrow
                    navigateCarousel('next');
                }
            }
        });

        // Helper function to check if element is in viewport
        $.fn.isInViewport = function () {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        // Initialize carousel when ready
        if ($('#serviceTrack').length) {
            initServiceCarousel();
        }

        // ... (kode existing lainnya tetap ada)
    });

    /* ========== STEP CARD ANIMATION ========== */
    // Animasi hover pada step cards di section "Cara Pemesanan"
    $('.step-card').hover(
        function () {
            // Tambahkan efek bounce pada icon
            $(this).find('.step-icon').addClass('animate-bounce');
        },
        function () {
            // Hapus efek bounce
            $(this).find('.step-icon').removeClass('animate-bounce');
        }
    );

    /* ========== WHY CARD HOVER EFFECT ========== */
    // Efek parallax ringan pada why-us cards
    $('.why-card').on('mousemove', function (e) {
        var card = $(this);
        var cardOffset = card.offset();
        var cardWidth = card.outerWidth();
        var cardHeight = card.outerHeight();

        // Hitung posisi mouse relatif terhadap card
        var mouseX = e.pageX - cardOffset.left;
        var mouseY = e.pageY - cardOffset.top;

        // Hitung rotasi berdasarkan posisi mouse (efek 3D ringan)
        var rotateY = ((mouseX - cardWidth / 2) / cardWidth) * 10;
        var rotateX = ((cardHeight / 2 - mouseY) / cardHeight) * 10;

        // Terapkan transformasi 3D
        card.css({
            'transform': 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)'
        });
    });

    // Reset transformasi saat mouse keluar
    $('.why-card').on('mouseleave', function () {
        $(this).css({
            'transform': 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
        });
    });

    /* ========== TESTIMONIAL CAROUSEL AUTO PLAY ========== */
    // Mengatur auto-play untuk carousel testimoni
    var testimonialCarousel = new bootstrap.Carousel('#testimonialCarousel', {
        interval: 5000, // Ganti slide setiap 5 detik
        ride: 'carousel',
        pause: 'hover' // Pause saat mouse hover
    });

    /* ========== CONTACT CARD ICON ANIMATION ========== */
    // Animasi shake pada icon saat hover
    $('.contact-card').hover(
        function () {
            $(this).find('.contact-icon').addClass('animate-shake');
            // Hapus class setelah animasi selesai
            setTimeout(() => {
                $(this).find('.contact-icon').removeClass('animate-shake');
            }, 500);
        }
    );

    /* ========== FORM VALIDATION (untuk future enhancement) ========== */
    // Jika nanti ada form di halaman, validasi bisa ditambahkan di sini
    // Contoh placeholder untuk validasi email
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /* ========== LAZY LOADING IMAGES (optional) ========== */
    // Untuk meningkatkan performance, lazy load images
    // Uncomment jika menggunakan gambar real
    /*
    $('img').each(function() {
        var img = $(this);
        var dataSrc = img.attr('data-src');
        
        if (dataSrc) {
            img.attr('src', dataSrc);
            img.on('load', function() {
                img.addClass('loaded');
            });
        }
    });
    */

    /* ========== COUNTER ANIMATION FOR STATS ========== */
    // Animasi counter untuk angka statistik di hero section
    function animateCounter(element, target, duration) {
        var current = 0;
        var increment = target / (duration / 16); // 16ms per frame (60fps)

        var timer = setInterval(function () {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Update text dengan format yang sesuai
            var displayValue = Math.floor(current);

            // Tambahkan '+' untuk angka
            if (element.text().includes('+')) {
                element.text(displayValue + '+');
            }
            // Tambahkan '%' untuk persentase
            else if (element.text().includes('%')) {
                element.text(displayValue + '%');
            }
            // Default
            else {
                element.text(displayValue);
            }
        }, 16);
    }

    // Trigger counter animation saat hero section visible
    var hasAnimated = false;

    $(window).on('scroll', function () {
        var heroSection = $('#hero');
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();

        // Cek apakah hero section terlihat
        if (heroSection.length && !hasAnimated) {
            if (scrollTop < windowHeight) {
                // Jalankan animasi counter
                $('.stat-number').each(function () {
                    var $this = $(this);
                    var text = $this.text();
                    var number = parseInt(text.replace(/\D/g, ''));

                    if (number) {
                        animateCounter($this, number, 2000); // 2 detik animasi
                    }
                });

                hasAnimated = true;
            }
        }
    });

    // Trigger animasi saat page load jika hero sudah visible
    $(window).trigger('scroll');

    /* ========== FLOATING ICONS ANIMATION ========== */
    // Animasi floating yang lebih dinamis untuk icon di hero section
    $('.floating-icon').each(function (index) {
        var icon = $(this);
        var randomDelay = Math.random() * 2;
        var randomDuration = 3 + Math.random() * 2;

        icon.css({
            'animation-delay': randomDelay + 's',
            'animation-duration': randomDuration + 's'
        });
    });

    /* ========== PROMO BADGE PULSE ANIMATION ========== */
    // Tambahkan perhatian ekstra pada promo badge
    setInterval(function () {
        $('.promo-badge').addClass('animate-pulse');

        setTimeout(function () {
            $('.promo-badge').removeClass('animate-pulse');
        }, 1000);
    }, 3000); // Pulse setiap 3 detik

    /* ========== MOBILE MENU CLOSE ON OUTSIDE CLICK ========== */
    // Tutup mobile menu jika user klik di luar menu
    $(document).on('click', function (e) {
        var navbar = $('.navbar-collapse');
        var toggler = $('.navbar-toggler');

        // Jika menu terbuka dan klik di luar menu/toggler
        if (navbar.hasClass('show') &&
            !navbar.is(e.target) &&
            navbar.has(e.target).length === 0 &&
            !toggler.is(e.target) &&
            toggler.has(e.target).length === 0) {
            toggler.click();
        }
    });

    /* ========== PREVENT DEFAULT BEHAVIOR FOR EMPTY LINKS ========== */
    // Mencegah scroll ke top saat klik link dengan href="#"
    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });

    /* ========== GOOGLE FORM LINK TRACKING (Analytics) ========== */
    // Track clicks pada tombol "Pesan Sekarang" untuk analytics
    $('.btn-service').on('click', function () {
        var serviceName = $(this).closest('.service-card').find('.service-title').text();

        // Log ke console (bisa diganti dengan Google Analytics event)
        console.log('Service ordered: ' + serviceName);

        // Jika menggunakan Google Analytics, tambahkan:
        // gtag('event', 'order_click', {
        //     'event_category': 'Service',
        //     'event_label': serviceName
        // });
    });

    /* ========== WHATSAPP BUTTON TRACKING ========== */
    // Track clicks pada WhatsApp button
    $('.whatsapp-float a').on('click', function () {
        console.log('WhatsApp button clicked');

        // Jika menggunakan Google Analytics:
        // gtag('event', 'whatsapp_click', {
        //     'event_category': 'Contact',
        //     'event_label': 'Floating Button'
        // });
    });

    /* ========== CUSTOM ANIMATION CLASSES ========== */
    // Definisi untuk custom animation yang digunakan
    var style = document.createElement('style');
    style.textContent = `
        /* Bounce Animation */
        .animate-bounce {
            animation: bounce-animation 0.5s ease-in-out;
        }
        
        @keyframes bounce-animation {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        /* Shake Animation */
        .animate-shake {
            animation: shake-animation 0.5s ease-in-out;
        }
        
        @keyframes shake-animation {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        /* Pulse Animation */
        .animate-pulse {
            animation: pulse-animation 1s ease-in-out;
        }
        
        @keyframes pulse-animation {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);

    /* ========== LOADING PERFORMANCE OPTIMIZATION ========== */
    // Defer loading untuk external resources yang tidak critical
    $(window).on('load', function () {
        // Semua assets telah dimuat
        console.log('Page fully loaded');

        // Trigger AOS refresh untuk memastikan semua animasi terdeteksi
        AOS.refresh();
    });

    /* ========== INTERSECTION OBSERVER FOR ADVANCED ANIMATIONS ========== */
    // Menggunakan Intersection Observer untuk animasi yang lebih efisien
    if ('IntersectionObserver' in window) {
        // Observer untuk section-section
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Section terlihat, tambahkan class 'visible'
                    $(entry.target).addClass('section-visible');
                }
            });
        }, {
            threshold: 0.2 // Trigger saat 20% section terlihat
        });

        // Observe semua sections
        $('section').each(function () {
            sectionObserver.observe(this);
        });
    }

    /* ========== CONSOLE WELCOME MESSAGE ========== */
    // Pesan selamat datang di console untuk developers
    console.log('%cByteNova', 'font-size: 32px; font-weight: bold; color: #1e3a8a;');
    console.log('%c🚀 Website berhasil dimuat!', 'font-size: 14px; color: #10b981;');
    console.log('%cDeveloped with ❤️ by The Nova Team', 'font-size: 12px; color: #64748b;');

    /* ========== DEBUG MODE (uncomment untuk development) ========== */
    // Uncomment untuk melihat informasi debug di console
    /*
    var debugMode = false;
    
    if (debugMode) {
        console.log('=== DEBUG MODE ===');
        console.log('jQuery Version:', $.fn.jquery);
        console.log('Bootstrap Version:', bootstrap.Tooltip.VERSION);
        console.log('AOS Initialized:', AOS);
        console.log('Window Width:', $(window).width());
        console.log('Window Height:', $(window).height());
    }
    */

}); // End of document ready

/* ========== WINDOW RESIZE HANDLER ========== */
// Handle resize events dengan debouncing untuk performance
var resizeTimer;

$(window).on('resize', function () {
    // Clear timeout sebelumnya
    clearTimeout(resizeTimer);

    // Set timeout baru
    resizeTimer = setTimeout(function () {
        // Refresh AOS setelah resize
        AOS.refresh();

        // Log untuk debugging (optional)
        console.log('Window resized to:', $(window).width(), 'x', $(window).height());
    }, 250); // Delay 250ms setelah user selesai resize
});

/* ========== SERVICE WORKER (Progressive Web App) ========== */
// Uncomment jika ingin menambahkan PWA capabilities
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
*/

/* ========== UTILITY FUNCTIONS ========== */
// Fungsi-fungsi helper yang bisa digunakan di seluruh aplikasi

// Fungsi untuk format nomor dengan separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk format currency (Rupiah)
function formatCurrency(num) {
    return 'Rp ' + formatNumber(num);
}

// Fungsi untuk truncate text
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Fungsi untuk check if mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Log device type untuk debugging
if (isMobileDevice()) {
    console.log('Device: Mobile');
} else {
    console.log('Device: Desktop');
} 
