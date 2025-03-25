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

const CustomerThankYouPage = () => {
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [retailerVerified, setRetailerVerified] = useState(false);
  const [mainData, setMainData] = useState([]);

  const [InputShow, setInputShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [retailerCode, setRetailerCode] = useState(
    localStorage.getItem("user_code")
  );

  const Default = [
    { value: "Brazil", label: "Brazil" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Germany", label: "Germany" },
    { value: "Poland", label: "Poland" },
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

  const getData = useCallback(async () => {
    let main_id = localStorage.getItem("user_id");
    if (main_id) {
      try {
        const data = await getCustomerById(main_id);
        if (data.data) {
          setRetailerCode(data.data.code);
          setMainData(data.data);
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
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={styles.Dashboard}>
      <PageHeader
        titles="Entry Submitted!"
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
              <Card>
                <Card.Body>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <p>You will receive a confirmation once your submitted information is verified.</p>
                      </div>
                      <div className="col-lg-6">
                        <div
                          onClick={() => {
                            navigate(`/customer_purchases/${mainData._id}`);
                          }}
                          className="my-5 card bg-warning img-card box-red-shadow"
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
                      </div>
                      <div className="col-lg-6">
                        <div
                          onClick={() => {
                            if (
                              localStorage.getItem("dealer_state") !== "Tamil Nadu"
                            ) {
                              navigate(`/customer_tokens/${mainData._id}`);
                            } else {
                            }
                          }}
                          className="my-5 card bg-success img-card box-red-shadow"
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
                                    : "Leaderboard"
                                }
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
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <ToastContainer />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerThankYouPage;
