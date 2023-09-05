import { Select, Space } from 'antd';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';


// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

export default forwardRef((props, ref) => {
    const options = props.options || []
    const defaultValue = props.defaultValue;
    const createInitialState = () => {
        let startValue;

        const eventKey = props.eventKey;

        if (eventKey === KEY_BACKSPACE) {
            // if backspace or delete pressed, we clear the cell
            startValue = '';
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

    /* Utility Methods */
    const finishedEditingPressed = (event) => {
        const key = event.key;
        return key === KEY_ENTER || key === KEY_TAB;
    };

    const onKeyDown = (event) => {
        if (!finishedEditingPressed(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    };

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
                return value > 1000000;
            },
        };
    });

    const onChangeHandler = (event) => {
        console.log('--------')
        setValue(event);
    }

    const test = (e) => {
        console.log(e.key);
        if (e.key === 'Enter') {
            e.stopPropagation() // <-- this is the trick
            onChangeHandler(e)
        }
    }

    return (
        <Space wrap>
            <Select
                ref={refInput}
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
