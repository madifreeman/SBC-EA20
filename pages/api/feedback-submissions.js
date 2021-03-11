import { client, q } from "@/utils/fauna";

export default async function feedback(req, res) {
  const {feedbackId, ...data} = req.body;
  // Refs need to be defined here so that they're not JSON.stringified
  data.startup = q.Ref(q.Collection("Startups"), data.startup);
  data.mentor = q.Ref(q.Collection("Mentors"), data.mentor);

  switch (req.method) {
    case "POST":
      try {
        const feedbackRes = await client.query(
          q.Create(q.Collection("FeedbackSubmissions"), {
            data: {...data},
          })
        );
        res.status(200).json(feedbackRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
    case "PATCH":
      try {
        const feedbackRes = await client.query(
          q.Update(q.Ref(q.Collection("FeedbackSubmissions"), feedbackId), {
            data: {...data},
          })
        );
        res.status(200).json(feedbackRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
  }
}
