# xPadGame - Ecommerce ReactJS + NodeJS

Du an thuong mai dien tu ban tay cam game va phu kien gaming.  
Kien truc fullstack gom `frontend ReactJS (Vite)` va `backend NodeJS/Express + Prisma + MongoDB`.

## 1) Tinh nang chinh
- Dang ky, dang nhap, dang xuat, refresh token.
- Xem danh sach san pham, loc/sort, infinite scroll.
- Xem chi tiet san pham.
- Gio hang, checkout, theo doi don hang.
- Trang tin tuc.
- Admin CMS: analytics, history log, user/product/news/payment management.
- Profile settings cho user.

## 2) Cong nghe
- Frontend: ReactJS, React Router, Context API, Axios, SCSS Modules, Bootstrap.
- Backend: NodeJS, Express, Prisma ORM.
- Database: MongoDB.
- Auth/Security: JWT, bcrypt, cookie-based refresh token.

## 3) Cau truc thu muc
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

## 4) Quy uoc tach UI va Logic
Du an dang chuan hoa theo pattern:
- UI component chi render giao dien.
- Logic fetch/state/action dua vao hook rieng cung cap du lieu cho UI.

Vi du:
- `src/pages/Profile/ProfilePage.jsx` (UI)
- `src/pages/Profile/useProfilePage.js` (logic)
- `src/pages/ProductDetail/ProductDetailPage.jsx` (UI)
- `src/pages/ProductDetail/useProductDetailPage.js` (logic)

## 5) Cai dat va chay du an

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

## 6) Bien moi truong can co

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

## 7) Script huu ich
- `npm run dev`: chay frontend dev.
- `npm run build`: build frontend production.
- `npm run preview`: preview build frontend.

## 8) API tieu bieu
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/news`
- `POST /api/login`
- `POST /api/register`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/orders` (admin)

## 9) Huong phat trien tiep
- Tiep tuc tach logic ra hook/service cho toan bo man hinh con lai.
- Them test (unit + integration) cho service/hook quan trong.
- Toi uu hieu nang assets va pagination.

## 10) Tac gia
- Pham Cong Vinh
- Repo: `https://github.com/Vinhdev04/Ecomerce-reactjs`
