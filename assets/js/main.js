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


/* ================= SCRIPT DATAS COMEMORATIVAS ================= */
document.addEventListener("DOMContentLoaded", () => {

  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;

  function iniciarEfeito(emoji, quantidade) {
    for (let i = 0; i < quantidade; i++) {
      const item = document.createElement("div");
      item.className = emoji === "❄" ? "snowflake" : "effect-item";
      item.textContent = emoji;
      item.style.left = Math.random() * 100 + "vw";
      item.style.fontSize = Math.random() * 14 + 12 + "px";
      item.style.animationDuration = Math.random() * 5 + 6 + "s";
      document.body.appendChild(item);
    }
  }

  if (dia === 25 && mes === 12) iniciarEfeito("❄", 50);
  if (dia === 1 && mes === 1) iniciarEfeito("🎉", 45);
  if (dia === 31 && mes === 3) iniciarEfeito("🥚", 40);
  if (dia === 31 && mes === 10) iniciarEfeito("🎃", 40);

});

/* ================= POPUP DATAS COMEMORATIVAS ================= */
document.addEventListener("DOMContentLoaded", () => {

  const eventos = [
    {
      id: "natal",
      inicio: "12-24",
      fim: "12-25",
      icon: "🎄",
      title: "Feliz Natal!",
      message: "Que este Natal seja repleto de amor, cuidado e momentos especiais ao lado de quem você ama — incluindo seus pets 🐾❤️"
    },
    {
      id: "ano-novo",
      inicio: "12-31",
      fim: "01-01",
      icon: "🎆",
      title: "Feliz Ano Novo!",
      message: "Que o novo ano traga saúde, alegria e muitos momentos felizes com seu pet 🐾✨"
    },
    {
      id: "pascoa",
      inicio: "03-25",
      fim: "04-01",
      icon: "🐣",
      title: "Feliz Páscoa!",
      message: "Desejo uma Páscoa cheia de carinho, renovação e cuidado com quem faz sua vida mais feliz 🐾💛"
    },
    {
      id: "halloween",
      inicio: "10-31",
      fim: "10-31",
      icon: "🎃",
      title: "Feliz Halloween!",
      message: "Um Halloween cheio de diversão, cuidado e segurança para você e seu pet 🐾🎃"
    }
  ];

  const hoje = new Date();
  const hojeMMDD =
    String(hoje.getMonth() + 1).padStart(2, '0') + "-" +
    String(hoje.getDate()).padStart(2, '0');

  const popup = document.getElementById("popupSazonal");
  if (!popup) return;

  eventos.forEach(evento => {
    const visto = localStorage.getItem("popup_" + evento.id);

    if (!visto && dentroDoPeriodo(hojeMMDD, evento.inicio, evento.fim)) {
      abrirPopup(evento);
    }
  });

  function abrirPopup(evento) {
    document.getElementById("popupIcon").textContent = evento.icon;
    document.getElementById("popupTitle").textContent = evento.title;
    document.getElementById("popupMessage").textContent = evento.message;

    popup.classList.remove("hidden");
    popup.dataset.eventoId = evento.id;
  }

});

function fecharPopup() {
  const popup = document.getElementById("popupSazonal");
  if (!popup) return;

  const eventoId = popup.dataset.eventoId;
  localStorage.setItem("popup_" + eventoId, "true");
  popup.classList.add("hidden");
}

function dentroDoPeriodo(hoje, inicio, fim) {
  if (inicio <= fim) {
    return hoje >= inicio && hoje <= fim;
  }
  return hoje >= inicio || hoje <= fim;
}

/* ================= FLOCO DE NEVE CANVAS ================= */
document.addEventListener("DOMContentLoaded", () => {

  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;

  // 🎯 RODAR SOMENTE EM 02/01
  if (!(dia === 25 && mes === 12)) return;

  const canvas = document.getElementById("snow");
  if (!canvas) return;

  canvas.classList.remove("hidden");

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let flakes = [];

  function criarFloco() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      d: Math.random() + 1
    };
  }

  const TOTAL_FLOCOS = 80;

  for (let i = 0; i < TOTAL_FLOCOS; i++) {
    flakes.push(criarFloco());
  }

  let angle = 0;

  function atualizarNeve() {
    angle += 0.01;
    for (let i = 0; i < flakes.length; i++) {
      let f = flakes[i];
      f.y += Math.pow(f.d, 2) + 0.5;
      f.x += Math.sin(angle) * 1.5;

      if (f.y > canvas.height) {
        flakes[i] = criarFloco();
        flakes[i].y = 0;
      }
    }
  }

  function desenharNeve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();

    for (let i = 0; i < flakes.length; i++) {
      let f = flakes[i];
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }

    ctx.fill();
    atualizarNeve();
    requestAnimationFrame(desenharNeve);
  }

  desenharNeve();

});
