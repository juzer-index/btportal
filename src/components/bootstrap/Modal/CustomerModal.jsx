import React, { useState } from "react";


 function CheckBox({id, checkboxId, placeholder}) {

      const [isChecked, setIsChecked] = useState(false);

      const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };

  return (
    <div className="row">
      <div className="col-lg-4">
        <div>
          <label className="switch" htmlFor={`btncheck_${checkboxId}_${id}`}>
            <input
              type="checkbox"
              className="btn-check"
              id={`btncheck_${checkboxId}_${id}`}
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="col-lg-8">
        {isChecked && (
          <input
            type="text"
            className="form-control"
            id={`check_input_${checkboxId}`}
            style={{ border: "1px solid black" }}
            placeholder={placeholder}
            required
          />
        )}
      </div>
    </div>
  );
}


export default function CustomerModal
(props) {
  let id = props.id;
  let name = props.name;
  let img_src = props.img_src;

  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation(rotation === 270 ? 0 : rotation + 90);
  };
  
  
  return (
    <>
      {/* Modal */}
      <div className="modal fade" id={id} tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg " role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{name}</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <button className="btn btn-primary mb-5" onClick={handleRotate}>
                Rotate Image
              </button>
              <div className="row">
                <div className="col-lg-6">
                  <img
                    src={img_src}
                    alt="invoice_img"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 0.5 ease-in-out",
                    }}
                    onClick={handleRotate}
                    className="py-5"
                  />
                </div>
                <div className="col-lg-6">
                  <CheckBox id={id} checkboxId={1} placeholder="GST Number"/>
                  <CheckBox id={id} checkboxId={2} placeholder="Invoice Number"/>
                  <CheckBox id={id} checkboxId={3} placeholder="Dealer Number"/>
                  <CheckBox id={id} checkboxId={4} placeholder="Dealer Code"/>
                  <CheckBox id={id} checkboxId={5} placeholder="Customer Number"/>
                  {/* <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <label className="switch" htmlFor={`btncheck1_${id}`}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`btncheck1_${id}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-8">
                        {isChecked && (
                      <input
                        type="text"
                        className="form-control"
                        id="check_input1"
                        style={{ border: "1px solid black" }}
                      />
                        )}
                    </div>
                  </div> */}
                  {/* <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <label className="switch" htmlFor={`btncheck2_${id}`}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`btncheck2_${id}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-8">
                        {isChecked && (
                      <input
                        type="text"
                        className="form-control"
                        id="check_input2"
                        style={{ border: "1px solid black" }}
                      />
                        )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <label className="switch" htmlFor={`btncheck3_${id}`}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`btncheck3_${id}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-8">
                        {isChecked && (
                      <input
                        type="text"
                        className="form-control"
                        id="check_input3"
                        style={{ border: "1px solid black" }}
                      />
                        )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <label className="switch" htmlFor={`btncheck4_${id}`}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`btncheck4_${id}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-8">
                        {isChecked && (
                      <input
                        type="text"
                        className="form-control"
                        id="check_input4"
                        style={{ border: "1px solid black" }}
                      />
                        )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <label className="switch" htmlFor={`btncheck5_${id}`}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`btncheck5_${id}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      {isChecked && (
                        <input
                          type="text"
                          className="form-control"
                          id="check_input5"
                          style={{ border: "1px solid black" }}
                        />
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}