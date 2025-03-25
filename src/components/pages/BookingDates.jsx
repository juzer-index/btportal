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
  addCategory,
  updateCategory,
  getAllCategories,
  getUsers,
  getTripById,
  addDatesToTripsNew,
  deleteDatesToTripsNew,
  updateDatesToNew,
  updateDatesToNewSingleEntry,
} from "../../utils/api";
import moment from "moment";

import { Outlet, Link } from "react-router-dom";
import Select from "react-select";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
import { DataArray } from "@mui/icons-material";
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

const BookingDates = (props) => {
  let { tripId, cityId } = useParams();
  const [dataArray, setDataArray] = useState([]);
  const handleCapacityChange = (index, value) => {
    const updatedArray = dataArray.map((item, i) =>
      i === index ? { ...item, capacity: value } : item
    );
    setDataArray(updatedArray);
  };

  const renderArray = () => {
    return dataArray.map((item, index) => (
      <>
        <div className="mb-3">
          <label htmlFor="recipient-name" className="col-form-label">
            {item.title} Capacity:
          </label>
          <input
            type="number"
            name="capacity"
            className="form-control"
            id="recipient-name"
            required
            defaultValue={item.capacity}
            placeholder="Enter Capacity"
            onChange={(e) => handleCapacityChange(index, e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="recipient-name" className="col-form-label">
            {item.title} Price:
          </label>
          <input
            type="number"
            name="price"
            className="form-control"
            id="recipient-name"
            required
            defaultValue={item.price}
            placeholder="Enter price"
            onChange={(e) => handlePriceChange(index, e.target.value)}
          />
        </div>
        {/* <div key={item._id}>

       
        <p>Price: {item.price}</p>
        <input
          type="number"
          value={item.price}
          onChange={(e) => handlePriceChange(index, e.target.value)}
        />
      </div> */}
      </>
    ));
  };

  const handlePriceChange = (index, value) => {
    const updatedArray = dataArray.map((item, i) =>
      i === index ? { ...item, price: value } : item
    );
    setDataArray(updatedArray);
  };
  console.log("tripid", tripId);
  console.log("cityID", cityId);

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
  const [backendDates, setBackendDates] = useState([]);

  const [InputShow2, setInputShow2] = useState(false);
  const handleClose4 = () => setInputShow2(false);
  const handleShow4 = () => setInputShow2(true);

  const [InputShow3, setInputShow3] = useState(false);
  const handleClose5 = () => setInputShow3(false);
  const handleShow5 = () => setInputShow3(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const daysOfWeek = [
    { value: "sun", label: "Sunday" },
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
  ];

  const [dayNames, setDayNames] = useState(daysOfWeek.map((day) => day.value));
  const [mainData2, setMainData2] = useState([]);
  const [mainData3, setMainData3] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setDayNames((prevDayNames) => [...prevDayNames, value]);
    } else {
      setDayNames((prevDayNames) =>
        prevDayNames.filter((day) => day !== value)
      );
    }

    // console.log("dayNames",dayNames);
  };

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
        Header: "Date",
        accessor: "date",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",
        id: "1",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Capacity",
        accessor: "capacity",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Booking Closing Hours",
        accessor: "closingHours",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "start Time",
        accessor: "startTime",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      {
        Header: "Prices",
        accessor: "prices",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <ul>
              {props.value?.map((data, i) => {
                return (
                  <li>
                    {data?.title}: {data?.price} rs
                  </li>
                );
              })}
            </ul>
          </div>
        ),
      },
      // {
      //   Header: "Name",
      //   accessor: "name",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>{props.value}</span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Contact Person ",
      //   accessor: "contactPerson",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>
      //         {props.value ? `${props.value?.firstName}` : "DEFAULT USER"}{" "}
      //       </span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Active",
      //   accessor: "isActive",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>
      //         {props.value ? (
      //           <StatusButton bg="success" />
      //         ) : (
      //           <StatusButton bg="danger" />
      //         )}
      //       </span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Show To Home Screen",
      //   accessor: "showHomeScreen",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>
      //         {props.value ? (
      //           <StatusButton bg="success" />
      //         ) : (
      //           <StatusButton bg="danger" />
      //         )}
      //       </span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Contact Person",
      //   accessor: "contactPersonName",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>{props.value}</span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Contact Person Mobile",
      //   accessor: "contactPersonMobile",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <span>{props.value}</span>
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Image",
      //   accessor: "icon",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) => (
      //     <div style={{ textAlign: "left" }}>
      //       <a href={props.value} download>
      //         <img
      //           src={props.value}
      //           style={{ width: "100px", height: "100px" }}
      //           loading="lazy"
      //           alt=""
      //         />
      //       </a>
      //     </div>
      //   ),
      // },
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
                  largemodalShow();
                  console.log(
                    "props.cell.row.original",
                    props.cell.row.original
                  );
                  setModalData(props.cell.row.original);
                  setDataArray(props.cell.row.original?.prices);
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
      const apiData = await getTripById(tripId);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        const calendarEvents = [];

        setMainData3(apiData.data);
        console.log("setMainData3", apiData.data);
        let cityData = apiData.data?.cities?.filter((data2, i) => {
          return data2?.cityID?._id === cityId;
        });
        console.log("cityData", cityData);
        setMainData2(cityData);
        if (cityData[0]?.dates_new) {
          setMainData(cityData[0]?.dates_new);
          cityData[0]?.dates_new.forEach((date) => {
            const formattedDate = moment(date.date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            );
            const calendarEvent = {
              title: `Trip  ${cityData[0]?.cityName}
              
              `,
              start: formattedDate,
            };
            calendarEvents.push(calendarEvent);
          });
        }
        await setBackendDates(calendarEvents);
      }

      const apiData2 = await getUsers();
      if (apiData2.error) {
        setError(apiData2.error);
      } else {
        let usersBackendData = apiData2.data
          .filter((data) => {
            return data.isActive;
          })
          .map((data, i) => {
            return {
              ...data,
              value: data._id,
              label: `${data?.firstName} ${data?.lastName}`,
            };
          });
        setUsersData(usersBackendData);
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
    console.log("formData2", formData.entries());

    // const formJson = Object.fromEntries(formData.entries());
    // dayNames.forEach((dayName, index) => {
    //   formData.append(`dayNames[]`, dayName);
    // });

    const formJson = Object.fromEntries(formData.entries());

    formJson.dayNames = dayNames;
    console.log("formJson", formJson);

    addData(formJson);
    setLoading(false);
  };
  const formsSubmit2 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // console.log("formData2",formData.entries());

    // const formJson = Object.fromEntries(formData.entries());
    // dayNames.forEach((dayName, index) => {
    //   formData.append(`dayNames[]`, dayName);
    // });

    const formJson = Object.fromEntries(formData.entries());

    // formJson.dayNames = dayNames;
    console.log("formJson", formJson);

    addData2(formJson);
    setLoading(false);
  };
  const formsSubmit3 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // console.log("formData2",formData.entries());

    // const formJson = Object.fromEntries(formData.entries());
    // dayNames.forEach((dayName, index) => {
    //   formData.append(`dayNames[]`, dayName);
    // });

    const formJson = Object.fromEntries(formData.entries());

    console.log("formJson", formJson);

    addData3(formJson);
    setLoading(false);
  };
  const formsSubmitUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    formJson.prices = dataArray;
    console.log("formsSubmitUpdate", formJson);

    updateData(formJson);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addDatesToTripsNew(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        setSelectedImage1("");
        setSelectedUser("");
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Bookings Added !</p>,
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
  const addData2 = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await deleteDatesToTripsNew(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose4();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Bookings Deleted !</p>,
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
  const addData3 = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateDatesToNew(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose5();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Bookings Updated !</p>,
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
      const apiData = await updateDatesToNewSingleEntry(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose();
        setSelectedUser("");

        toast.success(
          <p className="text-white tx-16 mb-0">Success : Booking Updated !</p>,
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

  const checkDaysArray = () => {};
  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`Categories`} active="Retailers" items={["Tables"]} />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header className="">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12"></div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="">
                        City <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData2 && mainData2[0]?.cityName}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="">
                        Trip Title <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData3 && mainData3?.title}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="">
                        Sub Title <span className="text-danger">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={mainData3 && mainData3?.sub_title}
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
                  <div className="col-lg-4">
                    <Button
                      className="me-3 mt-2"
                      variant="primary"
                      animation="flip"
                      onClick={handleShow3}
                    >
                      Add Bookings
                    </Button>
                    <ToastContainer />

                    <Modal size="xl" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add</Modal.Title>
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
                                    Start Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Start Date"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    End Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="endDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter EndDate"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Start Time:
                                  </label>
                                  <input
                                    type="time"
                                    name="startTime"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter startTime"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Booking Closing Hours:
                                  </label>
                                  <input
                                    type="number"
                                    name="closingHours"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Closing Hours"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Capacity:
                                  </label>
                                  <input
                                    type="number"
                                    name="capacity"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
                                  />
                                  <input
                                    type="hidden"
                                    name="tripID"
                                    value={tripId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
                                  />
                                  <input
                                    type="hidden"
                                    name="cityID"
                                    value={cityId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
                                  />
                                </div>
                                <div className="mb-3">
                                  <FormGroup aria-label="position" row>
                                    {daysOfWeek.map((day) => (
                                      <div key={day.value}>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          label={day.label}
                                          labelPlacement="right"
                                          value={day.value}
                                          checked={dayNames.includes(day.value)}
                                          onChange={handleCheckboxChange}
                                        />
                                      </div>
                                    ))}
                                  </FormGroup>
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
                  <div className="col-lg-4">
                    <Button
                      className="me-3 ml-4 mt-2"
                      variant="info"
                      animation="flip"
                      onClick={handleShow4}
                    >
                      Delete Bookings
                    </Button>
                    <ToastContainer />

                    <Modal size="xl" show={InputShow2} onHide={handleClose4}>
                      <Modal.Header>
                        <Modal.Title>Delete Bookings</Modal.Title>
                        <span className="d-flex ms-auto" onClick={handleClose4}>
                          <i className="fe fe-x ms-auto"></i>
                        </span>
                      </Modal.Header>
                      <form
                        method="post"
                        onSubmit={formsSubmit2}
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
                                    Start Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Start Date"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    End Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="endDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter EndDate"
                                  />
                                  <input
                                    type="hidden"
                                    name="tripID"
                                    value={tripId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
                                  />
                                  <input
                                    type="hidden"
                                    name="cityID"
                                    value={cityId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
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
                          <Button variant="danger" onClick={handleClose4}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </form>
                    </Modal>
                  </div>
                  <div className="col-lg-4">
                    <Button
                      className="me-3 ml-4 mt-2"
                      variant="success"
                      animation="success"
                      onClick={handleShow5}
                    >
                      Bulk Update Bookings
                    </Button>
                    <ToastContainer />

                    <Modal size="xl" show={InputShow3} onHide={handleClose5}>
                      <Modal.Header>
                        <Modal.Title>Update Bulk Bookings</Modal.Title>
                        <span className="d-flex ms-auto" onClick={handleClose5}>
                          <i className="fe fe-x ms-auto"></i>
                        </span>
                      </Modal.Header>
                      <form
                        method="post"
                        onSubmit={formsSubmit3}
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
                                    Start Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Start Date"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    End Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="endDate"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter EndDate"
                                  />
                                  <div className="mb-3">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label"
                                    >
                                      Start Time:
                                    </label>
                                    <input
                                      type="time"
                                      name="startTime"
                                      className="form-control"
                                      id="recipient-name"
                                      required
                                      placeholder="Enter startTime"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label"
                                    >
                                      Booking Closing Hours:
                                    </label>
                                    <input
                                      type="number"
                                      name="closingHours"
                                      className="form-control"
                                      id="recipient-name"
                                      required
                                      placeholder="Enter Closing Hours"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label"
                                    >
                                      Capacity:
                                    </label>
                                    <input
                                      type="number"
                                      name="capacity"
                                      className="form-control"
                                      id="recipient-name"
                                      required
                                      placeholder="Enter Capacity"
                                    />
                                  </div>
                                  <input
                                    type="hidden"
                                    name="tripID"
                                    value={tripId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
                                  />
                                  <input
                                    type="hidden"
                                    name="cityID"
                                    value={cityId}
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Capacity"
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
                          <Button variant="danger" onClick={handleClose5}>
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
            <Card.Body>
              <FullCalendar
                // ref={calendarRef}
                initialView="dayGridMonth"
                headerToolbar={{
                  start: "prev,next today",
                  center: "title",
                  end: "dayGridMonth",
                }}
                rerenderDelay={10}
                eventDurationEditable={false}
                // editable={true}
                // droppable={true}
                // plugins={[dayGridPlugin]}
                plugins={[dayGridPlugin, interactionPlugin]}
                events={backendDates.length > 0 && backendDates}
                // eventClick={this.eventClick}
                selectable={true}
                // dateClick={handleDateClick}
                // select={alert("select")}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="xl" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>Update BookingDate</ModalTitle>
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
                      Start Date
                    </label>
                    <input
                      type="text"
                      name="startDate"
                      className="form-control"
                      id="recipient-name"
                      required
                      readOnly
                      value={modalData && modalData?.date}
                      placeholder="Enter Start Date"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Start Time:
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        className="form-control"
                        id="recipient-name"
                        required
                        defaultValue={modalData && modalData?.startTime}
                        placeholder="Enter startTime"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Booking Closing Hours:
                      </label>
                      <input
                        type="number"
                        name="closingHours"
                        className="form-control"
                        id="recipient-name"
                        required
                        defaultValue={modalData && modalData?.closingHours}
                        placeholder="Enter Closing Hours"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Capacity:
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        className="form-control"
                        id="recipient-name"
                        required
                        defaultValue={modalData && modalData?.capacity}
                        placeholder="Enter Capacity"
                      />
                    </div>
                    {renderArray()}
                    <input
                      type="hidden"
                      name="tripID"
                      value={tripId}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Capacity"
                    />
                    <input
                      type="hidden"
                      name="cityID"
                      value={cityId}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Capacity"
                    />
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

export default BookingDates;
