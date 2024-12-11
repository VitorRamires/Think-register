import ui from "./ui.js";
import api from "./api.js";

const pensamentosSet = new Set();

async function addChaveAoPensamento() {
  try {
    const pensamentos = await api.buscarPensamentos();
    pensamentos.forEach(({ conteudo, autoria }) => {
      const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria
        .trim()
        .toLowerCase()}`;

      pensamentosSet.add(chaveNovoPensamento);
    });
  } catch (error) {
    alert("erro ao adicionar chave no pensamento");
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
  ui.renderizarPensamentos();
  addChaveAoPensamento();

  const formularioPensamento = document.getElementById("pensamento-form");
  const botaoCancelar = document.getElementById("botao-cancelar");
  const inputBusca = document.getElementById("campo-busca");

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(event) {
  event.preventDefault();
  const id = document.getElementById("pensamento-id").value;
  const conteudo = document.getElementById("pensamento-conteudo").value;
  const autoria = document.getElementById("pensamento-autoria").value;
  const data = document.getElementById("pensamento-data").value;
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

  const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria
    .trim()
    .toLowerCase()}`;

  if (pensamentosSet.has(chaveNovoPensamento)) {
    alert("pensamento já existe");
    return;
  }

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, data });
    } else {
      await api.salvarPensamento({ conteudo, autoria, data });
    }
    ui.renderizarPensamentos();
  } catch {
    alert("Erro ao salvar pensamento");
  }
}

function manipularCancelamento() {
  ui.limparFormulario();
}

async function manipularBusca() {
  const termoBusca = document.querySelector("#campo-busca").value;
  console.log(termoBusca);

  try {
    const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca);
    ui.renderizarPensamentos(pensamentosFiltrados);
  } catch (error) {}
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInserida = new Date(data);

  return dataInserida <= dataAtual;
}
