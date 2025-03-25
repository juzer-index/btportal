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
  addCustomer,
  addTrips,
  getAllCategories,
  getTripsWithTitle,
} from "../../utils/api";
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
import CustomTextArea from "./CustomTextArea";
import MyEditor from "./CustomTextArea";
import EditorComponent from "./CustomTextArea";
import { Editor } from "@tinymce/tinymce-react";

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
const AddCustomer = (props) => {
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
    // setLoading(true);
    // try {
    //   const apiData = await getTripsWithTitle();
    //   if (apiData.error) {
    //     setError(apiData.error);
    //   } else {
    //     console.log(`data ${props.type}`, apiData.data);
    //     if (props.type === "Archive") {
    //       let myTrips = [];
    //       myTrips = apiData.data.filter((data, i) => {
    //         return data?.isArchive === true;
    //       });
    //       console.log("Archive", myTrips);
    //       setMainData(myTrips);
    //     } else {
    //       let myTrips = [];
    //       myTrips = apiData.data.filter((data, i) => {
    //         return data?.isArchive === false;
    //       });
    //       console.log("Archive", myTrips);
    //       setMainData(myTrips);
    //     }
    //   }
    // } catch (err) {
    //   console.log("err", err.name);
    //   if (err.response) {
    //     setError(err.response.data.message);
    //     setErrorToast(err.response.data.message);
    //   } else if (err.name === "AxiosError") {
    //     setError(err.message);
    //     setErrorToast(err.message);
    //   } else {
    //     setError("something went wrong");
    //     setErrorToast("something went wrong");
    //   }
    // }
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
    // getDataCategories();
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
    // formData.append("icon", selectedImage1);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addCustomer(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        // getData();
        handleClose3();
        // dispatch(fetchProjects());
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Data Added Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        navigate("/admin/Registered_customers");
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
        titles={`Add  Customer`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <ToastContainer />

          <Card>
            <form
              method="post"
              onSubmit={formsSubmit}
              autocomplete="off"
              encType="multipart/form-data"
            >
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          title :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          defaultValue={mainData && mainData?.title}
                          name="title"
                          placeholder="Enter  title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          First Name :
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          defaultValue={mainData && mainData?.firstName}
                          placeholder="Enter  firstName"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Middle Name :
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="middleName"
                          defaultValue={mainData && mainData?.middleName}
                          placeholder="Enter  Middle Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Last Name :
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          defaultValue={mainData && mainData?.lastName}
                          placeholder="Enter  last Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Suffix :
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="suffix"
                          defaultValue={mainData && mainData?.suffix}
                          placeholder="Enter  suffix"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Company Display Name :
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="companyDisplayName"
                          defaultValue={
                            mainData && mainData?.companyDisplayName
                          }
                          placeholder="Enter  companyDisplayName"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Company Name :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.name}
                          required
                          name="name"
                          placeholder="Enter  Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          required
                          defaultValue={mainData && mainData?.email}
                          name="email"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Mobile<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          name="mobile"
                          placeholder="Enter Mobile"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          phone Number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={mainData && mainData?.phoneNumber}
                          name="phoneNumber"
                          placeholder="Enter phoneNumber"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          fax
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.fax}
                          name="fax"
                          placeholder="Enter fax"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          other
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.other}
                          name="other"
                          placeholder="Enter other"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          website
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          defaultValue={mainData && mainData?.website}
                          name="website"
                          placeholder="Enter website"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Name To Print On Cheque
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={
                            mainData && mainData?.nameToPrintOnCheque
                          }
                          name="nameToPrintOnCheque"
                          placeholder="Enter name To Print On Cheque"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12"></div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          street Address 1
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.streetAddress1}
                          name="streetAddress1"
                          placeholder="Enter streetAddress1"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          street Address 2
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.streetAddress2}
                          name="streetAddress2"
                          placeholder="Enter streetAddress2"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          city
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.city}
                          name="city"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Province
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.province}
                          name="province"
                          placeholder="Enter province"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          PostalCode
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={mainData && mainData?.postalCode}
                          name="postalCode"
                          placeholder="Enter postalCode"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          country
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.country}
                          name="country"
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Customer Notes
                        </label>
                        <textarea
                          type="text"
                          className="form-control"
                          defaultValue={mainData && mainData?.notes}
                          name="notes"
                          placeholder="Enter notes"
                        ></textarea>
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
                      Add
                    </Button>
                  </>
                )}
                <Button
                  variant="danger"
                  onClick={() => {
                    navigate("/admin/Registered_customers");
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddCustomer;
