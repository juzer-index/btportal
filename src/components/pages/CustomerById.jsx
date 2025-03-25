import React, { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Tab,
  Row,
  Col,
  Nav,
  Card,
  Form,
  Collapse,
  Button,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  InputGroup,
} from "react-bootstrap";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  getCustomerById,
  getCustomerPurchases,
  getCustomerTokens,
  updateCustomerPurchase,
} from "../../utils/api";
import { geDealerById } from "../../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CustomerModal from "../bootstrap/Modal/CustomerModal";
import remarkJSON from "./remarkData.json";
import Select from "react-select";
import moment from "moment";
const Default = [
  { value: "MT", label: "MT" },
  { value: "KG", label: "KG" },
];
const productTypeSheets = [
  { value: "coated_sheets", label: "Coated Sheets" },
  { value: "neosteel_tmt_bar", label: "Neosteel Tmt Bar" },
];
export const CustomerById = () => {
  let { id } = useParams();
  // let history = use  History();

  let user_type = localStorage.getItem("user_type_jsw");

  let showActions = user_type === "L1" ? false : true;
  const [status, setStatus] = useState("verified");
  const [quantity, setQuantity] = useState("");
  const [showInvoiceType, setShowInvoiceType] = useState("current");
  const [showQuantity, setShowQuantity] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [uom, setUom] = useState("KG");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [normalReason, setNormalReason] = useState(
    remarkJSON && remarkJSON.REUPLOAD[0].front_end_label
  );
  const [showInvoiceDate, setShowInvoiceDate] = useState(false);

  const [mainAmount, setMainAmount] = useState("");
  const [showMainAmount, setShowMainAmount] = useState(false);

  const [gstAmount, setGstAmount] = useState("");

  const [productType, setProductType] = useState("coated_sheets");
  const [showProductType, setShowProductType] = useState(false);

  const [purchaseIdFromRow, setPurchaseIdFromRow] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showInvoiceNumber, setShowInvoiceNumber] = useState(false);
  const [largeShow, setlargeShow] = useState(false);
  const [modalInvoice, setModalInvoice] = useState("");
  const [modalInvoiceOld, setModalInvoiceOld] = useState("");
  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [allRemakrs, setAllRemakrs] = useState([]);
  const [remarkBackend, allRemarkBackend] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tokensData, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    let main_id = localStorage.getItem("user_id");
    if (main_id) {
      try {
        const data = await getCustomerById(id);
        if (data.data) {
          console.log(data.data, "main");
          setMainData(data.data);
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
      }
    } else {
      setErrorToast("ID Not Found !!!");
    }
  }, [id]);

  const addRemarks = () => {
    console.log("normalReason", normalReason);
    let mainRemarkNew = [...allRemakrs, normalReason];
    setAllRemakrs(mainRemarkNew);
  };
  const getDatacustomerpurchase = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getCustomerPurchases(id);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getDatacustomerpurchase", apiData);
        setPurchases(apiData.data);
      }
    } catch (err) {
      console.log("err", err.name);
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
  }, []);
  const getDatacustomertokens = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getCustomerTokens(id);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getDatacustomerpurchase", apiData);
        setTokens(apiData.data);
      }
    } catch (err) {
      console.log("err", err.name);
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
  }, []);
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

  const handleRotate = () => {
    setRotation(rotation === 270 ? 0 : rotation + 90);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const formsSubmit = () => {
    setLoading(true);

    var bodyFormData = new FormData();
    bodyFormData.append("invoiceNumber", invoiceNumber);
    bodyFormData.append("gstNo", gstAmount);
    bodyFormData.append("amount", mainAmount);
    bodyFormData.append("customerName", mainData.name);
    bodyFormData.append("invoiceDate", invoiceDate);
    let qtyconvertedvalue = 0;
    if (uom === "MT") {
      qtyconvertedvalue = quantity;
    } else {
      qtyconvertedvalue = quantity / 1000;
    }
    bodyFormData.append("quantity", qtyconvertedvalue);
    bodyFormData.append("productType", productType);
    bodyFormData.append("status", status);
    for (var i = 0; i < allRemakrs.length; i++) {
      bodyFormData.append("remark[]", allRemakrs[i]);
    }
    // bodyFormData.append("remark[]",allRemakrs);

    updatePurchaseFunction(bodyFormData);
    // setLoading(false);
  };

  const updatePurchaseFunction = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateCustomerPurchase(purchaseIdFromRow, body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        largemodalClose();
        getDatacustomerpurchase();
        setAllRemakrs([]);
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Purchase Updated !</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
      }
    } catch (err) {
      console.log("err", err.name);
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

  const changeStatusRemark = (statusFromRow) => {
    if (statusFromRow === "re-upload") {
      return (
        remarkJSON &&
        remarkJSON.REUPLOAD.map((data, i) => {
          return (
            <option value={data.backend_label}>{data.backend_label}</option>
          );
        })
      );
    } else {
      return (
        remarkJSON &&
        remarkJSON.REJECTED.map((data, i) => {
          return (
            <option value={data.backend_label}>{data.backend_label}</option>
          );
        })
      );
    }
  };

  const getRemarkFilter = (statusFromRow, idFromRow) => {
    if (statusFromRow === "re-upload") {
      // return (remarkJSON && remarkJSON.REUPLOAD.filter((filterData)=>{
      //   filterData.id === idFromRow
      // }))
    } else {
      return (
        remarkJSON &&
        remarkJSON.REJECTED.map((data, i) => {
          return <option value={data.id}>{data.backend_label}</option>;
        })
      );
    }
  };

  const showModal = (
    invoice,
    purchaseId,
    invoiceOldFromRow,
    remarkFromRow,
    RowArray
  ) => {
    largemodalShow();
    setShowMainAmount(false);
    setMainAmount("");
    setShowInvoiceDate(false);
    setInvoiceDate("");
    setShowInvoiceNumber(false);

    setInvoiceNumber("");
    setShowProductType(false);

    setProductType("");
    setShowQuantity(false);

    // showQuantity(false);
    setModalInvoice(invoice);
    console.log("invoiceOldFromRow", invoiceOldFromRow);
    setModalInvoiceOld(invoiceOldFromRow);
    setPurchaseIdFromRow(purchaseId);
    allRemarkBackend(remarkFromRow);
    console.log("RowArray", RowArray);
    if (RowArray?.invoiceProperties?.amount?.length > 0) {
      setMainAmount(RowArray?.invoiceProperties?.amount);
      setShowMainAmount(true);
    }
    if (RowArray?.invoiceProperties?.invoiceDate?.length > 0) {
      setInvoiceDate(RowArray?.invoiceProperties?.invoiceDate);
      setShowInvoiceDate(true);
    }
    if (RowArray?.invoiceProperties?.invoiceNumber?.length > 0) {
      setInvoiceNumber(RowArray?.invoiceProperties?.invoiceNumber);
      setShowInvoiceNumber(true);
    }
    if (RowArray?.invoiceProperties?.productType?.length > 0) {
      setProductType(RowArray?.invoiceProperties?.productType);
      setShowProductType(true);
    }
    if (RowArray?.quantity) {
      setQuantity(RowArray.quantity);
      setShowQuantity(true);
    }
    // RowArray.length > 0 && console.log("hi2") && RowArray.invoiceProperties.length > 0 && RowArray.invoiceProperties.amount.length > 0 ? setMainAmount(RowArray.invoiceProperties.amount) : null;
    // RowArray.length > 0 && console.log("hi2") && RowArray.invoiceProperties.length > 0 && RowArray.invoiceProperties.invoiceDate.length > 0 ? setInvoiceDate(RowArray.invoiceProperties.invoiceDate): null;
    // RowArray.length > 0 && console.log("hi2") && RowArray.invoiceProperties.length > 0 && RowArray.invoiceProperties.invoiceNumber.length > 0 ? setInvoiceNumber(RowArray.invoiceProperties.invoiceNumber): null;
    // RowArray.length > 0 && console.log("hi2") && RowArray.invoiceProperties.length > 0 && RowArray.invoiceProperties.productType.length > 0 ? setProductType(RowArray.invoiceProperties.productType): null;
  };
  const closeModal = () => {
    largemodalClose();
    setModalInvoice();
  };
  useEffect(() => {
    getData();
    getDatacustomerpurchase();
    getDatacustomertokens();
  }, [getData]);
  return (
    <>
      <div>
        <PageHeader
          titles="Customer Details"
          active="Dealers"
          items={["Tables"]}
        />
        <ToastContainer />

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header></Card.Header>
              <Card.Body>
                <div className="panel panel-info">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="firstC"
                  >
                    <Nav
                      variant="pills"
                      className="panel-tabs nav-tabs panel-info"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="firstC">
                          <i className="fe fe-user me-1"></i>Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="secondC">
                          <i className="fe fe-calendar me-1"></i>Purchase
                          Details
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="thirdC">
                          <i className="fe fe-settings me-1"></i>Token Details
                        </Nav.Link>
                      </Nav.Item>
                      {/* <Nav.Item>
                        <Nav.Link eventKey="fourthC">
                          <i className="fe fe-bell me-1"></i>Tab 4
                        </Nav.Link>
                      </Nav.Item> */}
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="firstC">
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="exampleInputname">Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputname"
                              value={mainData.name}
                              readOnly
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="exampleInputname1">
                              Retailer Name:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputname1"
                              value={mainData.dealerName}
                              readOnly
                            />
                          </div>

                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputnumber">
                                  Contact Number:
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputnumber"
                                  value={mainData.mobile}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="secondC">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              {/* <th>Amount</th> */}
                              <th>Invoice</th>
                              <th>Purchase No</th>
                              <th>Created Date</th>
                              <th>Retailer</th>
                              <th>Product</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchases &&
                              purchases.length > 0 &&
                              purchases.map((data, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    {/* <td>{data.amount}</td> */}
                                    <td>
                                      <a href={data.invoice} download={true}>
                                        <img
                                          src={data.invoice}
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                          }}
                                          alt=""
                                        />
                                      </a>
                                    </td>
                                    <td>{data.purchaseNo}</td>
                                    <td>
                                      {moment(data.createdAt).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td>{data.retailer_name}</td>
                                    <td>
                                      {data.productType == "neosteel_tmt_bar"
                                        ? "TMT Bars"
                                        : "Coated Sheets"}
                                    </td>
                                    <td>
                                      <Button
                                        variant="success"
                                        className="bg-success mt-3 me-1"
                                        disabled
                                        onClick={() => {
                                          showModal(
                                            data.invoice,
                                            data._id,
                                            data.oldInvoice,
                                            data.remark,
                                            data
                                          );
                                        }}
                                        // disabled={data.status ? true : false}
                                      >
                                        {data.status ? data.status : "Verify"}
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>

                          <Modal
                            size="lg"
                            show={largeShow}
                            onHide={largemodalClose}
                          >
                            <ModalHeader>
                              <ModalTitle>Update Purchase</ModalTitle>
                              <span
                                className="d-flex ms-auto"
                                onClick={largemodalClose}
                              >
                                <i className="fe fe-x ms-auto"></i>
                              </span>
                            </ModalHeader>
                            <ModalBody>
                              <div className="container">
                                <div className="row">
                                  <div
                                    style={{ zIndex: "1" }}
                                    className="col-lg-6"
                                  >
                                    <label
                                      htmlFor=""
                                      onClick={(e) => {
                                        setShowInvoiceType("current");
                                      }}
                                      className={`btn ${
                                        showInvoiceType === "current"
                                          ? "btn-primary"
                                          : ""
                                      }`}
                                    >
                                      New Invoice
                                    </label>
                                    <label
                                      onClick={(e) => {
                                        setShowInvoiceType("old");
                                      }}
                                      htmlFor=""
                                      className={`btn ${
                                        showInvoiceType === "current"
                                          ? ""
                                          : "btn-primary"
                                      }`}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Old Invoice
                                    </label>

                                    {
                                      showInvoiceType === "current" &&
                                      modalInvoice &&
                                      modalInvoice.length > 0 ? (
                                        <>
                                          <div
                                            className={`image-container ${
                                              isHovered ? "hovered" : ""
                                            }`}
                                            onMouseEnter={handleHover}
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              id="modalInvoice"
                                              src={modalInvoice}
                                              style={{
                                                width: "100%",
                                                height: "500px",
                                                transform: `rotate(${rotation}deg)`,
                                              }}
                                              alt=""
                                            />
                                          </div>
                                          <a
                                            href={modalInvoice}
                                            download={true}
                                            className="btn btn-info mt-3"
                                          >
                                            Download
                                          </a>
                                          <button
                                            className="btn btn-info mt-3 ms-5"
                                            onClick={handleRotate}
                                          >
                                            Rotate Image
                                          </button>
                                        </>
                                      ) : null
                                      // <h1>Invoice Not Loaded !!</h1>
                                    }
                                    {
                                      showInvoiceType === "old" &&
                                      modalInvoiceOld &&
                                      modalInvoiceOld.length > 0 ? (
                                        <>
                                          <div
                                            className={`image-container ${
                                              isHovered ? "hovered" : ""
                                            }`}
                                            onMouseEnter={handleHover}
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              id="modalInvoice"
                                              src={modalInvoiceOld}
                                              style={{
                                                width: "100%",
                                                height: "500px",
                                                transform: `rotate(${rotation}deg)`,
                                              }}
                                              alt=""
                                            />
                                          </div>
                                          <a
                                            href={modalInvoiceOld}
                                            download={true}
                                            className="btn btn-info mt-3"
                                          >
                                            Download
                                          </a>
                                          <button
                                            className="btn btn-info mt-3 ms-5"
                                            onClick={handleRotate}
                                          >
                                            Rotate Image
                                          </button>
                                        </>
                                      ) : null
                                      // <h1>Invoice Not Loaded !!</h1>
                                    }
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="container">
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Invoice Number :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      defaultValue={invoiceDate}
                                                      id="flexSwitchCheckDefault"
                                                      checked={
                                                        showInvoiceNumber ||
                                                        invoiceDate.length > 0
                                                          ? true
                                                          : false
                                                      }
                                                      name="anuj"
                                                      onChange={(e) => {
                                                        if (
                                                          showInvoiceNumber ===
                                                          true
                                                        ) {
                                                          setShowInvoiceNumber(
                                                            false
                                                          );
                                                        } else {
                                                          setShowInvoiceNumber(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showInvoiceNumber === true ? (
                                              <input
                                                className="form-control"
                                                name="invoiceNumber"
                                                onChange={(e) => {
                                                  setInvoiceNumber(
                                                    e.target.value
                                                  );
                                                }}
                                                defaultValue={invoiceNumber}
                                                placeholder="Enter Invoice Number"
                                              />
                                            ) : null}
                                          </div>
                                        </div>
                                        {/* <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Customer Name :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      defaultValue={gstAmount}
                                                      id="flexSwitchCheckDefault"
                                                      checked={
                                                        showGSTNumber || invoiceDate.length > 0
                                                          ? true
                                                          : false
                                                      }
                                                      name="gstAmount"
                                                      onChange={(e) => {
                                                        if (
                                                          showGSTNumber === true
                                                        ) {
                                                          setShowGSTNumber(
                                                            false
                                                          );
                                                        } else {
                                                          setShowGSTNumber(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showGSTNumber === true ? (
                                              <input
                                                className="form-control"
                                                name="invoiceNumber"
                                                onChange={(e) => {
                                                  setGstAmount(e.target.value);
                                                }}
                                                placeholder="Enter Customer Name"
                                              />
                                            ) : null}
                                          </div>
                                        </div> */}
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Amount :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      id="flexSwitchCheckDefault"
                                                      defaultValue={mainAmount}
                                                      checked={
                                                        showMainAmount ||
                                                        mainAmount.length > 0
                                                          ? true
                                                          : false
                                                      }
                                                      name="mainAmount"
                                                      onChange={(e) => {
                                                        if (
                                                          showMainAmount ===
                                                          true
                                                        ) {
                                                          setShowMainAmount(
                                                            false
                                                          );
                                                        } else {
                                                          setShowMainAmount(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showMainAmount === true ? (
                                              <input
                                                className="form-control"
                                                name="invoiceNumber"
                                                type="number"
                                                onChange={(e) => {
                                                  setMainAmount(e.target.value);
                                                }}
                                                defaultValue={mainAmount}
                                                placeholder="Enter GST Amount"
                                              />
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Invoice Date :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      defaultValue={invoiceDate}
                                                      role="switch"
                                                      id="flexSwitchCheckDefault"
                                                      checked={
                                                        showInvoiceDate ||
                                                        invoiceDate.length > 0
                                                          ? true
                                                          : false
                                                      }
                                                      name="mainAmount"
                                                      onChange={(e) => {
                                                        if (
                                                          showInvoiceDate ===
                                                          true
                                                        ) {
                                                          setShowInvoiceDate(
                                                            false
                                                          );
                                                        } else {
                                                          setShowInvoiceDate(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showInvoiceDate === true ? (
                                              <input
                                                className="form-control"
                                                name="invoiceNumber"
                                                type="date"
                                                onChange={(e) => {
                                                  setInvoiceDate(
                                                    e.target.value
                                                  );
                                                }}
                                                defaultValue={invoiceDate}
                                                placeholder="Enter Invoice Date"
                                              />
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Product Type :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      id="flexSwitchCheckDefault"
                                                      checked={
                                                        showProductType ||
                                                        productType.length > 0
                                                          ? true
                                                          : false
                                                      }
                                                      name="productType"
                                                      onChange={(e) => {
                                                        if (
                                                          showProductType ===
                                                          true
                                                        ) {
                                                          setShowProductType(
                                                            false
                                                          );
                                                        } else {
                                                          setShowProductType(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showProductType === true ? (
                                              <Select
                                                name="productType"
                                                classNamePrefix="Select"
                                                options={productTypeSheets}
                                                onChange={(data) => {
                                                  setProductType(data.value);
                                                }}
                                                required
                                                defaultValue={
                                                  productType ===
                                                  "neosteel_tmt_bar"
                                                    ? productTypeSheets[1]
                                                    : productTypeSheets[0]
                                                }
                                              />
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    Quantity :
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      defaultValue={quantity}
                                                      id="flexSwitchCheckDefault"
                                                      checked={
                                                        showQuantity
                                                          ? true
                                                          : false
                                                      }
                                                      name="mainAmount"
                                                      onChange={(e) => {
                                                        if (
                                                          showQuantity ===
                                                            true ||
                                                          quantity.length > 0
                                                        ) {
                                                          setShowQuantity(
                                                            false
                                                          );
                                                        } else {
                                                          setShowQuantity(true);
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showQuantity === true ? (
                                              <>
                                                <InputGroup>
                                                  <Select
                                                    name="productType"
                                                    classNamePrefix="Select"
                                                    options={Default}
                                                    onChange={(data) => {
                                                      setUom(data.value);
                                                    }}
                                                    required
                                                    defaultValue={Default[0]}
                                                    // defaultInputValue="MT"
                                                  />
                                                  <input
                                                    className="form-control"
                                                    name="invoiceNumber"
                                                    type="number"
                                                    defaultValue={quantity}
                                                    onChange={(e) => {
                                                      setQuantity(
                                                        e.target.value
                                                      );
                                                    }}
                                                    placeholder="Enter Qty"
                                                  />
                                                </InputGroup>
                                              </>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <div className="form-group border-1">
                                            <label htmlFor="">
                                              Status
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <select
                                              onChange={(e) => {
                                                setAllRemakrs([]);
                                                setStatus(e.target.value);
                                              }}
                                              name="status"
                                              className="form-control"
                                              id=""
                                            >
                                              <option value="verified">
                                                Verified
                                              </option>
                                              <option value="re-upload">
                                                Re-Upload
                                              </option>
                                              <option value="rejected">
                                                Rejected
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                        {remarkBackend && (
                                          <div className="col-lg-12">
                                            <div className="col-lg-12 mt-5">
                                              <div className="form-group border-1">
                                                <Card>
                                                  {remarkBackend &&
                                                    remarkBackend.map(
                                                      (data, i) => {
                                                        return (
                                                          <li>
                                                            {/* {i +
                                                                            1}
                                                                          .{" "} */}
                                                            {data}
                                                          </li>
                                                        );
                                                      }
                                                    )}
                                                </Card>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {status &&
                                          (status === "re-upload" ||
                                            status === "rejected") && (
                                            <div className="col-lg-12">
                                              <div className="form-group border-1">
                                                <div className="container">
                                                  <div className="row">
                                                    <div className="col-lg-10">
                                                      <label htmlFor="">
                                                        Select Reason{" "}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <select
                                                        name=""
                                                        id=""
                                                        className="form-control"
                                                        onChange={(e) => {
                                                          console.log(
                                                            "eeeee",
                                                            e.target
                                                          );
                                                          setNormalReason(
                                                            e.target.value
                                                          );
                                                        }}
                                                      >
                                                        {status ===
                                                        "re-upload" ? (
                                                          <>
                                                            {changeStatusRemark(
                                                              "re-upload"
                                                            )}
                                                          </>
                                                        ) : (
                                                          <>
                                                            {changeStatusRemark(
                                                              "rejected"
                                                            )}
                                                          </>
                                                        )}
                                                        ;
                                                      </select>
                                                    </div>
                                                    <div className="col-lg-2 mt-1">
                                                      <Button
                                                        className="mt-5"
                                                        variant="primary"
                                                        onClick={addRemarks}
                                                      >
                                                        +
                                                      </Button>
                                                    </div>
                                                    <div className="col-lg-12">
                                                      {allRemakrs &&
                                                        (status ===
                                                          "re-upload" ||
                                                          status ===
                                                            "rejected") && (
                                                          <div className="col-lg-12 mt-5">
                                                            <div className="form-group border-1">
                                                              <Card>
                                                                {allRemakrs &&
                                                                  allRemakrs.map(
                                                                    (
                                                                      data,
                                                                      i
                                                                    ) => {
                                                                      return (
                                                                        <li>
                                                                          {/* {i +
                                                                            1}
                                                                          .{" "} */}
                                                                          {data}
                                                                        </li>
                                                                      );
                                                                    }
                                                                  )}
                                                              </Card>
                                                            </div>
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                        {/* <div className="col-lg-12">
                                          <div className="form-group">
                                            <div className="container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  {" "}
                                                  <label htmlFor="">
                                                    GST : 
                                                  </label>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div class="form-check form-switch">
                                                    <input
                                                      class="form-check-input"
                                                      type="checkbox"
                                                      role="switch"
                                                      id="gst"
                                                      
                                                      name="gst"
                                                      onChange={(e) => {
                                                        setGstAmount(
                                                          e.target.value
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {showGSTNumber === true ? (
                                              <input
                                                className="form-control"
                                                name="invoiceNumber"
                                                onChange={(e) => {
                                                  setShowGSTNumber(
                                                    !showGSTNumber
                                                  );
                                                }}
                                                placeholder="Enter Invoice Number"
                                              />
                                            ) : null}
                                          </div>
                                        </div> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                variant="secondary"
                                onClick={largemodalClose}
                              >
                                Close
                              </Button>
                              <Button
                                disabled={showActions === true ? false : true}
                                variant="primary"
                                onClick={formsSubmit}
                              >
                                {loading ? "Loading...." : "Update Status"}
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="thirdC">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Token</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tokensData &&
                              tokensData.map((data, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{data.tokenNo}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="fourthC">
                        <p>
                          page editors now use Lorem Ipsum as their default
                          model text, and a search for 'lorem ipsum' will
                          uncover many web sites still in their infancy. Various
                          versions have evolved over the years, sometimes by
                          accident, sometimes on purpose (injected humour and
                          the like
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua. At vero eos et
                        </p>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
