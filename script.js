const API_URL = "COLLER_URL_APPS_SCRIPT_ICI";

const massarInput = document.getElementById("massar");
const birthInput = document.getElementById("birth");
const resultDiv = document.getElementById("result");
const btn = document.getElementById("btn");

massarInput.addEventListener("input", () => {
  massarInput.value = massarInput.value.toUpperCase();
});

birthInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    searchStudent();
  }
});

massarInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    birthInput.focus();
  }
});

async function searchStudent() {
  const code = massarInput.value.trim().toUpperCase();
  const birth = birthInput.value.trim();

  if (!code || !birth) {
    showError("المرجو إدخال رقم مسار وتاريخ الازدياد");
    return;
  }

  if (!code.startsWith("R")) {
    showError("رقم مسار يجب أن يبدأ بالحرف R");
    return;
  }

  setLoading(true);

  try {
    const url =
      API_URL +
      "?code=" +
      encodeURIComponent(code) +
      "&birth=" +
      encodeURIComponent(birth);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await response.json();

    if (data.success) {
      showSuccess(data.nom, data.password);
    } else {
      showError("المعلومات غير صحيحة أو لم يتم العثور على التلميذ");
    }

  } catch (error) {
    showError("تعذر الاتصال بالخادم، المرجو المحاولة لاحقاً");
  }

  setLoading(false);
}

function setLoading(state) {
  if (state) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري البحث...';
    resultDiv.innerHTML = '<div class="loading">المرجو الانتظار...</div>';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> بحث';
  }
}

function showSuccess(nom, password) {
  resultDiv.innerHTML = `
    <div class="result-box">
      <div>الاسم الكامل</div>
      <h3>${escapeHtml(nom)}</h3>
      <div>الفن السري الخاص بك</div>
      <div class="password">${escapeHtml(password)}</div>
    </div>
  `;
}

function showError(message) {
  resultDiv.innerHTML = `
    <div class="error">
      <i class="fa-solid fa-triangle-exclamation"></i>
      ${escapeHtml(message)}
    </div>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
