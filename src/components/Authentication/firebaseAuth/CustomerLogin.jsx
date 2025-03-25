import React, { useEffect, useState,useCallback } from "react";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from '../../../assets/logo_t.png'
import './loginJSW.css';

import {
  generateOTPCustomer,
  verifyOTPCustomer,
  geDealerByCode
} from "../../../utils/api";
import Background from "../../../assets/slide-3.jpg";
const SignIn = (props) => {
  let { id } = useParams();

  const [err, setError] = useState("");
  const [loading, setLoader] = useState(false);
  const [dealerData, setDealerData] = useState(false);
  const [mobile, setMobile] = useState("");
  const [id2, setId] = useState("");
  const [backendOTP, setBackendOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordshow, setpasswordshow] = useState(false);
  const [data, setData] = useState({
    mobile: "123123",
    password: "admin",
  });

  const getDealerData = useCallback( async ()=>{
        setError();
    
        setLoader(true);
        try {
          const apiData = await geDealerByCode(id);
          if (apiData.error) {

            setError(apiData.error);
          } else {    
            setDealerData(apiData.data);
            console.log("getDealerData",apiData.data);
            // localStorage.setItem("dealer_state", apiData.data.state);

          }
        } catch (err) {
          if (err.response) {
            setError(err.response.data.message);
          } else {
            setError(err.message);
          }
        }
        setLoader(false);

  },[id])
  const checkMobileNumber = async (e) => {
    console.log("checkMobileNumbercalled");
    setError();
    setLoader(true);
    if (mobile.length === 10) {
      // e.preventDefault();
      try {
        const apiData = await generateOTPCustomer(mobile);
        if (apiData.error) {
          setError(apiData.error);
        } else {
          console.log("checkMobileNumber", apiData);

          setBackendOTP(apiData.data.otp.otp);
          setId(apiData.data.customerId);
          localStorage.setItem("user_id", apiData.data.customerId);
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
      setError("Mobile number must contain 10 digits");
    }

   

    setLoader(false);
  };
  const checkOTP = async (e) => {
    console.log("Login Function called");
    setLoader(true);
    if (otp.length > 4 || otp.length < 4) {
      setError("OTP should be 4 digits");
    }
    else
    {
      setError("");
      try {
        let body = {
          mobile: mobile,
          otp: otp,
        };
        const apiData = await verifyOTPCustomer(body);
        if (apiData.error) {
          setError(apiData.error);
        } else {
          console.log("checkOTP data", apiData);
          // localStorage.setItem("user_id", apiData.data.customerId);
          localStorage.setItem("user_dealer_id", dealerData._id);
          localStorage.setItem("user_token", apiData.data.token);
          localStorage.setItem("user_type", "customer");
          localStorage.setItem("user_mobile",mobile);
          localStorage.setItem("dealer_productType",dealerData.productType);
          console.log("dealer_statedealer_statedealer_state",dealerData.state);
          localStorage.setItem("dealer_state",dealerData.state);
          RouteChange();
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      }
    }
    setLoader(false);
  };
  let navigate = useNavigate();
  const RouteChange = (customerId) => {
    let path = `${process.env.PUBLIC_URL}/CustomerUploadInvoice/`;
    if(props.type === "reupload")
    {
      path = `${process.env.PUBLIC_URL}/CustomerReloadInvoiceNew/${localStorage.getItem("user_id")}`;
    }
    navigate(path);
  };

  useEffect(()=>{
    getDealerData()
  },[getDealerData])
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
                    src={logo}
                    style={{
                      width: "150px",
                      marginTop: "-100px",
                    }}
                    className=""
                    alt=""
                  />
                </div>
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title pb-5">
                  {" "}
                  Customer Login
                </span>
                {dealerData && (
                  <>
                    {" "}
                    <div className="form-group">
                      <label htmlFor="">
                        Retailer Code <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        value={id}
                        readOnly
                        className="form-control"
                      />
                      <label className="mt-3" htmlFor="">
                        Retailer Name <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        value={dealerData.firm_name}
                        readOnly
                        className="form-control"
                      />
                    </div>
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
                              {"Verify OTP"}
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
                              inputMode="numeric"
                              pattern="[0-9]{0,10}"
                              name="mobile"
                              placeholder="Enter mobile number"
                              value={mobile}
                              onChange={(e) => {
                                setMobile(e.target.value);
                                if (e.target.value.length > 10) {
                                  setError("Mobile number must contain 10 digits");
                                }
                                else
                                {
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
                  </>
                )}
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
