import React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import './TestsTable.css'; // Import CSS file for styling
import FileDownloadButton from '../FileDownloadButton/FileDownloadButton ';

const TestsTable = ({ data ,request_id}) => {
// console.log(data);
  const columns = React.useMemo(
    () => [
      { Header: 'Test ID', accessor: 'testId' },
      { Header: 'Tester Name', accessor: 'testername' },
      { Header: 'Test Date', accessor: 'testDate' },
      { Header: 'Test Results', accessor: 'testResults' },
      { Header: 'Testing Group', accessor: 'testingGroup' },
      { Header: 'Test Details', accessor: 'testDetails' },
      {
        Header: 'Download',
        accessor: 'download',
        Cell: ({ row }) => <FileDownloadButton  request_id = {request_id} testId={row.original.testId} stage={'stage3'} />, // Adjust props as per your requirement
        // <FileDownloadButton request_id={row.original.id} stage={row.original.stage} />

      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Start from the first page
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="tests-table-container">
        
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Tests"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>
      <table {...getTableProps()} className="tests-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-header">
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="table-body">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="table-row">
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()} className="table-cell">{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-container">
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="pagination-button">
          Previous
        </button>
       
        <button onClick={() => nextPage()} disabled={!canNextPage} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default TestsTable;
