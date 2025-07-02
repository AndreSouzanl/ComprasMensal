import { useState, useRef, useEffect } from "react";
import Produto from "../../components/produto/produto";
import "./pagina.css";
import { v4 as uuid } from "uuid";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { IconHome, IconMinus, IconPlus } from "@tabler/icons-react";
import ExibirMensagem from "../../components/exibir-mensagem/exibir-mensagem.jsx";

export default function Pagina() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [paginaAtual, setPaginaAtual] = useState(1);

  const formRef = useRef(null);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ texto: "", tipo: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);
  // Carrega as tarefas do localStorage quando o componente monta
  useEffect(() => {
    const ProdutosSalvos = localStorage.getItem("produtos");
    if (ProdutosSalvos) {
      setProdutos(JSON.parse(ProdutosSalvos));
    }
  }, []);
  // Salva as tarefas no localStorage sempre que elas mudam
  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  // criando paginação
  const itensPorPagina = 4;
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPaginados = produtos.slice(inicio, fim);

  // Adiciona o produto na lista
  function AddProdutos() {
    if (nome === "" || quantidade === "") {
      setMensagem({
        texto: "Os campos nome e quantidade são obrigatórios.",
        tipo: "aviso",
      });
      return;
    }
    // Já existe um produto com este nome (ignorando letras maiúsculas/minúsculas).
    if (produtos.some((p) => p.nome.toLowerCase() === nome.toLowerCase())) {
      setMensagem({
        texto: "Já existe um produto com este nome.",
        tipo: "aviso",
      });
      return;
    }

    const novoProduto = {
      id: uuid(),
      nome,
      quantidade,
      edit: false,
    };

    const novaLista = [...produtos, novoProduto];
    // mantem a ordenação em ordem alfabetica.
    novaLista.sort((a, b) => a.nome.localeCompare(b.nome));
    setProdutos(novaLista);
    setNome("");
    setQuantidade("");

    setMensagem({ texto: "Produto Cadastrado com Sucesso!", tipo: "sucesso" });
  }

  //deleta um produto
  function DeleteProduto(id) {
    const novoProduto = produtos.filter((produto) => {
      return produto.id !== id;
    });
    setProdutos(novoProduto);
    setMensagem({ texto: "Produto Removido Com Sucesso!", tipo: "erro" });
  }
  // prepara para edição jogando itens serem editados nos inputs
  function EditProduto(id) {
    const produtoEditado = produtos.find((p) => p.id === id);

    if (produtoEditado) {
      // Preenche os campos de edição
      setNome(produtoEditado.nome);
      setQuantidade(produtoEditado.quantidade);
      setEditando(true); // Marca como edição

      // Atualiza a lista de produtos para marcar qual está em edição
      const produtosAtualizados = produtos.map((p) =>
        p.id === id ? { ...p, edit: true } : { ...p, edit: false }
      );
      setProdutos(produtosAtualizados);
      // Scroll suave até os inputs
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }
  // finaliza a edição atraves do botao salva edicao
  function SalvarEdicao() {
    const produtoEditando = produtos.find((p) => p.edit);

    if (produtoEditando) {
      const produtosAtualizados = produtos.map((produto) =>
        produto.id === produtoEditando.id
          ? { ...produto, nome, quantidade, edit: false }
          : produto
      );
      //mantem ordem alfabetica apos edição
      produtosAtualizados.sort((a, b) => a.nome.localeCompare(b.nome));
      setProdutos(produtosAtualizados);
      setEditando(false); // Finaliza edição
      setNome("");
      setQuantidade("");
    }
  }

  function checkProduto(id) {
    const atualizados = produtos.map((p) =>
      p.id === id ? { ...p, checado: !p.checado } : p
    );
    setProdutos(atualizados);
  }

  return (
    <>
      <div className="container-main">
        <Header
          icone={<IconHome size={28} />}
          titulo="Minha Lista de Compras"
        />

        <ExibirMensagem mensagem={mensagem} />

        <main>
          <div className="container-Produto">
            <div className="formInput" ref={formRef}>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input"
                type="text"
                name="nome"
                id="nome"
                placeholder="Nome Produto"
              />

              <input
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="input"
                type="text"
                name="quantidade"
                id="quantidade"
                placeholder="Quantidade +  (kg, g, ptc. un)"
              />

              <button
                className={`produto-btn ${editando ? "editar" : "adicionar"}`}
                onClick={editando ? SalvarEdicao : AddProdutos}
              >
                {editando ? "Salvar Produto" : "Adicionar Produto"}
              </button>

              <div>
                {produtos.length === 0 ? (
                  <p className="mensagem-vazia">Nenhum Produto Cadastrado.</p>
                ) : (
                  produtosPaginados.map((produto) => {
                    return (
                      <Produto
                        key={produto.id}
                        id={produto.id}
                        nome={produto.nome}
                        checado={produto.checado}
                        quantidade={produto.quantidade}
                        onClickDelete={DeleteProduto}
                        onClickEdit={EditProduto}
                       onCheck={checkProduto}
                      />
                    );
                  })
                )}
              </div>
              <div className="paginacao">
                <button
                  onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                  disabled={paginaAtual === 1}
                >
                  <IconMinus size={20} />
                </button>
                <span className="texto">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  onClick={() =>
                    setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
                  }
                  disabled={paginaAtual === totalPaginas}
                >
                  <IconPlus />
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer texto="Desenvolvido por: André souza Junho 2025" />
      </div>
    </>
  );
}
