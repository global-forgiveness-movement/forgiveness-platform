/* All shared content lives here as data — one place to edit, no drifting copies.
   Wording follows the clients' rulings (Kate's email > CSV > scope plan):
   "over 4,500 participants", "6 sites in 5 countries", never "start the
   series" — it's always about starting a group.
   NOTE: "5 relatively high-conflict countries" was the CSV's phrasing and is
   RETIRED — Kate, 18 Sep: "Either way, eliminate 'relatively high-conflict.'"
   Groups are FACILITATED, not led (same email); "leader" is retired too. */

/* The HFP's Global Forgiveness Movement page — ONE constant for every link to
   it (footer, events, workbook fallback). HFP migrated their site around
   2026-09: the old /global-forgiveness-movement path 404s with NO redirect;
   /post/... is the page's current address.
   NOTE: contact/index.html and groups/index.html carry this URL verbatim as
   static anchors (no render path reaches them) — on any future HFP move,
   grep hfh.fas.harvard.edu across *.html too, not just this file. */
const HFH = 'https://hfh.fas.harvard.edu/post/global-forgiveness-movement';

/* The Human Flourishing Program's own front page — used where we credit the
   program rather than the movement (About, footer). */
const HFP = 'https://hfh.fas.harvard.edu/';

/* Forgiveness Community of Practice — the Zoom registration Kate uses
   (her 18 Sep email §3 and §8). This replaces the program-page stand-in
   that the 1 Sep ruling left in place as a marker. */
const COP = 'https://harvard.zoom.us/meeting/register/e5vX3r1TTfO_o95o6QfoBw#/registration';

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
      [COP, 'Community of Practice'],
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
    caption: 'Placeholder: the clients’ current films. Final slot: the non-religious promo film (Kate, 18 Sep).',
  },
  groupFilm: {
    src: PLAYLIST,
    title: 'What a Forgiveness Group is',
    caption: 'Placeholder playlist. Final slot: the “HFP Forgiveness” film (Kate, 18 Sep).',
  },
  secularTrailer: {
    src: PLAYLIST,
    title: 'Forgiveness Group series trailer',
    caption: 'Placeholder playlist. Final slot: the non-religious promo film — the same film as the home page until a group-specific one exists (Kate, 18 Sep).',
  },
  churchTrailer: {
    src: PLAYLIST,
    title: 'Church Forgiveness Group series trailer',
    caption: 'Placeholder playlist. Final slot: the religious promo film (Kate, 18 Sep).',
  },
  research: {
    src: PLAYLIST,
    title: 'The research behind REACH forgiveness',
    caption: 'Placeholder playlist. Final slot: the research film, hi-res (Kate, 18 Sep).',
  },
};

/* Program & group stats for the homepage band (CSV part 2: group stats up top,
   trial numbers down in the evidence section). */
export const GROUP_STATS = [
  { number: '6–12', label: 'people in a Forgiveness Group' },
  { number: '1–1.5 hrs', label: 'per meeting, guided by ~10 min of video' },
  { number: '6', label: 'languages the workbook speaks' },
];

/* Upcoming events (Groups page). Dates from the program's current listings. */
export const EVENTS = [
  {
    title: 'Forgiveness Community of Practice',
    date: '4 September · 12pm ET · Zoom',
    detail: 'Everett Worthington, a pioneer of the psychology research on forgiveness',
    href: COP,
  },
  {
    title: 'Forgiveness Community of Practice',
    date: '2 October · 12pm ET · Zoom',
    detail: 'Monthly gathering for everyone spreading forgiveness',
    href: COP,
  },
  {
    title: 'Christianity & Public Health Conference',
    date: '24 October · Cambridge, MA',
    detail: 'In person at Harvard',
    href: 'https://hfh.fas.harvard.edu/post/events',
  },
];

