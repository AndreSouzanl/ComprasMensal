import { useState, useRef, useEffect } from "react";
import Produto from "../../components/produto/produto";
import "./pagina.css";
import { v4 as uuid } from "uuid";
export default function Pagina() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [editando, setEditando] = useState(false);

  const formRef = useRef(null);

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

  // Adiciona o produto na lista
  function AddProdutos() {
    if (nome === "" || quantidade === "") {
      alert("Os campos nome e quantidade são obrigatórios.");
      return;
    }
    // Já existe um produto com este nome (ignorando letras maiúsculas/minúsculas).
    // mantem a ordenação em ordem alfabetica.
    if (produtos.some((p) => p.nome.toLowerCase() === nome.toLowerCase())) {
      alert("Já existe um produto com este nome.");
      return;
    }

    const novoProduto = {
      id: uuid(),
      nome,
      quantidade,
      edit: false,
    };

    const novaLista = [...produtos, novoProduto];
    novaLista.sort((a, b) => a.nome.localeCompare(b.nome));
    setProdutos(novaLista);
    setNome("");
    setQuantidade("");
  }

  //deleta um produto
  function DeleteProduto(id) {
    const novoProduto = produtos.filter((produto) => {
      return produto.id !== id;
    });
    setProdutos(novoProduto);
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

  return (
    <>
      <div className="container-Produto">
        <h1>Lista de Compras</h1>

        <div className="formInput" ref={formRef}>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input"
            type="text"
            name="nome"
            id="nome"
            placeholder="Informe o nome do Produto"
          />

          <input
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="input"
            type="text"
            name="quantidade"
            id="quantidade"
            placeholder="Informe a quantidade (kg, g, ptc. un)"
          />

          <button
            className={`produto-btn ${editando ? "editar" : "adicionar"}`}
            onClick={editando ? SalvarEdicao : AddProdutos}
          >
            {editando ? "Salvar Produto" : "Adicionar Produto"}
          </button>

          <div>
            {produtos.map((produto) => {
              return (
                <Produto
                  key={produto.id}
                  id={produto.id}
                  nome={produto.nome}
                  quantidade={produto.quantidade}
                  onClickDelete={DeleteProduto}
                  onClickEdit={EditProduto}
                />
              );
            })}
          </div>
        </div>
        <p>Desensolvido por: André Souza - 2025</p>
      </div>
    </>
  );
}
