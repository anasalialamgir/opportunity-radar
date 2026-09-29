import { appendFileSync, writeFileSync } from "node:fs";
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";

const out = process.env.SMOKE_MAIL_FILE || "/tmp/radar-smtp.jsonl";
writeFileSync(out, "");
const server = new SMTPServer({
  disabledCommands: ["STARTTLS"],
  allowInsecureAuth: true,
  onAuth(auth, _session, done) {
    if (auth.username === "test" && auth.password === "test") done(null, { user: "test" });
    else done(new Error("Invalid SMTP test credentials"));
  },
  onData(stream, _session, done) {
    simpleParser(stream).then(message => {
      appendFileSync(out, JSON.stringify({ subject: message.subject, text: message.text }) + "\n");
      done();
    }).catch(done);
  },
});
server.listen(2525, "127.0.0.1");
