export default function EmailForm({ submitted, onSubmit, email, setEmail, submitLabel = "Join" }) {
  return submitted ? (
    <p className="email-ok">✓ You're on the list.</p>
  ) : (
    <form onSubmit={onSubmit} className="email-row">
      <input
        className="email-input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button className="email-submit" type="submit">{submitLabel}</button>
    </form>
  );
}