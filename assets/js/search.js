document.addEventListener("DOMContentLoaded", () => {

  const openBtn = document.getElementById("openSearch");
  const closeBtn = document.getElementById("closeSearch");
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  if (!openBtn) return;

  openBtn.onclick = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    input.focus();
  };

  closeBtn.onclick = () => fechar();
  modal.onclick = e => e.target === modal && fechar();

  function fechar() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    input.value = "";
    results.innerHTML = "";
  }

  const pages = [
    { url: "index.html", name: "Página Inicial" },
    { url: "dicas.html", name: "Dicas para Pets" },
    { url: "faq.html", name: "FAQ" },
    { url: "calendario.html", name: "Calendário Pet" },
    { url: "sobre.html", name: "Sobre Simone Martins" }
  ];

  input.addEventListener("input", async () => {
    const query = input.value.toLowerCase();
    results.innerHTML = "";

    if (query.length < 3) return;

    for (const page of pages) {
      try {
        const res = await fetch(page.url);
        const html = await res.text();

        const temp = document.createElement("div");
        temp.innerHTML = html;

        const text = temp.innerText.toLowerCase();

        if (text.includes(query)) {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="${page.url}"
               class="block p-3 rounded-lg hover:bg-gray-100 transition">
              🔎 <strong>${page.name}</strong><br>
              <span class="text-sm text-gray-500">
                Palavra encontrada nesta página
              </span>
            </a>
          `;
          results.appendChild(li);
        }

      } catch (err) {
        console.warn("Erro ao buscar:", page.url);
      }
    }

    if (!results.children.length) {
      results.innerHTML = `<li class="text-gray-500">Nenhum resultado encontrado</li>`;
    }
  });

});
