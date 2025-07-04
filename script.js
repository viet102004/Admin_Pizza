

function fetchUserCount() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/getAllNguoiDung", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Không thể tải danh sách người dùng");
      return res.json();
    })
    .then(data => {
      const userCount = Array.isArray(data) ? data.length : (data.total || 0);
      document.getElementById("totalUsers").textContent = userCount;
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải số người dùng:", err);
      document.getElementById("totalUsers").textContent = "⚠️";
    });
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchUserCount);

function fetchAndRenderUsers() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/getAllNguoiDung", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(data => {
      const users = Array.isArray(data.data) ? data.data : [];

      document.getElementById("totalUsers").textContent = users.length;

      const userList = document.getElementById("userList");
      userList.innerHTML = "";

      users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.className = "list-item";

       userItem.innerHTML = `
  <button class="delete-btn" onclick="deleteUser(${user.ma_nguoi_dung})">🗑️</button>
  <h4>${user.ho_ten || "Không tên"}</h4>
  <p><strong>Email:</strong> ${user.email || "Không có"}</p>
  <p><strong>SĐT:</strong> ${user.so_dien_thoai || "Không có"}</p>
`;


        userList.appendChild(userItem);
      });
    })
    .catch(err => {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  fetchAndRenderUsers(); // 👉 gọi ở đây
});

function deleteUser(ma_nguoi_dung) {
  const token = localStorage.getItem("authToken");

  if (!confirm("Bạn có chắc muốn xoá người dùng này?")) return;

  fetch(`https://related-burro-selected.ngrok-free.app/xoaNguoiDung/${ma_nguoi_dung}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Xoá thất bại");
      return res.json();
    })
    .then(data => {
      alert("🗑️ Đã xoá người dùng thành công!");
      fetchAndRenderUsers();
    })
    .catch(err => {
      console.error("❌ Xoá lỗi:", err);
      alert("❌ Không thể xoá người dùng");
    });
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'orders') {
      fetchAndRenderOrders();
    }
     if (tabName === 'products') {
      fetchAndRenderProducts();  // 👈 GỌI Ở ĐÂY
    }
    if (tabName === 'banners') {
     fetchAndRenderBanners();  // 👉 GỌI HÀM BANNER
    }
    if (tabName === 'coupons') {
  fetchAndRenderCoupons();
    }

  });
});
function fetchAndRenderProducts() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/getSanPhamHienThi", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("productList");
      container.innerHTML = '';

      if (!Array.isArray(products)) {
        container.innerHTML = "<p style='color:white;'>Không có dữ liệu sản phẩm.</p>";
        return;
      }

      products.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-row";

      item.innerHTML = `
  <div class="product-info">
    <div class="product-name">🏷️ <strong>${product.ten_san_pham}</strong></div>
    <div>💰 <strong>Giá:</strong> ${product.gia_co_ban.toLocaleString("vi-VN")} VNĐ</div>
    <div>📝 <strong>Mô tả:</strong> ${product.mo_ta || "Không có"}</div>
  </div>
  <div class="product-actions">
    <button onclick="editProduct(${product.ma_san_pham})">🖊️ Sửa</button>
  </div>
`;


        container.appendChild(item);
      });
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải sản phẩm:", err);
    });
}
function fetchAndRenderOrders() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/tatCaDonHang", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(data => {
      const orders = Array.isArray(data.don_hang) ? data.don_hang : [];

      const grouped = {
        cho_xac_nhan: [],
        dang_chuan_bi: [],
        dang_giao: [],
        hoan_thanh: [],
        da_huy: []
      };

      orders.forEach(o => {
        if (grouped[o.trang_thai]) {
          grouped[o.trang_thai].push(o);
        }
      });

      document.getElementById("pendingOrders").textContent = grouped.cho_xac_nhan.length;
      document.getElementById("preparingOrders").textContent = grouped.dang_chuan_bi.length;
      document.getElementById("shippingOrders").textContent = grouped.dang_giao.length;
      document.getElementById("completedOrders").textContent = grouped.hoan_thanh.length;
      document.getElementById("cancelledOrders").textContent = grouped.da_huy.length;

      renderOrderList("pendingOrderList", grouped.cho_xac_nhan, "dang_chuan_bi");
      renderOrderList("preparingOrderList", grouped.dang_chuan_bi, "dang_giao");
      renderOrderList("shippingOrderList", grouped.dang_giao, "hoan_thanh");
      renderOrderList("completedOrderList", grouped.hoan_thanh, null);
      renderOrderList("cancelledOrderList", grouped.da_huy, null);
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
    });
}



function renderOrderList(containerId, orders, nextStatus) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  orders.forEach(order => {
    const info = order.thong_tin_giao_hang || {};
    const item = document.createElement("div");
    item.className = "order-row";

    let actions = '';
    if (nextStatus) {
      actions = `
        <div class="order-actions">
          <button onclick="advanceOrderStatus(${order.ma_don_hang}, '${nextStatus}')">✔️</button>
          <button onclick="cancelOrder(${order.ma_don_hang})">❌</button>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="order-info">
        <div class="order-id">🧾 <strong>Đơn #${order.ma_don_hang}</strong></div>
        <div>👤 <strong>Người nhận:</strong> ${info.ten_nguoi_nhan || "?"}</div>
        <div>📞 <strong>SĐT:</strong> ${info.so_dien_thoai || "?"}</div>
        <div>📍 <strong>Địa chỉ:</strong> ${info.dia_chi || "?"}</div>
      </div>
      ${actions}
    `;
    container.appendChild(item);
  });
}


function approveOrder(ma_don_hang) {
  updateOrderStatus(ma_don_hang, "da_xac_nhan", "hoan_thanh");
}

function cancelOrder(ma_don_hang) {
  updateOrderStatus(ma_don_hang, "da_huy", "that_bai");
}

function updateOrderStatus(ma_don_hang, newTrangThai, newThanhToan) {
  const token = localStorage.getItem("authToken");

  const formData = new URLSearchParams();
  formData.append("trang_thai", newTrangThai);
  formData.append("trang_thai_thanh_toan", newThanhToan);

  fetch(`https://related-burro-selected.ngrok-free.app/capNhatTrangThaiDonHang/${ma_don_hang}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true"
    },
    body: formData.toString()
  })
    .then(res => {
      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
      return res.json();
    })
    .then(() => {
      alert("✅ Cập nhật trạng thái thành công!");
      fetchAndRenderOrders(); // reload danh sách
    })
    .catch(err => {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Không thể cập nhật đơn hàng");
    });
}

