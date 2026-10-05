import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner.jsx";

const Page = ({ title, children }) => (
  <div className="page-bg">
    <PageBanner img="waves" eyebrow="Legal" title={title} />
    <div className="container section narrow policy">{children}</div>
  </div>
);

export const Privacy = () => (
  <Page title="Privacy Policy">
    <h3>How We Use Your Information</h3>
    <ul>
      <li>Process your ferry bookings and reservations</li>
      <li>Send you booking confirmations and updates</li>
      <li>Improve our services and customer experience</li>
      <li>Comply with legal obligations</li>
    </ul>
    <p>We never sell your personal data. Payment details are handled by our payment provider and are not stored on our servers.</p>
  </Page>
);

export const CANCEL_TIERS = [
  ["More than 24 hours before departure", "100%", "Full refund, minus the payment gateway fee"],
  ["6 to 24 hours before departure", "50%", "Half the ticket fare is refunded"],
  ["Less than 6 hours before departure", "0%", "No refund"],
  ["No-show at check-in", "0%", "No refund"],
];

export const Cancellation = () => (
  <Page title="Cancellation Policy">
    <p className="sub">Plans change. This is how much of your fare is eligible for refund, based on how early you cancel.</p>
    <div className="table-wrap policy-table"><table>
      <thead><tr><th>When you cancel</th><th>Refund eligible</th><th>Details</th></tr></thead>
      <tbody>{CANCEL_TIERS.map(([w, r, d]) => (
        <tr key={w}><td>{w}</td><td><span className={`pct p${r.replace("%", "")}`}>{r}</span></td><td>{d}</td></tr>
      ))}</tbody>
    </table></div>

    <h3>How to cancel</h3>
    <ol>
      <li>Contact us by email, phone or WhatsApp with your ticket number (for example SP4K9X2A).</li>
      <li>We confirm the cancellation by email.</li>
      <li>Your refund is then processed under our <Link to="/refund-policy">Refund Policy</Link>.</li>
    </ol>

    <h3>Cancellations by us</h3>
    <ul>
      <li>If we cancel a sailing because of weather, safety or operational reasons, you get a full refund or a free rebooking on the next available sailing.</li>
      <li>If a sailing is delayed by more than 3 hours, you may cancel for a full refund.</li>
    </ul>

    <h3>Good to know</h3>
    <ul>
      <li>The cancellation time is when we receive your request, not when you arrive at the port.</li>
      <li>Vehicle fares follow the same schedule as passenger fares.</li>
      <li>Individual passengers can be removed from a group booking. Only the removed tickets are cancelled.</li>
    </ul>
  </Page>
);

export const Refund = () => (
  <Page title="Refund Policy">
    <p className="sub">What happens to your money after a cancellation is approved. See the <Link to="/cancellation-policy">Cancellation Policy</Link> for how much is refundable.</p>

    <h3>Refund timeline</h3>
    <div className="table-wrap policy-table"><table>
      <thead><tr><th>Payment method</th><th>Refund returned within</th></tr></thead>
      <tbody>
        <tr><td>UPI</td><td>2 to 3 business days</td></tr>
        <tr><td>Debit or credit card</td><td>5 to 7 business days</td></tr>
        <tr><td>Net banking</td><td>5 to 7 business days</td></tr>
        <tr><td>Wallets</td><td>2 to 3 business days</td></tr>
      </tbody>
    </table></div>

    <h3>How refunds are paid</h3>
    <ul>
      <li>Refunds always go back to the original payment method. We cannot refund to a different card, account or wallet.</li>
      <li>You get an email once the refund is initiated. Your bank may take extra days to show it.</li>
    </ul>

    <h3>What is refundable</h3>
    <ul>
      <li>Passenger and vehicle fares, according to the cancellation tier.</li>
      <li>The full amount, if we cancel the sailing or it is delayed by more than 3 hours.</li>
      <li>The full amount, if you were charged but no ticket was issued.</li>
    </ul>

    <h3>What is not refundable</h3>
    <ul>
      <li>The service fee on bookings cancelled by the passenger.</li>
      <li>Tickets cancelled less than 6 hours before departure, and no-shows.</li>
      <li>Add-ons already used on board.</li>
    </ul>

    <h3>Failed or double payments</h3>
    <p>If money was deducted but your booking failed, or you were charged twice, it is returned automatically within 5 to 7 business days. If it is not, contact us with your payment reference.</p>
  </Page>
);

export const Terms = () => (
  <Page title="Terms &amp; Conditions">
    <h3>Passenger Responsibilities</h3>
    <ul>
      <li>Valid identification must be presented at check-in</li>
      <li>Passengers are responsible for their personal belongings</li>
      <li>Prohibited items must not be brought on board</li>
    </ul>
    <p>Schedules may change due to weather and operational conditions.</p>
  </Page>
);
