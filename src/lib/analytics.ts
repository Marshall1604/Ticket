/**
 * Lightweight privacy-first analytics event tracking abstraction for TICKETSHOW.
 * Does not transmit or collect PII (Personally Identifiable Information).
 */

export type AnalyticsEvent =
  | { name: 'view_event'; properties: { eventId: string; slug: string; category: string } }
  | { name: 'search_event'; properties: { query: string; resultsCount: number } }
  | { name: 'filter_event'; properties: { category?: string; city?: string; dateFilter?: string } }
  | { name: 'select_ticket'; properties: { eventId: string; tierName: string; quantity: number; price: number } }
  | { name: 'begin_checkout'; properties: { eventId: string; tierName: string; quantity: number; totalAmount: number } }
  | { name: 'purchase_success'; properties: { orderId: string; eventId: string; totalAmount: number; ticketCount: number } }
  | { name: 'newsletter_signup'; properties: { source: string } };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event.name}:`, event.properties);
  }

  // Future integration hook (e.g. Google Analytics 4, Mixpanel, Custom Supabase Telemetry)
  try {
    const customWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof customWindow.gtag === 'function') {
      customWindow.gtag('event', event.name, event.properties);
    }
  } catch {
    // Fail silently
  }
}
