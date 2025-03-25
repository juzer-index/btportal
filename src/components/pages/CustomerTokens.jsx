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
  getCustomerPurchases,
  getCustomerTokens,
  getCustomers,
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
  Form,
  Collapse,
  Table,
} from "react-bootstrap";
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

    Cell: (props) => <span>{props.cell.row.index + 1}</span>,
  },
  headersColumn("Token No", "tokenNo"),
  //   headersColumn("Quantity", "quantity"),
  //   headersColumn("Dealer", "dealerId"),
  //   {
  //     Header: "Invoice",
  //     accessor: "invoice",
  //     className: "text-center wd-15p border-bottom-0",

  //     Cell: (props) =>  <a href={props.value} download={true}>
  //     <img src={props.value} style={{width:"100px",height:"100px"}} alt="" />
  //     </a>,
  //   },
  //   {
  //     Header: "Verified",
  //     accessor: "isVerified",
  //     className: "text-center wd-15p border-bottom-0",
  //     id: 'anuj',

  //     Cell: (props) =>  <span>{props.value ? "Yes" : "No"}</span>,
  //   },
];

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

const CustomerTokens = () => {
  let { id } = useParams();

  const [InputShow, setInputShow] = useState(false);

  const handleClose3 = () => setInputShow(false);
  const handleShow3 = () => setInputShow(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [loading, setLoading] = useState(false);

  //   const getData = async () => {

  //   };

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await getCustomerTokens(id);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData", apiData);
        setMainData(apiData.data);
        setTotalCoupons(apiData.data.length);
        console.log(`totalCoupons: ${totalCoupons}`);
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
  }, []);

  const setErrorToast = (errorFromBackend) => {
    toast.error(
      <p className="text-white tx-16 mb-0" style={{ zIndex: 200000 }}>
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

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={
          totalCoupons > 0
            ? "You have " + totalCoupons + " lucky draw coupons"
            : "Your lucky draw coupons"
        }
        active="Customers"
        items={["Tables"]}
      />
      <ToastContainer />

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card>
              <div className="container">
                <div className="row">
                  {mainData &&
                    mainData.length > 0 &&
                    mainData.map((data, i) => {
                      return (
                        <div className="col-lg-6">
                          <div
                            onClick={() => {
                              // navigate(`/customer_tokens/${mainData._id}`);
                            }}
                            className="my-5 card bg-green img-card box-red-shadow"
                            style={{ cursor: "pointer" }}
                          >
                            {/* <Button onClick={handleShow3}> */}
                            <div className="card-body p-3">
                              <div className="d-flex">
                                <div className="text-white">
                                  <p className="text-white mb-0">
                                    Coupon Number
                                  </p>
                                  <h4 className="mb-0 number-font">
                                    {data.tokenNo}
                                  </h4>
                                </div>
                                <div className="ms-auto">
                                  <i className="fa fa-ticket text-white fs-30 me-2 mt-2" />
                                </div>
                              </div>
                              <small>
                                {/* <a href={data?.invoice} className="text-white" style={{fontSize:"15px"}}>
                          <i className="fa fa-download  fs-15 me-2 mt-2" />
                            Invoice
                          </a> */}
                              </small>
                            </div>
                            {/* </Button> */}
                          </div>
                        </div>
                      );
                    })}

                  {mainData.length === 0 && (
                    <div className="text-center mt-4">
                      Your contest coupons would be visible here upon
                      verification
                    </div>
                  )}
                </div>
              </div>

              {/* <Card.Body>
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
            </Card.Body> */}
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerTokens;
