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
// import { Button, Card, Col, Modal, Row, Form, Table } from "react-bootstrap";

const CustomerDashboard = () => {
  let dealer_productType = localStorage.getItem("dealer_productType");
  let state = localStorage.getItem("state");
  let Terms_url = "";
  let KnowMore_url = "";
  if (dealer_productType === "TMT" && state === "Tamil Nadu") {
    Terms_url =
      "https://www.jswneosteel.in/cpl/assets/consumer-premier-league-tn-tnc.pdf";
    KnowMore_url = "https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  } else if (dealer_productType === "TMT" && state !== "Tamil Nadu") {
    Terms_url =
      " https://www.jswneosteel.in/cpl/assets/consumer-premier-league-tn-tnc.pdf";
    KnowMore_url = "https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  } else if (dealer_productType === "Coated" && state === "Tamil Nadu") {
    Terms_url =
      " https://www.jswcoatedsteel.in/cpl/assets/consumer-premier-league-tn-tnc.pdf";
    KnowMore_url = "https://www.jswcoatedsteel.in/cpl/cpl_coatedsheets.html";
  } else if (dealer_productType === "Coated" && state !== "Tamil Nadu") {
    Terms_url =
      " https://www.jswcoatedsteel.in/cpl/assets/consumer-premier-league-tnc.pdf";
    KnowMore_url = "https://www.jswcoatedsteel.in/cpl/cpl_coatedsheets.html";
  } else {
    Terms_url = " https://www.jswneosteel.in/cpl/cpl_neosteel.html";
    KnowMore_url = "https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  }
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [retailerVerified, setRetailerVerified] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [selectedProduct, setselectedProduct] = useState("neosteel_tmt_bar");
  const [InputShow, setInputShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [retailerCode, setRetailerCode] = useState(
    localStorage.getItem("user_code")
  );

  const handleSelect = (e) => setselectedProduct(e.target.value);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  let navigate = useNavigate();

  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    var bodyFormData = new FormData(form);

    bodyFormData.append("invoice", selectedImage1);

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
  const setSuccessToast = (message) => {
    toast.success(
      <p className="text-white tx-16 mb-0">
        Message : {message}
      </p>,
      {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        autoClose: 5000,
        theme: "colored",
      }
    );
  };

  const getData = useCallback(async () => {
    let main_id = localStorage.getItem("user_id");
    if (main_id) {
      try {
        const data = await getCustomerById(main_id);
        if (data.data) {
          setRetailerCode(data.data.code);
          setMainData(data.data);
          console.log("customerData", data.data);

          if(data.data?.reUploadPurchases > 0)
          {
            setSuccessToast("Some of your invoices needs re-submission. Please review the remarks and upload correct invoice as suggested.")
            navigate(`/customer_purchases/${data.data._id}`)
          }
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
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={styles.Dashboard}>
      <PageHeader
        titles="Customer Dashboard"
        active="Dashboard 01"
        items={["Home"]}
      />

      {/* <!-- ROW-1 --> */}

      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={6} sm={12} xxl={3}>
              {/* <Card className="overflow-hidden">
                <Card.Body> */}
              {/* <div className="d-flex mt-5"> */}
              {!mainData.isActive ? (
                <>
                  <div
                    onClick={() => {
                      navigate(
                        `${process.env.PUBLIC_URL}/CustomerUploadInvoice`
                      );
                    }}
                    className="my-5 card bg-primary img-card box-red-shadow"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <Button onClick={handleShow3} */}
                    {/* variant="primary"> */}
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4">
                            Submit Your Entry
                          </h4>
                          <p className="text-white mb-0"> </p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-upload text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                    {/* </Button> */}
                  </div>
                </>
              ) : (
                <Alert variant="success">Your Profile is Verified !!</Alert>
              )}

              <ToastContainer />
            </Col>
            <Col lg={6} md={6} sm={12} xxl={3}>
              {/* <Card className="overflow-hidden">
                <Card.Body> */}
              {/* <div className="d-flex mt-5"> */}
              {!mainData.isActive ? (
                <>
                  <div
                    onClick={() => {
                      navigate(`/customer_purchases/${mainData._id}`);
                    }}
                    className="my-5 card bg-yellow img-card box-red-shadow"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <Button onClick={handleShow3} */}
                    {/* variant="primary"> */}
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4">
                            My Entries
                          </h4>
                          <p className="text-white mb-0"> </p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-shopping-cart text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                    {/* </Button> */}
                  </div>
                </>
              ) : (
                <Alert variant="success">Your Profile is Verified !!</Alert>
              )}

              <ToastContainer />
            </Col>
            <Col lg={6} md={6} sm={12} xxl={3}>
              {!mainData.isActive ? (
                <>
                  <div
                    onClick={() => {
                      if (
                        localStorage.getItem("dealer_state") !== "Tamil Nadu"
                      ) {
                        navigate(`/customer_tokens/${mainData._id}`);
                      } else {
                      }
                    }}
                    className="my-5 card bg-green img-card box-red-shadow"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <Button onClick={handleShow3}> */}
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4">
                            {localStorage.getItem("dealer_state") !==
                            "Tamil Nadu"
                              ? "My Coupons"
                              : "Leaderboard"}
                          </h4>
                          <p className="text-white mb-0"> </p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-ticket text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                    {/* </Button> */}
                  </div>
                </>
              ) : (
                <Alert variant="success">Your Profile is Verified !!</Alert>
              )}

              <ToastContainer />
            </Col>
            <Col lg={6} md={6} sm={12} xxl={3}>
              {!mainData.isActive ? (
                <>
                  {/* <div className="my-5 card bg-purple img-card box-red-shadow">
                  <Button onClick={handleShow3} variant="primary">
                    <div className="card-body" style={{ padding: "27px" }}>
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-3 me-3">
                            Upload Invoice
                          </h4>
                          <p className="text-white mb-0"> </p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-cloud-upload text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </Button>
                </div> */}
                </>
              ) : (
                <Alert variant="success">Your Profile is Verified !!</Alert>
              )}

              <ToastContainer />

              <Modal
                size="lg"
                show={InputShow}
                onHide={handleClose3}
                backdrop="static"
              >
                <Modal.Header>
                  <Modal.Title>Add Invoice</Modal.Title>
                  {retailerVerified && (
                    <span className="d-flex ms-auto" onClick={handleClose3}>
                      <i className="fe fe-x ms-auto"></i>
                    </span>
                  )}
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit}
                  autoComplete="off"
                  encType="multipart/form-data"
                >
                  <Modal.Body>
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Name <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="name"
                              readOnly={mainData.name ? true : false}
                              defaultValue={mainData.name ? mainData.name : ""}
                              required
                              placeholder="Enter Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Mobile <span className="text-danger">*</span>
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
                              Pincode <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              name="pincode"
                              readOnly={mainData.pincode ? true : false}
                              defaultValue={
                                mainData.pincode ? mainData.pincode : ""
                              }
                              required
                              placeholder="Enter Pincode"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Purchase Quantity (MT)
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              name="purchaseQuantity"
                              required
                              placeholder="Enter Purchase Qty (MT)"
                              style={{ width: "90%" }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Product Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {/* <Form.Group>
                            <Form.Label>Default Select</Form.Label>
                            <FormSelect
                              classNamePrefix="Select"
                              options={Default}
                              placeholder="country"
                            />
                          </Form.Group> */}
                            {/* <input
                            className="form-control"
                            type="text"
                            name="productType"
                            required
                            placeholder="Enter Purchase Qty"
                          /> */}
                            <select
                              name="productType"
                              className="form-select"
                              id=""
                            >
                              <option value="neosteel_tmt_bar">
                                NeoSteel TMT Bar
                              </option>
                              <option value="coated_sheets">
                                Coated Sheets
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Amount <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              name="amount"
                              required
                              placeholder="Enter Invoice Total Amount"
                            />
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
                              value={localStorage.getItem("user_dealer_id")}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {" "}
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Invoice <span className="text-danger">*</span>
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
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    {loading ? (
                      <Button variant="success" disabled>
                        Loading ...
                      </Button>
                    ) : (
                      <>
                        <Button variant="success" type="submit">
                          Upload Invoice
                        </Button>
                      </>
                    )}
                    {!retailerVerified && (
                      <Button variant="danger" onClick={handleClose3}>
                        Close
                      </Button>
                    )}
                  </Modal.Footer>
                </form>
              </Modal>
            </Col>
            <Col lg={12} md={12} sm={12} xxl={12}>
              <div className="text-center mt-4">
                <a href={KnowMore_url} target="_blank">Know More</a>
                <a className="ms-5" href={Terms_url} target="_blank">
                  Terms & Conditions
                </a>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDashboard;