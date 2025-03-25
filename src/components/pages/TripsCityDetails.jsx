import React, { useState, useEffect, useCallback } from "react";
import {
  Tab,
  Row,
  Col,
  Nav,
  Card,
  Button,
  Modal,
  Breadcrumb,
} from "react-bootstrap";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  addCityToTrip,
  addDatesToTrips,
  addImageToTrip,
  addPriceToTrips,
  addScheduleToTrip,
  deleteCityFromTrip,
  getAllCategories,
  getAllCities,
  getTripById,
  removeTripImage,
  updatePriceInTrips,
  updateTripData,
} from "../../utils/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
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
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Editor } from "@tinymce/tinymce-react";

import moment from "moment";

export const TripsCityDetails = () => {
  const location = useLocation();
  const id = location.state.id;
  const mainDataFromState = location.state.mainDataFromState;
  const cityData = location.state.cityData;
  console.log("mainDataFromState", mainDataFromState);
  console.log("cityData", cityData);
  console.log("id", id);
  console.log("location", location);

  const [selectedAddDate, setSelectedAddDate] = useState("");
  const [category, setCategory] = useState("");
  const [categoriesData, setMainDataCategories] = useState([]);
  const [updatePriceModelData, setUpdatePriceModelData] = useState([]);
  const [about, setAbout] = useState("");
  const [description, setDescription] = useState("");
  const [inclusion_exclusion, setinclusion_exclusion] = useState("abc");
  const [things_to_carry, setThingsToCarry] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [cancellation_policy, setcancellation_policy] = useState("");
  const [rent_purchase_gears, setRent_purchase_gears] = useState("");
  const [how_to_reach, sethow_to_reach] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [InputShow, setInputShow] = useState(false);
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);

  const [InputShow2, setInputShow2] = useState(false);
  const [deleteImgageID, setDeleteImgageID] = useState(false);
  const [deleteCityId, setDeleteCityId] = useState(false);
  const handleClose32 = () => setInputShow2(false);
  const handleShow32 = () => setInputShow2(true);

  const [InputShow3, setInputShow3] = useState(false);
  const handleClose33 = () => setInputShow3(false);
  const handleShow33 = () => setInputShow3(true);

  const [InputShow4, setInputShow4] = useState(false);
  const handleClose34 = () => setInputShow4(false);
  const handleShow34 = () => setInputShow4(true);

  const [InputShow5, setInputShow5] = useState(false);
  const handleClose35 = () => setInputShow5(false);
  const handleShow35 = () => setInputShow5(true);

  const [InputShow6, setInputShow6] = useState(false);
  const handleClose36 = () => setInputShow6(false);
  const handleShow36 = () => setInputShow6(true);

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [backendDates, setBackendDates] = useState([]);
  const [backendCityData, setBackendCityData] = useState([]);
  const [mainDataCities, setMainDataCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    try {
      const data = await getTripById(id);
      if (data.data) {
        console.log("getData api", data.data);
        setMainData(data.data);
        let trip = data.data;
        let cityDataNew = "";
        let datesData = "";
        const calendarEvents = [];

        if (data.data?.cities) {
          cityDataNew = data.data.cities.filter((data22, i) => {
            console.log("data22data22data22", data22);
            return data22.testName2 === cityData?.cityName;
          });
          console.log("cityDataNewANuj123", cityDataNew.length);

          // datesData = data.data?.cities?.dates?.filter((data,i)=> {return {title:"booking",start :data,id:i}});
          // console.log("datesData",datesData);
          setBackendCityData(cityDataNew);
          // let cityDataNew2 = data.data.cities.find((data22,i)=> {return data22.cityName = cityData?.cityName});
          // console.log("cityDataNew2",cityDataNew2);

          if (cityDataNew && cityDataNew && Array.isArray(cityDataNew)) {
            cityDataNew.forEach((city) => {
              if (city.dates_new && Array.isArray(city.dates_new)) {
                city.dates_new.forEach((date) => {
                  const formattedDate = moment(date.date, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  );
                  const calendarEvent = {
                    title: `Trip Date of ${cityData?.cityName}`,
                    start: formattedDate,
                  };
                  calendarEvents.push(calendarEvent);
                });
              }
            });
          }
        }

        await setBackendDates(calendarEvents);
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
  }, [id]);

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

  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("icon", selectedImage2);
    formData.append("descriptions", description);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
  };
  const formsSubmit2 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("image", selectedImage1);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData2(formJson);
    setLoading(false);
  };
  const formsSubmit3 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("imageID", deleteImgageID);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData3(formJson);
    setLoading(false);
  };
  const formsSubmit4 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("date", selectedAddDate);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData4(formJson);
    setLoading(false);
  };
  const formsSubmit5 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("category", category);
    formData.append("brochure", category);
    formData.append("about", about.toString());
    formData.append("things_to_carry", things_to_carry.toString());
    formData.append("terms_conditions", terms_conditions.toString());
    formData.append("rent_purchase_gears", rent_purchase_gears.toString());
    formData.append("how_to_reach", how_to_reach.toString());
    formData.append("inclusion_exclusion", inclusion_exclusion.toString());
    formData.append("cancellation_policy", cancellation_policy.toString());

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData5(formJson);
    setLoading(false);
  };
  const formsSubmit6 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("category", category);
    // formData.append("brochure", category);
    // formData.append("about", about.toString());
    // formData.append("things_to_carry", things_to_carry.toString());
    // formData.append("terms_conditions", terms_conditions.toString());
    // formData.append("rent_purchase_gears", rent_purchase_gears.toString());
    // formData.append("how_to_reach", how_to_reach.toString());
    // formData.append("inclusion_exclusion", inclusion_exclusion.toString());
    // formData.append("cancellation_policy", cancellation_policy.toString());

    // console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData6(formJson);
    setLoading(false);
  };
  const addData = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addScheduleToTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Schedule Added !</p>,
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
    setLoading(true);

    try {
      const apiData = await addPriceToTrips(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose32();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Price Added !</p>,
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
    setLoading(true);

    try {
      const apiData = await removeTripImage(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose33();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Image Deleted Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteImgageID("");
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
  const addData4 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addDatesToTrips(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose34();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Date Added Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        selectedAddDate("");
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
  const addData5 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await updateTripData(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose35();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Trip Data Updated!</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteCityId("");
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
  const addData6 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await updatePriceInTrips(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose36();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Trip Price Updated!
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteCityId("");
        setUpdatePriceModelData([]);
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

  const getCitiesData = useCallback(async () => {
    console.log("getCitiesDatacalled");

    setLoading(true);
    try {
      const apiData = await getAllCities();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        let cityyNames = apiData.data
          .filter((data) => {
            return data.isActive;
          })
          .map((data, i) => {
            return { value: data._id, label: data.name };
          });
        console.log("cityyNames", cityyNames);
        setMainDataCities(cityyNames);
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
    // getCitiesData();
    // getDataCategories();
  }, []);

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
            return { value: data.name, label: data.name };
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

  const handleDateClick = async (arg) => {
    let date = arg.dateStr;

    if (new Date(date) < new Date()) {
      return;
    }

    // setSelectedAddDate(date);
    let newData = moment(date).format("DD-MM-YYYY");
    console.log("newData", newData);
    await setSelectedAddDate(newData.toString());
    handleShow34();
  };

  return (
    <>
      <div>
        <PageHeader
          titles="Trips Details"
          active="Dealers"
          items={["Tables"]}
        />
        {/* <Breadcrumb className="breadcrumb1">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>About</Breadcrumb.Item>
            </Breadcrumb> */}

        <ToastContainer />

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Modal
                size="xl"
                fullscreen
                show={InputShow}
                onHide={handleClose3}
              >
                <Modal.Header>
                  <Modal.Title>Add Schedule</Modal.Title>
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
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Title
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Title"
                              name="title"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Description
                              <span className="text-danger">*</span>
                            </label>
                            {/* <SunEditor
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
                              onChange={setDescription}
                            /> */}
                            <Editor
                              initialValue="<p>This is the initial content of the description</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                              // onChange={setAbout}
                              onEditorChange={(newText) =>
                                setDescription(newText)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Select Image (595*397)
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              accept="pdf/*"
                              onChange={(event) => {
                                console.log(
                                  "change image",
                                  event.target.files[0]
                                );
                                setSelectedImage2(event.target.files[0]);
                              }}
                            />
                            <input
                              type="hidden"
                              name="tripId"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
                            />
                            <input
                              type="hidden"
                              name="cityId"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={cityData?.cityID?._id}
                              placeholder="Enter Duration in Days"
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
              <Modal size="xl" show={InputShow2} onHide={handleClose32}>
                <Modal.Header>
                  <Modal.Title>Add Price</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose32}>
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
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Price Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              name="title"
                              placeholder="Enter Price Title Ex. With Train/Flight "
                            />
                            <input
                              type="hidden"
                              name="tripID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
                            />
                            <input
                              type="hidden"
                              name="cityID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={cityData?.cityID?._id}
                              placeholder="Enter Duration in Days"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Amount in Rs
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              name="price"
                              placeholder="Enter Price Amount in Rs."
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Capacity
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              name="capacity"
                              placeholder="Enter capacity"
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
                    <Button variant="danger" onClick={handleClose32}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="xl" show={InputShow6} onHide={handleClose36}>
                <Modal.Header>
                  <Modal.Title>Update Price</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose36}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit6}
                  autocomplete="off"
                  encType="multipart/form-data"
                >
                  <Modal.Body>
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Price Title :{" "}
                              {updatePriceModelData &&
                                updatePriceModelData?.title}
                            </label>

                            <input
                              type="hidden"
                              name="tripID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
                            />
                            <input
                              type="hidden"
                              name="cityID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={cityData?.cityID?._id}
                              placeholder="Enter Duration in Days"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Amount in Rs
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              defaultValue={
                                updatePriceModelData &&
                                updatePriceModelData?.price
                              }
                              name="price"
                              placeholder="Enter Price Amount in Rs."
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Capacity
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              defaultValue={
                                updatePriceModelData &&
                                updatePriceModelData?.capacity
                              }
                              name="capacity"
                              placeholder="Enter capacity"
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
                    <Button variant="danger" onClick={handleClose36}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="l" show={InputShow3} onHide={handleClose33}>
                <Modal.Header>
                  <Modal.Title>Delete Price</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose33}>
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
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Are You Sure Want To Delete This Price ?
                            </label>

                            <input
                              type="hidden"
                              name="tripID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
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
                        <Button variant="success" disabled type="submit">
                          Delete
                        </Button>
                      </>
                    )}
                    <Button variant="danger" onClick={handleClose33}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="l" show={InputShow4} onHide={handleClose34}>
                <Modal.Header>
                  <Modal.Title>
                    Add Dates To{" "}
                    {backendCityData && backendCityData[0]?.cityName} City
                  </Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose33}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit4}
                  autocomplete="off"
                  encType="multipart/form-data"
                >
                  <Modal.Body>
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Are You Sure Want To Add below {selectedAddDate}{" "}
                              date ?
                            </label>
                            <input
                              type="hidden"
                              name="tripID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
                            />
                            <input
                              type="hidden"
                              name="cityID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={cityData?.cityID?._id}
                              placeholder="Enter Duration in Days"
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
                          Update
                        </Button>
                      </>
                    )}
                    <Button variant="danger" onClick={handleClose34}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal
                size="xl"
                // scrollable={tr/ue}
                fullscreen
                show={InputShow5}
                onHide={handleClose35}
              >
                <Modal.Header>
                  <Modal.Title>Trips Details</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose35}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit5}
                  autocomplete="off"
                  encType="multipart/form-data"
                >
                  <Modal.Body
                    style={{
                      maxHeight: "calc(100vh - 180px)",
                      overflowY: "auto",
                    }}
                  >
                    <div className="">
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
                              defaultValue={mainData?.title}
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
                              Sub Title <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              defaultValue={mainData?.sub_title}
                              name="sub_title"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Sub Title"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Category
                              <span className="text-danger">*</span>
                            </label>

                            <Select
                              classNamePrefix="Select"
                              onChange={(e) => {
                                setCategory(e.value);
                              }}
                              style={{ zIndex: "2000000" }}
                              options={categoriesData}
                              placeholder="Category"
                              defaultInputValue={
                                categoriesData.filter((data) => {
                                  return mainData.category === data.name;
                                })[0]
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
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
                              defaultValue={mainData?.difficulty}
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Difficulty"
                            />
                            <input
                              type="hidden"
                              name="tripID"
                              defaultValue={mainData?._id}
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
                              defaultValue={mainData?.age_group}
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
                              defaultValue={mainData?.max_altitude}
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
                              Brochure
                            </label>
                            <input
                              type="file"
                              className="form-control"
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
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Active
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-control"
                              name="isActive"
                              id=""
                            >
                              <option
                                selected={mainData?.isActive === true}
                                value="true"
                              >
                                Yes
                              </option>
                              <option
                                selected={mainData?.isActive === false}
                                value="false"
                              >
                                No
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              About
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.about}
                              setOptions={{
                                showPathLabel: false,
                                minHeight: "50vh",
                                maxHeight: "50vh",
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
                            <input
                              type="hidden"
                              name="tripID"
                              className="form-control"
                              id="recipient-name"
                              required
                              value={mainData._id}
                              placeholder="Enter Duration in Days"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Inclusion & Exclusion{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.inclusion_exclusion}
                              onChange={setinclusion_exclusion}
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Things to Carry
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.things_to_carry}
                              onChange={setThingsToCarry}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Terms & Conditions
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.terms_conditions}
                              onChange={setTerms_conditions}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Cancellation Policy
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.cancellation_policy}
                              onChange={setcancellation_policy}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Rent/Purchase Gears
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.rent_purchase_gears}
                              onChange={setRent_purchase_gears}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              How To Reach?
                              <span className="text-danger">*</span>
                            </label>
                            <SunEditor
                              setContents={mainData?.how_to_reach}
                              onChange={sethow_to_reach}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  {/* <Modal.Footer className="text-leftjustify-content-between"> */}
                  {loading ? (
                    <Button variant="success" disabled>
                      Loading ...
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="success"
                        style={{ marginLeft: "20px" }}
                        className="ml-4"
                        type="submit"
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        style={{ marginLeft: "20px" }}
                        onClick={handleClose35}
                      >
                        Close
                      </Button>
                    </>
                  )}

                  {/* </Modal.Footer> */}
                </form>
              </Modal>

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
                          value={
                            backendCityData && backendCityData[0]?.testName2
                          }
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
                          value={mainData && mainData?.title}
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
                          value={mainData && mainData?.sub_title}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <ToastContainer />
              </Card.Header>

              <Card.Body>
                <div className="panel panel-info">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="secondC"
                  >
                    <Nav
                      variant="pills"
                      className="panel-tabs nav-tabs panel-info"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="secondC">
                          <i className="fe fe-dollar-sign me-1"></i>Price
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="forthC"
                          onClick={() => {
                            navigate(
                              `/admin/BookingDates/${id}/${cityData?.cityID?._id}`
                            );
                          }}
                        >
                          <i
                            onClick={() => {
                              navigate(
                                `/admin/BookingDates/${id}/${cityData?.cityID?._id}`
                              );
                            }}
                            className="fe fe-calendar me-1"
                          ></i>
                          Booking Dates
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="thirdC">
                          <i className="fa fa-plane"></i> Schedule
                        </Nav.Link>
                      </Nav.Item>
                      {/* <Nav.Item>
                        <Nav.Link eventKey="firstC">
                          <i className="fe fe-calendar me-1"></i>Calender
                        </Nav.Link>
                      </Nav.Item> */}

                      {/* <Nav.Item>
                        <Nav.Link eventKey="fourthC">
                          <i className="fe fe-bell me-1"></i>Tab 4
                        </Nav.Link>
                      </Nav.Item> */}
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="forthC">
                        <Col
                          xl={12}
                          className="demo-app-calendar"
                          id="mycalendartest"
                        ></Col>
                      </Tab.Pane>
                      <Tab.Pane eventKey="firstC">
                        <Col
                          xl={12}
                          className="demo-app-calendar"
                          id="mycalendartest"
                        >
                          <div style={{ height: "1000px" }}>
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
                              dateClick={handleDateClick}
                              // select={alert("select")}
                            />
                          </div>
                        </Col>
                      </Tab.Pane>
                      <Tab.Pane eventKey="secondC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow32}
                        >
                          Add Price To Trip
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Title</th>
                              <th>Price</th>
                              <th>Capacity</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backendCityData &&
                              backendCityData[0]?.prices.map((data2, i) => {
                                if (!data2.title) {
                                  return null; // Skip rendering if the title is blank
                                }

                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{data2.title}</td>
                                    <td>{data2.price}</td>
                                    <td>{data2?.capacity}</td>
                                    <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="info"
                                        animation="flip"
                                        onClick={() => {
                                          setUpdatePriceModelData(data2);
                                          // setDeleteImgageID(data2._id);
                                          handleShow36();
                                        }}
                                      >
                                        <i className="fa fa-edit"></i>
                                      </Button>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
                                        onClick={() => {
                                          // setUpdatePriceModelData(data2)
                                          setDeleteImgageID(data2._id);
                                          handleShow33();
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="thirdC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow3}
                        >
                          Add Schedule To Trip
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Image</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backendCityData &&
                              backendCityData[0]?.schedule.map((data2, i) => {
                                if (!data2.title) {
                                  return null; // Skip rendering if the title is blank
                                }

                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{data2.title}</td>
                                    <td>
                                      <p
                                        id={i + 1}
                                        dangerouslySetInnerHTML={{
                                          __html: data2.descriptions,
                                        }}
                                      ></p>
                                    </td>
                                    <td>
                                      {data2?.icon && (
                                        <a href={data2?.icon} download>
                                          <img
                                            src={data2?.icon}
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                            alt="alt"
                                            loading="lazy"
                                          />
                                        </a>
                                      )}
                                    </td>
                                    <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
                                        disabled
                                        onClick={() => {
                                          setDeleteImgageID(data2._id);
                                          handleShow33();
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </Button>
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
      </div>
    </>
  );
};
