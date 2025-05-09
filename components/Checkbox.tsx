// *********************
// Role of the component: Checkbox input component
// Name of the component: Checkbox.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Checkbox text={text} stateValue={stateValue} setStateValue={setStateValue} />
// Input parameters: { text: string, stateValue: any, setStateValue: any }
// Output: checkbox input with label
// *********************
import React from "react";

const Checkbox = ({
  text,
  stateValue,
  setStateValue,
}: {
  text: string;
  stateValue: any;
  setStateValue: any;
}) => {
  return (
    <div className="daisy-form-control">
      <label className="cursor-pointer flex items-center">
        <input
          type="checkbox"
          defaultChecked
          className="daisy-checkbox checkbox-warning"
        />
        <span className="daisy-label-text text-lg ml-2">{text}</span>
      </label>
    </div>
  );
};

export default Checkbox;
