import api from "./api.js";

const ui = {
  async preencherFormulario(ideiaId) {
    const ideia = await api.buscarideiaPorId(ideiaId);
    document.getElementById("ideia-id").value = ideia.id;
    document.getElementById("ideia-conteudo").value = ideia.conteudo;
    document.getElementById("ideia-autoria").value = ideia.autoria;
    document.getElementById("ideia-data").value = ideia.data
      .toISOString()
      .split("T")[0];
    document.getElementById("form-container").scrollIntoView();
  },

  limparFormulario() {
    document.getElementById("ideia-form").reset();
  },

  async renderizarideias(ideiasFiltrados = null) {
    const listaideias = document.getElementById("lista-ideias");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    listaideias.innerHTML = "";

    try {
      let ideiasARenderizar;

      if (ideiasFiltrados) {
        ideiasARenderizar = ideiasFiltrados;
      } else {
        ideiasARenderizar = await api.buscarideias();
      }

      if (ideiasARenderizar.length === 0) {
        mensagemVazia.style.display = "block";
      } else {
        mensagemVazia.style.display = "none";
        ideiasARenderizar.forEach(ui.adicionarideiaNaLista);
      }
    } catch {
      alert("Erro ao renderizar ideias");
    }
  },

  adicionarideiaNaLista(ideia) {
    const listaideias = document.getElementById("lista-ideias");
    const li = document.createElement("li");
    li.setAttribute("data-id", ideia.id);
    li.classList.add("li-ideia");

    const iconeAspas = document.createElement("img");
    iconeAspas.src = "assets/imagens/aspas-azuis.png";
    iconeAspas.alt = "Aspas azuis";
    iconeAspas.classList.add("icone-aspas");

    const ideiaConteudo = document.createElement("div");
    ideiaConteudo.textContent = ideia.conteudo;
    ideiaConteudo.classList.add("ideia-conteudo");

    const ideiaAutoria = document.createElement("div");
    ideiaAutoria.textContent = ideia.autoria;
    ideiaAutoria.classList.add("ideia-autoria");

    const ideiaData = document.createElement("div");
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dataFormatada = ideia.data.toLocaleDateString("pt-BR", options);
    ideiaData.textContent = dataFormatada;
    ideiaData.classList.add("ideia-data");

    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = () => ui.preencherFormulario(ideia.id);

    const iconeEditar = document.createElement("img");
    iconeEditar.src = "assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar";
    botaoEditar.appendChild(iconeEditar);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirideia(ideia.id);
        ui.renderizarideias();
      } catch (error) {
        alert("Erro ao excluir ideia");
      }
    };

    const botaoFavoritar = document.createElement("button");
    botaoFavoritar.classList.add("botao-favorito");
    botaoFavoritar.onclick = async () => {
      try {
        await api.atualizarFavorito(ideia.id, !ideia.favorito);
        ui.renderizarideias();
      } catch (error) {
        alert("erro ao favoritar");
      }
    };

    const iconeFavoritar = document.createElement("img");
    iconeFavoritar.src = ideia.favorito
      ? "assets/imagens/icone-favorito.png"
      : "assets/imagens/icone-favorito_outline.png";
    iconeFavoritar.alt = "Favoritar";
    botaoFavoritar.appendChild(iconeFavoritar);

    const iconeExcluir = document.createElement("img");
    iconeExcluir.src = "assets/imagens/icone-excluir.png";
    iconeExcluir.alt = "Excluir";
    botaoExcluir.appendChild(iconeExcluir);

    const icones = document.createElement("div");
    icones.classList.add("icones");
    icones.appendChild(botaoEditar);
    icones.appendChild(botaoExcluir);
    icones.appendChild(botaoFavoritar);

    li.appendChild(iconeAspas);
    li.appendChild(ideiaConteudo);
    li.appendChild(ideiaAutoria);
    li.appendChild(ideiaData);
    li.appendChild(icones);

    listaideias.appendChild(li);
  },
};

export default ui;
