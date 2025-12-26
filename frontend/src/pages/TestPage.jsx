import { useState } from "react";
import Test from "./Test.jsx";
import Form from "./Form.jsx";
import Results from "./Results.jsx";

const TestPage = () => {
  const [stage, setStage] = useState("form");
  const [actualUser, setActualUser] = useState(null);
  const [testSelected, setTestSelected] = useState(null);
  const [results, setResults] = useState(null);

  const handleUserCreated = (userData, testSelected) => {
    setActualUser(userData);
    setTestSelected(testSelected);
    setStage("test");
  };

  const handleFinish = (result) => {
    setResults(result);
    setStage("results")
  };

  return (
    <div className="page-content">
      {stage === "form" && <Form onSuccess={handleUserCreated} />}
      {stage === "test" && (
        <Test
          user={actualUser}
          testSelected={testSelected}
          onFinish={handleFinish}
        />
      )}
      {stage === "results" && <Results results={results} />}
    </div>
  );
};

export default TestPage;
