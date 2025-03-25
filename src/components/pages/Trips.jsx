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
import { addTrips, getAllCategories, getTripsWithTitle } from "../../utils/api";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import Select from "react-select";
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
    // Header: name.toUpperCase(),
    Header: (props) => (
      <div style={{ textAlign: "left" }}>
        <span>{name.toUpperCase()}</span>
      </div>
    ),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
    id: name,
    Cell: (props) => <div style={{ textAlign: "left" }}>{props.value}</div>,
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

const Trips = (props) => {
  const navigate = useNavigate();

  const [about, setAbout] = useState("");
  const [inclusion_exclusion, setinclusion_exclusion] = useState("abc");
  const [thingsToCarry, setThingsToCarry] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [cancellation_policy, setcancellation_policy] = useState("");
  const [rent_purchase_gears, setRent_purchase_gears] = useState("");
  const [how_to_reach, sethow_to_reach] = useState("");
  const [category, setCategory] = useState([]);
  const [multipleCategory, setMultipleCategory] = useState([]);

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);

  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const status = props.isactive;
  const apiStatus = status === true ? "true" : "false";
  const [stateName, setStateName] = useState("");
  const [InputShow, setInputShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [mainData, setMainData] = useState([]);
  const [categoriesData, setMainDataCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const COLUMN = useMemo(
    () => [
      {
        accessor: "_id",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
        Header: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>No</span>
          </div>
        ),
      },
      headersColumn("Title", "title"),
      headersColumn("Sub Title", "sub_title"),
      {
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

        Header: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>Active</span>
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "invoice",
        className: "text-center wd-5dp border-bottom-0",

        // className: "text-center wd-15p border-bottom-0",

        Cell: (props) => (
          <>
            <div>
              <Button
                onClick={() => {
                  navigate(`/admin/trips/${props.cell.row.original._id}`);
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
      const apiData = await getTripsWithTitle();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log(`data ${props.type}`, apiData.data);
        if (props.type === "Archive") {
          let myTrips = [];
          myTrips = apiData.data.filter((data, i) => {
            return data?.isArchive === true;
          });
          console.log("Archive", myTrips);
          setMainData(myTrips);
        } else {
          let myTrips = [];
          myTrips = apiData.data.filter((data, i) => {
            return data?.isArchive === false;
          });
          console.log("Archive", myTrips);
          setMainData(myTrips);
        }
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
  }, [setErrorToast, props.type]);
  const getDataCategories = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getAllCategories();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        let categoryNames = apiData.data
          .filter((data) => {
            return data.isActive;
          })
          .map((data, i) => {
            return { value: data._id, label: data.name };
          });
        console.log("categoryNames2", categoryNames);
        setMainDataCategories(categoryNames);
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
    getDataCategories();
  }, [props.type]);

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
    // for (var i = 0; i < multipleCategory.length; i++) {
    //   formData.append("categories[]", { value: multipleCategory[i].value);
    // // formData.append("categories[]", multipleCategory[i].label);
    // }

    formData.append("brochure", "");
    formData.append("about", about);
    const formJson = Object.fromEntries(formData.entries());

    addData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addTrips(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Trips Added !</p>,
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
  //   const updateData = async (body) => {
  //     setError("");
  //     setSuccessMessage("");

  //     setLoading(true);

  //     try {
  //       const apiData = await updateCity(body);
  //       if (apiData.error) {
  //         setError(apiData.error);
  //       } else {
  //         getData();
  //         largemodalClose();
  //         toast.success(
  //           <p className="text-white tx-16 mb-0">
  //             Success : City Updated !
  //           </p>,
  //           {
  //             position: toast.POSITION.TOP_RIGHT,
  //             hideProgressBar: false,
  //             autoClose: 3000,
  //             theme: "colored",
  //           }
  //         );
  //       }

  //     } catch (err) {
  //       console.log("err", err.name);
  //       if (err.response) {
  //         setError(err.response.data.message);
  //         setErrorToast(err.response.data.message);
  //       } else if (err.name === "AxiosError") {
  //         setError(err.message);
  //         setErrorToast(err.message);
  //       } else {
  //         setError("something went wrong");
  //         setErrorToast("something went wrong");
  //       }
  //     }

  //     setLoading(false);
  //   };
  useEffect(() => {
    getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Trips ${props.type === "NotArchive" ? "" : "Archived"}`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="">
                <div className="row">
                  <div className="col-lg-2">
                    {props.type !== "Archive" && (
                      <Button
                        className="me-3 mt-2"
                        variant="primary"
                        animation="flip"
                        onClick={() => {
                          navigate("/admin/AddTrip");
                        }}
                      >
                        Add Trip
                      </Button>
                    )}

                    <ToastContainer />

                    <Modal
                      style={{ maxHeight: "100%" }}
                      size="xl"
                      fullscreen
                      show={InputShow}
                      onHide={handleClose3}
                    >
                      <Modal.Header>
                        <Modal.Title>Add Trip</Modal.Title>
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
                              <div className="col-lg-4">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Title <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter title"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Sub Title{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="sub_title"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Sub Title"
                                  />
                                </div>
                              </div>
                              {/* <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                  Select  Category
                                    <span className="text-danger">*</span>
                                  </label>

                                  <Select
                                    classNamePrefix="Select"
                                    onChange={(e) => {
                                      setCategory(e.value);
                                    }}
                                    // isMulti
                                    // style={{ zIndex: "2000000" }}
                                    options={categoriesData}
                                    placeholder="Category"
                                  />
                                </div>
                              </div> */}
                              {/* <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                  Select Multiple Categories
                                    <span className="text-danger">*</span>
                                  </label>

                                    
                                  <Select
                                    classNamePrefix="Select"
                                    onChange={(e) => {
                                      // console.log("eee",e);
                                      setMultipleCategory(e);
                                      console.log("multiple",multipleCategory)
                                    }}
                                    isMulti
                                    style={{ zIndex: "2000000" }}
                                    options={categoriesData}
                                    placeholder="Multiple Category"
                                  />
                                </div>
                              </div> */}
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Difficulty
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="difficulty"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Difficulty"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Age Group
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="age_group"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Age Group"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Max Altitude
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="max_altitude"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Max Altitude"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Partial Payment Percentage
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    name="partial_percentage"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    max="100"
                                    placeholder="Enter Max Altitude"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Brochure
                                    {/* <span className="text-danger">*</span> */}
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    // required
                                    accept="pdf/*"
                                    onChange={(event) => {
                                      console.log(
                                        "change image",
                                        event.target.files[0]
                                      );
                                      setSelectedImage1(event.target.files[0]);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    About 2
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor
                                    height="50%"
                                    setOptions={{
                                      showPathLabel: false,
                                      height: "100px",
                                      placeholder: "Enter your text here!!!",
                                      plugins: [
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
                                      ],
                                      buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize", "formatBlock"],
                                        ["paragraphStyle"],
                                        [
                                          "bold",
                                          "underline",
                                          "italic",
                                          "strike",
                                          "subscript",
                                          "superscript",
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["removeFormat"],
                                        "/", // Line break
                                        ["outdent", "indent"],
                                        [
                                          "align",
                                          "horizontalRule",
                                          "list",
                                          "lineHeight",
                                        ],
                                        ["table", "link", "image"],
                                      ],
                                      formats: [
                                        "p",
                                        "div",
                                        "h1",
                                        "h2",
                                        "h3",
                                        "h4",
                                        "h5",
                                        "h6",
                                      ],
                                      font: [
                                        "Arial",
                                        "Calibri",
                                        "Comic Sans",
                                        "Courier",
                                        "Garamond",
                                        "Georgia",
                                        "Impact",
                                        "Lucida Console",
                                        "Palatino Linotype",
                                        "Segoe UI",
                                        "Tahoma",
                                        "Times New Roman",
                                        "Trebuchet MS",
                                      ],
                                    }}
                                    onChange={setAbout}
                                  />
                                </div>
                              </div>
                              {/* <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Inclusion & Exclusion{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor
                                    onChange={setinclusion_exclusion}
                                  />
                                </div>
                              </div>
                             
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Things to Carry
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor onChange={setThingsToCarry} />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Terms & Conditions
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor onChange={setTerms_conditions} />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Cancellation Policy
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor
                                    onChange={setcancellation_policy}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Rent/Purchase Gears 
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor
                                    onChange={setRent_purchase_gears}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                   How To Reach? 
                                    <span className="text-danger">*</span>
                                  </label>
                                  <SunEditor
                                    onChange={sethow_to_reach}
                                  />
                                </div>
                              </div> */}
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
    </div>
  );
};

export default Trips;
