const API_URL = "https://script.google.com/macros/s/AKfycbxyz5IqNmbzeBbLYLzjn-gqVapgVxV82ziIHuovAj3ux7IgmSmnoKGhbQ8m6GLw-tEdZg/exec";

const massarInput = document.getElementById("massar");
const birthInput = document.getElementById("birth");
const resultDiv = document.getElementById("result");
const btn = document.getElementById("btn");

massarInput.addEventListener("input", () => {
  massarInput.value = massarInput.value.toUpperCase().replace(/\s/g, "");
});

massarInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    birthInput.focus();
  }
});

birthInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchStudent();
  }
});

async function searchStudent() {
  const code = massarInput.value.trim().toUpperCase().replace(/\s/g, "");
  const birth = birthInput.value.trim();

  resultDiv.innerHTML = "";

  if (!code) {
    showError("المرجو إدخال رقم مسار");
    massarInput.focus();
    return;
  }

  if (!birth) {
    showError("المرجو إدخال تاريخ الازدياد");
    birthInput.focus();
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
      showError(data.message || "المعلومات غير صحيحة");
    }

  } catch (error) {
    showError("تعذر الاتصال بالخادم، المرجو المحاولة لاحقاً");
  }

  setLoading(false);
}

function setLoading(state) {
  if (state) {
    btn.disabled = true;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> جاري البحث...';
    resultDiv.innerHTML =
      '<div class="loading">المرجو الانتظار...</div>';
  } else {
    btn.disabled = false;
    btn.innerHTML =
      '<i class="fa-solid fa-magnifying-glass"></i> بحث';
  }
}

function showSuccess(nom, password) {
  resultDiv.innerHTML = `
    <div class="result-box">
      <div>الاسم الكامل</div>
      <h3>${escapeHtml(nom)}</h3>

      <div>القن السري الخاص بك</div>
      <div class="password" id="passwordText">${escapeHtml(password)}</div>

      <button class="copy-btn" onclick="copyPassword()">
        <i class="fa-solid fa-copy"></i>
        نسخ القن السري
      </button>

      <div class="massar-note">
        <i class="fa-solid fa-circle-info"></i>
        المرجو التأكد أنك تستخدم مسار متمدرس وليس الخاص بالأولياء.
        <br>
        <a href="https://massarservice.men.gov.ma/moutamadris/Account" target="_blank">
          الدخول إلى مسار متمدرس
        </a>
      </div>
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

function copyPassword() {
  const passwordEl = document.getElementById("passwordText");

  if (!passwordEl) return;

  const password = passwordEl.innerText.trim();

  navigator.clipboard.writeText(password).then(() => {
    showCopyMessage("تم نسخ القن السري بنجاح");
  }).catch(() => {
    showCopyMessage("تعذر النسخ، المرجو نسخه يدوياً");
  });
}

function showCopyMessage(message) {
  const oldMsg = document.getElementById("copyMessage");
  if (oldMsg) oldMsg.remove();

  const msg = document.createElement("div");
  msg.id = "copyMessage";
  msg.className = "copy-message";
  msg.innerHTML = `<i class="fa-solid fa-check"></i> ${escapeHtml(message)}`;

  const box = document.querySelector(".result-box");
  if (box) {
    box.appendChild(msg);
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
