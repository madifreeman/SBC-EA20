import React from "react";

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.fieldValue};

    this.handleChange = this.handleChange.bind(this);
    this.inputField = this.inputField.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // this.props.onChange(event.target.value);
  }

  inputField(props) {
    if (props.inputType === "short") {
      return (
        <div className=" flex rounded-md shadow-sm">
          <input
            type="text"
            name={this.props.fieldId}
            id={this.props.fieldId}
            value={this.state.value}
            className="input"
            onChange={this.handleChange}
            required={this.props.isRequired}
            ref={this.props.rhfRef}
          />
        </div>
      );
    } else if (props.inputType === "long") {
      return (
        <textarea
          id={this.props.fieldId}
          name={this.props.fieldId}
          rows="3"
          value={this.state.value}
          className="input"
          maxLength={props.maxLength}
          onChange={this.handleChange}
          required={this.props.isRequired}
          ref={this.props.rhfRef}
        ></textarea>
      );
    }
  }
  
  render() {
    // this.props.fieldName --> the label for the input field displayed on UI
    // this.props.fieldId --> the name of the field in airtable (to be used when airtable needs to be updated)
    return (
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor={this.props.fieldName}
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {this.props.fieldName}
          {this.props.isRequired ? <span className="text-red-600"> *</span> : <span className="text-gray-500 text-xs font-normal"> (optional)</span>}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <this.inputField
            inputType={this.props.inputType}
            fieldName={this.props.fieldName}
            maxLength={this.props.maxLength}
          />
          <p className="px-1 mt-2 text-sm text-gray-500">
            {this.props.fieldDescription}
          </p>
        </div>
      </div>
    );
  }
}

export default TextInput;
