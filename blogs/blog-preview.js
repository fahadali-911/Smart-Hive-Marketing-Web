/* DEVELOPMENT ONLY. Remove this file from launch artifacts.
   Unpublished draft topics used to review the editorial design locally at
   /blog?preview=editorial. Loaded by blog-content.js on loopback hosts only.
   Every entry is marked `draft`, carries no publication date, and is rendered
   noindex. Nothing here is published content. Real posts come from Supabase. */
(() => {
  'use strict';
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;

  const photo = (id, width) =>
    'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + width;

  /* Same field names as the Supabase `blog_posts` table. */
  window.SMART_HIVE_PREVIEW_POSTS = [
    {
      slug: 'more-leads-weak-booking-system',
      title: 'Why More Leads Won’t Fix a Weak Booking System',
      category: 'Growth Strategy',
      featured: true,
      draft: true,
      featured_image: photo(29648640, 1200),
      featured_image_alt: 'Practitioner taking notes during a beauty clinic consultation',
      excerpt: 'Before increasing acquisition spend, examine what happens between the first inquiry and a confirmed appointment. The constraint may be closer than you think.',
      content: [
        'When bookings plateau, the first instinct is usually to buy more attention. More budget, more channels, more campaigns. It is the most visible lever, so it feels like the most responsible one to pull.',
        '',
        'The difficulty is that acquisition spend multiplies whatever system already exists. If an inquiry waits hours for a reply, or arrives somewhere nobody is watching, more inquiries simply produce more waiting.',
        '',
        '## Start where the momentum stops',
        '',
        'Map the path a prospective patient actually travels, then mark the point where momentum drops:',
        '',
        '- A treatment page that explains the service but never names the next step',
        '- A form that reaches an inbox nobody owns',
        '- A reply that arrives after the decision has already moved on',
        '- A booking step that asks for more effort than the visitor expected',
        '',
        '> The question is rarely how to get more interest. It is what happens to the interest already arriving.',
        '',
        '## Make the handoff visible',
        '',
        'Most booking problems are handoff problems. An inquiry changes hands between a page, a form, a CRM and a person, and each handoff is a place where responsibility can quietly disappear.',
        '',
        ':::takeaway',
        'Fix the transition between inquiry and appointment before increasing spend. The same campaign performs differently on top of a system that responds.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'speed-to-lead-medspa',
      title: 'Speed-to-Lead: The Gap Between Interest and an Appointment',
      category: 'Booking',
      draft: true,
      featured_image: photo(4266947, 800),
      featured_image_alt: 'Healthcare practitioner reviewing information on a tablet with a patient',
      excerpt: 'A closer look at response time, handoffs and the follow-up that helps an inquiry move forward.',
      content: [
        'Interest has a short shelf life. Someone comparing treatments is usually contacting more than one practice, and the gap between their enquiry and your reply is the gap a competitor can fill.',
        '',
        '## Treat response time as a system, not an effort',
        '',
        'Fast replies that depend on one attentive person are fragile. They disappear during a busy clinic day, a holiday, or a staffing change. A dependable response is built from structure:',
        '',
        '- A single owner for every inbound channel',
        '- An automatic acknowledgement that sets expectations',
        '- A short qualification step so the right person handles the reply',
        '- A visible queue, so nothing waits unseen',
        '',
        ':::takeaway',
        'Measure the time between inquiry and first meaningful human reply. It is one of the clearest indicators of how much of your demand is converting.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'local-search-treatment-first',
      title: 'Local Search Starts With the Treatment, Not the Clinic',
      category: 'Acquisition & SEO',
      draft: true,
      featured_image: photo(7446690, 800),
      featured_image_alt: 'Dermatologist providing a skincare treatment in a bright clinic',
      excerpt: 'Connect treatment-specific searches to pages that answer the questions prospective patients actually ask.',
      content: [
        'People rarely search for a clinic by name before they know it exists. They search for the outcome they want, often alongside a place, a price range or a concern.',
        '',
        '## Build pages around questions, not services',
        '',
        'A treatment page earns its traffic when it answers what someone needs to decide: what the treatment does, who it suits, what it costs, what the appointment feels like, and what happens afterwards.',
        '',
        '> A service list tells people what you sell. A treatment page helps them choose.',
        '',
        ':::takeaway',
        'One page per treatment decision, written in the language patients use, usually outperforms a single page listing everything you offer.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'treatment-pages-lose-patients',
      title: 'Why Treatment Pages Lose Patients Before They Inquire',
      category: 'Conversion',
      draft: true,
      featured_image: photo(4266930, 800),
      featured_image_alt: 'Clinician explaining treatment information to a patient during a consultation',
      excerpt: 'Trust, clarity and a clear next step: the patient decisions your treatment pages need to support.',
      content: [
        'A treatment page has a narrow job. It has to replace the reassurance a visitor would get from a conversation, and do it before they lose patience.',
        '',
        '## Three things a visitor is weighing',
        '',
        '- **Is this right for me?** Who the treatment suits, and who it does not',
        '- **Can I trust this practice?** Who performs it, and what care standards apply',
        '- **What happens next?** Duration, pricing range, aftercare and how to begin',
        '',
        'When any of these is missing, the visitor does not usually ask. They leave and compare elsewhere.',
        '',
        ':::takeaway',
        'Answer the uncertainty on the page. Every unanswered question becomes a reason to keep comparing.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'retention-begins-before-patient-leaves',
      title: 'Retention Begins Before the Patient Leaves',
      category: 'Retention',
      draft: true,
      featured_image: photo(6663360, 800),
      featured_image_alt: 'Practitioner guiding a client through aftercare beside a treatment bed',
      excerpt: 'Bring rebooking, membership touchpoints and follow-up into one connected patient experience.',
      content: [
        'Retention is often treated as something that happens weeks later, through a reminder or a campaign. In practice, it is largely decided in the final few minutes of an appointment.',
        '',
        '## Close the loop in the room',
        '',
        'The strongest retention step is a clear recommendation for what comes next and when, made while the patient is still present and the result is fresh.',
        '',
        '- A recommended interval, explained in terms of the outcome',
        '- The next appointment offered before the visit ends',
        '- A follow-up that checks in rather than sells',
        '- Membership positioned as continuity of care, not a discount',
        '',
        ':::takeaway',
        'A reminder sent later recovers far fewer patients than a next step agreed before they leave.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'crm-should-connect-the-journey',
      title: 'A CRM Should Connect the Journey, Not Add More Work',
      category: 'CRM & Automation',
      draft: true,
      featured_image: photo(4269274, 800),
      featured_image_alt: 'Clinic team member checking patient details at a reception desk',
      excerpt: 'Think beyond a contact list. Map the handoffs that make the next step visible to your team.',
      content: [
        'A CRM earns its place when it makes the next action obvious. If your team has to interpret the system before acting, the system is adding work rather than removing it.',
        '',
        '## Automate the handoffs, not the relationship',
        '',
        'The most useful automation is unglamorous: notifying the right person, preserving context, updating status, and prompting a follow-up that would otherwise be forgotten.',
        '',
        '> Automation should give your team better information, not replace the conversation.',
        '',
        ':::takeaway',
        'If a workflow does not make someone’s next action clearer, it is probably decoration.',
        ':::'
      ].join('\n')
    },
    {
      slug: 'when-reactivation-beats-more-spend',
      title: 'When Reactivation Deserves a Place in Your Growth Plan',
      category: 'Growth Strategy',
      draft: true,
      featured_image: photo(3764013, 800),
      featured_image_alt: 'Client reviewing her skin in a hand mirror after a treatment',
      excerpt: 'Before chasing a new audience, consider the patients who already know your practice.',
      content: [
        'Every practice has a group of people who have already chosen it once and then drifted. They need no introduction to the brand, the location or the standard of care.',
        '',
        '## Reactivation is a sequencing decision',
        '',
        'This is not an argument against acquisition. It is an argument about order. Lapsed patients are usually the shortest distance between effort and an appointment.',
        '',
        '- Segment by treatment and by how long since the last visit',
        '- Lead with relevance, not a generic offer',
        '- Make rebooking a single, obvious step',
        '',
        ':::takeaway',
        'Before widening the top of the funnel, look at who has already been through it.',
        ':::'
      ].join('\n')
    }
  ];
})();
