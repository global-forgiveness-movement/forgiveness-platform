/* church.js — the REACH Forgiveness Workbook, Adapted for Churches, as an
   overlay on content.js (SOW, 5 Nov: an interactive church workbook that works
   like the current one).

   Source: "Your Path to REACH Forgiveness … Adapted for Use in Churches" (the
   PDF this site hosts, assets/workbooks/REACH-Workbook-Adapted-for-Churches.pdf).
   Compared with the REACH PDF line by line (9 Nov): the twelve lessons and
   their exercises are the same, word for word, except one sentence in Lesson 1.
   What the church edition adds is three Prayer & Reflection sections:
     Opening — before Lesson 1 (prayers, Scripture, Forgiveness Prayer)
     Part 2  — after Lesson 6 (prayers, Forgiveness Prayer)
     Closing — after Lesson 12 (prayers, Scripture, each with a "then and now"
               look back at the opening, and a closing Forgiveness Prayer)
   plus one changed sentence in the letter.

   ONEHELM: nothing here copies a lesson. The REACH lessons are reused as they
   are and the prayer sections are added as steps — the opening at the start of
   Lesson 1, Part 2 at the end of Lesson 6, the closing at the end of Lesson 12 —
   so there are still twelve lessons and My Path's "N of 12" stays true.
   The text is the PDF's own, with two small changes for Kate's proofread
   (SOW: she proofreads by 18 Dec): the Nouwen citation's "HaperOne" is spelled
   HarperOne, and the parable's nested quotation marks follow the NRSV's own
   (double, single, double) where the PDF uses single marks throughout. */

const p = (html) => ({ t: 'p', html });
const lead = (html) => ({ t: 'lead', html });
const prompt = (html) => ({ t: 'prompt', html });
const heading = (text) => ({ t: 'heading', text });
const badge = (text) => ({ t: 'badge', text });
const text = (key, o = {}) => ({ t: 'text', key, rows: 5, ...o });
const recall = (key, label) => ({ t: 'recall', key, label });

/* ---------------------------------------------------------------- the words */
const LET_US_PRAY = (andInDoing) => [
  { t: 'scripttitle', text: 'Let Us Pray' },
  lead(`Take a moment to sit in silence. You may want to focus on your breathing and/or close your eyes. For the moment, try to put aside your anxieties, worries, and distractions. Ready your heart to be open to the Spirit working within you.`),
  p(andInDoing
    ? `You are invited to pray the following, and in doing so, to reflect on God’s awesome love and endless forgiveness. Pray and read slowly, being attentive to how the words touch your heart and make you feel. Pause on any words or phrases that impact you deeply, noting how they make you feel and what they stir inside of you.`
    : `You are invited to pray the following and to reflect on God’s awesome love and endless forgiveness. Pray and read slowly, being attentive to how the words touch your heart and make you feel. Pause on any words or phrases that impact you deeply, noting how they make you feel and what they stir inside of you.`),
];

const PRAYERS = [
  heading('Prayer'),
  p(`<b>Pray as Jesus taught us:</b>`),
  { t: 'note', html: `Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done, on earth, as it is in heaven. Give us this day our daily bread and forgive us our trespasses as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.` },
  p(`<b>Pray with Henri Nouwen, a Catholic priest, psychologist, writer, and professor:</b>`),
  { t: 'quote', text: `To forgive another person from the heart is an act of liberation. We set that person free from the negative bonds that exist between us. We say, ‘I no longer hold your offense against you.’ But there is more. We also free ourselves from the burden of being the ‘offended one.’ As long as we do not forgive those who have wounded us, we carry them with us or, worse, pull them as a heavy load. The great temptation is to cling in anger to our enemies and then define ourselves as being offended and wounded by them. Forgiveness, therefore, liberates not only the other but also ourselves. It is the way to the freedom of the children of God.` },
  p(`<span class="tiny muted">From Henri Nouwen, <i>Bread for the Journey</i>, (New York: HarperOne, 2006).</span>`),
];

/* `label` names each answer in the "Download my responses" file. */
const PRAYER_REFLECTION = (key, label) => [
  heading('Reflection'),
  prompt(`While you were praying, what words or phrases caused you to pause, if any? How did they make you feel? Why do you think these words or phrases elicited those reactions?`),
  text(key, { prompt: `${label}: the words in the prayers that caused you to pause` }),
];

