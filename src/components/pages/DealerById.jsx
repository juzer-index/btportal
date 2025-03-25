import React, { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Tab,
  Row,
  Col,
  Nav,
  Card,
  Form,
  Collapse,
} from "react-bootstrap";
import PageHeader from "../../Layouts/PageHeader/PageHeader";
import { geDealerById } from "../../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const DealerById = () => {
  let { id } = useParams();
  // let history = use  History();

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    let main_id = localStorage.getItem("user_id");
    if (main_id) {
      try {
        const data = await geDealerById(id);
        if (data.data) {
          console.log(data.data, "main");
          setMainData(data.data);
        } else {
          setError("Something Went Wrong !! ");
        }
      } catch (err) {
        console.log("err12123", err);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      }
    } else {
      setErrorToast("ID Not Found !!!");
    }
  }, []);

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

  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <>
      <div>
        <PageHeader
          titles="Retailer Details"
          active="Dealers"
          items={["Tables"]}
        />
        <ToastContainer />

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header></Card.Header>
              <Card.Body>
                <div className="panel panel-info">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="firstC"
                  >
                    <Nav
                      variant="pills"
                      className="panel-tabs nav-tabs panel-info"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="firstC">
                          <i className="fe fe-user me-1"></i>Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="secondC">
                          <i className="fe fe-calendar me-1"></i>Images
                        </Nav.Link>
                      </Nav.Item>
                      {/* <Nav.Item>
                        <Nav.Link eventKey="thirdC">
                          <i className="fe fe-settings me-1"></i>Tab 3
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fourthC">
                          <i className="fe fe-bell me-1"></i>Tab 4
                        </Nav.Link>
                      </Nav.Item> */}
                    </Nav>

                    <Tab.Content>
                      <Tab.Pane eventKey="firstC">
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="exampleInputname">Firm Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputname"
                              value={mainData.firm_name}
                              readOnly
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="exampleInputname1">
                              Contact Person Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputname1"
                              value={mainData.contact_person_name}
                              readOnly
                            />
                          </div>

                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputnumber">
                                  Contact Number
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputnumber"
                                  value={mainData.mobile}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputEmail1">
                                  Is Active?
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="exampleInputEmail1"
                                  value={
                                    mainData.isActive == true ? "Yes" : "No"
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="secondC">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Image</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainData &&
                              mainData.images &&
                              mainData.images.map((data, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>
                                      <a href={data} download={true}>
                                        <img
                                          src={data}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                          }}
                                          alt=""
                                        />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="thirdC">
                        <p>
                          over the years, sometimes by accident, sometimes on
                          purpose (injected humour and the like
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua. At vero eos et
                        </p>
                      </Tab.Pane>
                      <Tab.Pane eventKey="fourthC">
                        <p>
                          page editors now use Lorem Ipsum as their default
                          model text, and a search for 'lorem ipsum' will
                          uncover many web sites still in their infancy. Various
                          versions have evolved over the years, sometimes by
                          accident, sometimes on purpose (injected humour and
                          the like
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua. At vero eos et
                        </p>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
