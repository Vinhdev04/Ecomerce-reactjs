import { useEffect } from 'react';

/**
 * Reveal sections on viewport entry to keep motion meaningful and lightweight.
 */
export default function useSectionReveal(scopeRef) {
    useEffect(() => {
        const scope = scopeRef?.current;
        if (!scope) return undefined;

        const revealTargets = Array.from(scope.querySelectorAll('[data-reveal]'));
        if (!revealTargets.length) return undefined;

        if (!('IntersectionObserver' in window)) {
            revealTargets.forEach((node) => node.setAttribute('data-visible', 'true'));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.setAttribute('data-visible', 'true');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -8% 0px'
            }
        );

        revealTargets.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [scopeRef]);
}
