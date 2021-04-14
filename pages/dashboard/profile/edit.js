import TextInput from "@/components/TextInput";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import FileUpload from "@/components/FileUpload";
import { areasOfExpertise } from "@/utils/areasOfExpertise";
import { q, client } from "@/utils/fauna";

export async function getServerSideProps() {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("mentors_by_slug"), "caitlin-ofarrell")), // TODO: edit once auth system operating
      q.Lambda("mentorRef", q.Get(q.Var("mentorRef")))
    )
  );

  const mentor = results.data[0].data;
  mentor.id = results.data[0].ref.id;
  mentor.programs = [];

  return {
    props: { mentor },
  };
}

export default function EditMentor({ mentor }) {
  const updateButtonRef = useRef(null);
  const { register, handleSubmit, watch, errors } = useForm();
  const programs = [
    "Smart Energy",
    "FinTech",
    "FoodTech",
    "Sports & EventTech",
  ];
  const timeCommitments = ["1-2 hours", "3-5 hours", "5+ hours"];
  const mentorTypes = [
    {
      name: "Advisory Mentor",
      commitment:
        "Commitment: Min 1-2 hours per week during the 3-month program",
      description:
        "Works closely with startups on a weekly basis and will often form part of the “SBC Advisory Board” for the duration of the program.",
    },
    {
      name: "Expert Mentor",
      commitment: "Commitment: Min 1-2 days per year",
      description:
        "For those who don’t have time to dedicate themselves to a particular team, we have a secondary pool of standby experts that will work with one or more startups on an ad-hoc basis.",
    },
  ];

  // TODO: Initial info will be submitted when account is set up,
  // then will need to be updated 
  async function onSubmit(data) {
    updateButtonRef.current.value = "Updating...";
    await client.query(
      q.Update(q.Ref(q.Collection("Mentors"), mentor.id), {
        data: data,
      })
    );
    updateButtonRef.current.value = "Updated!";
    setTimeout(() => (updateButtonRef.current.value = "Update"), 3000);
  }

  return (
    <div className="-mt-8">
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
              Edit Mentor Profile
            </h1>
          </div>
        </div>
      </div>
      <div className="relative container bg-white rounded shadow-lg w-full mt-8 p-8 mx-auto  justify-between">
        <form
          className="space-y-8 divide-y divide-gray-200 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Details
                </h3>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <TextInput
                  fieldName="First Name"
                  fieldId="First Name"
                  fieldValue={mentor.firstName}
                  fieldDescription="This will be publicly visible on our website."
                  isRequired={true}
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Last Name"
                  fieldId="Last Name"
                  fieldValue={mentor.lastName}
                  isRequired={true}
                  fieldDescription="This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Email Address"
                  fieldId="Email"
                  fieldValue={mentor.email}
                  isRequired={true}
                  fieldDescription="We recommend using a personal email so that we don't lose touch if you move company. This will not be made public and will only be used by SBC to contact you when needed."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Mobile"
                  fieldId="Phone"
                  fieldValue={mentor.phone}
                  isRequired={false}
                  fieldDescription="This will not be made public and will only be used by SBC to contact you when needed."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Company"
                  fieldId="Company"
                  fieldValue={mentor.company}
                  isRequired={true}
                  fieldDescription="Where do you work? This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Job Title"
                  fieldId="Role"
                  fieldValue={mentor.role}
                  isRequired={true}
                  fieldDescription="What is your current role? This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="City"
                  fieldId="City"
                  fieldValue={mentor.city}
                  isRequired={true}
                  fieldDescription="What city do you live in? Eg. Melbourne, Sydney, etc. This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Country"
                  fieldId="Country"
                  fieldValue={mentor.country}
                  isRequired={true}
                  fieldDescription="What country do you live in? This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Dietary Requirements"
                  fieldId="Dietary"
                  fieldValue={mentor.dietary}
                  isRequired={false}
                  fieldDescription="Used for internal purposes only."
                  inputType="long"
                  rhfRef={register}
                />
              </div>

              <div>
                <h3 className="mt-12 text-lg leading-6 font-medium text-gray-900">
                  Mentor Details
                </h3>
              </div>
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 sm:divide-y divide-gray-200">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Programs
                    <span className="text-red-600"> *</span>
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <fieldset>
                      {programs.map((program) => {
                        return (
                          <div className="mt-1" key={program}>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-teal-500 cursor-pointer form-checkbox"
                                name="Programs"
                                value={program}
                                defaultChecked={
                                  mentor.programs.includes(program)
                                    ? true
                                    : false
                                }
                                ref={register}
                              />
                              <span className="ml-3 text-sm">{program}</span>
                            </label>
                          </div>
                        );
                      })}
                    </fieldset>
                    <p className="px-1 mt-2 text-sm text-gray-500">
                      For which SBC Australia programs are you interested in
                      being a mentor? This will be publicly visible on our
                      website.
                    </p>
                  </div>
                </div>

                <fieldset className="pt-6 sm:pt-5">
                  <div role="group">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <label
                          htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mentor Type
                          <span className="text-red-600"> *</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <div>
                          {mentorTypes.map((type) => {
                            return (
                              <div className="my-2 space-y-4" key={type.name}>
                                <div className="flex items-center">
                                  <label className="flex inline items-center">
                                    <input
                                      name="Mentor Type"
                                      type="radio"
                                      className=" cursor-pointer focus:ring-indigo-500 text-indigo-600 border-gray-300"
                                      ref={register}
                                      value={type.name}
                                    />

                                    <span className="ml-3 cursor-pointer">
                                      <div className="p-6 border border-gray-200 hover:bg-teal-100 hover:border-teal-200 rounded-lg ">
                                        <p className="text-sm font-semibold">
                                          {type.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {type.commitment}
                                        </p>
                                        <p className="pt-2 text-sm">
                                          {type.description}
                                        </p>
                                      </div>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            );
                          })}

                          <p className="text-sm text-gray-500">
                            What type of mentor would you like to be? This will
                            be publicly visible on our website.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="pt-6 sm:pt-5">
                  <div role="group">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <label
                          // htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time commitment
                          <span className="text-red-600"> *</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <div>
                          {timeCommitments.map((time) => {
                            return (
                              <div className="my-2 space-y-4" key={time}>
                                <div className="flex items-center">
                                  <input
                                    name="Time Commitment"
                                    type="radio"
                                    className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                    ref={register}
                                    value={time}
                                  />
                                  <label
                                    htmlFor={time}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    {time}
                                  </label>
                                </div>
                              </div>
                            );
                          })}

                          <p className="text-sm text-gray-500">
                            How much time are you able to dedicate to startups
                            on a monthly basis? Used for internal purposes only.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <div role="group">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Areas of Expertise
                          <span className="text-gray-500 text-xs font-normal">
                            {" "}
                            (optional)
                          </span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="block w-full mt-1 h-64 overflow-y-scroll grid grid-flow-row lg:grid-cols-2 xl:grid-cols-3 form-multiselect rounded border-2 border-gray-200 px-2 mt-2">
                          {areasOfExpertise.map((area) => {
                            return (
                              <div className="mt-1" key={area}>
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-teal-500 cursor-pointer form-checkbox"
                                    name="Expertise[]"
                                    value={area}
                                    ref={register}
                                  />
                                  <span className="ml-3 text-sm">{area}</span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <TextInput
                  fieldName="Biography"
                  fieldId="Bio Fix"
                  fieldValue={mentor.bio}
                  isRequired={false}
                  fieldDescription="This will be publicly visible on our website. Max 500 words."
                  maxLength="500"
                  inputType="long"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="LinkedIn Profile"
                  fieldId="LinkedIn"
                  fieldValue={mentor.linkedIn}
                  isRequired={false}
                  fieldDescription="This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <TextInput
                  fieldName="Twitter Profile"
                  fieldId="Twitter"
                  fieldValue={mentor.twitter}
                  isRequired={false}
                  fieldDescription="This will be publicly visible on our website."
                  inputType="short"
                  rhfRef={register}
                />
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Photo
                    <span className="text-gray-500 text-xs font-normal">
                      {" "}
                      (optional)
                    </span>
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <FileUpload currentImage={mentor.photo} rhfRef={register} />
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
      </div>
    </div>
  );
}
