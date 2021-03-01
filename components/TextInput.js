const ShortTextField = ({ props }) => {
  return (
    <div className=" flex rounded-md shadow-sm">
      <input
        type="text"
        name={props.fieldId}
        id={props.fieldId}
        className="input"
        defaultValue={props.fieldValue}
        onChange={props.handleChange}
        required={props.isRequired}
        ref={props.rhfRef}
      />
    </div>
  );
};

const LongTextField = ({ props }) => {
  return (
    <textarea
      id={props.fieldId}
      name={props.fieldId}
      rows="3"
      className="input"
      defaultValue={props.fieldValue}
      maxLength={props.maxLength}
      onChange={props.handleChange}
      required={props.isRequired}
      ref={props.rhfRef}
    />
  );
};

const TextInput = (props) => (
  // props.fieldName --> the label for the input field displayed on UI
  // props.fieldId --> the name of the field in airtable (to be used when airtable needs to be updated)
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    <label
      htmlFor={props.fieldName}
      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    >
      {props.fieldName}
      {props.isRequired ? (
        <span className="text-red-600"> *</span>
      ) : (
        <span className="text-gray-500 text-xs font-normal"> (optional)</span>
      )}
    </label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      {props.inputType === "short" ? (
        <ShortTextField props={props} />
      ) : (
        <LongTextField props={props} />
      )}
      <p className="px-1 mt-2 text-sm text-gray-500">
        {props.fieldDescription}
      </p>
    </div>
  </div>
);

export default TextInput;
