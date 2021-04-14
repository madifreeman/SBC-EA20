import { useForm } from "react-hook-form";
import FeedbackSlider from "@/components/FeedbackSlider";
import { q, client } from "@/utils/fauna";
import { jsonFetcher } from "@/utils/jsonFetcher";
import { useRouter } from "next/router";
import { categories } from "@/utils/feedbackCategories";

export async function getServerSideProps({query}) {
  const results = await client.query(
    q.Let(
      {
        startupDoc: q.Get(q.Match(q.Index("startups_by_slug"), query.startup)),
        mentorDoc: q.Get(q.Match(q.Index("mentors_by_slug"), "caitlin-ofarrell")), //TODO: Edit once auth system operating
      },
      {
        startup: {
          id: q.Select(["ref", "id"], q.Var("startupDoc")),
          name: q.Select(["data", "name"], q.Var("startupDoc")),
          image: q.Select(["data", "image"], q.Var("startupDoc")),
          slug: q.Select(["data", "slug"], q.Var("startupDoc")),
          city: q.Select(["data", "city"], q.Var("startupDoc")),
          country: q.Select(["data", "country"], q.Var("startupDoc")),
          description: q.Select(["data", "description"], q.Var("startupDoc")),
        },
        mentor: {
          id: q.Select(["ref", "id"], q.Var("mentorDoc")),
          slug: q.Select(["data", "slug"], q.Var("mentorDoc")),
        },
        scores: q.Select(
          ["data"],
          q.Map(
            q.Paginate(
              q.Match(
                q.Index("feedback_by_mentor_and_startup"),
                // mentor ref
                q.Select(["ref"], q.Var("mentorDoc")),
                // startup ref
                q.Select(["ref"], q.Var("startupDoc"))
              )
            ),
            q.Lambda(
              "feedbackRef",
              q.Get(q.Var("feedbackRef"))
            )
          )
        ),
      }
    )
  );

  const { startup, mentor } = results;
  console.log(results)

  const scores = results.scores[0] ? results.scores[0].data : {};
  
  
  if (Object.keys(scores).length > 0) {
    // Fauna refs cause error serializing when being parsed as props, so delete
    scores.id = results.scores[0].ref.id;
    delete scores.mentor;
    delete scores.startup;
  }

  return {
    props: { startup, scores, mentor },
  };
}

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

const RadioButtonsField = props => (
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

const LongTextField = props => (
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

export default function LeaveFeedback({ startup, mentor, scores }) {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  console.log(scores)

  async function onSubmit(data) {
    // parse number fields from string to int
    categories.forEach((category) => {
      // If a score hasn't been selected, default back to the score previously
      // submitted (if there is one) or else default to 0
      if (data[category]) {
        data[category] = parseInt(data[category]);
      } else if (scores[category]) {
        data[category] = scores[category];
      } else data[category] = 0;
    });

    data.startup = startup.id;
    data.mentor = mentor.id;
    data.feedbackId = scores.id;

    if (scores) {
      await jsonFetcher("/api/feedback-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
    } else {
      await jsonFetcher("/api/feedback-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    

    router.push("/account");
  }

  return (
    <div className="-mt-8">
      <div className="relative px-4 pb-2 xs:px-8">
        <div className="container mx-auto ">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-2/5 xl:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center md:flex-nowrap lg:flex-wrap md:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto border-2 border-gray-200 rounded-full md:mx-0 lg:mx-auto"
                    src={startup.image}
                  />

                  <div className="w-full pt-4 pl-0 mx-auto md:w-auto lg:w-full md:mx-0 lg:mx-auto md:pl-8 lg:pl-0 md:pt-0 lg:pt-4">
                    <h1 className="text-2xl font-semibold">{startup.name}</h1>
                    <p className="text-gray-500 text-xl">
                      {startup.city + ", " + startup.country}
                    </p>
                    <p className="pt-4">{startup.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 xl:w-2/3">
              <div className="px-3 pt-8 lg:pt-0">
                <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                  <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
                    Leave feedback for {startup.name}
                  </h1>
                  <p className="pt-4">
                    The information you enter below will be shared with the
                    startup. If you like, you will have the option to anonymise
                    your feedback at the end of the form.
                  </p>
                  <form className="pt-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="pt-4">
                      <SectionHeading heading="Team & Ability" />
                      <SliderField
                        fieldName="Does the team have in-depth industry knowledge?"
                        fieldId="knowledge"
                        minName="Little Knowledge"
                        maxName="Very Knowledgeable"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.knowledge}
                      />
                      <SliderField
                        fieldName="Does the team have the passion and vision to make their idea successful?"
                        fieldId="passion"
                        minName="Low passion"
                        maxName="High passion"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.passion}
                      />
                      <SliderField
                        fieldName="Does this team have the ability to deliver their idea?"
                        fieldId="ability"
                        minName="Low ability"
                        maxName="High ability"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.ability}
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
                        defaultValue={scores.market}
                      />
                      <SliderField
                        fieldName="Is the market competitive?"
                        fieldId="competitive"
                        minName="Many competitors"
                        maxName="No competitors"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.competitive}
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
                        defaultValue={scores.product}
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
                        defaultValue={scores.traction}
                      />
                      <SliderField
                        fieldName="How strong is the team's branding and story?"
                        fieldId="marketing"
                        minName="Very Weak"
                        maxName="Very Strong"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.marketing}
                      />
                      <SliderField
                        fieldName="How strong is the team's presentation skills?"
                        fieldId="presentation"
                        minName="Very Weak"
                        maxName="Very Strong"
                        rhfRef={register}
                        rhfSetValue={setValue}
                        required={true}
                        defaultValue={scores.presentation}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Strategic & Funding" />
                      <RadioButtonsField
                        fieldName="Would you invest in this startup?"
                        fieldId="invest"
                        options={[
                          {
                            label:
                              "Yes, I'd like to discuss potential investment",
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
                        defaultValue={scores.invest}
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
                        defaultValue={scores.mentoring}
                      />
                      <LongTextField
                        fieldName="Are there any companies and/or people you'd like to connect this startup with?"
                        fieldId="connect"
                        required={false}
                        rhfRef={register}
                        defaultValue={scores.connect}
                      />
                    </div>

                    <div className="pt-8">
                      <SectionHeading heading="Feedback" />
                      <LongTextField
                        fieldName="Do you have any comments you'd like to share with the startup?"
                        fieldId="comments"
                        required={false}
                        rhfRef={register}
                        defaultValue={scores.comments}
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
                        defaultValue={scores.anonymous}
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
                        defaultValue={scores.concerns}
                      />
                    </div>

                    <input
                      type="submit"
                      className="block px-8 py-3 mt-16 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-md cursor-pointer hover:bg-teal-600 hover:shadow-lg"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
