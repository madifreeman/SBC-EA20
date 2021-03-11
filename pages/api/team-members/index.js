import { client, q } from "@/utils/fauna";

export default async function teamMember(req, res) {
  const data = req.body;
  data.startup = q.Ref(q.Collection("Team Members"), data.startup)
  
  try {
    const teamMemberRes = await client.query(
      q.Create(q.Collection("TeamMembers"), {
        data: { ...req.body },
      })
    );
    res.status(200).json(teamMemberRes);
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}
