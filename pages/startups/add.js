import React, { useState } from "react";
import TextInput from "@/components/TextInput";
import FileUpload from "@/components/FileUpload";
import { useForm } from "react-hook-form";
import { themes } from "@/utils/themes";
import slugify from "slugify";
import { jsonFetcher } from "@/utils/jsonFetcher";
import { useRouter } from "next/router";
import { TimesIcon } from "@/public/icons";

export default function AddStartup() {
  const { register, handleSubmit } = useForm();
  const [formIds, setFormIds] = useState(["init"]);

  const router = useRouter();

  async function onSubmitStartupDetails(data) {
    // Extract team member details from data
    const teamMemberFields = ["name", "role", "twitter", "linkedIn", "image"];
    const teamMembers = formIds.map((formId) => {
      const member = {};
      teamMemberFields.forEach((field) => {
        member[field] = data[`team${formId}-${field}`];
        delete data[`team${formId}-${field}`];
      });
      return member;
    });

    data.slug = slugify(data.name).toLowerCase();

    // Add startup
    jsonFetcher("/api/startups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (result) => {
      // add team members
      teamMembers.forEach(async (teamMember) => {
        teamMember.startup = result.ref.id;
        await jsonFetcher("/api/team-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamMember),
        });
      });
      router.push(`/startups/${result.data.slug}`);
    });
  }

  const onTeamMemberDelete = (formId) => {
    let newFormIds = [...formIds];
    newFormIds = newFormIds.filter((item) => item !== formId);
    setFormIds(newFormIds);
  };

  return (
    <div className="-mt-8">
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
              Add Startup
            </h1>
          </div>
        </div>
      </div>
      <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
        <div>
          <form
            className="space-y-8 divide-y divide-gray-200 w-full"
            onSubmit={handleSubmit(onSubmitStartupDetails)}
          >
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Startup Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Please note: All startup details entered will be publicly
                    visible on our website. It may take up to 30mins for any
                    changes to propagate.
                  </p>
                </div>

                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <TextInput
                    key="name"
                    fieldName="Name"
                    fieldId="name"
                    isRequired={true}
                    inputType="short"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="City"
                    isRequired={true}
                    fieldDescription="What city is your startup primarily located in?"
                    inputType="short"
                    fieldId="city"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Country"
                    isRequired={true}
                    fieldDescription="What country is your startup primarily located in?"
                    inputType="short"
                    fieldId="country"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Short Description"
                    isRequired={true}
                    fieldDescription="Max 150 characters."
                    inputType="long"
                    maxLength="150"
                    fieldId="description"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="The Problem"
                    isRequired={true}
                    fieldDescription="What is the problem that your startup is solving? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    fieldId="problem"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="The Solution"
                    isRequired={true}
                    fieldDescription="What is your startup's solution to this problem? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    fieldId="solution"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Your Differentiator"
                    isRequired={true}
                    fieldDescription="How is your startup different to existing solutions? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    fieldId="different"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Biggest Achievment"
                    isRequired={true}
                    fieldDescription="What is your startup's biggest achievement to date? Max 500 characters."
                    inputType="long"
                    maxLength="500"
                    fieldId="achievement"
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
                    isRequired={false}
                    fieldDescription="What is the url of your startup's website?"
                    inputType="short"
                    fieldId="website"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Contact Email"
                    isRequired={false}
                    fieldDescription="What is your startup's generic email? Eg. hello@, info@"
                    inputType="short"
                    fieldId="email"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="LinkedIn"
                    isRequired={false}
                    fieldDescription="What is the url of your startup's LinkedIn profile?"
                    inputType="short"
                    fieldId="linkedIn"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Twitter"
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Twitter profile?"
                    inputType="short"
                    fieldId="twitter"
                    rhfRef={register}
                  />
                  <TextInput
                    fieldName="Facebook"
                    isRequired={false}
                    fieldDescription="What is the url of your startup's Facebook profile?"
                    inputType="short"
                    fieldId="facebook"
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
                      <div className="flex items-center">
                        <FileUpload currentImage="" rhfRef={register} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Team members
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Please note: All startup team member details entered will be
                    publicly visible on our website.
                  </p>
                </div>
                {formIds.map((formId) => {
                  return (
                    <TeamMemberForm
                      key={formId}
                      id={formId}
                      rhfRef={register}
                      onDelete={() => onTeamMemberDelete(formId)}
                    />
                  );
                })}
                <div className="flex container w-full justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const newFormIds = [...formIds];
                      newFormIds.push(Math.floor(Math.random() * 10000000));
                      setFormIds(newFormIds);
                    }}
                    className="text-sm  py-2 px-2 rounded shadow-lg font-semibold mr-2 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 w-48"
                  >
                    + Add Another Member
                  </button>
                </div>
              </div>
            </div>

            <div className="py-6">
              <input
                type="submit"
                className="block py-2 px-4 rounded shadow-lg float-right font-semibold mr-2 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 w-48"
                value="Submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const TeamMemberForm = ({ rhfRef, id, onDelete }) => {
  return (
    <div id="form" className="divide-y-0 py-2">
      <div className="sm:border-t sm:border-gray-200 sm:pt-2 sm:-mb-2 w-full">
        <button
          className="text-gray-400 font-semibold flex container justify-end"
          onClick={onDelete}
        >
          <TimesIcon />
        </button>
      </div>
      <TextInput
        fieldName="Team Member's Name"
        fieldId={`team${id}-name`}
        isRequired={true}
        inputType="short"
        rhfRef={rhfRef}
      />
      <TextInput
        fieldName="Role"
        fieldId={`team${id}-role`}
        isRequired={true}
        inputType="short"
        rhfRef={rhfRef}
      />
      <TextInput
        fieldName="Twitter"
        fieldId={`team${id}-twitter`}
        isRequired={false}
        inputType="short"
        rhfRef={rhfRef}
      />
      <TextInput
        fieldName="LinkedIn"
        fieldId={`team${id}-linkedIn`}
        isRequired={false}
        inputType="short"
        rhfRef={rhfRef}
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
            <FileUpload
              currentImage=""
              rhfRef={rhfRef}
              imageName={`team${id}-image`}
            />
          </div>
        </div>
        <input type="submit" className="hidden" value="Submit" />
      </div>
    </div>
  );
};
