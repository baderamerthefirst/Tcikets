import React, { useEffect, useRef, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FileDownloadButton2 from "../FileDownloadButton2/FileDownloadButton2 ";
import { useSelectedFileRequestContext } from "../SelectedFileRequestContext/SelectedFileRequestContext";
import * as XLSX from 'xlsx';
import { useAuth } from "../AuthContext/AuthContext";

const FileRequestsTable = ({ rowData, error }) => {
  const {role,user} = useAuth();

  const { setAll } = useSelectedFileRequestContext();
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const gridRef = useRef(null);

  const statusOptions = [
    "Pending",
   
    "Resolved",
    "Rejected",
  ];

  useEffect(() => {
    setFilteredData(rowData);
  }, [rowData]);

  const columnDefs = [
    { headerName: "ID", field: "request_id", width: 100 },
    { headerName: "Request Name", field: "request_name" },
    { headerName: "Username", field: "username", width: 155 },
    { headerName: "Date Created", field: "date_created" },
    { headerName: "Type of Request", field: "type_of_request" },
    { headerName: "Status", field: "status" },
    { headerName: "Last Modified Date", field: "last_modified_date" },
    { headerName: "Request Details", field: "request_details" },
    {
      headerName: "",
      width: 150,
      field: "actions",
      cellRenderer: (params) => {
        const { request_id, file_path } = params.data;
        if (file_path) return <FileDownloadButton2 request_id={request_id} />;
      },
    },
    {
      headerName: "",
      width: 150,
      field: "actions",
      cellRenderer: (params) => {
        const {
          request_id,
          request_name,
          type_of_request,
          request_details,
          status,
          username
        } = params.data;
        return (
          (role==='DBA' || user===username)  &&<button
            className="updateButton"
            onClick={() => {
              console.log(role,user)
              if (role==='DBA'  || user===username) 
              setAll(
                request_id,
                request_name,
                type_of_request,
                request_details,
                status,
                username
              );
              console.log(params.data);
            }}
          >
            Update
          </button>
        );
      },
    },
  ];

  const distinctValues = (field) => [...new Set(rowData.map(item => item[field]).filter(value => value !== null && value !== undefined))];

  const filteredRowData = useMemo(() => {
    let filtered = rowData;

    if (statusFilter) {
      filtered = filtered.filter(item => { if (item && item.status ) return item.status && item.status.trim().toLowerCase() === statusFilter.toLowerCase()} );
    }
    if (typeFilter) {
      filtered = filtered.filter(item => { if (item && item.type_of_request ) return item.type_of_request && item.type_of_request.trim().toLowerCase() === typeFilter.toLowerCase()});
    }
    if (usernameFilter) {
      filtered = filtered.filter(item =>{  if (item && item.username ) return item.username && item.username.trim().toLowerCase() === usernameFilter.toLowerCase()});
    }
    if (fromDate) {
      filtered = filtered.filter(item => { if (item && item.date_created ) return item.date_created && new Date(item.date_created) >= new Date(fromDate)});
    }
    if (toDate) {
      filtered = filtered.filter(item =>{ if (item && item.date_created ) return item.date_created && new Date(item.date_created) <= new Date(toDate)});
    }

    return filtered;
  }, [rowData, statusFilter, typeFilter, usernameFilter, fromDate, toDate]);

  const onBtnExport = () => {
    const api = gridRef.current.api;
    const columnApi = gridRef.current.columnApi;
    
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'File Requests');
    XLSX.writeFile(workbook, 'File Requests.xlsx');
  };

  return (
    <>
      <button className='export-button button' onClick={onBtnExport}>Export to XLSX</button>

      <div className="filters">
        <div className="status-buttons">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`status-button ${statusFilter === status ? 'active': ''}`}
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
            {distinctValues('type_of_request').map((option, index) => (
              <option key={index} value={option.toLowerCase()}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Username:</label>
          <select value={usernameFilter} onChange={(e) => setUsernameFilter(e.target.value)} className="filter-select">
            <option value="">All</option>
            {distinctValues('username').map((option, index) => (
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

      <div className="ag-theme-alpine grid-container" style={{ height: "550px", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRowData}
          columnDefs={columnDefs}
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
        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
};

export default FileRequestsTable;
