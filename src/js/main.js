const katalogBtnPrev = document.querySelector('#katalog-button-prev');
const katalogBtnNext = document.querySelector('#katalog-button-next');

document.addEventListener('DOMContentLoaded', function () {
    new Splide('#hero-slider', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        breakpoints: {
            768: {
                arrows: false,
            },
        },
    }).mount();

    const katalogSlider = new Splide('#katalog-slider', {
        type: 'loop',
        perPage: 3,
        gap: '1em',
        arrows: false,
        breakpoints: {
            1024: {
                perPage: 2,
            },
            768: {
                perPage: 1,
            },
        },
        autoplay: true,
        pagination: false
    }).mount();

    katalogBtnPrev.addEventListener('click', () => {
        katalogSlider.go('<');
    });

    katalogBtnNext.addEventListener('click', () => {
        katalogSlider.go('>');
    });

    if (!checkIfMobile()) {
        const DELAYS = [0, 1, 2, 3]

        DELAYS.forEach((delay, _) => {
            const delaysInMs = delay * 200
            const durationInMs = 800
            ScrollReveal().reveal(`.reveal-${delay + 1}`, {
                reset: true,
                distance: '100px',
                duration: durationInMs,
                delay: delaysInMs,
                origin: 'bottom',
                easing: 'ease-in-out',
            });
        })
    }

    function checkIfMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUserAgent = /android|iPhone|iPad|iPod|blackberry|IEMobile|Opera Mini/i.test(userAgent);
        const isMobileScreenSize = window.innerWidth <= 800 && window.innerHeight <= 600;

        return isMobileUserAgent || isMobileScreenSize;
    }

    Plyr.setup('.plyr__video-embed', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();
});