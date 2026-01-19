# Task: ``

-   Create file `product.controller.js`
-   Handle `GET /products` request
-   Handle `GET /products/:id` request
-   Handle `POST /products` request
-   Handle `PUT /products/:id` request
-   Handle `DELETE /products/:id` request

---
# Task: ``
-   Create file `users.controller.js`
-   Create file `users.route.js`
-   Create User model in `schema.prisma`
-   Handle `POST /register` request
-   Handle `POST /login` request
-   Handle `POST /logout` request
-   Handle `GET /users` request
-   Handle `GET /users/:id` request
- Handle login/logout
- Handle error
- Handle getAllUser/ getUserByID
- Using bcrypt/jwt/cookie to store user data
- Testing in UI and Test in API using Postman

# Task: ``
 - Cập nhật Prisma schema
 - Implement refreshToken controller
 - Cập nhật login để lưu refresh token
 - Cập nhật logout để xóa refresh token
 - Tạo middleware verifyToken
 - Sửa Axios interceptor
 - Test flow: Login → Call API → Token hết hạn → Auto refresh → Success
 - Test edge cases: Refresh token hết hạn, token không hợp lệ
 - Thêm rate limiting
 - Review bảo mật