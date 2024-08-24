import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as XLSX from "xlsx";
import axios from "axios";
import "./UserTable.css"; // Assuming you have a CSS file for styling
import { useAuth } from "../AuthContext/AuthContext";
import { accessToken } from "../AccessToken/AccessToken";

const UserTable = ({ rowData, error, refreshData }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const gridRef = useRef(null); // Reference to the grid
  const { user_id,role } = useAuth();

  useEffect(() => {
    filterData();
  }, [rowData, selectedStatus]);

  const filterData = () => {
    if (selectedStatus === "All" || selectedStatus === null) {
      setFilteredData(rowData);
    } else {
      const filtered = rowData.filter((row) => row.status === selectedStatus);
      setFilteredData(filtered);
    }
  };

  const columnDefs = [
    { headerName: "User ID", field: "user_id" },
    { headerName: "Username", field: "username" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "status" },
    {
      headerName: "",
      field: "actions",
      cellRenderer: (params) =>{ if (role==='DBA' ||(role ==='Admin' && params.data.role !=='DBA') ) return (
        <div>
          {params.data.status === "inactive" &&
            params.data.user_id !== user_id && (
              <button
                className="button activate"
                onClick={() => handleUserStatus(params.data.user_id, "active")}
              >
                Activate
              </button>
            )}
        </div>
      )},
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: (params) => { if (role==='DBA' ||(role ==='Admin' && params.data.role !=='DBA') ) return(
        <div>
          {params.data.status === "active" &&
            params.data.user_id !== user_id && (
              <button
                className="button deactivate"
                onClick={() =>
                  handleUserStatus(params.data.user_id, "inactive")
                }
              >
                Deactivate
              </button>
            )}
        </div>
      )},
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: (params) => { if (role==='DBA' ||(role ==='Admin' && params.data.role !=='DBA') ) return(
        <div>
          <button
            className="button reset"
            onClick={() => handleResetPassword(params.data.user_id)}
          >
            Reset Password
          </button>
        </div>
      )},
    },
  ];

  const handleUserStatus = async (userId, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        status === "active" ? "activate" : "deactivate"
      } this user?`
    );
    if (confirmAction) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/users/status`,
          {
            userId,
            status,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        refreshData(); // Refresh data after status change
      } catch (error) {
        console.error(
          `Error ${status === "active" ? "activating" : "deactivating"} user:`,
          error
        );
      }
    }
  };

  const handleResetPassword = async (userId) => {
    const confirmAction = window.confirm(
      "Are you sure you want to reset the password for this user?"
    );
    if (confirmAction) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/users/rpsw`,
          {
            userId,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        refreshData(); // Refresh data after password reset
      } catch (error) {
        console.error("Error resetting password:", error);
      }
    }
  };

  const onBtnExport = () => {
    const api = gridRef.current.api;
    const columnApi = gridRef.current.columnApi;

    const rowData = [];
    api.forEachNodeAfterFilterAndSort((node) => rowData.push(node.data));

    // Get the current column order
    const columns = columnApi.getAllDisplayedColumns();
    const headers = columns.map((col) => col.getColDef().headerName);
    const fields = columns.map((col) => col.getColDef().field);

    // Create data array for export with correct column order
    const exportData = rowData.map((row) => {
      const orderedRow = {};
      fields.forEach((field) => {
        orderedRow[field] = row[field];
      });
      return orderedRow;
    });

    // Create worksheet with ordered headers
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="All">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button className="export-button button" onClick={onBtnExport}>
        Export to XLSX
      </button>
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          suppressNoRowsOverlay={true}
          defaultColDef={{
            editable: false,
            enableCellChangeFlash: true,
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default UserTable;
