document.addEventListener("DOMContentLoaded", function () {
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

    // Create elements for each result and display horizontally
    for (const [key, value] of Object.entries(scores)) {
      const scoreElement = document.createElement("div");
      scoreElement.classList.add("score-item");
      scoreElement.innerHTML = `<strong>${key.toUpperCase()}:</strong> ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}`;
      resultContainer.appendChild(scoreElement);
    }

    document.getElementById("thankYouMessage").style.display = "block";
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
        onSurveyCompleted(); 
    }
  });

  // Generate PDF
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById("nameInput").value;
    const birthYear = document.getElementById("birthYearInput").value;

    if (!name || !birthYear) {
      alert("Vui lòng nhập tên và năm sinh!");
      return;
    }

    const downloadDate = new Date().toLocaleString();

    doc.text("KET QUA TINH DIEM KOOS", 105, 20, { align: "center" });

    doc.text(`Ho ten: ${name}`, 10, 30);
    doc.text(`Nam sinh: ${birthYear}`, 10, 40);
    doc.text(`Thoi gian: ${downloadDate}`, 10, 50);

    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    const scores = {
      symptoms: calculateKOOSScore(questionGroups.symptoms),
      pain: calculateKOOSScore(questionGroups.pain),
      adl: calculateKOOSScore(questionGroups.adl),
      sport: calculateKOOSScore(questionGroups.sport),
      qol: calculateKOOSScore(questionGroups.qol),
    };

    doc.text("KOOS SCORE:", 10, 70);

    let yPos = 80;
    for (const [key, value] of Object.entries(scores)) {
      const scoreText = `${key.toUpperCase()}: ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}`;
      doc.text(scoreText, 10, yPos);
      yPos += 10;
    }

    doc.setLineWidth(0.5);
    doc.line(10, yPos + 5, 200, yPos + 5);

    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text("KOOS", 15, 280);

    doc.save("KOOS_Score_Report.pdf");
  }

  // Add event for download PDF button
  document.getElementById("downloadPdfBtn").addEventListener("click", function () {
    generatePDF();
  });
});
