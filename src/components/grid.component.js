import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DatePicker from "../UI/date-picker.js";
import Dropdown from "../UI/drop-down.js";
import NumericCellEditor from "../UI/numeric-cell-editor.component.js";
import DropdownWithSearch from "../UI/select-with-search.js";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ModalBox from "../UI/modal-box.js";

const GridComponent = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [searchOptions, setSearchOptions] = useState(
    [
    {
      value: "maruti",
      label: "Maruti",
    },
    {
      value: "Honda",
      label: "honda",
    },
    {
      value: "kia",
      label: "Kia",
    },
  ]);

  const cellEditorSelector = useCallback((params) => {
  const { colDef, value } = params;
  console.log("options", searchOptions);
    if (colDef.type === "Number") {
      return {
        component: NumericCellEditor,
      };
    }

    if (colDef.type === "Select") {
      return {
        component: Dropdown,
        params: {
          defaultValue: value,
          options: [
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "Yiminghe",
              label: "yiminghe",
            },
            {
              value: "disabled",
              label: "Disabled",
              disabled: true,
            },
          ],
          stopEditing,
        },
      };
    }

    if (colDef.type === "SelectWithSearch") {
      return {
        component: DropdownWithSearch,
        params: {
          defaultValue: value,
          options: searchOptions,
          stopEditing,
          onNoDataFound,
        },
      };
    }
    if (colDef.type == "Date") {
      return {
        component: DatePicker,
        params: {
          defaultValue: null,
          stopEditing,
        },
      };
    }
    return undefined;
  },[searchOptions]);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "make",
      filter: true,
      editable: true,
      //   width: "100%",
    },
    {
      field: "model",
      filter: true,
      editable: true,
      cellEditorSelector: cellEditorSelector,
      type: "Select",
      suppressKeyboardEvent: (param) => {
        return param.editing && param.event.key === "Enter";
      },
    },
    {
      field: "price",
      cellRenderer: (param) => {
        const value = param.value;
        return <label>$ {value}</label>;
      },
      type: "Number",
      editable: true,
      cellEditorSelector: cellEditorSelector,
    },
    {
      field: "Date",
      cellRenderer: (param) => {
        const value = param.value?.toString();
        return <label>$ {value}</label>;
      },
      type: "Date",
      editable: true,
      suppressKeyboardEvent: (param) => {
        return (
          param.editing &&
          (param.event.key === "Enter" || param.event.key === "Tab")
        );
      },
      cellEditorSelector: cellEditorSelector,
    },
    {
      field: "carModel",
      filter: true,
      editable: true,
      cellEditorSelector: cellEditorSelector,
      type: "SelectWithSearch",
      suppressKeyboardEvent: (param) => {
        return (
          param.editing &&
          (param.event.key === "Enter" || param.event.key === "Tab")
        );
      },
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // Example load data from server
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  const onGridReady = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit({});
  }, []);

  const stopEditing = useCallback(() => {
    gridRef.current.api.stopEditing();
  });

  const onNoDataFound = useCallback(() => {
    // gridRef.current.api.stopEditing();
    setIsModalOpen(true);
    console.log("No Data Found");
  });

  const addOption = useCallback((value, label) => {
    debugger;
    setSearchOptions([...searchOptions, { value, label }]);
    setColumnDefs([...columnDefs]);
    setIsModalOpen(false);
  });

  const onCellEditingStopped = useCallback((param) => {
    // gridRef.current.api.ensureColumnVisible(param.column.colId);
    gridRef.current.api.setFocusedCell(param.rowIndex, param.column.colId);
  });
  return (
    <div>
      {/* Example using Grid's API */}

      <button onClick={buttonListener}>Deselct Rows</button>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100vw", height: 500 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onGridReady={onGridReady}
          onCellEditingStopped={onCellEditingStopped}
        />
        {/* onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          onCellKeyDown={onCellKeyDown} */}
      </div>
      {isModalOpen && (
        <ModalBox
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          addOption={addOption}
        />
      )}
    </div>
  );
};
export default GridComponent;
