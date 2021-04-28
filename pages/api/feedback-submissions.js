import { client, q } from "@/utils/fauna";

export default async function feedback(req, res) {
  const {feedbackId, ...data} = req.body;

  switch (req.method) {
    case "POST":
      try {
        const feedbackRes = await client.query(
          q.Create(q.Collection("FeedbackSubmissions"), {
            data: {...data},
          })
        );
        console.log({feedbackRes})
        res.status(200).json(feedbackRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
      break;
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
      break;
  }
}
