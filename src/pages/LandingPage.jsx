import EmailForm from "../components/EmailForm";

export default function LandingPage({ onEnter, email, setEmail, submitted, onSubmit }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="f1">
          <div className="landing-title">Shelter From<br />Tha Rain</div>
          <div className="landing-sub">Enter The Storm</div>
        </div>
        <div className="f2 email-strip">
          <div className="email-label">Stay in the loop</div>
          <EmailForm
            submitted={submitted} onSubmit={onSubmit}
            email={email} setEmail={setEmail}
            submitLabel="Join"
          />
        </div>
        <button className="f3 enter-btn" onClick={onEnter}>
          Enter The Storm
        </button>
      </div>
    </div>
  );
}