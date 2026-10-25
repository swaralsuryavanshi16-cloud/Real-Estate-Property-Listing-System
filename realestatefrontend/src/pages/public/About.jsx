import PublicPageShell from '../../components/layout/PublicPageShell';
import { Building2, ShieldCheck, Users, MapPin, Bot, Sparkles } from 'lucide-react';

const values = [
  { icon: ShieldCheck, title: 'Verified Listings', text: 'Every property is reviewed and approved by our admin team, and documents pass through automated verification before going live.' },
  { icon: Users, title: 'Three Roles, One Platform', text: 'Purpose-built dashboards for Buyers, Agents, and Admins — each with its own workspace, tools, and look and feel.' },
  { icon: MapPin, title: 'Map-Verified Locations', text: 'Approved properties are pinned on an interactive map so buyers can confirm the exact location before reaching out.' },
  { icon: Bot, title: 'AI Assistant', text: 'Our built-in chat assistant helps you search listings, understand the buying process, and get support instantly, day or night.' },
];

export default function About() {
  return (
    <PublicPageShell
      title="About PropEstate"
      subtitle="A modern real-estate marketplace connecting buyers, agents, and admins."
    >
      <p>
        PropEstate is a full-stack property marketplace built to make buying, selling,
        and renting real estate simple and trustworthy. We bring buyers, agents, and
        administrators together on one platform — each with tools tailored to their role.
      </p>
      <p>
        Agents list properties with photos and legal documents. Our admin team reviews
        every submission, verifies documents, and approves listings before they appear
        publicly with full map placement. Buyers can browse, chat with our AI assistant,
        message agents directly, leave reviews, and submit purchase offers — all from a
        single dashboard.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-2">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-primary-700 bg-primary-50 rounded-xl px-4 py-3 mt-6">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm">
          Our mission: make every real-estate transaction transparent, verified, and easy to trust.
        </p>
      </div>
    </PublicPageShell>
  );
}
