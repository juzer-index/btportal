import React, { useState, useCallback, useMemo, useEffec, useRef } from "react";
import styles from "./DataTable.module.scss";

import PageHeader from "../../Layouts/PageHeader/PageHeader";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { generateTimeSheetReport } from "../../utils/api";
import ExcelExport from "./ExcelExport";
import { Link } from "react-router-dom";

const ReportsTimeSheet = () => {
  const [weeek, setWeek] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const getStartDateOfISOWeek = (year, weekNumber) => {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7); // January 1 + offset for weeks
    const dayOfWeek = simple.getDay();
    const ISOWeekStart = simple;
  
    if (dayOfWeek <= 4) {
      // Adjust to nearest Monday if day is Tuesday, Wednesday, or Thursday
      ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      // Adjust to following Monday if day is Friday, Saturday, or Sunday
      ISOWeekStart.setDate(simple.getDate() + (8 - simple.getDay()));
    }
  
    return ISOWeekStart;
  };
  

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
      const apiData = await generateTimeSheetReport(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        // getData();
        // handleClose3();
        // dispatch(fetchProjects());
        const setMainData2 = (apiData) => {
          if (apiData && Array.isArray(apiData)) {
            // Sort the data by username in ascending order
            apiData.sort((a, b) => a.username.localeCompare(b.username));

            // Sort the dates inside each week's dates array by date in ascending order
            apiData.forEach((user) => {
              user.weeks.forEach((week) => {
                week.dates.sort((a, b) => {
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
          // Now apiData is sorted, you can set it wherever it needs to be used
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
                    <dib className="form-group">
                      <label htmlFor="">
                        Select Week {weeek}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setWeek(e.target.value);
                          const [year, weekNumber] = e.target.value.split("-W");
                        
                          if (year && weekNumber) {
                            const startDate = getStartDateOfISOWeek(parseInt(year), parseInt(weekNumber));
                        
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
                        
                            console.log("Selected Dates", selectedDates);
                            setSelectedDates(selectedDates);
                          }
                        }}
                        
                        name="week"
                        type="week"
                        className="form-control"
                        required
                        id=""
                      />
                    </dib>
                  </div>
                  {/* <div className="col-lg-4">
                    <dib className="form-group">
                      <label htmlFor="">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        required
                        id=""
                      />
                    </dib>
                  </div> */}
                  <div className="col-lg-4 mt-4">
                    <dib className="form-group">
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
                    </dib>
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
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainData?.map((tData, i) => {
                      const remarks = tData?.remarks || "";

                      const uniqueRemarks = Array.from(
                        new Set(remarks.split(" "))
                      ).join(" ");

                      const newDatesSorted = tData?.weeks[0]?.dates.sort(
                        (a, b) => {
                          const [dayA, monthA, yearA] = a.date
                            .split("-")
                            .map(Number);
                          const [dayB, monthB, yearB] = b.date
                            .split("-")
                            .map(Number);
                          return (
                            new Date(yearA + 2000, monthA - 1, dayA) -
                            new Date(yearB + 2000, monthB - 1, dayB)
                          );
                        }
                      );

                      console.log("newDatesSorted", newDatesSorted);
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            <Link
                              target="_blank"
                              to={`/admin/TimeSheetDetails/${tData?.userId}/${weeek}`}
                            >
                              {tData?.username}
                            </Link>
                          </td>
                          <td>{tData?.totalHours}</td>
                          {tData?.weeks[0]?.dates.map((date, i) => {
                            return <td>{date?.totalHours}</td>;
                          })}

                          <td>{uniqueRemarks}</td>
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
