import React, { useEffect, useState, useCallback } from "react";
import styles from "./Dashboard.module.scss";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Modal,
  Card,
  Col,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tooltip,
  Table,
  Tab,
  Nav,
  Button,
  Alert,
  Form,
  FormSelect,
} from "react-bootstrap";
import {
  AllProduct,
  Worldmap,
  Shipped,
  Pending,
  Cancelled,
  SalesAnalytics,
  RecentOrder,
  TotalUser,
  TotalProfit,
  TotalExpenses,
  TotalCost,
} from "../../Data/DataDashBoard/DashBoardData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCustomerById, addInvoice } from "../../utils/api";
import Select from "react-select";
// import { Button, Card, Col, Modal, Row, Form, Table } from "react-bootstrap";

const CustomerDashboard = () => {
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [retailerVerified, setRetailerVerified] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [nameMain, setName] = useState("");
  let dealer_productType = localStorage.getItem("dealer_productType");
 
  let state = localStorage.getItem("dealer_state");
  let Terms_url = "";
  let KnowMore_url = "";
  if(dealer_productType === "TMT" && state === "Tamil Nadu")
  {
    Terms_url = "https://www.jswneosteel.in/cpl/assets/consumer-premier-league-tn-tnc.pdf";
    KnowMore_url ="https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  }
  else if(dealer_productType === "TMT" && state !== "Tamil Nadu")
  {
    Terms_url = "https://www.jswneosteel.in/cpl/assets/consumer-premier-league-tnc.pdf";
    KnowMore_url ="https://www.jswneosteel.in/cpl/cpl_neosteel.html";

  }
  else if(dealer_productType === "Coated" && state === "Tamil Nadu")
  {
    Terms_url = " https://www.jswcoatedsteel.in/cpl/assets/consumer-premier-league-tn-tnc.pdf";
    KnowMore_url ="https://www.jswcoatedsteel.in/cpl/cpl_coatedsheets.html";
  }
  else if(dealer_productType === "Coated" && state !== "Tamil Nadu")
  {
    Terms_url = "https://www.jswcoatedsteel.in/cpl/assets/consumer-premier-league-tnc.pdf";
    KnowMore_url ="https://www.jswcoatedsteel.in/cpl/cpl_coatedsheets.html";
  }
  else
  {
    Terms_url = " https://www.jswneosteel.in/cpl/cpl_neosteel.html";
    KnowMore_url ="https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  }
  const [InputShow, setInputShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [retailerCode, setRetailerCode] = useState(
    localStorage.getItem("user_code")
    );
    const [termsChecked, settermsChecked] = useState(false)

  const Default = [
    { value: "neosteel_tmt_bar", label: "NeoSteel TMT Bar" },
    { value: "coated_sheets", label: "Coated Sheets" },
  ];

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  let navigate = useNavigate();

  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    var bodyFormData = new FormData(form);

    bodyFormData.append("invoice", selectedImage1);
    bodyFormData.append("name", nameMain);

    const formJson = Object.fromEntries(bodyFormData.entries());

    console.log("formJson", formJson);
    uploadInvoice(formJson);
    // setLoading(false);
  };
  const uploadInvoice = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addInvoice(
        body,
        localStorage.getItem("user_token")
      );
      if (apiData.error) {
        setError(apiData.error ? apiData.error : apiData.messages);
      } else {
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Invoice Uploaded Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 4000,
            theme: "colored",
          }
        );
        getData();
        navigate(`/CustomerThankYouPage/${id}`)
      }
    } catch (err) {
      console.log("err", err.name);
      if (err.name === "AxiosError") {
        setError(err.message);
        setErrorToast(err.message);
      } else if (err.response) {
        setError(err.response.data.message);
        setErrorToast(err.response.data.message);
      } else if (err.name === "AxiosError") {
        setError(err.message);
        setErrorToast(err.message);
      } else {
        setError("something went wrong");
        setErrorToast("something went wrong");
      }
    }
    setLoading(false);
  };

  const setErrorToast = (errorFromBackend) => {
    toast.error(
      <p className="text-white tx-16 mb-0">
        Error: {error.length > 0 ? error : errorFromBackend}
      </p>,
      {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        autoClose: 2000,
        theme: "colored",
      }
    );
  };

  const getData = useCallback(async () => {
    setLoading(true);
    let main_id = localStorage.getItem("user_id");
    if (main_id) {
      try {
        const data = await getCustomerById(main_id);
        if (data.data) {
          setRetailerCode(data.data.code);
          setMainData(data.data);
          setName(data.data?.name);
          console.log("customerData", data.data);
          //   if (!data.data.isActive) {
          //     setInputShow(true);
          //   }
          setRetailerVerified(data.data.isActive ? true : false);
        } else {
          setError("Something Went Wrong !! ");
        }
      } catch (err) {
        console.log("err12123", err);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
        // console.log("errr",err.response.data.message);

        // throw new Error("Unable to get a token.");
      }
    } else {
      setErrorToast("ID Not Found !!!");
    }
    setLoading(false);

  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChange = e => {
    const { value } = e.target;
    console.log('Input value: ', value);
 
    const re = /^[A-Za-z ]+$/;
    // const re = /^[A-Za-z]+$/;

    if (re.test(value)) {
      console.log("value",value)
      setName(value);
    }
    // const result = event.target.value.replace(/[a-zåäö ]/i, '');
  
  };
  
  return (
    <div className={styles.Dashboard}>
      <PageHeader
        titles="Submit your entry for the contest"
        active="Dashboard 01"
        items={["Home"]}
      />

      {/* <!-- ROW-1 --> */}

      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xxl={12}>
              {/* <Card className="overflow-hidden">
                <Card.Body> */}
              {/* <div className="d-flex mt-5"> */}
              {loading ?  (<div>
                Loading....
              </div>) : (<> <Card>
                <Card.Header>Upload GST Invoice Data</Card.Header>
                <Card.Body>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <form
                          method="post"
                          onSubmit={formsSubmit}
                          autoComplete="off"
                          encType="multipart/form-data"
                        >
                          <div className="container">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Full Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    pattern="[a-zA-Z][a-zA-Z ]+"
                                    readOnly={mainData.name ? true : false}
                                    onChange={handleChange}
                                    value={nameMain || ""}

                                    // defaultValue={
                                    //   mainData.name ? mainData.name : ""
                                    // }
                                    required
                                    placeholder="Enter Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Mobile{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="mobile"
                                    required
                                    placeholder="Enter Mobile"
                                    readOnly
                                    value={localStorage.getItem("user_mobile")}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Select Purchased Product{" "}
                                    <span className="text-danger">*</span>
                                  </label>

                                  <Form.Group>
                                    <Select
                                      name="productType"
                                      classNamePrefix="Select"
                                      options={Default}
                                      required
                                    />
                                  </Form.Group>

                                  <input
                                    className="form-control"
                                    type="hidden"
                                    name="id"
                                    required
                                    value={mainData._id}
                                  />
                                  <input
                                    className="form-control"
                                    type="hidden"
                                    name="dealerId"
                                    value={localStorage.getItem(
                                      "user_dealer_id"
                                    )}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                {" "}
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Upload GST Invoice{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={(event) => {
                                      console.log(event.target.files[0]);
                                      setSelectedImage1(event.target.files[0]);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-center ">
                              <div className="custom-controls-stacked mt-3">
                                <Form.Check
                                  label="I agree to the Terms & Conditions"
                                  type="checkbox"
                                  required
                                  // checked={termsChecked ? true : false}
                                  // name="anuj"
                                  // onChange={(e) => {
                                  //   if (termsChecked === true) {
                                  //     settermsChecked(false);
                                  //   } else {
                                  //     settermsChecked(true);
                                  //   }
                                  // }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 mt-4 text-center">
                            {loading ? (
                              <Button variant="success" disabled>
                                Loading ...
                              </Button>
                            ) : (
                              <>
                                <Button
                                  // disabled={termsChecked ? false : true}
                                  variant="success"
                                  type="submit"
                                >
                                  Submit Entry
                                </Button>
                              </>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <a href={KnowMore_url} target="_blank">Know More</a>
                    <a
                      className="ms-5"
                      href={Terms_url}
                      target="_blank"
                    >
                      Terms & Conditions
                    </a>
                  </div>
                </Card.Body>
              </Card>
</>)}
             
              <ToastContainer />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDashboard;
