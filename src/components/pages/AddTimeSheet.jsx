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
  addTrips,
  createTimeSheet,
  getAllCategories,
  getProjectsData,
  getTripsWithTitle,
  getUserTimesheetDetails,
} from "../../utils/api";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import Select from "react-select";
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

const headersColumn = (name, value2) => {
  return {
    // Header: name.toUpperCase(),
    Header: (props) => (
      <div style={{ textAlign: "left" }}>
        <span>{name.toUpperCase()}</span>
      </div>
    ),
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

const AddTimeSheet = (props) => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedRemark, setSelectedRemark] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [remark, setRemark] = useState([]);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        week: selectedWeek,
        projectId: selectedProject,
        remark: selectedRemark ? selectedRemark : "",
        user_id: localStorage.getItem("user_id"),
        task: "",
        dates: selectedDates?.map((date22, ii) => {
          return { date: date22.date, totalHours: 0 };
        }),
      },
    ]);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleProjectChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].projectId = value;
    setTasks(newTasks);
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].task = value;
    setTasks(newTasks);
  };
  const handleRemarkChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].remark = value;
    setRemark(newTasks);
  };
  const handleDateChange = (taskIndex, dateIndex, newDate, newHour) => {
    const newTasks = [...tasks];
    const taskToUpdate = newTasks[taskIndex];

    // Ensure the dates array exists and has the necessary length
    if (!taskToUpdate.dates) {
      taskToUpdate.dates = [];
    }

    // Make sure the specific date index exists in the array
    while (taskToUpdate.dates.length <= dateIndex) {
      taskToUpdate.dates.push({ date: "", totalHours: "" });
    }

    // Update the specific date and hour
    taskToUpdate.dates[dateIndex] = { date: newDate, totalHours: newHour };
    setTasks(newTasks);
  };

  const [about, setAbout] = useState("");
  const [inclusion_exclusion, setinclusion_exclusion] = useState("abc");
  const [thingsToCarry, setThingsToCarry] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [cancellation_policy, setcancellation_policy] = useState("");
  const [rent_purchase_gears, setRent_purchase_gears] = useState("");
  const [how_to_reach, sethow_to_reach] = useState("");
  const [category, setCategory] = useState([]);
  const [multipleCategory, setMultipleCategory] = useState([]);

  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);

  const largemodalClose = () => setlargeShow(false);
  const largemodalShow = () => setlargeShow(true);
  const status = props.isactive;
  const apiStatus = status === true ? "true" : "false";
  const [stateName, setStateName] = useState("");
  const [InputShow, setInputShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [mainData, setMainData] = useState([]);
  const [mainData2, setMainData2] = useState([]);
  const [mainData3, setMainData3] = useState([]);
  const [categoriesData, setMainDataCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const findTotalHoursOfDate = (calculateData) => {
    let totalHoursEntered = 0;

    mainData3?.dates.find((mData3, i) => {
      return mainData3.find((d) => formatDate(d.date) === calculateData);
    });
  };

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
      {
        Header: "Project",
        accessor: "projectId",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "center" }}>
            <span>{props.value.name}</span>
          </div>
        ),
      },

      {
        Header: "Dates",
        accessor: "dates",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <table className="table-bordered table-hover table-active table">
              <tr>
                <th>Dates</th>
                {props.value?.map((pData, i) => {
                  return <th>{pData?.date}</th>;
                })}
                <th>Totals</th>
              </tr>
              <tr>
                <th>Total Hours</th>
                {props.value?.map((pData, i) => {
                  return <th>{pData?.totalHours}</th>;
                })}
                <th>
                  {props.value.reduce(
                    (sum, date) =>
                      sum + date?.totalHours ? parseFloat(date?.totalHours) : 0,
                    0
                  )}
                </th>
              </tr>
            </table>
          </div>
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
      const apiData2 = await getProjectsData();
      if (apiData2.error) {
        setError(apiData2.error);
      } else {
        console.log("getData", apiData2.data);
        const sortedData = apiData2.data
          .filter((pDataNew) => {
            return pDataNew.isActive;
          })
          .sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        setMainData2(sortedData);
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
  }, [setErrorToast, props.type]);

  function formatDate(date) {
    console.log("date123", date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

    return `${day}-${month}-${year}`;
  }
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

  useEffect(() => {
    getData();
    // getDataCategories();
  }, []);

  console.log("tasks123123", tasks);

  const getDataTimesheet = useCallback(
    async (weekData2) => {
      setLoading(true);
      try {
        const apiData = await getUserTimesheetDetails(
          localStorage.getItem("user_id"),
          weekData2
        );
        if (apiData.error) {
          setError(apiData.error);
        } else {
          console.log("getDataTimesheet", apiData.data);
          setMainData3(apiData.data);
          const timeSheetData = apiData?.data;
          if (timeSheetData && Array.isArray(timeSheetData)) {
            const newTasks = timeSheetData.map((entry) => {
              return {
                week: entry.week,
                projectId: entry.projectId?._id, // Assuming projectId is an object with an _id property
                user_id: localStorage.getItem("user_id"),
                task: entry.task,
                remark: entry.remark?.length > 0 ? entry.remark : "",
                dates: entry.dates?.map((element) => {
                  return {
                    date: element.date, // Ensure this is the desired format, or apply formatting
                    totalHours: element.totalHours,
                    id: element._id, // assuming you meant '_id' here
                  };
                }),
              };
            });

            console.log("New tasks", newTasks);
            setTasks([...tasks, ...newTasks]); // Spreading newTasks into the existing tasks array
          }
        }
      } catch (err) {
        console.log("err", err.name);
        //  if (err.response) {
        //    setError(err.response.data.message);
        //    setErrorToast(err.response.data.message);
        //  } else if (err.name === "AxiosError") {
        //    setError(err.message);
        //    setErrorToast(err.message);
        //  } else {
        //    setError("something went wrong");
        //    setErrorToast("something went wrong");
        //  }
      }
      setLoading(false);
    },
    [selectedWeek]
  );

  const tableInstance = useTable(
    {
      columns: COLUMN,
      data: mainData3,
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
    // const form = e.target;

    // const formData = new FormData(form);
    // for (var i = 0; i < multipleCategory.length; i++) {
    //   formData.append("categories[]", { value: multipleCategory[i].value);
    // // formData.append("categories[]", multipleCategory[i].label);
    // }
    // console.log("formform",form);
    let formJson = {
      week: selectedWeek,
      user_id: localStorage.getItem("user_id"),
      projectId: selectedProject,
      task: selectedTask,
      dates: selectedDates,
      taskData: tasks,
    };
    // formData.append("dates", selectedDates);
    // const formJson = Object.fromEntries(formData.entries());

    addData(formJson);
    setLoading(false);
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await createTimeSheet(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        // getData();
        // handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">Success : TimeSheet Added !</p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        // window.location.reload();
        // navigate("/admin/TimeSheet");
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
  const weekSelected = (week) => {
    console.log("week1", week);
    setSelectedWeek(week);
    // The 'week' value is in the format "YYYY-Www"
    // Extract the year and week number from the input
    const [year, weekNumber] = week.split("-W");
  
    if (year && weekNumber) {
      const startDate = getStartDateOfISOWeek(year, parseInt(weekNumber));
  
      const selectedDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        let formattedDate = {
          dateNew: date,
          date: formatDate(date),
          totalHours: "",
        };
        selectedDates.push(formattedDate);
      }
  
      console.log("hello2", selectedDates);
      setSelectedDates(selectedDates);
    }
  };
  
  const getStartDateOfISOWeek = (year, weekNumber) => {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7); // January 1 + week offset
    const dayOfWeek = simple.getDay();
    const ISOWeekStart = simple;
    if (dayOfWeek <= 4) {
      // Adjust to the nearest Monday
      ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      // Adjust to the following Monday
      ISOWeekStart.setDate(simple.getDate() + (8 - simple.getDay()));
    }
    return ISOWeekStart;
  };
  
  const handleHoursChange = (index, newHours) => {
    const updatedDates = [...selectedDates];
    updatedDates[index].totalHours = newHours;
    setSelectedDates(updatedDates);
  };
  console.log("setSelectedDates", selectedDates);
  const { globalFilter, pageIndex, pageSize } = state;

  const totalHoursPerDay = {};

  tasks?.forEach((entry) => {
    entry.dates.forEach((date) => {
      if (totalHoursPerDay[date.date]) {
        totalHoursPerDay[date.date] += parseFloat(date.totalHours);
      } else {
        totalHoursPerDay[date.date] = parseFloat(date.totalHours);
      }
    });
  });

  // Calculating the total hours for the entire week
  const weekTotalHours = Object.values(totalHoursPerDay).reduce(
    (sum, current) => sum + current,
    0
  );

  console.log("Total Hours per Day:", totalHoursPerDay);
  console.log("Total Hours for the Week:", weekTotalHours);
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Add Time sheet`}
        active="Retailers"
        items={["Tables"]}
      />

      <Row className="row-sm">
        <Col lg={12}>
          <ToastContainer />

          <Card>
            <form
              method="post"
              onSubmit={formsSubmit}
              autocomplete="off"
              encType="multipart/form-data"
            >
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    {mainData3 && (
                      <div className="col-lg-12">
                        {/* <Table
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
                        </Table> */}
                        {/* <Table className="table-bordered text-nowrap border-bottom">
                          <thead>
                            <tr>
                              <th>
                                <table className="table-bordered table-hover table-active table">
                                  <tr></tr>
                                </table>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-center">
                              <td>
                                <table className="table-bordered table-hover table-active table">
                                  <tbody>
                                    <tr>
                                      <td colSpan={1}>TOTAL HOURS</td>
                                      <td></td>
                                      {mainData3[0]?.dates.map(
                                        (dateData, j) => {
                                          const totalHoursForDate =
                                            mainData3.reduce(
                                              (sum, projectData) =>
                                                sum +
                                                parseFloat(
                                                  projectData.dates[j]
                                                    .totalHours
                                                ),
                                              0
                                            );
                                          return (
                                            <td key={j}>{totalHoursForDate}</td>
                                          );
                                        }
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </Table> */}
                      </div>
                    )}

                    <div className="col-lg-10">
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Select Week :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="week"
                          className="form-control"
                          required
                          name="week"
                          onChange={(e) => {
                            setMainData3([]);
                            weekSelected(e.target.value);

                            getDataTimesheet(e.target.value);
                          }}
                          placeholder="Enter  Date"
                        />
                        <input
                          type="hidden"
                          value={localStorage.getItem("user_id")}
                          className="form-control"
                          required
                          name="userId"
                          placeholder="Enter End Date"
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mt-5">
                      <Button
                        className="btn btn-success mt-3"
                        onClick={addTask}
                        disabled={selectedWeek === null}
                      >
                        <i className="fa fa-plus"></i>
                      </Button>
                    </div>
                    <table className="table table-bordered">
                      <tr className="text-bold">
                        <th>Project</th>
                        <th>Task</th>
                        {selectedDates &&
                          selectedDates.map((data, i) => {
                            let parsedDate = new Date(data.dateNew);

                            // Extract the date and month in your preferred format
                            let date = parsedDate
                              .getDate()
                              .toString()
                              .padStart(2, "0");

                            // Get the abbreviated day of the week, e.g., "Mon" for Monday
                            let dayOfWeek = parsedDate.toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                              }
                            );

                            // Combine the date with the abbreviated day of the week
                            let fullDateDisplay = `${date}-${dayOfWeek}`;
                            return <th>{fullDateDisplay}</th>;
                          })}
                        {/* <th>Total</th> */}
                        <th>Remark</th>
                        <th>Action</th>
                      </tr>

                      {/* {console.log(
                        "taskstaskstasksselectedDates",
                        selectedDates,
                        tasks
                      )} */}
                      {tasks?.map((task, index) => (
                        <>
                          {/* <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Select Project :
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-12">
                              <div className="mb-3"></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Select task :
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                        </div> */}
                          {/* <div className="col-lg-11"></div>
                          <div className="col-lg-1  float-right mt-5"></div> */}
                          {selectedDates && selectedDates.length > 0 && (
                            <>
                              {/* <div className="col-lg-12 mt-3">
                              <table className="table table-bordered table-hover"> */}
                              {/* <tr className="text-center">
                                <th>Project</th>
                                <th>Task</th>
                                <th colSpan="7">Dates</th>
                                <th>Action</th>
                              </tr> */}
                              {/* <tr>
                                <td></td>
                                <td></td>
                                {selectedDates &&
                                  selectedDates.map((data, i) => {
                                    let parsedDate = new Date(data.dateNew);

                                    // Extract the date and month in your preferred format
                                    let date = parsedDate
                                      .getDate()
                                      .toString()
                                      .padStart(2, "0");

                                    // Get the abbreviated day of the week, e.g., "Mon" for Monday
                                    let dayOfWeek =
                                      parsedDate.toLocaleDateString("en-US", {
                                        weekday: "short",
                                      });

                                    // Combine the date with the abbreviated day of the week
                                    let fullDateDisplay = `${date}-${dayOfWeek}`;
                                    return <th>{fullDateDisplay}</th>;
                                  })}
                                <td></td>
                              </tr> */}
                              <tr>
                                <td>
                                  <select
                                    required
                                    style={{ width: "180px" }}
                                    name="projectId"
                                    onChange={(e) => {
                                      setSelectedProject(e.target.value);
                                      handleProjectChange(
                                        index,
                                        e.target.value
                                      );
                                    }}
                                    className="form-control"
                                    id=""
                                  >
                                    <option value="">Select Project</option>
                                    {mainData2 &&
                                      mainData2.map((pData, i) => {
                                        return (
                                          <option
                                            selected={
                                              pData?._id === task?.projectId
                                            }
                                            value={pData?._id}
                                          >
                                            {pData?.name}
                                          </option>
                                        );
                                      })}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    name="task"
                                    style={{ width: "180px" }}
                                    onChange={(e) => {
                                      setSelectedTask(e.target.value);
                                      handleTaskChange(index, e.target.value);
                                    }}
                                    required
                                    className="form-control"
                                    id=""
                                  >
                                    <option
                                      selected={"Select Task" === task?.task}
                                      value=""
                                    >
                                      Select Task
                                    </option>
                                    <option
                                      selected={"Design" === task?.task}
                                      value="Design"
                                    >
                                      Design
                                    </option>
                                    <option
                                      selected={
                                        " Draw - Shop Drawings" === task?.task
                                      }
                                      value=" Draw - Shop Drawings"
                                    >
                                      {" "}
                                      Draw - Shop Drawings
                                    </option>
                                    <option
                                      selected={
                                        "Draw - Piece Tickets" === task?.task
                                      }
                                      value="Draw - Piece Tickets"
                                    >
                                      Draw - Piece Tickets
                                    </option>
                                    <option
                                      selected={
                                        "Check - Shop Drawings" === task?.task
                                      }
                                      value="Check - Shop Drawings"
                                    >
                                      Check - Shop Drawings
                                    </option>
                                    <option
                                      selected={
                                        " Check - Piece Tickets" === task?.task
                                      }
                                      value=" Check - Piece Tickets"
                                    >
                                      {" "}
                                      Check - Piece Tickets
                                    </option>
                                    <option
                                      selected={
                                        "Modify - Shop Drawings" === task?.task
                                      }
                                      value="Modify - Shop Drawings"
                                    >
                                      Modify - Shop Drawings
                                    </option>
                                    <option
                                      selected={
                                        "Modify - Piece Tickets" === task?.task
                                      }
                                      value="Modify - Piece Tickets"
                                    >
                                      Modify - Piece Tickets
                                    </option>
                                    <option
                                      selected={"f3D Modelling" === task?.task}
                                      value="3D Modelling"
                                    >
                                      3D Modelling
                                    </option>
                                    <option value="Leave">Leave</option>
                                  </select>
                                </td>

                                {selectedDates &&
                                  selectedDates.map((data, i) => {
                                    console.log("selectedDates", selectedDates);
                                    let date = formatDate(data.dateNew);

                                    let matchingEntry = task?.dates?.find(
                                      (d) => {
                                        return d?.date == date;
                                      }
                                    );
                                    let hours = matchingEntry
                                      ? matchingEntry?.totalHours
                                      : 0;
                                    return (
                                      <th>
                                        {}

                                        <input
                                          type="number"
                                          step="any"
                                          className="form-control"
                                          required
                                          defaultValue={hours}
                                          onChange={(e) => {
                                            const newHours = parseFloat(
                                              e.target.value || "0"
                                            );

                                            handleHoursChange(i, newHours);
                                            handleDateChange(
                                              index,
                                              i,
                                              date,
                                              newHours
                                            );
                                          }}
                                          placeholder="Total Hours"
                                        />
                                      </th>
                                    );
                                  })}
                                <th>
                                  <input
                                    style={{ width: "100px" }}
                                    type="text"
                                    onChange={(e) => {
                                      setSelectedRemark(e.target.value);
                                      handleRemarkChange(index, e.target.value);
                                    }}
                                    defaultValue={task?.remark}
                                    className="form-control"
                                    name="remark"
                                  />
                                </th>
                                <th>
                                  <Button
                                    className="btn btn-danger mx-auto d-block mt-3"
                                    onClick={() => deleteTask(index)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </Button>
                                </th>
                              </tr>
                              {/* </table>
                            </div> */}
                            </>
                          )}
                        </>
                      ))}
                      <tfoot>
                        <tr>
                          <td>Total</td>
                          <td></td>
                          {Object.entries(totalHoursPerDay).map(
                            ([date, hours]) => {
                              // Check if hours is NaN and assign 0 if true
                              const displayHours = isNaN(hours) ? 0 : hours;
                              return (
                                <>
                                  <td>{displayHours}</td>
                                </>
                              );
                            }
                          )}
                        </tr>
                        <tr>
                          <th colSpan={8}>Total</th>
                          <th>
                            {" "}
                            {Object.entries(totalHoursPerDay).reduce(
                              (accumulator, [date, hours]) =>
                                accumulator + hours,
                              0
                            )}
                          </th>
                        </tr>
                      </tfoot>
                    </table>

                    {/* <table className="table"></table> */}
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
                    <Button
                      variant="info"
                      type="submit"
                      disabled={tasks?.length === 0}
                    >
                      Add Time Sheet
                    </Button>
                  </>
                )}
                {/* <Button
                  variant="danger"
                  onClick={() => {
                    navigate("/admin/TimeSheet");
                  }}
                >
                  Close
                </Button> */}
              </Modal.Footer>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddTimeSheet;
