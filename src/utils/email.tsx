import axios from "axios";

const MANDRILL_API_KEY = "md-C4N3s0MhVMBaAWX89_JbMQ"//process.env.MANDRILL_API_KEY;

export async function sendTemplateEmail(toEmail: string, templateName: string, templateVars: Record<string, any>) {
  const data = {
    key: MANDRILL_API_KEY,
    template_name: templateName,
    template_content: [], // legacy, usually empty
    message: {
      from_email: "booking@hotelandsparesorts.com",
      from_name: "Hotel & Spa Resorts",
      to: [{ email: toEmail, type: "to" }],
      // Optional attachments
      // attachments: [
      //   { type: "application/pdf", name: "voucher.pdf", content: "<base64>" }
      // ]
      merge: true,
      merge_language: "mailchimp", // or "handlebars" depending on how your template is built
      merge_vars: [
            {
              rcpt: toEmail,
              vars: Object.entries(templateVars).map(([name, content]) => ({ name, content })),
            },
          ],
    },
    merge_language: "mailchimp",  // 👈 Add this
    merge_vars: [
      {
        rcpt: toEmail,
        vars: Object.entries(templateVars).map(([name, content]) => ({ name, content })),
      },
    ],
  };

  const response = await axios.post(
    "https://mandrillapp.com/api/1.0/messages/send-template.json",
    data
  );

  console.log("MANDRILL RESPONSE", response.data)

  return response.data;
}
