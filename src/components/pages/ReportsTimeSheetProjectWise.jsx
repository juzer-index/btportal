import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import styles from "./DataTable.module.scss";

import PageHeader from "../../Layouts/PageHeader/PageHeader";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  generateProjectWeeklyReport,
  getProjectsData,
} from "../../utils/api";
import ExcelExport from "./ExcelExport";
import { Link } from "react-router-dom";

const ReportsTimeSheet = () => {
  const [weeek, setWeek] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(null);

  const fetchData = async () => {
    const apiData2 = await getProjectsData();
    if (apiData2.error) {
      // setError(apiData2.error);
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
      setProjects(sortedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableRef = useRef(null);
  function formatDate(date) {
    console.log("date123", date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

    return `${day}-${month}-${year}`;
  }
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

 
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

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
  
    try {
      const apiData = await generateProjectWeeklyReport(body);
  
      if (apiData) {
        const setMainData2 = (apiData) => {
          if (apiData && Array.isArray(apiData)) {
            // Sort the data by username in ascending order
            apiData?.sort((a, b) => a.username.localeCompare(b.username));
  
            // Sort the dates inside each week's dates array by date in ascending order
            apiData?.forEach((user) => {
              user?.weeks?.forEach((week) => {
                week?.dates?.sort((a, b) => {
                  const [dayA, monthA, yearA] = a.date.split("-").map(Number);
                  const [dayB, monthB, yearB] = b.date.split("-").map(Number);
                  return (
                    new Date(yearA + 2000, monthA - 1, dayA) -
                    new Date(yearB + 2000, monthB - 1, dayB)
                  );
                });
              });
            });
          }
          return apiData;
        };
  
        setMainData(setMainData2(apiData?.data));
  
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Report Generated Successfully
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("404 error: API endpoint not found, ignoring.");
      } else {
        setError("An error occurred. Please try again.");
        toast.error(
          <p className="text-white tx-16 mb-0">
            Error : Failed to generate report
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
      }
    } finally {
      // Always stop loading after the try/catch block
      setLoading(false);
    }
  };
  

  const selectedProjectName = projects?.filter((pData, i) => {
    return pData?._id === selectedProject;
  });
  console.log("selectedProjectName", selectedProjectName);
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Time sheet Report`}
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
              <Modal.Header>
                <div className="row" style={{ width: "100%" }}>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="">
                        Select Week {weeek}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setWeek(e.target.value);
                          const [year, weekNumber] = e.target.value.split("-W");

                          if (year && weekNumber) {
                            const startDate = new Date(year, 0); // January is month 0
                            startDate.setDate(
                              1 + (parseInt(weekNumber) - 1) * 7
                            ); // Calculate the start date based on the week number

                            const selectedDates = [];
                            for (let i = 0; i < 7; i++) {
                              const date = new Date(startDate);
                              date.setDate(startDate.getDate() + i);
                              let abc = {
                                dateNew: date,
                                date: formatDate(date),
                                totalHours: "",
                              };
                              selectedDates.push(abc);
                            }

                            console.log("hello2", selectedDates);
                            setSelectedDates(selectedDates);
                          }
                        }}
                        name="week"
                        type="week"
                        className="form-control"
                        required
                        id=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="">Select Project</label>
                      <select
                        name="projectId"
                        required
                        style={{ width: "180px" }}
                        onChange={(e) => {
                          setSelectedProject(e.target.value);
                        }}
                        className="form-control"
                        id=""
                      >
                        <option value="">Select Project</option>
                        {projects?.length > 0 &&
                          projects.map((pData, i) => {
                            return (
                              <option value={pData?._id}>{pData?.name}</option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                 
                  <div className="col-lg-4 mt-4">
                    <div className="form-group">
                      <button type="submit" className="btn btn-info mt-2">
                        {loading ? (
                          <span
                            role="status"
                            aria-hidden="true"
                            className="spinner-border spinner-border-sm ms-2"
                          ></span>
                        ) : (
                          "Generate Report"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Header>
            </form>
            <Modal.Body>
              {mainData?.length > 0 && (
                <div className="container">
                  <div className="col-lg-2 mt-1 mb-4">
                    <ExcelExport tableRef={tableRef} name="TimeSheet Report " />
                  </div>
                </div>
              )}
              <div className="container">
                <table ref={tableRef} className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th colSpan={9} className="text-center">
                        {selectedProjectName && selectedProjectName[0]?.name}
                      </th>
                    </tr>
                  </thead>
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Name</th>
                      <th>Total Hours</th>
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
                      {/* <th>Remarks</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {mainData?.map((tData, i) => {
                      const remarks = tData?.remarks || "";
                      console.log("tDatatDatatData", tData?.username);
                      const uniqueRemarks = Array.from(
                        new Set(remarks.split(" "))
                      ).join(" ");

                   
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            <Link
                              target="_blank"
                              to={`/admin/TimeSheetDetails/${tData?.userId}/${weeek}`}
                            >
                              {tData && tData?.username}
                            </Link>
                          </td>
                          <td>{tData && tData?.totalHours}</td>
                          {tData &&
                            tData?.days?.map((date, i) => {
                              return <td>{date?.totalHours}</td>;
                            })}

                          {/* <td>{uniqueRemarks}</td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsTimeSheet;
