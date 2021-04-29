import { useForm } from "react-hook-form";
import { categories } from "@/utils/feedbackCategories";
import FeedbackSlider from "@/components/FeedbackSlider";
import { jsonFetcher } from "@/utils/jsonFetcher";
import { useRouter } from "next/router";

const SectionHeading = ({ heading, description }) => (
  <div className="border-b-4 border-gray-200">
    <h2 className="pt-4 pb-4 text-xl font-semibold text-gray-700">
      {heading}

      {description ? (
        <p className="py-2 font-normal text-sm">{description}</p>
      ) : null}
    </h2>
  </div>
);

const FieldTitle = ({ fieldName, required }) => (
  <span className="font-semibold text-base text-gray-700">
    {fieldName}
    {required ? (
      <span className="text-red-600"> *</span>
    ) : (
      <span className="text-gray-500 text-xs font-normal"> (optional)</span>
    )}
  </span>
);

const RadioButtonsField = (props) => (
  <fieldset className="my-6" name={props.fieldName}>
    <FieldTitle fieldName={props.fieldName} required={props.required} />
    {props.options.map((option) => {
      return (
        <div className="mt-2 ml-3" key={option.value}>
          <label className="inline-flex items-center cursor-pointer">
            <input
              className="w-4 h-4 text-teal-500 cursor-pointer form-radio"
              type="radio"
              defaultChecked={props.defaultValue === option.value}
              value={option.value}
              name={props.fieldId}
              ref={props.rhfRef}
            />
            <span className="ml-3 font-light">{option.label}</span>
          </label>
        </div>
      );
    })}
  </fieldset>
);

const LongTextField = (props) => (
  <div className="my-6">
    <FieldTitle fieldName={props.fieldName} required={props.required} />
    <textarea
      className="mt-2 inline-block w-full px-2 py-1 bg-white border-2 border-gray-200 rounded-sm"
      rows={4}
      name={props.fieldId}
      ref={props.rhfRef}
      defaultValue={props.defaultValue}
    />
  </div>
);

const SliderField = (props) => (
  <div className="my-6">
    <FieldTitle fieldName={props.fieldName} required={props.required} />
    <div className="w-full mt-10 px-2 py-2">
      <FeedbackSlider
        rhfRef={props.rhfRef}
        rhfSetValue={props.rhfSetValue}
        fieldId={props.fieldId}
        defaultValue={props.defaultValue}
      />
      <div className="pt-4 flex justify-between font-semibold text-gray-600">
        <small>{props.minName}</small>
        <small>{props.maxName}</small>
      </div>
    </div>
  </div>
);

const SelectStartupDropdown = ({ startups, rhfRef }) => (
  <div className="my-6">
    <FieldTitle
      fieldName="What startup do you want to leave feedback for?"
      required
    />
    <button className="w-full mt-2 px-2 py-2 border border-gray rounded">
      <select
        className="block w-full mt-1 form-select text-gray-700 focus:outline-none"
        name="startup"
        ref={rhfRef}
        required
      >
        <option value="">Please choose a startup</option>
        {Object.keys(startups).map((key) => (
          <option
            value={startups[key]._id}
            key={key}
            disabled={startups[key].feedbackSubmitted}
          >
            {startups[key].name}
          </option>
        ))}
      </select>
    </button>
    <p className="mt-2 p-1 text-gray-700 text-sm">
      Note: Startups that you have already rated have been disabled to prevent
      duplicate feedback.
    </p>
  </div>
);

