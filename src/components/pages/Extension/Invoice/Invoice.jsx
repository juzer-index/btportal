import React, { useCallback, useState, useEffect } from "react";
import styles from "./Invoice.module.scss";
import PageHeader from "../../../../Layouts/PageHeader/PageHeader";
import { Col, Row, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import moment from "moment";
import Select from "react-select";
import { getCustomers, getProjectsData } from "../../../../utils/api";
const invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "[]");

console.log("invoiceData", invoiceData?.[0]);
// const fs = require("fs");

const Invoice = () => {
  const print = () => {
    window.print();
  };

  let lastInvoiceNumber = 0;
  if (invoiceData.length > 0) {
    const lastInvoice =
      invoiceData?.[invoiceData?.length - 1]?.invoiceNumber ?? "";
    console.log("lastInvoiceNumber,", lastInvoice);
    lastInvoiceNumber = parseInt(invoiceData?.length);
  }
  let newInvoiceNumber = lastInvoiceNumber + 1;
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month, pad with zero if needed
  const day = now.getDate().toString().padStart(2, "0"); // Day, pad with zero if needed
  const newInvoiceNumberFormatted = `${year}${month}${day}${newInvoiceNumber
    .toString()
    .padStart(3, "0")}`;

  const [products2, setProducts2] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    // Load products from localStorage on initial render
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts2(storedProducts);
  }, []);

  const saveToLocalStorage = (products) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [mainTotalAmount, setMainTotalAmount] = useState(0);
  const [discount, setDiscountAmount] = useState(0);
  const [shipping, setShippingAmount] = useState(0);
  const [due_date, setDueDate] = useState();
  const [invoiceDate, setInvoiceDate] = useState();
  const [mainData, setMainData] = useState([]);

  const SearchDate = moment(new Date()).format("DD/MM/YYYY");
  console.log("selectedCustomer", selectedCustomer);
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const apiData2 = await getCustomers();
      if (apiData2.error) {
        // setError(apiData2.error);
      } else {
        console.log("getCustomers", apiData2.data);

        const data = [];
        apiData2.data?.map((cData, i) => {
          let abc = {
            label: cData.name,
            value: cData._id,
            streetAddress1: cData?.streetAddress1,
            streetAddress2: cData?.streetAddress2,
            city: cData?.city,
            name: cData?.name,
          };
          data.push(abc);
        });
        setCustomersData(data);
      }

      const apiData = await getProjectsData();
      if (apiData.error) {
      } else {
        console.log("getData", apiData.data);
        setMainData(apiData.data);
      }

      // const apiData3 = await getUsers();
      // if (apiData3.error) {
      //   setError(apiData3.error);
      // } else {
      //   setMainData2(apiData3.data);
      // }
      // const apiData4 = await getTemplates();
      // if (apiData4.error) {
      //   setError(apiData4.error);
      // } else {
      //   setTemplateData(apiData4.data);
      // }
    } catch (err) {
      console.log("err", err.name);
      // if (err.response) {
      //   setError(err.response.data.message);
      //   setErrorToast(err.response.data.message);
      // } else if (err.name === "AxiosError") {
      //   setError(err.message);
      //   setErrorToast(err.message);
      // } else {
      //   setError("something went wrong");
      //   setErrorToast("something went wrong");
      // }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const [products, setProducts] = useState([
    {
      product: "",
      quantity: 0,
      unitPrice: 0,
      tax: false,
      subTotal: 0,
    },
  ]);
  const removeProductLine = (index) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
  };

  const addProductLine = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        product: "",
        quantity: 0,
        unitPrice: 0,
        tax: false,
        subTotal: 0,
      },
    ]);
  };
  // const handleInputChange = (index, event) => {
  //   const { name, value, type, checked } = event.target;
  //   let newValue = type === "checkbox" ? checked : value;

  //   if (name === "quantity" || name === "unitPrice") {
  //     newValue = parseFloat(newValue);
  //   }

  //   setProducts((prevProducts) => {
  //     const updatedProducts = [...prevProducts];
  //     updatedProducts[index] = {
  //       ...updatedProducts[index],
  //       [name]: newValue,
  //     };

  //     const product = updatedProducts[index];
  //     const subTotal = product.quantity * product.unitPrice;
  //     const taxAmount = product.tax ? (subTotal * 18) / 100 : 0;
  //     updatedProducts[index].subTotal = subTotal + taxAmount;
  //     const newSubtotal = updatedProducts.reduce(
  //       (total, p) => total + p.subTotal,
  //       0
  //     );
  //     const newTaxTotal = updatedProducts.reduce(
  //       (total, p) => total + (p.tax ? (p.subTotal * 18) / 100 : 0),
  //       0
  //     );

  //     setSubtotal(newSubtotal.toFixed(2));
  //     setTaxTotal(newTaxTotal.toFixed(2));
  //     setMainTotalAmount((newSubtotal + newTaxTotal).toFixed(2));

  //     return updatedProducts;
  //   });
  // };
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    console.log("name", name, value);

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const selectedProduct = products2.find(
        (product) => product.name === value
      );

      if (name === "product") {
        updatedProducts[index] = {
          ...updatedProducts[index],
          unitPrice: selectedProduct.price,
          product: value,
        };
      } else {
        let newValue = value;
        if (name === "quantity" || name === "unitPrice") {
          newValue = parseFloat(newValue);
        }
        updatedProducts[index] = {
          ...updatedProducts[index],
          [name]: newValue,
        };
      }

      // Calculate subtotal and taxes for the updated product line
      const product = updatedProducts[index];
      const subTotal = (product.quantity * product.unitPrice) / 100;
      const taxAmount = product.tax ? (subTotal * product.tax) / 100 : 0;
      updatedProducts[index].subTotal = subTotal + taxAmount;

      // Update subtotal and tax total for all products
      const newSubtotal = updatedProducts.reduce(
        (total, p) => total + p.subTotal,
        0
      );
      const newTaxTotal = updatedProducts.reduce(
        (total, p) => total + (p.tax ? (p.subTotal * p?.tax) / 100 : 0),
        0
      );

      // Update state
      setSubtotal(newSubtotal.toFixed(2));
      setTaxTotal(newTaxTotal.toFixed(2));
      setMainTotalAmount((newSubtotal + newTaxTotal).toFixed(2));

      return updatedProducts;
    });
  };

  const saveInvoice = () => {
    const payload = {
      customer_name: selectedCustomer?.name,
      amount_due: mainTotalAmount + shipping - discount,
      due_date: due_date,
      invoice_date: invoiceDate,
      products: products,
      subtotal: subtotal,
      tax_total: taxTotal,
      discount: discount,
      shipping: shipping,
    };
    let invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "[]");

    // Generate a new ID for the invoice (you may use a different method if you have a specific ID generation logic)
    const newId = "INV" + (invoiceData.length + 1).toString().padStart(3, "0");

    // Add the new invoice to the invoiceData array
    invoiceData.push({
      id: newId,
      ...payload,
    });

    // Save the updated invoice data back to localStorage
    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));

    console.log("Invoice saved successfully!");
    alert("Invoice saved successfully!");
  };
  return (
    <div className={styles.Invoice}>
      <PageHeader titles="Invoice" active="Invoice" items={["Pages"]} />
      {/* <!-- ROW-1 OPEN --> */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <Link
                    className="header-brand"
                    to={`${process.env.PUBLIC_URL}/dashboard`}
                  >
                    <img
                      src={logo}
                      style={{ width: "150px" }}
                      className=""
                      alt=""
                    />
                  </Link>
                  <div>
                    <address className="pt-3">
                      <br />
                      18 King St.East Suite 1400 TORONTO ON M5C 1C4 CANADA
                      <br />
                      www.buildingtheory.com
                    </address>
                  </div>
                </Col>
                <Col lg={6} className="text-end border-bottom border-lg-0">
                  <h3>#INV-526</h3>
                  {/* <h5>Date Issued: 12-07-2021</h5> */}
                  <h5>Invoice Date: {SearchDate}</h5>
                </Col>
              </Row>
              <Row className="pt-5">
                <Col lg={6}>
                  <p className="h3">Invoice To:</p>
                  <p className="fs-18 fw-semibold mb-0">John Paige</p>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Select Customer :<span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="Select"
                      onChange={(e) => {
                        const customerId = e.value;

                        const selectedData = customersData?.find((cData, i) => {
                          console.log("cData: " + cData?.value);
                          return cData.value === customerId;
                        });
                        console.log("selectedData", selectedData);

                        setSelectedCustomer(selectedData);
                      }}
                      required
                      options={customersData}
                      placeholder="Customers"
                    />
                  </div>
                  {selectedCustomer && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItemsL: "center",
                        }}
                      >
                        <address
                          style={{
                            border: "1px solid black",
                            width: "200px",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <b>Billing Address: </b>
                          <br />
                          Street Address : 1 {selectedCustomer?.streetAddress1}
                          <br />
                          Street Address : 2 {selectedCustomer?.streetAddress2}
                          <br />
                          City : {selectedCustomer?.city}
                          <br />
                          {/* Region, Postal Code */}
                          <br />
                          {/* yourdomain@example.com */}
                        </address>
                        <address
                          style={{
                            border: "1px solid black",
                            width: "200px",
                            padding: "10px",
                            marginTop: "10px",
                            marginLeft: "10px",
                          }}
                        >
                          <b>Shipping Address: </b>
                          <br />
                          Street Address : 1 {selectedCustomer?.streetAddress1}
                          <br />
                          Street Address : 2 {selectedCustomer?.streetAddress2}
                          <br />
                          City : {selectedCustomer?.city}
                          <br />
                          {/* Region, Postal Code */}
                          <br />
                          {/* yourdomain@example.com */}
                        </address>
                      </div>
                    </>
                  )}{" "}
                </Col>
                <Col lg={6} className="text-start">
                  <p className="h4 fw-semibold">Payment Details:</p>
                  <div className="form-group">
                    <label htmlFor="">
                      Invoice Date <span className="text-danger">*</span>
                    </label>
                    <p className="mb-1">
                      <input
                        type="date"
                        placeholder="Invoice Date"
                        onChange={(e) => {
                          setInvoiceDate(e.target.value);
                        }}
                        value={invoiceDate}
                        className="form-control"
                        name=""
                        id=""
                      />
                    </p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <p className="mb-1">
                      <input
                        type="date"
                        placeholder="Due Date"
                        onChange={(e) => {
                          setDueDate(e.target.value);
                        }}
                        value={due_date}
                        className="form-control"
                        name=""
                        id=""
                      />
                    </p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">
                      Invoice Number <span className="text-danger">*</span>
                    </label>
                    <p className="mb-1">
                      <input
                        type="text"
                        defaultValue={newInvoiceNumberFormatted}
                        placeholder="Invoice Number"
                        className="form-control"
                        name=""
                      />
                    </p>
                  </div>
                </Col>
              </Row>
              <div className="table-responsive push">
                <Table className="table-bordered table-hover mb-0 text-nowrap">
                  <thead>
                    <tr className=" ">
                      <th className="text-center">No.</th>
                      <th>Project/Tax </th>
                      <th>Product / Service </th>
                      <th className="text-center">Project Completion %</th>
                      <th className="text-center">Tax Amount</th>
                      <th className="text-center">Total Price</th>
                      <th className="text-center">Sub Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <select
                            name="tax"
                            id=""
                            onChange={(e) => {
                              handleInputChange(index, e);
                            }}
                            className="form-control"
                          >
                            <option value="0">Select Project</option>
                            {mainData &&
                              mainData
                                ?.filter((fData, i2) => {
                                  return (
                                    fData?.customerId?._id ===
                                    selectedCustomer?.value
                                  );
                                })
                                .map((product, i) => {
                                  return (
                                    <option value={product?.taxAmount}>
                                      {product.name} / ({product?.taxAmount}%)
                                    </option>
                                  );
                                })}
                          </select>
                        </td>
                        <td>
                          <select
                            name="product"
                            id=""
                            onChange={(e) => {
                              handleInputChange(index, e);
                            }}
                            className="form-control"
                          >
                            <option value="0">Select Product</option>
                            {products2 &&
                              products2.map((product, i) => {
                                return <option>{product.name}</option>;
                              })}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={product.quantity}
                            style={{ width: "100px" }}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Qty"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="unitPrice"
                            style={{ width: "100px" }}
                            readOnly
                            value={(product.tax * product.subTotal) / 100}
                            placeholder="Price"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="unitPrice"
                            style={{ width: "200px" }}
                            value={product.unitPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Price"
                          />
                        </td>
                        {/* <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              height: "30px",
                            }}
                          >
                            <input
                              type="checkbox"
                              style={{ width: "15px", height: "15px" }}
                              name="tax"
                              checked={product.tax}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder="tax"
                            />
                          </div>
                        </td> */}
                        <td> $ {product.subTotal} </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={addProductLine}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                          {index !== 0 && (
                            <>
                              {" "}
                              <button
                                className="btn btn-sm btn-danger"
                                style={{ marginLeft: "5px" }}
                                onClick={() => removeProductLine(index)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={5}>SubTotal</th>
                      <th> $ {subtotal} </th>
                    </tr>
                    <tr>
                      <th colSpan={5}>Total Tax Amount</th>
                      <th> $ {taxTotal}</th>
                    </tr>
                    {/* <tr>
                      <th colSpan={4}>Shipping </th>
                      <th>
                        <input
                          type="number"
                          className="form-control"
                          name="unitPrice"
                          style={{ width: "100%" }}
                          value={shipping}
                          onChange={(e) => {
                            setShippingAmount(e.target.value);
                          }}
                          placeholder="Shipping"
                        />{" "}
                      </th>
                      <th>{shipping} $ </th>
                    </tr> */}
                    {/* <tr>
                      <th colSpan={4}>Discount </th>
                      <th>
                        <input
                          type="number"
                          className="form-control"
                          name="unitPrice"
                          style={{ width: "100%" }}
                          value={discount}
                          onChange={(e) => {
                            setDiscountAmount(e.target.value);
                          }}
                          placeholder="Discount"
                        />{" "}
                      </th>
                      <th>- $ {discount} </th>
                    </tr> */}
                    <tr>
                      <th colSpan={5}>Amount Due</th>
                      <th>
                        ${" "}
                        {parseFloat(mainTotalAmount) +
                          parseFloat(shipping) -
                          parseFloat(discount)}{" "}
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="success"
                onClick={saveInvoice}
                disabled={!selectedCustomer}
                className="mb-1 me-2"
              >
                <i className="si si-wallet"></i> Save
              </Button>
              {/* 
              <Button
                variant="secondary"
                onClick={print}
                type="button"
                className="mb-1 me-2"
              >
                <i className="si si-paper-plane"></i> Send Invoice
              </Button>

              <Button
                variant="danger"
                onClick={print}
                type="button"
                className="mb-1 me-2"
              >
                <i className="si si-printer"></i> Print Invoice
              </Button> */}
            </Card.Footer>
            {/* <Card.Footer className="text-end">
              <Button variant="primary" onClick={print} className="mb-1 me-2">
                <i className="si si-wallet"></i> Pay Invoice
              </Button>

              <Button
                variant="secondary"
                onClick={print}
                type="button"
                className="mb-1 me-2"
              >
                <i className="si si-paper-plane"></i> Send Invoice
              </Button>

              <Button
                variant="danger"
                onClick={print}
                type="button"
                className="mb-1 me-2"
              >
                <i className="si si-printer"></i> Print Invoice
              </Button>
            </Card.Footer> */}
          </Card>
        </Col>
        {/* <!-- COL-END --> */}
      </Row>
      {/* <!-- ROW-1 CLOSED --> */}
    </div>
  );
};

export default Invoice;
