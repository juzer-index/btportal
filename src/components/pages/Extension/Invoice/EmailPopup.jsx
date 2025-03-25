import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EmailPopup = ({ show, onClose, onSendEmail }) => {
  const [email, setEmail] = useState("test@gmail.com");

  const handleSend = () => {
    onSendEmail(email);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Invoice via Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSend}>
          Send Email
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailPopup;
