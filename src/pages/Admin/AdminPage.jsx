import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaArrowsRotate, FaBan, FaBoxOpen, FaChartLine, FaCheck, FaClockRotateLeft, FaCreditCard, FaEye, FaNewspaper, FaPen, FaPlus, FaTrashCan, FaUsers } from 'react-icons/fa6';
import adminService from '@api/adminService';
import { getInfoUser, updateMyProfile } from '@api/authServices';
import { ToastContext } from '@contexts/ToastContext';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import styles from './AdminPage.module.scss';

const SECTIONS = [
    { id: 'analytics', label: 'Analytics', path: '/admin', icon: <FaChartLine /> },
    { id: 'history', label: 'History', path: '/admin/history', icon: <FaClockRotateLeft /> },
    { id: 'payments', label: 'Payments', path: '/admin/payments', icon: <FaCreditCard /> },
    { id: 'products', label: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { id: 'news', label: 'News', path: '/admin/news', icon: <FaNewspaper /> },
    { id: 'users', label: 'Users', path: '/admin/users', icon: <FaUsers /> }
];
const POLL_INTERVAL_MS = 15000;
const makeUser = () => ({ name: '', email: '', password: '', role: 'CUSTOMER', status: 'ACTIVE' });
const makeProduct = () => ({ title: '', category: '', price: '', stock: '', image: '', status: 'ACTIVE' });
const makeNews = () => ({ title: '', author: '', category: '', image: '', summary: '' });
const makeProfile = (u) => ({ name: u?.name || '', email: u?.email || '', password: '' });
const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const statusClass = (s, v) => (v === 'ACTIVE' || v === 'PAID' ? s.paid : v === 'DISABLED' || v === 'FAILED' ? s.failed : s.neutral);
const safeArrayResponse = async (request) => (await request())?.data || [];
const chartAxisStyle = { tickLabelStyle: { fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' } };

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
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedNewsId, setSelectedNewsId] = useState('');

    const activeSection = useMemo(() => {
        if (location.pathname.startsWith('/admin/history')) return 'history';
        if (location.pathname.startsWith('/admin/payments')) return 'payments';
        if (location.pathname.startsWith('/admin/products')) return 'products';
        if (location.pathname.startsWith('/admin/news')) return 'news';
        if (location.pathname.startsWith('/admin/users')) return 'users';
        return 'analytics';
    }, [location.pathname]);

    const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
        if (userInfo?.role !== 'ADMIN') return setPageLoading(false);
        silent ? setRefreshing(true) : setPageLoading(true);
        try {
            const [u, p, n, o, aRes] = await Promise.all([
                safeArrayResponse(() => adminService.getUsers()),
                safeArrayResponse(() => adminService.getProducts()),
                safeArrayResponse(() => adminService.getNews()),
                safeArrayResponse(() => adminService.getOrders()),
                adminService.getActivities({ page: 1, limit: 100 })
            ]);
            const a = Array.isArray(aRes?.data) ? aRes.data : [];
            setUsers(Array.isArray(u) ? u : []);
            setProducts(Array.isArray(p) ? p : []);
            setNews(Array.isArray(n) ? n : []);
            setOrders(Array.isArray(o) ? o : []);
            setActivities(a);
            setSelectedUserId((prev) => prev || u?.[0]?.id || '');
            setSelectedProductId((prev) => prev || p?.[0]?.id || '');
            setSelectedNewsId((prev) => prev || n?.[0]?.id || '');
        } catch {
            toast?.error?.('Không thể tải dữ liệu.');
        } finally {
            setPageLoading(false);
            setRefreshing(false);
        }
    }, [toast, userInfo]);

    useEffect(() => setProfileForm(makeProfile(userInfo)), [userInfo]);
    useEffect(() => { fetchAdminData(); }, [fetchAdminData]);
    useEffect(() => { if (userInfo?.role !== 'ADMIN') return undefined; const t = setInterval(() => fetchAdminData({ silent: true }), POLL_INTERVAL_MS); return () => clearInterval(t); }, [fetchAdminData, userInfo]);

    const filteredUsers = users.filter((i) => `${i.name} ${i.email} ${i.role} ${i.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredProducts = products.filter((i) => `${i.title} ${i.category} ${i.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredNews = news.filter((i) => `${i.title} ${i.author || ''} ${i.category || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedUser = users.find((x) => x.id === selectedUserId) || users[0];
    const selectedProduct = products.find((x) => x.id === selectedProductId) || products[0];
    const selectedNews = news.find((x) => x.id === selectedNewsId) || news[0];

    const analyticsCards = [
        { label: 'Users', value: users.length, helper: `${users.filter((u) => u.status === 'DISABLED').length} disabled` },
        { label: 'Products', value: products.length, helper: `${products.filter((p) => p.status === 'DISABLED').length} disabled` },
        { label: 'Orders', value: orders.length, helper: `${orders.filter((o) => o.paymentStatus === 'PENDING').length} pending` },
        { label: 'Revenue', value: money(orders.filter((o) => o.paymentStatus === 'PAID').reduce((s, i) => s + Number(i.total || 0), 0)), helper: 'paid orders only' }
    ];
    const paymentModes = ['COD', 'CARD', 'WALLET', 'BANK'];
    const paymentBreakdown = paymentModes.map((mode) => orders.filter((item) => item.paymentMethod === mode).length);
    const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
    const orderStatusBreakdown = orderStatuses.map((st) => orders.filter((item) => item.orderStatus === st).length);
    const activityTypes = ['LOGIN', 'VIEW_PRODUCT', 'VIEW_PRODUCT_LIST', 'PAYMENT'];
    const activityBreakdown = activityTypes.map((ac) => activities.filter((item) => item.action === ac).length);

    const gate = !userInfo ? { title: 'Admin CMS cần đăng nhập', action: () => { setType('login'); setIsOpen(true); }, label: 'Mở đăng nhập' } : userInfo.role !== 'ADMIN' ? { title: 'Bạn không có quyền quản trị', href: '/' } : null;
    if (isLoading || pageLoading) return <div className={styles.gate}>Đang tải Admin CMS...</div>;
    if (gate) return <div className={styles.gate}><h2>{gate.title}</h2>{gate.href ? <Link to={gate.href} className={styles.primaryBtn}>Quay về trang chủ</Link> : <button className={styles.primaryBtn} onClick={gate.action}>{gate.label}</button>}</div>;

    const resetUser = () => { setEditingUserId(''); setUserForm(makeUser()); };
    const resetProduct = () => { setEditingProductId(''); setProductForm(makeProduct()); };
    const resetNews = () => { setEditingNewsId(''); setNewsForm(makeNews()); };
    const onDelete = async (type, id) => { if (!window.confirm('Bạn có chắc muốn xoá bản ghi này?')) return; try { if (type === 'users') await adminService.deleteUser(id); if (type === 'products') await adminService.deleteProduct(id); if (type === 'news') await adminService.deleteNews(id); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể xoá dữ liệu.'); } };
    const saveUser = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingUserId) await adminService.updateUser(editingUserId, { ...userForm, ...(userForm.password ? {} : { password: undefined }) }); else await adminService.createUser(userForm); resetUser(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể lưu user.'); } finally { setSubmitting(false); } };
    const saveProduct = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingProductId) await adminService.updateProduct(editingProductId, productForm); else await adminService.createProduct(productForm); resetProduct(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể lưu product.'); } finally { setSubmitting(false); } };
    const saveNews = async (e) => { e.preventDefault(); setSubmitting(true); try { if (editingNewsId) await adminService.updateNews(editingNewsId, newsForm); else await adminService.createNews(newsForm); resetNews(); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể lưu news.'); } finally { setSubmitting(false); } };
    const saveProfile = async (e) => { e.preventDefault(); if (!userId) return; try { await updateMyProfile({ ...profileForm, ...(profileForm.password ? {} : { password: undefined }) }); const latest = await getInfoUser(userId); if (latest?.data) setUserInfo(latest.data); toast?.success?.('Cập nhật profile thành công.'); } catch { toast?.error?.('Không thể cập nhật profile.'); } };
    const toggleUserStatus = async (item) => { try { await adminService.updateUser(item.id, { status: item.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED' }); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể cập nhật trạng thái user.'); } };
    const toggleProductStatus = async (item) => { try { await adminService.updateProduct(item.id, { status: item.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED' }); fetchAdminData({ silent: true }); } catch { toast?.error?.('Không thể cập nhật trạng thái product.'); } };

    return (
        <div className={styles.adminShell}>
            <aside className={styles.sidebar}><div className={styles.brand}><span>XP</span><div><strong>XPAD Admin</strong><small>commerce control center</small></div></div><nav className={styles.nav}>{SECTIONS.map((item) => <NavLink key={item.id} to={item.path} end={item.id === 'analytics'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>{item.icon}{item.label}</NavLink>)}</nav></aside>
            <main className={styles.main}>
                <header className={styles.topbar}><div><p className={styles.kicker}>Realtime CMS</p><h1>{SECTIONS.find((item) => item.id === activeSection)?.label || 'Analytics'}</h1></div><div className={styles.topbarActions}><div className={styles.searchBox}><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm trong khu quản trị..." /></div><button type="button" className={styles.secondaryBtn} onClick={() => fetchAdminData({ silent: true })}><FaArrowsRotate />{refreshing ? 'Đang sync' : 'Làm mới'}</button></div></header>

                {activeSection === 'analytics' && <>
                    <section className={styles.metricsRow}>{analyticsCards.map((item) => <article key={item.label} className={styles.metricCard}><div className={styles.metricTop}><span>{item.label}</span></div><strong>{item.value}</strong><small>{item.helper}</small></article>)}</section>
                    <section className={styles.dashboardGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Payments</p><h3>Cơ cấu phương thức thanh toán</h3></div></div><div className={styles.materialChart}><BarChart xAxis={[{ scaleType: 'band', data: paymentModes, ...chartAxisStyle }]} yAxis={[chartAxisStyle]} series={[{ data: paymentBreakdown, color: '#ff7b21', label: 'Số đơn' }]} height={260} grid={{ horizontal: true }} /></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Orders</p><h3>Trạng thái đơn hàng</h3></div></div><div className={styles.materialChart}><PieChart height={260} series={[{ innerRadius: 44, outerRadius: 95, paddingAngle: 2, cornerRadius: 6, data: orderStatuses.map((label, index) => ({ id: label, value: orderStatusBreakdown[index], label })) }]} /></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Activities</p><h3>Hành vi hệ thống gần đây</h3></div></div><div className={styles.materialChart}><BarChart xAxis={[{ scaleType: 'band', data: activityTypes, ...chartAxisStyle }]} yAxis={[chartAxisStyle]} series={[{ data: activityBreakdown, color: '#2563eb', label: 'Lượt' }]} height={260} grid={{ horizontal: true }} /></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Profile</p><h3>Cập nhật thông tin cá nhân</h3></div></div><form className={styles.formGrid} onSubmit={saveProfile}><input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Tên" /><input value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" /><input type="password" value={profileForm.password} onChange={(e) => setProfileForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mật khẩu mới (optional)" /><button type="submit" className={styles.primaryBtn}>Lưu profile</button></form></article></section>
                </>}

                {activeSection === 'users' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>User table</p><h3>Bảng thống kê & CRUD</h3></div><span className={styles.livePill}>{filteredUsers.length} users</span></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredUsers.map((item) => <tr key={item.id} onClick={() => setSelectedUserId(item.id)}><td>{item.name || item.email}</td><td>{item.email}</td><td>{item.role}</td><td><span className={`${styles.statusPill} ${statusClass(styles, item.status || 'ACTIVE')}`}>{item.status || 'ACTIVE'}</span></td><td><div className={styles.rowActions}><button type="button" onClick={(e) => { e.stopPropagation(); setEditingUserId(item.id); setUserForm({ name: item.name || '', email: item.email || '', password: '', role: item.role || 'CUSTOMER', status: item.status || 'ACTIVE' }); }}><FaPen /></button><button type="button" onClick={(e) => { e.stopPropagation(); toggleUserStatus(item); }}>{item.status === 'DISABLED' ? <FaCheck /> : <FaBan />}</button><button type="button" onClick={(e) => { e.stopPropagation(); onDelete('users', item.id); }}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>User view</p><h3>{editingUserId ? 'Cập nhật user' : 'Thêm user'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetUser}><FaPlus /> New</button></div>{selectedUser && <div className={styles.detailBlock}><strong>{selectedUser.name || selectedUser.email}</strong><span>{selectedUser.email}</span><span>Role: {selectedUser.role}</span><span>Status: {selectedUser.status || 'ACTIVE'}</span></div>}<form className={styles.formGrid} onSubmit={saveUser}><input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" /><input value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" /><input type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" /><select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}><option value="CUSTOMER">CUSTOMER</option><option value="ADMIN">ADMIN</option></select><select value={userForm.status} onChange={(e) => setUserForm((p) => ({ ...p, status: e.target.value }))}><option value="ACTIVE">ACTIVE</option><option value="DISABLED">DISABLED</option></select><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save user'}</button></form></article></section>}

                {activeSection === 'products' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Product table</p><h3>Bảng thống kê & CRUD</h3></div><span className={styles.livePill}>{filteredProducts.length} products</span></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id} onClick={() => setSelectedProductId(item.id)}><td><strong>{item.title}</strong></td><td>{item.category}</td><td>{item.stock}</td><td>{money(item.price)}</td><td><span className={`${styles.statusPill} ${statusClass(styles, item.status || 'ACTIVE')}`}>{item.status || 'ACTIVE'}</span></td><td><div className={styles.rowActions}><button type="button" onClick={(e) => { e.stopPropagation(); setEditingProductId(item.id); setProductForm({ title: item.title || '', category: item.category || '', price: String(item.price ?? ''), stock: String(item.stock ?? ''), image: Array.isArray(item.image) ? item.image.join(', ') : '', status: item.status || 'ACTIVE' }); }}><FaPen /></button><button type="button" onClick={(e) => { e.stopPropagation(); toggleProductStatus(item); }}>{item.status === 'DISABLED' ? <FaCheck /> : <FaBan />}</button><button type="button" onClick={(e) => { e.stopPropagation(); onDelete('products', item.id); }}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Product view</p><h3>{editingProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetProduct}><FaPlus /> New</button></div>{selectedProduct && <div className={styles.detailBlock}><strong>{selectedProduct.title}</strong><span>Danh mục: {selectedProduct.category}</span><span>Giá: {money(selectedProduct.price)}</span><span>Tồn kho: {selectedProduct.stock}</span></div>}<form className={styles.formGrid} onSubmit={saveProduct}><input value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" /><input value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" /><input type="number" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" /><input type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" /><select value={productForm.status} onChange={(e) => setProductForm((p) => ({ ...p, status: e.target.value }))}><option value="ACTIVE">ACTIVE</option><option value="DISABLED">DISABLED</option></select><input className={styles.span2} value={productForm.image} onChange={(e) => setProductForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL (comma separated)" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save product'}</button></form></article></section>}

                {activeSection === 'news' && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>News table</p><h3>Bảng thống kê & CRUD</h3></div><span className={styles.livePill}>{filteredNews.length} news</span></div><div className={styles.tableWrap}><table className={styles.dataTable}><thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Actions</th></tr></thead><tbody>{filteredNews.map((item) => <tr key={item.id} onClick={() => setSelectedNewsId(item.id)}><td><strong>{item.title}</strong></td><td>{item.author || 'Admin'}</td><td>{item.category || '-'}</td><td><div className={styles.rowActions}><button type="button" onClick={(e) => { e.stopPropagation(); setEditingNewsId(item.id); setNewsForm({ title: item.title || '', author: item.author || '', category: item.category || '', image: item.image || '', summary: item.summary || '' }); }}><FaPen /></button><button type="button" onClick={(e) => { e.stopPropagation(); onDelete('news', item.id); }}><FaTrashCan /></button></div></td></tr>)}</tbody></table></div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>News view</p><h3>{editingNewsId ? 'Cập nhật bài viết' : 'Thêm bài viết'}</h3></div><button type="button" className={styles.secondaryBtn} onClick={resetNews}><FaPlus /> New</button></div>{selectedNews && <div className={styles.detailBlock}><strong>{selectedNews.title}</strong><span>Tác giả: {selectedNews.author || 'Admin'}</span><span>Danh mục: {selectedNews.category || '-'}</span><span>Tóm tắt: {selectedNews.summary || 'N/A'}</span></div>}<form className={styles.formGrid} onSubmit={saveNews}><input className={styles.span2} value={newsForm.title} onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" /><input value={newsForm.author} onChange={(e) => setNewsForm((p) => ({ ...p, author: e.target.value }))} placeholder="Author" /><input value={newsForm.category} onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" /><input className={styles.span2} value={newsForm.image} onChange={(e) => setNewsForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" /><textarea className={styles.span2} rows="3" value={newsForm.summary} onChange={(e) => setNewsForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Summary" /><button type="submit" className={styles.primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save news'}</button></form></article></section>}

                {(activeSection === 'history' || activeSection === 'payments') && <section className={styles.pageGrid}><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>{activeSection === 'history' ? 'History' : 'Payments'}</p><h3>{activeSection === 'history' ? 'Lịch sử hoạt động' : 'Đơn hàng thanh toán'}</h3></div></div><div className={styles.emptyBox}>Giữ nguyên luồng cũ, dùng bộ lọc ở trên để theo dõi chi tiết.</div></article><article className={styles.panelCard}><div className={styles.sectionHeader}><div><p className={styles.kicker}>Preview</p><h3>Dữ liệu nhanh</h3></div></div><div className={styles.detailBlock}><span>Activities: {activities.length}</span><span>Orders: {orders.length}</span><span>Pending orders: {orders.filter((o) => o.paymentStatus === 'PENDING').length}</span><span>Recent sync: {new Date().toLocaleTimeString('vi-VN')}</span></div></article></section>}
            </main>
        </div>
    );
}

export default AdminPage;
