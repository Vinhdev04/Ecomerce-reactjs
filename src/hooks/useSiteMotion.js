import { useEffect } from 'react';

const REVEAL_SELECTORS = [
    'section',
    'article',
    'form',
    '[class*="card"]',
    '[class*="Card"]',
    '[class*="section"]',
    '[class*="Section"]',
    '[class*="feature"]',
    '[class*="Feature"]',
    '[class*="grid"] > *',
    '[class*="Grid"] > *',
    '[class*="list"] > *',
    '[class*="List"] > *',
    '.row > *',
    '.container > *'
];

const INTERACTIVE_SELECTORS = [
    'button',
    'a',
    '[role="button"]',
    '.btn',
    '.ant-btn',
    'input',
    'textarea',
    'select'
];

const CARD_SELECTORS = [
    '[class*="card"]',
    '[class*="Card"]',
    '[class*="item"]',
    '[class*="Item"]',
    '[class*="box"]',
    '[class*="Box"]'
];

function dedupeElements(elements) {
    return Array.from(new Set(elements.filter(Boolean)));
}

function useSiteMotion(rootRef, deps = []) {
    useEffect(() => {
        const root = rootRef?.current;

        if (!root) {
            return undefined;
        }

        window.scrollTo({ top: 0, behavior: 'auto' });

        root.classList.remove('page-motion-ready');
        void root.offsetHeight;
        requestAnimationFrame(() => {
            root.classList.add('page-motion-ready');
        });

        const revealTargets = dedupeElements(
            REVEAL_SELECTORS.flatMap((selector) =>
                Array.from(root.querySelectorAll(selector))
            )
        ).filter((element) => !element.closest('[data-motion-ignore="true"]'));

        revealTargets.forEach((element, index) => {
            element.setAttribute('data-motion', 'reveal');
            element.style.setProperty('--motion-delay', `${Math.min(index % 8, 7) * 70}ms`);
        });

        const interactiveTargets = dedupeElements(
            INTERACTIVE_SELECTORS.flatMap((selector) =>
                Array.from(root.querySelectorAll(selector))
            )
        );

        interactiveTargets.forEach((element) => {
            element.setAttribute('data-interactive', 'true');
        });

        const cardTargets = dedupeElements(
            CARD_SELECTORS.flatMap((selector) =>
                Array.from(root.querySelectorAll(selector))
            )
        ).filter((element) => element !== root);

        cardTargets.forEach((element) => {
            element.setAttribute('data-hover-card', 'true');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.14,
                rootMargin: '0px 0px -12% 0px'
            }
        );

        revealTargets.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
        };
    }, [rootRef, ...deps]);
}

export default useSiteMotion;
