const URL_BASE = "http://localhost:3000";

const converterData = (dataString) => {
  const [ano, mes, dia] = dataString.split("-");
  return new Date(Date.UTC(ano, mes - 1, dia));
};

const api = {
  async buscarideias() {
    try {
      const response = await axios.get(`${URL_BASE}/ideias`);
      const ideias = await response.data;
      return ideias.map((ideia) => {
        return {
          ...ideia,
          data: new Date(ideia.data),
        };
      });
    } catch {
      alert("Erro ao buscar ideias");
      throw error;
    }
  },

  async salvarideia(ideia) {
    try {
      const data = converterData(ideia.data);
      const response = await axios.post(`${URL_BASE}/ideias`, {
        ...ideia,
        data: data.toISOString(),
      });
      return await response.data;
    } catch {
      alert("Erro ao salvar ideia");
      throw error;
    }
  },

  async buscarideiaPorId(id) {
    try {
      const response = await axios.get(`${URL_BASE}/ideias/${id}`);
      const ideia = await response.data;

      return {
        ...ideia,
        data: new Date(ideia.data),
      };
    } catch {
      alert("Erro ao buscar ideia");
      throw error;
    }
  },

  async editarideia(ideia) {
    try {
      const response = await axios.put(`${URL_BASE}/ideias/${ideia.id}`, ideia);
      return await response.data;
    } catch {
      alert("Erro ao editar ideia");
      throw error;
    }
  },

  async excluirideia(id) {
    try {
      await axios.delete(`${URL_BASE}/ideias/${id}`);
    } catch {
      alert("Erro ao excluir um ideia");
      throw error;
    }
  },

  async buscarideiaPorTermo(palavra) {
    try {
      const termolower = palavra.toLowerCase();
      const ideias = await this.buscarideias();
      const ideiasFiltrados = ideias.filter((ideia) => {
        return (
          ideia.conteudo.toLowerCase().includes(termolower) ||
          ideia.autoria.toLowerCase().includes(termolower)
        );
      });
      return ideiasFiltrados;
    } catch {
      alert("erro ao filtrar conteudo na API");
    }
  },

  async atualizarFavorito(id, favorito) {
    try {
      const response = await axios.patch(`${URL_BASE}/ideias/${id}`, {
        favorito,
      });
      return await response.data;
    } catch {
      alert("Erro ao editar ideia");
      throw error;
    }
  },
};

export default api;
