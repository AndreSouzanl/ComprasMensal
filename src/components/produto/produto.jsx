import { IconTrash, IconEdit, IconCheck } from "@tabler/icons-react";
import "./produto.css";

export default function Produto(props) {
  return (
    <tr>
      <td className={props.checado ? "riscado" : ""}>{props.nome}</td>
      <td className={props.checado ? "riscado" : ""}>{props.quantidade}</td>
      <td>
        <div className="produto-acoes">
          <IconEdit
            size={20}
            color="green"
            onClick={() => props.onClickEdit(props.id)}
          />
          <IconTrash
            size={20}
            stroke={1}
            color="red"
            onClick={() => props.onClickDelete(props.id)}
          />
          <IconCheck
            size={20}
            stroke={1}
            color="#f39c12"
            onClick={() => props.onCheck(props.id)}
          />
        </div>
      </td>
    </tr>
  );
}
