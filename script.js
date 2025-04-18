import { hienThiSoLuong, tangSoLuongHoanThanh } from "./firebase-counter.js";

document.addEventListener("DOMContentLoaded", function () {
  // Hiển thị số lượt hoàn thành khi trang tải
  hienThiSoLuong();

  // Highlight selected answer
  document.querySelectorAll(".options label").forEach((label) => {
    label.addEventListener("click", function () {
      const parent = this.parentElement;
      parent.querySelectorAll("label").forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // Group questions into categories
  const questionGroups = {
    symptoms: [1, 2, 3, 4, 5, 6, 7],
    pain: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    adl: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    sport: [34, 35, 36, 37, 38],
    qol: [39, 40, 41, 42],
  };

  // Calculate KOOS score
  function calculateKOOSScore(questions) {
    let total = 0;
    let answeredCount = 0;

    questions.forEach((qNum) => {
      const question = document.querySelector(`.question[data-question="${qNum}"]`);
      const selectedOption = question?.querySelector("input[type='radio']:checked");
      if (selectedOption) {
        total += parseInt(selectedOption.value);
        answeredCount++;
      }
    });

    if (answeredCount === 0) return null;
    const averageScore = total / answeredCount;
    return Math.round(100 - (averageScore / 4) * 100);
  }

  // Display KOOS results
  function displayKOOSResults() {
    const scores = {
      symptoms: calculateKOOSScore(questionGroups.symptoms),
      pain: calculateKOOSScore(questionGroups.pain),
      adl: calculateKOOSScore(questionGroups.adl),
      sport: calculateKOOSScore(questionGroups.sport),
      qol: calculateKOOSScore(questionGroups.qol),
    };

    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = ""; // Clear existing content

    // Display scores
    for (const [key, value] of Object.entries(scores)) {
      const scoreElement = document.createElement("div");
      scoreElement.classList.add("score-item");
      scoreElement.innerHTML = `<strong>${key.toUpperCase()}:</strong> ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}`;
      resultContainer.appendChild(scoreElement);
    }

    document.getElementById("thankYouMessage").style.display = "block";

    // Tăng số lượt hoàn thành khảo sát
    tangSoLuongHoanThanh();
  }

  // Handle calculate button click
  document.getElementById("calculateBtn").addEventListener("click", function () {
    let firstUnansweredQuestion = null;

    // Check for unanswered questions and highlight them
    document.querySelectorAll(".question").forEach((question) => {
      const selectedOption = question.querySelector("input[type='radio']:checked");
      if (!selectedOption) {
        question.classList.add("unanswered");
        if (!firstUnansweredQuestion) {
          firstUnansweredQuestion = question;
        }
      } else {
        question.classList.remove("unanswered");
      }
    });

    if (firstUnansweredQuestion) {
      firstUnansweredQuestion.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      alert("Bạn phải trả lời tất cả các câu hỏi!");
    } else {
      displayKOOSResults();
    }
  });
});
