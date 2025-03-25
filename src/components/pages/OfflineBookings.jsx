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
import moment from "moment";
// import { Outlet, Link,useNavigate } from "react-router-dom";

import logo from "../../assets/logo_t.png";
// import { Link,  } from 'react-router-dom';

import {
  getAllCities,
  addCity,
  updateCity,
  addCategory,
  updateCategory,
  getAllCategories,
  getAllBookings,
  getTripsWithTitle,
  createBooking,
} from "../../utils/api";
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
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

const OfflineBookings = (props) => {
  const [mainData3, setMainData3] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");

  //bookings filter
  const [GSTAmount, setGSTAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
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
  ]);

  const getData = useCallback(async () => {
    try {
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
  const navigate = useNavigate();

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

  const addData = async () => {
    let mainType = "Offline";
    let paymentID = "";
    setError("");
    setSuccessMessage("");
    let userInfo = [];

    setLoading(true);
    let body = {
      trip_name: userInfo?.trip_name,
      trip_id: userInfo?.trip_id,
      trip_date: userInfo?.trip_date,
      trip_city: userInfo?.trip_city,
      city_id: userInfo?.city_id,
      trip_amount: userInfo?.trip_amount,
      participant_count: userInfo?.participant_count,
      participant: userInfo?.participant,
      total_fees: userInfo?.total_fees,
      transaction_charges: 0,
      discount: 0,
      paymentId: paymentID,
      bookingDate: userInfo?.bookingDate,
      bookingTime: new Date().toTimeString(),
      bookingType: "Offline",
      customer_name: "",
      customer_mobile: "",
      customer_id: "",
    };

    try {
      const apiData = await createBooking(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        navigate("/admin/bookings");
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
  const formsSubmitUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("icon", selectedImage1);

    const formJson = Object.fromEntries(formData.entries());
    //     updateData(formJson);
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
        //   getData();
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
  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("icon", selectedImage1);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
  };

  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Offline Booking`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5>Bookings Invoice </h5>
            </Card.Header>
            <Card.Body>
              <form
                method="post"
                onSubmit={formsSubmit}
                autocomplete="off"
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Booking Date <span className="text-danger">*</span>
                      </label>
                      <input type="date" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Select Trips: <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="Select"
                        onChange={(e) => {
                          setSelectedTripId(e.value);
                        }}
                        options={mainData3}
                        placeholder="Select Trips"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Select City: <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="Select"
                        onChange={(e) => {
                          setSelectedTripId(e.value);
                        }}
                        // options={mainData3}
                        placeholder="Select City"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Select Customer: <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="Select"
                        onChange={(e) => {
                          setSelectedTripId(e.value);
                        }}
                        // options={mainData3}C
                        placeholder="Select Customers"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Enter Amount: <span className="text-danger">*</span>
                      </label>
                      <input type="number" placeholder="Enter Amount"  className="form-control" />
                      
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {" "}
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Total Participant: <span className="text-danger">*</span>
                      </label>
                      <input type="number" placeholder="Enter Participant Count"  className="form-control" />
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
                    {" "}
                    <div className="mb-3 mt-1">
                        <button className="btn btn-danger"> 
                        <i className="fa fa-edit"></i>
                        Create Offline Booking</button>
                    </div>
                  </div>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OfflineBookings;
