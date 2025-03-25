import React, { useCallback, useState, useEffect } from "react";
import styles from "./Invoice.module.scss";
import PageHeader from "../../../../Layouts/PageHeader/PageHeader";
import { Col, Row, Card, Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import moment from "moment";
import Select from "react-select";
import { getCustomers } from "../../../../utils/api";
import EmailPopup from "./EmailPopup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// const fs = require("fs");

const InvoiceDetails = () => {
  let { id } = useParams();

  const convertInvoiceToPdf = async () => {
    const invoice = document.getElementById("invoice"); // Ensure your invoice content is within a div with id="invoice"
    const canvas = await html2canvas(invoice);
    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const print = () => {
    window.print();
  };
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const [customersData, setCustomersData] = useState([]);
  const [mainData, setMainData] = useState([]);
  useEffect(() => {
    let invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "[]");

    const selectedInvoice = invoiceData.find((iData, i) => {
      return iData.id === id;
    });

    setMainData(selectedInvoice);
  }, []);
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [mainTotalAmount, setMainTotalAmount] = useState(0);
  const [discount, setDiscountAmount] = useState(0);
  const [shipping, setShippingAmount] = useState(0);
  const [due_date, setDueDate] = useState();
  const [invoiceDate, setInvoiceDate] = useState();

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
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "quantity" || name === "unitPrice") {
      newValue = parseFloat(newValue);
    }

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: newValue,
      };

      const product = updatedProducts[index];
      const subTotal = product.quantity * product.unitPrice;
      const taxAmount = product.tax ? (subTotal * 18) / 100 : 0;
      updatedProducts[index].subTotal = subTotal + taxAmount;
      const newSubtotal = updatedProducts.reduce(
        (total, p) => total + p.subTotal,
        0
      );
      const newTaxTotal = updatedProducts.reduce(
        (total, p) => total + (p.tax ? (p.subTotal * 18) / 100 : 0),
        0
      );

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
    const newId =
      "invoiceDate" + (invoiceData.length + 1).toString().padStart(3, "0");

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
  const handleSendEmail = async (email) => {
    const invoicePdf = await convertInvoiceToPdf();
    const response = await fetch("/api/send-invoice-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, invoicePdf }),
    });

    if (response.ok) {
      alert("Email sent successfully!");
    } else {
      alert("Failed to send email.");
    }
  };
  return (
    <div className={styles.Invoice} id="invoice">
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
                  <h3>#{mainData?.id}</h3>
                  {/* <h5>Date Issued: 12-07-2021</h5> */}
                  {/* <h5>Invoice Date: {SearchDate}</h5> */}
                </Col>
              </Row>
              <Row className="pt-5">
                <Col lg={6}>
                  <p className="h3">Invoice To:</p>
                  <p className="fs-18 fw-semibold mb-0">John Paige</p>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Selected Customer :<span className="text-danger">*</span>
                    </label>
                    <br />

                    {mainData?.customer_name}
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
                    <p className="mb-1">{mainData?.invoice_date}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <p className="mb-1">
                      <p className="mb-1">{mainData?.due_date}</p>
                    </p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">
                      Invoice Number <span className="text-danger">*</span>
                    </label>
                    <p className="mb-1">{mainData?.id}</p>
                  </div>
                </Col>
              </Row>
              <div className="table-responsive push">
                <Table className="table-bordered table-hover mb-0 text-nowrap">
                  <thead>
                    <tr className=" ">
                      <th className="text-center">No.</th>
                      <th>Product / Service </th>
                      <th className="text-center">Project Completion %</th>
                      <th className="text-center">Total Price</th>
                      <th className="text-center">Sub Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainData?.products?.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="product"
                            value={product.product}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Product / Service"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={product.quantity}
                            style={{ width: "80px" }}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Qty"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="unitPrice"
                            style={{ width: "80px" }}
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
                        <td>$ {product.subTotal}</td>
                        <td>
                          {/* <button
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
                          )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={5}>SubTotal</th>
                      <th>${mainData?.subtotal} </th>
                    </tr>
                    <tr>
                      <th colSpan={5}>Total Tax Amount</th>
                      <th>{mainData?.tax_total} $</th>
                    </tr>
                    {/* <tr>
                      <th colSpan={6}>Shipping </th>
                      <th>{mainData?.shipping} $</th>
                    </tr>
                    <tr>
                      <th colSpan={6}>Discount </th>

                      <th>{mainData?.discount} $</th>
                    </tr> */}
                    <tr>
                      <th colSpan={5}>Amount Due</th>
                      <th>${mainData?.amount_due?.toFixed(2)} </th>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="danger"
                onClick={print}
                type="button"
                className="mb-1 me-2"
              >
                <i className="si si-printer"></i> Print Invoice
              </Button>
              <>
                <Button
                  variant="secondary"
                  onClick={() => setShowEmailPopup(true)}
                  className="mb-1 me-2"
                >
                  <i className="si si-paper-plane"></i> Send Email
                </Button>

                <EmailPopup
                  show={showEmailPopup}
                  onClose={() => setShowEmailPopup(false)}
                  onSendEmail={handleSendEmail}
                />
              </>

              {/* <Button
                variant="success"
                onClick={saveInvoice}
                disabled={!selectedCustomer}
                className="mb-1 me-2"
              >
                <i className="si si-wallet"></i> Save
              </Button> */}
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

export default InvoiceDetails;
