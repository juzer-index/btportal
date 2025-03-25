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
  addInvoice,
  getCustomerPurchases,
  getCustomers,
  updateCustomerPurchaseReupload,
} from "../../utils/api";
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";

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
  Form,
  Collapse,
  Table,
} from "react-bootstrap";
import moment from "moment/moment";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
  };
};
const COLUMN = [
  {
    Header: "No",
    accessor: "_id",
    className: "text-center wd-15p border-bottom-0",

    Cell: (props) => <span>{props.cell.row.index + 1}</span>,
  },
  headersColumn("Amount", "amount"),
  headersColumn("Quantity", "quantity"),
  headersColumn("Dealer", "dealerId"),
  {
    Header: "Invoice",
    accessor: "invoice",
    className: "text-center wd-15p border-bottom-0",

    Cell: (props) => (
      <a href={props.value} download={true}>
        <img
          src={props.value}
          style={{ width: "100px", height: "100px" }}
          alt=""
        />
      </a>
    ),
  },
  {
    Header: "Verified",
    accessor: "isVerified",
    className: "text-center wd-15p border-bottom-0",
    id: "anuj",

    Cell: (props) => <span>{props.value ? "Yes" : "No"}</span>,
  },
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

const CustomerPurchases = (props) => {
  let navigate = useNavigate();

  let { id } = useParams();
  const type = props.type;
  console.log("type", type);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [InputShow, setInputShow] = useState(false);
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [purchaseID, setPurchaseID] = useState("");
  const [loading, setLoading] = useState(false);

  //   const getData = async () => {

  //   };

  const openModal = (purchaseIDFromRow, oldinvoiceFromRow, oldRemarkRow) => {
    console.log("oldinvoiceFromRowoldinvoiceFromRow", oldinvoiceFromRow);
    handleShow3();
    setPurchaseID(purchaseIDFromRow);
    setSelectedImage2(oldinvoiceFromRow);
    setRemarks(oldRemarkRow);
  };
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getCustomerPurchases(id);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData", apiData);
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
  }, []);

  const formsSubmit = (e) => {
    if (selectedImage1) {
      setLoading(true);
      e.preventDefault();
      var bodyFormData = new FormData();
      console.log("selectedImage1", selectedImage1);
      bodyFormData.append("purchaseId", purchaseID);
      bodyFormData.append("customerId", id);
      bodyFormData.append("invoice", selectedImage1);
      console.log("bodyFormData", bodyFormData);
      uploadInvoice(bodyFormData);
    } else {
      setError("Please Selected Image");
    }
  };
  const uploadInvoice = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await updateCustomerPurchaseReupload(body);
      if (apiData.error) {
        setError(apiData.error ? apiData.error : apiData.messages);
      } else {
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Purchase Uploaded Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 4000,
            theme: "colored",
          }
        );
        getData();
        navigate(`/CustomerThankYouPage/${id}`);
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

  useEffect(() => {
    getData();
  }, [getData]);

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

  const reTurnColor = (status) => {
    if (status === "verified") {
      return "bg-success";
    } else if (status === "re-upload") {
      return "bg-danger";
    } else if (status === "updated") {
      return "bg-info";
    } else if (status === "rejected") {
      return "bg-gray";
    } else {
      return "bg-purple";
    }
  };

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles="My Lucky Draw Entries"
        active="Customers"
        items={["Tables"]}
      />
      <ToastContainer />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <div className="container">
              <div className="row">
                {type === "all" &&
                  mainData &&
                  mainData.length > 0 &&
                  mainData.map((data, i) => {
                    return (
                      <div className="col-lg-6">
                        <div
                          onClick={() => {
                            if (data.status === "re-upload") {
                              openModal(data._id, data.invoice, data.remark);
                            }

                            // navigate(`/customer_tokens/${mainData._id}`);
                          }}
                          className={`my-5 card ${reTurnColor(
                            data.status
                          )} img-card box-red-shadow`}
                          style={{ cursor: "pointer" }}
                        >
                          {/* <Button onClick={handleShow3}> */}
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="text-white">
                                <h4 className="mb-0 number-font">
                                  {moment(data.createdAt).format("DD/MM/YYYY")}
                                </h4>
                                <br />
                                <span>
                                  <strong>Retailer: </strong>{" "}
                                  {data.retailer_name}
                                </span>
                                <br />

                                {data.invoiceProperties?.productType.length >
                                0 ? (
                                  <>
                                    <span>
                                      {" "}
                                      <strong>Product: </strong>{" "}
                                      {data.invoiceProperties?.productType}
                                    </span>
                                    <br />
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      <strong>Product: </strong>{" "}
                                      {data.productType == "coated_sheets"
                                        ? "Coated Sheets"
                                        : "Neosteel TMT Bars"}
                                    </span>
                                    <br />
                                  </>
                                )}
                                {data.invoiceProperties?.amount.length > 0 ? (
                                  <>
                                    <span>
                                      {" "}
                                      <strong>Amount: </strong>{" "}
                                      {data.invoiceProperties?.amount}
                                    </span>
                                  </>
                                ) : null}
                                {data.status != "verified" &&
                                data.remark?.length > 0 ? (
                                  <>
                                    <span>
                                      {" "}
                                      <strong>Remark: </strong> <br />
                                      {data.remark &&
                                        data.remark.map((data, i) => {
                                          return (
                                            <>
                                              <span
                                                style={{ marginLeft: "20px" }}
                                                className="ml-5"
                                              >
                                                {i + 1}.{data}
                                              </span>
                                              <br />{" "}
                                            </>
                                          );
                                        })}
                                    </span>
                                  </>
                                ) : null}
                              </div>

                              <div className="ms-auto text-center">
                                {/* <i className="fa fa-database text-white fs-30 me-2 mt-2" /> */}
                                <div>
                                  <span className="h6 badge rounded-pill bg-yellow text-white px-2">
                                    {data.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* <small>
                              <a
                                href={data?.invoice}
                                className="text-white"
                                style={{ fontSize: "15px" }}
                              >
                                <i className="fa fa-download  fs-15 me-2 mt-2" />
                                Download Invoice
                              </a>
                            </small> */}
                          </div>
                          {/* </Button> */}
                        </div>
                      </div>
                    );
                  })}
                {type === "re-upload" &&
                  mainData &&
                  mainData.length > 0 &&
                  mainData.map((data, i) => {
                    return (
                      <div
                        className="col-lg-6"
                        style={{
                          display: data?.status === "re-upload" ? "" : "none",
                        }}
                      >
                        <div
                          onClick={() => {
                            openModal(data._id, data.invoice, data.remark);
                            // navigate(`/customer_tokens/${mainData._id}`);
                          }}
                          className="my-5 card bg-green img-card box-red-shadow"
                          style={{ cursor: "pointer" }}
                        >
                          {/* <Button onClick={handleShow3}> */}
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="text-white">
                                <h4 className="mb-0 number-font">
                                  {moment(data.createdAt).format("DD/MM/YYYY")}
                                </h4>
                                <br />
                                <span>
                                  <strong>Retailer: </strong>{" "}
                                  {data.retailer_name}
                                </span>
                                <br />

                                {data.invoiceProperties?.amount.length > 0 ? (
                                  <>
                                    <span>
                                      <strong>Amount: </strong>{" "}
                                      {data.invoiceProperties?.amount}
                                    </span>{" "}
                                    <br />
                                  </>
                                ) : null}
                                {data.invoiceProperties?.productType.length >
                                0 ? (
                                  <>
                                    {" "}
                                    <span>
                                      {" "}
                                      <strong>Product: </strong>{" "}
                                      {data.invoiceProperties?.productType}
                                    </span>
                                    <br />
                                  </>
                                ) : null}
                                <span>
                                  {" "}
                                  <strong>Remark: </strong> <br />
                                  {data.remark &&
                                    data.remark.map((data, i) => {
                                      return (
                                        <>
                                          <span
                                            style={{ marginLeft: "20px" }}
                                            className="ml-5"
                                          >
                                            {i + 1}.{data}
                                          </span>
                                          <br />{" "}
                                        </>
                                      );
                                    })}
                                </span>
                              </div>
                              <div className="ms-auto text-center">
                                {/* <i className="fa fa-database text-white fs-30 me-2 mt-2" /> */}
                                <div>
                                  <span className="badge rounded-pill bg-yellow">
                                    {data.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* <br />
                            <div className="ms-auto text-left">
                              <Button variant="primary">
                                <i className="fa fa-upload  fs-15 me-2 mt-2" />
                                Upload New Invoice
                              </Button>
                            </div>
                            <br />
                            <div className="ms-auto mt-44 text-left">
                              <Button variant="primary">
                                <i className="fa fa-download  fs-15 me-2 mt-2" />
                                Download Sumitted Invoice
                              </Button>
                            </div> */}
                          </div>
                          {/* </Button> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* <Card.Body>
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
            </Card.Body> */}
          </Card>
        </Col>
        <Modal
          size="md"
          show={InputShow}
          onHide={handleClose3}
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>Re-Submit Your Entry</Modal.Title>

            <span className="d-flex ms-auto" onClick={handleClose3}>
              <i className="fe fe-x ms-auto"></i>
            </span>
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
                    <form
                      method="post"
                      onSubmit={formsSubmit}
                      autoComplete="off"
                      encType="multipart/form-data"
                    >
                      <div className="container">
                        <div className="row">
                          {selectedImage2 && (
                            <div className="col-lg-12">
                              {" "}
                              <div className="mb-3">
                                <label className="form-label mt-0">
                                  Old Invoice
                                  <span className="text-danger">*</span>
                                </label>
                                {selectedImage2 && (
                                  <img
                                    src={selectedImage2}
                                    style={{ width: "100%", height: "300px" }}
                                  />
                                )}
                                {remarks && (
                                  <>
                                    <strong>Remark: </strong> <br />
                                    {remarks &&
                                      remarks.map((data, i) => {
                                        return (
                                          <>
                                            <span
                                              style={{ marginLeft: "20px" }}
                                              className="ml-5"
                                            >
                                              {i + 1}.{data}
                                            </span>
                                            <br />{" "}
                                          </>
                                        );
                                      })}
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="col-lg-12">
                            {" "}
                            <div className="mb-3">
                              <label className="form-label mt-0">
                                Please upload invoice with corrected details as
                                mentioned in the remarks{" "}
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
                      </div>
                    </form>
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

              <Button variant="danger" onClick={handleClose3}>
                Close
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </Row>
    </div>
  );
};

export default CustomerPurchases;
