import PublicPageShell from '../../components/layout/PublicPageShell';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By creating an account or using PropEstate, you agree to these Terms of Service. If you do not agree, please discontinue use of the platform.',
  },
  {
    title: '2. Accounts & Roles',
    body: 'PropEstate offers three account roles — Buyer, Agent, and Admin. Buyers may browse listings, submit purchase offers, and leave reviews. Agents may list properties, subject to admin review and approval. Admins moderate users and listings. You are responsible for maintaining the confidentiality of your login credentials.',
  },
  {
    title: '3. Listing Approval',
    body: 'All property listings submitted by Agents are reviewed by an Admin before appearing publicly, including map placement and document verification. PropEstate reserves the right to reject or remove any listing that violates these terms or contains inaccurate information.',
  },
  {
    title: '4. Purchases & Offers',
    body: 'Purchase requests submitted through the platform are offers only, and do not constitute a binding legal transaction. Buyers and Agents are responsible for completing any resulting sale, rental agreement, or contract outside of the platform, including legal and financial due diligence.',
  },
  {
    title: '5. Content & Conduct',
    body: 'You agree not to upload false, misleading, or infringing content, including fabricated documents or images. Reviews must reflect genuine experiences. PropEstate may suspend or deactivate accounts that violate these rules.',
  },
  {
    title: '6. Document Verification',
    body: 'Automated document verification provides a confidence score to assist admin review, but does not guarantee legal validity of any title, NOC, or floor plan. Buyers should always perform independent legal verification before completing a transaction.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'PropEstate acts as a marketplace connecting buyers and agents and is not a party to any resulting property transaction. We are not liable for disputes, losses, or damages arising from listings, communications, or transactions between users.',
  },
  {
    title: '8. Changes to These Terms',
    body: 'We may update these Terms from time to time. Continued use of PropEstate after changes are posted constitutes acceptance of the revised Terms.',
  },
];

export default function Terms() {
  return (
    <PublicPageShell title="Terms of Service" subtitle="Last updated: July 2026">
      {sections.map((s) => (
        <div key={s.title}>
          <h2 className="text-base font-semibold text-gray-900 mt-4 mb-1">{s.title}</h2>
          <p>{s.body}</p>
        </div>
      ))}
    </PublicPageShell>
  );
}
