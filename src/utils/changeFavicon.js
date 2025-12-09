// Improved favicon + title handler
export function initVisibilityHandler() {
    const favicon =
        document.querySelector('link[rel="icon"]') ||
        document.querySelector('link[rel="shortcut icon"]');

    const originalTitle = document.title;

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            favicon.href = '/favilight.png';
            document.title = originalTitle;
        } else {
            favicon.href = '/favidark.png';
            document.title = 'Controllers & Gear';
        }
    });
}
