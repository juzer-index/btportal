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
import { useNavigate } from "react-router-dom";

import {
  getTimeSheetByUserId,
  getTimeSheetByUserIdCurrentMonth,
} from "../../utils/api";
import { Outlet, Link } from "react-router-dom";
import moment from "moment";

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

const TimeSheet = (props) => {
  const tableRef = useRef(null);

  const [week, setWeek] = useState(null);
  const navigate = useNavigate();

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);

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
  const [mainData2, setMainData2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");

  // const saveToMongoDB = async () => {
  //   const formData = new FormData();
  //   formData.append('week', selectedWeek);
  //   try {
  //     const response = await fetch('/api/createTimeSheet', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //     } else {
  //     }
  //   } catch (error) {
  //   }
  // };
  const weekSelected = (week) => {
    console.log("week1", week);
    // The 'week' value is in the format "YYYY-Www"
    // Extract the year and week number from the input
    const [year, weekNumber] = week.split("-W");

    if (year && weekNumber) {
      // Calculate the start date of the selected week
      const startDate = new Date(year, 0); // January is month 0
      startDate.setDate(1 + (parseInt(weekNumber) - 1) * 7); // Calculate the start date based on the week number

      // Create an array of dates for the selected week
      const selectedDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        let abc = {
          dateNew: date,
        };
        selectedDates.push(abc);
      }
      console.log("hello2", selectedDates);
      setSelectedDates(selectedDates);
    }
  };

  const headersColumn = (headerText, accessor) => {
    return {
      Header: headerText,
      accessor: accessor,
      className: "text-center wd-15p border-bottom-0",
      isSorted: true,
      Cell: (props) => {
        const weekNumber = props.cell.row.original[0].week;
        const startDate = moment(weekNumber, "YYYY-[W]WW").startOf("week");
        const endDate = moment(weekNumber, "YYYY-[W]WW").endOf("week");

        const formattedStartDate = startDate.format("DD-MMM-YYYY");
        const formattedEndDate = endDate.format("DD-MMM-YYYY");

        console.log("props.cell.row.original", props.cell.row.original);
        //  const userId = props.cell.row.original.user_id._id;
        return (
          <div style={{ textAlign: "center" }}>
            <Link
              to={`/admin/TimeSheetDetails/${localStorage.getItem(
                "user_id"
              )}/${weekNumber}`}
              className="btn btn-primary"
            >
              {/* {props.cell.row.original.projectId} */}
              {formattedStartDate}/ {formattedEndDate}
            </Link>
          </div>
        );
      },
    };
  };
  const yourHeader = headersColumn("Weeks", "week");

  const COLUMN = useMemo(
    () => [
      {
        Header: "No",
        accessor: "srno",
        className: "text-center wd-15p border-bottom-0",
        isSorted: true,
        Cell: (props) => (
          <div style={{ textAlign: "center" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
      },
      yourHeader,
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

  function getWeekDateRange(year, weekNumber) {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (weekNumber - 1) * 7 - firstDayOfYear.getDay() + 1;
    const startDate = new Date(year, 0, days);
    const endDate = new Date(year, 0, days + 6);
    return { startDate, endDate };
  }

  function filterDataForCurrentMonth(dataArray) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return dataArray.filter((item) => {
      const [year, weekNumber] = item.week.split("-W").map(Number);

      if (year !== currentYear) {
        return false;
      }

      const { startDate, endDate } = getWeekDateRange(year, weekNumber);

      return (
        (startDate.getMonth() === currentMonth &&
          startDate.getFullYear() === currentYear) ||
        (endDate.getMonth() === currentMonth &&
          endDate.getFullYear() === currentYear)
      );
    });
  }

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getTimeSheetByUserIdCurrentMonth(
        localStorage.getItem("user_id")
      );
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData", apiData.data);
        setMainData(apiData.data);
      }
    } catch (err) {
      // console.log("err", err.name);
      // if (err.response) {
      //   setError(err.response.data.message);
      //   setErrorToast(err.response.data.message);
      // } else if (err.name === "AxiosError") {
      //   setError(err.message);
      //   setErrorToast(err.message);
      // } else {
      //   setError("something went wrong");
      //   setErrorToast("something went wrong");
      // }
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
  // const formsSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   const form = e.target;
  //   const formData = new FormData(form);
  //   const data = {
  //     week: formData.get('week'),
  //     user_id: formData.get('user_id'),
  //     projectId: formData.get('projectId'),
  //     task: formData.get('task'),
  //   };
  //   try {
  //     // Make an HTTP POST request to the server
  //     const response = await fetch('/api/submitData', {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.ok) {
  //       // Data was successfully submitted
  //       // Handle success here
  //     } else {
  //       // Handle any errors or failed submissions here
  //     }
  //   } catch (error) {
  //     // Handle network errors or exceptions here
  //   }
  //   setLoading(false);
  // };

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

    // try {
    //   const apiData = await addCustomer(body);
    //   if (apiData.error) {
    //     setError(apiData.error);
    //   } else {
    //     getData();
    //     handleClose3();
    //     dispatch(fetchProjects());
    //     toast.success(
    //       <p className="text-white tx-16 mb-0">
    //         Success : Data Added Successfully !
    //       </p>,
    //       {
    //         position: toast.POSITION.TOP_RIGHT,
    //         hideProgressBar: false,
    //         autoClose: 3000,
    //         theme: "colored",
    //       }
    //     );
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
  };
  const updateData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    // try {
    //   const apiData = await updateSection(body);
    //   if (apiData.error) {
    //     setError(apiData.error);
    //   } else {
    //     getData();
    //     largemodalClose();
    //     toast.success(
    //       <p className="text-white tx-16 mb-0">Success : Updated !</p>,
    //       {
    //         position: toast.POSITION.TOP_RIGHT,
    //         hideProgressBar: false,
    //         autoClose: 3000,
    //         theme: "colored",
    //       }
    //     );
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
  };
  function formatDate(date) {
    console.log("date123", date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

    return `${day}-${month}-${year}`;
  }
  useEffect(() => {
    // getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader titles={`TimeSheet`} active="Retailers" items={["Tables"]} />

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
                      onClick={() => {
                        navigate("/admin/AddTimeSheet");
                      }}
                    >
                      Add TimeSheet
                    </Button>
                    <ToastContainer />

                    <Modal
                      size="xl"
                      fullscreen
                      show={InputShow}
                      onHide={handleClose3}
                    >
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
                    <h6>Current Month Entered TimeSheet</h6>
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

export default TimeSheet;
