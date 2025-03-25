import React, { useState } from "react";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { geDealerByCode } from "../../../utils/api";
import LogoImg from '../../../assets/logo_t.png';
import './loginJSW.css';

const SignIn = () => {
  const [err, setError] = useState("");
  const [loading, setLoader] = useState(false);
  const [retailerCode, setRetailerCode] = useState("");
  const [data, setData] = useState({
    mobile: "123123",
    password: "admin",
  });


  const searchRetailer = async (e) => {
    setError();
    e.preventDefault();
    if (retailerCode.length > 0 && retailerCode.length === 7) {
      setLoader(true);
      try {
        const apiData = await geDealerByCode(retailerCode);
        if (apiData.error) {
          setError(apiData.error);
        } else {
          RouteChange(apiData.data.code);
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      }
      setLoader(false);
    } else {
      setError("Retailer code must be of 7 digits");
    }

   

  };
  let navigate = useNavigate();
  const RouteChange = (id) => {
    console.log("code",id);
    let path = `${process.env.PUBLIC_URL}/dealer/${id}`;
    navigate(path);
  };
  return (
    <div className="customerJSWLogin">
      <div >
        <div className="page">
          {/* <!-- CONTAINER OPEN --> */}

          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <div className="col-login mx-auto mt-7">
                <div className="text-center">
                  <img src={LogoImg} style={{width:"150px",marginTop:'-100px'}} className="" alt="" />
                </div>
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title pb-5"> Enter Retailer Code </span>
                <div>
                  {err && <Alert variant="danger">{err}</Alert>}
                  <div className="wrap-input100 validate-input input-group">
                    
                    <Form.Control
                      className="input100  form-control ms-0"
                      type="text"
                      placeholder="Enter Retailer Code"
                      value={retailerCode}
                      onChange={(e)=>{
                        setRetailerCode((e.target.value).toUpperCase())
                        
                      }}
                      required
                    />{" "}
                  </div>

                

                  <div className="container-login100-form-btn">
                    <Link
                      to="#"
                      onClick={searchRetailer}
                      className="login100-form-btn btn-primary"
                    >
                      {loading ? (
                        <span
                          role="status"
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm ms-2"
                        ></span>
                      ) : (
                        "Search"
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
