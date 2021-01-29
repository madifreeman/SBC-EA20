import React from "react";

class TextInput extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {value: props.fieldValue};

    this.handleChange = this.handleChange.bind(this);
    this.inputField = this.inputField.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  }

  inputField(props) {
    if (props.inputType === "short") {
      return (
        <div className=" flex rounded-md shadow-sm">
          <input
            type="text"
            name={this.props.fieldName}
            id={this.props.fieldName}
            value={this.state.value}
            className="input"
            onChange={this.handleChange}
          />
        </div>
      );
    } else if (props.inputType === "long") {
      return (
        <textarea
          id={this.props.fieldName}
          name={this.props.fieldName}
          rows="3"
          value={this.state.value}
          className="input"
          maxLength={props.maxLength}
          onChange={this.handleChange}
        ></textarea>
      );
    }
  }
  
  render() {
    function Required(props) {
      if (props.isRequired) {
        return <span className="text-red-600"> *</span>;
      }
      return <span className="text-gray-500 text-xs font-normal"> (optional)</span>
    
    }
    return (
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor={this.props.fieldName}
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {this.props.fieldName}
          <Required isRequired={this.props.isRequired} />
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
