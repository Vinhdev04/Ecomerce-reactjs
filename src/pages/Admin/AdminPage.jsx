import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout/Layout';
import adminService from '@api/adminService';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import styles from './AdminPage.module.scss';
import {
    FaBoxOpen,
    FaChartLine,
    FaNewspaper,
    FaPen,
    FaPlus,
    FaSyncAlt,
    FaTrashAlt,
    FaUserCog
} from 'react-icons/fa';

const POLL_INTERVAL_MS = 15000;

const createEmptyUserForm = () => ({
    id: '',
    name: '',
    email: '',
    password: ''
});

const createEmptyProductForm = () => ({
    id: '',
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    rating: '',
    badge: '',
    image: '',
    size: ''
});

const createEmptyNewsForm = () => ({
    id: '',
    title: '',
    summary: '',
    content: '',
    image: '',
    author: '',
    category: '',
    tags: '',
    readTime: ''
});

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString('vi-VN') : 'Chưa có';

const formatCurrency = (value) =>
    `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const safeArrayResponse = async (request) => {
    try {
        const response = await request();
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        if (error?.response?.status === 404) {
            return [];
        }

        throw error;
    }
};

function AdminPage() {
    const { toast } = useContext(ToastContext);
    const { userInfo, isLoading } = useContext(UserInfoContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [userForm, setUserForm] = useState(createEmptyUserForm());
    const [productForm, setProductForm] = useState(createEmptyProductForm());
    const [newsForm, setNewsForm] = useState(createEmptyNewsForm());
    const [editingUserId, setEditingUserId] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const [editingNewsId, setEditingNewsId] = useState('');

    const fetchAdminData = useCallback(
        async ({ silent = false } = {}) => {
            if (!userInfo) {
                setPageLoading(false);
                return;
            }

            if (silent) {
                setRefreshing(true);
            } else {
                setPageLoading(true);
            }

            try {
                const [usersData, productsData, newsData] = await Promise.all([
                    safeArrayResponse(() => adminService.getUsers()),
                    safeArrayResponse(() => adminService.getProducts()),
                    safeArrayResponse(() => adminService.getNews())
                ]);

                setUsers(usersData);
                setProducts(productsData);
                setNews(newsData);
                setLastSyncedAt(new Date());
            } catch (error) {
                toast?.error?.(
                    error?.response?.data?.message ||
                        'Không thể tải dữ liệu admin.'
                );
            } finally {
                setPageLoading(false);
                setRefreshing(false);
            }
        },
        [toast, userInfo]
    );

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    useEffect(() => {
        if (!userInfo) {
            return undefined;
        }

        const timer = setInterval(() => {
            fetchAdminData({ silent: true });
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [fetchAdminData, userInfo]);

    const analytics = useMemo(() => {
        const inventoryValue = products.reduce(
            (sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0),
            0
        );
        const lowStockProducts = products.filter((item) => {
            const stock = Number(item.stock || 0);
            return stock > 0 && stock <= 10;
        });
        const outOfStockProducts = products.filter(
            (item) => Number(item.stock || 0) === 0
        );
        const averageRating = products.length
            ? (
                  products.reduce(
                      (sum, item) => sum + Number(item.rating || 0),
                      0
                  ) / products.length
              ).toFixed(1)
            : '0.0';

        const latestActivities = [
            ...users.map((item) => ({
                id: `user-${item.id}`,
                type: 'USER',
                title: item.name || item.email,
                action: 'Cập nhật người dùng',
                time: item.updatedAt || item.createdAt
            })),
            ...products.map((item) => ({
                id: `product-${item.id}`,
                type: 'PRODUCT',
                title: item.title,
                action: 'Đồng bộ sản phẩm',
                time: item.updatedAt || item.createdAt
            })),
            ...news.map((item) => ({
                id: `news-${item.id}`,
                type: 'NEWS',
                title: item.title,
                action: 'Đồng bộ bài viết',
                time: item.updatedAt || item.createdAt
            }))
        ]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 8);

        return {
            totalUsers: users.length,
            totalProducts: products.length,
            totalNews: news.length,
            inventoryValue,
            lowStockProducts,
            outOfStockProducts,
            averageRating,
            latestActivities
        };
    }, [news, products, users]);

    const tabs = [
        { id: 'dashboard', label: 'Analytics', icon: <FaChartLine /> },
        { id: 'users', label: 'Users', icon: <FaUserCog /> },
        { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
        { id: 'news', label: 'News', icon: <FaNewspaper /> }
    ];

    const handleRefresh = () => {
        fetchAdminData({ silent: true });
    };

    const resetUserForm = () => {
        setEditingUserId('');
        setUserForm(createEmptyUserForm());
    };

    const resetProductForm = () => {
        setEditingProductId('');
        setProductForm(createEmptyProductForm());
    };

    const resetNewsForm = () => {
        setEditingNewsId('');
        setNewsForm(createEmptyNewsForm());
    };

    const handleEditUser = (item) => {
        setActiveTab('users');
        setEditingUserId(item.id);
        setUserForm({
            id: item.id,
            name: item.name || '',
            email: item.email || '',
            password: ''
        });
    };

    const handleEditProduct = (item) => {
        setActiveTab('products');
        setEditingProductId(item.id);
        setProductForm({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            price: String(item.price ?? ''),
            category: item.category || '',
            stock: String(item.stock ?? ''),
            rating: String(item.rating ?? ''),
            badge: item.badge || '',
            image: Array.isArray(item.image) ? item.image.join(', ') : '',
            size: Array.isArray(item.size) ? item.size.join(', ') : ''
        });
    };

    const handleEditNews = (item) => {
        setActiveTab('news');
        setEditingNewsId(item.id);
        setNewsForm({
            id: item.id,
            title: item.title || '',
            summary: item.summary || '',
            content: item.content || '',
            image: item.image || '',
            author: item.author || '',
            category: item.category || '',
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
            readTime:
                item.readTime === null || item.readTime === undefined
                    ? ''
                    : String(item.readTime)
        });
    };

    const handleSubmitUser = async (event) => {
        event.preventDefault();

        if (!userForm.email.trim()) {
            toast?.error?.('Email người dùng là bắt buộc.');
            return;
        }

        if (!editingUserId && !userForm.password.trim()) {
            toast?.error?.('Tạo user mới cần có mật khẩu.');
            return;
        }

        setSubmitting(true);

        try {
            if (editingUserId) {
                await adminService.updateUser(editingUserId, {
                    name: userForm.name.trim(),
                    email: userForm.email.trim(),
                    ...(userForm.password.trim()
                        ? { password: userForm.password.trim() }
                        : {})
                });
                toast?.success?.('Cập nhật người dùng thành công.');
            } else {
                await adminService.createUser({
                    name: userForm.name.trim(),
                    email: userForm.email.trim(),
                    password: userForm.password.trim()
                });
                toast?.success?.('Tạo người dùng mới thành công.');
            }

            resetUserForm();
            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể lưu người dùng.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitProduct = async (event) => {
        event.preventDefault();

        if (!productForm.title.trim() || !productForm.price || !productForm.stock) {
            toast?.error?.(
                'Vui lòng nhập đủ tên, giá và tồn kho cho sản phẩm.'
            );
            return;
        }

        setSubmitting(true);

        try {
            if (editingProductId) {
                await adminService.updateProduct(editingProductId, productForm);
                toast?.success?.('Cập nhật sản phẩm thành công.');
            } else {
                await adminService.createProduct(productForm);
                toast?.success?.('Tạo sản phẩm mới thành công.');
            }

            resetProductForm();
            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể lưu sản phẩm.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitNews = async (event) => {
        event.preventDefault();

        if (
            !newsForm.title.trim() ||
            !newsForm.summary.trim() ||
            !newsForm.content.trim()
        ) {
            toast?.error?.(
                'Vui lòng nhập đủ tiêu đề, tóm tắt và nội dung bài viết.'
            );
            return;
        }

        setSubmitting(true);

        try {
            if (editingNewsId) {
                await adminService.updateNews(editingNewsId, newsForm);
                toast?.success?.('Cập nhật bài viết thành công.');
            } else {
                await adminService.createNews(newsForm);
                toast?.success?.('Tạo bài viết mới thành công.');
            }

            resetNewsForm();
            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể lưu bài viết.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userIdToDelete) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            return;
        }

        try {
            await adminService.deleteUser(userIdToDelete);
            toast?.success?.('Đã xóa người dùng.');

            if (editingUserId === userIdToDelete) {
                resetUserForm();
            }

            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể xóa người dùng.'
            );
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            await adminService.deleteProduct(productId);
            toast?.success?.('Đã xóa sản phẩm.');

            if (editingProductId === productId) {
                resetProductForm();
            }

            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể xóa sản phẩm.'
            );
        }
    };

    const handleDeleteNews = async (newsId) => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            return;
        }

        try {
            await adminService.deleteNews(newsId);
            toast?.success?.('Đã xóa bài viết.');

            if (editingNewsId === newsId) {
                resetNewsForm();
            }

            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(
                error?.response?.data?.message || 'Không thể xóa bài viết.'
            );
        }
    };

    if (isLoading || pageLoading) {
        return (
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.emptyState}>
                            Đang tải CMS admin...
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!userInfo) {
        return (
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.emptyState}>
                            <h3>Admin CMS cần đăng nhập</h3>
                            <p>
                                Đăng nhập để quản lý user, sản phẩm, tin tức và
                                theo dõi analytics realtime.
                            </p>
                            <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={() => {
                                    setType('login');
                                    setIsOpen(true);
                                }}
                            >
                                Mở đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.adminPage}>
                <div className="container">
                    <div className={styles.header}>
                        <div>
                            <p className={styles.kicker}>Admin CMS</p>
                            <h1>Quản trị dữ liệu realtime</h1>
                            <p className={styles.subText}>
                                Một màn quản trị để theo dõi analytics và CRUD
                                user, product, news bằng dữ liệu đồng bộ định kỳ.
                            </p>
                        </div>

                        <div className={styles.headerActions}>
                            <span className={styles.syncText}>
                                {refreshing
                                    ? 'Đang đồng bộ...'
                                    : `Cập nhật lần cuối: ${formatDateTime(lastSyncedAt)}`}
                            </span>
                            <button
                                type="button"
                                className={styles.secondaryBtn}
                                onClick={handleRefresh}
                            >
                                <FaSyncAlt />
                                Làm mới
                            </button>
                        </div>
                    </div>

                    <div className={styles.layout}>
                        <aside className={styles.sidebar}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`${styles.tabButton} ${
                                        activeTab === tab.id ? styles.activeTab : ''
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </aside>

                        <section className={styles.panel}>
                            {activeTab === 'dashboard' && (
                                <div className={styles.sectionStack}>
                                    <div className={styles.statsGrid}>
                                        <article className={styles.statCard}>
                                            <span>Tổng user</span>
                                            <strong>{analytics.totalUsers}</strong>
                                        </article>
                                        <article className={styles.statCard}>
                                            <span>Tổng sản phẩm</span>
                                            <strong>{analytics.totalProducts}</strong>
                                        </article>
                                        <article className={styles.statCard}>
                                            <span>Tổng bài viết</span>
                                            <strong>{analytics.totalNews}</strong>
                                        </article>
                                        <article className={styles.statCard}>
                                            <span>Giá trị tồn kho</span>
                                            <strong>
                                                {formatCurrency(
                                                    analytics.inventoryValue
                                                )}
                                            </strong>
                                        </article>
                                    </div>

                                    <div className={styles.dualGrid}>
                                        <article className={styles.cardBox}>
                                            <h3>Phân tích nhanh</h3>
                                            <div className={styles.metricList}>
                                                <div>
                                                    <span>Sắp hết hàng</span>
                                                    <strong>
                                                        {
                                                            analytics
                                                                .lowStockProducts
                                                                .length
                                                        }
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>Hết hàng</span>
                                                    <strong>
                                                        {
                                                            analytics
                                                                .outOfStockProducts
                                                                .length
                                                        }
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>Đánh giá trung bình</span>
                                                    <strong>
                                                        {analytics.averageRating}
                                                        /5
                                                    </strong>
                                                </div>
                                            </div>
                                        </article>

                                        <article className={styles.cardBox}>
                                            <h3>Activity feed</h3>
                                            <div className={styles.activityList}>
                                                {analytics.latestActivities.length ? (
                                                    analytics.latestActivities.map(
                                                        (item) => (
                                                            <div
                                                                key={item.id}
                                                                className={
                                                                    styles.activityItem
                                                                }
                                                            >
                                                                <span>{item.type}</span>
                                                                <strong>
                                                                    {item.title}
                                                                </strong>
                                                                <p>{item.action}</p>
                                                                <small>
                                                                    {formatDateTime(
                                                                        item.time
                                                                    )}
                                                                </small>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className={styles.emptyMini}>
                                                        Chưa có biến động dữ liệu.
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </div>

                                    <div className={styles.dualGrid}>
                                        <article className={styles.cardBox}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>Low stock</p>
                                                    <h3>Sản phẩm cần theo dõi</h3>
                                                </div>
                                            </div>
                                            <div className={styles.cardList}>
                                                {analytics.lowStockProducts.length ? (
                                                    analytics.lowStockProducts.map(
                                                        (item) => (
                                                            <div
                                                                key={item.id}
                                                                className={styles.itemCard}
                                                            >
                                                                <div>
                                                                    <strong>
                                                                        {item.title}
                                                                    </strong>
                                                                    <span>
                                                                        {item.category ||
                                                                            'Chưa phân loại'}
                                                                    </span>
                                                                </div>
                                                                <b>
                                                                    Còn {item.stock}
                                                                </b>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className={styles.emptyMini}>
                                                        Không có sản phẩm nào sắp
                                                        hết hàng.
                                                    </div>
                                                )}
                                            </div>
                                        </article>

                                        <article className={styles.cardBox}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>Realtime news</p>
                                                    <h3>Bài viết mới nhất</h3>
                                                </div>
                                            </div>
                                            <div className={styles.cardList}>
                                                {news.length ? (
                                                    news.slice(0, 5).map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className={styles.itemCard}
                                                        >
                                                            <div>
                                                                <strong>
                                                                    {item.title}
                                                                </strong>
                                                                <span>
                                                                    {item.author ||
                                                                        'Chưa có tác giả'}
                                                                </span>
                                                            </div>
                                                            <b>
                                                                {formatDateTime(
                                                                    item.updatedAt ||
                                                                        item.createdAt
                                                                )}
                                                            </b>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.emptyMini}>
                                                        Chưa có bài viết nào.
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'users' && (
                                <div className={styles.sectionStack}>
                                    <div className={styles.dualGrid}>
                                        <article className={styles.formCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>CRUD users</p>
                                                    <h3>
                                                        {editingUserId
                                                            ? 'Chỉnh sửa người dùng'
                                                            : 'Tạo người dùng mới'}
                                                    </h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryBtn}
                                                    onClick={resetUserForm}
                                                >
                                                    <FaPlus />
                                                    Tạo mới
                                                </button>
                                            </div>

                                            <form
                                                className={styles.formGrid}
                                                onSubmit={handleSubmitUser}
                                            >
                                                <label>
                                                    Tên hiển thị
                                                    <input
                                                        type="text"
                                                        value={userForm.name}
                                                        onChange={(event) =>
                                                            setUserForm((prev) => ({
                                                                ...prev,
                                                                name: event.target.value
                                                            }))
                                                        }
                                                        placeholder="Tên người dùng"
                                                    />
                                                </label>
                                                <label>
                                                    Email
                                                    <input
                                                        type="email"
                                                        value={userForm.email}
                                                        onChange={(event) =>
                                                            setUserForm((prev) => ({
                                                                ...prev,
                                                                email: event.target.value
                                                            }))
                                                        }
                                                        placeholder="user@email.com"
                                                    />
                                                </label>
                                                <label>
                                                    {editingUserId
                                                        ? 'Mật khẩu mới'
                                                        : 'Mật khẩu'}
                                                    <input
                                                        type="password"
                                                        value={userForm.password}
                                                        onChange={(event) =>
                                                            setUserForm((prev) => ({
                                                                ...prev,
                                                                password:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="Bỏ trống nếu không đổi"
                                                    />
                                                </label>

                                                <div className={styles.formActions}>
                                                    <button
                                                        type="submit"
                                                        className={styles.primaryBtn}
                                                        disabled={submitting}
                                                    >
                                                        {submitting
                                                            ? 'Đang lưu...'
                                                            : editingUserId
                                                              ? 'Cập nhật user'
                                                              : 'Tạo user'}
                                                    </button>
                                                </div>
                                            </form>
                                        </article>

                                        <article className={styles.tableCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>Realtime users</p>
                                                    <h3>Danh sách tài khoản</h3>
                                                </div>
                                            </div>

                                            <div className={styles.tableWrap}>
                                                <table className={styles.dataTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Tên</th>
                                                            <th>Email</th>
                                                            <th>Cập nhật</th>
                                                            <th>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {users.length ? (
                                                            users.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td>
                                                                        {item.name ||
                                                                            'Chưa đặt tên'}
                                                                    </td>
                                                                    <td>{item.email}</td>
                                                                    <td>
                                                                        {formatDateTime(
                                                                            item.updatedAt ||
                                                                                item.createdAt
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            className={
                                                                                styles.rowActions
                                                                            }
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleEditUser(
                                                                                        item
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FaPen />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDeleteUser(
                                                                                        item.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FaTrashAlt />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4">
                                                                    <div
                                                                        className={
                                                                            styles.emptyMini
                                                                        }
                                                                    >
                                                                        Chưa có user nào.
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'products' && (
                                <div className={styles.sectionStack}>
                                    <div className={styles.dualGrid}>
                                        <article className={styles.formCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>CRUD products</p>
                                                    <h3>
                                                        {editingProductId
                                                            ? 'Chỉnh sửa sản phẩm'
                                                            : 'Tạo sản phẩm mới'}
                                                    </h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryBtn}
                                                    onClick={resetProductForm}
                                                >
                                                    <FaPlus />
                                                    Tạo mới
                                                </button>
                                            </div>

                                            <form
                                                className={styles.formGrid}
                                                onSubmit={handleSubmitProduct}
                                            >
                                                <label>
                                                    Tên sản phẩm
                                                    <input
                                                        type="text"
                                                        value={productForm.title}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                title: event.target.value
                                                            }))
                                                        }
                                                        placeholder="Tên sản phẩm"
                                                    />
                                                </label>
                                                <label>
                                                    Danh mục
                                                    <input
                                                        type="text"
                                                        value={productForm.category}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                category:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="controller, headset..."
                                                    />
                                                </label>
                                                <label>
                                                    Giá
                                                    <input
                                                        type="number"
                                                        value={productForm.price}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                price: event.target.value
                                                            }))
                                                        }
                                                        placeholder="1399000"
                                                    />
                                                </label>
                                                <label>
                                                    Tồn kho
                                                    <input
                                                        type="number"
                                                        value={productForm.stock}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                stock: event.target.value
                                                            }))
                                                        }
                                                        placeholder="12"
                                                    />
                                                </label>
                                                <label>
                                                    Rating
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={productForm.rating}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                rating: event.target.value
                                                            }))
                                                        }
                                                        placeholder="4.8"
                                                    />
                                                </label>
                                                <label>
                                                    Badge
                                                    <input
                                                        type="text"
                                                        value={productForm.badge}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                badge: event.target.value
                                                            }))
                                                        }
                                                        placeholder="New / Hot"
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Ảnh sản phẩm
                                                    <input
                                                        type="text"
                                                        value={productForm.image}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                image: event.target.value
                                                            }))
                                                        }
                                                        placeholder="url1, url2, url3"
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Kích thước
                                                    <input
                                                        type="text"
                                                        value={productForm.size}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                size: event.target.value
                                                            }))
                                                        }
                                                        placeholder="S, M, L"
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Mô tả
                                                    <textarea
                                                        rows="5"
                                                        value={productForm.description}
                                                        onChange={(event) =>
                                                            setProductForm((prev) => ({
                                                                ...prev,
                                                                description:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="Mô tả chi tiết sản phẩm"
                                                    />
                                                </label>

                                                <div className={styles.formActions}>
                                                    <button
                                                        type="submit"
                                                        className={styles.primaryBtn}
                                                        disabled={submitting}
                                                    >
                                                        {submitting
                                                            ? 'Đang lưu...'
                                                            : editingProductId
                                                              ? 'Cập nhật sản phẩm'
                                                              : 'Tạo sản phẩm'}
                                                    </button>
                                                </div>
                                            </form>
                                        </article>

                                        <article className={styles.tableCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>Realtime products</p>
                                                    <h3>Danh sách sản phẩm</h3>
                                                </div>
                                            </div>

                                            <div className={styles.cardList}>
                                                {products.length ? (
                                                    products.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className={styles.itemCard}
                                                        >
                                                            <div className={styles.itemCardMain}>
                                                                <strong>
                                                                    {item.title}
                                                                </strong>
                                                                <span>
                                                                    {item.category ||
                                                                        'Chưa phân loại'}
                                                                </span>
                                                                <small>
                                                                    {formatCurrency(
                                                                        item.price
                                                                    )}{' '}
                                                                    | Kho:{' '}
                                                                    {item.stock}
                                                                </small>
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.rowActions
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditProduct(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    <FaPen />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteProduct(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FaTrashAlt />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.emptyMini}>
                                                        Chưa có sản phẩm nào.
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'news' && (
                                <div className={styles.sectionStack}>
                                    <div className={styles.dualGrid}>
                                        <article className={styles.formCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>CRUD news</p>
                                                    <h3>
                                                        {editingNewsId
                                                            ? 'Chỉnh sửa bài viết'
                                                            : 'Tạo bài viết mới'}
                                                    </h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryBtn}
                                                    onClick={resetNewsForm}
                                                >
                                                    <FaPlus />
                                                    Tạo mới
                                                </button>
                                            </div>

                                            <form
                                                className={styles.formGrid}
                                                onSubmit={handleSubmitNews}
                                            >
                                                <label className={styles.fullField}>
                                                    Tiêu đề
                                                    <input
                                                        type="text"
                                                        value={newsForm.title}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                title: event.target.value
                                                            }))
                                                        }
                                                        placeholder="Tiêu đề bài viết"
                                                    />
                                                </label>
                                                <label>
                                                    Tác giả
                                                    <input
                                                        type="text"
                                                        value={newsForm.author}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                author: event.target.value
                                                            }))
                                                        }
                                                        placeholder="Admin / Editorial"
                                                    />
                                                </label>
                                                <label>
                                                    Danh mục
                                                    <input
                                                        type="text"
                                                        value={newsForm.category}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                category:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="Gaming, Guide..."
                                                    />
                                                </label>
                                                <label>
                                                    Tags
                                                    <input
                                                        type="text"
                                                        value={newsForm.tags}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                tags: event.target.value
                                                            }))
                                                        }
                                                        placeholder="tag 1, tag 2"
                                                    />
                                                </label>
                                                <label>
                                                    Thời gian đọc
                                                    <input
                                                        type="number"
                                                        value={newsForm.readTime}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                readTime:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="5"
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Ảnh cover
                                                    <input
                                                        type="text"
                                                        value={newsForm.image}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                image: event.target.value
                                                            }))
                                                        }
                                                        placeholder="https://..."
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Tóm tắt
                                                    <textarea
                                                        rows="3"
                                                        value={newsForm.summary}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                summary:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="Tóm tắt bài viết"
                                                    />
                                                </label>
                                                <label className={styles.fullField}>
                                                    Nội dung
                                                    <textarea
                                                        rows="8"
                                                        value={newsForm.content}
                                                        onChange={(event) =>
                                                            setNewsForm((prev) => ({
                                                                ...prev,
                                                                content:
                                                                    event.target.value
                                                            }))
                                                        }
                                                        placeholder="Nội dung chi tiết"
                                                    />
                                                </label>

                                                <div className={styles.formActions}>
                                                    <button
                                                        type="submit"
                                                        className={styles.primaryBtn}
                                                        disabled={submitting}
                                                    >
                                                        {submitting
                                                            ? 'Đang lưu...'
                                                            : editingNewsId
                                                              ? 'Cập nhật bài viết'
                                                              : 'Tạo bài viết'}
                                                    </button>
                                                </div>
                                            </form>
                                        </article>

                                        <article className={styles.tableCard}>
                                            <div className={styles.sectionHeader}>
                                                <div>
                                                    <p>Realtime news</p>
                                                    <h3>Danh sách bài viết</h3>
                                                </div>
                                            </div>

                                            <div className={styles.cardList}>
                                                {news.length ? (
                                                    news.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className={styles.itemCard}
                                                        >
                                                            <div className={styles.itemCardMain}>
                                                                <strong>
                                                                    {item.title}
                                                                </strong>
                                                                <span>
                                                                    {item.author ||
                                                                        'Chưa có tác giả'}
                                                                </span>
                                                                <small>
                                                                    {item.category ||
                                                                        'No category'}{' '}
                                                                    |{' '}
                                                                    {item.readTime
                                                                        ? `${item.readTime} phút đọc`
                                                                        : 'Chưa có read time'}
                                                                </small>
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.rowActions
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditNews(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    <FaPen />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteNews(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FaTrashAlt />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.emptyMini}>
                                                        Chưa có bài viết nào.
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AdminPage;