/* Trial numbers, phrased the clients' way, with units on every figure. */
export const TRIAL = {
  participants: 'over 4,500 participants',
  countries: '6 sites in 5 countries',
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
   All nine files are hosted in this repo under assets/workbooks/: the five
   REACH translations (es, zh, uk, id, pt — Kate's 26 Aug email §2, with Ev's
   permission; Wyatt ruled 27 Aug: host in-repo, ship as-is, no conversion)
   and, since 2026-09-01, the four English-edition PDFs, taken byte-identical
   from the HFP program page. Being ours, every link is verified by
   construction — which fully resolves the 25 Aug ruling-1 deep-link concern
   ("an unverified deep link that 404s is worse than a landing page that
   works") for this section.
   The HFH page (constant at the top of this file) remains only as the
   never-taken fallback in applyLang — its 2026-09 move is what broke the
   four edition downloads and prompted hosting them here.
   Download clicks are counted per edition + language either way. */
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
    pills: ['2–3 hours', 'Secular', '6 languages', 'Group-ready'],
    languages: true,
    url: HFH,
    /* Hosted files, keyed by language code. */
    files: {
      en: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-English.pdf', format: 'PDF', size: '2.7 MB' },
      es: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Spanish.docx', format: 'Word', size: '4.3 MB' },
      zh: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Chinese.docx', format: 'Word', size: '2.3 MB' },
      uk: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx', format: 'Word', size: '1.2 MB' },
      id: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Indonesian.docx', format: 'Word', size: '0.9 MB' },
      pt: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Portuguese.docx', format: 'Word', size: '0.9 MB' },
    },
  },
  {
    id: 'church',
    badge: 'For churches & Christian groups',
    title: 'REACH Forgiveness Workbook, Adapted for Churches',
    desc: 'The same five steps, framed within Christian faith. Adds scripture engagement and lectio divina, prayer integration, and the offering of forgiveness to God. Built in sections of about an hour each — the basis of the 6-session series.',
    pills: ['Christian', 'Group-ready'],
    languages: false,
    url: HFH,
    files: {
      en: { path: 'assets/workbooks/REACH-Workbook-Adapted-for-Churches.pdf', format: 'PDF', size: '3.1 MB' },
    },
  },
  {
    id: 'receive',
    badge: 'Christian · 3–4 hours',
    title: 'RECEIVE Divine Forgiveness Workbook',
    desc: 'A different direction of forgiveness. Where REACH is about forgiving another person, RECEIVE is for Christians who believe God forgives them but find it hard to feel it. Seven steps, from remembering God’s love through to a plan for keeping hold of it.',
    pills: ['7 steps', 'Christian'],
    languages: false,
    url: HFH,
    files: {
      en: { path: 'assets/workbooks/RECEIVE-Divine-Forgiveness-Workbook.pdf', format: 'PDF', size: '2.9 MB' },
    },
  },
  {
    id: 'activity',
    badge: 'For communities',
    title: 'Community-Wide Forgiveness Activity Book',
    desc: 'For anyone running forgiveness work at the scale of a campus, a congregation, or a town — activities you can adapt and combine into a campaign.',
    pills: ['Campaign-scale'],
    languages: false,
    url: HFH,
    files: {
      en: { path: 'assets/workbooks/Community-Wide-Forgiveness-Activity-Book.pdf', format: 'PDF', size: '2.3 MB' },
    },
  },
  /* Muslim-adapted edition: Kate is sending the final version (her 26 Aug
     email §2). When it arrives, its entry goes here — same shape as above,
     with a files map if we host it. No placeholder card until then. */
];

/* ONE place that turns (edition, language) into everything a download button
   needs: the href, the visible label, whether it downloads in place or opens
   the landing page, and the tag we count. The home page and /workbooks/ both
   render their buttons from this, so a new hosted file is one data edit.
   `prefix` is how far the calling page sits from the site root. */