function editProduct(ma_san_pham) {
  const token = localStorage.getItem("authToken");

  let newPrice = prompt("Nhập giá mới (chỉ số, không dấu chấm hoặc phẩy):");
  const newDesc = prompt("Nhập mô tả mới:");
  let newDanhMuc = prompt("Nhập danh mục ");
  if (!newPrice&&!newDanhMuc) {
    alert("❌ Giá không được để trống.");
    return;
  }

  newPrice = newPrice.replace(/[.,\s]/g, '');
  if (isNaN(newPrice)) {
    alert("❌ Giá bạn nhập không hợp lệ.");
    return;
  }

  const formData = new FormData();
  formData.append("gia_co_ban", newPrice);
  formData.append("mo_ta", newDesc);
  formData.append("ma_danh_muc",newDanhMuc)

  fetch(`https://related-burro-selected.ngrok-free.app/san-pham/${ma_san_pham}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
      // ❌ KHÔNG được set Content-Type nếu dùng FormData
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Cập nhật thất bại");
      return res.json();
    })
    .then(() => {
      alert("✅ Đã cập nhật sản phẩm!");
      fetchAndRenderProducts();
    })
    .catch(err => {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Không thể cập nhật sản phẩm");
    });
}
function advanceOrderStatus(ma_don_hang, newStatus) {
  const token = localStorage.getItem("authToken");

  const isFinal = newStatus === 'hoan_thanh';
  const newPayment = isFinal ? 'hoan_thanh' : 'cho_xu_ly';

  const formData = new URLSearchParams();
  formData.append("trang_thai", newStatus);
  formData.append("trang_thai_thanh_toan", newPayment);

  fetch(`https://related-burro-selected.ngrok-free.app/capNhatTrangThaiDonHang/${ma_don_hang}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true"
    },
    body: formData.toString()
  })
    .then(res => {
      if (!res.ok) throw new Error("Chuyển trạng thái thất bại");
      return res.json();
    })
    .then(() => {
      alert("✔️ Đã chuyển trạng thái đơn hàng!");
      fetchAndRenderOrders();
    })
    .catch(err => {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Không thể chuyển trạng thái");
    });
}


