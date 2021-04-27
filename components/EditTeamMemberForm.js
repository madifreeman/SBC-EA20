import FileUpload from "@/components/FileUpload";
import TextInput from "@/components/TextInput";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { q, client } from "@/utils/fauna";
import { jsonFetcher } from "@/utils/jsonFetcher";

const EditTeamMemberForm = ({
  _id,
  name,
  role,
  twitter,
  linkedIn,
  image,
  onDelete,
}) => {
  const { register, handleSubmit } = useForm();
  const updateButton = useRef(null);
  const deleteButton = useRef(null);
  async function onSubmit(data) {
    updateButton.current.value = "Updating...";

    const image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: data.image,
      },
    }

    const body = {
      id: _id,
      set: {
        ...data,
        image: image
      },
    };

    // // Send changes to Fauna
    const results = await jsonFetcher(`/api/team-members/${_id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    // Update UI to indicate success
    // TODO: Indicate failure
    updateButton.current.value = "Updated!";
    updateButton.current.focus();
    setTimeout(() => {
      updateButton.current.value = "Update";
      updateButton.current.blur();
    }, 2500);
  }

  async function handleDelete() {
    // Change UI
    deleteButton.current.focus();
    onDelete(_id);
    // TODO: Add animation or alert to more clearly indicate
    // team member has been deleted
  }

  return (
    <form className="divide-y-0" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        fieldName="Team Member's Name"
        fieldId="name"
        fieldValue={name}
        isRequired={true}
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="Role"
        fieldId="role"
        fieldValue={role}
        isRequired={true}
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="Twitter"
        fieldId="twitter"
        fieldValue={twitter}
        isRequired={false}
        inputType="short"
        rhfRef={register}
      />
      <TextInput
        fieldName="LinkedIn"
        fieldId="linkedIn"
        fieldValue={linkedIn}
        isRequired={false}
        inputType="short"
        rhfRef={register}
      />
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700"
        >
          Photo
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="flex items-center">
            <FileUpload currentImage={image} rhfRef={register} />
          </div>
        </div>
      </div>
      <div className="pb-6 flex justify-end">
        <input
          type="submit"
          className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          value="Update"
          ref={updateButton}
        />
        <button
          className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
          onClick={() => handleDelete()}
          type="button"
          ref={deleteButton}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default EditTeamMemberForm;
