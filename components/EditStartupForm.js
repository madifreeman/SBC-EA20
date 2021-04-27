import TextInput from "@/components/TextInput";
import FileUpload from "@/components/FileUpload";
import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { themes } from "@/utils/themes"
import { jsonFetcher } from "@/utils/jsonFetcher"
import urlFor from "@/utils/imageUrlBuilder";

const EditStartupForm = ({ startup }) => {
  const { register, handleSubmit } = useForm();
  const updateButtonRef = useRef(null);

  async function onSubmit(data) {
    updateButtonRef.current.value = "Updating...";

    const image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: data.image,
      },
    }

    const body = {
      id: startup._id,
      set: {
        ...data,
        image: image
      },
    };

    // Send changes to fauna
    const results = await jsonFetcher(`/api/startups/${startup._id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    // console.log(results);

    // Update UI to indicate success
    // TODO: Indicate failure
    updateButtonRef.current.value = "Updated!";
    setTimeout(() => (updateButtonRef.current.value = "Update"), 3000);
  }

  return (
    <form
      className="space-y-8 divide-y divide-gray-200 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Startup Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please note: All startup and team member details entered will be
              publicly visible on our website. It may take up to 30mins for any
              changes to propagate.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <TextInput
              fieldName="Name"
              fieldId="name"
              fieldValue={startup.name}
              isRequired={true}
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="City"
              fieldId="city"
              fieldValue={startup.city}
              isRequired={true}
              fieldDescription="What city is your startup primarily located in?"
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="Country"
              fieldId="country"
              fieldValue={startup.country}
              isRequired={true}
              fieldDescription="What country is your startup primarily located in?"
              inputType="short"
              onChange={(updated) => this.handleInputChange(updated, "country")}
              rhfRef={register}
            />
            <TextInput
              fieldName="Short Description"
              fieldId="description"
              fieldValue={startup.description}
              isRequired={true}
              fieldDescription="Max 150 characters."
              inputType="long"
              maxLength="150"
              rhfRef={register}
            />
            <TextInput
              fieldName="The Problem"
              fieldId="problem"
              fieldValue={startup.problem}
              isRequired={true}
              fieldDescription="What is the problem that your startup is solving? Max 500 characters."
              inputType="long"
              maxLength="500"
              rhfRef={register}
            />
            <TextInput
              fieldName="The Solution"
              fieldId="solution"
              fieldValue={startup.solution}
              isRequired={true}
              fieldDescription="What is your startup's solution to this problem? Max 500 characters."
              inputType="long"
              maxLength="500"
              rhfRef={register}
            />
            <TextInput
              fieldName="Your Differentiator"
              fieldId="different"
              fieldValue={startup.different}
              isRequired={true}
              fieldDescription="How is your startup different to existing solutions? Max 500 characters."
              inputType="long"
              maxLength="500"
              rhfRef={register}
            />
            <TextInput
              fieldName="Biggest Achievment"
              fieldId="achievement"
              fieldValue={startup.achievement}
              isRequired={true}
              fieldDescription="What is your startup's biggest achievement to date? Max 500 characters."
              inputType="long"
              maxLength="500"
              rhfRef={register}
            />

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Focus Areas
                <span className="text-gray-500 text-xs font-normal">
                  {" "}
                  (optional)
                </span>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <fieldset>
                  {themes.map((theme) => {
                    return (
                      <div className="mt-1" key={theme}>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-teal-500 cursor-pointer form-checkbox"
                            name="themes"
                            value={theme}
                            defaultChecked={
                              startup.themes.includes(theme) ? true : false
                            }
                            ref={register}
                          />
                          <span className="ml-3 text-sm">{theme}</span>
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
              </div>
            </div>
            <TextInput
              fieldName="Website"
              fieldId="website"
              fieldValue={startup.website}
              isRequired={false}
              fieldDescription="What is the url of your startup's website?"
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="Contact Email"
              fieldId="email"
              fieldValue={startup.email}
              isRequired={false}
              fieldDescription="What is your startup's generic email? Eg. hello@, info@"
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="LinkedIn"
              fieldId="linkedIn"
              fieldValue={startup.linkedIn}
              isRequired={false}
              fieldDescription="What is the url of your startup's LinkedIn profile?"
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="Twitter"
              fieldId="twitter"
              fieldValue={startup.twitter}
              isRequired={false}
              fieldDescription="What is the url of your startup's Twitter profile?"
              inputType="short"
              rhfRef={register}
            />
            <TextInput
              fieldName="Facebook"
              fieldId="facebook"
              fieldValue={startup.facebook}
              isRequired={false}
              fieldDescription="What is the url of your startup's Facebook profile?"
              inputType="short"
              rhfRef={register}
            />
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Logo
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <FileUpload currentImage={startup.image} rhfRef={register} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <input
          type="submit"
          className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 w-48"
          value="Update"
          ref={updateButtonRef}
        />
      </div>
    </form>
  );
};

export default EditStartupForm;