export function downloadFor(id, code = 'en', prefix = '') {
  const w = WORKBOOKS.find((x) => x.id === id);
  if (!w) return null;
  const file = w.files?.[code];
  return file
    ? { href: `${prefix}${file.path}`, label: `Download (${file.format}, ${file.size})`, direct: true, tag: `${id}:${code}` }
    : { href: w.url, label: 'Download PDF', direct: false, tag: `${id}:${code}` };
}

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
    workbook: 'REACH Forgiveness Workbook, Adapted for Churches',
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
  /* Added 18 Sep from the three studies at the top of the HFP's GFM page
     (Kate's email §5 says "2 additional studies" — there are three, all new to
     us, all Cowden et al.; flagged back to her). Every field below is taken
     from Crossref for the DOI, not from the page's summary. */
  {
    title: 'Longitudinal associations of dispositional forgivingness with multidimensional well-being: a two-wave outcome-wide analysis in the Global Flourishing Study',
    meta: 'Cowden RG et al. · npj Mental Health Research · 2026',
    doi: 'https://doi.org/10.1038/s44184-026-00187-5',
  },
  {
    title: 'Childhood predictors of dispositional forgivingness in adulthood: a cross-national analysis with 22 countries',
    meta: 'Cowden RG et al. · Applied Research in Quality of Life · 2025',
    doi: 'https://doi.org/10.1007/s11482-025-10451-z',
  },
  {
    title: 'Sociodemographic variation in dispositional forgivingness: a cross-national analysis with 22 countries',
    meta: 'Cowden RG et al. · Scientific Reports · 2025',
    doi: 'https://doi.org/10.1038/s41598-024-82502-8',
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

/* The About-page roster, sourced per Kate's 26 Aug email
   (.planning/qa/2026-08-26-KATE-EMAIL.md). Bios are verbatim from each
   person's own public page (HFP team pages; Ev's site; Cooper's page),
   trimmed to the bio proper — never paraphrased. `photo` is set only when
   the file exists in assets/people/; without it the initials circle shows.
   `bio` paragraphs are separated by blank lines (\n\n).
   `line` is KEPT but no longer rendered: Kate, 18 Sep — "I like the pithy
   descriptions ... but I think we should just have only their titles and then
   people can click to read more." Kept rather than deleted because the copy is
   curated and the ruling could reverse; the About page is the only reader.
   Roles carry "Human Flourishing Program, Harvard University" per the same
   email — factual attribution, which Richard's 25 Aug "no Harvard in site
   chrome" ruling expressly allows. The chrome itself stays HFP-only. */
export const PEOPLE = [
  {
    slug: 'tyler-vanderweele',
    photo: 'assets/people/tyler-vanderweele.jpg',
    initials: 'TV',
    name: 'Tyler J. VanderWeele',
    role: 'Director, Human Flourishing Program, Harvard University',
    line: 'Led the program’s side of the international trial and directs its research on flourishing.',
    bio: 'Tyler J. VanderWeele, Ph.D., is the John L. Loeb and Frances Lehman Loeb Professor of Epidemiology in the Departments of Epidemiology and Biostatistics at the Harvard T.H. Chan School of Public Health, and Director of the Human Flourishing Program and Co-Director of the Initiative on Health, Spirituality, and Religion at Harvard University.\n\nHe holds degrees from the University of Oxford, University of Pennsylvania, and Harvard University in mathematics, philosophy, theology, finance, and biostatistics. His methodological research is focused on theory and methods for distinguishing between association and causation in the biomedical and social sciences and, more recently, on psychosocial measurement theory. His empirical research spans psychiatric and social epidemiology; the science of happiness and flourishing; and the study of religion and health.\n\nHe is the recipient of the 2017 Presidents’ Award from the Committee of Presidents of Statistical Societies (COPSS). Dr. VanderWeele has published over 500 papers in peer-reviewed journals; is author of the books Explanation in Causal Inference (2015), Modern Epidemiology (2021), Measuring Well-Being (2021), Handbook of Religion and Health (2023), and A Theology of Health (2024); and writes a regular blog, posting on topics related to human flourishing.',
    link: 'https://hfh.fas.harvard.edu/team/tyler-vanderweele',
  },
  {
    slug: 'isaiah-baldissera',
    photo: 'assets/people/isaiah-baldissera.jpg',
    initials: 'IB',
    name: 'Isaiah Baldissera',
    role: 'Communications Manager, Human Flourishing Program, Harvard University',
    line: 'Leads communications and external affairs, with a background in digital design and product development.',
    bio: 'Isaiah Baldissera, Ed.M., leads communications and external affairs at the Human Flourishing Program. His background is in digital design, product development, and UI/UX. Prior to his current position, he helped build the Harvard Project on Workforce, a joint initiative between Harvard Business School, the Harvard Kennedy School, and the Harvard Graduate School of Education. Isaiah holds a master’s degree in Education Technology from Harvard University and a bachelors degree in Economics and Business Administration from Simon Fraser University.',
    link: 'https://hfh.fas.harvard.edu/team/ib',
  },
  {
    slug: 'reece-brown',
    photo: 'assets/people/reece-brown.jpg',
    initials: 'RB',
    name: 'Reece Brown',
    role: 'Associate Director of Impact, Human Flourishing Program, Harvard University',
    line: 'Advances the program’s research across business, education, religion, and public policy.',
    bio: 'Reece Brown is the Associate Director of Impact and works to advance the program’s initiatives to drive stakeholder transformation and public engagement. He focuses on the application and dissemination of the program’s research across sectors including business, education, religion, and public policy. His career began in investment analysis before joining Arthur Brooks at the Harvard Kennedy School and Harvard Business School. Reece launched the Leadership & Happiness Laboratory with Professor Brooks where he led research and social impact initiatives around the world. Reece holds a BA in Economics from Gordon College and a Master’s of Applied Positive Psychology from the University of Pennsylvania.',
    link: 'https://hfh.fas.harvard.edu/team/reece-brown',
  },
  {
    slug: 'richard-cowden',
    photo: 'assets/people/richard-cowden.jpg',
    initials: 'RC',
    name: 'Richard G. Cowden',
    role: 'Research Scientist, Human Flourishing Program, Harvard University',
    line: 'Co-authored the international trial, led development of the RECEIVE workbook, and co-adapted the current REACH workbooks.',
    bio: 'Richard G. Cowden, Ph.D., is a social-personality psychologist and Research Scientist with the Human Flourishing Program at Harvard University and the Department of Epidemiology at the Harvard T.H. Chan School of Public Health. He is interested in a wide range of psychological, social, and religious/spiritual dynamics that shape adaptive functioning, personal growth, and well-being. Much of his current research agenda focuses on topics related to adversity (e.g., suffering), character strengths and virtues (e.g., forgiveness), and religion/spirituality (e.g., religious/spiritual struggles), and their implications for health and well-being in diverse cultures and contexts. He has written and contributed to numerous scholarly articles, book chapters, and books that address various aspects of human flourishing in a wide range of populations. Through interdisciplinary engagement, he is also involved in developing and disseminating interventions designed to promote human flourishing across various cultural contexts.',
    link: 'https://hfh.fas.harvard.edu/team/richard-cowden',
  },
  {
    slug: 'cooper-harris',
    photo: 'assets/people/cooper-harris.jpg',
    initials: 'CH',
    name: 'Cooper Harris',
    role: 'Graduate Assistant, Human Flourishing Program, Harvard University',
    line: 'Studying counseling at Boston University, with a focus on sport and performance psychology.',
    bio: 'Cooper Harris is currently pursuing his Master’s of Education in counseling with a focus on sport/performance psychology at Boston University. Harris graduated from the University of Rochester in 2025 with a Bachelor of Arts in psychology and religion. He was the president of the club baseball team, a member of the Medallion Program, worked with the Mindful University Project, and served as a Jewish learning fellow. Harris is also a student delegate for the Association of Applied Sport Psychology and was a psychology honors research student at the University of Rochester.',
  },
  {
    slug: 'kate-jackson-meyer',
    photo: 'assets/people/kate-jackson-meyer.jpg',
    initials: 'KJ',
    name: 'Kate Jackson-Meyer',
    role: 'Research Associate, Human Flourishing Program, Harvard University',
    line: 'Leads the Global Forgiveness Movement. Her scholarship examines forgiveness and restoration in contexts of moral conflict and tragedy.',
    bio: 'Kate Jackson-Meyer, Ph.D., is a Research Associate at the Human Flourishing Program at Harvard University and an Affiliate of the Harvard Medical School Center for Bioethics. Her research focuses on the role of forgiveness and restoration in supporting individual and communal flourishing, particularly in contexts of moral conflict and tragedy. Her work has been published in numerous outlets, including The American Journal of Bioethics and The Journal of Moral Theology. She is the author of Tragic Dilemmas in Christian Ethics (Georgetown University Press, 2022) and she serves on the editorial board of the Journal of the Society of Christian Ethics. She earned a Ph.D. in theological ethics from Boston College, an M.A.R. in ethics from Yale Divinity School, and a B.A. in biology and religion from the University of Southern California.',
    link: 'https://hfh.fas.harvard.edu/team/kate-jackson-meyer',
  },
  {
    slug: 'suzanne-ouyang',
    photo: 'assets/people/suzanne-ouyang.jpg',
    initials: 'SO',
    name: 'Suzanne Ouyang',
    role: 'Associate Director of Special Projects, Human Flourishing Program, Harvard University',
    line: 'Strategic partner in the program’s projects, including the Global Flourishing Study.',
    bio: 'Suzanne Ouyang is the Associate Director of Special Projects, serving as a strategic partner to the Program Director in the development of the program’s projects and initiatives, including the Global Flourishing Study and the Academic Flourishing Initiative. Prior to coming to the Human Flourishing Program, she worked in project management for the development of the O’Donnell School of Public Health at the University of Texas Southwestern Medical Center. She has worked in research coordination and non-profit management. She holds an S.T.B. from the Pontifical University of the Holy Cross in Rome and a B.S. in Biological Sciences from the University of Notre Dame.',
    link: 'https://hfh.fas.harvard.edu/team/suzanne-ouyang',
  },
  {
    slug: 'sophie-frushell',
    photo: 'assets/people/sophie-frushell.jpg',
    initials: 'SF',
    name: 'Sophie Frushell',
    role: 'Program Administrator, Human Flourishing Program, Harvard University',
    line: 'Runs the program’s administration, with a background spanning research, operations, and education.',
    bio: 'Sophie Frushell serves as Program Administrator for the Human Flourishing Program. Her professional background spans research, program management, and operations, including supporting global research and educational programming as Operations Coordinator at Research Schools International.\n\nA former Fulbright grantee in the Dominican Republic, she brings experience working across cultures and advancing initiatives in education, community health, and youth development. Originally from Massachusetts, Sophie considers the Dominican Republic her second (and warmer) home.\n\nSophie holds an Ed.M. in Educational Leadership from the Harvard Graduate School of Education, and a B.A. in International Studies from Boston College.',
    link: 'https://hfh.fas.harvard.edu/team/sophie-frushell',
  },
  {
    slug: 'ying-chen',
    photo: 'assets/people/ying-chen.jpg',
    initials: 'YC',
    name: 'Ying Chen',
    role: 'Research Scientist, Human Flourishing Program, Harvard University',
    line: 'Studies pathways to flourishing — the psychosocial assets that help people flourish across the life course.',
    bio: 'Ying Chen, ScD, is a Research Scientist with the Human Flourishing Program at Harvard University.\n\nShe specializes in social epidemiology, with research interests in understanding pathways to flourishing. Her work focuses particularly on identifying psychosocial assets that may help promote flourishing across the life course.\n\nYing’s research agenda centers on understanding the role of positive psychological attributes, social relationships, and community participation in promoting flourishing, and advancing methodological approaches to strengthen causal inference in observational research. She has authored over 80 peer-reviewed articles and book chapters on these topics.\n\nThrough interdisciplinary collaboration and population-based research, Ying is also involved in projects that inform evidence-based strategies to assess and cultivate well-being across diverse populations.\n\nShe earned her ScD in Social and Behavioral Sciences from the Harvard T.H. Chan School of Public Health.',
    link: 'https://hfh.fas.harvard.edu/team/ying-chen',
  },
  {
    slug: 'everett-worthington',
    photo: 'assets/people/everett-worthington.jpg',
    initials: 'EW',
    name: 'Everett L. Worthington Jr.',
    role: 'Affiliate · Originator of the REACH model',
    line: 'Developed the REACH Forgiveness model and the workbooks on which this work is built.',
    bio: 'Everett Worthington is Commonwealth Professor Emeritus since his retirement from Virginia Commonwealth University on October 1, 2017. He is still affiliated with the Department of Psychology. His research and writing focus on forgiveness and other virtues, religion and spirituality, and issues related to marriage and family. His mission is to help individuals (every heart), couples and families (every home), and even communities and countries (every homeland) forgive.\n\nEverett was counseling couples professionally in the mid-1980s when he first became interested in the concept of forgiveness, and he began studying the topic scientifically in 1990. Since then, he has been a leader in the field of forgiveness research. From 1998 to 2005, he directed A Campaign for Forgiveness Research, a nonprofit organization that, during that time, awarded more than $6 million to studies on forgiving. He has also worked to help nurture researchers in other countries.\n\nAfter the murder of his mother in 1996, Everett began thinking about how the practice of forgiveness relates to justice, faith, and virtue—a main theme of his recent work. While he forgave the murderer, as did his brother and sister, the emotional fallout was devastating, and in 2005, his brother committed suicide. In addition to studying forgiveness of others, Everett drew on his own feelings of guilt and self-condemnation, and added the study of self-forgiveness to his interests.',
    link: 'https://www.evworthington-forgiveness.com/about',
  },
];

/* The eight Forgiveness Group Guidelines, verbatim from Kate's 18 Sep email.
   These are the clients' own words — do not paraphrase or re-order them. */
export const GROUP_GUIDELINES = [
  'Forgiveness is a choice.',
  'We don’t recommend using the REACH Forgiveness Workbook or Forgiveness Group for extreme trauma.',
  'The Forgiveness Group is not therapy. It is not a replacement for professional support.',
  'Start your forgiveness journey with a small hurt.',
  'Keep confidentiality about others’ personal information shared in the Forgiveness Group.',
  'You will not be asked to share about your specific hurt with the Forgiveness Group.',
  'Participate to the extent you would like.',
  'Go through the lessons in order.',
];

export const REACH_STEPS = [
  { letter: 'R', word: 'Recall', line: 'the hurt and the emotions with it' },
  { letter: 'E', word: 'Empathize', line: 'with the one who hurt you' },
  { letter: 'A', word: 'Altruistic gift', line: 'of forgiveness offered freely' },
  { letter: 'C', word: 'Commit', line: 'voluntarily, and record it' },
  { letter: 'H', word: 'Hold on', line: 'through the difficult times' },
];
