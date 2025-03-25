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
import Stack from "@mui/material/Stack";
// import { Outlet, Link, useNavigate } from "react-router-dom";

import {
  getAllCities,
  addCity,
  updateCity,
  addCategory,
  updateCategory,
  getAllCategories,
  getAllBookings,
  getTripsWithTitle,
} from "../../utils/api";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { StatusButton } from "../StatusButton.jsx";
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

const Bookings = (props) => {
  const navigate = useNavigate();

  //bookings filter
  const [filterByBooking, setFilterByBooking] = useState("");
  const [filterByStartDate, setFilterByStartDate] = useState("");
  const [filterByEndDate, setFilterByEndDate] = useState("");
  const [filterByDepartureDate, setFilterByDepartureDate] = useState("");
  const [filterByTrips, setFilterByTrips] = useState("");
  const [filterByBookingStatus, setFilterByBookingStatus] = useState("");
  const [filterByPayment, setFilterByPayment] = useState("");
  const [tripsData, setTripsData] = useState([]);
  const [bookingsStatus, setBookingsStatus] = useState([
    {
      label: "Unconfirmed",
      value: "Unconfirmed",
      id: 1,
    },
    {
      label: "Confirmed",
      value: "Confirmed",
      id: 2,
    },
    {
      label: "Cancelled",
      value: "Cancelled",
      id: 3,
    },
  ]);
  const [paymentModeStatus, setPaymentModeStatus] = useState([
    {
      label: "Online",
      value: "Website",
      id: 1,
    },
    {
      label: "Offline",
      value: "Offline",
      id: 2,
    },
    {
      label: "Partial",
      value: "Partial",
      id: 3,
    },
  ]);
  const [pendingitems, setPendingitems] = useState([
    {
      label: "Yes",
      value: "Yes",
      id: 1,
    },
    {
      label: "No",
      value: "No",
      id: 2,
    },
  ]);

  const getDataTrips = useCallback(async () => {
    // setLoading(true);
    try {
      const apiData = await getTripsWithTitle();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("data", apiData.data);
        let tripsByName = apiData.data
          .filter((data) => {
            return data.isActive;
          })
          .map((data, i) => {
            return { value: data._id, label: data.title };
          });
        console.log("tripsByName", tripsByName);
        setTripsData(tripsByName);
        // setTripsData(apiData.data);
      }
    } catch (err) {
      console.log("err", err.name);
      if (err.response) {
        // setError(err.response.data.message);
        // setErrorToast(err.response.data.message);
      } else if (err.name === "AxiosError") {
        // setError(err.message);
        // setErrorToast(err.message);
      } else {
        // setError("something went wrong");
        // setErrorToast("something went wrong");
      }
    }
    // setLoading(false);
  }, []);

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
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const COLUMN = useMemo(
    () => [
      {
        Header: "No",
        accessor: "test",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
      },

      {
        Header: "Trip",
        accessor: "trip_name",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Customer Mobile",
        accessor: "customer_mobile",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "City",
        accessor: "trip_city",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Amount",
        accessor: "trip_amount",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Booking Status",
        accessor: "bookingStatus",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>
              {props.value === "Unconfirmed" ? (
                <StatusButton value={props.value} bg="warning" />
              ) : (
                <StatusButton value={props.value} bg="success" />
              )}
            </span>
          </div>
        ),
      },
      // {
      //   Header: "Active",
      //   accessor: "isActive",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted:"true",

      //   Cell: (props) =>  <div style={{textAlign:"left"}}><span>{props.value ? <StatusButton bg="success" /> : <StatusButton bg="danger"/>}</span></div>,
      // },
      // {
      //   Header: "Show To Home Screen",
      //   accessor: "showHomeScreen",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted:"true",

      //   Cell: (props) =>  <div style={{textAlign:"left"}}><span>{props.value ? <StatusButton bg="success" /> : <StatusButton bg="danger"/>}</span></div>,
      // },
      // {
      //   Header: "Image",
      //   accessor: "icon",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted:"true",

      //   Cell: (props) =>  <div style={{textAlign:"left"}}>
      //     <a href={props.value} download>
      //     <img src={props.value} style={{width:"100px",height:"100px"}} loading="lazy" alt="" />
      //     </a>

      //   </div>,
      // },
      {
        Header: "Booking ID",
        accessor: "_id",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
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
                  navigate(
                    `/admin/BookingsDetails/${props.cell.row.original._id}`
                  );
                }}
              >
                <i className="fe fe-list"></i>
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
      const apiData = await getAllBookings();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("bookingData", apiData.data);
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
    getDataTrips();
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
    formData.append("icon", selectedImage1);

    const formJson = Object.fromEntries(formData.entries());
    console.log("addData", formJson);
    addData(formJson);
    setLoading(false);
  };
  const formsSubmitUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("icon", selectedImage1);

    const formJson = Object.fromEntries(formData.entries());
    updateData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addCategory(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        setSelectedImage1("");
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Category Added !</p>,
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
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateCategory(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Category Updated !</p>,
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

  const getdatabyid = (mainArray, id) => {
    console.log("getdatabyid called", mainArray, id);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => obj._id === id);
    return filteredArray && filteredArray.length > 0 ? filteredArray : null;
  };
  const getdatabybetweenStartAndEndDate = (
    mainArray,
    startDateValue,
    EndDateValue
  ) => {
    console.log("getdatabybetweenStartAndEndDate called", mainArray);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => {
      const createdAtDate = new Date(obj.createdAt);
      const startDate = new Date(startDateValue);
      const endDate = new Date(EndDateValue);
      console.log("createdAtDate", createdAtDate);
      console.log("startDate", startDate);
      console.log("endDate", endDate);
      return createdAtDate >= startDate && createdAtDate <= endDate;
    });
    console.log("filteredArray", filteredArray);

    return filteredArray;
  };
  const getDataByDepartureDate = (mainArray, startDateValue) => {
    console.log("getdatabybetweenStartAndEndDate called", mainArray);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => {
      const createdAtDate = new Date(obj.bookingDate);
      const startDate = new Date(startDateValue);
      console.log("createdAtDate", createdAtDate);
      console.log("startDate", startDate);
      return createdAtDate === startDate;
    });
    console.log("filteredArray", filteredArray);

    return filteredArray;
  };
  const getDataByTrips = (mainArray, selectedTripId) => {
    console.log("getDataByTrips called", mainArray);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => {
      const trip_id = obj.trip_id;
      console.log("trip_id", trip_id);
      console.log("selectedTripId", selectedTripId);
      return trip_id === selectedTripId;
    });
    console.log("filteredArray", filteredArray);

    return filteredArray;
  };
  const getDataByStatus = (mainArray, selectedStatus) => {
    console.log("getDataByTrips called", mainArray);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => {
      const bookingStatus = obj.bookingStatus;
      console.log("bookingStatus", bookingStatus);
      console.log("selectedStatus", selectedStatus);
      return bookingStatus === selectedStatus;
    });
    console.log("filteredArray", filteredArray);

    return filteredArray;
  };
  const getDataByBookingType = (mainArray, selectedBookingType) => {
    console.log("getDataByTrips called", mainArray);
    if (!mainArray) {
      return null;
    }
    const filteredArray = mainArray.filter((obj) => {
      const bookingType = obj.bookingType;
      console.log("bookingType", bookingType);
      console.log("selectedBookingType", selectedBookingType);
      return bookingType === selectedBookingType;
    });
    console.log("filteredArray", filteredArray);

    return filteredArray;
  };
  const applyFilterFunction = () => {
    console.log("applyFilterFunction called", mainData);
    let myArray = [];

    if (filterByBooking) {
      console.log("filterByBooking called", filterByBooking);
      myArray = getdatabyid(mainData, filterByBooking);
    }
    if (filterByStartDate) {
      if (mainData && mainData.length === 0) {
        getData();
      }

      console.log(
        "filterByStartDate called",
        filterByStartDate,
        filterByEndDate
      );
      myArray = getdatabybetweenStartAndEndDate(
        mainData,
        filterByStartDate,
        filterByEndDate
      );
      console.log("filterByStartDate data", myArray);
    }
    if (filterByDepartureDate) {
      if (mainData && mainData.length === 0) {
        getData();
      }

      console.log("filterByDepartureDate called", filterByDepartureDate);
      myArray = getDataByDepartureDate(mainData, filterByDepartureDate);
      console.log("filterByDepartureDate data", myArray);
    }
    if (filterByTrips) {
      if (mainData && mainData.length === 0) {
        getData();
      }

      console.log("filterByTrips called", filterByTrips);
      myArray = getDataByTrips(mainData, filterByTrips);
      console.log("filterByDepartureDate data", myArray);
    }
    if (filterByPayment) {
      if (mainData && mainData.length === 0) {
        getData();
      }

      console.log("filterByPayment called", filterByPayment);
      myArray = getDataByStatus(mainData, filterByPayment);
      console.log("filterByPayment data", myArray);
    }
    if (myArray && myArray.length > 0) {
      console.log("setMainData", myArray);
      setMainData(myArray);
    } else {
      setMainData([]);
    }
    // setMainData(myArray);
    {
      /* const [filterByBooking, setFilterByBooking] = useState("");
  const [filterByStartDate, setFilterByStartDate] = useState("");
  const [filterByEndDate, setFilterByEndDate] = useState("");
  const [filterByDepartureDate, setFilterByDepartureDate] = useState("");
  const [filterByTrips, setFilterByTrips] = useState("");
  const [filterByBookingStatus, setFilterByBookingStatus] = useState("");
  const [filterByPayment, setFilterByPayment] = useState(""); */
    }
  };
  const clearFilterFunction = () => {
    // alert("clear");
    setFilterByBooking("");
    setFilterByStartDate("");
    setFilterByStartDate("");
    setFilterByEndDate("");
    setFilterByDepartureDate("");
    setFilterByTrips("");
    setFilterByBookingStatus("");
    setFilterByPayment("");
    getData();

    {
      /* const [filterByBooking, setFilterByBooking] = useState("");
  const [filterByStartDate, setFilterByStartDate] = useState("");
  const [filterByEndDate, setFilterByEndDate] = useState("");
  const [filterByDepartureDate, setFilterByDepartureDate] = useState("");
  const [filterByTrips, setFilterByTrips] = useState("");
  const [filterByBookingStatus, setFilterByBookingStatus] = useState("");
  const [filterByPayment, setFilterByPayment] = useState(""); */
    }
  };

  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`Bookings`} active="Retailers" items={["Tables"]} />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <button
                onClick={() => {
                  navigate("/admin/OfflineBookings");
                }}
                className="btn btn-info"
              >
                <i className="fa fa-edit"></i> Create Offline Booking
              </button>
            </Card.Header>

            <Card.Body>
              <div className="row">
                <div className="col-lg-3">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Search By Booking</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <input
                          type="text"
                          value={filterByBooking}
                          onChange={(e) => {
                            setFilterByBooking(e.target.value);
                          }}
                          placeholder="Enter Booking ID"
                          className="form-control"
                        />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Search By Date</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        {filterByStartDate}
                        <label htmlFor="">Start Date</label>
                        <input
                          type="date"
                          value={filterByStartDate}
                          onChange={(e) => {
                            setFilterByStartDate(e.target.value);
                          }}
                          placeholder=""
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        {filterByEndDate}
                        <label htmlFor="">End Date</label>
                        <input
                          type="date"
                          value={filterByEndDate}
                          onChange={(e) => {
                            setFilterByEndDate(e.target.value);
                          }}
                          placeholder=""
                          className="form-control"
                        />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>By Departure Date</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <input
                          type="date"
                          value={filterByDepartureDate}
                          onChange={(e) => {
                            setFilterByDepartureDate(e.target.value);
                          }}
                          placeholder=""
                          className="form-control"
                        />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>By Trip</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <Select
                          classNamePrefix="Select"
                          onChange={(e) => {
                            setFilterByTrips(e.value);
                          }}
                          // style={{ zIndex: "2000000" }}
                          options={tripsData}
                          placeholder="Trips"
                        />
                        {/* <input type="date" value={filterByDepartureDate} onChange={(e)=>{setFilterByDepartureDate(e.target.value)}} placeholder="" className="form-control" /> */}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>By Booking Status</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <Select
                          classNamePrefix="Select"
                          onChange={(e) => {
                            setFilterByBookingStatus(e.value);
                          }}
                          // style={{ zIndex: "2000000" }}
                          options={bookingsStatus}
                          placeholder="Status"
                        />
                        {/* <input type="date" value={filterByDepartureDate} onChange={(e)=>{setFilterByDepartureDate(e.target.value)}} placeholder="" className="form-control" /> */}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>By Payment Mode</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <Select
                          classNamePrefix="Select"
                          onChange={(e) => {
                            setFilterByPayment(e.value);
                          }}
                          // style={{ zIndex: "2000000" }}
                          options={paymentModeStatus}
                          placeholder="Payment Mode"
                        />
                        {/* <input type="date" value={filterByDepartureDate} onChange={(e)=>{setFilterByDepartureDate(e.target.value)}} placeholder="" className="form-control" /> */}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>By Pending Payment</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="form-group">
                        <Select
                          classNamePrefix="Select"
                          onChange={(e) => {
                            setFilterByPayment(e.value);
                          }}
                          // style={{ zIndex: "2000000" }}
                          options={pendingitems}
                          placeholder="Pending Payment"
                        />
                        {/* <input type="date" value={filterByDepartureDate} onChange={(e)=>{setFilterByDepartureDate(e.target.value)}} placeholder="" className="form-control" /> */}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <div className="p-2 mt-4">
                    <Stack direction="row" spacing={2}>
                      <Button onClick={applyFilterFunction}>
                        <i className="fe fe-filter"></i> Filter
                      </Button>
                      <button
                        color="success"
                        className="btn btn-danger"
                        onClick={clearFilterFunction}
                      >
                        <i className="fe fe-x"></i> Clear
                      </button>
                    </Stack>
                  </div>
                </div>
                <div className="col-lg-9">
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
                            onChange={(e) =>
                              setPageSize(Number(e.target.value))
                            }
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
                                <tr
                                  className="text-center"
                                  {...row.getRowProps()}
                                >
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
                              {pageIndex + 1} of{" "}
                              {pageOptions && pageOptions.length}
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
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="l" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>Update Category</ModalTitle>
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
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={modalData && modalData?.name}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Name"
                    />
                    <input
                      type="hidden"
                      value={modalData && modalData?._id}
                      name="id"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Icon :
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(event) => {
                        console.log("change image", event.target.files[0]);
                        setSelectedImage1(event.target.files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Active:
                    </label>
                    <select name="isActive" className="form-control" id="">
                      <option
                        selected={modalData && modalData?.isActive === true}
                        value="true"
                      >
                        YES
                      </option>
                      <option
                        selected={modalData && modalData?.isActive === false}
                        value="false"
                      >
                        NO
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Show To Home Screen :
                    </label>
                    <select
                      name="showHomeScreen"
                      className="form-control"
                      id=""
                    >
                      <option
                        selected={
                          modalData && modalData?.showHomeScreen === true
                        }
                        value="true"
                      >
                        YES
                      </option>
                      <option
                        selected={
                          modalData && modalData?.showHomeScreen === false
                        }
                        value="false"
                      >
                        NO
                      </option>
                    </select>
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

export default Bookings;
