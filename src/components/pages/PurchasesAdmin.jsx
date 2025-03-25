import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./DataTable.module.scss";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import "react-data-table-component-extensions/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllPurchases,
  getPurchasesByStatus,
  updateCustomerPurchase,
} from "../../utils/api";
import remarkJSON from "./remarkData.json";
import Select from "react-select";
import {
  Button,
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
  Table,
  InputGroup,
} from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
  };
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
  { value: "verified", label: "Verified" },
  { value: "re-upload", label: "Re-upload" },
  { value: "rejected", label: "Rejected" },
];
const GlobalResFilter = ({ filter, setFilter }) => {
  return (
    <span className="d-flex ms-auto">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-4"
        placeholder="Search..."
      />
    </span>
  );
};

const PurchasesAdmin = (props) => {
  const [allRemakrs, setAllRemakrs] = useState([]);
  const [modalInvoice, setModalInvoice] = useState("");
  const [modalInvoiceOld, setModalInvoiceOld] = useState("");
  const [hideButton, setHideButton] = useState(false);

  let user_type = localStorage.getItem("user_type_jsw");
  console.log("user_type", user_type);
  let showActions = user_type === "L1" ? true : false;
  const [status, setStatus] = useState("verified");
  const [dealerNameMAIN, setDealerName] = useState("");
  const [quantity, setQuantity] = useState("");
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

  const [showInvoiceDate, setShowInvoiceDate] = useState(false);
  const [mainAmount, setMainAmount] = useState("");
  const [showMainAmount, setShowMainAmount] = useState(false);
  const [gstAmount, setGstAmount] = useState("");
  const [productType, setProductType] = useState("coated_sheets");
  const [showProductType, setShowProductType] = useState(false);
  const [purchaseIdFromRow, setPurchaseIdFromRow] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showInvoiceNumber, setShowInvoiceNumber] = useState(false);
  const statusFromProps = props.status;
  const [modalIMG, setModalIMG] = useState("");
  const [modalPurchasesData, setModalPurchasesData] = useState([]);
  const [largeShow, setlargeShow] = useState(false);
  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const COLUMN = useMemo(
    () => [
      {
        Header: "No",
        accessor: "_id",

        Cell: (props) => <span>{props.cell.row.index + 1}</span>,
      },
      // headersColumn("Purchase No", "purchaseNo"),
      {
        Header: "Purchase NO",
        accessor: "purchaseNo",
        className: "text-center wd-15p border-bottom-0",
        id: "purchaseNumberNew",

        Cell: (props) => (
          <div>
            <Link
              to={`/PurchaseDetailsById/${props.cell.row.original._id}`}
              target="_blank"
            >
              {props.value}
            </Link>
          </div>
        ),
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
        className: "text-center wd-15p border-bottom-0",
        id: "customerName",

        Cell: (props) => (
          <div>
            <Link
              to={`/admin_customers_by_id/${props.cell.row.original.customerId}`}
            >
              {props.value}
            </Link>
          </div>
        ),
      },
      {
        Header: "Product Type",
        accessor: "productType",
        className: "text-center wd-15p border-bottom-0",
        id: "tesingAbc",

        Cell: (props) => (
          <span>
            {props.value === "coated_sheets"
              ? "Coated Sheets"
              : "Neosteel TMT Bars"}
          </span>
        ),
      },
      {
        Header: "Date",
        accessor: "createdAt",
        className: "text-center wd-15p border-bottom-0",
        id: "createdAt",

        Cell: (props) => (
          <span>{moment(props.value).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        className: "text-center wd-15p border-bottom-0",
        id: "tesing123333",
        Cell: (props) => (
          <span
            className={
              props.value === "verified"
                ? "badge bg-success text-white rounded-pill"
                : props.value === "In Progress"
                ? "badge bg-warning text-white rounded-pill"
                : "badge bg-danger text-white rounded-pill"
            }
          >
            {props.value === "verified"
              ? "Verified"
              : props.value
              ? props.value
              : "Pending"}
          </span>
        ),
      },
      // {
      //   Header: "Actions",
      //   accessor: "invoice",
      //   className: "text-center wd-5dp border-bottom-0",

      //   // className: "text-center wd-15p border-bottom-0",

      //   Cell: (props) => (
      //     <>
      //       <div>
      //         <Button
      //           onClick={() => {
      //             setModalIMG(props.value);
      //             setModalPurchasesData(props.cell.row.original);
      //             largemodalShow();
      //             showModal(
      //               props.cell.row.original.invoice,
      //               props.cell.row.original._id,
      //               props.cell.row.original.oldInvoice,
      //               props.cell.row.original.remark,
      //               props.cell.row.original
      //             );
      //           }}
      //         >
      //           <i class="fe fe-list"></i>
      //         </Button>
      //       </div>
      //     </>
      //   ),
      // },
    ],
    []
  );
  const [InputShow, setInputShow] = useState(false);
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);

  //   const getData = async () => {

  //   };

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      let urlToBeSent = "";
      if (statusFromProps === "all") {
        urlToBeSent = getAllPurchases(localStorage.getItem("user_id"));
      } else {
        urlToBeSent = getPurchasesByStatus(statusFromProps);
      }
      const apiData = await urlToBeSent;
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log(`getData-${statusFromProps}`, apiData);
        setMainData(apiData.data);
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
  }, [statusFromProps]);

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
    console.log("status", status);
    console.log("invoiceNumber", invoiceNumber.length);
    console.log("mainAmount", mainAmount.length);
    console.log("productType", productType.length);
    console.log("quantity", quantity.length);
    if (
      (status === "verified" || status === "In Progress") &&
      (invoiceNumber.length === 0 ||
        mainAmount.length === 0 ||
        productType.length === 0 ||
        quantity.length === 0)
    ) {
      setErrorToast("Please Enter All Required Fildes");
      return;
    }
    if (
      (status === "re-upload" || status === "rejected") &&
      (!allRemakrs || allRemakrs.length === 0)
    ) {
      setErrorToast("Please Enter At Least One Remark");
      return;
    }

    setLoading(true);

    var bodyFormData = new FormData();
    bodyFormData.append("invoiceNumber", invoiceNumber);
    bodyFormData.append("gstNo", gstAmount);
    bodyFormData.append("amount", mainAmount);
    bodyFormData.append("customerName", mainData.name);
    bodyFormData.append("invoiceDate", invoiceDate);
    let qtyconvertedvalue = 0;
    if (uom === "KG") {
      qtyconvertedvalue = quantity;
    } else {
      qtyconvertedvalue = quantity * 1000;
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

  const addRemarks = () => {
    console.log("normalReason", normalReason);
    let mainRemarkNew = [...allRemakrs, normalReason];
    setAllRemakrs(mainRemarkNew);
  };
  const showModal = (
    invoice,
    purchaseId,
    invoiceOldFromRow,
    remarkFromRow,
    RowArray
  ) => {
    setHideButton(false);
    setQuantity("");
    setDealerName("");
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
    console.log("RowArray?.dealerName", RowArray?.dealerName);
    if (RowArray?.dealerName) {
      setDealerName(RowArray?.dealerName);
    }
    if (RowArray?.status) {
      setStatus(RowArray?.status);
    }
    largemodalShow();

    console.log("RowArray?.status", RowArray?.status);
    if (RowArray?.status === "verified") {
      console.log("verified status");
      setHideButton(true);
    }
  };

  const setErrorToast = (errorFromBackend) => {
    toast.error(
      <p className="text-white tx-16 mb-0" style={{ zIndex: 200000 }}>
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

  const checkButtonHideCondition = () => {
    if (showActions === true) {
      console.log("checkButtonHideCondition showActions", true);
      return true;
    } else if (hideButton === true) {
      console.log("checkButtonHideCondition hideButton", true);

      return true;
    } else {
      console.log("checkButtonHideCondition else", false);

      return false;
    }
    // showActions === true ? false : true || setHideButton ===  true ? true : false
  };

  useEffect(() => {
    getData();
  }, [getData, statusFromProps]);

  const tableInstance = useTable(
    {
      columns: COLUMN,
      data: mainData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps, // table props from react-table
    headerGroups, // headerGroups, if your table has groupings
    getTableBodyProps, // table body props from react-table
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state,
    setGlobalFilter,
    page, // use, page or rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`${statusFromProps.toUpperCase()} PURCHASES`}
        active="Customers"
        items={["Tables"]}
      />
      <ToastContainer />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                {loading ? (
                  <div className="dimmer active">
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                ) : (
                  <div className="e-table px-5 pb-5">
                    <div className="d-flex">
                      <select
                        className="mb-4 table-border me-1"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        {[10, 25, 50].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                      <GlobalResFilter
                        filter={globalFilter}
                        setFilter={setGlobalFilter}
                      />
                    </div>

                    <Table
                      {...getTableProps()}
                      className="table-bordered text-nowrap border-bottom"
                    >
                      <thead>
                        {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                className={column.className}
                              >
                                <span className="tabletitle">
                                  {column.render("Header")}
                                </span>
                                <span>
                                  {column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <i className="fa fa-angle-down"></i>
                                    ) : (
                                      <i className="fa fa-angle-up"></i>
                                    )
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                          prepareRow(row);
                          return (
                            <tr className="text-center" {...row.getRowProps()}>
                              {row.cells.map((cell) => {
                                return (
                                  <td {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="d-block d-sm-flex mt-4 ">
                      <span className="">
                        Page{" "}
                        <strong>
                          {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                      </span>
                      <span className="ms-sm-auto ">
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2 d-sm-inline d-block"
                          onClick={() => gotoPage(0)}
                          disabled={!canPreviousPage}
                        >
                          {" Previous "}
                        </Button>
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2"
                          onClick={() => {
                            previousPage();
                          }}
                          disabled={!canPreviousPage}
                        >
                          {" << "}
                        </Button>
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2"
                          onClick={() => {
                            previousPage();
                          }}
                          disabled={!canPreviousPage}
                        >
                          {" < "}
                        </Button>
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2"
                          onClick={() => {
                            nextPage();
                          }}
                          disabled={!canNextPage}
                        >
                          {" > "}
                        </Button>
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2"
                          onClick={() => {
                            nextPage();
                          }}
                          disabled={!canNextPage}
                        >
                          {" >> "}
                        </Button>
                        <Button
                          variant=""
                          className="btn-default tablebutton me-2 my-2"
                          onClick={() => gotoPage(pageCount - 1)}
                          disabled={!canNextPage}
                        >
                          {" Next "}
                        </Button>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="lg" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>
            {" "}
            Retailer : <b>{dealerNameMAIN}</b>{" "}
          </ModalTitle>
          <span className="d-flex ms-auto" onClick={largemodalClose}>
            <i className="fe fe-x ms-auto"></i>
          </span>
        </ModalHeader>
        <ModalBody>
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
                        <label htmlFor="">
                          Invoice Number <span className="text-danger"> *</span>
                        </label>
                        <input
                          className="form-control"
                          name="invoiceNumber"
                          onChange={(e) => {
                            setInvoiceNumber(e.target.value);
                          }}
                          defaultValue={invoiceNumber}
                          placeholder="Enter Invoice Number"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group border-1">
                        <label htmlFor="">
                          Amount<span className="text-danger"> *</span>
                        </label>

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
                      </div>
                    </div>
                    {/* <div className="col-lg-12">
                      <div className="form-group border-1">
                        <div className="container">
                          <div className="row">
                            <div className="col-lg-6">
                              {" "}
                              <label htmlFor="">Invoice Date :</label>
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
                                    showInvoiceDate || invoiceDate.length > 0
                                      ? true
                                      : false
                                  }
                                  name="mainAmount"
                                  onChange={(e) => {
                                    if (showInvoiceDate === true) {
                                      setShowInvoiceDate(false);
                                    } else {
                                      setShowInvoiceDate(true);
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
                              setInvoiceDate(e.target.value);
                            }}
                            defaultValue={invoiceDate}
                            placeholder="Enter Invoice Date"
                          />
                        ) : null}
                      </div>
                    </div> */}
                    <div className="col-lg-12">
                      <div className="form-group border-1">
                        <label htmlFor="">
                          Product Type<span className="text-danger"> *</span>
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
                    <div className="col-lg-12">
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
                    </div>
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
                      (status === "re-upload" || status === "rejected") && (
                        <div className="col-lg-12">
                          <div className="form-group border-1">
                            <div className="container">
                              <div className="row">
                                <div className="col-lg-10">
                                  <label htmlFor="">
                                    Select Reason{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    name=""
                                    id=""
                                    className="form-control"
                                    onChange={(e) => {
                                      console.log("eeeee", e.target);
                                      setNormalReason(e.target.value);
                                    }}
                                  >
                                    {status === "re-upload" ? (
                                      <>{changeStatusRemark("re-upload")}</>
                                    ) : (
                                      <>{changeStatusRemark("rejected")}</>
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
                                    (status === "re-upload" ||
                                      status === "rejected") && (
                                      <div className="col-lg-12 mt-5">
                                        <div className="form-group border-1">
                                          <Card>
                                            {allRemakrs &&
                                              allRemakrs.map((data, i) => {
                                                return <li>{data}</li>;
                                              })}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={largemodalClose}>
            Close
          </Button>
          {checkButtonHideCondition() === true ? (
            <Button disabled variant="primary" onClick={formsSubmit}>
              {loading ? "Loading...." : "Update Status"}
            </Button>
          ) : (
            <Button variant="primary" onClick={formsSubmit}>
              {loading ? "Loading...." : "Update Status"}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

PurchasesAdmin.defaultProps = {
  status: "all",
};

export default PurchasesAdmin;
