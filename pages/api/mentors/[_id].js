import client from "@/utils/sanity";

export default async function mentorById(req, res) {
  console.log(req.body);
  switch (req.method) {
    case "PUT":
      client
        .patch(req.body.id)
        .set(req.body.set)
        .commit()
        .then((result) => {
          console.log("success")
          res.status(200).json(result);
        })
        .catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
  }
}
