document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Kiểm tra input
  if (!username || !password) {
    alert("⚠️ Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
    return;
  }

  // Tạo form data
  const formData = new URLSearchParams();
  formData.append("tai_khoan", username);
  formData.append("mat_khau", password);

  // Gọi API
  fetch("https://related-burro-selected.ngrok-free.app/dang-nhap", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true" // Bỏ qua cảnh báo ngrok
    },
    body: formData.toString()
  })
    .then((res) => {
      // Kiểm tra status code
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("📋 Phản hồi từ server:", JSON.stringify(data, null, 2));

      // Kiểm tra message để xác định thành công
      if (data.message && data.message.includes("thành công")) {
        // Lưu token vào localStorage
        const token = data.token || data.access_token || "authenticated";
        localStorage.setItem("authToken", token);
        
        // Lưu thêm thông tin user nếu có
        if (data.user) {
          localStorage.setItem("userInfo", JSON.stringify(data.user));
        }

        alert("✅ Đăng nhập thành công!");
        
        // Chuyển trang ngay lập tức
        console.log("🔄 Đang chuyển hướng đến trang chủ...");
        window.location.href = "trangchu.html";
        
      } else {
        // Xử lý trường hợp đăng nhập thất bại
        const errorMessage = data.message || data.error || "Sai tài khoản hoặc mật khẩu!";
        alert("❌ " + errorMessage);
        console.error("🚫 Đăng nhập thất bại:", data);
      }
    })
    .catch((err) => {
      console.error("🔥 Lỗi kết nối:", err);
      
      // Phân loại lỗi để thông báo cụ thể hơn
      let errorMessage = "Không thể kết nối đến máy chủ.";
      
      if (err.name === "TypeError") {
        errorMessage = "Lỗi mạng hoặc CORS. Vui lòng kiểm tra kết nối internet.";
      } else if (err.message.includes("HTTP error")) {
        errorMessage = "Máy chủ trả về lỗi: " + err.message;
      }
      
      alert("⚠️ " + errorMessage);
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