import { useEffect, useState } from "react";
import "./exibir-mensagem.css";
export default function ExibirMensagem(props) {

  const [visivel, setVisivel] = useState(false);

   useEffect(() => {
    if (props.mensagem.texto) {
      setVisivel(true);
      const timer = setTimeout(() => setVisivel(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [props.mensagem]);

  if (!props.mensagem.texto) return null;
 return(
      <div className={`container-mensagem ${props.mensagem.tipo} ${!visivel ? "escondida" : ""}`}>
      <p className="mensagem">{props.mensagem.texto}</p>
    </div>
 )
 
}
