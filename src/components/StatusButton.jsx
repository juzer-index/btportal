import React from "react";
import { Badge, Button } from "react-bootstrap";

export const StatusButton = (props) => {
  let bg = props.bg;
  let value = props.value;
  let status = value ? value : bg === "success" ? "Approved" : "Pending";
  return (
    <div className="text-center">
      <Button className="mt-1  mb-1 me-3" variant={bg}>
        {status}
      </Button>
    </div>
    // <h4 className='text-center'>
    //     <Badge pill bg={bg}>
    //         {status}
    //     </Badge>
    // </h4>
  );
};
