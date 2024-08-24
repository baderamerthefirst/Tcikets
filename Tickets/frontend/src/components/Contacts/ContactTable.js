import React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import './ContactTable.css'
import FileDownloadButton from '../FileDownloadButton/FileDownloadButton ';
const ContactTable = ({ data ,request_id}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Contact ID',
        accessor: 'contactId',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Contact Date',
        accessor: 'contactDate',
      },
      {
        Header: 'Last Modified Date',
        accessor: 'lastModifiedDate',
      },
      {
        Header: 'Contact Details',
        accessor: 'contactDetails',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Download',
        accessor: 'download',
        Cell: ({ row }) => (
          <FileDownloadButton request_id={request_id} stage={'stage2'} contactId={row.original.contactId} />
          
        ),
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
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter } = state;

  return (
    <div >
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Contacts"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-header">
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
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
      </div>  );
};

export default ContactTable;
