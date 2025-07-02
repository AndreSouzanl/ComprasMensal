import "./header.css";
export default function Header(props) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>{props.icone}</h1>
        <h2>{props.titulo}</h2>
      </div>
    </header>
  );
}

