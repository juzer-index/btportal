import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styles from "./DataTable.module.scss";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  defaultColumn,
} from "react-table";
import "react-data-table-component-extensions/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCities,
  addCity,
  updateCity,
  addSliderImagesURL,
  getSliderImages,
  getSections,
  addSection,
  updateTemplate,
  getUsers,
  addUser,
  getTemplates,
  createTemplate,
  addTemplates,
  updateTemplateDetails,
  deleteTemplateDetails,
} from "../../utils/api";
import { Outlet, Link, useParams } from "react-router-dom";

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
import { useDownloadExcel } from "react-export-table-to-excel";
import ExcelExport from "./ExcelExport";

const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
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

const TemplateDetails = (props) => {
  let { id } = useParams();

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);
  const [largeShow2, setlargeShow2] = useState(false);

  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);

  const largemodalClose2 = () => setlargeShow2(false);
  const largemodalShow2 = () => setlargeShow2(true);
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
        accessor: "_id",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "center" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
      },
      headersColumn("Task", "name"),
      headersColumn("Sequence", "sequence"),
      {
        Header: "Sub Task",
        accessor: "_id",
        className: "text-center wd-5dp border-bottom-0",
        id: "new",
        Cell: (props) => (
          <>
            <div>
              <Link
                to={`/TemplateDetailsSubTask/${props.value}/${id}`}
                className="btn btn-warning mr-2"
              >
                <i className="fa fa-info"></i>
              </Link>
            </div>
          </>
        ),
      },
      {
        Header: "Actions",
        accessor: "_id",
        className: "text-center wd-5dp border-bottom-0",
        id: "ActionsNew",
        Cell: (props) => (
          <>
            <>
              <div>
                <Button
                  style={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    largemodalShow();
                    setModalData(props.cell.row.original);
                  }}
                  className="btn btn-success"
                >
                  <i class="fa fa-edit"></i>
                </Button>
                <Button
                  style={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    largemodalShow2();
                    setModalData(props.cell.row.original);
                  }}
                  className="btn btn-danger"
                >
                  <i class="fa fa-trash"></i>
                </Button>
              </div>
            </>
          </>
        ),
      },
    ],
    []
  );

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
      const apiData = await getTemplates();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        let abc = apiData.data?.filter((data, i) => {
          return data?._id === id;
        });
        console.log("abc", abc);
        setMainData(abc[0]?.templates);
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
    // formData.append("icon", selectedImage1);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
  };
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
  const formsSubmitDelete = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // formData.append("icon", selectedImage1Update);
    console.log("formData", formData);
    const formJson = Object.fromEntries(formData.entries());
    deleteData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addTemplates(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        handleClose3();
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
  const updateData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await updateTemplateDetails(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Updated !</p>,
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
  const deleteData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await deleteTemplateDetails(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        largemodalClose2();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : Deleted !</p>,
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
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users table",
    sheet: "Users",
  });
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`Templates`} active="Retailers" items={["Tables"]} />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
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
                      Add Title
                    </Button>

                    <ToastContainer />

                    <Modal size="l" show={InputShow} onHide={handleClose3}>
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
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Tittle :
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                    name="templateName"
                                    placeholder="Enter Title"
                                  />
                                  <input
                                    type="hidden"
                                    className="form-control"
                                    required
                                    value={id}
                                    name="id"
                                    placeholder="Enter First Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Sequence :
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    required
                                    name="sequence"
                                    placeholder="Enter Sequence"
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
                  <div className="col-lg-8"></div>
                  <div className="col-lg-2">
                    <ExcelExport tableRef={tableRef} name="Users" />
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
                      ref={tableRef}
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
      <Modal size="l" show={largeShow} onHide={largemodalClose}>
        <ModalHeader>
          <ModalTitle>Update Template Details</ModalTitle>
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
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Name: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="newName"
                      defaultValue={modalData && modalData?.name}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Name"
                    />
                    <input
                      type="hidden"
                      value={modalData && modalData?._id}
                      name="templatesId"
                      required
                    />
                    <input
                      type="hidden"
                      value={id}
                      name="templateId"
                      required
                    />
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label"
                      >
                        Sequence :<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        defaultValue={modalData && modalData?.sequence}
                        name="sequence"
                        placeholder="Enter Sequence"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Sub Title: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="subTitle"
                      defaultValue={modalData && modalData?.subTitle}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Sub Title"
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
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Active: <span className="text-danger">*</span>
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
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Select Type <span className="text-danger">*</span>
                    </label>
                    <select name="type" className="form-control" id="">
                      <option
                        selected={modalData && modalData?.type === "Trips"}
                        value="Trips"
                      >
                        Trips
                      </option>
                      <option
                        selected={modalData && modalData?.type === "image"}
                        value="image"
                      >
                        Image
                      </option>
                    </select>
                  </div>
                </div> */}
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
      <Modal size="l" show={largeShow2} onHide={largemodalClose2}>
        <ModalHeader>
          <ModalTitle>Delete Template Details</ModalTitle>
          <span className="d-flex ms-auto" onClick={largemodalClose2}>
            <i className="fe fe-x ms-auto"></i>
          </span>
        </ModalHeader>
        <form
          method="post"
          onSubmit={formsSubmitDelete}
          autocomplete="off"
          encType="multipart/form-data"
        >
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Are You Sure Want To Delete This Template ?{" "}
                      <span className="text-danger">*</span>
                    </label>
                    {/* <input
                      type="text"
                      name="newName"
                      defaultValue={modalData && modalData?.name}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Name"
                    /> */}
                    <input
                      type="hidden"
                      value={modalData && modalData?._id}
                      name="templatesId"
                      required
                    />
                    <input
                      type="hidden"
                      value={id}
                      name="templateId"
                      required
                    />
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Sub Title: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="subTitle"
                      defaultValue={modalData && modalData?.subTitle}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Sub Title"
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
                  {" "}
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Active: <span className="text-danger">*</span>
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
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Select Type <span className="text-danger">*</span>
                    </label>
                    <select name="type" className="form-control" id="">
                      <option
                        selected={modalData && modalData?.type === "Trips"}
                        value="Trips"
                      >
                        Trips
                      </option>
                      <option
                        selected={modalData && modalData?.type === "image"}
                        value="image"
                      >
                        Image
                      </option>
                    </select>
                  </div>
                </div> */}
              </div>
            </div>
          </Modal.Body>
          <ModalFooter>
            <Button variant="secondary" onClick={largemodalClose2}>
              Close
            </Button>

            <Button variant="danger" type="submit">
              {loading ? "Loading...." : "Delete"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default TemplateDetails;