/* Luke 15:11-32, NRSVCE, as the PDF prints it. */
const PARABLE = [
  heading('The Parable of the Prodigal and His Brother (Luke 15:11-32)'),
  p(`<sup>11</sup> Then Jesus said, “There was a man who had two sons. <sup>12</sup> The younger of them said to his father, ‘Father, give me the share of the property that will belong to me.’ So he divided his property between them. <sup>13</sup> A few days later the younger son gathered all he had and traveled to a distant country, and there he squandered his property in dissolute living. <sup>14</sup> When he had spent everything, a severe famine took place throughout that country, and he began to be in need. <sup>15</sup> So he went and hired himself out to one of the citizens of that country, who sent him to his fields to feed the pigs. <sup>16</sup> He would gladly have filled himself with the pods that the pigs were eating; and no one gave him anything. <sup>17</sup> But when he came to himself he said, ‘How many of my father’s hired hands have bread enough and to spare, but here I am dying of hunger! <sup>18</sup> I will get up and go to my father, and I will say to him, “Father, I have sinned against heaven and before you; <sup>19</sup> I am no longer worthy to be called your son; treat me like one of your hired hands.”’ <sup>20</sup> So he set off and went to his father. But while he was still far off, his father saw him and was filled with compassion; he ran and put his arms around him and kissed him. <sup>21</sup> Then the son said to him, ‘Father, I have sinned against heaven and before you; I am no longer worthy to be called your son.’ <sup>22</sup> But the father said to his slaves, ‘Quickly, bring out a robe—the best one—and put it on him; put a ring on his finger and sandals on his feet. <sup>23</sup> And get the fatted calf and kill it, and let us eat and celebrate; <sup>24</sup> for this son of mine was dead and is alive again; he was lost and is found!’ And they began to celebrate.`),
  p(`<sup>25</sup> “Now his elder son was in the field; and when he came and approached the house, he heard music and dancing. <sup>26</sup> He called one of the slaves and asked what was going on. <sup>27</sup> He replied, ‘Your brother has come, and your father has killed the fatted calf, because he has got him back safe and sound.’ <sup>28</sup> Then he became angry and refused to go in. His father came out and began to plead with him. <sup>29</sup> But he answered his father, ‘Listen! For all these years I have been working like a slave for you, and I have never disobeyed your command; yet you have never given me even a young goat so that I might celebrate with my friends. <sup>30</sup> But when this son of yours came back, who has devoured your property with prostitutes, you killed the fatted calf for him!’ <sup>31</sup> Then the father said to him, ‘Son, you are always with me, and all that is mine is yours. <sup>32</sup> But we had to celebrate and rejoice, because this brother of yours was dead and has come to life; he was lost and has been found.’”`),
  p(`<span class="tiny muted">(NRSVCE from www.biblegateway.com)</span>`),
];

const SCRIPTURE = (asBefore) => [
  { t: 'scripttitle', text: 'Scripture Reading' },
  lead(`Read the following Scripture passage from Luke 15:11-32, and then answer the reflection questions. As ${asBefore ? 'before' : 'earlier'}, read slowly and be attentive to how the words touch your heart and make you feel. Pause on any words or phrases that impact you deeply, noting how they make you feel and what they stir inside of you.`),
  ...PARABLE,
];

const SCRIPTURE_REFLECTION = (prefix, label) => [
  heading('Reflection'),
  prompt(`Who, if anyone, do you relate to most in the passage and why?`),
  text(`${prefix}-relate-most`, { rows: 4, prompt: `${label}: who you relate to most in Luke 15` }),
  prompt(`Who, if anyone, do you relate to the least in the passage and why?`),
  text(`${prefix}-relate-least`, { rows: 4, prompt: `${label}: who you relate to least in Luke 15` }),
  prompt(`What words or phrases caused you to pause, if any? How did they make you feel? Why do you think these words or phrases elicited such a reaction in you?`),
  text(`${prefix}-scripture-words`, { rows: 4, prompt: `${label}: the words in Luke 15 that caused you to pause` }),
];

const FORGIVENESS_PRAYER = (closing) => [
  { t: 'scripttitle', text: 'Forgiveness Prayer' },
  { t: 'note', html: closing
    ? `Dear good and gracious God,<br>I know that you are all loving and radically forgiving.<br>I offer to you my hurt <i>[recall the hurt that you have worked through]</i>. I ask for your help, guidance, wisdom, and strength as this experience comes to an end.<br>Most of all, I ask that I may always know your love truly and deeply.<br><i>[Add any other prayers of thanks or petitions].</i><br>Amen`
    : `Dear good and gracious God,<br>I know that you are all loving and radically forgiving.<br>I offer to you my hurt <i>[recall the hurt that you are working through]</i>. I ask for your help, guidance, wisdom, and strength as I proceed through this experience.<br>Most of all, I ask that I may always know your love truly and deeply.<br><i>[Add any other prayers of thanks or petitions].</i><br>Amen` },
  heading('Reflection'),
  prompt(closing ? `Write down any closing thoughts or reflections.` : `Note any additional thoughts or reflections if you feel moved to do so.`),
];

