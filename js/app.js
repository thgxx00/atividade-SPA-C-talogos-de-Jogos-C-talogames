
const app = document.getElementById("app");

let jogos = [];

// Capas associadas aos nomes dos jogos.
// Adicione outros nomes aqui quando quiser ampliar a lista.
const capas = {
    "gta v": "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg",
    "spider-man": "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg",
    "god of war": "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_600x900.jpg",
    "resident evil 4": "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900.jpg",
    "dark souls remastered": "https://cdn.cloudflare.steamstatic.com/steam/apps/570940/library_600x900.jpg",
    "devil may cry 5": "https://cdn.cloudflare.steamstatic.com/steam/apps/601150/library_600x900.jpg",
    "red dead redemption 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
    "resident evil 7 biohazard": "https://cdn.cloudflare.steamstatic.com/steam/apps/418370/library_600x900.jpg"
};

const capaPadrao = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="420">
      <rect width="100%" height="100%" fill="#142338"/>
      <text x="50%" y="46%" text-anchor="middle"
        font-size="75" fill="#5b8fbd">🎮</text>
      <text x="50%" y="62%" text-anchor="middle"
        font-family="Arial" font-size="24" fill="#dceafa">
        Sem capa
      </text>
    </svg>
  `);

function normalizarNome(nome) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function buscarCapa(nome) {
  const nomeFormatado = normalizarNome(nome);
  return capas[nomeFormatado] || capaPadrao;
}

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entidades[caractere];
  });
}

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = data.split("-");
  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarPagina(pagina) {
  if (pagina === "inicio") {
    mostrarInicio();
  } else if (pagina === "cadastro") {
    mostrarCadastro();
  } else if (pagina === "lista") {
    mostrarLista();
  } else if (pagina === "sobre") {
    mostrarSobre();
  }
}

function mostrarInicio() {
  app.innerHTML = `
    <section class="hero">
      <h1>Bem-vindo ao <span>Cátalogames</span></h1>

      <p>
        Organize sua coleção, cadastre seus jogos favoritos
        e encontre tudo em um só lugar.
      </p>

      <div class="acoes">
        <button class="botao"
          onclick="mostrarPagina('cadastro')">
          + Cadastrar jogo
        </button>

        <button class="botao botao-secundario"
          onclick="mostrarPagina('lista')">
          Ver jogos cadastrados
        </button>
      </div>
    </section>
  `;
}

function mostrarCadastro() {
  app.innerHTML = `
    <section class="secao">
      <h1 class="titulo-secao">Cadastrar jogo</h1>
      <p class="subtitulo">
        Preencha os dados para adicionar um jogo à sua coleção.
      </p>

      <form id="formJogo" class="formulario">
        <div class="campo campo-completo">
          <label for="nome">Nome do jogo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Ex: God of War"
            required
          >
        </div>

        <div class="campo">
          <label for="genero">Gênero</label>
          <input
            type="text"
            id="genero"
            name="genero"
            placeholder="Ex: Ação e aventura"
            required
          >
        </div>

        <div class="campo">
          <label for="plataforma">Plataforma</label>
          <input
            type="text"
            id="plataforma"
            name="plataforma"
            placeholder="Ex: PC, PS5, Xbox"
            required
          >
        </div>

        <div class="campo campo-completo">
          <label for="data">Data de lançamento</label>
          <input
            type="date"
            id="data"
            name="data"
            required
          >
        </div>

        <button type="submit" class="botao">
          Cadastrar jogo
        </button>
      </form>

      <p id="mensagem" class="mensagem"></p>
    </section>
  `;

  document.getElementById("formJogo")
    .addEventListener("submit", cadastrarJogo);
}

function cadastrarJogo(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const genero = document.getElementById("genero").value.trim();
  const plataforma = document.getElementById("plataforma").value.trim();
  const data = document.getElementById("data").value;

  if (!nome || !genero || !plataforma || !data) {
    return;
  }

  const jogo = {
    id: Date.now(),
    nome,
    genero,
    plataforma,
    data,
    capa: buscarCapa(nome),
    favorito: false
  };

  jogos.push(jogo);

  mostrarLista();
}

function mostrarLista() {
  app.innerHTML = `
    <section class="secao">
      <div class="topo-lista">
        <div>
          <h1 class="titulo-secao">Jogos cadastrados</h1>
          <p class="subtitulo">
            Confira sua coleção e marque seus favoritos.
          </p>
        </div>

        <p class="contador">
          Total: <strong>${jogos.length}</strong> jogo(s)
        </p>
      </div>

      ${
        jogos.length === 0
          ? `
            <div class="vazio">
              <p>🎮 Você ainda não cadastrou nenhum jogo.</p>
              <br>
              <button class="botao"
                onclick="mostrarPagina('cadastro')">
                Cadastrar primeiro jogo
              </button>
            </div>
          `
          : `
            <div class="tabela-container">
              <table>
                <thead>
                  <tr>
                    <th>Capa</th>
                    <th>Nome</th>
                    <th>Gênero</th>
                    <th>Plataforma</th>
                    <th>Data de lançamento</th>
                    <th>Favorito</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  ${jogos.map(jogo => `
                    <tr>
                      <td>
                        <img
                          src="${jogo.capa}"
                          alt="Capa de ${escaparHTML(jogo.nome)}"
                          class="capa-jogo"
                          onerror="this.onerror=null;this.src='${capaPadrao}'"
                        >
                      </td>

                      <td>${escaparHTML(jogo.nome)}</td>
                      <td>${escaparHTML(jogo.genero)}</td>
                      <td>${escaparHTML(jogo.plataforma)}</td>
                      <td>${formatarData(jogo.data)}</td>

                      <td>
                        <button
                          class="favorito"
                          onclick="alternarFavorito(${jogo.id})"
                          title="Favoritar jogo"
                          aria-label="Favoritar ${escaparHTML(jogo.nome)}"
                        >
                          ${jogo.favorito ? "★" : "☆"}
                        </button>
                      </td>

                      <td>
                        <button
                          class="botao-acao botao-excluir"
                          onclick="excluirJogo(${jogo.id})"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `
      }
    </section>
  `;
}

function alternarFavorito(id) {
  const jogo = jogos.find(j => j.id === id);

  if (jogo) {
    jogo.favorito = !jogo.favorito;
    mostrarLista();
  }
}

function excluirJogo(id) {
  const confirmar = confirm("Deseja realmente excluir este jogo?");

  if (!confirmar) return;

  jogos = jogos.filter(jogo => jogo.id !== id);
  mostrarLista();
}

function mostrarSobre() {
  app.innerHTML = `
    <section class="secao">
      <h1 class="titulo-secao">Sobre o Cátalogames</h1>

      <div class="sobre-texto">
        <p>
          O Cátalogames é um catálogo digital desenvolvido
          para organizar jogos de diferentes gêneros e plataformas.
        </p>

        <p>
          A aplicação permite cadastrar jogos, visualizar suas
          informações, favoritar títulos e excluir itens da coleção.
        </p>

        <p>
          As capas são associadas automaticamente aos nomes
          reconhecidos pelo catálogo.
        </p>
      </div>
    </section>
  `;
}

// Página inicial ao abrir o site
mostrarInicio();
