import { MessageCircle } from 'lucide-react';

// Generic support number used when no agent-specific number is supplied.
// Update this to your actual support line, or pass a `phone` prop per-use.
const DEFAULT_SUPPORT_PHONE = import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER || '911234567890';

function buildWaLink(phone, message) {
  const cleaned = (phone || DEFAULT_SUPPORT_PHONE).replace(/[^\d]/g, '');
  const text = encodeURIComponent(message || 'Hi! I have a question about a property on PropEstate.');
  return `https://wa.me/${cleaned}?text=${text}`;
}

/**
 * Floating WhatsApp launcher, fixed to the bottom-right of the viewport.
 * Pass `phone` + `message` for a context-specific chat (e.g. about a
 * particular listing); otherwise falls back to the general support line.
 */
export function WhatsAppFloatingButton({ phone, message }) {
  return (
    <a
      href={buildWaLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
    >
      <MessageCircle className="w-7 h-7" fill="white" strokeWidth={0} />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}

/**
 * Inline WhatsApp chat button/link, for use inside a card (e.g. next to an
 * agent's contact details on a property page).
 */
export default function WhatsAppButton({ phone, message, label = 'Chat on WhatsApp' }) {
  return (
    <a
      href={buildWaLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#1ebe57] transition-colors text-sm"
    >
      <MessageCircle className="w-4 h-4" fill="white" strokeWidth={0} />
      {label}
    </a>
  );
}
