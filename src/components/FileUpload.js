import React from "react";


class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.uploadBtn = React.createRef();
  }
  handleFileChange = async (e) => {
    this.uploadBtn.current.value = "Uploading..."
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'ea20dd')


    const res = await fetch ('https://api.cloudinary.com/v1_1/sbcaus/image/upload', {
      method: 'POST',
      body: data
    })

    const file = await res.json();
    this.props.onChange(file.secure_url);
  };

  handleClick = (e) => {
    this.inputElement.click();
  };
  render() {
    return (
      <div onClick={this.handleClick}>
        <input
          ref={(input) => (this.inputElement = input)}
          type="file"
          className="hidden"
          onChange={this.handleFileChange}
          accept=".svg,.jpeg,.jpg,.png"
        />
        <input
          type="button"
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          value={this.props.currentImage ? "Change" : "Upload"}
          ref={this.uploadBtn}
        />
      </div>
    );
  }

  
}

export default FileUpload;
