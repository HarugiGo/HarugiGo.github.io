(function () {
    const slider = document.getElementById('slider');
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    const dotsWrap = slider.querySelector('.slider-dots');
    const total = slides.length;

    let index = 0;
    let autoTimer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => go(i, true));
        dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    function render() {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function go(i, userDriven) {
        index = (i + total) % total;
        render();
        if (userDriven) restart();
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() { autoTimer = setInterval(next, 6000); }
    function stop() { clearInterval(autoTimer); }
    function restart() { stop(); start(); }

    prevBtn.addEventListener('click', () => { prev(); restart(); });
    nextBtn.addEventListener('click', () => { next(); restart(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { prev(); restart(); }
        if (e.key === 'ArrowRight') { next(); restart(); }
    });

    render();
    start();
})();
