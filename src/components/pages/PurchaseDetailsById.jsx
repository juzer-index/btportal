import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Form, InputGroup, Button, Modal } from "react-bootstrap";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  getPurchaseDetailsById,
  updateCustomerPurchase,
} from "../../utils/api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import remarkJSON from "./remarkData.json";
import Select from "react-select";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
const PurchaseDetailsById = () => {
  const [showModal, setShowModal] = useState(false);

  let user_type = localStorage.getItem("user_type_jsw");
  // console.log("user_type", user_type);
  let showActions = user_type === "L1" ? true : false;
  let { id } = useParams();
  const [hideButton, setHideButton] = useState(false);

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
    console.log("status",status);
    console.log("invoiceNumber",invoiceNumber);
    console.log("totalAmountMain",totalAmountMain);
    console.log("gstAmount",gstAmount);
    console.log("productType",productType);
    console.log("quantity",quantity);

    if (
      (status === "verified" || status === "In Progress") &&
      (invoiceNumber === undefined ||
        invoiceNumber?.length === 0 ||
        totalAmountMain === undefined ||
        totalAmountMain?.length === 0 ||
        gstAmount === undefined ||
        gstAmount?.length === 0 ||
        productType === undefined ||
        productType?.length === 0 ||
        quantity === undefined ||
        quantity?.length === 0)
    ) {
      setErrorToast("Please Enter All Required Fields");
      return;
    }
    if (
      (status === "re-upload" || status === "rejected") &&
      (!allRemakrs || allRemakrs.length === 0)
    ) {
      setErrorToast("Please Enter At Least One Remark");
      return;
    }
    if (
      (totalAmountMain <= 0 || totalAmountMain?.length < 1 || totalAmountMain === undefined ) &&
      (status === "verified" || status === "In Progress")
    ) {
      setErrorToast("Please Add Amount");

      return;
    }

    setLoading(true);

    var bodyFormData = new FormData();
    bodyFormData.append("invoiceNumber", invoiceNumber);
    bodyFormData.append("gstNo", gstAmount);
    bodyFormData.append("amount", gstAmount);
    bodyFormData.append("customerName", mainData.name);
    bodyFormData.append("invoiceDate", invoiceDate);
    bodyFormData.append("quantity", quantity);
    bodyFormData.append("productType", productType);
    bodyFormData.append("status", status);
    for (var i = 0; i < allRemakrs.length; i++) {
      bodyFormData.append("remark[]", allRemakrs[i]);
    }
    // bodyFormData.append("remark[]",allRemakrs);

    updatePurchaseFunction(bodyFormData);
    // setLoading(false);
    // } else {
    //   setErrorToast("Please Add Amount");
    // }
  };

  const updatePurchaseFunction = async (body) => {
    console.log("updatePurchaseFunction", body);
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateCustomerPurchase(mainData._id, body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
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
  const checkButtonHideCondition = () => {
    if (showActions === true) {
      // console.log("checkButtonHideCondition showActions", true);
      return true;
    } else if (hideButton === true) {
      // console.log("checkButtonHideCondition hideButton", true);

      return true;
    } else {
      // console.log("checkButtonHideCondition else", false);
// 
      return false;
    }
    // showActions === true ? false : true || setHideButton ===  true ? true : false
  };
  const Default = [
    { value: "MT", label: "MT" },
    { value: "KG", label: "KG" },
  ];
  const productTypeSheets = [
    { value: "coated_sheets", label: "Coated Sheets" },
    { value: "neosteel_tmt_bar", label: "Neosteel Tmt Bar" },
  ];
  const statusTypes = [
    { value: "rejected", label: "Rejected" },
    { value: "re-upload", label: "Re-upload" },
    { value: "verified", label: "Verified" }
  ];
  const [allRemakrs, setAllRemakrs] = useState([]);
  const [totalAmountMain, setTotalAmountMain] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [showInvoiceDate, setShowInvoiceDate] = useState(false);
  const [mainAmount, setMainAmount] = useState("");
  const [showMainAmount, setShowMainAmount] = useState(false);
  //   const [gstAmount, setGstAmount] = useState("");
  const [productType, setProductType] = useState("coated_sheets");
  const [showProductType, setShowProductType] = useState(false);
  const [purchaseIdFromRow, setPurchaseIdFromRow] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showInvoiceNumber, setShowInvoiceNumber] = useState(false);
  const [modalIMG, setModalIMG] = useState("");
  const [modalPurchasesData, setModalPurchasesData] = useState([]);
  const [InputShow, setInputShow] = useState(false);
   const handleClose3 = () => setInputShow(false);
   const handleShow3 = () => setInputShow(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [dealerNameMAIN, setDealerName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [showInvoiceType, setShowInvoiceType] = useState("current");
  const [showQuantity, setShowQuantity] = useState(false);
  const [uom, setUom] = useState("KG");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [normalReason, setNormalReason] = useState(
    remarkJSON && remarkJSON.REUPLOAD[0].front_end_label
  );
  const [remarkBackend, allRemarkBackend] = useState([]);

  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [checked, setChecked] = useState(false);
  const handleChangeCheckbox = (e) => {
    console.log('checked', e.target.checked);
    let checkvalue = "";
    if(e.target.checked === true)
    {
      setChecked(true);
       checkvalue = true;

    }
    else
    {
      setChecked(false);
      checkvalue = false;


    }

    updateQty(totalAmountMain,checkvalue);
  };

  const updateQty = (mainAmount,checkvalue) => {
    console.log("updateQty called",checked,mainAmount);
    if (checkvalue === true) {
      console.log("updateQtytrue",checked,mainAmount);

      setQuantity(mainAmount / 85);
      setGstAmount(mainAmount);
    } else {
      console.log("updateQtyfalse",checked,mainAmount);

      let gstAmountNew =
        parseFloat(mainAmount) + (parseFloat(mainAmount) * 18) / 100;
      setGstAmount(gstAmountNew);
      setQuantity(gstAmountNew / 85);
    }
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
  const changeStatusRemark = (statusFromRow) => {
    let myArray = [];

    if (statusFromRow === "re-upload") {
      // return (
        remarkJSON &&
        remarkJSON.REUPLOAD.map((data, i) => {
          // return (
          //   <option value={data.backend_label}>{data.backend_label}</option>
          // );

          myArray.push({ value: data.backend_label, label:data.backend_label});
          // return [
          //   { value: data.backend_label, label:data.backend_label},
          //   // { value: "re-upload", label: "Re-upload" },
          //   // { value: "rejected", label: "Rejected" },
          // ];
          
        })
      // );
    } else {
      // return (
        remarkJSON &&
        remarkJSON.REJECTED.map((data, i) => {
          // return (
          //   <option value={data.backend_label}>{data.backend_label}</option>
          // );
          // return [
          //   { value: data.backend_label, label:data.backend_label},
          //   // { value: "re-upload", label: "Re-upload" },
          //   // { value: "rejected", label: "Rejected" },
          // ];
          myArray.push({ value: data.backend_label, label:data.backend_label});

        })
      // );
    }
    // console.log("myarray",myArray);

    return myArray;
  };

  const addRemarks = () => {
    console.log("normalReason", normalReason);
    let mainRemarkNew = [...allRemakrs, normalReason];
    setAllRemakrs(mainRemarkNew);
  };
  const getData = useCallback(async () => {
    setLoading(true);
    let main_id = localStorage.getItem("user_id");
    if (id) {
      try {
        const data = await getPurchaseDetailsById(id);
        if (data.data) {
          console.log("PurchaseDetailsById", data.data);
          console.log("invoiceBYIDDD", data.data.invoice);
          setMainData(data.data);
          allRemarkBackend(data.data.remark);
          setMainAmount(data.data?.invoiceProperties?.amount);
          setTotalAmountMain(data.data?.invoiceProperties?.amount);
          setInvoiceDate(data.data?.invoiceProperties?.invoiceDate);
          setInvoiceNumber(data.data?.invoiceProperties?.invoiceNumber);
          setProductType(data.data?.invoiceProperties?.productType);
          setQuantity(data.data?.quantity);
          setDealerName(data.data?.dealerName);
          if (data.data?.status === "verified") {
            console.log("verified status");
            setHideButton(true);
          }
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
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const [inputFields, setInputFields] = useState([
    {
      Amount: "",
    },
  ]);
  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        Amount: "",
      },
    ]);
  };
  const removeInputFields = (index) => {
    setTotalAmountMain();
    setGstAmount();
    const rows = [...inputFields];

    rows.splice(index, 1);
    setInputFields(rows);
    console.log("rows", index, rows);

    let TotalAmount = rows.reduce(
      (total, a) => parseFloat(total) + parseFloat(a.Amount),
      0
    );

    setTotalAmountMain(TotalAmount);
    // setGstAmount(TotalAmount);
    updateQty(TotalAmount,checked);
    console.log("TotalAmountTotalAmountremoveInputFields", TotalAmount);
  };
  const handleChange = (index, evnt) => {
    setTotalAmountMain();
    setGstAmount();

    const { name, value } = evnt.target;
    // let mainTotal = parseFloat(totalAmountMain) + parseFloat(value);
    // setTotalAmountMain(mainTotal);

    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
    let TotalAmount = list.reduce(
      (total, a) => parseFloat(total) + parseFloat(a.Amount),
      0
    );
    setTotalAmountMain(TotalAmount);
    // setGstAmount(TotalAmount);
    updateQty(TotalAmount,checked);

    // console.log("TotalAmountTotalAmount",TotalAmount);
  };

  return (
    <div>
      <Row className="row-sm">
        <PageHeader
          titles="Purchase Details"
          active="Dealers"
          items={["Tables"]}
        />
        <Col lg={12}>
          <Card>
            <Card.Header>
              <ToastContainer />
              
              <div className="d-flex justify-content-between w-100">
                <div>
                  <a
                    href={`https://jsw-cpl.prithvicomputers.com/admin_dealer_by_id/${mainData.dealerId}`}
                    target="_blank"
                  >
                    {" "}
                  Dealer Name : {mainData?.dealerName}{" "}
                  </a>
                </div>
                <div>
                <span
                  className={
                    mainData?.status === "verified"
                      ? "badge bg-success text-white rounded-pill"
                      : mainData?.status === "In Progress"
                      ? "badge bg-warning text-white rounded-pill"
                      : "badge bg-danger text-white rounded-pill"
                  }
                >
                  {mainData?.status === "verified"
                    ? "Verified"
                    : mainData?.status
                    ? mainData?.status
                    : "Pending"}
                </span>
                  
                  Purchase No : {mainData?.status}</div>
                <div>Purchase No : {mainData?.purchaseNo}</div>
              </div>
              {showModal && (
                <Lightbox
                  mainSrc={mainData?.invoice}
                  nextSrc={1}
                  onCloseRequest={() => setShowModal(false)}
                />
              )}
            </Card.Header>
            <Card.Body>
              <div className="container">
                <div className="row">
                  <div className="container">
                    <div className="row">
                      <div style={{ zIndex: "1" }} className="col-lg-6">
                        <label
                          htmlFor=""
                          onClick={(e) => {
                            setShowInvoiceType("current");
                          }}
                          className={`btn ${
                            showInvoiceType === "current" ? "btn-primary" : ""
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
                            showInvoiceType === "current" ? "" : "btn-primary"
                          }`}
                          style={{ marginLeft: "10px" }}
                        >
                          Old Invoice
                        </label>
                        {
                          showInvoiceType === "current" &&
                          mainData &&
                          mainData?.invoice?.length > 0 ? (
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
                                  src={mainData?.invoice}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    transform: `rotate(${rotation}deg)`,
                                  }}
                                  // onClick={() => {
                                  //   setShowModal(true);
                                  // }}
                                  alt=""
                                />
                              </div>
                              <a
                                href={mainData?.invoice}
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
                          mainData &&
                          mainData?.oldInvoice?.length > 0 ? (
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
                                  src={mainData?.oldInvoice}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    transform: `rotate(${rotation}deg)`,
                                  }}
                                  alt=""
                                />
                              </div>
                              <a
                                href={mainData?.oldInvoice}
                                download={true}
                                className="btn btn-info mt-3"
                              >
                                Download
                              </a>
                              <span
                                className="btn btn-info mt-3 ms-5"
                                onClick={handleRotate}
                              >
                                Rotate Image
                              </span>
                            </>
                          ) : null
                          // <h1>Invoice Not Loaded !!</h1>
                        }
                      </div>
                      <div className="col-lg-6">
                        <form onSubmit={formsSubmit}>
                          <div className="container">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="form-group border-1">
                                  <label htmlFor="">
                                    Invoice Number{" "}
                                    <span className="text-danger"> *</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    name="invoiceNumber"
                                    required
                                    onChange={(e) => {
                                      setInvoiceNumber(e.target.value);
                                    }}
                                    defaultValue={invoiceNumber}
                                    placeholder="Enter Invoice Number"
                                  />
                                </div>
                              </div>

                              {/* <div className="col-lg-12">
                              <div className="form-group border-1">
                                <label htmlFor="">
                                  Amount<span className="text-danger"> *</span>
                                </label>
                                <InputGroup>
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
                                 
                                </InputGroup>
                              </div>
                            </div> */}
                              <div className="col-lg-12">
                                <div className="form-group border-1">
                                  <label htmlFor="">
                                    Product Type
                                    <span className="text-danger"> *</span>
                                  </label>

                                  <Select
                                    name="productType"
                                    classNamePrefix="Select"
                                    label="Select Product Type..."
                                    onChange={(data) => {
                                      setProductType(data.value);
                                    }}
                                    required
                                    defaultValue={
                                      status === "In Progress"
                                        ? ""
                                        : productType === "neosteel_tmt_bar"
                                        ? productTypeSheets[1]
                                        : productTypeSheets[0]
                                    }
                                    options={productTypeSheets}
                                  />
                                </div>
                              </div>
                              {inputFields.map((data, index) => {
                                const { Amount } = data;
                                return (
                                  <>
                                    <div className="col-lg-12 mb-5" key={index}>
                                      {index === 0 && (
                                        <label htmlFor="">
                                          Amount
                                          <span className="text-danger">
                                            {" "}
                                            *
                                          </span>
                                        </label>
                                      )}
                                      <InputGroup>
                                        <input
                                          className="form-control"
                                          name="Amount"
                                          type="number"
                                          //   onChange={(e) => {
                                          //     setMainAmount(e.target.value);
                                          //   }}
                                          onChange={(evnt) =>
                                            handleChange(index, evnt)
                                          }
                                          value={Amount || ""}
                                          placeholder={`Enter GST Amount ${
                                            index + 1
                                          }`}
                                        />
                                        {index === 0 && (
                                          <Button
                                            onClick={addInputField}
                                            style={{ marginLeft: "20px" }}
                                          >
                                            <i className="fa fa-plus ml-2"></i>
                                          </Button>
                                        )}
                                        {index !== 0 ? (
                                          <button
                                            style={{ marginLeft: "50px" }}
                                            className="btn btn-outline-danger ml-4"
                                            onClick={() => {
                                              removeInputFields(index);
                                            }}
                                          >
                                            <i className="fa fa-close"></i>
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </InputGroup>
                                    </div>
                                  </>
                                );
                              })}
                              <div className="col-lg-12 border-1">
                                <div className="form-group border-1 bg-lightgray">
                                  {/* {checked ? "Checked" : "Not checked"} */}

                                  <InputGroup>
                                    <Form.Check
                                      label="The amount includes GST"
                                      type="checkbox"
                                      className="mt-5"
                                      onChange={(e) => handleChangeCheckbox(e)}
                                      style={{ marginLeft: "" }}
                                    />
                                    <div>
                                      <label
                                        style={{ marginLeft: "50px" }}
                                        htmlFor=""
                                      >
                                        Total Calculated Amount
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input
                                        className="form-control"
                                        name="invoiceNumber"
                                        type="number"
                                        value={totalAmountMain}
                                        readOnly
                                        placeholder="Enter Qty"
                                        style={{ marginLeft: "50px" }}
                                      />
                                    </div>
                                  </InputGroup>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-group border-1 bg-lightgray">
                                  <div>
                                    <InputGroup>
                                      <div>
                                        <label htmlFor="">
                                          Qty
                                          <span className="text-danger">
                                            {" "}
                                            *
                                          </span>
                                        </label>
                                        <input
                                          className="form-control"
                                          name="invoiceNumber"
                                          type="number"
                                          value={quantity}
                                          readOnly
                                          placeholder="Enter Qty"
                                          //   style={{ marginLeft: "50px" }}
                                        />
                                      </div>
                                      <div style={{ marginLeft: "20px" }}>
                                        <label htmlFor="">
                                          GST Amount
                                          <span className="text-danger">
                                            {" "}
                                            *
                                          </span>
                                        </label>
                                        <input
                                          className="form-control"
                                          name="invoiceNumber"
                                          type="number"
                                          value={gstAmount}
                                          readOnly
                                          placeholder="Enter Qty"
                                          //   style={{ marginLeft: "50px" }}
                                        />
                                      </div>
                                    </InputGroup>
                                  </div>
                                </div>
                              </div>

                              {/* <div className="col-lg-12">
                              <div className="form-group border-1">
                                <label htmlFor="">
                                  Qty<span className="text-danger"> *</span>
                                </label>

                                <InputGroup>
                                  <input
                                    className="form-control"
                                    name="invoiceNumber"
                                    type="number"
                                    defaultValue={quantity}
                                    onChange={(e) => {
                                      setQuantity(e.target.value);
                                    }}
                                    placeholder="Enter Qty"
                                  />
                                  <Select
                                    name="productType"
                                    classNamePrefix="Select"
                                    options={Default}
                                    onChange={(data) => {
                                      setUom(data.value);
                                    }}
                                    required
                                    defaultValue={Default[1]}
                                    // defaultInputValue="MT"
                                  />
                                </InputGroup>
                              </div>
                            </div> */}

                              <div className="col-lg-12">
                                <div className="form-group border-1">
                                  <label htmlFor="">
                                    Status
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Select
                                    onChange={(data) => {
                                      setStatus(data.value);
                                    }}
                                    name="status"
                                    required
                                    id=""
                                    // defaultValue={
                                    //   status === "verified"
                                    //     ? statusTypes[0]
                                    //     : status === "re-upload" ? statusTypes[1] :  status === "rejected" ? statusTypes[2] :statusTypes[0]
                                    // }
                                    defaultValue={
                                      status === "In Progress"
                                        ? ""
                                        : status === "verified"
                                        ? statusTypes[0]
                                        : status === "re-upload"
                                        ? statusTypes[1]
                                        : status === "rejected"
                                        ? statusTypes[2]
                                        : statusTypes[0]
                                    }
                                    options={statusTypes}
                                  />
                                </div>
                              </div>
                              {remarkBackend && (
                                <div className="col-lg-12">
                                  <div className="col-lg-12 mt-5">
                                    <div className="form-group border-1">
                                      <Card>
                                        {remarkBackend &&
                                          remarkBackend.map((data, i) => {
                                            return (
                                              <li>
                                                {/* {i +
                                                                            1}
                                                                          .{" "} */}
                                                {data}
                                              </li>
                                            );
                                          })}
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
                                            <Select
                                              name=""
                                              id=""
                                              // className="form-control"
                                              // onChange={(e) => {
                                              //   console.log("eeeee", e.target);
                                              //   setNormalReason(e.target.value);
                                              // }}
                                              onChange={(data) => {
                                                setNormalReason(data.value);
                                              }}
                                              defaultValue={""}
                                              options={
                                                status === "re-upload"
                                                  ? changeStatusRemark(
                                                      "re-upload"
                                                    )
                                                  : changeStatusRemark(
                                                      "rejected"
                                                    )
                                              }
                                            />
                                            {/* {status === "re-upload" ? (
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
                                              ; */}
                                            {/* // </Select> */}
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
                                              (status === "re-upload" ||
                                                status === "rejected") && (
                                                <div className="col-lg-12 mt-5">
                                                  <div className="form-group border-1">
                                                    <Card>
                                                      {allRemakrs &&
                                                        allRemakrs.map(
                                                          (data, i) => {
                                                            return (
                                                              <li>{data}</li>
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
                              <div className="col-lg-12">
                                {checkButtonHideCondition() === true ? (
                                  <Button
                                    disabled
                                    variant="primary"
                                    onClick={formsSubmit}
                                  >
                                    {loading ? "Loading...." : "Update Status"}
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="primary"
                                      onClick={formsSubmit}
                                    >
                                      {loading
                                        ? "Loading...."
                                        : "Update Status"}
                                    </Button>
                                    <Modal
                                      size="md"
                                      show={InputShow}
                                      onHide={handleClose3}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>Update Status</Modal.Title>
                                        <span
                                          className="d-flex ms-auto"
                                          onClick={handleClose3}
                                        >
                                          <i className="fe fe-x ms-auto"></i>
                                        </span>
                                      </Modal.Header>
                                      <form
                                        method="post"
                                        onSubmit={formsSubmit}
                                        autocomplete="off"
                                      >
                                        <Modal.Body>
                                          <p>
                                            Are you sure you want to update?
                                          </p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                          {loading ? (
                                            <Button variant="success" disabled>
                                              Loading ...
                                            </Button>
                                          ) : (
                                            <>
                                              <Button
                                                variant="success"
                                                type="submit"
                                              >
                                                Save Changes
                                              </Button>
                                            </>
                                          )}
                                          <Button
                                            variant="danger"
                                            onClick={handleClose3}
                                          >
                                            Close
                                          </Button>
                                        </Modal.Footer>
                                      </form>
                                    </Modal>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* </form> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="car">
        <div className="card-header">
          <div className="card-body"></div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailsById;
