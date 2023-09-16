import { Button, Select, Space } from "antd";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// backspace starts the editor on Windows
const KEY_BACKSPACE = "Backspace";

export default forwardRef((props, ref) => {
  const options = props.options || [];
  const defaultValue = props.defaultValue;
  const stopEditing = props.stopEditing;
  const onNoDataFound = props.onNoDataFound;
  const createInitialState = () => {
    let startValue;

    const eventKey = props.eventKey;

    if (eventKey === KEY_BACKSPACE) {
      // if backspace or delete pressed, we clear the cell
      startValue = "";
    } else if (eventKey && eventKey.length === 1) {
      // if a letter was pressed, we start with the letter
      startValue = eventKey;
    } else {
      // otherwise we start with the current value
      startValue = props.value;
    }

    return {
      value: startValue,
    };
  };

  const initialState = createInitialState();
  const [value, setValue] = useState(initialState.value);
  const refInput = useRef(null);

  // focus on the input
  useEffect(() => {
    // get ref from React component
    window.setTimeout(() => {
      const eInput = refInput.current;
      eInput.focus();
    });
  }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        // will reject the number if it greater than 1,000,000
        // not very practical, but demonstrates the method.
        return false;
      },
    };
  });

  const onChangeHandler = useCallback((event) => {
    setValue(event);
    setTimeout(() => {
      stopEditing();
    }, 100);
  });

  return (
    <Space wrap>
      <Select
        ref={refInput}
        showSearch
        notFoundContent={(() => {
          return (
            <Button
              onKeyDown={(e) => {
                if (e.key === "Enter") onNoDataFound();
              }}
              onClick={() => onNoDataFound()}
              type="text"
              block
            >
              No Data Found
            </Button>
          );
        })()}
        defaultValue={defaultValue}
        style={{
          width: 120,
        }}
        onChange={onChangeHandler}
        options={options}
      />
    </Space>
  );
});