/* ---------------------------------------------------------------- the three sections */
const section = (label) => badge(`${label} Prayer & Reflection`);

const OPENING = [
  { name: 'Opening Prayer & Reflection', blocks: [section('Opening'), ...LET_US_PRAY(false), ...PRAYERS, ...PRAYER_REFLECTION('church-open-prayer', 'Opening')] },
  { name: 'Scripture Reading', blocks: [section('Opening'), ...SCRIPTURE(false), ...SCRIPTURE_REFLECTION('church-open', 'Opening')] },
  { name: 'Forgiveness Prayer', blocks: [section('Opening'), ...FORGIVENESS_PRAYER(false), text('church-open-forgiveness-prayer', { prompt: 'Opening: after the Forgiveness Prayer' })] },
];

const PART_2 = [
  { name: 'Part 2 Prayer & Reflection', blocks: [section('Part 2'), ...LET_US_PRAY(true), ...PRAYERS, ...PRAYER_REFLECTION('church-part2-prayer', 'Part 2')] },
  { name: 'Forgiveness Prayer', blocks: [section('Part 2'), ...FORGIVENESS_PRAYER(false), text('church-part2-forgiveness-prayer', { prompt: 'Part 2: after the Forgiveness Prayer' })] },
];

const CLOSING = [
  { name: 'Closing Prayer & Reflection', blocks: [section('Closing'), ...LET_US_PRAY(true), ...PRAYERS, ...PRAYER_REFLECTION('church-close-prayer', 'Closing')] },
  { name: 'Then and Now: the Prayers', blocks: [
    section('Closing'),
    heading('Reflection: Then and Now'),
    prompt(`Look back at your reflection on those two prayers from the opening exercise. How have your responses changed? How have your responses remained unchanged? How do you feel looking back at your earlier reflection?`),
    recall('church-open-prayer', 'What you wrote at the opening'),
    text('church-close-prayer-then-now', { prompt: 'Closing: the prayers, then and now' }),
  ] },
  { name: 'Scripture Reading', blocks: [section('Closing'), ...SCRIPTURE(true), ...SCRIPTURE_REFLECTION('church-close', 'Closing')] },
  { name: 'Then and Now: the Scripture', blocks: [
    section('Closing'),
    heading('Reflection: Then and Now'),
    prompt(`Look back at your responses on that Scripture passage from the opening exercise. How have your responses changed? How have your responses remained unchanged? What, if anything, surprises/confuses/amazes/angers/or inspires you when you compare and contrast your reflections?`),
    recall('church-open-relate-most', 'At the opening: who you related to most'),
    recall('church-open-relate-least', 'At the opening: who you related to least'),
    recall('church-open-scripture-words', 'At the opening: the words that caused you to pause'),
    text('church-close-scripture-then-now', { prompt: 'Closing: Luke 15, then and now' }),
  ] },
  { name: 'Forgiveness Prayer', blocks: [section('Closing'), ...FORGIVENESS_PRAYER(true), text('church-close-forgiveness-prayer', { prompt: 'Closing thoughts' })] },
];

/* ---------------------------------------------------------------- the edition */
/* The PDF's one changed sentence in Lesson 1 ("Forgiveness is replacing…",
   where REACH reads "Forgiveness is just replacing…"). */
const reword = (blocks) => blocks.map((b) => (b.t === 'p' && b.html.includes('Forgiveness is just replacing')
  ? { ...b, html: b.html.replace('Forgiveness is just replacing', 'Forgiveness is replacing') }
  : b));

export function churchEdition({ LESSONS, LETTER }) {
  const lessons = LESSONS.map((l) => {
    if (l.n === 1) return { ...l, steps: [...OPENING, ...l.steps.map((s) => ({ ...s, blocks: reword(s.blocks) }))] };
    if (l.n === 6) return { ...l, steps: [...l.steps, ...PART_2] };
    if (l.n === 12) return { ...l, steps: [...l.steps, ...CLOSING] };
    return l;
  });
  const letter = {
    ...LETTER,
    paras: LETTER.paras.map((x) => x.replace('we have adapted the workbook and enhanced the design', 'we have adapted the workbook for churches and enhanced the design')),
  };
  return { LESSONS: lessons, LETTER: letter };
}

/* Words the app shows that name the edition. */
export const CHURCH_NAMES = {
  subtitle: 'Adapted for Use in Churches',
  file: 'reach-forgiveness-church',
  exportTitle: 'YOUR PATH TO REACH FORGIVENESS, ADAPTED FOR USE IN CHURCHES — my responses',
};
