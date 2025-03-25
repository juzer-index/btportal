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
  getAllCities,
  addCity,
  updateCity,
  getSectionById,
  getTripsWithTitle,
  addTripInSections,
  deleteTripFromSection,
  getEnquiryById,
  addDetailsToEnquiry,
} from "../../utils/api";
import { Outlet, Link, useParams } from "react-router-dom";
import Select from "react-select";
import moment from "moment";

import {
  Tab,
  Row,
  Col,
  Nav,
  Card,
  Button,
  Modal,
  ModalBody,
  ModalTitle,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";

const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
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

const SectionById = (props) => {
  let { id } = useParams();

  const [deleteImgageID, setDeleteImgageID] = useState(false);
  const [deleteTripId, setDeleteTripId] = useState("");

  const [selectedTripId, setSelectedTripId] = useState("");
  const [InputShow3, setInputShow3] = useState(false);
  const handleClose33 = () => setInputShow3(false);
  const handleShow33 = () => setInputShow3(true);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);

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
  const [mainData2, setMainData2] = useState([]);
  const [mainData3, setMainData3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const COLUMN = useMemo(() => [], []);

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
    try {
      let obj = {
        id,
      };
      const data = await getEnquiryById(obj);
      if (data.data) {
        console.log(data.data, "main");
        setMainData(data.data);
        setMainData2(data.data?.details);
      } else {
        setError("Something Went Wrong !! ");
      }
      const data2 = await getTripsWithTitle();
      if (data2.data) {
        console.log(data2.data, "data2");
        let tripTitles = data2.data
          .filter((data) => {
            return data.isActive;
          })
          .map((data, i) => {
            return { value: data._id, label: data.title };
          });
        console.log("tripTitles", tripTitles);
        setMainData3(tripTitles);
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
  }, []);

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
    // formData.append("sectionId", id);
    // formData.append("tripId", selectedTripId);
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
    formData.append("tripId", deleteTripId);
    formData.append("sectionId", id);
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
      const apiData = await addDetailsToEnquiry(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Details Added !</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setSelectedTripId();
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
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await deleteTripFromSection(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Trip Deleted !</p>,
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
  useEffect(() => {
    getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Enquiry Details`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header className="">
              <div className="">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="">
                        Name <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData && mainData?.name}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="">
                        Email <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData && mainData?.email}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="">
                        Message <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData && mainData?.message}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="">
                        Contact Person <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData && mainData?.contactPerson?.firstName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ToastContainer />
            </Card.Header>
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
                      Add Details
                    </Button>
                    <ToastContainer />

                    <Modal size="l" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add Details</Modal.Title>
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
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Enter Details
                                  </label>
                                  <textarea
                                    name="description"
                                    className="form-control"
                                    id=""
                                  ></textarea>
                                  <input
                                    type="hidden"
                                    value={mainData?._id}
                                    name="enquiryID"
                                    className="formcontrol"
                                  />
                                  <input
                                    type="hidden"
                                    value={mainData?.contactPersonId}
                                    name="contactPersonId"
                                    className="formcontrol"
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
              <div className="panel panel-info">
                <Tab.Container id="left-tabs-example" defaultActiveKey="firstC">
                  {/* <Nav
                      variant="pills"
                      className="panel-tabs nav-tabs panel-info"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="firstC">
                          <i className="fa fa-plane fa-2"></i>Trips
                        </Nav.Link>
                      </Nav.Item>
                    
                    </Nav> */}

                  <Tab.Content>
                    <Tab.Pane eventKey="firstC">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Description</th>
                            <th>Date</th>
                            {/* <th>Actions</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {mainData2 &&
                            mainData2?.map((data2, i) => {
                              //   if (!data2.title) {
                              //     return null; // Skip rendering if the title is blank
                              //   }

                              return (
                                <tr>
                                  <td>{i + 1}</td>
                                  <td>{data2?.description}</td>
                                  <td>
                                    {data2
                                      ? moment(data2?.date).format(
                                          "DD-MM-YYYY / HH:mm A"
                                        )
                                      : ""}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="l" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>Delete</ModalTitle>
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
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Are You Sure Want To Delete This Trip From Section ?
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <ModalFooter>
            <Button variant="secondary" onClick={largemodalClose}>
              Close
            </Button>

            <Button variant="primary" type="submit">
              {loading ? "Loading...." : "Update"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default SectionById;
