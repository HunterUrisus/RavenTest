import "../styles/Item.css";

// Cambiar las imagenes por un fetch de la serie y num

const Item = ({ questionNumber, serie, num, cantOpciones, onAnswer }) => {

  const base_path = `/test/${serie}/${num}`;

  return (
    <div className="item">
      <div className="title">
        <h3>Pregunta {questionNumber}:</h3>
      </div>
      <div className="item-container">
        <div className="question-box">
          <img src={`${base_path}/matriz.jpg`}></img>
        </div>
        <div className="answers-box">
          {Array.from({ length: cantOpciones }, (_, index) => (
            <div key={index}>
              <button onClick={() => onAnswer(index)}>
                Opción {index + 1}
                <img src={`${base_path}/${serie}${num}_R${index + 1}.jpg`}></img>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Item;
