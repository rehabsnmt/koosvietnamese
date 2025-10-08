// Thêm updateDoc, increment, và setDoc vào dòng import
import { getDoc, doc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

// Hàm này không cần thay đổi
export async function hienThiSoLuong() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);
    const count = docSnap.exists() ? docSnap.data().soluong || 0 : 0;

    const completionElement = document.getElementById("completionCount");
    completionElement.innerText = "Số lượt hoàn thành khảo sát: " + count;

    completionElement.style.textAlign = "right";
    completionElement.style.fontSize = "20px";    
    completionElement.style.paddingRight = "20px";
  } catch (error) {
    console.error("Lỗi khi đọc số lượng:", error);
  }
}

// Hàm này đã được sửa lại hoàn toàn để an toàn và chính xác hơn
export async function tangSoLuongHoanThanh() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    // Sử dụng updateDoc và increment(1) để tăng giá trị an toàn trên server
    await updateDoc(docRef, {
      soluong: increment(1)
    });
    hienThiSoLuong(); // Cập nhật lại giao diện sau khi tăng
  } catch (error) {
    // Xử lý trường hợp tài liệu chưa tồn tại (lần chạy đầu tiên)
    if (error.code === 'not-found') {
      const docRef = doc(db, "1", "dahoanthanh");
      // Tạo mới tài liệu với giá trị ban đầu là 1
      await setDoc(docRef, { soluong: 1 });
      hienThiSoLuong();
    } else {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  }
}

// Phần này không cần thay đổi
document.addEventListener("DOMContentLoaded", hienThiSoLuong);
window.onSurveyCompleted = tangSoLuongHoanThanh;
