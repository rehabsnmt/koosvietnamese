import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Hiển thị số lượt hoàn thành khảo sát trên giao diện.
 */
export async function hienThiSoLuong() {
  try {
    const docRef = doc(db, "1", "dahoanthanh"); // Đường dẫn tài liệu trong Firestore
    const docSnap = await getDoc(docRef);

    // Lấy số liệu từ Firestore hoặc mặc định là 0
    const count = docSnap.exists() ? docSnap.data().soluong || 0 : 0;

    // Hiển thị số lượng lên giao diện
    const completionElement = document.getElementById("completionCount");
    if (completionElement) {
      completionElement.innerText = `Số lượt hoàn thành khảo sát: ${count}`;
    }
  } catch (error) {
    console.error("Lỗi khi đọc số lượng:", error);
  }
}

/**
 * Tăng số lượt hoàn thành khảo sát lên 1 và cập nhật vào Firestore.
 */
export async function tangSoLuongHoanThanh() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);

    // Tăng số lượng khảo sát hoàn thành
    const current = docSnap.exists() ? docSnap.data().soluong || 0 : 0;
    await setDoc(docRef, { soluong: current + 1 });

    // Hiển thị số lượng mới
    hienThiSoLuong();
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
  }
}
