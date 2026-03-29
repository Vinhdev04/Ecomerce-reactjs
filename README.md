![Web Interface](src/assets/images/web.png)

# xPadGame – Website thương mại điện tử chuyên biệt tay cầm chơi game

**Position:** FullStack Developer (Personal)
**Preview:** https://xpadgame-store.netlify.app/

## 1) Công nghệ (Technologies)
- **Frontend:** ReactJS (Vite), Context API, SCSS Modules, Ant Design & Material UI.
- **Backend:** NodeJS (Express), MongoDB, Prisma ORM.
- **Authentication:** JWT (Access/Refresh Token), HttpOnly Cookies, Bcrypt, Axios Interceptors.
- **Validation:** Formik & Yup.

## 2) Mô tả dự án (Project Description)
- Hệ thống thương mại điện tử Fullstack xây dựng theo kiến trúc Frontend – Backend bóc tách, tối ưu cho việc mở rộng và bảo trì.
- Tập trung vào xử lý luồng dữ liệu phức tạp (Giỏ hàng, Thanh toán, Lịch sử hành động) và bảo mật phiên đăng nhập của người dùng.

## 3) Chức năng chính (Key Features)
- **Authentication Security:** Xác thực đa tầng qua JWT (Access/Refresh Token). Tự động gia hạn phiên đăng nhập với Axios Interceptors và HttpOnly Cookies.
- **State Management:** Quản lý tập trung giỏ hàng, thông tin người dùng và trạng thái thanh toán bằng Context API, đảm bảo đồng bộ dữ liệu mượt mà.
- **Smart Search & Filters:** Hệ thống tìm kiếm sản phẩm thông minh, hỗ trợ lọc đa tiêu chí theo giá, danh mục, nền tảng hỗ trợ (Sony, Microsoft, Nintendo) và tình trạng kho hàng.
- **System Architect:** Kiến trúc RESTful APIs hoàn chỉnh, tích hợp Activity Logs giúp quản trị viên theo dõi toàn bộ hành vi người dùng và lịch sử mua hàng.
- **Database Optimization:** Sử dụng Prisma ORM tối ưu hóa các truy vấn MongoDB, đảm bảo hiệu suất ngay cả khi dữ liệu phình to.
- **Admin Dashboard (CMS):** Giao diện quản trị toàn diện dành cho Manager: Quản lý sản phẩm, đơn hàng, người dùng, tin tức và theo dõi log hệ thống.

## 4) Cấu trúc thư mục (Project Structure)
```text
Ecomerce-reactjs/
  backend/
    controller/
    middleware/
    routes/
    prisma/
  src/
    api/
    components/
    contexts/
    hooks/
    pages/
    routes/
```

## 5) Quy ước tách UI và Logic (Frontend Architecture)
Du an dang chuan hoa theo pattern:
- UI component chi render giao dien.
- Logic fetch/state/action dua vao hook rieng cung cap du lieu cho UI.

Vi du:
- `src/pages/Profile/ProfilePage.jsx` (UI)
- `src/pages/Profile/useProfilePage.js` (logic)
- `src/pages/ProductDetail/ProductDetailPage.jsx` (UI)
- `src/pages/ProductDetail/useProductDetailPage.js` (logic)

## 6) Cài đặt và chạy dự án (Getting Started)

### 5.1 Frontend
```bash
npm install
npm run dev
```
Frontend mac dinh: `http://localhost:5173`

### 5.2 Backend
```bash
cd backend
npm install
npx prisma db push --skip-generate --schema prisma/schema.prisma
npm run dev
```
Backend mac dinh: `http://localhost:3000`

## 7) Biến môi trường (Environment Variables)

### backend/.env
```env
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

### frontend .env (optional)
```env
VITE_API_URL=http://localhost:3000
```

## 8) Script hữu ích
- `npm run dev`: chay frontend dev.
- `npm run build`: build frontend production.
- `npm run preview`: preview build frontend.

## 9) API tiêu biểu (Key APIs)
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/news`
- `POST /api/login`
- `POST /api/register`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/orders` (admin)

## 10) Hướng phát triển tiếp (Roadmap)
- Tiep tuc tach logic ra hook/service cho toan bo man hinh con lai.
- Them test (unit + integration) cho service/hook quan trong.
- Toi uu hieu nang assets va pagination.

## 11) Tác giả (Author)
- Pham Cong Vinh
- Repo: `https://github.com/Vinhdev04/Ecomerce-reactjs`
