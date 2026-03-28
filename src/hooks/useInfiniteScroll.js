import { useEffect, useRef } from 'react';

const useInfiniteScroll = ({
    enabled = true,
    loading = false,
    hasMore = true,
    onLoadMore
}) => {
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!enabled || loading || !hasMore || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry?.isIntersecting) {
                    onLoadMore?.();
                }
            },
            {
                root: null,
                rootMargin: '320px 0px 240px 0px',
                threshold: 0.01
            }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [enabled, loading, hasMore, onLoadMore]);

    return { sentinelRef };
};

export default useInfiniteScroll;
