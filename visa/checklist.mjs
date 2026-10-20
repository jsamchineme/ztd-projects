// The document checklist for a UK Standard Visitor visa (family visit, sponsored by a child in the UK).
// Based on GOV.UK "Visiting the UK: guide to supporting documents" and the Standard Visitor pages.
// need: 'required' | 'strong' (strongly recommended) | 'helpful' | 'if' (only if it applies)

export const SECTIONS = [
  { id: 'mum', title: 'Mum’s documents', who: 'applicant', blurb: 'What shows who she is, that she can afford the trip, and that she’ll go home afterwards.' },
  { id: 'sponsor', title: 'Your documents (sponsor)', who: 'sponsor', blurb: 'What shows she’s your mum, you’re settled in the UK, and you can host and support her.' },
  { id: 'visit', title: 'The visit itself', who: 'both', blurb: 'Why she’s coming, where she’ll stay and how long for.' },
];

export const ITEMS = [
  // Mum
  { id: 'passport', section: 'mum', need: 'required', title: 'Current passport',
    hint: 'Photo page plus every page with stamps or visas. Must be valid for the whole stay, with a blank page for the visa.' },
  { id: 'old-passports', section: 'mum', need: 'helpful', title: 'Previous passports',
    hint: 'Pages showing past trips (UK, US, Schengen, Canada…). A good travel record helps show she returns home.' },
  { id: 'prev-visas', section: 'mum', need: 'if', title: 'Previous UK visas & refusals',
    hint: 'Copies of any earlier UK visas. If she’s ever been refused a visa anywhere, keep the refusal letter here: the form asks.' },
  { id: 'mum-bank', section: 'mum', need: 'strong', title: 'Her bank statements (last 6 months)',
    hint: 'Stamped by the bank or downloaded e-statements. Explain any large recent deposits, since unexplained lump sums are a common refusal reason.' },
  { id: 'mum-income', section: 'mum', need: 'strong', title: 'Proof of income',
    hint: 'Pension statement, employer letter (role, salary, approved leave), or business registration and recent invoices if self-employed.' },
  { id: 'ties', section: 'mum', need: 'strong', title: 'Ties to home',
    hint: 'Property deed or tenancy, letters about family, community or church roles: anything showing why she’ll return after the visit.' },
  { id: 'mum-id', section: 'mum', need: 'helpful', title: 'National ID card',
    hint: 'A copy of her national ID, if she has one.' },
  { id: 'translations', section: 'mum', need: 'if', title: 'Certified translations',
    hint: 'Anything not in English needs a full translation with the translator’s confirmation it’s accurate, date, full name, signature and contact details.' },

  // Sponsor
  { id: 'invite', section: 'sponsor', need: 'strong', title: 'Invitation & sponsorship letter',
    hint: 'Signed letter from you: who she is, why she’s coming (the baby), dates, where she’ll stay, what you’ll pay for. Use “Draft letter” to start one.' },
  { id: 'sponsor-status', section: 'sponsor', need: 'strong', title: 'Your UK status',
    hint: 'British passport photo page, or your eVisa share code / BRP / naturalisation certificate.' },
  { id: 'relationship', section: 'sponsor', need: 'strong', title: 'Proof she’s your mum',
    hint: 'Your birth certificate showing her as your mother. If names differ (e.g. after marriage), add something that links them.' },
  { id: 'sponsor-bank', section: 'sponsor', need: 'strong', title: 'Your bank statements (last 3–6 months)',
    hint: 'Showing you can cover her stay as well as your own household. Highlight salary credits.' },
  { id: 'payslips', section: 'sponsor', need: 'strong', title: 'Your payslips (last 3–6 months)',
    hint: 'Matching the salary credits on your statements.' },
  { id: 'employment', section: 'sponsor', need: 'helpful', title: 'Your employment letter',
    hint: 'On company letterhead: role, salary, start date, permanent or not. Self-employed: tax return (SA302) and accounts instead.' },
  { id: 'marriage', section: 'sponsor', need: 'helpful', title: 'Your marriage certificate',
    hint: 'Ties the pregnancy evidence to your family.' },

  // Visit
  { id: 'pregnancy', section: 'visit', need: 'strong', title: 'Pregnancy evidence (due date)',
    hint: 'MATB1 or a letter from the midwife/GP showing the due date. It explains the timing and purpose of the visit.' },
  { id: 'accommodation', section: 'visit', need: 'strong', title: 'Proof of where she’ll stay',
    hint: 'Your tenancy agreement or mortgage/title deeds. If renting, a short note from the landlord that she can stay is useful. Utility bills aren’t useful on their own.' },
  { id: 'itinerary', section: 'visit', need: 'helpful', title: 'Travel plan / flight reservation',
    hint: 'A short itinerary with planned arrival and return dates. Don’t buy non-refundable flights until the visa is granted.' },
  { id: 'insurance', section: 'visit', need: 'helpful', title: 'Travel medical insurance',
    hint: 'Not required for the visa, but visitors are charged for most NHS hospital care, so it’s worth having for the whole stay.' },
  { id: 'application', section: 'visit', need: 'required', title: 'Submitted application & receipts',
    hint: 'Keep the PDF of the completed online form, payment receipt and appointment confirmation here.' },
];

// Steps of the application itself (shown as a timeline)
export const STEPS = [
  { id: 'gather', title: 'Gather and scan documents', hint: 'Use this site: everything ticked and uploaded.' },
  { id: 'letter', title: 'Write and sign the invitation letter', hint: 'Signed by you, dated within the last month before she applies.' },
  { id: 'form', title: 'Complete the online form on GOV.UK', hint: 'gov.uk/standard-visitor/apply-standard-visitor-visa · choose the 6-month visit visa.' },
  { id: 'pay', title: 'Pay the £135 fee', hint: '6-month Standard Visitor visa. Priority services cost extra where available.' },
  { id: 'book', title: 'Book the biometrics appointment', hint: 'At the visa application centre in her country (fingerprints and photo).' },
  { id: 'upload', title: 'Upload documents to the centre', hint: 'Before the appointment, or bring them, depending on the centre.' },
  { id: 'attend', title: 'Attend the appointment', hint: 'Bring her passport and printed appointment confirmation.' },
  { id: 'decision', title: 'Decision received', hint: 'Usually around 3 weeks after the appointment.' },
  { id: 'flights', title: 'Book flights & insurance', hint: 'Only once the visa is granted. Check the visa dates match.' },
];
