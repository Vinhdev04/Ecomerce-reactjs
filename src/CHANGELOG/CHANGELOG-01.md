# 📄 CHANGELOG - TASK `19/12/2025`

📌 Author: Phạm Công Vinh
📌 Tech stack: React, Hooks, Pagination
Tất cả các thay đổi đáng chú ý liên quan đến **Product List & Pagination** sẽ được ghi lại trong file này.

---

## [Unreleased]

### ✨ Improved

-   Tối ưu hiệu năng render Pagination
-   Fix lỗi stale state trong callback
-   Chuẩn hóa React Hooks usage
-   Cải thiện UX khi chuyển trang
-   Đồng bộ state pagination với API backend

---

## 🔧 Pagination & Product Hook Refactor

### 1️⃣ Memo hóa `handlePageChange`

**Mô tả**

-   Giữ function reference ổn định
-   Giảm re-render không cần thiết cho Pagination

**Before**

```js
const handlePageChange = (page) => {
    fetchProducts(page, pagination.limit);
};
```

**After**

```
const handlePageChange = useCallback(
    (newPage) => {
        fetchProducts(newPage, pagination.limit);
    },
    [pagination.limit, fetchProducts]
);
```

---

2️⃣ Fix stale closure trong useCallback
**Before**

-   Đảm bảo callback luôn dùng dữ liệu pagination mới nhất

```
useCallback(() => {
    if (newPage > pagination.totalPages) return;
}, []);
```

**After**

```
useCallback(() => {
    if (newPage > pagination.totalPages) return;
}, [pagination.totalPages]);
```

---

3️⃣ Memo hóa fetchProducts
**Before**

-   Ổn định logic fetch
-   Tránh cascade re-render ở các callback phụ thuộc

```
const fetchProducts = async (page, limit) => {
    // fetch logic
};
```

**After**

```
const fetchProducts = useCallback(
    async (page = 1, limit = initialLimit) => {
        // fetch logic
    },
    [initialLimit]
);
```

---

4️⃣ Chuẩn hóa useEffect dependency

-   Tuân thủ React Hooks rules

-   Tránh ESLint warning và side-effect ẩn
    **Before**

```
useEffect(() => {
    fetchProducts();
}, []);
```

**After**

```
useEffect(() => {
    fetchProducts();
}, [fetchProducts]);
```

---

5️⃣ Tối ưu render Pagination bằng React.memo

-   Pagination chỉ render lại khi props thay đổi

```
export const Pagination = React.memo(({ pagination, onPageChange }) => {
    ...
});
```

---

Cải thiện kiến trúc tổng thể
**Before**

```
  Component xử lý cả fetch + UI
```

**\*After**

```
useProducts (logic)
 ├── fetchProducts
 ├── handlePageChange
 ├── retry
 ├── refresh
 └── changeLimit

ProductList (UI)
 ├── ProductGrid
 ├── Pagination
 └── ProductStates
```
