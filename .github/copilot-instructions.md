# GitHub Copilot Instructions — mss301_web

## Tổng Quan Dự Án

**TechGear** là nền tảng thương mại điện tử phụ kiện công nghệ hướng đến người dùng Việt Nam.

- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **State management**: Zustand / React Context
- **Form**: React Hook Form + Zod
- **HTTP**: Axios
- **Testing**: Vitest + Testing Library
- **Linting/Format**: ESLint + Prettier

---

## Ngôn Ngữ & Văn Phong

- **Giao diện**: Tiếng Việt — mọi text hiển thị cho người dùng phải bằng tiếng Việt
- **Code**: Tên biến, hàm, component viết bằng tiếng Anh (theo chuẩn coding standard)
- **Comment**: Viết bằng tiếng Anh, chỉ khi cần thiết (xem quy tắc comment)
- Số tiền định dạng: `xxx.000đ` (dấu chấm phân cách hàng nghìn, đơn vị `đ`)

---

## Kiến Trúc & Cấu Trúc Thư Mục

```
src/
├── assets/                     # Hình ảnh, font, icon, video
├── components/
│   ├── ui/                     # Atomic UI — Button, Input, Modal, Badge...
│   ├── layout/                 # Header, Footer, Sidebar
│   └── common/                 # Shared business components
├── pages/
│   ├── auth/                   # Login, Register, ForgotPassword
│   ├── customer/               # Home, ProductList, ProductDetail, Cart, Checkout, OrderHistory, Profile, Wishlist
│   ├── admin/                  # Dashboard, ProductManager, OrderManager, UserManager, Promotions, Reports
│   ├── staff/                  # OrderManager, FeedbackManager
│   └── shared/                 # NotFound, ServerError
├── router/
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   └── routes.const.ts
├── contexts/                   # AuthContext, CartContext
├── hooks/                      # useAuth, useCart, useFetchData...
├── services/                   # productService, orderService, authService, userService...
├── types/                      # TypeScript interfaces & types
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── index.ts
├── constants/
│   ├── api.const.ts            # BASE_URL, API endpoints
│   └── app.const.ts            # App name, pagination size...
├── utils/                      # formatPrice, formatDate, formatVND...
├── stores/                     # Zustand stores
├── App.tsx
└── main.tsx
```

---

## Quy Tắc Đặt Tên

| Loại            | Quy tắc                 | Ví dụ                              |
| --------------- | ----------------------- | ---------------------------------- |
| Component       | `PascalCase`            | `ProductCard.tsx`, `CartItem.tsx`  |
| Hook            | `camelCase` + `use`     | `useAuth.ts`, `useCart.ts`         |
| Service         | `camelCase` + `Service` | `productService.ts`                |
| Type/Interface  | `PascalCase`            | `Product`, `OrderResponse`         |
| Props interface | hậu tố `Props`          | `ProductCardProps`                 |
| Store           | `camelCase` + `Store`   | `cartStore.ts`                     |
| Constant file   | `camelCase` + `.const`  | `app.const.ts`                     |
| Enum value      | `UPPER_CASE`            | `OrderStatus.PENDING`              |
| CSS class       | Tailwind utility class  | `className="bg-teal-500 ..."`      |

---

## Hệ Thống Màu Sắc (Tailwind Classes)

> Tham khảo đầy đủ tại `color.md` trong root của repository.

### Màu Chính

| Vai trò               | Tailwind Class         | Hex       |
| --------------------- | ---------------------- | --------- |
| Nút CTA / Primary     | `bg-teal-500`          | `#14b8a6` |
| Hover nút CTA         | `hover:bg-teal-600`    | `#0d9488` |
| Link / text active    | `text-teal-500`        | `#14b8a6` |
| Accent (sale/badge)   | `bg-red-400`           | `#f87171` |
| Giá sale              | `text-red-400`         | `#f87171` |
| Accent phụ (admin)    | `bg-orange-500`        | `#f97316` |
| Sao đánh giá          | `text-yellow-500`      | `#eab308` |
| Giảm giá              | `text-green-600`       | `#16a34a` |

### Màu Nền & Text

| Vai trò               | Tailwind Class         |
| --------------------- | ---------------------- |
| Nền trang             | `bg-stone-50`          |
| Card / panel          | `bg-white`             |
| Text tiêu đề          | `text-zinc-900`        |
| Text body             | `text-gray-500`        |
| Viền                  | `border-gray-100`      |

### Typography

- Font khách hàng & nhân viên: **Epilogue** — `font-['Epilogue']`
- Font admin: **Manrope** — `font-['Manrope']`

---

## Component Patterns

### Nút CTA chính

