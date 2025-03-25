import React from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Button } from "react-bootstrap";
const ExcelExport = (props) => {
  const tableRef = props.tableRef;
  const name = props.name;
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: name,
    sheet: name,
  });
  return (
    <Button
      className="me-3 mt-2 float-right"
      variant="danger"
      animation="flip"
      onClick={onDownload}
    >
      Export Excel
    </Button>
  );
};

export default ExcelExport;
