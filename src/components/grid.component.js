import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
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
  // const [searchOptions, setSearchOptions] = useState();
  // const [columnDefs, setColumnDefs] = useState(createColdef());

  const createColdef = () => [
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
  ];
  const cellEditorSelector = (params) => {
    const { colDef, value } = params;
    console.log("options", gridState.searchOptions);
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
          options: gridState.searchOptions,
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
  };
  const setFocusedOnCell = useCallback(
    (colInfo) => {
      const { row, colId } = colInfo;
      gridRef.current.api.startEditingCell({ rowIndex: row, colKey: colId });
    },
    [gridRef]
  );

  const gridReducer = (state, action) => {
    if (action.type === "ADD_OPTION") {
      setTimeout(() => setFocusedOnCell(state.focusedCol), 500);
      return {
        ...state,
        columnDefs: createColdef(),
        searchOptions: [...state.searchOptions, action.data],
        isAddOption: false,
        focusedCol: null,
      };
    }
    if (action.type === "UPDATE_FOCUSED_COL") {
      return { ...state, focusedCol: action.data, isAddOption: true };
    }
    if (action.type === "REMOVED_FOCUSED_COL") {
      return { ...state, focusedCol: null, isAddOption: false };
    }
    if (action.type === "UPDATE_COLDEF") {
      return state;
    }
  };
  const [gridState, dispatchGridState] = useReducer(gridReducer, {
    columnDefs: createColdef(),
    searchOptions: [
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
    ],
    focusedCol: null,
    isAddOption: false,
  });

  // Each Column Definition results in one Column.

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
    const cells = gridRef.current.api.getEditingCells();
    console.log("cells", cells);
    setIsModalOpen(true);
    dispatchGridState({
      type: "UPDATE_FOCUSED_COL",
      data:
        cells.length > 0
          ? { row: cells[0].rowIndex, colId: cells[0].column.colId }
          : null,
    });
    stopEditing();
    console.log("No Data Found");
  });

  const addOption = (value, label) => {
    setIsModalOpen(false);
    dispatchGridState({ type: "ADD_OPTION", data: { value, label } });

    // setTimeout(() => {
    //   console.log("column", columnDefs, searchOptions, list);
    //   debugger;
    //   // gridRef.current.api.setColumnDefs(columnDefs);
    // }, 2000);
  };

  const onCellEditingStopped = useCallback(
    (param) => {
      // gridRef.current.api.ensureColumnVisible(param.column.colId);
      gridRef.current.api.setFocusedCell(param.rowIndex, param.column.colId);
    },
    [gridRef]
  );

  return (
    <div>
      {/* Example using Grid's API */}

      <button onClick={buttonListener}>Deselct Rows</button>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100vw", height: 500 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={gridState.columnDefs} // Column Defs for Columns
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
