import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import classnames from 'classnames';
import "./gridStyle.css";
import * as XLSX from 'xlsx';
import FileDownloadButton from "../FileDownloadButton/FileDownloadButton ";
import { Link } from "react-router-dom";

const DataTable = ({ data }) => {
  const gridRef = useRef(null);

  const statusOptions = [
    "Pending",
    "Program Received",
    "Internal Test",
    "UAT",
    "Resolved",
    "Rejected",
  ];

  const typeOptions = ["EGABI", "Internal"];

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [requestedByFilter, setRequestedByFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const columnDefs = [
    { headerName: "ID", field: "id", width: 85, readOnlyEdit: true, cellStyle: { fontWeight: "bold" } },
    { headerName: "Title", field: "title", width: 150 },
    { headerName: "Created By", field: "createdBy", width: 150 },
    { headerName: "Requested By", field: "requestedBy", width: 150 },
    { headerName: "Created At", field: "createdAt" },
    { headerName: "Type", field: "typeofRequest", width: 150 },
    { headerName: "Status", field: "status", width: 170 },
    { headerName: "Updated At", field: "updatedAt" },
    { headerName: "Request Details", field: "requestDetails" },
    {
      headerName: "",
      width: 150,
      field: "actions",
      cellRenderer: (params) => {
        const { id } = params.data;
        return <FileDownloadButton request_id={id} />;
      },
    },
    {
      headerName: "",
      width: 150,
      field: "actions",
      cellRenderer: (params) => {
        const { id } = params.data;
        return <Link to={`/Rdetails/${id}`}>View Details</Link>;
      },
    },
  ];

  const filteredData = useMemo(() => {
    let filtered = data;

    if (statusFilter) {
      filtered = filtered.filter(item =>{ if (item && item.status ) return item.status.trim().toLowerCase() === statusFilter.toLowerCase()});
    }
    if (typeFilter) {
      filtered = filtered.filter(item => {if (item && item.typeofRequest )return item.typeofRequest.trim().toLowerCase() === typeFilter.toLowerCase()});
    }
    if (createdByFilter) {
      filtered = filtered.filter(item =>{ if (item && item.createdBy )return item.createdBy.trim().toLowerCase() === createdByFilter.toLowerCase()});
    }
    if (requestedByFilter) {
      filtered = filtered.filter(item =>{ if (item && item.requestedBy )return item.requestedBy.trim().toLowerCase() === requestedByFilter.toLowerCase()});
    }
    if (fromDate) {
      filtered = filtered.filter(item => {if (item && item.createdAt )return new Date(item.createdAt) >= new Date(fromDate)});
    }
    if (toDate) {
      filtered = filtered.filter(item => {if (item && item.createdAt )return new Date(item.createdAt) <= new Date(toDate)});
    }

    return filtered;
  }, [data, statusFilter, typeFilter, createdByFilter, requestedByFilter, fromDate, toDate]);

  const onBtnExport = () => {
    const api = gridRef.current.api;
    const rowData = [];
    api.forEachNodeAfterFilterAndSort(node => rowData.push(node.data));

    const columns = api.getAllDisplayedColumns();
    const headers = columns.map(col => col.getColDef().headerName);
    const fields = columns.map(col => col.getColDef().field);

    const exportData = rowData.map(row => {
      const orderedRow = {};
      fields.forEach(field => {
        orderedRow[field] = row[field];
      });
      return orderedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, 'Requests.xlsx');
  };

  // const distinctValues = (field) => [...new Set(data.map(item => item[field]))];
  const distinctValues = (field) => [...new Set(data.map(item => item[field]).filter(value => value !== null && value !== undefined))];

  const handleStatusFilterClick = (status) => {
    setStatusFilter(status);
  };

  return (
    <div className="datatable-container">
      <button className="export-button button" onClick={onBtnExport}>
        Export to XLSX
      </button>

      <div className="filters">
        <div className="status-buttons">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilterClick(status)}
              className={`status-button ${  statusFilter === status? 'active' : '' }`}
            >
              {status}
            </button>
          ))}
          <button onClick={() => setStatusFilter("")} className="status-button">All Status</button>
        </div>

        <div className="filter-section">
          <label>Type of Request:</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            {typeOptions.map((option, index) => (
              <option key={index} value={option.toLowerCase()}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Created By:</label>
          <select value={createdByFilter} onChange={(e) => setCreatedByFilter(e.target.value)} className="filter-select">
            <option value="">All</option>
            {distinctValues('createdBy').map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Requested By:</label>
          <select value={requestedByFilter} onChange={(e) => setRequestedByFilter(e.target.value)} className="filter-select">
            <option value="">All</option>
            {distinctValues('requestedBy').map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="filter-input" />
        </div>

        <div className="filter-section">
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="filter-input" />
        </div>
      </div>

      <div className="ag-theme-alpine grid-container" style={{ height: 550, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={filteredData}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          defaultColDef={{
            editable: false,
            enableCellChangeFlash: true,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          suppressNoRowsOverlay={true}

        />
      </div>
    </div>
  );
};

export default DataTable;
