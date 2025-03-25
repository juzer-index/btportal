import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  getProjectsData,
  generateMultiProjectWeeklyReport,
} from "../../utils/api";
import styles from "./DataTable.module.scss";
import ExcelExport from "./ExcelExport";

const MultiProjectReport = () => {
  const [week, setWeek] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const fetchProjects = async () => {
    const apiData = await getProjectsData();
    if (apiData.error) {
      console.error(apiData.error);
    } else {
      const activeProjects = apiData.data.filter((project) => project.isActive);
      setProjects(activeProjects);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (week) {
      const [year, weekNumber] = week.split("-W");
      const startDate = new Date(year, 0, (weekNumber - 1) * 7);
      const datesArray = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getFullYear()
        ).slice(-2)}`;
        datesArray.push(formattedDate);
      }
      setSelectedDates(datesArray);
    }
  }, [week]);

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((p) => p._id));
    }
  };

  const handleProjectToggle = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { week, projectIds: selectedProjects };
      const reportData = await generateMultiProjectWeeklyReport(body);
      console.log("mainDatamainDatamainData",mainData);
      setMainData(reportData?.data);
      toast.success("Success: Report Generated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error: Failed to generate report", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); // Filtered projects based on search query

  const tableRef = useRef(null);

  return (
    <div className={styles.DataTable}>
      <ToastContainer />
      <Row>
        <Col lg={12}>
          <Card>
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <div className="row w-100">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>Select Week</label>
                      <input
                        type="week"
                        className="form-control"
                        onChange={(e) => setWeek(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>Select Projects</label>
                      <div className="mb-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleSelectAll}
                        >
                          {selectedProjects.length === projects.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div
                        className="project-list"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
                            <div key={project._id} className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedProjects.includes(project._id)}
                                onChange={() =>
                                  handleProjectToggle(project._id)
                                }
                              />
                              <label className="form-check-label">
                                {project.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p>No projects found</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 mt-4">
                    <div className="form-group">
                      <button type="submit" className="btn btn-info mt-2">
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm ms-2"
                            role="status"
                            aria-hidden="true"
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

            {mainData.length > 0 && (
              <Modal.Body>
                <div className="container">
                  <div className="col-lg-2 mt-1 mb-4">
                    <ExcelExport tableRef={tableRef} name="TimeSheet Report" />
                  </div>
                </div>
                <div className="container">
                  <table ref={tableRef} className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Staff Name</th>
                        <th>Total Hours</th>
                        {selectedDates.map((date, index) => (
                          <th key={index}>{date}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mainData.map((project, projectIndex) => (
                        <tr key={projectIndex}>
                          <td>{project.projectName}</td>
                          <td>{project.username}</td>
                          <td>{project.totalHours}</td>
                          {selectedDates.map((date, dateIndex) => (
                            <td key={dateIndex}>
                              {/* Find the day entry for the current date */}
                              {project.days.find((day) => day.date === date)
                                ?.totalHours || 0}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Modal.Body>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MultiProjectReport;
