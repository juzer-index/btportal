import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./DataTable.module.scss";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import "react-data-table-component-extensions/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCities,
  addCity,
  updateCity,
  getProjectById,
  getUsers,
  createTask,
  updateTask,
  addTodoInTask,
} from "../../utils/api";
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
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
import ExcelExport from "./ExcelExport";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
    id: name,
    // Cell: (props) => <div style={{textAlign:"left"}}>{value2}</div>,
  };
};

const Projects = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customersData, setCustomersData] = useState([]);

  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const [InputShow, setInputShow] = useState(false);

  const [largeShow2, setlargeShow2] = useState(false);
  const largemodalClose2 = () => setlargeShow2(false);
  const largemodalShow2 = () => setlargeShow2(true);

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
        Error: {error?.length > 0 ? error : errorFromBackend}
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
      let payload = {
        id: id,
      };
      const apiData = await getProjectById(payload);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData getProjectById2", apiData.data);
        setMainData(apiData.data);
      }
      const apiData2 = await getUsers();
      if (apiData2.error) {
        setError(apiData2.error);
      } else {
        console.log("getCustomers", apiData2.data);

        const data = [];
        apiData2.data?.map((cData, i) => {
          let abc = {
            label: cData.firstName + cData.lastName,
            value: cData._id,
          };
          data.push(abc);
        });
        setCustomersData(data);
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
  }, [id]);

  useEffect(() => {
    setMainData([]);
    getData();
  }, [id]);

  const formsSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if (selectedImage1) {
      formData.append("file", selectedImage1);
    }
    if (selectedCustomer) {
      formData.append("assignee", selectedCustomer);
    }
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
    // if (selectedImage1) {
    //   formData.append("file", selectedImage1);
    // }
    // if (selectedCustomer) {
    //   formData.append("assignee", selectedCustomer);
    // }
    // console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData2(formJson);
    setLoading(false);
  };
  const formsSubmitUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if (selectedImage1) {
      formData.append("file", selectedImage1);
    }
    if (selectedCustomer) {
      formData.append("assignee", selectedCustomer);
    }
    const formJson = Object.fromEntries(formData.entries());
    updateData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await createTask(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
        setSelectedCustomer("");
        setSelectedImage1("");
        setModalData([]);
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
      const apiData = await addTodoInTask(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("apiData", apiData);
        // handleClose3();
        // setSelectedCustomer("");
        // setSelectedImage1("");
        // setModalData([]);
        // toast.success(
        //   <p className="text-white tx-16 mb-0">
        //     Success : Data Added Successfully !
        //   </p>,
        //   {
        //     position: toast.POSITION.TOP_RIGHT,
        //     hideProgressBar: false,
        //     autoClose: 3000,
        //     theme: "colored",
        //   }
        // );
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
      const apiData = await updateTask(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose();
        setSelectedCustomer("");
        setSelectedImage1("");
        setModalData([]);
        toast.success(
          <p className="text-white tx-16 mb-0">Success : City Updated !</p>,
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
  const tableRef = React.useRef(null);

  const setModalFunction = (data) => {
    // console.log("modalData",data);
    // largemodalShow2();
    // setModalData(data);
    // setSelectedCustomer("");
    // setSelectedImage1("");
    navigate(`/taskDetails/${data._id}`);
  };
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Project : ${mainData?.name}`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="">
                <div className="row">
                  <div className="col-lg-12">
                    <label htmlFor="">
                      Customer : {mainData?.customerId?.name}
                    </label>
                  </div>
                  <div className="col-lg-2">
                    <Button
                      className="me-3 mt-2"
                      variant="primary"
                      animation="flip"
                      onClick={handleShow3}
                    >
                      Add Task
                    </Button>
                    <ToastContainer />

                    <Modal size="l" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add Task</Modal.Title>
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
                                    Name:
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter  Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Remark:
                                  </label>
                                  <input
                                    type="text"
                                    name="remark"
                                    className="form-control"
                                    id="recipient-name"
                                    placeholder="Enter Remark"
                                  />
                                  <input
                                    type="hidden"
                                    name="projectId"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    value={mainData?._id}
                                    placeholder="Enter Remark"
                                  />
                                  <input
                                    type="hidden"
                                    name="customerId"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    value={mainData?.customerId?._id}
                                    placeholder="Enter Remark"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Due Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="dueDate"
                                    className="form-control"
                                    id="recipient-name"
                                    placeholder="Enter Due Date"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Assign To
                                  </label>
                                  <Select
                                    classNamePrefix="Select"
                                    onChange={(e) => {
                                      console.log("e", e);
                                      setSelectedCustomer(e.value);
                                    }}
                                    // isMulti
                                    // style={{ zIndex: "2000000" }}
                                    options={customersData}
                                    placeholder="Users"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Attachment:
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
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
                              {/* <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Icon : (100*100)
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
                  <div className="col-lg-8"></div>
                  <div className="col-lg-2">
                    <ExcelExport tableRef={tableRef} name="Tasks" />
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
                      <table ref={tableRef} className="table table-bordered">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Remark</th>
                            <th>Status</th>
                            <th>Assignee</th>
                            <th>Due Date</th>
                            <th>Progress</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mainData?.tasks?.map((tData, i) => {
                            const doneTasks = tData.todo?.filter(
                              (task) => task.status === "DONE"
                            );
                            const allDone =
                              tData.todo?.length > 0 &&
                              tData.todo?.every(
                                (task) => task.status === "DONE"
                              );
                            console.log("allDone", allDone);

                            let naTasks = tData.todo?.filter(
                              (task) => task.status === "NA"
                            );
                            console.log("");
                            naTasks = naTasks?.length
                              ? Number(naTasks?.length)
                              : 0;
                            const totalTasks = tData.todo?.length - naTasks;
                            let percentageDone =
                              (doneTasks.length / totalTasks) * 100;

                            if (!percentageDone) {
                              percentageDone = 0;
                            }
                            let color = "";
                            if (tData?.status === "TO DO") {
                              color = "bg-warning";
                            } else if (tData?.status === "IN PROGRESS") {
                              color = "bg-info";
                            } else if (tData?.status === "DONE") {
                              color = "bg-success";
                            } else if (tData?.status === "PAUSED") {
                              color = "bg-danger";
                            } else if (tData?.status === "NA") {
                              color = "bg-primary";
                            }
                            return (
                              <tr style={{ cursor: "pointer" }}>
                                <th
                                  onClick={() => {
                                    setModalFunction(tData);
                                  }}
                                >
                                  {i + 1}
                                </th>
                                <th
                                  onClick={() => {
                                    setModalFunction(tData);
                                  }}
                                >
                                  {tData?.name}
                                </th>
                                <th
                                  onClick={() => {
                                    setModalFunction(tData);
                                  }}
                                >
                                  {tData?.remark}
                                </th>
                                <th
                                  className={`bg-${
                                    allDone ? "success" : "warning"
                                  } text-white`}
                                >
                                  {allDone ? "DONE" : "PENDING"}
                                </th>
                                <th
                                  onClick={() => {
                                    setModalFunction(tData);
                                  }}
                                >
                                  {tData?.assignee?.firstName}{" "}
                                  {tData?.assignee?.lastName}
                                </th>
                                <th
                                  onClick={() => {
                                    setModalFunction(tData);
                                  }}
                                >
                                  {tData?.dueDate}
                                </th>
                                <th onClick={() => setModalFunction(tData)}>
                                  {percentageDone !== 0 && (
                                    <>
                                      <div
                                        className="progress"
                                        style={{
                                          position: "relative",
                                          height: "30px",
                                        }}
                                      >
                                        <div
                                          className="progress-bar bg-info"
                                          role="progressbar"
                                          style={{
                                            width: `${Math.max(
                                              percentageDone,
                                              5
                                            )}%`,
                                          }} // Ensure minimum width for text readability
                                          aria-valuenow={percentageDone}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        >
                                          <span
                                            style={{
                                              color:
                                                percentageDone > 20
                                                  ? "white"
                                                  : "black", // If the bar is too short, the text color is black
                                              position: "absolute",
                                              right: "5px",
                                              top: "50%",
                                              transform: "translateY(-50%)",
                                            }}
                                          >
                                            {percentageDone.toFixed(2)}%
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {percentageDone === 0 && "0%"}
                                </th>

                                <th>
                                  <button
                                    onClick={() => {
                                      setModalData(tData);
                                      setSelectedCustomer("");
                                      setSelectedImage1("");
                                      largemodalShow();
                                    }}
                                    className="btn btn-primary"
                                  >
                                    <i className="fe fe-edit"></i>
                                  </button>
                                </th>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="l" show={largeShow} onHide={largemodalClose}>
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
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="recipient-name"
                      required
                      defaultValue={modalData && modalData?.name}
                      placeholder="Enter  Name"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Remark:
                    </label>
                    <input
                      type="text"
                      name="remark"
                      defaultValue={modalData && modalData?.remark}
                      className="form-control"
                      id="recipient-name"
                      placeholder="Enter Remark"
                    />
                    <input
                      type="hidden"
                      name="projectId"
                      className="form-control"
                      id="recipient-name"
                      required
                      value={mainData?._id}
                      placeholder="Enter Remark"
                    />
                    <input
                      type="hidden"
                      name="customerId"
                      className="form-control"
                      id="recipient-name"
                      required
                      value={mainData?.customerId?._id}
                      placeholder="Enter Remark"
                    />
                    <input
                      type="hidden"
                      name="id"
                      className="form-control"
                      id="recipient-name"
                      required
                      value={modalData && modalData?._id}
                      placeholder="Enter Remark"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Due Date:
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      defaultValue={modalData && modalData?.dueDate}
                      className="form-control"
                      id="recipient-name"
                      placeholder="Enter Due Date"
                    />
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Status
                    </label>
                    <select className="form-control" name="status" id="">
                      <option
                        selected={modalData && modalData?.status === "TO DO"}
                        value="TO DO"
                      >
                        TO DO
                      </option>
                      <option
                        selected={
                          modalData && modalData?.status === "IN PROGRESS"
                        }
                        value="IN PROGRESS"
                      >
                        IN PROGRESS
                      </option>

                      <option
                        selected={modalData && modalData?.status === "DONE"}
                        value="DONE"
                      >
                        DONE
                      </option>
                      <option
                        selected={modalData && modalData?.status === "PAUSED"}
                        value="PAUSED"
                      >
                        PAUSED
                      </option>
                      <option
                        selected={modalData && modalData?.status === "NA"}
                        value="NA"
                      >
                        NA
                      </option>
                    </select>
                  </div>
                </div> */}
                <div className="col-lg-12">
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Assign To
                    </label>
                    <Select
                      classNamePrefix="Select"
                      onChange={(e) => {
                        console.log("e", e);
                        setSelectedCustomer(e.value);
                      }}
                      // isMulti
                      // style={{ zIndex: "2000000" }}
                      options={customersData}
                      placeholder="Users"
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

export default Projects;
