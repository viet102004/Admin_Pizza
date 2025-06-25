

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
  });
});


