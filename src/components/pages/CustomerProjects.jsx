import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import Select from "react-select";
import {
  getAllCities,
  addCity,
  updateCity,
  addSliderImagesURL,
  getSliderImages,
  getSections,
  addSection,
  updateSection,
  getUsers,
  addUser,
  getCustomers,
  addCustomer,
  getProjectsData,
  createProject,
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
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../Redux/customerSlice";
import { fetchProjects } from "../../Redux/projectSlice";
import ExcelExport from "./ExcelExport";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-left wd-15p border-bottom-0",
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

const CustomerProjects = (props) => {
  let { id } = useParams();

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const customers = useSelector((state) => state.customers.data);

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
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const COLUMN = useMemo(
    () => [
      {
        Header: "No",
        accessor: "_id",
        className: "text-left wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
      },
      {
        Header: "Project Name",
        accessor: "name",
        className: "text-left wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.value}</span>
          </div>
        ),
      },
      // headersColumn("Project Name", "name"),
      //   {
      //     Header: "Customer Name",
      //     accessor: "customerId",
      //     className: "text-center wd-15p border-bottom-0",
      //     isSorted: "true",

      //     Cell: (props) => (
      //       <div style={{ textAlign: "center" }}>
      //         <span>{props.value?.name}</span>
      //       </div>
      //     ),
      //   },
      // headersColumn("Mobile","mobile"),
      // headersColumn("LastName","lastName"),
      // headersColumn("Email","email"),
      //   headersColumn("Role","designation"),
      // {
      //   Header: "Role",
      //   accessor: "designation",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) =>  <div style={{textAlign:"left"}}><span>{props.value ? props.value :"ADMIN"}</span></div>,

      // },
      // {
      //   Header: "Active",
      //   accessor: "isActive",
      //   className: "text-center wd-15p border-bottom-0",
      //   isSorted: "true",

      //   Cell: (props) =>  <div style={{textAlign:"left"}}><span>{props.value ? <StatusButton bg="success" /> : <StatusButton bg="danger"/>}</span></div>,

      // },
      //   {
      //     Header: "Actions",
      //     accessor: "_id",
      //     className: "text-center wd-5dp border-bottom-0",
      //     id:"new",
      //     Cell: (props) => (
      //       <>
      //         <div>
      //         <Link to={`/admin_section_details/${props.value}`} className="btn btn-secondary mr-2">
      //           <i className="fa fa-edit"></i>
      //           </Link>
      //           <Button
      //             style={{
      //               marginLeft:"10px"
      //             }}
      //             onClick={() => {
      //               largemodalShow();
      //               setModalData(props.cell.row.original);
      //             }}
      //           >
      //             <i class="fe fe-list"></i>
      //           </Button>

      //         </div>
      //       </>
      //     ),
      //   },
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
  const dispatch = useDispatch();

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
      const apiData = await getProjectsData();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData", apiData.data);
        let data2 = apiData.data.filter((data, i) => {
          return data?.customerId?._id === id;
        });
        console.log("customerProjects", data2);
        setMainData(data2);
      }
      const apiData2 = await getCustomers();
      if (apiData2.error) {
        setError(apiData2.error);
      } else {
        console.log("getCustomers", apiData2.data);

        const data = [];
        apiData2.data?.map((cData, i) => {
          let abc = {
            label: cData.name,
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
    if (selectedCustomer) {
      const form = e.target;
      const formData = new FormData(form);
      formData.append("customerId", selectedCustomer);
      // console.log("formData", formData);
      const formJson = Object.fromEntries(formData.entries());
      addData(formJson);
      setLoading(false);
    } else {
      setErrorToast("Please Select Customer First");
      setLoading(false);
    }
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

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await createProject(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        getData();
        setSelectedCustomer([]);
        dispatch(fetchProjects());

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
        window.location.reload();
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
      const apiData = await updateSection(body);
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
  const tableRef = React.useRef(null);

  useEffect(() => {
    // getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`Projects`} active="Retailers" items={["Tables"]} />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="">
                <div className="row">
                  <div className="col-lg-2">
                    <ExcelExport tableRef={tableRef} name="Projects" />
                  </div>

                  <div className="col-lg-2">
                    <ToastContainer />

                    <Modal size="l" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add Project</Modal.Title>
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
                                    Name :<span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                    name="name"
                                    placeholder="Enter  Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Select Customer :
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Select
                                    classNamePrefix="Select"
                                    onChange={(e) => {
                                      console.log("e", e);
                                      setSelectedCustomer(e.value);
                                    }}
                                    required
                                    // isMulti
                                    // style={{ zIndex: "2000000" }}
                                    options={customersData}
                                    placeholder="Customers"
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
                  {/* <div className="col-lg-8"></div> */}
                </div>
                <div className="row mt-4">
                  <div className="col-lg-12">
                    <h3>
                      Customer Name :{" "}
                      {mainData && mainData[0]?.customerId?.name}
                    </h3>
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
                      ref={tableRef}
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
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Title: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={modalData && modalData?.title}
                      className="form-control"
                      id="recipient-name"
                      required
                      placeholder="Enter Title"
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

export default CustomerProjects;
