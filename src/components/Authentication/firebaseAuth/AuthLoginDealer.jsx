import React, { useState } from "react";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  loginApiFunctionDealer,
  verifyDealerOTP,
  generateOTPDealer,
} from "../../../utils/api";
import Background from "../../../assets/background-rpl.jpg";
import "./loginJSW.css";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [err, setError] = useState("");
  const [loading, setLoader] = useState(false);
  const [mobile, setMobile] = useState("");
  const [id, setId] = useState("");
  const [isError, setIsError] = useState("");
  const [backendOTP, setBackendOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordshow, setpasswordshow] = useState(false);
  const [data, setData] = useState({
    mobile: "123123",
    password: "admin",
  });

  const checkMobileNumber = async (e) => {
    console.log("checkMobileNumbercalled");
    setError();
    setLoader(true);
    if (mobile.length > 0 && mobile.length === 10) {
      // e.preventDefault();
      try {
        const apiData = await generateOTPDealer(mobile);
        if (apiData.error) {
          setError(apiData.error);
        } else {
          console.log("checkMobileNumber", apiData);

          setBackendOTP(apiData.data.otp.otp);
          setId(apiData.data.id);
          // localStorage.setItem("user_id", apiData.data._id);
          //     localStorage.setItem("user_email", apiData.data.email);
          //     localStorage.setItem("user_token", apiData.data.token);
          //     localStorage.setItem("user_active", apiData.data.isActive);
          //     localStorage.setItem("user_type","dealer");
          //     RouteChange();
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      }
    } else {
      setError("Please Enter Valid Mobile Number");
    }

    setLoader(false);
  };
  const checkOTP = async (e) => {
    console.log("Login Function called");
    setLoader(true);
    try {
      let body = {
        id: id,
        otp: otp,
      };
      const apiData = await verifyDealerOTP(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("checkOTP data", apiData);
        localStorage.setItem("user_id", apiData.data.id);
        localStorage.setItem("user_token", apiData.data.token);
        localStorage.setItem("user_type", "dealer");
        RouteChange();
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
    let path = `${process.env.PUBLIC_URL}/DealerDashboard`;
    navigate(path);
  };
  return (
    <div className="retailerLogin">
      <div>
        <div className="page">
          {/* <!-- CONTAINER OPEN --> */}

          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <div className="col-login mx-auto mt-7">
                <div className="text-center">
                  <img
                    src="logo_t.png"
                    style={{ width: "150px", marginTop: "-100px" }}
                    className=""
                    alt=""
                  />
                </div>
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title pb-5">
                  {" "}
                  Retailer Login
                </span>
                <div>
                  {err && <Alert variant="danger">{err}</Alert>}

                  {backendOTP ? (
                    <>
                      <div className="wrap-input100 validate-input input-group">
                        <Form.Control
                          className="input100 form-control ms-0"
                          type="number"
                          name="otp"
                          placeholder="Enter 4 Digit OTP"
                          onChange={(e) => {
                            setOtp(e.target.value);
                            if (e.target.value.length > 4) {
                              setError("OTP should be 4 digits");
                            } else {
                              setError("");
                            }
                          }}
                          required
                        />{" "}
                      </div>

                      <div className="container-login100-form-btn">
                        <Link
                          to="#"
                          onClick={() => {
                            checkOTP();
                          }}
                          className="login100-form-btn btn-primary"
                        >
                          {"Submit"}
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
                    </>
                  ) : (
                    <>
                      <div className="wrap-input100 validate-input input-group">
                        <Link
                          to="#"
                          className="input-group-text bg-white text-muted"
                        >
                          <i
                            className="zmdi zmdi-phone text-muted"
                            aria-hidden="true"
                          ></i>
                        </Link>
                        <Form.Control
                          className="input100 border-start-0 form-control ms-0"
                          type="number"
                          name="mobile"
                          placeholder="Enter your mobile number"
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            if (
                              e.target.value.length > 10 ||
                              e.target.value.length < 10
                            ) {
                              setError("Mobile number must be 10 digits");
                            } else {
                              setError("");
                            }
                          }}
                          required
                        />{" "}
                      </div>

                      <div className="container-login100-form-btn">
                        <Link
                          to="#"
                          onClick={() => {
                            checkMobileNumber();
                          }}
                          className="login100-form-btn btn-primary"
                        >
                          {"Request OTP"}
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
                    </>
                  )}
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
