import ProfileImage from "@/components/ProfileImage";
import { useRef, useState } from "react";

const FileUpload = ({ currentImage, rhfRef, imageName }) => {
  const [file, setFile] = useState(currentImage);
  const uploadBtn = useRef(null);
  const inputElement = useRef(null);

  async function handleFileChange(e) {
    uploadBtn.current.value = "Uploading...";

    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "ea20dd");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/sbcaus/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const file = await res.json();
    setFile(file.secure_url);
  }

  return (
    <div className="flex items-center">
      <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
        <ProfileImage imageURL={file} />
      </span>
      <div onClick={() => inputElement.current.click()}>
        {/* Button displayed in UI, click triggers click of file upload below*/}
        <input
          type="button"
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          value={currentImage ? "Change" : "Upload"}
          ref={uploadBtn}
        />
        {/* Actual file input (hidden from UI) - click is trigger when above input button clicked*/}
        <input
          ref={inputElement}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".svg,.jpeg,.jpg,.png"
        />
        {/* Input which holds file url and will be submitted via "register" ref (react-hook-form) */}
        <input
          ref={rhfRef}
          name={imageName || "image"}
          value={file}
          className="hidden"
          onChange={() => console.log("File changed")}
        />
      </div>
    </div>
  );
};

export default FileUpload;
