import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./produto.css";
export default function Produto(props) {
  return (
    <div className="container-lista-produto">
      <div className="tabela-container">
        <table className="tabela-produto">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Ações</th> {/* ← Nova coluna */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{props.nome}</td>
              <td>{props.quantidade}</td>
              <td>
                <div className="produto-acoes">
                  <IconEdit
                    size={20}
                    color="green"
                    onClick={(e) => props.onClickEdit(props.id)}
                  />
                  <IconTrash
                    size={20}
                    stroke={1}
                    color="red"
                    onClick={(e) => props.onClickDelete(props.id)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
