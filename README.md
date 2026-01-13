# 🎮 xPadGame – Gaming Controller E‑Commerce Website

## 📌 Giới thiệu

**xPadGame** là một website thương mại điện tử chuyên cung cấp **tay cầm chơi game (game controllers)** và phụ kiện gaming. Dự án được xây dựng theo mô hình **Full‑stack JavaScript**, hướng tới trải nghiệm mua sắm hiện đại, trực quan và hiệu năng cao, sẵn sàng triển khai trên môi trường thực tế.

Website cho phép người dùng duyệt sản phẩm, đăng ký/đăng nhập tài khoản và tương tác với hệ thống thông qua các **RESTful APIs**.

---

## 🧩 Tính năng chính

### 👤 Người dùng (User)

* Đăng ký tài khoản
* Đăng nhập / Đăng xuất
* Mã hóa mật khẩu bằng **bcrypt**
* Kiểm tra dữ liệu đầu vào (validation) bằng **Yup** & **Formik**
* Bảo mật thông tin người dùng 


### 🛒 Sản phẩm (Product)

* Hiển thị danh sách tay cầm chơi game
* Phân loại theo hãng / nền tảng (PC, PS, Xbox, Mobile)
* Xem chi tiết sản phẩm
* Giao diện thân thiện, responsive

### 🔐 Bảo mật & API

* Không trả về mật khẩu từ API
* Chuẩn RESTful API
* Xử lý lỗi tập trung


###
---

## 🏗️ Công nghệ sử dụng

### Frontend

* **HTML5, SCSS/CSS**
* **JavaScript (ES6+)**
* **Bootstrap 5** (UI & Responsive)
* **AOS (Animate On Scroll)** – animation khi cuộn trang
* **Font Awesome / Remix Icon** – icon
* **ReactJS** – routing, state management, hooks,context
* **Formik** – form validation
* **Yup** – form validation
* **Axios** – API request
* **ContextAPI** – context API
* **React-Toastify** – toast notification
* **Config Alias** - config alias
* **Lazy Load** - lazy load
  

### Backend

* **Node.js**
* **Express.js**
* **Prisma ORM**
* **bcrypt** – hash & verify password
* **dotenv** – quản lý biến môi trường

### Database

* **MongoDB Atlas**

### DevOps & Tools

* Git & GitHub
* Postman (test API)
* Environment Variables (`.env`)
* Sẵn sàng deploy (Render / Railway / Vercel)

---

## 📂 Cấu trúc thư mục


---

## ⚙️ Cài đặt & chạy dự án

### 1️⃣ Clone repository

```bash
git clone https://github.com/Vinhdev04/Ecomerce-reactjs.git
cd xPadGame
```

### 2️⃣ Cài đặt backend

```bash
cd backend
npm install
```

### 3️⃣ Cấu hình biến môi trường (`.env`)

```env
PORT
DATABASE_URL
```

### 4️⃣ Đồng bộ database

```bash
npx prisma db push
```

### 5️⃣ Chạy server

```bash
npm run dev
```

Server chạy tại:

```
http://localhost:3000
```

---

## 🧪 API mẫu

### 👤 User APIs

#### Đăng ký

```
POST /api/auth/register
```

```json
{
  "email": "user@gmail.com",
  "password": "Password@123"
}
```

#### Đăng nhập

```
POST /api/auth/login
```

```json
{
  "email": "user@gmail.com",
  "password": "Password@123"
}
```

---

### 🛒 Product APIs

#### Lấy danh sách sản phẩm

```
GET /api/products
```

#### Lấy chi tiết sản phẩm

```
GET /api/products/:id
```

---

## 🚀 Deploy

Dự án có thể deploy trên:

* **Render**
* **Railway**
* **Vercel (Backend riêng)**

Khi deploy cần:

* Thiết lập biến môi trường `DATABASE_URL`
* Không commit file `.env`

---

## 📈 Định hướng phát triển

* Giỏ hàng & Thanh toán
* JWT Authentication (Access / Refresh Token)
* Quản lý sản phẩm (Admin)
* Animation nâng cao cho UI
* Tối ưu SEO

---

## 👨‍💻 Tác giả

* **Phạm Công Vinh**
* **Frontend Developer | Web Developer**

---

## 📄 Giấy phép

Dự án được phát triển cho mục đích **học tập và demo kỹ năng**.

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một **star** để ủng hộ!
