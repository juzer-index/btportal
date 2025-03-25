import React, { useEffect, useState,useCallback } from "react";
import styles from "./Dashboard.module.scss";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
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
  Alert
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
import { activateDealerAPI,geDealerById } from "../../utils/api";
// import { Button, Card, Col, Modal, Row, Form, Table } from "react-bootstrap";

const DealerDashboard = () => {
  // let dealer_productType = localStorage.getItem("dealer_productType");
  //let state = localStorage.getItem("state");
 
 
  let navigate = useNavigate();

  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [retailerVerified, setRetailerVerified] = useState(false);
  const [mainData, setMainData] = useState([]);

  const [isStateTamilNadu, setisStateTamilNadu] = useState(false);
  const [dealer_productType, setDealer_productType] = useState("");
  const [state, setDealerState] = useState("");
  const [qrcodeImage, setQrCodeImage] = useState("");
  const [qrcodeImage_2, setQrCodeImage_2] = useState("");
  const [posterImage, setPosterImage] = useState("");
  const [InputShow, setInputShow] = useState(false);
  const [isCoated, setIsCoated] = useState(false);
  const [QRShow, setQRShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [retailerCode, setRetailerCode] = useState(localStorage.getItem("user_code"));

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const handleCloseQR3 = () => setQRShow(false);
  const handleShowQR3 = () => setQRShow(true);

  let Terms_url = "";
  let KnowMore_url = "";

  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    var bodyFormData = new FormData();

    bodyFormData.append("image", selectedImage);
    bodyFormData.append("image", selectedImage1);
    bodyFormData.append("code", retailerCode);
    bodyFormData.append("zone", retailerCode);

    activateDealer(bodyFormData);
    // setLoading(false);
  };
  const activateDealer = async (body) => {
    setError("");
    setLoading(true);

    // setLoading(false);

    try {
      const apiData = await activateDealerAPI(body,localStorage.getItem("user_token"));
      if (apiData.error) {
        setError(apiData.error ? apiData.error : apiData.messages);
      } else {
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Verification Done Successfully !
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
      }
      else 
      if (err.response) {
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

  const getData = useCallback (async ()=>{
    let main_id = localStorage.getItem("user_id");
    if(main_id)
    {
      try {
        const data = await geDealerById(main_id)
        if (data.data) {
          setDealer_productType(data.data.productType);
          setDealerState(data.data.state);
          setRetailerCode(data.data.code);
          setMainData(data.data);
          if(data.data.productType==="Coated")
          {
            setIsCoated(true);
          }
          if(data.data.state === "Tamil Nadu")
          {
            setisStateTamilNadu(true);
            setPosterImage(data.data.tamilPoster);
          }
          else
          {
            setPosterImage(data.data.poster);
          }
          setQrCodeImage(data.data.qrCode)

          let retailer_code = data.data.code;
           retailer_code = retailer_code.substring(3);
          setQrCodeImage_2(retailer_code);
          
          if(!data.data.isActive)
          {
            setInputShow(true);
          }
          setRetailerVerified(data.data.isActive ? true : false)
  
        } else {
          setError("Something Went Wrong !! ");
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      }
    }
    else
    {
      setErrorToast("ID Not Found !!!");
    }
  },[]);
  
 

  useEffect(()=>{
    getData();
  },[getData])

  if (dealer_productType === "TMT" && state === "Tamil Nadu") {
    Terms_url =
      "https://www.jswneosteel.in/cpl/assets/retailer-premier-league-tn-tnc.pdf";
    KnowMore_url = "https://www.jswneosteel.in/cpl/cpl_neosteel.html";
  } else if (dealer_productType === "TMT" && state !== "Tamil Nadu") {
    Terms_url =
      " https://www.jswneosteel.in/cpl/assets/retailer-premier-league-tnc.pdf";
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

  return (
    <div className={styles.Dashboard}>
      <PageHeader
        titles="RETAILER Dashboard"
        active="Dashboard 01"
        items={["Home"]}
      />

      {setRetailerVerified}
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={6} sm={12} xxl={6}>
              {/* <Card className="overflow-hidden">
                <Card.Body> */}
              {/* <div className="d-flex mt-5"> */}
              <>
                <div className="my-5 card img-card box-red-shadow">
                  <Button
                    disabled={mainData.isActive ? true : false}
                    onClick={handleShow3}
                    variant={mainData.isActive ? "success" : "warning"}
                  >
                    <div className="card-body" style={{ padding: "37px" }}>
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4 me-4">
                            {mainData.isActive
                              ? "Profile  Verified !"
                              : "Verify Profile"}
                          </h4>
                          <p className="text-white mb-0"> </p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-user-o text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </>

              <Modal
                size="lg"
                show={InputShow}
                onHide={handleClose3}
                backdrop="static"
              >
                <Modal.Header>
                  <Modal.Title>Verify Your Profile</Modal.Title>
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
                        <div className="col-lg-12">
                          {" "}
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Upload your unique QR code picture
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              name="image"
                              required
                              accept="image/*"
                              onChange={(event) => {
                                console.log(event.target.files[0]);
                                setSelectedImage1(event.target.files[0]);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              Upload the image of the CPL poster installed at
                              your store
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              name="image"
                              required
                              accept="image/*"
                              onChange={(event) => {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
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
                          Upload
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

              <ToastContainer />

              {/* </div> */}
              {/* </Card.Body>
              </Card> */}
            </Col>

            {isCoated === false && mainData && (
              <Col lg={6} md={6} sm={12} xxl={6}>
                <>
                  <div className="my-5 card bg-green img-card box-red-shadow">
                    {/* <Button onClick={handleShow3}> */}
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4">
                            {mainData.state !== "Tamil Nadu"
                              ? " My Coupons"
                              : "Leaderboard"}
                          </h4>
                          <p className="text-white mb-0"></p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-ticket text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                    </div>
                    {/* </Button> */}
                  </div>
                </>
              </Col>
            )}
            {isCoated === false && (
              <>
                <Col lg={6} md={6} sm={6} xs={6} xxl={6}>
                  {/* <Card className="overflow-hidden">
                <Card.Body> */}
                  {/* <div className="d-flex mt-5"> */}
                  <>
                    <div
                      onClick={() => {
                        // navigate("/dealer_customers");
                      }}
                      className="my-5 card bg-success img-card box-red-shadow"
                      style={{ cursor: "pointer" }}
                    >
                      {/* <Button onClick={handleShow3} */}
                      {/* variant="primary"> */}
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="text-white">
                            <h5 className="mb-0 number-font">
                              Verified Purchases
                            </h5>
                          </div>
                          <div className="ms-auto">
                            {/* <i className="fa fa-shopping-cart text-white fs-30 me-2 mt-2" /> */}

                            <h3 className="mb-0 number-font text-white">
                              {mainData?.totalPurchase
                                ? mainData?.totalPurchase
                                : 0}
                            </h3>
                          </div>
                        </div>
                      </div>
                      {/* </Button> */}
                    </div>
                  </>
                </Col>
                <Col lg={6} md={6} sm={6} xs={6} xxl={6}>
                  <>
                    <div
                      onClick={() => {
                        // navigate("/dealer_purchases");
                      }}
                      className="my-5 card bg-info img-card box-red-shadow"
                      style={{ cursor: "pointer" }}
                    >
                      {/* <Button onClick={handleShow3}> */}
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="text-white">
                            <h5 className="mb-0 number-font">
                              Inprogress Purchases
                            </h5>
                          </div>
                          <div className="ms-auto">
                            {/* <i className="fa fa-database text-white fs-30 me-2 mt-2" /> */}
                            <h3 className="mb-0 number-font text-white">
                              {mainData?.totalInProgressPurchase
                                ? mainData?.totalInProgressPurchase
                                : 0}
                            </h3>
                          </div>
                        </div>
                      </div>
                      {/* </Button> */}
                    </div>
                  </>

                  <ToastContainer />
                </Col>
              </>
            )}
            <Col lg={6} md={6} sm={12} xxl={6}>
              <>
                <div className="my-5 card bg-pink img-card box-red-shadow">
                  <Button onClick={handleShowQR3} className="px-0">
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="text-white">
                          <h4 className="mb-0 number-font mt-4">My QR Code</h4>
                          <p className="text-white mb-0"></p>
                        </div>
                        <div className="ms-auto">
                          <i className="fa fa-qrcode text-white fs-30 me-2 mt-2" />
                        </div>
                      </div>
                      <small className="text-white">
                        Click here to download CPL poster and your unique QR
                        code
                      </small>
                    </div>
                  </Button>
                </div>

                <Modal
                  size="xl"
                  show={QRShow}
                  onHide={handleCloseQR3}
                  backdrop="static"
                >
                  <Modal.Header>
                    <Modal.Title>Download Images</Modal.Title>
                    {retailerVerified && (
                      <span className="d-flex ms-auto" onClick={handleCloseQR3}>
                        <i className="fe fe-x ms-auto"></i>
                      </span>
                    )}
                  </Modal.Header>
                  <Modal.Body>
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-6">
                          {" "}
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              <strong>Tent Card:</strong>
                            </label>
                            <p className="text-danger">If this QR Code doesn't work, please download the alternate QR Code given below.</p>
                            {qrcodeImage && (
                              <>
                                <img src={qrcodeImage} alt="Tent Card" />
                                <a href={qrcodeImage} download>
                                  <Button variant="secondary" className="my-5">
                                    Download <i className="fa fa-download" />
                                  </Button>
                                </a>
                              </>
                            )}
                            <div></div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              <strong>Poster Image:</strong>
                            </label>
                            <div>
                              <img src={posterImage} alt="Poster" />
                            </div>
                            <a href={posterImage} download>
                              <Button variant="secondary" className="my-5">
                                Download <i className="fa fa-download" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-lg-6">
                          {" "}
                          <div className="mb-3">
                            <label className="form-label mt-0">
                              <strong>QR Code (Alternate):</strong>
                            </label>
                            {qrcodeImage_2 && (
                              <>
                                <img
                                  src={`https://jsw-prithvi-test.s3.ap-south-1.amazonaws.com/qrcodes/${qrcodeImage_2}.png`}
                                  alt="QR Code"
                                />
                                <a
                                  href={`https://jsw-prithvi-test.s3.ap-south-1.amazonaws.com/qrcodes/${qrcodeImage_2}.png`}
                                  download
                                >
                                  <Button variant="secondary" className="my-5">
                                    Download <i className="fa fa-download" />
                                  </Button>
                                </a>
                              </>
                            )}
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseQR3}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            </Col>
          </Row>
        </Col>
        <Col lg={12} md={12} sm={12} xxl={12}>
          <div className="text-center mt-4">
            <a href={KnowMore_url} target="_blank">
              Know More
            </a>
            <a className="ms-5" href={Terms_url} target="_blank">
              Terms & Conditions
            </a>
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xxl={12}>
              <Card className="overflow-hidden">
                <Card.Body>
                  <div className="d-flex">
                    {!mainData.isActive ? (
                      <Button
                        className="me-3 mt-2"
                        variant="primary"
                        animation="flip"
                        onClick={handleShow3}
                      >
                        Verify Retailer
                      </Button>
                    ) : (
                      <Alert variant="success">
                        Your Profile is Verified !!
                      </Alert>
                    )}

                    <ToastContainer />

                    <Modal size="lg" show={InputShow} onHide={handleClose3} backdrop="static">
                      <Modal.Header>
                        <Modal.Title>Verify Retailer</Modal.Title>
                        {retailerVerified && (<span className="d-flex ms-auto" onClick={handleClose3}>
                          <i className="fe fe-x ms-auto"></i>
                        </span>)}
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
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Tent Card
                                  </label>
                                  <input
                                    className="form-control"
                                    type="file"
                                    name="image"
                                    required
                                    accept="image/*"
                                    onChange={(event) => {
                                      console.log(event.target.files[0]);
                                      setSelectedImage1(event.target.files[0]);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label className="form-label mt-0">
                                    Poster Image
                                  </label>
                                  <input
                                    className="form-control"
                                    type="file"
                                    name="image"
                                    required
                                    accept="image/*"
                                    onChange={(event) => {
                                      console.log(event.target.files[0]);
                                      setSelectedImage(event.target.files[0]);
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
                               Upload Image
                              </Button>
                            </>
                          )}
                          {!retailerVerified && (<Button variant="danger" onClick={handleClose3}>
                            Close
                          </Button>)}
                        </Modal.Footer>
                      </form>
                    </Modal>
                  </div>
                  
                </Card.Body>
              </Card>
            </Col>
           
          </Row>
        </Col>
      </Row> */}
    </div>
  );
};

export default DealerDashboard;
