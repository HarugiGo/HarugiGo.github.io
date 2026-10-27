(() => {
    const viewer = document.querySelector('.photo-viewer');
    const photographs = Array.from(document.querySelectorAll('.photograph'));

    if (!viewer || typeof viewer.showModal !== 'function') return;

    const viewerImage = viewer.querySelector('.viewer-image');
    const viewerPlace = viewer.querySelector('.viewer-place');
    const viewerLocation = viewer.querySelector('.viewer-location');
    const viewerCount = viewer.querySelector('.viewer-count');
    let activeIndex = 0;
    let opener = null;
    let touchStart = null;

    function showPhotograph(index) {
        activeIndex = (index + photographs.length) % photographs.length;
        const photograph = photographs[activeIndex];
        const image = photograph.querySelector('img');
        viewerImage.src = photograph.querySelector('.photo-link').href;
        viewerImage.alt = image.alt;
        viewerPlace.textContent = photograph.dataset.city;
        viewerLocation.textContent = photograph.dataset.location;
        viewerCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${photographs.length}`;
    }

    photographs.forEach((photograph, index) => {
        const link = photograph.querySelector('.photo-link');
        link.addEventListener('click', event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            opener = link;
            showPhotograph(index);
            viewer.showModal();
            document.body.classList.add('viewer-open');
        });
    });

    viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
    viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhotograph(activeIndex - 1));
    viewer.querySelector('.viewer-next').addEventListener('click', () => showPhotograph(activeIndex + 1));

    viewer.addEventListener('close', () => {
        document.body.classList.remove('viewer-open');
        touchStart = null;
        opener?.focus({ preventScroll: true });
    });

    viewer.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            showPhotograph(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
        }
    });

    const viewerStage = viewer.querySelector('.viewer-stage');
    viewerStage.addEventListener('click', event => {
        if (event.target === viewerStage) viewer.close();
    });

    viewerStage.addEventListener('touchstart', event => {
        touchStart = event.touches.length === 1
            ? { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY }
            : null;
    }, { passive: true });

    viewerStage.addEventListener('touchend', event => {
        if (!touchStart || event.changedTouches.length !== 1) return;
        const distanceX = event.changedTouches[0].clientX - touchStart.clientX;
        const distanceY = event.changedTouches[0].clientY - touchStart.clientY;
        touchStart = null;
        if (Math.abs(distanceX) > 65 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
            showPhotograph(activeIndex + (distanceX < 0 ? 1 : -1));
        }
    }, { passive: true });

    viewerStage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
})();
