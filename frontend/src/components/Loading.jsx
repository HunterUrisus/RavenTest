import "../styles/LoadingScreen.css";

const LoadingScreen = ({ text = "Cargando datos..." }) => {
  return (
    <div className="loading-container fade-in">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default LoadingScreen;