function cancelOrder(ma_don_hang) {
  const token = localStorage.getItem("authToken");

  const formData = new URLSearchParams();
  formData.append("trang_thai", "da_huy");
  formData.append("trang_thai_thanh_toan", "that_bai");

  fetch(`https://related-burro-selected.ngrok-free.app/capNhatTrangThaiDonHang/${ma_don_hang}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true"
    },
    body: formData.toString()
  })
    .then(res => {
      if (!res.ok) throw new Error("Huỷ thất bại");
      return res.json();
    })
    .then(() => {
      alert("❌ Đã huỷ đơn hàng");
      fetchAndRenderOrders();
    })
    .catch(err => {
      console.error("❌ Lỗi khi huỷ:", err);
      alert("❌ Không thể huỷ đơn hàng");
    });
}

function fetchAndRenderBanners() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/danhSachBanner", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(banners => {
      const container = document.getElementById("bannerList");
      container.innerHTML = '';

      if (!Array.isArray(banners)) {
        container.innerHTML = "<p style='color:white;'>Không có dữ liệu banner.</p>";
        return;
      }

      banners.forEach(banner => {
        const item = document.createElement("div");
        item.className = "banner-row";

        const imageUrl = "https://related-burro-selected.ngrok-free.app" + banner.url_hinh_anh;

 item.innerHTML = `
  <div class="banner-info">
    <div class="banner-meta">
      <div class="banner-details">
        🆔 <strong>Mã banner:</strong> ${banner.ma_banner}<br/>
        📦 <strong>Mã sản phẩm:</strong> ${banner.ma_san_pham}<br/>
        🏷️ <strong>Tiêu đề:</strong> ${banner.tieu_de || "Không có"}<br/>
        <img src="${imageUrl}" alt="Banner" class="banner-img">
      </div>
      <div class="banner-actions">
        <input type="file" accept="image/*" id="bannerImageInput-${banner.ma_banner}" style="display: none" />
        <button class="btn edit-btn" onclick="editBanner(${banner.ma_banner}, '${banner.tieu_de}', ${banner.ma_san_pham})">🖊️ Sửa</button>
        <button class="btn delete-btn" onclick="deleteBanner(${banner.ma_banner})">🗑️ Xóa</button>
      </div>
    </div>
  </div>
`;



        container.appendChild(item);
      });
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải banner:", err);
    });
}
function deleteBanner(ma_banner) {
  const token = localStorage.getItem("authToken");

  if (!confirm("Bạn có chắc muốn xoá banner này?")) return;

  fetch(`https://related-burro-selected.ngrok-free.app/xoaBanner/${ma_banner}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Xóa banner thất bại");
      return res.json();
    })
    .then(() => {
      alert("🗑️ Đã xoá banner!");
      fetchAndRenderBanners();
    })
    .catch(err => {
      console.error("❌ Xóa lỗi:", err);
      alert("❌ Không thể xoá banner");
    });
}
function editBanner(ma_banner, currentTitle, currentProductId) {
  const token = localStorage.getItem("authToken");

  const newTitle = prompt("Nhập tiêu đề mới:", currentTitle);
  const newProductId = prompt("Nhập mã sản phẩm:", currentProductId);

  if (!newTitle || !newProductId || isNaN(newProductId)) {
    alert("❌ Dữ liệu không hợp lệ!");
    return;
  }

  // Lấy file ảnh từ input
  const fileInput = document.getElementById(`bannerImageInput-${ma_banner}`);
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("tieu_de", newTitle);
    formData.append("ma_san_pham", newProductId);
    if (file) {
      formData.append("hinh_anh", file);
    }

    fetch(`https://related-burro-selected.ngrok-free.app/capNhatBanner/${ma_banner}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true"
        // ❌ KHÔNG set Content-Type nếu dùng FormData
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật banner thất bại");
        return res.json();
      })
      .then(() => {
        alert("✅ Đã cập nhật banner!");
        fetchAndRenderBanners();
      })
      .catch(err => {
        console.error("❌ Lỗi khi cập nhật:", err);
        alert("❌ Không thể cập nhật banner");
      });
  };
}

// New functions for adding products
function showAddProductForm() {
  document.getElementById('addProductModal').style.display = 'block';
}

function closeAddProductModal() {
  document.getElementById('addProductModal').style.display = 'none';
  document.getElementById('addProductForm').reset();
}

// Handle add product form submission
document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addNewProduct();
    });
  }
});

function addNewProduct() {
  const token = localStorage.getItem("authToken");
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const description = document.getElementById('productDescription').value;
  const imageFile = document.getElementById('productImage').files[0];
  const category = document.getElementById('productCategory').value; // ✅ đọc ma_danh_muc

  if (!name || !price || !imageFile || !category) {
    alert("❌ Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }

  const formData = new FormData();
  formData.append("ten_san_pham", name);
  formData.append("gia_co_ban", price);
  formData.append("mo_ta", description);
  formData.append("hinh_anh", imageFile);
  formData.append("ma_danh_muc", category); // ✅ thêm vào đây

  fetch("https://related-burro-selected.ngrok-free.app/addSanPham", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Thêm sản phẩm thất bại");
      return res.json();
    })
    .then(data => {
      alert("✅ Đã thêm sản phẩm thành công!");
      closeAddProductModal();
      fetchAndRenderProducts(); // Refresh product list
    })
    .catch(err => {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      alert("❌ Không thể thêm sản phẩm");
    });
}


// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('addProductModal');
  if (event.target === modal) {
    closeAddProductModal();
  }
});
function showAddBannerForm() {
  document.getElementById("addBannerTitle").value = "";
  document.getElementById("addBannerProductId").value = "";
  document.getElementById("addBannerImage").value = "";
  document.getElementById("addBannerForm").style.display = "flex";
}
function closeAddBannerForm() {
  document.getElementById("addBannerForm").style.display = "none";
}
function submitNewBanner() {
  const token = localStorage.getItem("authToken");
  const tieuDe = document.getElementById("addBannerTitle").value.trim();
  const maSanPham = document.getElementById("addBannerProductId").value.trim();
  const hinhAnh = document.getElementById("addBannerImage").files[0];

  if (!tieuDe || !maSanPham || !hinhAnh) {
    alert("❌ Vui lòng nhập đủ thông tin và chọn hình");
    return;
  }

  const formData = new FormData();
  formData.append("tieu_de", tieuDe);
  formData.append("ma_san_pham", maSanPham);
  formData.append("hinh_anh", hinhAnh);

  fetch("https://related-burro-selected.ngrok-free.app/themBanner", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Thêm banner thất bại");
      return res.json();
    })
    .then(() => {
      alert("✅ Đã thêm banner mới!");
      closeAddBannerForm();
      fetchAndRenderBanners(); // load lại danh sách
    })
    .catch(err => {
      console.error("❌ Lỗi thêm banner:", err);
      alert("❌ Không thể thêm banner");
    });
}

function fetchAndRenderCoupons() {
  const token = localStorage.getItem("authToken");

  fetch("https://related-burro-selected.ngrok-free.app/maGiamGia/danhSach", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(data => {
      const coupons = Array.isArray(data.danh_sach_ma_giam_gia) ? data.danh_sach_ma_giam_gia : [];
      const container = document.getElementById("couponList");
      container.innerHTML = "";

      if (coupons.length === 0) {
        container.innerHTML = "<p style='color:white;'>Không có mã giảm giá nào.</p>";
        return;
      }

      coupons.forEach(coupon => {
        const item = document.createElement("div");
        item.className = "coupon-row";

        const hoatDong = coupon.hoat_dong ? "✅" : "❌";
        const loai = coupon.loai_giam_gia === "phan_tram"
          ? `${coupon.gia_tri_giam}%`
          : `${Number(coupon.gia_tri_giam).toLocaleString("vi-VN")}đ`;

       item.innerHTML = `
  <div class="discount-info">
    <div>🏷️ <strong>Mã giảm giá: </strong> ${coupon.ma_giam_gia}</div>
    <div>🏷️ <strong>Mã code: </strong> ${coupon.ma_code}</div>
    <div>💸 <strong>Giảm:</strong> ${coupon.loai_giam_gia === 'phan_tram' ? coupon.gia_tri_giam + "%" : parseFloat(coupon.gia_tri_giam).toLocaleString("vi-VN") + "đ"}</div>
    <div>📅 <strong>Hiệu lực:</strong> ${coupon.ngay_bat_dau} → ${coupon.ngay_ket_thuc}</div>
    <div>🧾 <strong>Loại:</strong> ${coupon.loai_giam_gia}</div>
    <div>🔥 <strong>Tối thiểu:</strong> ${coupon.gia_tri_don_hang_toi_thieu}</div>
    <div>👥 <strong>Sử dụng:</strong> ${coupon.da_su_dung}/${coupon.so_lan_su_dung_toi_da}</div>
    <div>✅ <strong>Hoạt động:</strong> ${coupon.hoat_dong ? "✔️" : "❌"}</div>
  </div>
  <div class="discount-actions">
   <button class="btn delete-btn" onclick="deleteDiscount(${coupon.ma_giam_gia})">🗑️ Xoá</button>
    <button class="btn edit-btn" onclick="openEditDiscountForm(${coupon.ma_giam_gia})">🖊️ Sửa</button>
  </div>
`;


        container.appendChild(item);
      });
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải mã giảm giá:", err);
    });
}


function showAddDiscountForm() {
  document.getElementById("discountForm").style.display = "flex";
}
function closeDiscountForm() {
  document.getElementById("discountForm").style.display = "none";
}
function submitDiscount() {
  const token = localStorage.getItem("authToken");

  const ma_code = document.getElementById("discountCode").value.trim();
  const loai_giam_gia = document.getElementById("discountType").value;
  const gia_tri_giam = document.getElementById("discountValue").value;
  const ngay_bat_dau = document.getElementById("discountStart").value;
  const ngay_ket_thuc = document.getElementById("discountEnd").value;
  const gia_tri_don_hang_toi_thieu = document.getElementById("discountMinValue").value;
  const so_lan_su_dung_toi_da = document.getElementById("discountMaxUse").value;

  if (!ma_code || !loai_giam_gia || !gia_tri_giam || !ngay_bat_dau || !ngay_ket_thuc || !so_lan_su_dung_toi_da) {
    alert("❌ Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("ma_code", ma_code);
  formData.append("loai_giam_gia", loai_giam_gia);
  formData.append("gia_tri_giam", gia_tri_giam);
  formData.append("ngay_bat_dau", ngay_bat_dau);
  formData.append("ngay_ket_thuc", ngay_ket_thuc);
  formData.append("gia_tri_don_hang_toi_thieu", gia_tri_don_hang_toi_thieu || 0);
  formData.append("so_lan_su_dung_toi_da", so_lan_su_dung_toi_da);

fetch("https://related-burro-selected.ngrok-free.app/maGiamGia/tao", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "ngrok-skip-browser-warning": "true"
  },
  body: formData.toString()
})
  .then(res => {
    if (!res.ok) {
      console.error("⚠️ Response không ok", res.status);
      throw new Error("Tạo mã giảm giá thất bại");
    }
    return res.json(); // bắt buộc return
  })
  .then(data => {
    console.log("✅ API trả về thành công:", data);
    if (data.status === "fail") {
      alert("❌ " + data.message || "Lỗi từ server.");
      return;
    }

    alert("✅ Đã tạo mã giảm giá!");
    closeDiscountForm();
    fetchAndRenderCoupons();
  })
  .catch(err => {
    console.error("❌ Lỗi khi tạo mã giảm giá:", err);
    alert("❌ Không thể tạo mã giảm giá: " + err.message);
  });

}

function deleteDiscount(ma_giam_gia) {
  const token = localStorage.getItem("authToken");
  if (!confirm("Bạn có chắc muốn xoá mã giảm giá này?")) return;

  fetch(`https://related-burro-selected.ngrok-free.app/maGiamGia/${ma_giam_gia}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Xoá thất bại");
      return res.json();
    })
    .then(() => {
      alert("🗑️ Đã xoá mã giảm giá!");
      fetchAndRenderCoupons(); // làm mới lại danh sách
    })
    .catch(err => {
      console.error("❌ Lỗi khi xoá mã:", err);
      alert("❌ Không thể xoá mã giảm giá");
    });
}
function openEditDiscountForm(ma_giam_gia) {
  const token = localStorage.getItem("authToken");

  fetch(`https://related-burro-selected.ngrok-free.app/maGiamGia/${ma_giam_gia}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(data => {
      const coupon = data;

      document.getElementById("discountCode").value = coupon.ma_code || "";
      document.getElementById("discountType").value = coupon.loai_giam_gia || "";
      document.getElementById("discountValue").value = coupon.gia_tri_giam || "";
      document.getElementById("discountStart").value = coupon.ngay_bat_dau || "";
      document.getElementById("discountEnd").value = coupon.ngay_ket_thuc || "";
      document.getElementById("discountMinValue").value = coupon.gia_tri_don_hang_toi_thieu || "";
      document.getElementById("discountMaxUse").value = coupon.so_lan_su_dung_toi_da || "";

      // Đổi nút Thêm thành Cập nhật
      const submitBtn = document.querySelector("#discountForm .form-actions button:first-child");
      submitBtn.textContent = "✅ Cập nhật";
      submitBtn.onclick = () => updateDiscount(ma_giam_gia);

      document.getElementById("discountForm").style.display = "flex";
    })
    .catch(err => {
      console.error("❌ Lỗi khi lấy thông tin mã:", err);
      alert("❌ Không thể tải mã giảm giá");
    });
}

function updateDiscount(ma_giam_gia) {
  const token = localStorage.getItem("authToken");

  const ma_code = document.getElementById("discountCode").value.trim();
  const loai_giam_gia = document.getElementById("discountType").value;
  const gia_tri_giam = document.getElementById("discountValue").value;
  const ngay_bat_dau = document.getElementById("discountStart").value;
  const ngay_ket_thuc = document.getElementById("discountEnd").value;
  const gia_tri_don_hang_toi_thieu = document.getElementById("discountMinValue").value;
  const so_lan_su_dung_toi_da = document.getElementById("discountMaxUse").value;

  const formData = new URLSearchParams();
  formData.append("ma_code", ma_code);
  formData.append("loai_giam_gia", loai_giam_gia);
  formData.append("gia_tri_giam", gia_tri_giam);
  formData.append("ngay_bat_dau", ngay_bat_dau);
  formData.append("ngay_ket_thuc", ngay_ket_thuc);
  formData.append("gia_tri_don_hang_toi_thieu", gia_tri_don_hang_toi_thieu || 0);
  formData.append("so_lan_su_dung_toi_da", so_lan_su_dung_toi_da);

  fetch(`https://related-burro-selected.ngrok-free.app/maGiamGia/${ma_giam_gia}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true"
    },
    body: formData.toString()
  })
    .then(res => {
      if (!res.ok) throw new Error("Cập nhật thất bại");
      return res.json();
    })
    .then(() => {
      alert("✅ Đã cập nhật mã giảm giá!");
      closeDiscountForm();
      fetchAndRenderCoupons();
    })
    .catch(err => {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Không thể cập nhật mã giảm giá");
    });
}




