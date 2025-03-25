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
import "./AddProject.css";
import {
  addCustomer,
  addProjects,
  addTrips,
  getAllCategories,
  getTripsWithTitle,
} from "../../utils/api";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCities,
  addCity,
  updateCity,
  addSliderImagesURL,
  getSliderImages,
  getSections,
  addSection,
  updateSection,
  getUsers,
  addUser,
  getCustomers,
  getProjectsData,
  updateProject,
  createProject,
  getTemplates,
} from "../../utils/api";
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

const TableRow = ({ item, onChange }) => {
  return (
    <tr>
      <td>{item.label}</td>
      <td>
        <input
          type="radio"
          name={item.label}
          value="Yes"
          //   className="form-control"
          checked={item.included === "Yes"}
          onChange={(e) => onChange(e, item.label)}
        />
      </td>
      <td>
        <input
          type="radio"
          name={item.label}
          value="No"
          //   className="form-control"
          checked={item.included === "No"}
          onChange={(e) => onChange(e, item.label)}
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Comments"
          value={item.comments}
          onChange={(e) => onChange(e, item.label, true)}
        />
      </td>
    </tr>
  );
};

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
const storedProducts = JSON.parse(localStorage.getItem("taxes") || "[]");

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
const AddProject = (props) => {
  const TableRowAlls = ({ item, onChange, itemKey }) => {
    return (
      <tr>
        <td style={{ width: "150px" }}>
          <input
            type="text"
            style={{ width: "150px" }}
            className="form-control"
            placeholder={"Str. Walls"}
            name=""
            defaultValue={item.label}
            id=""
          />
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              style={{ width: "90px" }}
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              style={{ width: "70px" }}
              type="text"
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              style={{ width: "90px" }}
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              style={{ width: "90px" }}
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              style={{ width: "90px" }}
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              style={{ width: "90px" }}
              className="form-control"
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              className="form-control"
              style={{ width: "90px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              className="form-control"
              style={{ width: "90px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              className="form-control"
              style={{ width: "90px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>
        <td colSpan={2}>
          <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <input
              type="text"
              className="form-control"
              style={{ width: "90px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "70px" }}
              placeholder={"Str. Walls"}
              name=""
              defaultValue={"-"}
              id=""
            />
          </div>
        </td>

        <tr>
          <td>
            <Button
              className="btn btn-danger mt-3"
              onClick={() => handleRemoveRow(itemKey)}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </td>
        </tr>
      </tr>
    );
  };

  const navigate = useNavigate();
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  const [largeShow, setlargeShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [tableData, setTableData] = useState({
    Hollowcore: { included: "Yes", comments: "" },
    "Slabs-Cast-in Plates": { included: "Yes", comments: "" },
    "Slabs-Solid Slabs": { included: "Yes", comments: "" },
    "Slabs-Balconiess": { included: "Yes", comments: "" },
    "Slabs-Core Drilling": { included: "Yes", comments: "" },
    "Slabs-Welding": { included: "Yes", comments: "" },
    "Steel Hangers": { included: "Yes", comments: "" },
    "Weep Holes": { included: "Yes", comments: "" },
    "Patching & Caulking": { included: "Yes", comments: "" },
    Underlayment: { included: "Yes", comments: "" },
    "Stairs:": { included: "Yes", comments: "" },
    "Landings:": { included: "Yes", comments: "" },
    "Hoisting:": { included: "Yes", comments: "" },
    "Structural Precast Walls:": { included: "Yes", comments: "" },
    "Structural Precast Walls:": { included: "Yes", comments: "" },
    "Columns:": { included: "Yes", comments: "" },
    "Beams:": { included: "Yes", comments: "" },
    "Patching & Caulking Walls": { included: "Yes", comments: "" },
    "Staining Walls:": { included: "Yes", comments: "" },
  });
  const [tableDataWalls, setTableDataWalls] = useState({
    "Ground Floor": { included: "Yes", comments: "" },
    "2nd Floor": { included: "Yes", comments: "" },
    MPH: { included: "Yes", comments: "" },
  });

  const handleInputChange = (event, itemName, isComment) => {
    const { name, value } = event.target;

    // Determine the index of the item being changed
    const itemIndex = Object.keys(tableData).indexOf(itemName);

    // Check if the index is within the first 10 items and the change is not on comments
    if (itemIndex < 10 && !isComment) {
      const newData = {};
      Object.keys(tableData).forEach((key, index) => {
        if (index < 10) {
          newData[key] = { ...tableData[key], included: value };
        } else {
          newData[key] = { ...tableData[key] };
        }
      });
      setTableData(newData);
    } else {
      setTableData((prevData) => ({
        ...prevData,
        [itemName]: {
          ...prevData[itemName],
          ...(isComment ? { comments: value } : { included: value }),
        },
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(tableData);
    // Submit to backend or process data here
  };
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
  const [templateData, setTemplateData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [about, setAbout] = useState("");
  const [inclusion_exclusion, setinclusion_exclusion] = useState("abc");
  const [thingsToCarry, setThingsToCarry] = useState("");
  const [terms_conditions, setTerms_conditions] = useState("");
  const [cancellation_policy, setcancellation_policy] = useState("");
  const [rent_purchase_gears, setRent_purchase_gears] = useState("");
  const [how_to_reach, sethow_to_reach] = useState("");
  const [category, setCategory] = useState([]);
  const [multipleCategory, setMultipleCategory] = useState([]);

  //   const [selectedImage1, setSelectedImage1] = useState(null);
  //   const [selectedImage1Update, setSelectedImage1Update] = useState(null);
  //   const [largeShow, setlargeShow] = useState(false);

  //   const largemodalClose = () => setlargeShow(false);
  //   const largemodalShow = () => setlargeShow(true);
  //   const status = props.isactive;
  //   const apiStatus = status === true ? "true" : "false";
  //   const [stateName, setStateName] = useState("");
  //   const [InputShow, setInputShow] = useState(false);
  //   const [successMessage, setSuccessMessage] = useState("");
  //   const [error, setError] = useState("");
  //   const handleClose3 = () => setInputShow(false);
  //   const handleShow3 = () => setInputShow(true);
  //   const [mainData, setMainData] = useState([]);
  const [categoriesData, setMainDataCategories] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [modalData, setModalData] = useState([]);

  const handleInputChange2 = (event, floor, isComment) => {
    const { value } = event.target;
    setTableDataWalls((prevData) => ({
      ...prevData,
      [floor]: {
        ...prevData[floor],
        ...(isComment ? { comments: value } : { included: value }),
      },
    }));
  };

  const handleAddRow = () => {
    const newFloor = String(tableDataWalls?.length);
    if (newFloor) {
      setTableDataWalls((prevData) => ({
        ...prevData,
        [newFloor]: { included: "Yes", comments: "" },
      }));
    }
  };

  const handleRemoveRow = (floor) => {
    setTableDataWalls((prevData) => {
      const newData = { ...prevData };
      delete newData[floor];
      return newData;
    });
  };
  const COLUMN = useMemo(
    () => [
      {
        accessor: "_id",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>{props.cell.row.index + 1}</span>
          </div>
        ),
        Header: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>No</span>
          </div>
        ),
      },
      headersColumn("Title", "title"),
      headersColumn("Sub Title", "sub_title"),
      {
        accessor: "isActive",
        className: "text-center wd-15p border-bottom-0",
        isSorted: "true",

        Cell: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>
              {props.value ? (
                <StatusButton bg="success" />
              ) : (
                <StatusButton bg="danger" />
              )}
            </span>
          </div>
        ),

        Header: (props) => (
          <div style={{ textAlign: "left" }}>
            <span>Active</span>
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "invoice",
        className: "text-center wd-5dp border-bottom-0",

        // className: "text-center wd-15p border-bottom-0",

        Cell: (props) => (
          <>
            <div>
              <Button
                onClick={() => {
                  navigate(`/admin/trips/${props.cell.row.original._id}`);
                }}
              >
                <i class="fe fe-list"></i>
              </Button>
            </div>
          </>
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
    try {
      const apiData = await getProjectsData();
      if (apiData.error) {
        setError(apiData.error);
      } else {
        console.log("getData", apiData.data);
        setMainData(apiData.data);
      }
      const apiData2 = await getCustomers();
      if (apiData2.error) {
        setError(apiData2.error);
      } else {
        console.log("getCustomers", apiData2.data);

        const data = [];
        apiData2.data?.map((cData, i) => {
          let abc = {
            label: cData.name,
            value: cData._id,
          };
          data.push(abc);
        });
        setCustomersData(data);
      }

      const apiData3 = await getUsers();
      if (apiData3.error) {
        setError(apiData3.error);
      } else {
        setMainData2(apiData3.data);
      }
      const apiData4 = await getTemplates();
      if (apiData4.error) {
        setError(apiData4.error);
      } else {
        setTemplateData(apiData4.data);
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
    setLoading(false);
  }, [setErrorToast, props.type]);
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
  }, [props.type]);

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
    formData.append("customerId", selectedCustomer);
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
      const apiData = await createProject(body);
      if (apiData.error) {
        setError(apiData.error);
      } else {
        // getData();
        handleClose3();
        // dispatch(fetchProjects());
        toast.success(
          <p className="text-white tx-16 mb-0">
            Success : Data Added Successfully !
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 3000,
            theme: "colored",
          }
        );
        navigate("/admin/projectsData");
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
  //   const updateData = async (body) => {
  //     setError("");
  //     setSuccessMessage("");

  //     setLoading(true);

  //     try {
  //       const apiData = await updateCity(body);
  //       if (apiData.error) {
  //         setError(apiData.error);
  //       } else {
  //         getData();
  //         largemodalClose();
  //         toast.success(
  //           <p className="text-white tx-16 mb-0">
  //             Success : City Updated !
  //           </p>,
  //           {
  //             position: toast.POSITION.TOP_RIGHT,
  //             hideProgressBar: false,
  //             autoClose: 3000,
  //             theme: "colored",
  //           }
  //         );
  //       }

  //     } catch (err) {
  //       console.log("err", err.name);
  //       if (err.response) {
  //         setError(err.response.data.message);
  //         setErrorToast(err.response.data.message);
  //       } else if (err.name === "AxiosError") {
  //         setError(err.message);
  //         setErrorToast(err.message);
  //       } else {
  //         setError("something went wrong");
  //         setErrorToast("something went wrong");
  //       }
  //     }

  //     setLoading(false);
  //   };
  useEffect(() => {
    getData();
  }, []);
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div className={styles.DataTable}>
      <PageHeader
        titles={`Add  Project`}
        active="Retailers"
        items={["Tables"]}
      />

      <ToastContainer />

      <Card fullscreen size="l" show={InputShow} onHide={handleClose3}>
        <Card.Header>
          <Modal.Title>Add Project</Modal.Title>
        </Card.Header>
        <form
          method="post"
          onSubmit={formsSubmit}
          autocomplete="off"
          encType="multipart/form-data"
        >
          <Card.Body>
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Name :<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      name="name"
                      placeholder="Enter  Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Select Customer :<span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="Select"
                      onChange={(e) => {
                        console.log("e", e);
                        setSelectedCustomer(e.value);
                      }}
                      required
                      options={customersData}
                      placeholder="Customers"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Client Project Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="clientProjectNumber"
                    placeholder="Enter  client Project Number"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      BT Project Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="btProjectNumber"
                    placeholder="Enter  BT Project Number"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Owner
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="owner"
                    placeholder="Enter  Owner"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      GC
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="gc"
                    placeholder="Enter  GC"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Architect
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="architect"
                    placeholder="Enter  Architect"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      EOR
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="eor"
                    placeholder="Enter  EOR"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Total Project Amount
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    required
                    name="project_amount"
                    placeholder="Enter  Project Amount"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Client PM
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="clientPM"
                    placeholder="Enter  client PM"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      BT PM
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <select className="form-control" name="btPM" id="">
                    {mainData2 &&
                      mainData2.map((data, i) => {
                        return (
                          <option value={data?._id}>
                            {data?.firstName} {data?.lastName}{" "}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      BT Engineer
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <select className="form-control" name="btEngineer" id="">
                    {mainData2 &&
                      mainData2.map((data, i) => {
                        return (
                          <option value={data?._id}>
                            {data?.firstName} {data?.lastName}{" "}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Select Tax Province
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <select className="form-control" id="">
                    {storedProducts &&
                      storedProducts.map((data, i) => {
                        return (
                          <option value={data?.name}>
                            {data?.name} - {data?.price} %{" "}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      BT Drafting Lead
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <select className="form-control" name="btDraftingLead" id="">
                    {mainData2 &&
                      mainData2.map((data, i) => {
                        return (
                          <option value={data?._id}>
                            {data?.firstName} {data?.lastName}{" "}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-lg-3">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Template
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <select className="form-control" name="templateId" id="">
                    {templateData &&
                      templateData.map((data, i) => {
                        return <option value={data?._id}>{data?.name} </option>;
                      })}
                  </select>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Scope Of Work</h1>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="text-center bg-success ">
                        <th colSpan={19} className="text-white">
                          Scope Of Work
                        </th>
                      </tr>
                      <tr>
                        <th>Item</th>
                        <th>Yes</th>
                        <th>No</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(tableData).map((key) => (
                        <TableRow
                          key={key}
                          item={{ label: key, ...tableData[key] }}
                          onChange={handleInputChange}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Walls, Columns & Beams</h1>
                  <div className="scrollable-table">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr className="text-center bg-success ">
                          <th colSpan={20} className="text-white">
                            Wall, Column & Beam Information
                          </th>
                        </tr>
                        <tr className="text-center">
                          <td colSpan={20}>Total SF/Pieces</td>
                        </tr>
                        <tr className="text-center">
                          <th>Level</th>
                          <th colSpan={2}>Str. Walls</th>
                          <th colSpan={2}>Core Walls</th>
                          <th colSpan={2}>Str. Arch. Wall</th>
                          <th colSpan={2}>Str. Ins. Arch</th>
                          <th colSpan={2}>Cladding</th>
                          <th colSpan={2}>Insul. Industrial</th>
                          <th colSpan={2}>Industrial</th>
                          <th colSpan={2}>Col'n</th>
                          <th colSpan={2}>Beam</th>
                          <th>
                            <Button
                              className="btn btn-info mt-3"
                              onClick={() => handleAddRow()}
                            >
                              <i className="fa fa-plus"></i>
                            </Button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(tableDataWalls).map((key) => (
                          <TableRowAlls
                            key={key}
                            itemKey={key}
                            item={{ label: key, ...tableData[key] }}
                            onChange={handleInputChange}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Design Information</h1>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="text-center bg-success ">
                        <th colSpan={7} className="text-white">
                          Design Information
                        </th>
                      </tr>

                      <tr className="text-center">
                        <th style={{ width: "150px" }}></th>
                        <th>08H1</th>
                        <th>08H2</th>
                        <th>10H1</th>
                        <th>10H2</th>
                        <th>12H1</th>
                        <th>12H2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Avg. Strand</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Plates</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Solid Slab</h1>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="text-center bg-success ">
                        <th colSpan={7} className="text-white">
                          Solid Slab
                        </th>
                      </tr>

                      <tr className="text-center">
                        <th style={{ width: "150px" }}></th>
                        <th>Landing</th>
                        <th>Solid Slab</th>
                        <th>Balcony</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Avg. Strand</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar - Top</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar - Top</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar - Top</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mesh</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Plates</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Formliner</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Stain</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Long Lead Time</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Walls</h1>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="text-center bg-success ">
                        <th colSpan={7} className="text-white">
                          Walls
                        </th>
                      </tr>

                      <tr className="text-center">
                        <th style={{ width: "150px" }}></th>
                        <th>Cladding</th>
                        <th>Arch Wall</th>
                        <th>Str Wall</th>
                        <th>Str Wall Arch F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Avg. Strand</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar - Stirrups</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mesh</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mesh</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Connections</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Plates</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Insulation</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Formliner</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Stain</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Long Lead Time</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-12 mt-4">
                  <h1>Columns/Beams</h1>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="text-center bg-success ">
                        <th colSpan={7} className="text-white">
                          Columns/Beams
                        </th>
                      </tr>

                      <tr className="text-center">
                        <th style={{ width: "150px" }}></th>
                        <th>Cladding</th>
                        <th>Arch Wall</th>
                        <th>Str Wall</th>
                        <th>Str Wall Arch F</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Avg. Strand</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Rebar - Stirrups</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mesh</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mesh</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Connections</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Plates</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Insulation</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Formliner</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Stain</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Long Lead Time</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card.Body>
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
            {/* <Button variant="danger" onClick={handleClose3}>
                  Close
                </Button> */}
          </Modal.Footer>
        </form>
      </Card>
    </div>
  );
};

export default AddProject;
