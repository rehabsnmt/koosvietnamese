import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Hiển thị số lượng khảo sát đã hoàn thành trên giao diện.
 */
export async function hienThiSoLuong() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);

    // Lấy số lượng từ Firestore hoặc mặc định là 0
    const count = docSnap.exists() ? docSnap.data().soluong || 0 : 0;

    // Chỉ cập nhật nếu phần tử tồn tại
    const completionElement = document.getElementById("completionCount");
    if (completionElement) {
      completionElement.innerText = `Số lượt hoàn thành khảo sát: ${count}`;
    }
  } catch (error) {
    console.error("Lỗi khi đọc số lượng:", error);
  }
}

/**
 * Tăng số lượng khảo sát hoàn thành lên 1 và cập nhật giao diện.
 */
export async function tangSoLuongHoanThanh() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);

    // Lấy số lượng hiện tại và tăng lên 1
    const current = docSnap.exists() ? docSnap.data().soluong || 0 : 0;
    await setDoc(docRef, { soluong: current + 1 });

    // Cập nhật hiển thị số lượng
    hienThiSoLuong();
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
  }
}

// Hiển thị số lượng khi trang được tải
document.addEventListener("DOMContentLoaded", hienThiSoLuong);

// Tăng số lượng khi khảo sát được hoàn thành
window.onSurveyCompleted = tangSoLuongHoanThanh;
