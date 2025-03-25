import React, { useState, useEffect } from "react";
import { Card, Table, Button, Row, Col, Form } from "react-bootstrap";
import PageHeader from "../../../../Layouts/PageHeader/PageHeader";
import { Select } from "@mui/material";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [designation, setDesignation] = useState("");
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    // Load contacts from localStorage on initial render
    const storedContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    setContacts(storedContacts);
  }, []);

  const saveToLocalStorage = (contacts) => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  };

  const addContact = () => {
    if (!companyName || !email || !mobile || !location || !designation) return;
    const newContact = {
      companyName,
      email,
      mobile,
      location,
      designation,
      id: Date.now(), // Unique ID based on timestamp
    };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts); // Save to localStorage
    // Reset fields
    setCompanyName("");
    setEmail("");
    setMobile("");
    setLocation("");
    setDesignation("");
  };

  const removeContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts); // Save to localStorage
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader titles={`Contacts`} active="Contacts" items={["Tables"]} />
      <Row className="row-sm">
        <Col md={{ span: 12, offset: 0 }}>
          <Card>
            <Card.Header>
              <h4>Add Contact</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  {/* <label htmlFor="recipient-name" className="col-form-label">
                    Select Customer :<span className="text-danger">*</span>
                  </label>
                  <br />
                  <Select
                    classNamePrefix="Select"
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="form-control"
                    options={customersData}
                    placeholder="Customers"
                  /> */}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={addContact}>
                  Add Contact
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 12, offset: 0 }}>
          <Card>
            <Card.Header>
              <h4>Contact List</h4>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Location</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.companyName}</td>
                      <td>{product.email}</td>
                      <td>{product.mobile}</td>
                      <td>{product.location}</td>
                      <td>{product.designation}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => removeContact(product.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Contacts added
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
export default Contacts;
