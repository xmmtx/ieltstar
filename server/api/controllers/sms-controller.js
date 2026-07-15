import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

let client = null;
const getTwilioClient = () => {
  if (!client) {
    try {
      client = Twilio(process.env.AccountSID, process.env.AuthToken);
    } catch (e) {
      console.log("Twilio not configured:", e.message);
      return null;
    }
  }
  return client;
};
// set status and send response
const setResponse = (res, status, data) => {
  res.status(status).json(data);
};

// send SMS
export const sendSms = (req, res) => {
  const twilio = getTwilioClient();
  if (!twilio) {
    return res.json({ success: false, message: "SMS service not configured" });
  }
  const id = JSON.stringify(req.params.id);
  twilio.messages
    .create({
      from: `${process.env.FROM_SMS}`,
      to: id,
      body: `Hi ${req.body.name}, Your ielts overall band score is:${req.body.scores.overallBand}. Reading Score:${req.body.scores.readingScore}, Writing Score:${req.body.scores.writingScore}, Speaking Score:${req.body.scores.speakingScore}, Listening Score:${req.body.scores.listeningScore}`,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
};
