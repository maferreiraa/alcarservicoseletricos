const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const form = document.getElementById('lumensForm');
const resultado = document.getElementById('resultado');

const ambientes = {
  '150': 'Ambiente residencial leve',
  '200': 'Ambiente social/intermediário',
  '120': 'Ambiente de descanso',
  '300': 'Ambiente funcional',
  '250': 'Ambiente de uso frequente',
  '400': 'Ambiente de trabalho/alta atenção',
  '100': 'Circulação'
};

if (form && resultado) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const ambienteSelect = document.getElementById('ambiente');
    const area = Number(document.getElementById('area').value);
    const lux = Number(ambienteSelect.value);
    const fator = Number(document.getElementById('tipoIluminacao').value);
    const lumensMetro = Number(document.getElementById('lumensMetro').value || 1000);
    const ambienteTexto = ambienteSelect.options[ambienteSelect.selectedIndex].text.split('—')[0].trim();
    const tipoTexto = document.getElementById('tipoIluminacao').options[document.getElementById('tipoIluminacao').selectedIndex].text;

    if (!area || area <= 0 || !lumensMetro || lumensMetro <= 0) {
      resultado.innerHTML = `
        <span class="result-label">Atenção</span>
        <h3>Confira os dados preenchidos.</h3>
        <p>Informe uma área válida e os lumens por metro da fita LED.</p>
      `;
      return;
    }

    const lumensBase = area * lux;
    const lumensAjustados = lumensBase * fator;
    const metrosFita = lumensAjustados / lumensMetro;

    const msg = encodeURIComponent(`Olá, João! Fiz uma estimativa na calculadora de lumens da Alçar.\n\nAmbiente: ${ambienteTexto}\nÁrea: ${area}m²\nTipo de iluminação: ${tipoTexto}\nLumens estimados: ${Math.round(lumensAjustados)} lm\nFita LED aproximada: ${metrosFita.toFixed(1)} m\n\nGostaria de avaliar esse projeto com você.`);

    resultado.innerHTML = `
      <span class="result-label">Resultado estimado</span>
      <h3>${ambienteTexto}</h3>
      <p>Para uma área de <strong>${area}m²</strong>, considerando <strong>${lux} lux</strong> como referência e o tipo <strong>${tipoTexto}</strong>:</p>
      <div class="result-numbers">
        <div class="result-box">
          <span>Lumens necessários</span>
          <strong>${Math.round(lumensAjustados).toLocaleString('pt-BR')} lm</strong>
        </div>
        <div class="result-box">
          <span>Fita LED aproximada</span>
          <strong>${metrosFita.toFixed(1).replace('.', ',')} m</strong>
        </div>
      </div>
      <p>Essa é uma estimativa inicial. Para garantir conforto visual, segurança e compatibilização com o projeto elétrico/luminotécnico, o ideal é avaliar o ambiente completo.</p>
      <a class="btn btn-primary glow full" style="margin-top:18px" href="https://wa.me/5534987210841?text=${msg}" target="_blank" rel="noopener">Enviar meu projeto para análise no WhatsApp</a>
    `;
  });
}


const openChecklistModal = document.getElementById('openChecklistModal');
const closeChecklistModal = document.getElementById('closeChecklistModal');
const checklistModal = document.getElementById('checklistModal');
const checklistForm = document.getElementById('checklistForm');

function openModal() {
  if (!checklistModal) return;
  checklistModal.classList.add('active');
  checklistModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!checklistModal) return;
  checklistModal.classList.remove('active');
  checklistModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (openChecklistModal) {
  openChecklistModal.addEventListener('click', openModal);
}

if (closeChecklistModal) {
  closeChecklistModal.addEventListener('click', closeModal);
}

if (checklistModal) {
  checklistModal.addEventListener('click', (event) => {
    if (event.target === checklistModal) closeModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

const appsScriptUrl = "https://script.google.com/macros/s/AKfycbx7xoiDSqeZOdUxSNEUshGktoMlkrSEYoJe6NrgyAp_0jXAgkykT7Qj7n7jPyscxy36/exec";
const checklistPdfUrl = "assets/checklist-alcar.pdf";

if (checklistForm) {
  checklistForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitButton = checklistForm.querySelector("button[type='submit']");
    submitButton.textContent = "Enviando...";
    submitButton.disabled = true;

    const formData = {
      nome: checklistForm.nome.value,
      whatsapp: checklistForm.whatsapp.value,
      email: checklistForm.email.value,
      profissao: checklistForm.profissao.value
    };

    try {
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      window.open(checklistPdfUrl, "_blank");
      checklistModal.classList.remove("active");
      checklistForm.reset();

    } catch (error) {
      alert("Não foi possível enviar seus dados. Tente novamente.");
    } finally {
      submitButton.textContent = "Acessar checklist agora";
      submitButton.disabled = false;
    }
  });
}