export default function FeedbackForm({ defaultValues, mentorId, startups }) {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  console.log(startups);

  async function onSubmit(data) {
    categories.forEach((category) => {
      // parse number fields from string to int

      // If a score hasn't been selected, default back to the score previously
      // submitted (if there is one) or else default to 0
      if (data[category]) {
        data[category] = parseInt(data[category]);
      } else if (defaultValues[category]) {
        data[category] = defaultValues[category];
      } else data[category] = 0;
    });

    data.feedbackId = defaultValues.id;

    if (data.feedbackId) {
      // If feedback has been previously submitted
      await jsonFetcher("/api/feedback-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // Add references to Sanity data
      data.mentor = mentorId;
      data.cohort = startups[data.startupId].cohortId;

      // Send to Fauna
      await jsonFetcher("/api/feedback-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    router.push("/dashboard");
  }
  return (
    <form className="pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-4">
        <SectionHeading heading="Team & Ability" />
        {startups ? (
          <SelectStartupDropdown startups={startups} rhfRef={register} />
        ) : null}
        <SliderField
          fieldName="Does the team have in-depth industry knowledge?"
          fieldId="knowledge"
          minName="Little Knowledge"
          maxName="Very Knowledgeable"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.knowledge}
        />
        <SliderField
          fieldName="Does the team have the passion and vision to make their idea successful?"
          fieldId="passion"
          minName="Low passion"
          maxName="High passion"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.passion}
        />
        <SliderField
          fieldName="Does this team have the ability to deliver their idea?"
          fieldId="ability"
          minName="Low ability"
          maxName="High ability"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.ability}
        />
      </div>

      <div className="pt-8">
        <SectionHeading heading="Market & Product" />
        <SliderField
          fieldName="How big is the teams potential market?"
          fieldId="market"
          minName="Local Scale"
          maxName="Global Scale"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.market}
        />
        <SliderField
          fieldName="Is the market competitive?"
          fieldId="competitive"
          minName="Many competitors"
          maxName="No competitors"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.competitive}
        />
        <RadioButtonsField
          fieldName="What do you think of this team's product or service?"
          fieldId="product"
          options={[
            { label: "Very good", value: 10 },
            { label: "Average", value: 5 },
            { label: "Weak", value: 0 },
          ]}
          required={true}
          defaultValue={defaultValues.product}
          rhfRef={register}
        />
      </div>

      <div className="pt-8">
        <SectionHeading heading="Execution Power" />
        <SliderField
          fieldName="How much market traction does the team have?"
          fieldId="traction"
          minName="No users/customers"
          maxName="Paying users/customers"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.traction}
        />
        <SliderField
          fieldName="How strong is the team's branding and story?"
          fieldId="marketing"
          minName="Very Weak"
          maxName="Very Strong"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.marketing}
        />
        <SliderField
          fieldName="How strong is the team's presentation skills?"
          fieldId="presentation"
          minName="Very Weak"
          maxName="Very Strong"
          rhfRef={register}
          rhfSetValue={setValue}
          required={true}
          defaultValue={defaultValues.presentation}
        />
      </div>

      <div className="pt-8">
        <SectionHeading heading="Strategic & Funding" />
        <RadioButtonsField
          fieldName="Would you invest in this startup?"
          fieldId="invest"
          options={[
            {
              label: "Yes, I'd like to discuss potential investment",
              value: "Yes",
            },
            {
              label: "Yes, if I had the money available",
              value: "Maybe",
            },
            { label: "No", value: "No" },
          ]}
          required={true}
          rhfRef={register}
          defaultValue={defaultValues.invest}
        />
        <RadioButtonsField
          fieldName="Do you want to mentor this startup during the upcoming program?"
          fieldId="mentoring"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          required={true}
          rhfRef={register}
          defaultValue={defaultValues.mentoring}
        />
        <LongTextField
          fieldName="Are there any companies and/or people you'd like to connect this startup with?"
          fieldId="connect"
          required={false}
          rhfRef={register}
          defaultValue={defaultValues.connect}
        />
      </div>

      <div className="pt-8">
        <SectionHeading heading="Feedback" />
        <LongTextField
          fieldName="Do you have any comments you'd like to share with the startup?"
          fieldId="comments"
          required={false}
          rhfRef={register}
          defaultValue={defaultValues.comments}
        />
        <RadioButtonsField
          fieldName="Your above feedback will be shared with the startup. Would you like to make it anonymous?"
          fieldId="anonymous"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          required={true}
          rhfRef={register}
          defaultValue={defaultValues.anonymous}
        />
      </div>

      <div className="pt-8">
        <SectionHeading
          heading="Concerns"
          description="The information you enter below will remain private and WILL NOT be shared with the startup."
        />
        <LongTextField
          fieldName="Did this startup raise any red flags with you? If so, please explain?"
          fieldId="concerns"
          required={false}
          rhfRef={register}
          defaultValue={defaultValues.concerns}
        />
      </div>

      <input
        type="submit"
        className="block px-8 py-3 mt-16 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-md cursor-pointer hover:bg-teal-600 hover:shadow-lg"
        value="Submit"
      />
    </form>
  );
}
