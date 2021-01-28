import React from "react";

class FileUpload extends React.Component {
  render() {
    return (
      <div onClick={this.handleClick}>
        <input
          ref={(input) => (this.inputElement = input)}
          type="file"
          className="hidden"
          onChange={this.handleFileChange}
        />
        <button
          type="button"
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Change
        </button>
      </div>
    );
  }

  handleFileChange = (e) => {
    console.log("File changed")
    console.log(e.target.files[0])
  };

  handleClick = (e) => {
    this.inputElement.click();
  };
}

export default FileUpload;
