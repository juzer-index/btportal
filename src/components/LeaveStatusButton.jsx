import React from "react";
import { Badge, Button } from "react-bootstrap";

export const LeaveStatusButton = (props) => {
  let bg = props.bg;
  let value = props.value;
  let status = value ? value : bg === "success" ? "Approve" : "Rejected";
  return (
    <div className="text-center">
      <Button className="mt-1  mb-1 me-3" variant={bg}>
        {status}
      </Button>
    </div>
  );
};
// export const LeaveStatusButton = (props) => {
//   let bg = props.bg;
//   let value = props.value;
//   let status =
//     value && bg !== "warning"
//       ? value
//       : bg === "success"
//       ? "Approve"
//       : bg === "warning"
//       ? "Pending"
//       : "Rejected";

//   return (
//     <div className="text-center">
//       <Button className="mt-1  mb-1 me-3" variant={bg}>
//         {status}
//       </Button>
//     </div>
//   );
// };
