/* All shared content lives here as data — one place to edit, no drifting copies.
   Wording follows the clients' rulings (Kate's email > CSV > scope plan):
   "over 4,500 participants", "5 relatively high-conflict countries",
   never "start the series" — it's always about starting a group. */

export const NAV = [
  ['', 'Home'],
  ['workbooks/', 'Workbooks'],
  ['research/', 'Research'],
  ['groups/', 'Groups'],
  ['about/', 'About'],
];

export const FOOTER_COLS = [
  {
    title: 'Get involved',
    links: [
      ['groups/', 'Start a Forgiveness Group'],
      ['https://hfh.fas.harvard.edu/global-forgiveness-movement', 'Community of Practice'], // TODO(wyatt): swap for the Zoom registration link Kate uses
      ['contact/', 'Contact'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['workbooks/', 'REACH Workbook'],
      ['workbooks/#church', 'Church edition'],
      ['workbooks/#receive', 'RECEIVE workbook'],
      ['workbook/', 'Interactive workbook'],
    ],
  },
  {
    title: 'The program',
    links: [
      ['about/', 'About the movement'],
      ['research/', 'Research'],
      ['my-path/', 'My Path'],
    ],
  },
];

/* Every video slot on the site. `src` is a placeholder embed of the clients'
   public YouTube playlist until the final Vimeo files land (Sept–Oct 2026);
   swapping one slot = editing one line here. */
const PLAYLIST =
  'https://www.youtube-nocookie.com/embed/videoseries?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE';

export const VIDEOS = {
  hero: {
    src: PLAYLIST,
    title: 'Global Forgiveness Movement films',
    caption: 'Placeholder: the clients’ current films. Final slot: a shortened opening film (Kate).',
  },
  groupFilm: {
    src: PLAYLIST,
    title: 'What a Forgiveness Group is',
    caption: 'Placeholder playlist. Final slot: the 6-minute “what a forgiveness group is” film.',
  },
  secularTrailer: {
    src: PLAYLIST,
    title: 'Forgiveness Group series trailer',
    caption: 'Placeholder playlist. Final slot: the secular series trailer (ready, awaiting file).',
  },
  churchTrailer: {
    src: PLAYLIST,
    title: 'Church Forgiveness Group series trailer',
    caption: 'Placeholder playlist. Final slot: the church series trailer (ready, awaiting file).',
  },
  research: {
    src: PLAYLIST,
    title: 'The research behind REACH forgiveness',
    caption: 'Placeholder playlist. Final slot: the 6-minute research film.',
  },
};

/* Program & group stats for the homepage band (CSV part 2: group stats up top,
   trial numbers down in the evidence section). */
export const GROUP_STATS = [
  { number: '6–12', label: 'people in a Forgiveness Group' },
  { number: '3 or 6', label: 'sessions — secular or church series' },
  { number: '1–1.5 hrs', label: 'per meeting, guided by ~10 min of video' },
  { number: '6', label: 'languages the workbook speaks' },
];

/* Upcoming events (Groups page). Dates from the program's current listings. */
export const EVENTS = [
  {
    title: 'Forgiveness Community of Practice',
    date: '4 September · 12pm ET · Zoom',
    detail: 'Everett Worthington, a pioneer of the psychology research on forgiveness',
    href: 'https://hfh.fas.harvard.edu/global-forgiveness-movement',
  },
  {
    title: 'Forgiveness Community of Practice',
    date: '2 October · 12pm ET · Zoom',
    detail: 'Monthly gathering for everyone spreading forgiveness',
    href: 'https://hfh.fas.harvard.edu/global-forgiveness-movement',
  },
  {
    title: 'Christianity & Public Health Conference',
    date: '24 October · Cambridge, MA',
    detail: 'In person at Harvard',
    href: 'https://hfh.fas.harvard.edu/events',
  },
];

/* Trial numbers, phrased the clients' way, with units on every figure. */
export const TRIAL = {
  participants: 'over 4,500 participants',
  countries: '5 relatively high-conflict countries',
  countriesList: 'Colombia, Hong Kong, Indonesia, South Africa, and Ukraine',
  effects: [
    { measure: 'Unforgiveness', change: '−0.53', unit: 'average score change', ci: '95% CI −0.58 to −0.47' },
    { measure: 'Depression symptoms', change: '−0.22', unit: 'average score change', ci: '95% CI −0.28 to −0.16' },
    { measure: 'Anxiety symptoms', change: '−0.21', unit: 'average score change', ci: '95% CI −0.27 to −0.15' },
  ],
  paper: 'https://doi.org/10.1136/bmjph-2023-000072',
  paperCitation: 'Ho MY, et al. BMJ Public Health, 2024',
};

/* Names render ONLY when permissionConfirmed is true (Kate is collecting
   permissions). Until then the site shows the role line alone. */
export const TESTIMONIALS = [
  {
    quote:
      'I loved how supportive everyone was. We drew where we would put our emotions. I drew a river, and I find myself imagining that river a lot now.',
    name: 'Jaden Kessler',
    role: 'Did the workbook in a student group',
    permissionConfirmed: false,
  },
  {
    quote:
      'I had preached on forgiveness while carrying severe bitterness toward people who had hurt me. The workbook changed that. My wife, my friends, and my church noticed an immediate, tangible difference.',
    name: 'Luke Proctor',
    role: 'Pastor who ran it with his church',
    permissionConfirmed: false,
  },
  {
    quote:
      'The distinction between decisional and emotional forgiveness affected me deeply. Sharing it with clients in my coaching practice, I have watched their willingness to engage with forgiveness increase.',
    name: 'Renatha',
    role: 'Uses it in her coaching practice',
    permissionConfirmed: false,
  },
];

/* Workbook downloads.
   Kate, 25 Aug: every edition can be downloaded from the Discover Forgiveness
   site today, but none of them have been designed yet and several people are
   producing different pieces, so the final files are not settled.
   TODO(wyatt): confirm the direct per-edition, per-language URLs and set them
   here. Left pointing at the programme page deliberately — an unverified deep
   link that 404s is worse than a landing page that works.
   Download clicks are counted per edition + language either way. */
const HFH = 'https://hfh.fas.harvard.edu/global-forgiveness-movement';
export const LANGUAGES = [
  ['en', 'English'],
  ['es', 'Español'],
  ['zh', '中文'],
  ['uk', 'Українська'],
  ['id', 'Bahasa Indonesia'],
  ['pt', 'Português (Brasil)'],
];

export const WORKBOOKS = [
  {
    id: 'reach',
    badge: 'Recommended · The tested edition',
    title: 'REACH Forgiveness Workbook',
    desc: 'The standard edition. About two to three hours across nine components: identify the hurt, learn the two kinds of forgiveness, work the five REACH steps, then extend what you have learned. This is the version used in the international trial.',
    pills: ['2–3 hours', 'Secular', '6 languages'],
    languages: true,
    url: HFH,
  },
  {
    id: 'church',
    badge: 'For churches & Christian groups',
    title: 'REACH Workbook, Adapted for Churches',
    desc: 'The same five steps, framed within Christian faith. Adds scripture engagement and lectio divina, prayer integration, and the offering of forgiveness to God. Built in sections of about an hour each — the basis of the 6-session series.',
    pills: ['6 sections', 'Christian', 'Group-ready'],
    languages: false,
    url: HFH,
  },
  {
    id: 'receive',
    badge: 'Christian · 3–4 hours',
    title: 'RECEIVE Divine Forgiveness Workbook',
    desc: 'A different direction of forgiveness. Where REACH is about forgiving another person, RECEIVE is for Christians who believe God forgives them but find it hard to feel it. Seven steps, from remembering God’s love through to a plan for keeping hold of it.',
    pills: ['7 steps', 'Christian'],
    languages: false,
    url: HFH,
  },
  {
    id: 'activity',
    badge: 'For communities',
    title: 'Community-Wide Forgiveness Activity Book',
    desc: 'For anyone running forgiveness work at the scale of a campus, a congregation, or a town — activities you can adapt and combine into a campaign.',
    pills: ['Campaign-scale'],
    languages: false,
    url: HFH,
  },
];

/* The two Forgiveness Group series — session breakdowns exactly as Kate's
   email gives them. Sessions are video-guided group meetings; participants do
   the workbook lessons on their own before each meeting. */
export const SERIES = {
  secular: {
    id: 'secular',
    name: '3-Session Forgiveness Group Series',
    workbook: 'REACH Forgiveness Workbook',
    framing: 'Secular — any setting, any faith or none',
    videoKey: 'secularTrailer',
    sessions: [
      { n: 1, title: 'Getting started', detail: 'Learning about forgiveness research and forgiveness groups' },
      { n: 2, title: 'Lessons 1–6', detail: 'Education, guided exercise, and discussion questions' },
      { n: 3, title: 'Lessons 7–12', detail: 'Education, guided exercise, and discussion questions' },
    ],
  },
  church: {
    id: 'church',
    name: '6-Session Forgiveness Group Series for Churches',
    workbook: 'REACH Workbook, Adapted for Churches',
    framing: 'Christian — scripture, prayer, and lectio divina woven through',
    videoKey: 'churchTrailer',
    sessions: [
      { n: 1, title: 'Getting started', detail: 'Learning about forgiveness research and forgiveness groups' },
      { n: 2, title: 'Lessons 1 & 2', detail: 'Scripture, education, guided exercise, and discussion questions' },
      { n: 3, title: 'Lessons 3 & 4', detail: 'Scripture, education, guided exercise, and discussion questions' },
      { n: 4, title: 'Lessons 5 & 6', detail: 'Scripture, education, guided exercise, and discussion questions' },
      { n: 5, title: 'Lessons 7 & 8', detail: 'Scripture, education, guided exercise, and discussion questions' },
      { n: 6, title: 'Lessons 9–12', detail: 'Scripture, education, guided exercise, and discussion questions' },
    ],
  },
};

export const PUBLICATIONS = [
  {
    title: 'International REACH forgiveness intervention: a multisite randomised controlled trial',
    meta: 'Ho MY et al. · BMJ Public Health · 2024',
    doi: 'https://doi.org/10.1136/bmjph-2023-000072',
  },
  {
    title: 'Development of the self-directed RECEIVE Forgiveness workbook',
    meta: 'Cowden RG et al. · Frontiers in Psychology · 2025',
    doi: 'https://doi.org/10.3389/fpsyg.2025.1646103',
  },
  {
    title: 'Forgiveness of others and subsequent health and well-being in mid-life',
    meta: 'Long KN et al. · BMC Psychology · 2020',
    doi: 'https://doi.org/10.1186/s40359-020-00470-w',
  },
  {
    title: 'Religiously or spiritually-motivated forgiveness and subsequent health and well-being among young adults',
    meta: 'Chen Y et al. · Journal of Positive Psychology · 2019',
    doi: 'https://doi.org/10.1080/17439760.2018.1519591',
  },
  {
    title: 'Spiritually motivated self-forgiveness and divine forgiveness among middle-aged female nurses',
    meta: 'Long KN et al. · Frontiers in Psychology · 2020',
    doi: 'https://doi.org/10.3389/fpsyg.2020.01337',
  },
];

export const PEOPLE = [
  { initials: 'TV', name: 'Tyler J. VanderWeele', role: 'Director, Human Flourishing Program', line: 'Led the program’s side of the international trial and directs its research on flourishing.' },
  { initials: 'RC', name: 'Richard G. Cowden', role: 'Research Scientist', line: 'Co-authored the international trial, led development of the RECEIVE workbook, and co-adapted the current REACH workbooks.' },
  { initials: 'KJ', name: 'Kate Jackson-Meyer', role: 'Research Associate', line: 'Leads the Global Forgiveness Movement. Her scholarship examines forgiveness and restoration in contexts of moral conflict and tragedy.' },
  { initials: 'EW', name: 'Everett L. Worthington Jr.', role: 'Affiliate · Originator of the REACH model', line: 'Developed the REACH Forgiveness model and the workbooks on which this work is built.' },
  /* Added on Kate's ruling (25 Aug). Surnames and one-sentence descriptions are
     hers to send — `line` stays empty until they arrive rather than us inventing
     one, and the renderer simply omits the sentence while it is blank. */
  { initials: 'C', name: 'Cooper', role: 'Forgiveness Group leader', line: '' },
  { initials: 'Y', name: 'Yuna', role: 'Forgiveness Group leader', line: '' },
];

export const REACH_STEPS = [
  { letter: 'R', word: 'Recall', line: 'the hurt and the emotions with it' },
  { letter: 'E', word: 'Empathize', line: 'with the one who hurt you' },
  { letter: 'A', word: 'Altruistic gift', line: 'of forgiveness offered freely' },
  { letter: 'C', word: 'Commit', line: 'voluntarily, and record it' },
  { letter: 'H', word: 'Hold on', line: 'through the difficult times' },
];
