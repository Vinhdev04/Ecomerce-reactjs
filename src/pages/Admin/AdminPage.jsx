import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import adminService from '@api/adminService';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import styles from './AdminPage.module.scss';
import { FaArrowTrendUp, FaArrowsRotate, FaBoxOpen, FaChartLine, FaChevronRight, FaCreditCard, FaEye, FaNewspaper, FaPen, FaPlus, FaTrashCan, FaUsers } from 'react-icons/fa6';

const POLL_INTERVAL_MS = 15000;
const sections = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { id: 'payments', label: 'Payments', path: '/admin/payments', icon: <FaCreditCard /> },
    { id: 'products', label: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { id: 'news', label: 'News', path: '/admin/news', icon: <FaNewspaper /> },
    { id: 'users', label: 'Users', path: '/admin/users', icon: <FaUsers /> }
];
const paymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
const makeUser = () => ({ name: '', email: '', password: '', role: 'CUSTOMER' });
const makeProduct = () => ({ title: '', description: '', price: '', category: '', stock: '', rating: '', badge: '', image: '', size: '' });
const makeNews = () => ({ title: '', summary: '', content: '', image: '', author: '', category: '', tags: '', readTime: '' });
const formatDateTime = (v) => (v ? new Date(v).toLocaleString('vi-VN') : 'Chưa có');
const money = (v) => `${Number(v || 0).toLocaleString('vi-VN')}đ`;

const safeArrayResponse = async (request) => {
    try {
        const response = await request();
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        if (error?.response?.status === 404) return [];
        throw error;
    }
};

