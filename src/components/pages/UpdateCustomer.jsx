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
  getCustomerById,
  getTripsWithTitle,
  updateCustomer,
} from "../../utils/api";
import { Outlet, Link, useNavigate, useParams } from "react-router-dom";

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

const UpdateCustomer = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();

  const status = props.isactive;
  const apiStatus = status === true ? "true" : "false";
  const [stateName, setStateName] = useState("");
  const [InputShow, setInputShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const apiData = await getCustomerById(id);
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
  }, [setErrorToast, id]);

  const formsSubmitUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("icon", selectedImage1Update);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    updateData(formJson);
    setLoading(false);
  };

  const updateData = async (customerId, body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateCustomer(customerId, body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Updated !</p>,
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
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Update  Customer`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <ToastContainer />

          <Card>
            <form
              method="post"
              onSubmit={formsSubmitUpdate}
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
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
                        <input
                          type="hidden"
                          value={mainData && mainData?._id}
                          name="id"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" type="submit">
                  Update
                </Button>

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

export default UpdateCustomer;
