import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
    Accordion,
    Nav
  } from "react-bootstrap";
const FaqModal = () => {
const [show, setShow] = useState(false);
  const [BacktoTop, setBacktopTop] = useState("d-block");
  const smallmodalClose = () => setShow(false);
  const smallmodalShow = () => setShow(true);
  
  return (
    <div>
      {/* <Link to="#" id="back-to-top" onClick={screenup} className={`${BacktoTop}`} ><i className="fa fa-angle-up"></i></Link> */}

  
              <Nav.Link className="nav-link icon  nav-link-bg"  onClick={smallmodalShow}>
                          {/* <i className="fe  fe-question-circle "></i> */}
                          <i className="fe fe-help-circle"></i>
            </Nav.Link>

              <Modal size="xl" show={show} onHide={smallmodalClose}>
                <ModalHeader>
                  <ModalTitle>Looking For Help? </ModalTitle>
                  <span className="d-flex ms-auto" onClick={smallmodalClose}>
                    <i className="fe fe-x ms-auto"></i>
                  </span>
                </ModalHeader>
                <ModalBody>
                <Row>
      <Col md={12}>
        <Card>
         
          <Card.Body>

            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>How do I know if my entry is confirmed for the contest?</Accordion.Header>
                <Accordion.Body>
                  You will receive an confirmation once our team verifies your submitted information. Alternatively, you can log in to the customer dashboard and view status of your submitted entry.
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>

          </Card.Body>
        </Card>
       
      </Col>
    </Row>
                </ModalBody>
                
              </Modal>
    </div>
  );
};

FaqModal.propTypes = {};

FaqModal.defaultProps = {};

export default FaqModal;









