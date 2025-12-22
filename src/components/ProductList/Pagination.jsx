import React from 'react';
import styles from './HomeListProduct.module.scss';

// OVERVIEW: Pagination chỉ render khi props thay đổi
export const Pagination = React.memo(({ pagination, onPageChange }) => {
    if (pagination.totalPages <= 1) return null;

    return (
        <>
            <div className={styles.pagination}>
                <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={styles.paginationBtn}
                >
                    « Trước
                </button>

                <div className={styles.paginationNumbers}>
                    {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`${styles.paginationNumber} ${
                                    pagination.page === pageNum
                                        ? styles.active
                                        : ''
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={styles.paginationBtn}
                >
                    Sau »
                </button>
            </div>

            <PaginationInfo pagination={pagination} />
        </>
    );
});

const PaginationInfo = ({ pagination }) => (
    <div className={styles.paginationInfo}>
        Hiển thị {pagination.limit} trên {pagination.total} sản phẩm (Trang{' '}
        {pagination.page}/{pagination.totalPages})
    </div>
);
