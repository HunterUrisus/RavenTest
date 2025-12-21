import { Outlet } from "react-router-dom";
import "../styles/root.css";

function Root() {
  return <PageRoot />;
}

function PageRoot() {
  return (
    <div className="page-root">
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
