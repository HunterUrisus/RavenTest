import { useState } from "react";
import Test from "./Test.jsx";
import Form from "./Form.jsx";
import TestResults from "./TestResults.jsx";

const TestPage = () => {
  const [stage, setStage] = useState("form");
  const [actualUser, setActualUser] = useState(null);
  const [testSelected, setTestSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [totalPreguntas, setTotalPreguntas] = useState(0);

  const handleUserCreated = (userData, testSelected) => {
    setActualUser(userData);
    setTestSelected(testSelected);
    setStage("test");
  };

  const handleFinish = (result, totalPreguntas2) => {
    setResults(result);
    setTotalPreguntas(totalPreguntas2);
    setStage("results");
    console.log("Resultados recibidos en TestPage:", totalPreguntas2);
  };

  return (
    <div className="page-content">
      {stage === "form" && <Form onSuccess={handleUserCreated} />}
      {stage === "test" && (
        <Test
          user={actualUser}
          testSelected={testSelected}
          onFinish={(result, totalPreguntas) => handleFinish(result, totalPreguntas)}
        />
      )}
      {stage === "results" && (
        <TestResults
          user = {actualUser}
          resultado={results}
          totalPreguntas={totalPreguntas || 30} // O pásale el largo del array de items
          onReset={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default TestPage;
