import { useEffect, useRef } from 'react';

const useInfiniteScroll = ({
    enabled = true,
    loading = false,
    hasMore = true,
    onLoadMore
}) => {
    const sentinelRef = useRef(null);
    const triggerLockRef = useRef(false);

    useEffect(() => {
        if (!loading) {
            triggerLockRef.current = false;
        }
    }, [loading]);

    useEffect(() => {
        if (!enabled || loading || !hasMore || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry?.isIntersecting && !triggerLockRef.current) {
                    triggerLockRef.current = true;
                    onLoadMore?.();
                }
            },
            {
                root: null,
                rootMargin: '120px 0px 120px 0px',
                threshold: 0.08
            }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [enabled, loading, hasMore, onLoadMore]);

    return { sentinelRef };
};

export default useInfiniteScroll;
