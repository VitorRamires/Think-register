import ui from "./ui.js";
import api from "./api.js";

const ideiasSet = new Set();

async function addChaveAoideia() {
  try {
    const ideias = await api.buscarideias();
    ideias.forEach(({ conteudo, autoria }) => {
      const chaveNovoideia = `${conteudo.trim().toLowerCase()}-${autoria
        .trim()
        .toLowerCase()}`;
      ideiasSet.add(chaveNovoideia);
    });
  } catch (error) {
    alert("erro ao adicionar chave no ideia");
  }
}

const regexConteudo = /^[A-Za-z\s]{10,}$/;
const regexAutoria = /^[A-Za-z]{3,15}$/;

function removerEspaços(string) {
  return string.replaceAll(/\s+/g, "");
}

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo);
}

function validarAutoria(autoria) {
  return regexAutoria.test(autoria);
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarideias();
  addChaveAoideia();

  const formularioideia = document.getElementById("ideia-form");
  const botaoCancelar = document.getElementById("botao-cancelar");
  const inputBusca = document.getElementById("campo-busca");

  formularioideia.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(event) {
  event.preventDefault();
  const id = document.getElementById("ideia-id").value;
  const conteudo = document.getElementById("ideia-conteudo").value;
  const autoria = document.getElementById("ideia-autoria").value;
  const data = document.getElementById("ideia-data").value;
  const conteudoSemEspaços = removerEspaços(conteudo);
  const autoriaSemEspaços = removerEspaços(autoria);

  if (!validarConteudo(conteudoSemEspaços)) {
    alert("Apenas letras e espaços de no minimo 10 caracteres");
    return;
  }

  if (!validarAutoria(autoriaSemEspaços)) {
    alert("Apenas letras, entre 3 a 15 caracteres e sem espaços");
    return;
  }

  if (!validarData(data)) {
    alert("Cadastro de datas futuras não permitido");
    return;
  }

  const chaveNovoideia = `${conteudo.trim().toLowerCase()}-${autoria
    .trim()
    .toLowerCase()}`;

  if (ideiasSet.has(chaveNovoideia)) {
    alert("ideia já existe");
    return;
  }

  try {
    if (id) {
      await api.editarideia({ id, conteudo, autoria, data });
    } else {
      await api.salvarideia({ conteudo, autoria, data });
    }
    ui.renderizarideias();
  } catch {
    alert("Erro ao salvar ideia");
  }
}

function manipularCancelamento() {
  ui.limparFormulario();
}

async function manipularBusca() {
  const termoBusca = document.querySelector("#campo-busca").value;
  try {
    const ideiasFiltrados = await api.buscarideiaPorTermo(termoBusca);
    ui.renderizarideias(ideiasFiltrados);
  } catch (error) {}
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInserida = new Date(data);

  return dataInserida <= dataAtual;
}
