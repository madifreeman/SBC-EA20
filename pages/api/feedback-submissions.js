import { client, q } from "@/utils/fauna";

export default async function feedback(req, res) {
  const data = req.body;
  // Refs need to be defined here so that they're not JSON.stringified
  data.startup = q.Ref(q.Collection("Startups"), data.startup);
  data.mentor = q.Ref(q.Collection("Mentors"), data.mentor);

  try {
    const feedbackRes = await client.query(
      q.Create(q.Collection("FeedbackSubmissions"), {
        data: { ...req.body },
      })
    );
    res.status(200).json(feedbackRes);
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
