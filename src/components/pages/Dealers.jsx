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
import { addDealerData, getDealers, getDealersByStatus } from "../../utils/api";
import { Outlet, Link } from "react-router-dom";

import { Button, Card, Col, Modal, Row, Form, Table } from "react-bootstrap";
const headersColumn = (name, value2) => {
  return {
    Header: name.toUpperCase(),
    accessor: value2 ? value2 : "no",
    className: "text-center wd-15p border-bottom-0",
  };
};
const COLUMN = [
  {
    Header: "No",
    accessor: "_id",
    className: "text-center wd-15p border-bottom-0",
    isSorted: "true",

    Cell: (props) => <span>{props.cell.row.index + 1}</span>,
  },
  {
    Header: "Code",
    accessor: "code",
    className: "text-center wd-15p border-bottom-0",
    id: "details2",

    Cell: (props) => (
      <Link
        to={`/admin_dealer_by_id/${props.cell.row.original._id}`}
        // className="btn btn-primary"
      >
        {props.value}
      </Link>
    ),
  },
  {
    Header: "Active",
    accessor: "isActive",
    className: "text-center wd-15p border-bottom-0",
    sortType: compareNumericString, // custom function

    Cell: (props) => (
      <span
        className={
          props.value
            ? "badge bg-success w-100 p-2 text-white rounded-pill"
            : "badge bg-warning w-100 p-2 text-white rounded-pill"
        }
      >
        {props.value ? "Active" : "Pending"}
      </span>
    ),
  },
  headersColumn("Firm Name", "firm_name"),
  headersColumn("Contact Person Name", "contact_person_name"),
  headersColumn("Mobile", "mobile"),
  headersColumn("State", "state"),
  headersColumn("Product Type", "productType"),

  // {
  //   Header: "Details",
  //   accessor: "_id",
  //   className: "text-center wd-15p border-bottom-0",
  //   id: "details",

  //   Cell: (props) => (
  //     <Link
  //       to={`/admin_dealer_by_id/${props.value}`}
  //       className="btn btn-primary"
  //     >
  //       <i class="fe fe-list"></i>
  //     </Link>
  //   ),
  // },
];
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

const Dealers = (props) => {
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
  let user_type = localStorage.getItem("user_type_jsw");

  let showActions = user_type === "L1" ? false : true;
  console.log("showActionsdealers", showActions);
  //   const getData = async () => {

  //   };
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
      const apiData = await getDealersByStatus(apiStatus);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData123", apiData);
        setMainData(apiData.data);
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
  }, [apiStatus]);

  // useEffect(() => {
  //   getData();
  // }, [status]);

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
    const formJson = Object.fromEntries(formData.entries());
    addData(formJson);
    setLoading(false);
    getData();
  };

  const addData = async (body) => {
    setError("");
    setSuccessMessage("");

    setLoading(true);

    try {
      const apiData = await addDealerData(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        handleClose3();
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Dealer Added Successfully !
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
  useEffect(() => {
    getData();
  }, [status, apiStatus]);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Retailers ${status === true ? "Active" : "Pending"}`}
        active="Retailers"
        items={["Tables"]}
      />

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
                      disabled={showActions === true ? false : true}
                    >
                      Add Retailer
                    </Button>
                    <ToastContainer />

                    <Modal size="xl" show={InputShow} onHide={handleClose3}>
                      <Modal.Header>
                        <Modal.Title>Add Retailer</Modal.Title>
                        <span className="d-flex ms-auto" onClick={handleClose3}>
                          <i className="fe fe-x ms-auto"></i>
                        </span>
                      </Modal.Header>
                      <form
                        method="post"
                        onSubmit={formsSubmit}
                        autocomplete="off"
                      >
                        <Modal.Body>
                          <div className="container">
                            <div className="row">
                              <div className="col-lg-6">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Firm Name :
                                  </label>
                                  <input
                                    type="text"
                                    name="firm_name"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Firm Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Address :
                                  </label>
                                  <textarea
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Address"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Taluka :
                                  </label>
                                  <input
                                    type="text"
                                    name="taluka"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Taluka"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    District :
                                  </label>
                                  <input
                                    type="text"
                                    name="district"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter District"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="recipient-name"
                                    className="col-form-label"
                                  >
                                    Town :
                                  </label>
                                  <input
                                    type="text"
                                    name="town"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter town"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    State:
                                  </label>
                                  <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter State"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Zone:
                                  </label>
                                  <input
                                    type="text"
                                    name="zone"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Zone"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Mobile:
                                  </label>
                                  <input
                                    type="number"
                                    name="mobile"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Mobile"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Email:
                                  </label>
                                  <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter email"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Pincode:
                                  </label>
                                  <input
                                    type="number"
                                    name="pincode"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter pincode"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Contact Person Name:
                                  </label>
                                  <input
                                    type="text"
                                    name="contact_person_name"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Contact Person Name"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Password
                                  </label>
                                  <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Password"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                {" "}
                                <div className="mb-3">
                                  <label
                                    htmlFor="message-text"
                                    className="col-form-label"
                                  >
                                    Code :
                                  </label>
                                  <input
                                    type="text"
                                    name="code"
                                    className="form-control"
                                    id="recipient-name"
                                    required
                                    placeholder="Enter Code"
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
    </div>
  );
};

export default Dealers;
