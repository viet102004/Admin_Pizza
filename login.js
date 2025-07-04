document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập tài khoản và mật khẩu!");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("tai_khoan", username);
  formData.append("mat_khau", password);

  fetch("https://related-burro-selected.ngrok-free.app/dang-nhap", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Phản hồi:", data);

      if (data.user.vai_tro === "quan_tri_vien") {
        alert("✅ Đăng nhập thành công!");
        // Chuyển trang nếu đúng vai trò
        window.location.href = "trangchu.html";
      } else {
        alert("❌ Tài khoản không có quyền truy cập!");
      }
    })
    .catch((err) => {
      console.error("Lỗi:", err);
      alert("Không thể kết nối đến máy chủ.");
    });
});


// Thêm function kiểm tra xem user đã đăng nhập chưa
function checkAuthStatus() {
  const token = localStorage.getItem("authToken");
  if (token && token !== "null" && token !== "undefined") {
    console.log("🔐 User đã đăng nhập, token:", token);
    // Có thể chuyển hướng đến trang chủ nếu muốn
    // window.location.href = "trangchu.html";
  }
}

// Gọi hàm kiểm tra khi trang load
document.addEventListener("DOMContentLoaded", checkAuthStatus);