const TinyLineChart = ({ values }) => {
    const width = 520;
    const height = 180;
    const max = Math.max(...values, 1);
    const stepX = width / Math.max(values.length - 1, 1);
    const line = values.map((v, i) => `${i * stepX},${height - (v / max) * 125 - 18}`).join(' ');
    return <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg}><polyline fill="none" stroke="#ff7b21" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={line} />{values.map((v, i) => <circle key={`${i}-${v}`} cx={i * stepX} cy={height - (v / max) * 125 - 18} r="5" fill="#ff7b21" />)}</svg>;
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
    const [orders, setOrders] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [editingUserId, setEditingUserId] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const [editingNewsId, setEditingNewsId] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [userForm, setUserForm] = useState(makeUser());
    const [productForm, setProductForm] = useState(makeProduct());
    const [newsForm, setNewsForm] = useState(makeNews());

    const activeSection = useMemo(() => {
        if (location.pathname.startsWith('/admin/payments')) return 'payments';
        if (location.pathname.startsWith('/admin/products')) return 'products';
        if (location.pathname.startsWith('/admin/news')) return 'news';
        if (location.pathname.startsWith('/admin/users')) return 'users';
        return 'dashboard';
    }, [location.pathname]);

    const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
        if (userInfo?.role !== 'ADMIN') {
            setPageLoading(false);
            return;
        }
        silent ? setRefreshing(true) : setPageLoading(true);
        try {
            const [usersData, productsData, newsData, ordersData] = await Promise.all([
                safeArrayResponse(() => adminService.getUsers()),
                safeArrayResponse(() => adminService.getProducts()),
                safeArrayResponse(() => adminService.getNews()),
                safeArrayResponse(() => adminService.getOrders())
            ]);
            setUsers(usersData);
            setProducts(productsData);
            setNews(newsData);
            setOrders(ordersData);
            setLastSyncedAt(new Date());
            setSelectedOrderId((prev) => prev || ordersData[0]?.id || '');
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Không thể tải dữ liệu CMS.');
        } finally {
            setPageLoading(false);
            setRefreshing(false);
        }
    }, [toast, userInfo]);

    useEffect(() => { fetchAdminData(); }, [fetchAdminData]);
    useEffect(() => {
        if (userInfo?.role !== 'ADMIN') return undefined;
        const timer = setInterval(() => fetchAdminData({ silent: true }), POLL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [fetchAdminData, userInfo]);

    const analytics = useMemo(() => {
        const revenue = orders.filter((item) => item.paymentStatus === 'PAID').reduce((sum, item) => sum + Number(item.total || 0), 0);
        return {
            revenue,
            pendingPayments: orders.filter((item) => item.paymentStatus === 'PENDING').length,
            inventoryValue: products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0),
            lowStockCount: products.filter((item) => { const stock = Number(item.stock || 0); return stock > 0 && stock <= 10; }).length,
            monthlySeries: [14, 19, 17, 25, 22, 31].map((base, index) => base + orders.length + index * 2),
            recentActivity: [...orders, ...products, ...news, ...users].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 6)
        };
    }, [news, orders, products, users]);

    const selectedOrder = orders.find((item) => item.id === selectedOrderId) || orders[0];
    const filteredUsers = users.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredProducts = products.filter((item) => `${item.title} ${item.category} ${item.badge}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredNews = news.filter((item) => `${item.title} ${item.author} ${item.category}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredOrders = orders.filter((item) => `${item.orderCode} ${item.customerName} ${item.customerEmail} ${item.paymentMethod} ${item.paymentStatus}`.toLowerCase().includes(searchTerm.toLowerCase()));

    const gate = !userInfo ? { title: 'Admin CMS cần đăng nhập', action: () => { setType('login'); setIsOpen(true); }, label: 'Mở đăng nhập' } : userInfo.role !== 'ADMIN' ? { title: 'Bạn không có quyền quản trị', desc: 'Tài khoản hiện tại chưa được cấp role ADMIN.', href: '/' } : null;
    if (isLoading || pageLoading) return <div className={styles.gate}>Đang tải Admin CMS...</div>;
    if (gate) return <div className={styles.gate}><h2>{gate.title}</h2>{gate.desc && <p>{gate.desc}</p>}{gate.href ? <Link to={gate.href} className={styles.primaryBtn}>Quay về trang chủ</Link> : <button className={styles.primaryBtn} onClick={gate.action}>{gate.label}</button>}</div>;

    const resetUser = () => { setEditingUserId(''); setUserForm(makeUser()); };
    const resetProduct = () => { setEditingProductId(''); setProductForm(makeProduct()); };
    const resetNews = () => { setEditingNewsId(''); setNewsForm(makeNews()); };

    const onUserSubmit = async (e) => {
        e.preventDefault();
        if (!userForm.email.trim() || (!editingUserId && !userForm.password.trim())) return toast?.error?.('Vui lòng nhập đủ email và mật khẩu.');
        setSubmitting(true);
        try {
            editingUserId ? await adminService.updateUser(editingUserId, { ...userForm, ...(userForm.password ? {} : { password: undefined }) }) : await adminService.createUser(userForm);
            toast?.success?.(editingUserId ? 'Đã cập nhật tài khoản.' : 'Đã tạo tài khoản mới.');
            resetUser();
            fetchAdminData({ silent: true });
        } catch (error) { toast?.error?.(error?.response?.data?.message || 'Không thể lưu tài khoản.'); } finally { setSubmitting(false); }
    };
    const onProductSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            editingProductId ? await adminService.updateProduct(editingProductId, productForm) : await adminService.createProduct(productForm);
            toast?.success?.(editingProductId ? 'Đã cập nhật sản phẩm.' : 'Đã tạo sản phẩm.');
            resetProduct();
            fetchAdminData({ silent: true });
        } catch (error) { toast?.error?.(error?.response?.data?.message || 'Không thể lưu sản phẩm.'); } finally { setSubmitting(false); }
    };
    const onNewsSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            editingNewsId ? await adminService.updateNews(editingNewsId, newsForm) : await adminService.createNews(newsForm);
            toast?.success?.(editingNewsId ? 'Đã cập nhật bài viết.' : 'Đã tạo bài viết.');
            resetNews();
            fetchAdminData({ silent: true });
        } catch (error) { toast?.error?.(error?.response?.data?.message || 'Không thể lưu bài viết.'); } finally { setSubmitting(false); }
    };
    const onDelete = async (type, id) => {
        if (!window.confirm('Bạn có chắc muốn xóa bản ghi này?')) return;
        try {
            if (type === 'users') await adminService.deleteUser(id);
            if (type === 'products') await adminService.deleteProduct(id);
            if (type === 'news') await adminService.deleteNews(id);
            toast?.success?.('Đã xóa dữ liệu.');
            fetchAdminData({ silent: true });
        } catch (error) { toast?.error?.(error?.response?.data?.message || 'Không thể xóa dữ liệu.'); }
    };
    const onUpdateOrder = async (id, payload) => {
        try {
            await adminService.updateOrderStatus(id, payload);
            toast?.success?.('Đã cập nhật trạng thái thanh toán.');
            fetchAdminData({ silent: true });
        } catch (error) { toast?.error?.(error?.response?.data?.message || 'Không thể cập nhật đơn hàng.'); }
    };

    const actions = (onEdit, onRemove) => <div className={styles.rowActions}><button type="button" onClick={onEdit}><FaPen /></button><button type="button" onClick={onRemove}><FaTrashCan /></button></div>;

    return (
        <div className={styles.adminShell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}><span>XP</span><div><strong>XPAD Admin</strong><small>commerce control center</small></div></div>
                <nav className={styles.nav}>{sections.map((item) => <NavLink key={item.id} to={item.path} end={item.id === 'dashboard'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>{item.icon}{item.label}</NavLink>)}</nav>
                <div className={styles.sidebarMeta}><div><span>Admin</span><strong>{userInfo.name || userInfo.email}</strong></div><div><span>Sync gần nhất</span><strong>{lastSyncedAt ? formatDateTime(lastSyncedAt) : 'Chưa có'}</strong></div></div>
            </aside>

            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div><p className={styles.kicker}>Realtime CMS</p><h1>{sections.find((item) => item.id === activeSection)?.label}</h1></div>
                    <div className={styles.topbarActions}><div className={styles.searchBox}><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm trong khu quản trị..." /></div><button type="button" className={styles.secondaryBtn} onClick={() => fetchAdminData({ silent: true })}><FaArrowsRotate />{refreshing ? 'Đang sync' : 'Làm mới'}</button><button type="button" className={styles.primaryBtn} onClick={() => navigate('/')}>Xem storefront <FaChevronRight /></button></div>
                </header>

                <section className={styles.metricsRow}>
                    {[{ label: 'Users', value: users.length, helper: 'tài khoản đang quản lý', icon: <FaUsers /> }, { label: 'Revenue', value: money(analytics.revenue), helper: `${orders.length} đơn hàng`, icon: <FaArrowTrendUp /> }, { label: 'Products', value: products.length, helper: `${analytics.lowStockCount} sắp hết hàng`, icon: <FaBoxOpen /> }, { label: 'Pending', value: analytics.pendingPayments, helper: 'payment cần xử lý', icon: <FaCreditCard /> }].map((item, index) => <article key={item.label} className={styles.metricCard} style={{ animationDelay: `${index * 80}ms` }}><div className={styles.metricTop}><span>{item.label}</span><i>{item.icon}</i></div><strong>{item.value}</strong><small>{item.helper}</small></article>)}
                </section>

                {activeSection === 'dashboard' && <section className={styles.dashboardGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Performance</p><h3>Tăng trưởng hệ thống</h3></div><span className={styles.livePill}>live</span></div><TinyLineChart values={analytics.monthlySeries} /></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Realtime feed</p><h3>Biến động dữ liệu</h3></div></div><div className={styles.feedList}>{analytics.recentActivity.map((item) => <div key={item.id} className={styles.feedItem}><div><strong>{item.title || item.name || item.orderCode || item.customerEmail}</strong><span>{formatDateTime(item.updatedAt || item.createdAt)}</span></div><b>{item.paymentStatus || item.category || item.role || 'updated'}</b></div>)}</div></article></section>}

                {activeSection === 'payments' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Payments</p><h3>Quản lý giao dịch</h3></div></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>PTTT</th><th>Trạng thái</th><th>Tổng</th><th>Xem</th></tr></thead><tbody>{filteredOrders.map((item) => <tr key={item.id}><td>{item.orderCode}</td><td><strong>{item.customerName}</strong><span>{item.customerEmail}</span></td><td>{item.paymentMethod}</td><td><span className={`${styles.statusPill} ${styles[item.paymentStatus.toLowerCase()]}`}>{item.paymentStatus}</span></td><td>{money(item.total)}</td><td><button type="button" className={styles.iconBtn} onClick={() => setSelectedOrderId(item.id)}><FaEye /></button></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}>{selectedOrder ? <><div className={styles.sectionHeader}><div><p className={styles.kicker}>Detail</p><h3>{selectedOrder.orderCode}</h3></div></div><div className={styles.detailCard}><div className={styles.detailBlock}><strong>{selectedOrder.customerName}</strong><span>{selectedOrder.customerPhone}</span><span>{selectedOrder.shippingAddress}</span></div><div className={styles.statusGrid}><label>Payment<select value={selectedOrder.paymentStatus} onChange={(e) => onUpdateOrder(selectedOrder.id, { paymentStatus: e.target.value })}>{paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><label>Order<select value={selectedOrder.orderStatus} onChange={(e) => onUpdateOrder(selectedOrder.id, { orderStatus: e.target.value })}>{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div><div className={styles.summaryList}><div><span>Tạm tính</span><strong>{money(selectedOrder.subtotal)}</strong></div><div><span>Ship</span><strong>{money(selectedOrder.shippingFee)}</strong></div><div><span>Phí thanh toán</span><strong>{money(selectedOrder.paymentFee)}</strong></div><div><span>Tổng cộng</span><strong>{money(selectedOrder.total)}</strong></div></div><div className={styles.orderItems}>{selectedOrder.items?.map((item, index) => <div key={`${item.id}-${index}`} className={styles.orderItem}><div><strong>{item.title}</strong><span>{item.quantity} x {money(item.price)}</span></div><b>{money(item.quantity * item.price)}</b></div>)}</div></div></> : <div className={styles.emptyBox}>Chưa có đơn hàng nào.</div>}</article></section>}

                {activeSection === 'users' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>User CRUD</p><h3>{editingUserId ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetUser}><FaPlus />Mới</button></div><form className={styles.formGrid} onSubmit={onUserSubmit}><input value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên hiển thị" /><input value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" /><input type="password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={editingUserId ? 'Mật khẩu mới' : 'Mật khẩu'} /><select value={userForm.role} onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}><option value="CUSTOMER">Customer</option><option value="ADMIN">Admin</option></select><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingUserId ? 'Cập nhật user' : 'Tạo user'}</button></form></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Directory</p><h3>Bảng tài khoản</h3></div></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Tên</th><th>Email</th><th>Role</th><th>Cập nhật</th><th>Thao tác</th></tr></thead><tbody>{filteredUsers.map((item) => <tr key={item.id}><td>{item.name || item.email}</td><td>{item.email}</td><td><span className={`${styles.statusPill} ${item.role === 'ADMIN' ? styles.admin : styles.neutral}`}>{item.role}</span></td><td>{formatDateTime(item.updatedAt || item.createdAt)}</td><td>{actions(() => { setEditingUserId(item.id); setUserForm({ name: item.name || '', email: item.email || '', password: '', role: item.role || 'CUSTOMER' }); }, () => onDelete('users', item.id))}</td></tr>)}</tbody></table></div></article></section>}

                {activeSection === 'products' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Product studio</p><h3>{editingProductId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetProduct}><FaPlus />Mới</button></div><form className={styles.formGrid} onSubmit={onProductSubmit}><input value={productForm.title} onChange={(e) => setProductForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tên sản phẩm" /><input value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Danh mục" /><input type="number" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Giá" /><input type="number" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} placeholder="Tồn kho" /><input value={productForm.badge} onChange={(e) => setProductForm((prev) => ({ ...prev, badge: e.target.value }))} placeholder="Badge" /><input type="number" step="0.1" value={productForm.rating} onChange={(e) => setProductForm((prev) => ({ ...prev, rating: e.target.value }))} placeholder="Rating" /><input className={styles.span2} value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Ảnh, ngăn cách dấu phẩy" /><input className={styles.span2} value={productForm.size} onChange={(e) => setProductForm((prev) => ({ ...prev, size: e.target.value }))} placeholder="Size, ngăn cách dấu phẩy" /><textarea className={styles.span2} rows="5" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả sản phẩm" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingProductId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</button></form></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Catalog</p><h3>Bảng sản phẩm</h3></div></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Kho</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id}><td><div className={styles.tableMedia}><img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.title} /><div><strong>{item.title}</strong><span>{item.badge || 'No badge'}</span></div></div></td><td>{item.category}</td><td>{item.stock}</td><td>{money(item.price)}</td><td>{actions(() => { setEditingProductId(item.id); setProductForm({ title: item.title || '', description: item.description || '', price: String(item.price ?? ''), category: item.category || '', stock: String(item.stock ?? ''), rating: String(item.rating ?? ''), badge: item.badge || '', image: Array.isArray(item.image) ? item.image.join(', ') : '', size: Array.isArray(item.size) ? item.size.join(', ') : '' }); }, () => onDelete('products', item.id))}</td></tr>)}</tbody></table></div></article></section>}

                {activeSection === 'news' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Editorial</p><h3>{editingNewsId ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetNews}><FaPlus />Mới</button></div><form className={styles.formGrid} onSubmit={onNewsSubmit}><input className={styles.span2} value={newsForm.title} onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tiêu đề" /><input value={newsForm.author} onChange={(e) => setNewsForm((prev) => ({ ...prev, author: e.target.value }))} placeholder="Tác giả" /><input value={newsForm.category} onChange={(e) => setNewsForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Danh mục" /><input value={newsForm.tags} onChange={(e) => setNewsForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="Tags" /><input type="number" value={newsForm.readTime} onChange={(e) => setNewsForm((prev) => ({ ...prev, readTime: e.target.value }))} placeholder="Read time" /><input className={styles.span2} value={newsForm.image} onChange={(e) => setNewsForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Ảnh cover" /><textarea className={styles.span2} rows="3" value={newsForm.summary} onChange={(e) => setNewsForm((prev) => ({ ...prev, summary: e.target.value }))} placeholder="Tóm tắt" /><textarea className={styles.span2} rows="8" value={newsForm.content} onChange={(e) => setNewsForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="Nội dung" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Đang lưu...' : editingNewsId ? 'Cập nhật bài viết' : 'Tạo bài viết'}</button></form></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Publishing</p><h3>Bảng bài viết</h3></div></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Bài viết</th><th>Tác giả</th><th>Danh mục</th><th>Read time</th><th>Thao tác</th></tr></thead><tbody>{filteredNews.map((item) => <tr key={item.id}><td><div className={styles.tableMedia}><img src={item.image} alt={item.title} /><div><strong>{item.title}</strong><span>{item.summary}</span></div></div></td><td>{item.author || 'Admin'}</td><td>{item.category || 'General'}</td><td>{item.readTime ? `${item.readTime} phút` : 'Chưa có'}</td><td>{actions(() => { setEditingNewsId(item.id); setNewsForm({ title: item.title || '', summary: item.summary || '', content: item.content || '', image: item.image || '', author: item.author || '', category: item.category || '', tags: Array.isArray(item.tags) ? item.tags.join(', ') : '', readTime: item.readTime ? String(item.readTime) : '' }); }, () => onDelete('news', item.id))}</td></tr>)}</tbody></table></div></article></section>}
            </main>
        </div>
    );
}

export default AdminPage;
