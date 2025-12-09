import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
function useTypedTitle() {
    // ref để typed.js chèn text vào
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: [
                'Welcome to <span>GameStore</span>',
                'Your Gateway to the Best Games',
                'Level Up Your Gaming Experience'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1200,
            smartBackspace: true,
            loop: true
        });

        return () => typed.destroy();
    }, []);
    return { typedRef };
}
export default useTypedTitle;
