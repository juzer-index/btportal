import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./DataTable.module.scss";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  defaultColumn,
} from "react-table";
import "react-data-table-component-extensions/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCities,
  addCity,
  updateCity,
  addSliderImagesURL,
  getSliderImages,
  getSections,
  addSection,
  updateSection,
  getTestimonials,
  addTestimonials,
  updateTestimonials,
  getVideos,
  addVideo,
  deleteVideo,
  getCoupons,
  createCoupons,
  updateCoupons,
} from "../../utils/api";
import { Outlet, Link } from "react-router-dom";
import SunEditor from "suneditor-react";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  image,
  link,
} from "suneditor/src/plugins";
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
import { StatusButton } from "../StatusButton";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "wd-15p border-bottom-0 text-left",
    id: name,
    // Cell: (props) => <div style={{textAlign:"left"}}>{value2}</div>,
  };
};

function compareNumericString(rowA, rowB, id, desc) {
  if (rowB.values.isActive === false) return 1;
  if (rowB.values.isActive === true) return -1;
  return 0;
}
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

const Coupons = (props) => {
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);
  const [description, setDescription] = useState("");
  const [deletedVideoIdBackend, setDeletedVideoId] = useState("");

  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const status = props.isactive;
  const apiStatus = status === true ? "true" : "false";
  const [stateName, setStateName] = useState("");
  const [InputShow, setInputShow] = useState(false);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const COLUMN = useMemo(
    () => [
      {
        Header: "No",
        accessor: "_id",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Type",
        accessor: "typeOfCoupon",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Coupon Code Amount (Rs/%)",
        accessor: "amount",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Max Coupon Code Amount",
        accessor: "maxAmount",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Min Amount",
        accessor: "minAmount",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Active",
        accessor: "isActive",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>
              {props.value ? (
                <StatusButton bg="success" />
              ) : (
                <StatusButton bg="danger" />
              )}
            </span>
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "_id",
        className: "text-center wd-5dp border-bottom-0",
        id: "testing",
        // className: "text-center wd-15p border-bottom-0",
        Cell: (props) => (
          <>
            <div>
              <Button
                onClick={() => {
                  largemodalShow();
                  setModalData(props.cell.row.original);
                }}
              >
                <i class="fe fe-list"></i>
              </Button>
            </div>
          </>
        ),
      },
    ],
    []
  );

  // const showModal = (
  //   invoice,
  //   purchaseId,
  //   invoiceOldFromRow,
  //   remarkFromRow,
  //   RowArray
  // ) => {
  //   setHideButton(false);
  //   setQuantity("");
  //   setDealerName("");
  //   setShowMainAmount(false);
  //   setMainAmount("");
  //   setShowInvoiceDate(false);
  //   setInvoiceDate("");
  //   setShowInvoiceNumber(false);

  //   setInvoiceNumber("");
  //   setShowProductType(false);

  //   setProductType("");
  //   setShowQuantity(false);

  //   // showQuantity(false);
  //   setModalInvoice(invoice);
  //   console.log("invoiceOldFromRow", invoiceOldFromRow);
  //   setModalInvoiceOld(invoiceOldFromRow);
  //   setPurchaseIdFromRow(purchaseId);
  //   allRemarkBackend(remarkFromRow);
  //   console.log("RowArray", RowArray);
  //   if (RowArray?.invoiceProperties?.amount?.length > 0) {
  //     setMainAmount(RowArray?.invoiceProperties?.amount);
  //     setShowMainAmount(true);
  //   }
  //   if (RowArray?.invoiceProperties?.invoiceDate?.length > 0) {
  //     setInvoiceDate(RowArray?.invoiceProperties?.invoiceDate);
  //     setShowInvoiceDate(true);
  //   }
  //   if (RowArray?.invoiceProperties?.invoiceNumber?.length > 0) {
  //     setInvoiceNumber(RowArray?.invoiceProperties?.invoiceNumber);
  //     setShowInvoiceNumber(true);
  //   }
  //   if (RowArray?.invoiceProperties?.productType?.length > 0) {
  //     setProductType(RowArray?.invoiceProperties?.productType);
  //     setShowProductType(true);
  //   }
  //   if (RowArray?.quantity) {
  //     setQuantity(RowArray.quantity);
  //     setShowQuantity(true);
  //   }
  //   console.log("RowArray?.dealerName",RowArray?.dealerName)
  //   if (RowArray?.dealerName) {
  //     setDealerName(RowArray?.dealerName);
  //   }
  //   if (RowArray?.status) {
  //     setStatus(RowArray?.status);
  //   }
  //   largemodalShow();

  //   console.log("RowArray?.status",RowArray?.status);
  //   if(RowArray?.status === "verified")
  //   {
  //     console.log("verified status");
  //     setHideButton(true);
  //   }

  // };

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
    try {
      const apiData = await getCoupons();
      if (apiData.error) {
        setError(apiData.error);
      } else {
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
  }, [setErrorToast]);

  useEffect(() => {
    getData();
  }, []);

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
  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    //     if (description.length > 0) {
    //       formData.append("description", description);
    //     }
    // formData.append("icon", selectedImage1Update);
    // console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
  };
  const formsSubmitUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("icon", selectedImage1Update);
    // formData.append("description", description);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    updateData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await createCoupons(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Coupon Added !</p>,
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
  const updateData = async (body) => {
    console.log("updateData", body);
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      if (true) {
        const apiData = await updateCoupons(body);
        if (apiData.error) {
          setError(apiData.error);
        } else {
          getData();
          largemodalClose();
          toast.success(
            <p className="text-white tx-16 mb-0">Success : Updated !</p>,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: false,
              autoClose: 3000,
              theme: "colored",
            }
          );
          setDeletedVideoId("");
        }
      } else {
        setErrorToast("Id Not Found !!!");
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
  useEffect(() => {
    // getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`Coupons`} active="Coupons" items={["Tables"]} />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="">
                <div className="row">
                  <div className="col-lg-2">
                    <Button
                      className="me-3 mt-2"
                      variant="primary"
                      animation="flip"
                      onClick={handleShow3}
                    >
                      Add Coupon
                    </Button>
                    <ToastContainer />

                    <Modal size="xl" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add </Modal.Title>
                        <span className="d-flex ms-auto" onClick={handleClose3}>
                          <i className="fe fe-x ms-auto"></i>
                        </span>
                      </Modal.Header>
                      <form
                        method="post"
                        onSubmit={formsSubmit}
                        autocomplete="off"
                        encType="multipart/form-data"
                      >
                        <Modal.Body>
                          <div className="container">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    placeholder="Enter Name"
                                    type="text"
                                    name="name"
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Description
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    placeholder="Enter description"
                                    type="text"
                                    name="description"
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    TypeOfCoupon
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    placeholder="Enter description"
                                    name="typeOfCoupon"
                                    required
                                    className="form-control"
                                  >
                                    <option value="percentage">
                                      Percentage
                                    </option>
                                    <option value="amount">Amount</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Amount
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    placeholder="Enter Amount In % / Rs "
                                    type="number"
                                    name="amount"
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Max Amount
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    placeholder="Enter Max Coupon Code Amount"
                                    type="number"
                                    name="maxAmount"
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Min Amount
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    placeholder="Enter Minimum Coupon Code Amount To Apply This Promocode"
                                    type="number"
                                    name="minAmount"
                                    required
                                    className="form-control"
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
                                Save Changes
                              </Button>
                            </>
                          )}
                          <Button variant="danger" onClick={handleClose3}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </form>
                    </Modal>
                  </div>
                </div>
              </div>
            </Card.Header>
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
      <Modal size="xl" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>Update</ModalTitle>
          <span className="d-flex ms-auto" onClick={largemodalClose}>
            <i className="fe fe-x ms-auto"></i>
          </span>
        </ModalHeader>
        <form
          method="post"
          onSubmit={formsSubmitUpdate}
          autocomplete="off"
          encType="multipart/form-data"
        >
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      defaultValue={modalData?.name}
                      placeholder="Enter Name"
                      type="text"
                      name="name"
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Description
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      defaultValue={modalData?.description}
                      placeholder="Enter description"
                      type="text"
                      name="description"
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      TypeOfCoupon
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      placeholder="Enter description"
                      name="typeOfCoupon"
                      required
                      className="form-control"
                    >
                      <option
                        selected={
                          modalData?.typeOfCoupon === "percentage"
                            ? true
                            : false
                        }
                        value="percentage"
                      >
                        Percentage
                      </option>
                      <option
                        selected={
                          modalData?.typeOfCoupon === "amount" ? true : false
                        }
                        value="amount"
                      >
                        Amount
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Amount
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      defaultValue={modalData?.amount}
                      placeholder="Enter Amount In % / Rs "
                      type="number"
                      name="amount"
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Max Amount
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      placeholder="Enter Max Coupon Code Amount"
                      type="number"
                      name="maxAmount"
                      required
                      defaultValue={modalData?.maxAmount}
                      className="form-control"
                    />
                    <input
                      type="hidden"
                      name="id"
                      required
                      value={modalData?._id}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Min Amount
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      placeholder="Enter Minimum Coupon Code Amount To Apply This Promocode"
                      type="number"
                      defaultValue={modalData?.minAmount}
                      name="minAmount"
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Active
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      placeholder="Enter description"
                      name="isActive"
                      required
                      className="form-control"
                    >
                      <option
                        selected={modalData?.isActive === true ? true : false}
                        value="true"
                      >
                        Yes
                      </option>
                      <option
                        selected={modalData?.isActive === false ? true : false}
                        value="false"
                      >
                        No
                      </option>
                    </select>
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
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="danger" onClick={largemodalClose}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;
