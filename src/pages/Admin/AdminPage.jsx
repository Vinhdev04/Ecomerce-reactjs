import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import adminService from '@api/adminService';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import styles from './AdminPage.module.scss';
import {
    FaArrowTrendUp,
    FaBoxOpen,
    FaChartLine,
    FaChevronRight,
    FaNewspaper,
    FaPen,
    FaPlus,
    FaArrowsRotate,
    FaTrashCan,
    FaUsers
} from 'react-icons/fa6';

const POLL_INTERVAL_MS = 15000;
const sections = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { id: 'products', label: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { id: 'news', label: 'News', path: '/admin/news', icon: <FaNewspaper /> },
    { id: 'users', label: 'Users', path: '/admin/users', icon: <FaUsers /> }
];

const createUserForm = () => ({ name: '', email: '', password: '', role: 'CUSTOMER' });
const createProductForm = () => ({
    title: '', description: '', price: '', category: '', stock: '', rating: '', badge: '', image: '', size: ''
});
const createNewsForm = () => ({
    title: '', summary: '', content: '', image: '', author: '', category: '', tags: '', readTime: ''
});

const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : 'Chưa có');
const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const safeArrayResponse = async (request) => {
    try {
        const response = await request();
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        if (error?.response?.status === 404) return [];
        throw error;
    }
};

const TinyLineChart = ({ values = [] }) => {
    const width = 420;
    const height = 160;
    const max = Math.max(...values, 1);
    const stepX = width / Math.max(values.length - 1, 1);
    const points = values
        .map((value, index) => {
            const x = index * stepX;
            const y = height - (value / max) * 120 - 18;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg}>
            <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,123,33,0.35)" />
                    <stop offset="100%" stopColor="rgba(255,123,33,0.02)" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke="#ff7b21"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            {values.map((value, index) => {
                const x = index * stepX;
                const y = height - (value / max) * 120 - 18;
                return <circle key={`${value}-${index}`} cx={x} cy={y} r="5" fill="#ff7b21" />;
            })}
        </svg>
    );
};

const DonutChart = ({ items = [] }) => {
    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
    let offset = 0;

    return (
        <svg viewBox="0 0 220 220" className={styles.donutSvg}>
            <circle cx="110" cy="110" r="72" fill="none" stroke="#252935" strokeWidth="28" />
            {items.map((item) => {
                const fraction = item.value / total;
                const circumference = 2 * Math.PI * 72;
                const dash = circumference * fraction;
                const circle = (
                    <circle
                        key={item.label}
                        cx="110"
                        cy="110"
                        r="72"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="28"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 110 110)"
                        strokeLinecap="round"
                    />
                );
                offset += dash;
                return circle;
            })}
            <text x="110" y="104" textAnchor="middle" className={styles.donutValue}>
                {total}
            </text>
            <text x="110" y="126" textAnchor="middle" className={styles.donutLabel}>
                danh mục
            </text>
        </svg>
    );
};

function AdminPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useContext(ToastContext);
    const { userInfo, isLoading } = useContext(UserInfoContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [editingUserId, setEditingUserId] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const [editingNewsId, setEditingNewsId] = useState('');
    const [userForm, setUserForm] = useState(createUserForm());
    const [productForm, setProductForm] = useState(createProductForm());
    const [newsForm, setNewsForm] = useState(createNewsForm());

    const activeSection = useMemo(() => {
        if (location.pathname.startsWith('/admin/users')) return 'users';
        if (location.pathname.startsWith('/admin/products')) return 'products';
        if (location.pathname.startsWith('/admin/news')) return 'news';
        return 'dashboard';
    }, [location.pathname]);

    const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
        if (!userInfo?.role || userInfo.role !== 'ADMIN') {
            setPageLoading(false);
            return;
        }

        silent ? setRefreshing(true) : setPageLoading(true);
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
            toast?.error?.(error?.response?.data?.message || 'Không thể tải dữ liệu CMS.');
        } finally {
            setPageLoading(false);
            setRefreshing(false);
        }
    }, [toast, userInfo]);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'ADMIN') return undefined;
        const timer = setInterval(() => fetchAdminData({ silent: true }), POLL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [fetchAdminData, userInfo]);

    const analytics = useMemo(() => {
        const inventoryValue = products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0);
        const monthlySeries = [12, 18, 16, 24, 21, 28].map((base, index) => base + users.length + news.length + (index + 1) * 2);
        const categoryMap = products.reduce((acc, item) => {
            const key = item.category || 'Khác';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const categoryData = Object.entries(categoryMap)
            .slice(0, 4)
            .map(([label, value], index) => ({
                label,
                value,
                color: ['#ff7b21', '#34d399', '#60a5fa', '#a78bfa'][index % 4]
            }));
        const recentActivity = [...users, ...products, ...news]
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 6);
        return {
            inventoryValue,
            lowStockCount: products.filter((item) => Number(item.stock || 0) > 0 && Number(item.stock || 0) <= 10).length,
            liveProducts: products.filter((item) => Number(item.stock || 0) > 0).length,
            monthlySeries,
            categoryData,
            recentActivity
        };
    }, [news, products, users]);

    const filteredUsers = users.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredProducts = products.filter((item) => `${item.title} ${item.category} ${item.badge}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredNews = news.filter((item) => `${item.title} ${item.author} ${item.category}`.toLowerCase().includes(searchTerm.toLowerCase()));

    const resetUserForm = () => { setEditingUserId(''); setUserForm(createUserForm()); };
    const resetProductForm = () => { setEditingProductId(''); setProductForm(createProductForm()); };
    const resetNewsForm = () => { setEditingNewsId(''); setNewsForm(createNewsForm()); };

    const handleUserSubmit = async (event) => {
        event.preventDefault();
        if (!userForm.email.trim() || (!editingUserId && !userForm.password.trim())) return toast?.error?.('Vui lòng nhập đủ email và mật khẩu.');
        setSubmitting(true);
        try {
            if (editingUserId) {
                await adminService.updateUser(editingUserId, { ...userForm, ...(userForm.password ? {} : { password: undefined }) });
                toast?.success?.('Đã cập nhật tài khoản.');
            } else {
                await adminService.createUser(userForm);
                toast?.success?.('Đã tạo tài khoản mới.');
            }
            resetUserForm();
            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Không thể lưu tài khoản.');
        } finally { setSubmitting(false); }
    };
    const handleProductSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            editingProductId ? await adminService.updateProduct(editingProductId, productForm) : await adminService.createProduct(productForm);
            toast?.success?.(editingProductId ? 'Đã cập nhật sản phẩm.' : 'Đã tạo sản phẩm.');
            resetProductForm(); fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Không thể lưu sản phẩm.');
        } finally { setSubmitting(false); }
    };
    const handleNewsSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            editingNewsId ? await adminService.updateNews(editingNewsId, newsForm) : await adminService.createNews(newsForm);
            toast?.success?.(editingNewsId ? 'Đã cập nhật bài viết.' : 'Đã tạo bài viết.');
            resetNewsForm(); fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Không thể lưu bài viết.');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Bạn có chắc muốn xóa bản ghi này?')) return;
        try {
            if (type === 'users') await adminService.deleteUser(id);
            if (type === 'products') await adminService.deleteProduct(id);
            if (type === 'news') await adminService.deleteNews(id);
            toast?.success?.('Đã xóa dữ liệu.');
            fetchAdminData({ silent: true });
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Không thể xóa dữ liệu.');
        }
    };

    if (isLoading || pageLoading) return <div className={styles.gate}>Đang tải Admin CMS...</div>;
    if (!userInfo) return <div className={styles.gate}><h2>Admin CMS cần đăng nhập</h2><button className={styles.primaryBtn} onClick={() => { setType('login'); setIsOpen(true); }}>Mở đăng nhập</button></div>;
    if (userInfo.role !== 'ADMIN') return <div className={styles.gate}><h2>Bạn không có quyền quản trị</h2><p>Tài khoản hiện tại chưa được cấp role ADMIN.</p><Link to="/" className={styles.primaryBtn}>Quay về trang chủ</Link></div>;

    const renderCardActions = (onEdit, onDelete) => (
        <div className={styles.cardActions}>
            <button type="button" onClick={onEdit}><FaPen /></button>
            <button type="button" onClick={onDelete}><FaTrashCan /></button>
        </div>
    );

    return (
        <div className={styles.adminShell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}><span>XP</span><div><strong>XPAD Admin</strong><small>Control center</small></div></div>
                <nav className={styles.nav}>
                    {sections.map((item) => <NavLink key={item.id} to={item.path} end={item.id === 'dashboard'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>{item.icon}{item.label}</NavLink>)}
                </nav>
                <div className={styles.sidebarMeta}>
                    <div><span>Admin</span><strong>{userInfo.name || userInfo.email}</strong></div>
                    <div><span>Lần sync</span><strong>{lastSyncedAt ? formatDateTime(lastSyncedAt) : 'Chưa có'}</strong></div>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div><p className={styles.kicker}>Realtime CMS</p><h1>{sections.find((item) => item.id === activeSection)?.label}</h1></div>
                    <div className={styles.topbarActions}>
                        <div className={styles.searchBox}><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm trong khu quản trị..." /></div>
                        <button type="button" className={styles.secondaryBtn} onClick={() => fetchAdminData({ silent: true })}><FaArrowsRotate />{refreshing ? 'Đang sync' : 'Làm mới'}</button>
                        <button type="button" className={styles.primaryBtn} onClick={() => navigate('/')}>Xem storefront <FaChevronRight /></button>
                    </div>
                </header>

                {activeSection === 'dashboard' && (
                    <>
                        <section className={styles.heroGrid}>
                            {[{ label: 'Total Users', value: users.length, helper: 'Tài khoản đang quản lý', icon: <FaUsers /> }, { label: 'Live Products', value: analytics.liveProducts, helper: 'Sản phẩm đang còn hàng', icon: <FaBoxOpen /> }, { label: 'News Articles', value: news.length, helper: 'Bài viết đang hoạt động', icon: <FaNewspaper /> }, { label: 'Inventory Value', value: formatCurrency(analytics.inventoryValue), helper: `${analytics.lowStockCount} sản phẩm sắp hết`, icon: <FaArrowTrendUp /> }].map((item, index) => <article key={item.label} className={styles.metricCard} style={{ animationDelay: `${index * 90}ms` }}><span>{item.label}</span><strong>{item.value}</strong><small>{item.helper}</small><div className={styles.metricIcon}>{item.icon}</div></article>)}
                        </section>

                        <section className={styles.contentGrid}>
                            <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Overview</p><h3>Nhịp tăng trưởng hệ thống</h3></div><span className={styles.liveBadge}>Live</span></div><TinyLineChart values={analytics.monthlySeries} /></article>
                            <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Category Mix</p><h3>Tỷ trọng danh mục</h3></div></div><div className={styles.donutWrap}><DonutChart items={analytics.categoryData} /><div className={styles.legend}>{analytics.categoryData.map((item) => <div key={item.label}><i style={{ background: item.color }} /> <span>{item.label}</span><strong>{item.value}</strong></div>)}</div></div></article>
                        </section>

                        <section className={styles.contentGrid}>
                            <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Stock Watch</p><h3>Kho cần chú ý</h3></div></div><div className={styles.feedList}>{products.sort((a, b) => Number(a.stock) - Number(b.stock)).slice(0, 5).map((item) => <div key={item.id} className={styles.feedItem}><div><strong>{item.title}</strong><span>{item.category || 'Chưa phân loại'}</span></div><b>{item.stock} sp</b></div>)}</div></article>
                            <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Realtime Feed</p><h3>Hoạt động gần nhất</h3></div></div><div className={styles.feedList}>{analytics.recentActivity.map((item) => <div key={item.id} className={styles.feedItem}><div><strong>{item.title || item.email}</strong><span>{formatDateTime(item.updatedAt || item.createdAt)}</span></div><b>{item.role || item.category || 'Updated'}</b></div>)}</div></article>
                        </section>
                    </>
                )}

                {activeSection === 'users' && (
                    <section className={styles.contentGrid}>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>User CRUD</p><h3>{editingUserId ? 'Cập nhật tài khoản' : 'Tạo tài khoản admin hoặc customer'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetUserForm}><FaPlus /> Mới</button></div><form className={styles.formGrid} onSubmit={handleUserSubmit}><input value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên hiển thị" /><input value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" /><input value={userForm.password} type="password" onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={editingUserId ? 'Mật khẩu mới' : 'Mật khẩu'} /><select value={userForm.role} onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}><option value="CUSTOMER">Customer</option><option value="ADMIN">Admin</option></select><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingUserId ? 'Cập nhật user' : 'Tạo user'}</button></form></article>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Directory</p><h3>Danh sách tài khoản</h3></div></div><div className={styles.listGrid}>{filteredUsers.map((item) => <div key={item.id} className={styles.dataCard}><div><strong>{item.name || item.email}</strong><span>{item.email}</span></div><div className={styles.metaRow}><span className={`${styles.rolePill} ${item.role === 'ADMIN' ? styles.adminPill : ''}`}>{item.role}</span><small>{formatDateTime(item.updatedAt || item.createdAt)}</small></div>{renderCardActions(() => { setEditingUserId(item.id); setUserForm({ name: item.name || '', email: item.email || '', password: '', role: item.role || 'CUSTOMER' }); }, () => handleDelete('users', item.id))}</div>)}</div></article>
                    </section>
                )}

                {activeSection === 'products' && (
                    <section className={styles.contentGrid}>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Product Studio</p><h3>{editingProductId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetProductForm}><FaPlus /> Mới</button></div><form className={styles.formGrid} onSubmit={handleProductSubmit}><input value={productForm.title} onChange={(e) => setProductForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tên sản phẩm" /><input value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Danh mục" /><input type="number" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Giá" /><input type="number" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} placeholder="Tồn kho" /><input value={productForm.badge} onChange={(e) => setProductForm((prev) => ({ ...prev, badge: e.target.value }))} placeholder="Badge" /><input type="number" step="0.1" value={productForm.rating} onChange={(e) => setProductForm((prev) => ({ ...prev, rating: e.target.value }))} placeholder="Rating" /><input className={styles.span2} value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Ảnh, ngăn cách dấu phẩy" /><input className={styles.span2} value={productForm.size} onChange={(e) => setProductForm((prev) => ({ ...prev, size: e.target.value }))} placeholder="Size, ngăn cách dấu phẩy" /><textarea className={styles.span2} rows="5" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả sản phẩm" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingProductId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</button></form></article>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Catalog</p><h3>Sản phẩm đang quản lý</h3></div></div><div className={styles.listGrid}>{filteredProducts.map((item) => <div key={item.id} className={styles.dataCard}><div className={styles.thumbWrap}><img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.title} /></div><div><strong>{item.title}</strong><span>{item.category}</span></div><div className={styles.metaRow}><span>{formatCurrency(item.price)}</span><small>Kho: {item.stock}</small></div>{renderCardActions(() => { setEditingProductId(item.id); setProductForm({ title: item.title || '', description: item.description || '', price: String(item.price ?? ''), category: item.category || '', stock: String(item.stock ?? ''), rating: String(item.rating ?? ''), badge: item.badge || '', image: Array.isArray(item.image) ? item.image.join(', ') : '', size: Array.isArray(item.size) ? item.size.join(', ') : '' }); }, () => handleDelete('products', item.id))}</div>)}</div></article>
                    </section>
                )}

                {activeSection === 'news' && (
                    <section className={styles.contentGrid}>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Editorial CMS</p><h3>{editingNewsId ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetNewsForm}><FaPlus /> Mới</button></div><form className={styles.formGrid} onSubmit={handleNewsSubmit}><input className={styles.span2} value={newsForm.title} onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tiêu đề" /><input value={newsForm.author} onChange={(e) => setNewsForm((prev) => ({ ...prev, author: e.target.value }))} placeholder="Tác giả" /><input value={newsForm.category} onChange={(e) => setNewsForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Danh mục" /><input value={newsForm.tags} onChange={(e) => setNewsForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="Tags" /><input type="number" value={newsForm.readTime} onChange={(e) => setNewsForm((prev) => ({ ...prev, readTime: e.target.value }))} placeholder="Read time" /><input className={styles.span2} value={newsForm.image} onChange={(e) => setNewsForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Ảnh cover" /><textarea className={styles.span2} rows="3" value={newsForm.summary} onChange={(e) => setNewsForm((prev) => ({ ...prev, summary: e.target.value }))} placeholder="Tóm tắt" /><textarea className={styles.span2} rows="8" value={newsForm.content} onChange={(e) => setNewsForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="Nội dung" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingNewsId ? 'Cập nhật bài viết' : 'Tạo bài viết'}</button></form></article>
                        <article className={styles.panelCard}><div className={styles.panelHead}><div><p className={styles.kicker}>Publishing Queue</p><h3>Bài viết hiện có</h3></div></div><div className={styles.listGrid}>{filteredNews.map((item) => <div key={item.id} className={styles.dataCard}><div className={styles.thumbWrap}><img src={item.image} alt={item.title} /></div><div><strong>{item.title}</strong><span>{item.author || 'Admin'} • {item.category || 'General'}</span></div><div className={styles.metaRow}><span>{item.readTime ? `${item.readTime} phút đọc` : 'Chưa có read time'}</span><small>{formatDateTime(item.updatedAt || item.createdAt)}</small></div>{renderCardActions(() => { setEditingNewsId(item.id); setNewsForm({ title: item.title || '', summary: item.summary || '', content: item.content || '', image: item.image || '', author: item.author || '', category: item.category || '', tags: Array.isArray(item.tags) ? item.tags.join(', ') : '', readTime: item.readTime ? String(item.readTime) : '' }); }, () => handleDelete('news', item.id))}</div>)}</div></article>
                    </section>
                )}
            </main>
        </div>
    );
}

export default AdminPage;
