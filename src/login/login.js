import { Link } from "react-router-dom";
import ValidateLogin from "./validateLogin/ValidateLogin";
import Styles from "../styles/Styles";

function Login({ setIsLoggedIn }) {
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ minWidth: "320px" }}>
        <h2 className="app-name mb-4">LABWISE</h2>
        <Styles />
        <ValidateLogin setIsLoggedIn={setIsLoggedIn} />
        <div className="text-center">
          <span className="mx-2">·</span>
          <div className="text-center mt-3"></div>
          <a href="#" className="text-decoration-none">
            Forgot Password?
          </a>
          <hr className="my-4" />
          <div />
          <div className="text-center mt-1"></div>
          <Link to="/signup">
            <button type="button" className="btn btn-success">
              Create new account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
