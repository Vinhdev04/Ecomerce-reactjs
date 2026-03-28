import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaArrowsRotate, FaBan, FaBoxOpen, FaChartLine, FaCheck, FaClockRotateLeft, FaCreditCard, FaEye, FaNewspaper, FaPen, FaPlus, FaTrashCan, FaUsers } from 'react-icons/fa6';
import adminService from '@api/adminService';
import { getInfoUser, updateMyProfile } from '@api/authServices';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import styles from './AdminPage.module.scss';

const POLL_INTERVAL_MS = 15000;
const sections = [
    { id: 'analytics', label: 'Analytics', path: '/admin', icon: <FaChartLine /> },
    { id: 'history', label: 'History', path: '/admin/history', icon: <FaClockRotateLeft /> },
    { id: 'payments', label: 'Payments', path: '/admin/payments', icon: <FaCreditCard /> },
    { id: 'products', label: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { id: 'news', label: 'News', path: '/admin/news', icon: <FaNewspaper /> },
    { id: 'users', label: 'Users', path: '/admin/users', icon: <FaUsers /> }
];

const makeUser = () => ({ name: '', email: '', password: '', role: 'CUSTOMER', status: 'ACTIVE' });
const makeProduct = () => ({ title: '', category: '', price: '', stock: '', image: '', status: 'ACTIVE' });
const makeNews = () => ({ title: '', author: '', category: '', image: '', summary: '' });
const makeProfile = (u) => ({ name: u?.name || '', email: u?.email || '', password: '' });

const safeArrayResponse = async (request) => {
    const response = await request();
    return Array.isArray(response?.data) ? response.data : [];
};
const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}d`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : 'N/A');
const statusClass = (stylesRef, value) => (value === 'ACTIVE' || value === 'PAID' ? stylesRef.paid : value === 'DISABLED' || value === 'FAILED' ? stylesRef.failed : stylesRef.neutral);

const TinyBarChart = ({ values }) => {
    const max = Math.max(...values, 1);
    return <div className={styles.barChart}>{values.map((value, index) => <span key={`${index}-${value}`} style={{ height: `${Math.max((value / max) * 100, 14)}%` }} />)}</div>;
};

function AdminPage() {
    const location = useLocation();
    const { toast } = useContext(ToastContext);
    const { userInfo, userId, setUserInfo, isLoading } = useContext(UserInfoContext);
    const { setIsOpen, setType } = useContext(SideBarContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [editingUserId, setEditingUserId] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const [editingNewsId, setEditingNewsId] = useState('');
    const [userForm, setUserForm] = useState(makeUser());
    const [productForm, setProductForm] = useState(makeProduct());
    const [newsForm, setNewsForm] = useState(makeNews());
    const [profileForm, setProfileForm] = useState(makeProfile(userInfo));

    const activeSection = useMemo(() => {
        if (location.pathname.startsWith('/admin/history')) return 'history';
        if (location.pathname.startsWith('/admin/payments')) return 'payments';
        if (location.pathname.startsWith('/admin/products')) return 'products';
        if (location.pathname.startsWith('/admin/news')) return 'news';
        if (location.pathname.startsWith('/admin/users')) return 'users';
        return 'analytics';
    }, [location.pathname]);

    useEffect(() => setProfileForm(makeProfile(userInfo)), [userInfo]);

    const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
        if (userInfo?.role !== 'ADMIN') {
            setPageLoading(false);
            return;
        }
        silent ? setRefreshing(true) : setPageLoading(true);
        try {
            const [usersData, productsData, newsData, ordersData, activityResponse] = await Promise.all([
                safeArrayResponse(() => adminService.getUsers()),
                safeArrayResponse(() => adminService.getProducts()),
                safeArrayResponse(() => adminService.getNews()),
                safeArrayResponse(() => adminService.getOrders()),
                adminService.getActivities({ page: 1, limit: 120 })
            ]);
            const activityData = Array.isArray(activityResponse?.data) ? activityResponse.data : [];
            setUsers(usersData);
            setProducts(productsData);
            setNews(newsData);
            setOrders(ordersData);
            setActivities(activityData);
            setSelectedOrderId((prev) => prev || ordersData[0]?.id || '');
            setSelectedActivityId((prev) => prev || activityData[0]?.id || '');
        } catch (error) {
            toast?.error?.(error?.response?.data?.message || 'Khong the tai du lieu.');
        } finally {
            setPageLoading(false);
            setRefreshing(false);
        }
    }, [toast, userInfo]);

    useEffect(() => { fetchAdminData(); }, [fetchAdminData]);
    useEffect(() => { if (userInfo?.role !== 'ADMIN') return undefined; const timer = setInterval(() => fetchAdminData({ silent: true }), POLL_INTERVAL_MS); return () => clearInterval(timer); }, [fetchAdminData, userInfo]);

    const paymentBreakdown = useMemo(() => ['COD', 'CARD', 'WALLET', 'BANK'].map((mode) => orders.filter((item) => item.paymentMethod === mode).length), [orders]);
    const analyticsCards = useMemo(() => ([
        { label: 'Users', value: users.length, helper: `${users.filter((u) => u.status === 'DISABLED').length} disabled` },
        { label: 'Products', value: products.length, helper: `${products.filter((p) => p.status === 'DISABLED').length} disabled` },
        { label: 'Orders', value: orders.length, helper: `${orders.filter((o) => o.paymentStatus === 'PENDING').length} pending` },
        { label: 'Revenue', value: money(orders.filter((o) => o.paymentStatus === 'PAID').reduce((s, i) => s + Number(i.total || 0), 0)), helper: 'paid orders only' }
    ]), [orders, products, users]);

    const selectedOrder = orders.find((item) => item.id === selectedOrderId) || orders[0];
    const selectedActivity = activities.find((item) => item.id === selectedActivityId) || activities[0];
    const filteredUsers = users.filter((i) => `${i.name} ${i.email} ${i.role} ${i.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredProducts = products.filter((i) => `${i.title} ${i.category} ${i.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredNews = news.filter((i) => `${i.title} ${i.author || ''} ${i.category || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredOrders = orders.filter((i) => `${i.orderCode} ${i.customerName} ${i.paymentStatus} ${i.paymentMethod}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredActivities = activities.filter((i) => `${i.action} ${i.entityType} ${i.userEmail || ''} ${i.ipAddress || ''} ${i.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));

    const gate = !userInfo ? { title: 'Admin CMS can dang nhap', action: () => { setType('login'); setIsOpen(true); }, label: 'Mo dang nhap' } : userInfo.role !== 'ADMIN' ? { title: 'Ban khong co quyen quan tri', href: '/' } : null;
    if (isLoading || pageLoading) return <div className={styles.gate}>Dang tai Admin CMS...</div>;
    if (gate) return <div className={styles.gate}><h2>{gate.title}</h2>{gate.href ? <Link to={gate.href} className={styles.primaryBtn}>Quay ve trang chu</Link> : <button className={styles.primaryBtn} onClick={gate.action}>{gate.label}</button>}</div>;

    const resetUser = () => { setEditingUserId(''); setUserForm(makeUser()); };
    const resetProduct = () => { setEditingProductId(''); setProductForm(makeProduct()); };
    const resetNews = () => { setEditingNewsId(''); setNewsForm(makeNews()); };
    const onDelete = async (type, id) => { if (!window.confirm('Ban co chac muon xoa ban ghi nay?')) return; try { if (type === 'users') await adminService.deleteUser(id); if (type === 'products') await adminService.deleteProduct(id); if (type === 'news') await adminService.deleteNews(id); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the xoa du lieu.'); } };
    const saveUser = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingUserId) await adminService.updateUser(editingUserId, { ...userForm, ...(userForm.password ? {} : { password: undefined }) }); else await adminService.createUser(userForm); resetUser(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the luu user.'); } finally { setSubmitting(false); } };
    const saveProduct = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingProductId) await adminService.updateProduct(editingProductId, productForm); else await adminService.createProduct(productForm); resetProduct(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the luu product.'); } finally { setSubmitting(false); } };
    const saveNews = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingNewsId) await adminService.updateNews(editingNewsId, newsForm); else await adminService.createNews(newsForm); resetNews(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the luu news.'); } finally { setSubmitting(false); } };
    const saveProfile = async (e) => { e.preventDefault(); if (!userId) return; try { await updateMyProfile({ ...profileForm, ...(profileForm.password ? {} : { password: undefined }) }); const latest = await getInfoUser(userId); if (latest?.data) setUserInfo(latest.data); setProfileForm((prev) => ({ ...prev, password: '' })); toast?.success?.('Cap nhat profile thanh cong.'); } catch { toast?.error?.('Khong the cap nhat profile.'); } };
    const onUpdateOrder = async (id, payload) => { try { await adminService.updateOrderStatus(id, payload); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the cap nhat order.'); } };
    const toggleUserStatus = async (item) => { try { await adminService.updateUser(item.id, { status: item.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED' }); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the cap nhat user status.'); } };
    const toggleProductStatus = async (item) => { try { await adminService.updateProduct(item.id, { status: item.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED' }); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the cap nhat product status.'); } };
    const toggleSessionStatus = async (item) => { try { await adminService.updateActivityStatus(item.id, item.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED'); fetchAdminData({ silent: true }); } catch { toast?.error?.('Khong the cap nhat session status.'); } };

    return (
        <div className={styles.adminShell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}><span>XP</span><div><strong>XPAD Admin</strong><small>commerce control center</small></div></div>
                <nav className={styles.nav}>{sections.map((item) => <NavLink key={item.id} to={item.path} end={item.id === 'analytics'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>{item.icon}{item.label}</NavLink>)}</nav>
            </aside>
            <main className={styles.main}>
                <header className={styles.topbar}><div><p className={styles.kicker}>Realtime CMS</p><h1>{sections.find((item) => item.id === activeSection)?.label || 'Analytics'}</h1></div><div className={styles.topbarActions}><div className={styles.searchBox}><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tim trong khu quan tri..." /></div><button type="button" className={styles.secondaryBtn} onClick={() => fetchAdminData({ silent: true })}><FaArrowsRotate />{refreshing ? 'Dang sync' : 'Lam moi'}</button></div></header>

                {activeSection === 'analytics' && <>
                    <section className={styles.metricsRow}>{analyticsCards.map((item) => <article key={item.label} className={styles.metricCard}><div className={styles.metricTop}><span>{item.label}</span></div><strong>{item.value}</strong><small>{item.helper}</small></article>)}</section>
                    <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Payment mix</p><h3>Co cau thanh toan</h3></div></div><TinyBarChart values={paymentBreakdown} /></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Profile settings</p><h3>Cap nhat thong tin ca nhan</h3></div></div><form className={styles.formGrid} onSubmit={saveProfile}><input value={profileForm.name} onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ten" /><input value={profileForm.email} onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" /><input type="password" value={profileForm.password} onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Mat khau moi (optional)" /><button type="submit" className={styles.primaryBtn}>Save profile</button></form></article></section>
                </>}

                {activeSection === 'history' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Activity history</p><h3>Lich su hoat dong</h3></div><span className={styles.livePill}>{filteredActivities.length} logs</span></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Action</th><th>User</th><th>IP/Device</th><th>Status</th><th>View</th></tr></thead><tbody>{filteredActivities.map((item) => <tr key={item.id}><td><strong>{item.action}</strong><span>{item.entityType}</span></td><td><strong>{item.userEmail || item.userId || 'Guest'}</strong><span>{formatDateTime(item.createdAt)}</span></td><td><strong>{item.ipAddress || 'N/A'}</strong><span>{item.deviceInfo || item.userAgent || 'Unknown'}</span></td><td><span className={`${styles.statusPill} ${statusClass(styles, item.status)}`}>{item.status}</span></td><td><button type="button" className={styles.iconBtn} onClick={() => setSelectedActivityId(item.id)}><FaEye /></button></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}>{selectedActivity ? <><div className={styles.sectionHeader}><div><p className={styles.kicker}>Detail</p><h3>{selectedActivity.action}</h3></div></div><div className={styles.detailCard}><div className={styles.detailBlock}><span>Session: {selectedActivity.sessionId || 'N/A'}</span><span>Device: {selectedActivity.deviceInfo || selectedActivity.userAgent || 'Unknown'}</span><span>Detail: {selectedActivity.detail ? JSON.stringify(selectedActivity.detail) : 'N/A'}</span></div><button type="button" className={styles.primaryBtn} onClick={() => toggleSessionStatus(selectedActivity)}>{selectedActivity.status === 'DISABLED' ? <><FaCheck /> Active session</> : <><FaBan /> Disable session</>}</button></div></> : <div className={styles.emptyBox}>Khong co activity.</div>}</article></section>}

                {activeSection === 'payments' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Payments</p><h3>Danh sach don hang</h3></div></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Order</th><th>Customer</th><th>Method</th><th>Status</th><th>Total</th><th>View</th></tr></thead><tbody>{filteredOrders.map((item) => <tr key={item.id}><td><strong>{item.orderCode}</strong><span>{formatDateTime(item.createdAt)}</span></td><td><strong>{item.customerName}</strong><span>{item.customerEmail}</span></td><td>{item.paymentMethod}</td><td><span className={`${styles.statusPill} ${styles[item.paymentStatus?.toLowerCase()] || styles.neutral}`}>{item.paymentStatus}</span></td><td>{money(item.total)}</td><td><button type="button" className={styles.iconBtn} onClick={() => setSelectedOrderId(item.id)}><FaEye /></button></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}>{selectedOrder ? <><div className={styles.sectionHeader}><div><p className={styles.kicker}>Order detail</p><h3>{selectedOrder.orderCode}</h3></div></div><div className={styles.detailCard}><div className={styles.detailBlock}><strong>{selectedOrder.customerName}</strong><span>{selectedOrder.customerEmail}</span><span>{selectedOrder.shippingAddress}</span><span>Payment: {selectedOrder.paymentMethod}</span></div><div className={styles.statusGrid}><label>Payment<select value={selectedOrder.paymentStatus} onChange={(event) => onUpdateOrder(selectedOrder.id, { paymentStatus: event.target.value })}>{['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => <option key={s} value={s}>{s}</option>)}</select></label><label>Order<select value={selectedOrder.orderStatus} onChange={(event) => onUpdateOrder(selectedOrder.id, { orderStatus: event.target.value })}>{['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}</select></label></div></div></> : <div className={styles.emptyBox}>Khong co order.</div>}</article></section>}

                {activeSection === 'users' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>User CRUD</p><h3>{editingUserId ? 'Update user' : 'Create user'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetUser}><FaPlus /> New</button></div><form className={styles.formGrid} onSubmit={saveUser}><input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" /><input value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" /><input type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" /><select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}><option value="CUSTOMER">CUSTOMER</option><option value="ADMIN">ADMIN</option></select><select value={userForm.status} onChange={(e) => setUserForm((p) => ({ ...p, status: e.target.value }))}><option value="ACTIVE">ACTIVE</option><option value="DISABLED">DISABLED</option></select><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save user'}</button></form><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredUsers.map((item) => <tr key={item.id}><td>{item.name || item.email}</td><td>{item.email}</td><td>{item.role}</td><td><span className={`${styles.statusPill} ${statusClass(styles, item.status || 'ACTIVE')}`}>{item.status || 'ACTIVE'}</span></td><td><div className={styles.rowActions}><button type="button" onClick={() => { setEditingUserId(item.id); setUserForm({ name: item.name || '', email: item.email || '', password: '', role: item.role || 'CUSTOMER', status: item.status || 'ACTIVE' }); }}><FaPen /></button><button type="button" onClick={() => toggleUserStatus(item)}>{item.status === 'DISABLED' ? <FaCheck /> : <FaBan />}</button><button type="button" onClick={() => onDelete('users', item.id)}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article></section>}

                {activeSection === 'products' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Product CRUD</p><h3>{editingProductId ? 'Update product' : 'Create product'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetProduct}><FaPlus /> New</button></div><form className={styles.formGrid} onSubmit={saveProduct}><input value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" /><input value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" /><input type="number" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" /><input type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" /><select value={productForm.status} onChange={(e) => setProductForm((p) => ({ ...p, status: e.target.value }))}><option value="ACTIVE">ACTIVE</option><option value="DISABLED">DISABLED</option></select><input className={styles.span2} value={productForm.image} onChange={(e) => setProductForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL (comma separated)" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save product'}</button></form><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.category}</td><td>{item.stock}</td><td>{money(item.price)}</td><td><span className={`${styles.statusPill} ${statusClass(styles, item.status || 'ACTIVE')}`}>{item.status || 'ACTIVE'}</span></td><td><div className={styles.rowActions}><button type="button" onClick={() => { setEditingProductId(item.id); setProductForm({ title: item.title || '', category: item.category || '', price: String(item.price ?? ''), stock: String(item.stock ?? ''), image: Array.isArray(item.image) ? item.image.join(', ') : '', status: item.status || 'ACTIVE' }); }}><FaPen /></button><button type="button" onClick={() => toggleProductStatus(item)}>{item.status === 'DISABLED' ? <FaCheck /> : <FaBan />}</button><button type="button" onClick={() => onDelete('products', item.id)}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article></section>}

                {activeSection === 'news' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>News CRUD</p><h3>{editingNewsId ? 'Update news' : 'Create news'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetNews}><FaPlus /> New</button></div><form className={styles.formGrid} onSubmit={saveNews}><input className={styles.span2} value={newsForm.title} onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" /><input value={newsForm.author} onChange={(e) => setNewsForm((p) => ({ ...p, author: e.target.value }))} placeholder="Author" /><input value={newsForm.category} onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" /><input className={styles.span2} value={newsForm.image} onChange={(e) => setNewsForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" /><textarea className={styles.span2} rows="3" value={newsForm.summary} onChange={(e) => setNewsForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Summary" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save news'}</button></form><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Actions</th></tr></thead><tbody>{filteredNews.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.author || 'Admin'}</td><td>{item.category || '-'}</td><td><div className={styles.rowActions}><button type="button" onClick={() => { setEditingNewsId(item.id); setNewsForm({ title: item.title || '', author: item.author || '', category: item.category || '', image: item.image || '', summary: item.summary || '' }); }}><FaPen /></button><button type="button" onClick={() => onDelete('news', item.id)}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article></section>}
            </main>
        </div>
    );
}

export default AdminPage;