```tsx
<button className="bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl px-6 py-3 shadow-[0px_10px_15px_-3px_rgba(20,170,184,0.20)] transition-colors">
  Khám phá ngay
</button>
```

### Badge Flash Sale

```tsx
<span className="bg-red-400 text-white text-sm font-bold font-['Epilogue'] px-3 py-1 rounded">
  SIÊU SALE
</span>
```

### Hiển thị giá sản phẩm

```tsx
<div className="flex items-center gap-2">
  <span className="text-red-400 text-lg font-bold font-['Epilogue']">
    {formatVND(salePrice)}
  </span>
  <span className="text-gray-400 text-sm line-through font-['Epilogue']">
    {formatVND(originalPrice)}
  </span>
</div>
```

### Sao đánh giá

```tsx
{Array.from({ length: 5 }).map((_, i) => (
  <StarIcon key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
))}
```

---

## Tính Năng & Business Rules

### Roles & Permissions

| Role          | Quyền truy cập                                                     |
| ------------- | ------------------------------------------------------------------ |
| Khách         | Duyệt SP, tìm kiếm, lọc, thêm giỏ hàng, thanh toán, đăng ký      |
| Khách Hàng    | Tất cả của Khách + lịch sử đơn, yêu thích, tích điểm, đổi điểm   |
| Nhân Viên     | Quản lý đơn hàng, cập nhật trạng thái, xử lý feedback             |
| Quản Trị Viên | Toàn quyền: sản phẩm, danh mục, người dùng, khuyến mãi, báo cáo  |

### Danh Mục Sản Phẩm

- Phụ Kiện Di Động (Sạc dự phòng, Bộ sạc, Cáp, Ốp lưng, Miếng dán)
- Phụ Kiện Laptop & PC (Hub, Chuột, Bàn phím, Túi laptop, USB)
- Thiết Bị Âm Thanh (Tai nghe, Loa, Micro)
- Thiết Bị Nhà Thông Minh (Camera, Router, Đèn thông minh)
- Phụ Kiện Gaming (Chuột gaming, Bàn phím gaming, Tay cầm)
- Thiết Bị Lưu Trữ (Ổ cứng di động, Thẻ nhớ)

### Thanh Toán

- MoMo, VNPay, COD (Thanh toán khi nhận hàng)
- Áp dụng voucher/mã giảm giá tại checkout

### Membership

- Tích điểm theo đơn hàng
- Đổi điểm lấy giảm giá

---

## Quy Tắc Code

### TypeScript

```ts
// ✅ Luôn dùng kiểu cụ thể
const fetchProduct = async (id: number): Promise<Product> => { ... }

// ✅ Interface cho Props, Response, Model
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

// ✅ Type cho union/alias
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// ❌ Không dùng any
const data: any = fetchData(); // ❌
```

### Import Order

```ts
// 1. Thư viện ngoài
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Components nội bộ
import ProductCard from "@/components/common/ProductCard";
import Button from "@/components/ui/Button";

// 3. Services, hooks, utils
import { productService } from "@/services/productService";
import { useAuth } from "@/hooks/useAuth";
import { formatVND } from "@/utils/formatPrice";

// 4. Types
import type { Product } from "@/types/product.types";
```

### Khi Nào Nên Viết Comment

```ts
// ✅ Logic phức tạp
// Tính giá sau khi áp dụng giảm giá lũy tiến:
// - Dưới 500.000đ: giảm 5%
// - Từ 500.000đ–2.000.000đ: giảm 10%
// - Trên 2.000.000đ: giảm 15%
const finalPrice = calculateTieredDiscount(subtotal);

// ❌ Thừa — code đã tự rõ
const isLoggedIn = !!token; // kiểm tra đăng nhập
```

### Format Tiền Việt Nam

```ts
// utils/formatPrice.ts
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}
// Kết quả: 850000 → "850.000đ"
```

---

## Testing

- Dùng **Vitest** + **@testing-library/react**
- Test file: đặt cạnh file cần test, đặt tên `*.test.tsx` / `*.test.ts`
- Tập trung test business logic (services, utils, hooks)
- Không test implementation details của UI

---

## Lưu Ý Quan Trọng

1. **Không hardcode text tiếng Anh** trong UI — mọi nội dung hiển thị phải bằng tiếng Việt
2. **Responsive mobile-first** — luôn thiết kế cho màn hình nhỏ trước
3. **Không dùng `any`** trong TypeScript
4. **Mỗi component 1 file** — không gộp nhiều component vào 1 file
5. **Protected routes** — luôn kiểm tra quyền truy cập qua `ProtectedRoute`
6. **Error handling** — mọi API call phải có try/catch, hiển thị thông báo lỗi thân thiện bằng tiếng Việt
7. **Loading states** — hiển thị skeleton/spinner khi đang fetch dữ liệu
