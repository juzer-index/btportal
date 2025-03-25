import React, { useState, useEffect } from "react";
import { Card, Table, Button, Row, Col } from "react-bootstrap";
import PageHeader from "../../../../Layouts/PageHeader/PageHeader";

const Tax = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    // Load products from localStorage on initial render
    const storedProducts = JSON.parse(localStorage.getItem("taxes") || "[]");
    setProducts(storedProducts);
  }, []);

  const saveToLocalStorage = (products) => {
    localStorage.setItem("taxes", JSON.stringify(products));
  };

  const addProduct = () => {
    if (!productName || !productPrice) return;
    const newProduct = {
      name: productName,
      price: parseFloat(productPrice).toFixed(2),
      id: Date.now(), // Unique ID based on timestamp
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveToLocalStorage(updatedProducts); // Save to localStorage
    setProductName("");
    setProductPrice("");
  };

  const removeProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    saveToLocalStorage(updatedProducts);
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader titles={`Tax Master`} active="Retailers" items={["Tables"]} />
      <Row className="row-sm">
        <Col md={{ span: 12, offset: 0 }}>
          <Card>
            <Card.Header>
              <h4>Add Tax Master</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Province Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Tax %"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
                <Button variant="primary" onClick={addProduct}>
                  Add Tax
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
                    <th>Province </th>
                    <th>Tax Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.price} %</td>
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

export default Tax;
