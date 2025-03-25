import React, { useState, useEffect } from "react";
import { Card, Col, Row, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { getProjectsData, generateReportByDateRange } from "../../utils/api";
import styles from "./DataTable.module.scss";
import ExcelExport from "./ExcelExport";

const DateRangeReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      const body = { startDate, endDate, projectIds: selectedProjects };
      const reportData = await generateReportByDateRange(body);
      setMainData(reportData?.data || []);
      toast.success("Report Generated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report", {
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
  );

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
                      <label>Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        onChange={(e) => setEndDate(e.target.value)}
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
                </div>
              </Modal.Header>

              <Modal.Footer>
                <button type="submit" className="btn btn-info">
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
              </Modal.Footer>
            </form>

            {mainData.length > 0 && (
              <Modal.Body>
                <div className="container">
                  <div className="col-lg-2 mt-1 mb-4">
                    {/* <ExcelExport tableRef={null} name="TimeSheet Report" /> */}
                  </div>
                </div>
                <div className="container">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Total Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mainData.map((project, index) => (
                        <tr key={index}>
                          <td>{project.projectName}</td>
                          <td>{project.totalHours}</td>
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

export default DateRangeReport;
