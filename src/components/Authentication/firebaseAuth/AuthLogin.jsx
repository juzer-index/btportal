import React, { useState } from "react";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginApiFunction } from "../../../utils/api";
import "./loginJSW.css";

const SignIn = () => {
  const [err, setError] = useState("");
  const [loading, setLoader] = useState(false);
  const [passwordshow, setpasswordshow] = useState(false);
  const [data, setData] = useState({});

  const { email, password } = data;
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };
  const Login = async (e) => {
    console.log("Login Function called");
    setLoader(true);
    e.preventDefault();
    try {
      const apiData = await loginApiFunction(data);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("APIDATA", apiData.data.adminUser);
        localStorage.setItem("user_id", apiData.data._id);
        localStorage.setItem("user_email", apiData.data.email);
        localStorage.setItem("user_token", apiData.data.token);
        localStorage.setItem("adminUser", apiData.data.adminUser?.designation);
        if (apiData.data.type === undefined || apiData.data.type === null) {
          localStorage.setItem("user_type_jsw", "admin");
        } else {
          localStorage.setItem("user_type_jsw", apiData.data.type);
        }
        localStorage.setItem("user_type", "admin");
        document.cookie = `jwtToken=${apiData.data.token}; Path=/; HttpOnly`;

        if (apiData.data.token && (await localStorage.getItem("user_token"))) {
          RouteChange();
        } else {
          setError("Something Went Wrong !!");
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
    setLoader(false);
  };
  let navigate = useNavigate();
  const RouteChange = () => {
    let path = `${process.env.PUBLIC_URL}/dashboard/`;
    navigate(path);
  };
  return (
    <div className="customerJSWLogin">
      <div>
        <div className="page">
          {/* <!-- CONTAINER OPEN --> */}

          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <div className="col-login mx-auto mt-7">
                <div className="text-center">
                  <img
                    src="logo.png"
                    style={{ width: "150px", marginTop: "-50px" }}
                    className=""
                    alt=""
                  />
                </div>
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title pb-5"> User Login</span>
                <div>
                  {err && <Alert variant="danger">{err}</Alert>}
                  <div className="wrap-input100 validate-input input-group">
                    <Link
                      to="#"
                      className="input-group-text bg-white text-muted"
                    >
                      <i
                        className="zmdi zmdi-email text-muted"
                        aria-hidden="true"
                      ></i>
                    </Link>
                    <Form.Control
                      className="input100 border-start-0 form-control ms-0"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={changeHandler}
                      required
                    />{" "}
                  </div>

                  <InputGroup
                    className="wrap-input100 validate-input"
                    id="Password-toggle"
                  >
                    <InputGroup.Text
                      id="basic-addon2"
                      className="bg-white p-0"
                      onClick={() => setpasswordshow(!passwordshow)}
                    >
                      <Link to="#" className="bg-white text-muted p-3">
                        <i
                          className={`zmdi ${
                            passwordshow ? "zmdi-eye" : "zmdi-eye-off"
                          } text-muted`}
                        ></i>
                      </Link>
                    </InputGroup.Text>
                    <Form.Control
                      className="input100 border-start-0 ms-0"
                      type={passwordshow ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={changeHandler}
                      required
                    />{" "}
                  </InputGroup>

                  <div className="container-login100-form-btn">
                    <Link
                      to="#"
                      onClick={Login}
                      className="login100-form-btn btn-primary"
                    >
                      Login
                      {loading ? (
                        <span
                          role="status"
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm ms-2"
                        ></span>
                      ) : (
                        ""
                      )}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* // <!-- CONTAINER CLOSED --> */}
        </div>
      </div>
    </div>
  );
};

SignIn.propTypes = {};

SignIn.defaultProps = {};

export default SignIn;
