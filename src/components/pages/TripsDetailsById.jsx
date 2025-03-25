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
import { Editor } from "@tinymce/tinymce-react";

import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  addCategoryInTrip,
  addCityToTrip,
  addFaqToTrip,
  addImageToTrip,
  addOnToTrip,
  deleteCityFromTrip,
  getAllCategories,
  getAllCities,
  getTripById,
  removeTripFaq,
  removeTripImage,
  updateTripData,
} from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
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
  // unorderList
} from "suneditor/src/plugins";
// import moment from "moment";

export const TripsDetailsById = () => {
  const [category, setCategory] = useState("");
  const [deleteFaqId, setDeleteFaqId] = useState("");

  const [backendCategory, setBackendCategory] = useState({});
  const [categoriesData, setMainDataCategories] = useState([]);
  const [about, setAbout] = useState("");
  const [faqDescription, setFaqDescription] = useState("");
  const [inclusion_exclusion, setinclusion_exclusion] = useState("");
  const [things_to_carry, setThingsToCarry] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [cancellation_policy, setcancellation_policy] = useState("");
  const [rent_purchase_gears, setRent_purchase_gears] = useState("");
  const [how_to_reach, sethow_to_reach] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);

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

  const [InputShow7, setInputShow7] = useState(false);
  const handleClose37 = () => setInputShow7(false);
  const handleShow37 = () => setInputShow7(true);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const showAddCategoryModelFunction = () => setShowAddCategoryModal(true);
  const hideAddCategoryModelFunction = () => setShowAddCategoryModal(false);

  const [InputShow8, setInputShow8] = useState(false);
  const handleClose38 = () => setInputShow8(false);
  const handleShow38 = () => setInputShow8(true);

  let { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [mainDataCities, setMainDataCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    console.log("getDatacalled");
    try {
      const data = await getTripById(id);
      if (data.data) {
        console.log(data.data, "main");
        setMainData(data.data);
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
    formData.append("cityID", selectedCity);
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
    formData.append("image", selectedImage1);
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
    formData.append("cityID", deleteCityId);

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
    if (category) {
      formData.append("category", category);
    }
    if (category) {
      formData.append("brochure", category);
    }
    if (about) {
      formData.append("about", about.toString());
    }
    if (things_to_carry) {
      formData.append("things_to_carry", things_to_carry.toString());
    }
    if (terms_conditions) {
      formData.append("terms_conditions", terms_conditions.toString());
    }
    if (rent_purchase_gears) {
      formData.append("rent_purchase_gears", rent_purchase_gears.toString());
    }
    if (how_to_reach) {
      formData.append("how_to_reach", how_to_reach.toString());
    }
    if (inclusion_exclusion) {
      formData.append("inclusion_exclusion", inclusion_exclusion.toString());
    }
    if (cancellation_policy) {
      formData.append("cancellation_policy", cancellation_policy.toString());
    }

    // formData.append("brochure", category);
    // formData.append("about", about.toString());
    // formData.append("things_to_carry", things_to_carry.toString());
    // formData.append("terms_conditions", terms_conditions.toString());
    // formData.append("rent_purchase_gears", rent_purchase_gears.toString());
    // formData.append("how_to_reach", how_to_reach.toString());
    // formData.append("inclusion_exclusion", inclusion_exclusion.toString());
    // formData.append("cancellation_policy", cancellation_policy.toString());

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
    console.log("formData", formData);
    formData.append("description", faqDescription);

    const formJson = Object.fromEntries(formData.entries());
    addData6(formJson);
    setLoading(false);
  };
  const formsSubmit7 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("faqID", deleteFaqId);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData7(formJson);
    setLoading(false);
  };
  const formsSubmit8 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("categoryId", category);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData8(formJson);
    setLoading(false);
  };
  const formsSubmit9 = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("categoryId", category);

    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData9(formJson);
    setLoading(false);
  };
  const addData = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addCityToTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : City Mapped Successfully !
          </p>,
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
      const apiData = await addImageToTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose32();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Image Added Successfully !
          </p>,
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
      const apiData = await deleteCityFromTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose34();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : City Deleted Successfully !
          </p>,
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
      const apiData = await addFaqToTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose36();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Faq Added!</p>,
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
  const addData7 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await removeTripFaq(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose37();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Faq Removed!</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteFaqId("");
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
  const addData8 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addCategoryInTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        hideAddCategoryModelFunction();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Category Added!</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteFaqId("");
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
  const addData9 = async (body) => {
    setError("");
    setLoading(true);

    try {
      const apiData = await addOnToTrip(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        hideAddCategoryModelFunction();
        handleClose38();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Add On Added!</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        setDeleteFaqId("");
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
    getCitiesData();
    getDataCategories();
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
            return { value: data._id, label: data.name };
          });
        const valueToMove = mainData?.category;

        console.log("categoryNames1", categoryNames);

        const newIndex = 1;

        // Find the index of the object with the given value
        const currentIndex = categoryNames.findIndex(
          (obj) => obj.value === valueToMove
        );

        // If the object exists in the array
        if (currentIndex !== -1) {
          // Remove the object from its current index
          const [movedObject] = categoryNames.splice(currentIndex, 1);
          console.log("movedObject", movedObject);

          // Insert the object at the new index
          categoryNames.splice(newIndex, 0, movedObject);
          console.log("categoryNamescategoryNamescategoryNames", categoryNames);
        }
        console.log("newIndex", newIndex);
        console.log("currentIndex", currentIndex);

        console.log("categoryNames2", categoryNames);
        setMainDataCategories(categoryNames);
        // let valueNew =  categoryNames.filter((data)=> {return mainData?.category === data.value})[0];

        // let setValue = {
        //   value : valueNew.value,
        //   label: valueNew.label
        // }
        // console.log("setValue",setValue);
        // setBackendCategory(setValue)
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
  // let value = categoriesData.filter((data)=> {return mainData?.category === data.value})[0];

  // console.log("hello5",value.value
  // )
  return (
    <>
      <div>
        <PageHeader
          titles="Trips Details"
          active="Dealers"
          items={["Tables"]}
        />
        <ToastContainer />

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Modal size="l" show={InputShow} onHide={handleClose3}>
                <Modal.Header>
                  <Modal.Title>Add City To Trip</Modal.Title>
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
                              Select City
                              <span className="text-danger">*</span>
                            </label>

                            <Select
                              classNamePrefix="Select"
                              onChange={(e) => {
                                setSelectedCity(e.value);
                              }}
                              style={{ zIndex: "2000000" }}
                              options={mainDataCities}
                              placeholder="Select City"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Enter Duration
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              name="duration"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Duration like 5N/6D"
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
                              Enter Total No Of Days Trip Duration ( In Hours)
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              name="durationInHours"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Trip Duration In Hours ex. 24"
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
              <Modal size="l" show={InputShow2} onHide={handleClose32}>
                <Modal.Header>
                  <Modal.Title>Add Image</Modal.Title>
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
                              Select Image :
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              required
                              accept="image/*"
                              onChange={(event) => {
                                console.log(
                                  "change image",
                                  event.target.files[0]
                                );
                                setSelectedImage1(event.target.files[0]);
                              }}
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
                              Select Type
                            </label>
                            <select
                              className="form-control"
                              required
                              name="type"
                              id=""
                            >
                              <option value="Detail Screen">
                                Detail Screen (1440 × 400 px)
                              </option>
                              <option value="Home Screen">
                                Home Screen (200*200)
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
                    <Button variant="danger" onClick={handleClose32}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="l" show={InputShow3} onHide={handleClose33}>
                <Modal.Header>
                  <Modal.Title>Delete Image</Modal.Title>
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
                              Are You Sure Want To Delete This Image ?
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
                        <Button variant="success" type="submit">
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
                  <Modal.Title>Delete City From Trip</Modal.Title>
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
                              Are You Sure Want To Delete This City From
                              Selected Trip ?
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
                        <Button variant="success" type="submit">
                          Delete
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
                        {/* <div className="col-lg-4">
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
                              // defaultValue={{ value: 'red', label: 'Red' }}
                              defaultValue={categoriesData[0] || []}

                              // defaultInputValue={`{${categoriesData.filter((data)=> {return mainData?.category === data.value})[0]}}`}
                              // defaultInputValue={ "value":"646dc86b4461c294f1aa3e1d", "label": "Weekend trips" }
                            />
                          </div>
                        </div> */}
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
                              Partial Payment Percentage
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              name="partial_percentage"
                              defaultValue={mainData?.partial_percentage}
                              className="form-control"
                              id="recipient-name"
                              max="100"
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
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Archive
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-control"
                              name="isArchive"
                              id=""
                            >
                              <option
                                selected={mainData?.isArchive === true}
                                value="true"
                              >
                                Yes
                              </option>
                              <option
                                selected={mainData?.isArchive === false}
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
                              defaultValue={mainData?.about}
                              onChange={setAbout}
                            /> */}
                            <Editor
                              initialValue={mainData?.about}
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                              onEditorChange={(newText) => setAbout(newText)}
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
                              {/* <span className="text-danger">*</span> */}
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
                                  // unorderList
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
                              defaultValue={mainData?.inclusion_exclusion}
                              onChange={setinclusion_exclusion}
                            /> */}
                            <Editor
                              onEditorChange={(newText) =>
                                setinclusion_exclusion(newText)
                              }
                              initialValue={mainData?.inclusion_exclusion}
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
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
                              Things to Carry
                              {/* <span className="text-danger">*</span> */}
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
                              defaultValue={mainData?.things_to_carry}
                              onChange={setThingsToCarry}
                            /> */}
                            <Editor
                              onEditorChange={(newText) =>
                                setThingsToCarry(newText)
                              }
                              initialValue={mainData?.things_to_carry}
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
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
                              Terms & Conditions
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Editor
                              onEditorChange={(newText) =>
                                setTerms_conditions(newText)
                              }
                              initialValue={mainData?.things_to_carry}
                              // initialValue="<p>Terms</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                              // onChange={setTerms_conditions}
                            />
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
                              defaultValue={mainData?.terms_conditions}
                              onChange={setTerms_conditions}
                            /> */}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Cancellation Policy
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Editor
                              onEditorChange={(newText) =>
                                setcancellation_policy(newText)
                              }
                              initialValue={mainData?.cancellation_policy}
                              // initialValue="<p>Cancellation Policy</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                              // onChange={setcancellation_policy}
                            />

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
                              defaultValue={mainData?.cancellation_policy}
                              onChange={setcancellation_policy}
                            /> */}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Rent/Purchase Gears
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Editor
                              onEditorChange={(newText) =>
                                setRent_purchase_gears(newText)
                              }
                              initialValue={mainData?.rent_purchase_gears}
                              // defaultValue={"hi123"}
                              // initialValue="<p>Rent/Purchase Gears</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                            />
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
                              defaultValue={mainData?.rent_purchase_gears}
                              onChange={setRent_purchase_gears}
                            /> */}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              How To Reach?
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Editor
                              onEditorChange={(newText) =>
                                sethow_to_reach(newText)
                              }
                              initialValue={mainData?.how_to_reach}
                              // defaultValue={"hi123"}
                              // initialValue="<p>Rent/Purchase Gears</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                            />
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
                              defaultValue={mainData?.how_to_reach}
                              onChange={sethow_to_reach}
                            /> */}
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
              <Modal size="xl" show={InputShow6} onHide={handleClose36}>
                <Modal.Header>
                  <Modal.Title>Add Faq To Trip</Modal.Title>
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
                              Title <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Title"
                              name="title"
                              required
                              id=""
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
                              Description <span className="text-danger">*</span>
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
                              onChange={setFaqDescription}
                            /> */}
                            <Editor
                              initialValue="<p>This is the initial content of the editor</p>"
                              init={{
                                plugins: "link image code lists",
                                toolbar:
                                  "undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist",
                              }}
                              onChange={setFaqDescription}
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
                          Add
                        </Button>
                      </>
                    )}
                    <Button variant="danger" onClick={handleClose36}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal
                size="l"
                show={showAddCategoryModal}
                onHide={hideAddCategoryModelFunction}
              >
                <Modal.Header>
                  <Modal.Title>Add Categories</Modal.Title>
                  <span
                    className="d-flex ms-auto"
                    onClick={hideAddCategoryModelFunction}
                  >
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit8}
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
                              Select Category
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
                      onClick={hideAddCategoryModelFunction}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="xl" show={InputShow7} onHide={handleClose37}>
                <Modal.Header>
                  <Modal.Title>Delete Faq</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose37}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit7}
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
                              Are You Sure Want To Delete This Faq ?
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
                        <Button variant="success" type="submit">
                          Delete
                        </Button>
                      </>
                    )}
                    <Button variant="danger" onClick={handleClose37}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
              <Modal size="xl" show={InputShow8} onHide={handleClose38}>
                <Modal.Header>
                  <Modal.Title>Insert Add On</Modal.Title>
                  <span className="d-flex ms-auto" onClick={handleClose38}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </Modal.Header>
                <form
                  method="post"
                  onSubmit={formsSubmit9}
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
                            </label>

                            <input
                              type="text"
                              name="title"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Title"
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
                              Description
                            </label>

                            <input
                              type="text"
                              name="description"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Description"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Price
                            </label>

                            <input
                              type="number"
                              name="price"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Price"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Max Qty
                            </label>

                            <input
                              type="number"
                              name="maxQty"
                              className="form-control"
                              id="recipient-name"
                              required
                              placeholder="Enter Max Qty"
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
                          Save
                        </Button>
                      </>
                    )}
                    <Button variant="danger" onClick={handleClose38}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>

              <Card.Header className="">
                <div className="container">
                  <div className="row">
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
                    defaultActiveKey="firstC"
                  >
                    <Nav
                      variant="pills"
                      className="panel-tabs nav-tabs panel-info"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="firstC">
                          <i className="fe fe-user me-1"></i>Cities
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fifthC">
                          <i className="fe fe-image me-1"></i>Categories
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="secondC">
                          <i className="fe fe-image me-1"></i>Images
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="forthC">
                          <i className="fe fe-info me-1"></i>Faq's
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fifveC">
                          <i className="fe fe-plus-square me-1"></i>Add On
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="thirdC" onClick={handleShow35}>
                          <i className="fe fe-calendar me-1"></i>Trip Details
                        </Nav.Link>
                      </Nav.Item>

                      {/* <Nav.Item>
                        <Nav.Link eventKey="fourthC">
                          <i className="fe fe-bell me-1"></i>Tab 4
                        </Nav.Link>
                      </Nav.Item> */}
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="firstC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow3}
                        >
                          Add City To This Trip
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>City</th>
                              <th>Duration</th>
                              <th>Duration In Hours</th>
                              <th>Active</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData?.cities &&
                              mainData?.cities.length > 0 &&
                              mainData?.cities.map((data2, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{data2?.cityName}</td>
                                    <td>{data2?.duration}</td>
                                    <td>{data2?.durationInHours}</td>

                                    <td>{data2.isActive ? "Yes" : "No"}</td>

                                    <td>
                                      <Button
                                        className="bg-primary mt-3 me-1"
                                        onClick={() => {
                                          navigate(
                                            `/admin/tripsCityDetails/${id}`,
                                            {
                                              state: {
                                                mainData: mainData,
                                                cityData: data2,
                                                id: id,
                                              },
                                            }
                                          );
                                        }}
                                        // disabled={data.status ? true : false}
                                      >
                                        <i className="fa fa-edit"></i>
                                      </Button>
                                      <Button
                                        className="me-3 mt-2   mt-1"
                                        variant="danger"
                                        animation="flip"
                                        onClick={() => {
                                          setDeleteCityId(data2.cityID?._id);
                                          handleShow34();
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
                      <Tab.Pane eventKey="secondC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow32}
                        >
                          Add Images To Trips
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Image</th>
                              <th>Type</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData?.images &&
                              mainData?.images.length > 0 &&
                              mainData?.images.map((data2, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>
                                      <a href={data2?.link} download>
                                        <img
                                          src={data2?.link}
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                          }}
                                          alt="alt"
                                          loading="lazy"
                                        />
                                      </a>
                                    </td>
                                    <td>{data2?.type}</td>
                                    <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
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
                      <Tab.Pane eventKey="forthC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow36}
                        >
                          Add Faq To Trip
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData?.faq &&
                              mainData?.faq.length > 0 &&
                              mainData?.faq.map((data2, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>

                                    <td>{data2?.title}</td>
                                    <td>
                                      <p
                                        id={i + 1}
                                        dangerouslySetInnerHTML={{
                                          __html: data2.description,
                                        }}
                                      ></p>
                                    </td>
                                    <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
                                        onClick={() => {
                                          setDeleteFaqId(data2._id);
                                          handleShow37();
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
                      <Tab.Pane eventKey="fifveC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={handleShow38}
                        >
                          Insert AddOn To Trips
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Max Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData?.faq &&
                              mainData?.addOn.length > 0 &&
                              mainData?.addOn.map((data2, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>

                                    <td>{data2?.title}</td>
                                    <td>
                                      <p
                                        id={i + 1}
                                        dangerouslySetInnerHTML={{
                                          __html: data2.description,
                                        }}
                                      ></p>
                                    </td>
                                    <td>{data2?.price}</td>
                                    <td>{data2?.maxQty}</td>

                                    {/* <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
                                        onClick={() => {
                                          setDeleteFaqId(data2._id);
                                          handleShow37();
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </Button>
                                    </td> */}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="fifthC">
                        <Button
                          className="me-3 mt-2 mb-4 float-right mt-1"
                          variant="primary"
                          animation="flip"
                          onClick={showAddCategoryModelFunction}
                        >
                          Add Categories
                        </Button>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Categories</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData?.categories &&
                              mainData?.categories.length > 0 &&
                              mainData?.categories.map((data2, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>

                                    <td>{data2?.categoryName}</td>
                                    <td>
                                      <Button
                                        className="me-3 mt-2 mb-4  mt-1"
                                        variant="danger"
                                        animation="flip"
                                        disabled
                                        onClick={() => {
                                          setDeleteFaqId(data2._id);
                                          handleShow37();
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
                          onClick={handleShow35}
                        >
                          View Details
                        </Button>
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
