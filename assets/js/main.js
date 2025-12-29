 /* ================= MENU ================= */
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  if(menuBtn && menu){
    menuBtn.onclick = () => menu.classList.toggle("hidden");
    document.addEventListener("click", e => {
      if(!menu.contains(e.target) && !menuBtn.contains(e.target)){
        menu.classList.add("hidden");
      }
    });
  }

  /* ================= HEADER SCROLL ================= */
  const header = document.getElementById("mainHeader");
  if(header){
    window.addEventListener("scroll", () => {
      header.classList.toggle("shadow-lg", window.scrollY > 60);
    });
  }

  /* ================= TEMA POR DIA ================= */
  const temas = {
    0:{body:"linear-gradient(135deg,#FEF3C7,#FDE68A)",from:"#FDE68A",to:"#F59E0B"},
    1:{body:"linear-gradient(135deg,#E5E7EB,#D1D5DB)",from:"#D1D5DB",to:"#9CA3AF"},
    2:{body:"linear-gradient(135deg,#DCFCE7,#86EFAC)",from:"#86EFAC",to:"#22C55E"},
    3:{body:"linear-gradient(135deg,#E0F2FE,#7DD3FC)",from:"#7DD3FC",to:"#38BDF8"},
    4:{body:"linear-gradient(135deg,#F3E8FF,#C4B5FD)",from:"#C4B5FD",to:"#8B5CF6"},
    5:{body:"linear-gradient(135deg,#FFE4E6,#FBCFE8)",from:"#FB7185",to:"#EC4899"},
    6:{body:"linear-gradient(135deg,#FEF9C3,#FDE047)",from:"#FDE047",to:"#EAB308"}
  };

  const hoje = new Date().getDay();
  const tema = temas[5];
  document.documentElement.style.setProperty("--bg-body", tema.body);
  document.documentElement.style.setProperty("--hero-from", tema.from);
  document.documentElement.style.setProperty("--hero-to", tema.to);

/* ================= IMAGEM HERO ================= */
function iniciarHeroImage() {
  const heroImage = document.getElementById("heroImage");
  if (!heroImage) return;

  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth();

  const periodoAnoNovo =
    (mes === 11 && dia >= 28) || (mes === 0 && dia === 1);

  const imagensAnoNovo = [
    "img/ano-novo/feliz-ano-novo-1.webp",
    "img/ano-novo/feliz-ano-novo-2.webp",
    "img/ano-novo/feliz-ano-novo-3.webp",
    "img/ano-novo/feliz-ano-novo-4.webp",
    "img/ano-novo/feliz-ano-novo-5.webp"
  ];

  let ultima = null;

  if (!periodoAnoNovo) {
    heroImage.src = "img/gato-e-cachorro-felizes.webp";
    heroImage.classList.remove("opacity-0");
    return;
  }

  function trocarImagem() {
    let nova;
    do {
      nova = imagensAnoNovo[Math.floor(Math.random() * imagensAnoNovo.length)];
    } while (nova === ultima);

    ultima = nova;
    heroImage.classList.add("opacity-0");

    setTimeout(() => {
      heroImage.src = nova;
      heroImage.classList.remove("opacity-0");
    }, 500);
  }

  trocarImagem();
  setInterval(trocarImagem, 15000);
}

/* 📦 Carrega HTML parcial de depoimentos */
function carregarDepoimentos() {
  const container = document.getElementById("depoimentos-container");
  if (!container) return;

  fetch("partials/depoimentos.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      iniciarCarrosselDepoimentos(); // 🔑 AQUI
    })
    .catch(err => console.error(err));
}

/* 🔄 Carrossel de depoimentos */
function iniciarCarrosselDepoimentos() {
  const carousel = document.getElementById("carousel");
  const indicators = document.getElementById("indicators");

  if (!carousel || !indicators) return;

  const slides = carousel.children.length;
  if (slides <= 1) return;

  let index = 0;
  indicators.innerHTML = "";

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement("span");
    dot.className = "w-3 h-3 rounded-full bg-gray-300 transition-all";
    indicators.appendChild(dot);
  }

  const dots = indicators.children;

  function atualizar() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    [...dots].forEach((d, i) => {
      d.classList.toggle("bg-gray-400", i === index);
      d.classList.toggle("scale-125", i === index);
    });
  }

  setInterval(() => {
    index = (index + 1) % slides;
    atualizar();
  }, 5000);

  atualizar();
}

/* 📅 DADOS DO CALENDÁRIO MENSAL */
const mesesPet = {
  0:{titulo:"Janeiro Branco Pet ⚪",descricao:"Saúde mental e bem-estar dos pets."},
  1:{titulo:"Fevereiro Roxo Pet 💜",descricao:"Cuidados com pets idosos."},
  2:{titulo:"Março Azul Marinho Pet 🔵",descricao:"Prevenção de verminoses."},
  3:{titulo:"Abril Laranja Pet 🧡",descricao:"Prevenção da crueldade animal."},
  4:{titulo:"Maio Amarelo Pet 💛",descricao:"Saúde renal e bucal."},
  5:{titulo:"Junho Violeta Pet 🟣",descricao:"Saúde ocular e dermatológica."},
  6:{titulo:"Julho Dourado Pet 🟡",descricao:"Vacinação e zoonoses."},
  7:{titulo:"Agosto Verde Claro Pet 🟢",descricao:"Leishmaniose, FIV e FELV."},
  8:{titulo:"Setembro Vermelho Pet 🔴",descricao:"Saúde cardiovascular."},
  9:{titulo:"Outubro Rosa Pet 🌸",descricao:"Câncer de mama em fêmeas."},
  10:{titulo:"Novembro Azul Pet 🔵",descricao:"Câncer de próstata."},
  11:{titulo:"Dezembro Verde Pet 🟢",descricao:"Combate ao abandono e fogos."}
};

/* 🔔 Popup mensal */
function iniciarPopupMes() {
  const popup = document.getElementById("popupMes");
  if (!popup) return;

  const mes = new Date().getMonth();
  const chave = `popup-mes-${mes}`;

  if (localStorage.getItem(chave)) return;

  document.getElementById("popupTitulo").innerText = mesesPet[mes].titulo;
  document.getElementById("popupTexto").innerText = mesesPet[mes].descricao;

  popup.classList.remove("hidden");

  window.fecharPopup = () => {
    localStorage.setItem(chave,"visto");
    popup.classList.add("hidden");
  };
}


/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  iniciarHeroImage();
  carregarDepoimentos();
  iniciarPopupMes(); // só age se existir popup na página
});


