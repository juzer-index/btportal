import React, { useState, useEffect } from "react";
import { Card, Table, Button, Row, Col } from "react-bootstrap";
import PageHeader from "../../../../Layouts/PageHeader/PageHeader";
import { useLocation } from "react-router-dom";

const ProjectFinancial = () => {
  const [products, setProducts] = useState([]);
  const [projectFinanCialData, setProjectFinanCialData] = useState([]);
  const [tax, setTAX] = useState([]);
  const [productName, setProductName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const location = useLocation();
  const projectData = location.state;
  const projectName = projectData?.name;
  console.log("projectData", projectData);
  useEffect(() => {
    // Load products from localStorage on initial render
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
    const storedProductsTax = JSON.parse(localStorage.getItem("taxes") || "[]");
    setTAX(storedProductsTax);
    const projectFinancialData = JSON.parse(
      localStorage.getItem("projectFinancial") || "[]"
    );
    setProjectFinanCialData(projectFinancialData);
  }, []);

  const saveToLocalStorage = (products) => {
    localStorage.setItem("projectFinancial", JSON.stringify(products));
  };

  const addProduct = () => {
    const newProduct = {
      product: productName,
      tax: taxId,
      projectId: projectData?._id,
      id: Date.now(),
    };
    console.log("newProductnewProduct", newProduct);
    const updatedProducts = [...projectFinanCialData, newProduct];
    setProjectFinanCialData(updatedProducts);
    saveToLocalStorage(updatedProducts); // Save to localStorage
    setProductName("");
    setTaxId("");
  };

  const removeProduct = (id) => {
    const updatedProducts = projectFinanCialData.filter(
      (product) => product.id !== id
    );
    setProjectFinanCialData(updatedProducts);
    saveToLocalStorage(updatedProducts);
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        titles={`Project Financial Master :${projectName}`}
        active="Retailers"
        items={["Tables"]}
      />
      <Row className="row-sm">
        <Col md={{ span: 12, offset: 0 }}>
          <Card>
            <Card.Header>
              <h4>Add Product Inside Project : {projectName}</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <label htmlFor="">Select Product</label>
                <select
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                  className="form-control"
                  name=""
                  id=""
                >
                  <option value="0">Select</option>
                  {products.map((p) => {
                    console.log("pppp", p);
                    return <option value={p.name}>{p.name}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="">Select Tax</label>
                <select
                  onChange={(e) => {
                    setTaxId(e.target.value);
                  }}
                  className="form-control"
                  name=""
                  id=""
                >
                  <option value="0">Select</option>

                  {tax?.map((p) => {
                    console.log("pppp", p);
                    return (
                      <option value={p.name}>
                        {p.name} - {p.price}%
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <Button variant="primary" onClick={addProduct}>
                  Add Project Financial Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 12, offset: 0 }}>
          <Card>
            <Card.Header>
              <h4>Product List</h4>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product </th>
                    <th>Tax</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectFinanCialData?.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.product}</td>
                      <td>{product.tax} </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => removeProduct(product.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No products added
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectFinancial;
