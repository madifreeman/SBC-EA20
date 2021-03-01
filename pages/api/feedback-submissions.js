import { client, q } from "@/utils/fauna";

export default async function feedback(req, res) {
  try {
    const feedbackRes = await client.query(
      q.Create(q.Collection("FeedbackSubmissions"), {
        data: { ...req.body },
      })
    );
    res.status(200).json(feedbackRes);
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}