import "./footer.css";

export default function Footer(props) {
  return (
    <div className="container-footer">
      <p>{props.texto}</p>
    </div>
  );
}
