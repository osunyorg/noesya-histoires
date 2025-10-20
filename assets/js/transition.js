import Swup from 'swup';
import SwupBodyClassPlugin from '@swup/body-class-plugin';

document.addEventListener('DOMContentLoaded', function () {
    const animated = false;

    const swup = new Swup({
        animationSelector: false,
        containers: ['#main'],
        plugins: [new SwupBodyClassPlugin()]
    });

    if (animated) {
        swup.hooks.replace('animation:out:await', async () => {
            await new Promise((resolve) => {
                document.body.classList.add('is-updating');
                setTimeout(resolve, 500);
            });
        });
    }

    swup.hooks.on('page:view', () => {
        window.osuny.menu.close();
        window.osuny.lightbox.reinit();
        window.osuny.slidersFactory.reinit();
        window.noesya.footer.reinit();
        document.body.classList.add('is-loaded');

        if (animated) {
            setTimeout(() => {
                document.body.classList.remove('is-updating');
            }, 500)
        }
    });
});

