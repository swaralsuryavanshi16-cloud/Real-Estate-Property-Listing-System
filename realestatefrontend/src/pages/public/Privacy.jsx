import PublicPageShell from '../../components/layout/PublicPageShell';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly — name, email, phone, password (stored hashed), profile avatar, property listings, documents, reviews, and purchase offers — as well as usage data such as pages visited and searches performed.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to operate your account, display and moderate listings, connect buyers with agents, run our AI assistant, verify uploaded documents, and communicate important updates about your account or listings.',
  },
  {
    title: '3. Location Data',
    body: 'Property location coordinates entered by agents are used solely to display approved listings on an interactive map for buyers. We do not track or store your personal device location.',
  },
  {
    title: '4. Sharing of Information',
    body: 'Your name, phone, and email are shared with the other party in a transaction (e.g. an interested buyer sees the listing agent\'s contact details) so they can communicate directly. We do not sell your personal data to third parties.',
  },
  {
    title: '5. Data Security',
    body: 'Passwords are hashed and never stored in plain text. Access to admin tools is restricted by role-based authentication. Uploaded documents and images are stored securely and are only accessible to authorized roles.',
  },
  {
    title: '6. Cookies & Local Storage',
    body: 'We use local storage to keep you signed in between visits. We do not use third-party advertising trackers.',
  },
  {
    title: '7. Your Rights',
    body: 'You may update your profile information at any time from your account settings, or contact support to request account deletion or a copy of your data.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may revise this Privacy Policy periodically. Material changes will be communicated within the app.',
  },
];

export default function Privacy() {
  return (
    <PublicPageShell title="Privacy Policy" subtitle="Last updated: July 2026">
      {sections.map((s) => (
        <div key={s.title}>
          <h2 className="text-base font-semibold text-gray-900 mt-4 mb-1">{s.title}</h2>
          <p>{s.body}</p>
        </div>
      ))}
    </PublicPageShell>
  );
}
