import { client, q } from "@/utils/fauna";

export default async function startup(req, res) {
  try {
    const startupRes = await client.query(
      q.Create(q.Collection("Startups"), {
        data: { ...req.body },
      })
    );
    res.status(200).json(startupRes);
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}