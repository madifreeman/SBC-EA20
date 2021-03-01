import FileUpload from "@/components/FileUpload";
import TextInput from "@/components/TextInput";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import {jsonFetcher} from "@/utils/jsonFetcher";
import {q} from "@/utils/fauna";

const AddStartupForm = ({ startupId, onAdd, onCancel }) => {
  const { register, handleSubmit, reset } = useForm();
  const addButton = useRef(null);

  const onSubmit = async data => {
    data.startup = q.Ref(q.Collection("Startups"), startupId);
    addButton.current.value = "Adding...";
    addButton.current.focus();

    const result = await jsonFetcher('/api/team-members', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    
    addButton.current.value = "Add";
    addButton.current.blur();
    reset();

    const newTeamMember = result.data;
    newTeamMember.id = result.ref['@ref'].id;
    onAdd(newTeamMember) 
  }

  return (
    <div className="bg-gray-100 bg-opacity-70 rounded-lg border-2 border-gray-100 shadow-lg m-6 px-8 py-6 divide-y-0">
      <div className="font-semibold py-2">
        <h2 className="text-lg text-gray-700">Add Team Member</h2>
      </div>
      <form id="form" className="divide-y-0" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="Team Member's Name"
          fieldId="name"
          isRequired={true}
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          fieldName="Role"
          fieldId="role"
          isRequired={true}
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          fieldName="Twitter"
          fieldId="twitter"
          isRequired={false}
          inputType="short"
          rhfRef={register}
        />
        <TextInput
          fieldName="LinkedIn"
          fieldId="linkedIn"
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
            <span className="text-gray-500 text-xs font-normal"> (optional)</span>
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="flex items-center">
              <FileUpload currentImage="" rhfRef={register} />
            </div>
          </div>
        </div>
        <div className="pb-6 flex justify-end">
          <input
            ref={addButton}
            type="submit"
            className="focus:bg-gray-600 block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            value="Add"
          />
          <button
            className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => onCancel()}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStartupForm;
