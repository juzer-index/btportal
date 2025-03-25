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
  addDealerData,
  getDealerByState,
  getDealers,
  getDealersByStatus,
} from "../../utils/api";
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

const DealersByState = (props) => {
  const status = props.isactive;
  const apiStatus = status === true ? "true" : "false";
  const [InputShow, setInputShow] = useState(false);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [stateName, setStateName] = useState("");
  const [mainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(false);
  let user_type = localStorage.getItem("user_type_jsw");

  let showActions = user_type === "L1" ? false : true;

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
      console.log("stateName", stateName);
      const apiData = await getDealerByState(stateName);
      console.log("getData", apiData);
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
  }, [stateName]);

  //   useEffect(() => {
  //     getData();
  //   }, [status]);

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
              <form className="login100-form validate-form">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="form-group">
                        <label htmlFor="">
                          Enter State Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Form.Control
                          className="input100  form-control ms-0"
                          type="text"
                          placeholder="Enter State Name"
                          value={stateName}
                          onChange={(e) => {
                            setStateName(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <Button
                          disabled={stateName.length > 0 ? false : true}
                          onClick={() => {
                            getData();
                          }}
                          className="login100-form-btn btn-primary mt-4"
                        >
                          {loading ? (
                            <span
                              role="status"
                              aria-hidden="true"
                              className="spinner-border spinner-border-sm ms-2"
                            ></span>
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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

export default DealersByState;
