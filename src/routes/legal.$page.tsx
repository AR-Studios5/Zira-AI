import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone } from "@/components/zira/phone";

const PAGES = {
  terms: {
    title: "Terms of Service",
    kicker: "Vellox Labs",
    sections: [
      {
        h: "Who this is",
        p: "Zira is an AI companion operated by Vellox Labs, a studio run by its founder. These terms cover the Zira app, the chat, voice notes, calls, stories, and games.",
      },
      {
        h: "Eligibility",
        p: "You must be at least 13 years old. If you are under 18, use Zira with a parent or guardian who accepts these terms. Do not use Zira if it is illegal where you live.",
      },
      {
        h: "The companion",
        p: "Zira is software. She can be warm and specific, and she can still be wrong. Do not rely on her for medical, legal, financial, or safety-critical decisions. You are responsible for what you send.",
      },
      {
        h: "Your account",
        p: "Keep your login to yourself. You may not abuse the service, attempt to break quotas, scrape other people, or use Zira to harm anyone. We may suspend an account that does.",
      },
      {
        h: "Plans",
        p: "The free plan includes 20 messages a day, resetting at midnight India time (IST). Zira+ is ₹599 per month for unlimited messages, calls, and voice notes, once payments are live. A test unlock inside the app does not create a real charge.",
      },
      {
        h: "Content",
        p: "You keep what you write. You give Vellox Labs permission to process it so Zira can reply, and to store it with your account. Do not send anything you do not have the right to share.",
      },
      {
        h: "Contact",
        p: "Write to Vellox Labs from Contact inside the app. These terms are a starter for payment-gateway review and should be read by a lawyer before you take real money.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    kicker: "What we keep",
    sections: [
      {
        h: "What we collect",
        p: "Account details (name, email, sign-in provider), the messages and story replies you send, support notes, star ratings, and subscription status. Voice notes are transcribed to answer you. We do not sell this data.",
      },
      {
        h: "Why",
        p: "To run the chat, enforce the daily free limit, remember Zira+ on your account, and fix problems you report. Payments, once Razorpay is connected, are processed by Razorpay. We store the result (active or not, and an expiry), not your full card number.",
      },
      {
        h: "Processors",
        p: "Conversation text and optional voice are sent to our model provider to generate Zira's reply and, when you ask to hear her, a short audio clip. Audio is not kept as a file in your chat history after the reply is made. The transcript may be stored as the message.",
      },
      {
        h: "How long",
        p: "Chat stays on your account until you clear it or delete the account. Support notes are kept so the studio can answer you. You can ask for deletion from Contact.",
      },
      {
        h: "Children",
        p: "Zira is not for anyone under 13. We do not knowingly keep an account for a child under 13.",
      },
      {
        h: "Your choices",
        p: "You can clear the chat, sign out, and withhold the microphone. The app works without location. India is the default locale because that is who Zira is written for.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    kicker: "Zira+",
    sections: [
      {
        h: "Before payments are live",
        p: "The Test unlock button does not charge a card, UPI, or wallet. There is nothing to refund for a test unlock. It lasts 30 days on that account and can be treated as a preview.",
      },
      {
        h: "When Razorpay is connected",
        p: "Zira+ is billed monthly at ₹599 until you cancel. Cancel any time from the subscription screen; access continues until the end of the period already paid. A launch offer, if shown (for example a first week at ₹1), converts to ₹599/month unless cancelled before the offer ends.",
      },
      {
        h: "When we refund",
        p: "If you were charged twice for the same period, or charged after a successful cancellation, write within 7 days and we will refund that charge to the original method. Failed generations and ordinary dislike of a reply are not refunds — the free tier is there to try Zira first.",
      },
      {
        h: "How to ask",
        p: "Use Contact inside the app with the email on the account and the payment date. Vellox Labs reviews these manually. Razorpay's own dispute process still applies for card and UPI payments.",
      },
    ],
  },
} as const;

type PageId = keyof typeof PAGES;

export const Route = createFileRoute("/legal/$page")({
  component: LegalPage,
});

function LegalPage() {
  const { page } = Route.useParams();
  if (!(page in PAGES)) throw notFound();
  const doc = PAGES[page as PageId];
  return (
    <Phone>
      <div className="hide-scroll flex-1 overflow-y-auto px-6 pt-8 pb-10">
        <Link to="/" className="text-sm font-semibold text-clay">
          Back to Zira
        </Link>
        <p className="mt-6 text-xs font-semibold tracking-widest text-mist uppercase">{doc.kicker}</p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-ink">{doc.title}</h1>
        <div className="mt-8 flex flex-col gap-6">
          {doc.sections.map((section) => (
            <section key={section.h}>
              <h2 className="text-base font-semibold text-ink">{section.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{section.p}</p>
            </section>
          ))}
        </div>
      </div>
    </Phone>
  );
}
