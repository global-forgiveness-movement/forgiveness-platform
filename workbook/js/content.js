/* content.js — the complete workbook, as data.
   Source: "Your Path to REACH Forgiveness" by Everett L. Worthington, Jr. (Virginia Commonwealth
   University), adapted by Richard Cowden & Kate Jackson-Meyer (Human Flourishing Program,
   Harvard University) for the Global Forgiveness Movement. */

export const REACH = [
  { letter: 'R', word: 'Recall', desc: 'Recall the interpersonal hurt one experienced and the emotions associated with it' },
  { letter: 'E', word: 'Empathize', desc: 'Try to empathize with the offender' },
  { letter: 'A', word: 'Altruistic', desc: 'Explore the idea that forgiveness can be seen as an altruistic gift to the offender' },
  { letter: 'C', word: 'Commitment', desc: 'Make a voluntary commitment to forgive' },
  { letter: 'H', word: 'Hold', desc: 'Seek to hold onto or maintain forgiveness through difficult times (e.g., feelings of anger are aroused by something that reminds one of the offender)' },
];

export const LETTER = {
  heading: 'Dear Friend,',
  paras: [
    `Congratulations on beginning your journey through forgiveness! <b>Forgiveness is the process of replacing ill will with good will towards an offender.</b> This process involves reducing negative thoughts, emotions, and behaviors toward a transgressor and increasing or replacing them with more positive ones.`,
    `<i>When I (Everett Worthington, Virginia Commonwealth University) first began researching the psychology of forgiveness many years ago, there was almost no literature on the topic. I knew from my personal life experience that forgiveness is hard, but necessary. And I knew from my professional experience as a psychologist that forgiveness is beneficial, but many people simply don't know how to do it. So I created the <b>REACH Forgiveness</b> model. It is now one of the most widely tested models of forgiveness. Interventions and resources using the REACH Forgiveness model have been tested in more than 30 randomized controlled trials in countries all around the world. This workbook is the culmination of years of research and practice combining the most effective exercises to help individuals forgive.</i>`,
    `<i>As a public health expert, I (Tyler VanderWeele, Human Flourishing Program, Harvard University) began to realize that unforgiveness is a public health issue. I saw that if we can encourage people to forgive, our communities will be stronger and healthier. When I heard Ev present his REACH model, I knew he was onto something. And so I proposed we carry out a major study of a workbook version of his REACH forgiveness model. <b>The Human Flourishing Program</b> was involved in comprehensively testing the brief REACH Forgiveness workbook in a randomized controlled trial with over 4500 participants across 5 relatively high conflict countries: Colombia, South Africa, Ukraine, Indonesia and Hong Kong. The results (Ho et al., 2024) indicated that the workbook is effective in increasing forgiveness, reducing anxiety, reducing depression, increasing hope, and increasing flourishing. What incredible and inspiring results!</i>`,
    `With generous funding from <b>Bancel Philanthropies</b> and the <b>Kern Family Foundation</b>, the Human Flourishing Program has launched the <b>Global Forgiveness Movement.</b> As part of the Movement, we have adapted the workbook and enhanced the design to make it more accessible.`,
    `We are thrilled to get this workbook in your hands!`,
  ],
  signoff: 'Warmly,',
  signature: 'Ev and Tyler',
};

/* Block helpers */
const p = (html) => ({ t: 'p', html });
const lead = (html) => ({ t: 'lead', html });
const prompt = (html) => ({ t: 'prompt', html });
const think = (html) => ({ t: 'think', html });
const note = (html) => ({ t: 'note', html });
const ex = (num, title, sub) => ({ t: 'ex', num, title, sub });
const text = (key, o = {}) => ({ t: 'text', key, ...o });
const scale = (key, o = {}) => ({ t: 'scale', key, from: 1, to: 10, ...o });
const timer = (seconds, label) => ({ t: 'timer', seconds, label });
const movement = (steps) => ({ t: 'movement', steps });
const quiz = (items) => ({ t: 'quiz', items });
const fields = (items) => ({ t: 'fields', items });
const choice = (key, options, o = {}) => ({ t: 'choice', key, options, ...o });

export const LESSONS = [
  /* ------------------------------------------------ LESSON 1 */
  {
    n: 1,
    title: 'What You Are About to Experience',
    steps: [
      {
        name: 'Welcome to Lesson 1',
        blocks: [
          lead(`In a few hours, you will work through practical exercises with the goal of becoming more forgiving. Ultimately, forgiveness is a choice you decide to make.`),
          p(`This workbook has <b>12 experiences</b>. Each experience will take around ten to twenty minutes to complete.`),
          { t: 'rule' },
          p(`The experiences build on those that came before. <b><i>Please don't skip exercises.</i></b> A single exercise does not take very long, so you can work these into your busy life. By completing these exercises, you and others can help make the world a better place.`),
          p(`Forgiveness can be quick and dramatic. It can reverse the direction you have been traveling. But it is more likely to change your direction. This change might be small, but it will be important. This change will take you to a different place than you might now be headed. Whether it is a transformation or a gradual change, forgiveness takes you on a journey to a better place.`),
          p(`Importantly, forgiveness does not mean forgetting, nor does it mean pretending that the hurt never happened. Forgiveness is just replacing ill-will towards the offender with good-will. As you will see, forgiveness also does not mean giving up justice. Forgiving simply means desiring the ultimate good of the offender, and this can be done without excusing the wrongful action and while still pursuing a just outcome. Forgiveness can be an important, powerful, and freeing experience. Let's get started on your forgiveness journey.`),
        ],
      },
      {
        name: 'Exercise 1.1',
        blocks: [
          ex('1.1', 'Rate Your Usual Use of Forgiveness'),
          p(`<b>Consider your experiences of forgiveness across all the people you've met and all the hurts you have experienced.</b> If you feel you are perfectly forgiving in almost all situations with almost everyone you know, give yourself a score of 10 <i>(completely forgiving)</i>. But if you feel that you almost always get angry, hurt, resentful, or bitter when someone is unfair to you or hurts your feelings, give yourself a 1. Give a fair rating of your life right now:`),
          prompt(`How forgiving are you as a person, from 1 (not at all) to 10 (completely)? Select that value here:`),
          scale('rate-trait-1'),
        ],
      },
      {
        name: 'Exercise 1.2',
        blocks: [
          ex('1.2', 'Choose a Specific Hurt You Want to Work to Forgive'),
          p(`<b>A second type of forgiveness is about how you react to a specific hurt.</b> Some people think, "I've been hurt so badly that I can never forgive." Not true. You can forgive serious hurts even though they are hard to forgive. You learn to be a more forgiving person by forgiving one hurt at a time. So pick a hurt you don't feel like you can forgive right now. Imagine yourself back when you were hurt. You can probably remember that pain. Things might have happened since that day. Some things might have made the hurt feel worse. Maybe the person did not apologize or admit to hurting you. Or maybe the person has hurt you again since then. THIS is the hurt you'll work on through this workbook. It could be the first step in becoming a more forgiving person.`),
          prompt(`Write a few sentences about the hurt to make sure you've committed yourself to working on forgiving this one particular hurt.`),
          { t: 'privacy' },
          text('hurt-story', { rows: 7 }),
          think(`<b>You will work on this particular hurt through these 12 exercises.</b> Your goal is to forgive it completely by the end. You might find that, if it is a big hurt, you'll not <i>completely</i> forgive it. But you'll be well on your way. <i>(And you might just surprise yourself!)</i> You can repeat this workbook until you have completely forgiven that hurt. Trying to forgive is like medication you might take for a disease that causes a fever. The first dose might bring down the fever, but the fever might return. You might have to take several doses before the disease is gone. Near the end of these lessons, you will think of other hurts and practice forgiving them. That will help you become a more forgiving person by the end of the lessons.`),
        ],
      },
      {
        name: 'Exercise 1.3',
        blocks: [
          ex('1.3', 'Rate Your Decision to Forgive at This Moment'),
          p(`<b>Unforgiveness is when you do not want to forgive.</b> Forgiving the hurt will involve two separate experiences. One is to make a decision about how you want to treat the person in the future. A complete decision to forgive is when you decide not to pay back a hurt for a hurt, but you plan to treat the person as someone you appreciate. Let's call that a 10 on the scale of decisional forgiveness. But if you plan to get even, never speak to the person again, or hurt the person even worse than they hurt you, that's no decisional forgiveness. Let's call that 1. Think how far along you are in making a decision to forgive the hurt.`),
          prompt(`Rate yourself from 1 (none) to 10 (complete decision to forgive). Select your rating here:`),
          scale('rate-decisional-1'),
        ],
      },
      {
        name: 'Exercise 1.4',
        blocks: [
          ex('1.4', 'Rate Your Emotional Forgiveness at This Moment'),
          p(`<b>Even if you have made a perfectly sincere decision to forgive, you can still feel resentment, bitterness, anger, and fear of being hurt again.</b> You may even hate the person for hurting you. There is a second type of forgiveness: emotional forgiveness. Emotional forgiveness is replacing negative unforgiving emotions with more positive emotions toward the wrongdoer. Let's rate your emotional forgiveness. If you feel severe emotional unforgiveness—and no emotional forgiveness—give yourself a 1. If you feel no negative emotion toward the person at all, give yourself a 10.`),
          p(`When rating yourself, consider your relationship with the person who hurt you. If the wrongdoer is someone you will never see again, you can achieve full emotional forgiveness by getting rid of your negative emotions, such as hate or bitterness, toward the person. But if the wrongdoer is someone you want to keep interacting with—like a romantic partner, child, parent, or close friend—full emotional forgiveness will require more than getting rid of the negative emotions. You must also feel positive emotions, such as love, toward the person.`),
          p(`Because you have chosen this as a severe hurt to work on, your rating might be low right now. But your emotional forgiveness will increase as you complete the 12 exercises.`),
          prompt(`Select your rating here:`),
          scale('rate-emotional-1'),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('1.5', null),
          { t: 'quiztitle' },
          p(`<b>At the end of each lesson, you will read a summary and take a short quiz to make sure you are moving through the forgiveness experiences carefully. In this lesson, you've already learned a lot. You've learned that…</b>`),
          quiz([
            `There are two types of forgiveness: your general practice of forgiveness and the forgiveness of a particular hurt.`,
          ]),
          {
            t: 'blanks',
            intro: `There are two types of ways to forgive a hurt. The first is to make a <b>D</b>________ to forgive. The second is to experience <b>E</b>________ forgiveness. Type in those two words. Did you remember them?`,
            items: [
              { key: 'quiz1-d', hint: 'D', answers: ['decision', 'decisional'] },
              { key: 'quiz1-e', hint: 'E', answers: ['emotional', 'emotion'] },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 2 */
  {
    n: 2,
    title: 'Why Forgive?',
    intro: `This lesson might take you a <b>little bit longer than the others</b> because it is vitally important. In this lesson, you will consider why you want to forgive the person who hurt you.`,
    steps: [
      {
        name: 'Exercise 2.1 — Quote 1',
        blocks: [
          ex('2.1', 'Experiencing Forgiveness in Literature'),
          p(`<b>Quote 1:</b> Sometimes it helps to think about what others have to say about forgiving. The American poet Maya Angelou wrote this:`),
          { t: 'quote', text: `History, despite its wrenching pain, cannot be unlived, but if faced with courage need not be lived again.`, by: 'Maya Angelou' },
          prompt(`If you had to choose a single word that stuck out to you in this quote, what would it be? Write it here:`),
          { t: 'privacy' },
          text('quote1-word', { rows: 1, short: true }),
          prompt(`Read the quote again. Is it meaningful to you?`),
          choice('quote1-meaningful', [{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }], { pills: true }),
          prompt(`Why or why not? Write your reasons here:`),
          text('quote1-reasons', { rows: 4 }),
        ],
      },
      {
        name: 'Exercise 2.1 — Quote 2',
        blocks: [
          p(`<b>Quote 2:</b> Here is a quote from Malachy McCourt, <i>actor, writer, and politician</i>:`),
          { t: 'quote', text: `Resentment is like taking poison and waiting for the other person to die.`, by: 'Malachy McCourt' },
          prompt(`Does this capture a truth for you? Can you rephrase it?`),
          text('quote2-rephrase', { rows: 4 }),
          p(`One way to rephrase it is by saying that "holding on to unforgiveness doesn't hurt the person who injured you, but it is bad for you." <b>It turns out that many scientific studies support this idea.</b>`),
        ],
      },
      {
        name: 'Exercise 2.2',
        blocks: [
          ex('2.2', 'Identifying the Benefits of Forgiving'),
          p(`<b>People often see unforgiveness and revenge as legitimate alternatives to forgiveness.</b> Why carry around a grudge that makes you feel angry, physically ill, and spiritually off-kilter? Or that harms important relationships? There are many scientifically supported benefits of forgiving, both as a decision and as an emotional experience.`),
          prompt(`List as many benefits of choosing to forgive as you can. Include benefits to physical health, mental health, relationships, and any other aspect of life (like spirituality). You'll benefit the most if you try to come up with as many as you can before you move on to Exercise 2.3.`),
          fields([
            { key: 'benefits-physical', label: 'Physical Health', icon: 'heart' },
            { key: 'benefits-mental', label: 'Mental Health', icon: 'bulb' },
            { key: 'benefits-relationships', label: 'Relationships', icon: 'hands' },
            { key: 'benefits-spirituality', label: 'Spirituality', icon: 'pray' },
          ]),
        ],
      },
      {
        name: 'Exercise 2.3',
        blocks: [
          ex('2.3', 'Benefits of Forgiving', '(Found by Science)'),
          p(`<b>Here are just a few benefits that have been scientifically established. Read these.</b>`),
          {
            t: 'benefits',
            items: [
              { title: 'Less Stress', body: `Holding grudges is stressful. It increases your stress hormone <i>(cortisol)</i> in your body. It also increases your blood pressure, your heart rate, and the likelihood of damage to your heart. It can also cause digestive problems, weaken your immune system, interfere with your sex drive, and damage your memory.` },
              { title: 'Relieve Depression', body: `Holding grudges makes people feel depressed, worried about being hurt again, angry, and generally more negative. People often obsess about the negative event and its damage to themselves, keeping themselves upset emotionally. All of those negative emotions also affect your physical body.` },
              { title: 'Heal Relationships', body: `Holding grudges keeps people from wanting to reconcile their relationship. They stay angry, cut off the other person emotionally, and feel bitter. Instead of repairing the relationship and getting close support from that person, they put their physical health at risk again.` },
              { title: 'Inner Peace', body: `For some, holding grudges goes against what they think they should be doing religiously. It almost always makes the person feel less peaceful and less connected to people and/or whatever they hold to be sacred.` },
            ],
          },
          p(`<b>How many of these benefits did you think of ahead of time?</b>`),
          prompt(`If you had to pick one benefit, which most motivates you to forgive? Select one:`),
          choice('benefit-motivates', [
            { v: 'stress', label: 'Less Stress' },
            { v: 'depression', label: 'Relieve Depression' },
            { v: 'relationships', label: 'Heal Relationships' },
            { v: 'peace', label: 'Inner Peace' },
          ]),
        ],
      },
      {
        name: 'Exercise 2.4',
        blocks: [
          ex('2.4', 'Why Forgive?', 'A Reflection on Something You Once Forgave'),
          p(`<b>Forgiveness is good for your health.</b> Holding on to unforgiveness is really bad for your health. These findings are supported by scientific evidence. In these exercises, you will apply these findings to your life.`),
          p(`When you forgive someone, you try to treat the person better. And as a result, you feel more positive towards them. Virtually everyone has made many of these difficult forgiveness decisions.`),
          prompt(`Write a few sentences about the hardest thing you successfully forgave. This is a crucial thing to reflect on and write about. (Please don't skip this.)`),
          { t: 'privacy' },
          text('hardest-forgave', { rows: 8 }),
        ],
      },
      {
        name: 'Exercise 2.5',
        blocks: [
          ex('2.5', 'Forgiveness Is Good For You'),
          p(`<b>What were the benefits to you?</b> Using the really hurtful event you successfully forgave <i>(see Exercise 2.4)</i>, respond to each prompt below with the degree to which you felt better.`),
          prompt(`Use these ratings: 0 = no better (or even worse); 1 = somewhat better; 2 = much better. Select your ratings below:`),
          {
            t: 'ratingRows',
            options: [0, 1, 2],
            items: [
              { key: 'felt-physical', label: 'After forgiving, I felt better physically.' },
              { key: 'felt-psych', label: 'After forgiving, I felt less negative and more positive psychologically or emotionally.' },
              { key: 'felt-relationship', label: 'After forgiving, my relationship got better.' },
              { key: 'felt-spiritual', label: 'After forgiving, I felt spiritually more connected.' },
            ],
          },
          think(`Science has shown that forgiving, when practiced over time, makes people physically healthier, more psychologically adjusted, happier in relationships, and more spiritually calm. <b>But it takes time and effort.</b>`),
        ],
      },
      {
        name: 'Exercise 2.6',
        blocks: [
          ex('2.6', 'Deciding to Forgive and Experiencing Emotional Forgiveness Are Linked'),
          p(`<b>Forgiveness is tied to making a decision to forgive those who harm us.</b> When we make that decision, we try to act less negatively toward people who hurt us. Instead, we try to treat them as people that we value. But feeling emotional forgiveness—reducing your feelings of resentment, anger, hurt, and bitterness—might take longer than deciding to forgive. Although we might sincerely decide to forgive and keep trying to treat the person better, we might not feel full emotional forgiveness. Decisional and emotional forgiveness sometimes happen together, but they are different processes. They can occur at different times. Either can occur first. In fact, some people can experience one and never experience the other.`),
          prompt(`Check your own understanding. How are emotional and decisional forgiveness different? How are they related? Write your answers below.`),
          text('decisional-vs-emotional', { rows: 7 }),
        ],
      },
      {
        name: 'Exercise 2.7',
        blocks: [
          ex('2.7', 'Deciding to Forgive and Experiencing Emotional Forgiveness Have Different Effects'),
          prompt(`Read and think about these:`),
          {
            t: 'cols',
            a: `<b>Decisions to forgive have the most benefits as a stepping stone to:</b><ol><li>Forgiving emotionally</li><li>Healing your relationship with the person you wish to reconcile with</li><li>Reaching a higher sense of inner peace with one as forgiver rather than grudge-holder.</li></ol>`,
            b: `<b>Many books have been written about how emotional forgiveness promotes better physical health</b> by benefiting your heart, immune system, gastrointestinal system, brain function, and reducing stress.<br><br>Also, much research suggests that emotional forgiveness reduces the likelihood of depression, anxiety, anger-related disorders, obsessive–compulsive disorders, post-traumatic stress disorders, and psychologically related physical disorders.`,
          },
          think(`Earlier <i>(Exercise 2.6)</i>, you were asked to write how you thought decisions to forgive and emotional forgiveness were related to each other. Scientists have shown repeatedly that they are. But they have different effects on health, psychology, relationships, and spirit. <b>Both are important.</b>`),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('2.8', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned a lot that will help you forgive. You've learned that…</b>`),
          quiz([
            `You have forgiven things—sometimes <b>HUGE</b> things—in the past, so you have proven to yourself that <b>YOU</b> can forgive.`,
            `There are two types of forgiveness: your decision to forgive and emotional forgiveness. They are related but not identical. They have different benefits.`,
          ]),
          p(`<b>To check your understanding, let's review:</b>`),
          quiz([
            `Most health benefits happen in your cardiovascular systems <i>(heart and blood)</i> and immune systems.`,
            `Psychological benefits happen because you worry or obsess about things less often.`,
            `Relationship benefits happen because you make a decision to treat the wrongdoer—the person who hurt you—differently.`,
          ]),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 3 */
  {
    n: 3,
    title: 'Making a Decision to Forgive',
    steps: [
      {
        name: 'Welcome to Lesson 3',
        blocks: [
          lead(`Sometimes, decisions to forgive are conscious and deliberate. Other times, we slide into decisions—even important ones.`),
          p(`People often slide into deeper commitments in their romantic relationships by gradually taking small steps that turn out to be important. This lesson gives you the chance to <b>make a deliberate decision to forgive.</b> If you have slid part way into a decision to forgive, you can state your commitment to it.`),
          { t: 'rule' },
          p(`Lesson 2 taught you that not forgiving can damage your health, relationships, and personal peace in many ways. You read about the scientific evidence for forgiving. You also know that holding a grudge against a person who doesn't care or doesn't even know you exist is a waste of effort—not to mention bad for your well-being.`),
          p(`So you might be thinking about the harm you experienced and think, <i>Yes, I've already moved partway down the path of forgiveness.</i> Or you might be thinking, <i>I'd like to commit myself to forgiving.</i> If you find yourself walking on the road to forgiveness or getting ready to walk down the road, this lesson will help you make that decision more firm.`),
        ],
      },
      {
        name: 'Exercise 3.1',
        blocks: [
          ex('3.1', 'Injustice Gaps'),
          prompt(`Rank these wrongs from easiest to forgive (rank 1) to hardest to forgive (rank 4). Select your ratings below:`),
          {
            t: 'rank',
            key: 'injustice-rank',
            items: [
              { id: 'A', label: `<b>Person A</b> hurt you deeply and yet repeatedly says, "I didn't do anything wrong."` },
              { id: 'B', label: `<b>Person B</b> didn't really hurt you that badly.` },
              { id: 'C', label: `<b>Person C</b> hurt you deeply but cried and apologized sincerely.` },
              { id: 'D', label: `<b>Person D</b> hurt you deeply but apologized and did some nice things to make up for the hurt.` },
            ],
            reveal: `<b>Most people will rank these wrongs in this order:</b> A = 4 <i>(hardest to forgive)</i>; B = 1 <i>(easiest)</i>; C = 3; D = 2. This reflects the amount of injustice you still feel. The difference between the offense and how the offense has been repaired or smoothed over is the "injustice gap" that remains. When the wrongdoer apologizes and does something to make up for the harm, the person removed some of the injustice. The bigger the injustice gap, the harder it will be to reach full forgiveness.`,
          },
        ],
      },
      {
        name: 'Exercise 3.2',
        blocks: [
          ex('3.2', 'Forgiveness is a Choice', `It's a Decision`),
          p(`<b>Forgiveness is a choice.</b> People can reduce their injustice gap in many ways. For each of the ways below, pick whether you think this is a good or bad way to reduce the injustice gap.`),
          prompt(`Select your choices below:`),
          {
            t: 'goodbad',
            items: [
              { key: 'gb-justice', label: 'See justice done.' },
              { key: 'gb-excuse', label: `Excuse the person's hurtful behavior because he or she did not mean to hurt you.` },
              { key: 'gb-god', label: 'Let God exact justice.' },
              { key: 'gb-emotions', label: `Don't let your emotions trigger your actions.` },
              { key: 'gb-justify', label: `Justify the person's behavior because you have hurt them too.` },
              { key: 'gb-accept', label: 'Accept and move on with your life.' },
              { key: 'gb-even', label: 'Get even.' },
            ],
          },
          think(`You don't necessarily have to forgive for the injustice gap to be reduced. But for some offenses the injustice gap may not go away. Even if it doesn't, <b>you still have the power to forgive.</b>`),
        ],
      },
      {
        name: 'Exercise 3.3',
        blocks: [
          ex('3.3', 'Release the Burden of Unforgiveness', 'Make a Decision to Forgive'),
          prompt(`While no one can force you to forgive, you can make the decision to do so:`),
          movement([
            `<b>Clasp your hands</b> and extend your arms as far away from your body as you can.`,
            `Imagine that the burden of hurt and unforgiveness is <b>in your hands.</b>`,
            `You may not be ready to let go of this yet, so <b>hold it for 30 more seconds.</b>`,
            `As your arms grow tired, <b>think of all the other things you could be doing with your hands</b> <i>(and with your life)</i> if you could just let go and start doing something else.`,
            `Remember that holding this burden hurts you, not your wrongdoer. But letting go helps you both. Although you may not be ready to let go completely, open your hands and let your arms fall back to their normal position. <b>Remember the relief you feel and embrace it when you are ready to decide to forgive.</b>`,
          ]),
          timer(30, 'Hold the burden'),
          p(`<b>Now that you know the benefits of forgiving, would you like to make a real decision to forgive?</b> This means making a decision to let go of the need to get even. Instead, you decide to treat the wrongdoer as a valued (though flawed) person. <i>(Even if the person is no longer in your life, you can decide that you are willing to treat the person that way if you were to see them again.)</i>`),
          p(`In Lesson 1 <i>(Exercise 1.3)</i>, you gave your decisional forgiveness a rating. If you decided that you didn't hope to pay the person back for hurting you but you intend to treat the person as someone you value, that was full decisional forgiveness (10). But if you planned to get even, cut the person off and never speak to them again, or hurt them even worse than the person hurt you, that was no decisional forgiveness. You have probably changed that rating by now. Reflect for a minute on how far along you are right now toward making a decision to forgive the hurt. <b>Hopefully, you have moved closer to a decision to treat the person as valued than you were in Lesson 1.</b>`),
          prompt(`Give yourself a new rating from 1 (no decisional forgiveness) to 10 (complete decision to forgive). Select your rating below:`),
          scale('rate-decisional-3', { compare: { key: 'rate-decisional-1', label: 'In Lesson 1 (Exercise 1.3) you rated your decision to forgive' } }),
        ],
      },
      {
        name: 'Exercise 3.4',
        blocks: [
          ex('3.4', 'Decisional Forgiveness PLUS Emotional Forgiveness', '(Both Are Needed)'),
          note(`<b>Do you feel that you have made a sincere decision to forgive this wrongdoing? Have you at least moved in that direction?</b><br><br>You will have another chance to consider your progress after going through lessons on emotional forgiveness.`),
          p(`<b>Making a decision to forgive is far different than experiencing emotional forgiveness.</b> Otherwise, all we would have to do is make that decision and it would result in perfect peace. But that almost never happens.`),
          p(`You need to decide to forgive, but that's not enough to transform your emotions. For emotional forgiveness, you need to work through five steps to REACH Forgiveness. The remainder of the workbook shows you how to move through those steps.`),
          p(`<b>Let's begin to work through these five steps to REACH Forgiveness.</b>`),
        ],
      },
      {
        name: 'Exercise 3.5',
        blocks: [
          ex('3.5', 'Examine Yourself'),
          p(`In Lesson 2, you learned that deciding to forgive mostly improves relationships and spirituality and emotional forgiveness mostly improves physical and mental health. <b>Which of these benefits most motivates you to forgive?</b>`),
          prompt(`Select your choice below:`),
          choice('benefit-motivates-2', [
            { v: 'physical', label: 'Physical Health', icon: 'heart' },
            { v: 'mental', label: 'Mental Health', icon: 'bulb' },
            { v: 'relationships', label: 'Relationships', icon: 'hands' },
            { v: 'spirituality', label: 'Spirituality', icon: 'pray' },
          ]),
        ],
      },
      {
        name: 'Exercise 3.6',
        blocks: [
          ex('3.6', 'Practical Suggestions for Practicing Forgiveness'),
          p(`<b>To become a more forgiving person, you must do more than complete this workbook.</b> You must also practice forgiveness every chance you get. To help yourself, you will want to create daily reminders that trigger forgiveness instead of resentment, bitterness, or anger when someone harms you. Here are some suggestions that you might find helpful. You could write out any one or more of the following reminders to yourself.`),
          {
            t: 'numbered',
            items: [
              `I know that [person's initials ___] often causes me to feel bitter, resentful, or angry. So when I think about seeing the person, I will calm down right away. I will find peace in my forgiveness. I will take long, slow breaths, breathing out anger and breathing in a sense of well-being. Also, when I meet the person, I will avoid thoughts that make me bitter, resentful, or angry.`,
              `When I go away from this workbook—between lessons—I know how hard it is to return to it once I have started something else. I have great intentions. But it is still hard to go back to the workbook, even though I know that completing all 12 lessons will help me be more forgiving. So I'll pick a specific time to return and finish it. I'll add it to my calendar now, BEFORE completing the workbook. I'll put reminders of the specific time to return and do the next lesson in my living space.`,
              `When I catch myself thinking angry, bitter, or resentful thoughts, I'll calm myself. More importantly, I'll review the lesson in the workbook that teaches me how to calm down and empathize with my wrongdoer.`,
              `If a person hurts or offends me, I want to take care of it quickly. I will immediately put a time in my calendar when I will work on trying to forgive that new event before it gets ahold of my emotions.`,
            ],
          },
          prompt(`5 — Write your own suggestion:`),
          text('own-suggestion', { rows: 3 }),
          prompt(`Select the numbers for each situation you have committed to doing:`),
          choice('committed-suggestions', [
            { v: '1', label: '1' }, { v: '2', label: '2' }, { v: '3', label: '3' }, { v: '4', label: '4' }, { v: '5', label: '5' },
          ], { multi: true, pills: true }),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('3.7', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned a lot that will help you forgive. You've learned that…</b>`),
          prompt(`…You can make a decision to forgive. Do you think any harm is too large to forgive?`),
          choice('quiz3-toolarge', [{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }], { pills: true }),
          prompt(`…Both a decision to forgive and emotional forgiveness are important. Do you think either one is easier to do than the other?`),
          choice('quiz3-easier', [{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }], { pills: true }),
          prompt(`Why did you answer the above questions as you did? Write your answer below:`),
          text('quiz3-why', { rows: 4 }),
          p(`Scientists and counselors generally believe that both decisional and emotional forgiveness are important. It's helpful to do both. You make a decision to treat the wrongdoer more positively—<b>because you value other humans</b>. You also take the time and effort to replace unforgiving emotions with positive emotions—<b>because you are a human of value.</b>`),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 4 */
  {
    n: 4,
    title: 'Recall the Hurt',
    letter: 'R',
    steps: [
      {
        name: 'Exercise 4.1',
        blocks: [
          ex('4.1', 'Change Your Mindset'),
          p(`When some people are deeply hurt, they think that forgiveness is impossible. Maybe the person who hurt you has died or moved away, so they cannot do anything to earn forgiveness. They are right. Most people will never deserve our forgiveness. Many hurts just can't be made up for.`),
          p(`But that doesn't mean you can't forgive, even if the person does not deserve forgiveness. Building forgiveness is similar to strengthening a muscle. You must strain the muscle to strengthen it. Like exercising even though you are tired, deciding to forgive also means committing to something you are not comfortable doing. In fact, you might feel really strained. That's one reason you practice forgiving in a lot of situations. <b>The more you do it, the stronger your "forgiveness muscle" gets.</b>`),
          p(`There are two types of mindsets. Some mindsets are fixed. Others lead to growth. Fixed mindsets may seem good. It might seem true that you simply cannot forgive a person. But fixed mindsets keep you in the same place in life. Growth mindsets are riskier. They assume you can change and grow. But when you have a growth mindset, the future is not fixed.`),
          p(`Recall that making a decision to forgive is most strongly related to relationship benefits. For many people, it can also have spiritual benefits. Decisions can have physical and psychological benefits, but usually less noticeable. You are about to start practicing <b>the five steps to REACH emotional forgiveness</b> for the person who hurt you. Emotional forgiveness is more closely connected to physical and psychological benefits.`),
          p(`<b>Each letter of REACH stands for one part of the process:</b>`),
          { t: 'reachlist' },
          p(`<i>(In some languages, these letters might not make a word like they do in English.)</i>`),
          p(`<b>These next five lessons will walk you through each step of the process.</b> We begin here with <span class="script accent">Recall the Hurt</span>.`),
        ],
      },
      {
        name: 'Exercise 4.2',
        blocks: [
          ex('4.2', 'Importance of Being a Forgiver'),
          p(`<b>A family, community, or workplace demonstrates forgiveness</b> when it puts aside misunderstandings and deliberate hurts and still accomplishes its goals. Even a single forgiving person can change a group. How important is it for you to be a forgiving member of your family, workplace, church, community, and country?`),
          prompt(`Write a few sentences about which group or groups you would most like to influence and why.`),
          text('groups-influence', { rows: 7 }),
        ],
      },
      {
        name: 'Exercise 4.3',
        blocks: [
          ex('4.3', 'Describing the Hurt Differently'),
          p(`<b>At the beginning of this workbook</b> <i>(Exercise 1.2)</i>, you wrote your story of the hurt you want to forgive. We aren't going to get anywhere if we keep telling the same story repeatedly. We need another, more objective <i>(yet still true)</i> story. So recall the event again, but this time as an observer—not as yourself. Get more distance on the story.`),
          { t: 'recall', key: 'hurt-story', label: 'Here is what you wrote in Exercise 1.2:' },
          prompt(`1 — Write the story again, but this time without emphasizing how bad the wrongdoer is or how much you have been victimized.`),
          text('hurt-story-2', { rows: 7 }),
          prompt(`2 — What are at least three differences between the first (Exercise 1.2) and second versions of your story? (Look back if you wish.)`),
          text('story-differences', { rows: 5 }),
        ],
      },
      {
        name: 'Exercise 4.4',
        blocks: [
          ex('4.4', 'Giving the Hurt Away'),
          prompt(`To remind you of what you are prepared to do, let's do this again. You will get the most out of this exercise if you use your body even though you did this earlier.`),
          movement([
            `<b>Stand.</b>`,
            `As you did in a previous lesson <i>(Exercise 3.3)</i>, imagine that you are <b>holding the hurt in your hands.</b>`,
            `<b>Hold your arms out</b> and think about this image as what you are doing with the hurt. You are trying to contain it inside your hands and keep it at arm's length from you.`,
            `After about a minute of holding out your arms and standing, <b>your arms will feel tired and heavy.</b>`,
          ]),
          timer(60, 'Hold the hurt at arm’s length'),
          { t: 'heading', text: 'Can you see how this is like holding on to grudges?' },
          p(`<b>Now, once you have done this, imagine yourself releasing the hurt.</b> In the safety and privacy of where you are right now, think <i>I decide to forgive my wrongdoer.</i> It's like changing from a website that makes you feel stressed to one that makes you feel free and restful. Just one click.`),
          note(`To symbolize this—regardless of whether you want to emotionally forgive at this moment—<b>open your hands and let your arms fall suddenly to your sides</b> imagining that your decision to forgive drags along a release of negative emotions toward the wrongdoer.<br><br><i>(You may choose to do this exercise while holding a physical object that represents the hurt.)</i>`),
          p(`<b>You might want to make a real decision to forgive the person right now if you have not done so.</b> If you do, it does not necessarily mean that you feel much differently toward the person. The next sections will have a greater effect on your feelings. In these upcoming sections, you will work through emotional forgiveness. Don't forget your decision to forgive. When you practice decisional forgiveness, you recall the hurt. Then you make a decision to act more positively toward the person. You agree to stop holding a grudge and to try treating the person as a valuable person. You can repeat this later after you try to change your feelings about the person.`),
          p(`<b>If you have not been able to make a decision to forgive right now, you might find it easier later.</b>`),
        ],
      },
      {
        name: 'Exercise 4.5',
        blocks: [
          ex('4.5', 'We Do Things for Reasons'),
          prompt(`Write a few sentences about a time you hurt someone. Before, during, and after you hurt the person, what did you feel, think, see, and do?`),
          text('time-you-hurt', { rows: 8 }),
          think(`<b>We all do things for reasons we think are good at the time.</b> These might not seem like good reasons to the people who might have been hurt, though. We have all experienced hurting others even with the best intentions, so we can understand that the person who hurt us might have believed his or her reasons were good. It might be difficult, but can you try to imagine that your wrongdoer might not have meant to harm you?`),
        ],
      },
      {
        name: 'Exercise 4.6',
        blocks: [
          ex('4.6', 'Trying to Understand Why the Person Hurt You'),
          p(`<b>Think about the hurt you are trying to forgive.</b> Write about what you think the wrongdoer was experiencing. It's tempting to think of wrongdoers as evil and unkind—and sometimes they are. But often, in our own hearts, we can see that we might have provoked the person, that the person might have meant well, or that the person might have been under pressure that made his or her acts easier to understand.`),
          fields([
            { key: 'why-relationship', label: 'Can you see any of those things working in your relationship with the wrongdoer?' },
            { key: 'why-provoke', label: 'Did you provoke the person at all?' },
            { key: 'why-meant-well', label: 'Might the person have meant well?' },
            { key: 'why-pressure', label: 'Might the person have been under a lot of pressure?' },
          ]),
          p(`<b>Examine Yourself:</b> In this lesson, you have tried to get a different look at what happened when the person hurt you. This different perspective does not excuse the other person for hurting you. It just helps you understand him or her better. This is a crucial step to emotionally forgiving the person. This is for your personal reflection. Were you able to get any more positive perspective about the person who harmed you?`),
          prompt(`Respond by selecting an option below:`),
          choice('perspective-gained', [
            { v: 'alot', label: 'Yes, quite a lot' },
            { v: 'some', label: 'Yes, some' },
            { v: 'little', label: 'Yes, a little' },
            { v: 'notyet', label: 'Not yet' },
          ]),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('4.7', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned things that will help you forgive. You've learned that…</b>`),
          quiz([
            `You can give the hurt away. It's as simple as opening your hands and letting go of a tightly held grudge.`,
            `A decision to forgive will feel immediately like relief.`,
          ]),
          {
            t: 'blanks',
            intro: `You might still experience many times of resentment, bitterness, hostility, hatred, anger, and anxiety. You can get rid of those feelings, but they are slower to go away. They tend to hide and resurface at different times, and they can be surprisingly strong. The process of replacing those negative emotions is called <b>E</b>________ <b>F</b>________.`,
            items: [
              { key: 'quiz4-e', hint: 'E', answers: ['emotional'] },
              { key: 'quiz4-f', hint: 'F', answers: ['forgiveness'] },
            ],
          },
          quiz([`This requires time and effort.`]),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 5 */
  {
    n: 5,
    title: 'Empathize With the One Who Hurt You',
    letter: 'E',
    steps: [
      {
        name: 'Welcome to Lesson 5',
        blocks: [
          lead(`In this lesson, you'll continue trying to understand the person who hurt you and even empathize more with that person.`),
          { t: 'rule' },
          p(`This is one of the most important exercises you will do in building forgiveness. In fact, studies show that most people who do this <b>simple and short exercise</b> will increase their ability to forgive the other person.`),
        ],
      },
      {
        name: 'Exercise 5.1 — Example',
        blocks: [
          ex('5.1', 'Role Play'),
          p(`<b>Write a hypothetical conversation between you and the person who wronged you.</b> What do you say? What does the transgressor say?`),
          { t: 'heading', text: 'Example' },
          {
            t: 'example',
            lines: [
              { who: 'ME', text: `You really hurt my feelings when you lost your temper and started insulting me. You didn't even seem sorry.` },
              { who: 'WRONGDOER', text: `I didn't realize it still bothered you. That makes me feel bad.` },
              { who: 'ME', text: `I wish you had shown a little more remorse. I felt hurt for days. I still get upset when I think about it.` },
              { who: 'WRONGDOER', text: `I'm so sorry for causing you pain. I was thinking of my own frustrations. It was more about me being upset with myself than about you.` },
              { who: 'ME', text: `Then why didn't you say so?` },
              { who: 'WRONGDOER', text: `I really don't have any excuse. I should have said something. Even though I didn't say anything at the time, I still think you are my friend, and I hope you can forgive me some day.` },
            ],
          },
        ],
      },
      {
        name: 'Exercise 5.1 — Your Turn',
        blocks: [
          { t: 'heading', text: `Now it's your turn` },
          p(`<b>Try to have at least three meaningful exchanges between you and the wrongdoer.</b> It does not matter whether or not the conversation will happen in real life. Of course, it still helps to be as accurate as you can be. The important part is to understand the other person's point of view.`),
          { t: 'privacy' },
          { t: 'dialogue', key: 'roleplay', min: 6 },
        ],
      },
      {
        name: 'The Empty Chair',
        blocks: [
          p(`<b>Did you consider the person's history? The pressures on that person? The reasons that person acted as he or she did?</b>`),
          prompt(`Write below some other things you did not consider that you think might help you understand the wrongdoer more:`),
          text('not-considered', { rows: 6 }),
          { t: 'heading', text: `Now—and this is important—place an empty chair across from you, and read ALOUD your dialogue from the previous step.` },
          movement([
            `Sit in one chair for your lines, and then sit in the other chair for the other person's lines.`,
            `You will be moving back and forth every few seconds.`,
            `This exercise will be more effective if you continue this imagined conversation for <b>five to ten minutes.</b>`,
          ]),
          { t: 'recall', key: 'roleplay', label: 'Your dialogue, for reading aloud:', dialogue: true },
          timer(300, 'Empty chair conversation'),
          p(`<i>(Research supports that if you do this seriously, it can be the single most effective thing you can do to forgive the wrongdoer emotionally.)</i>`),
        ],
      },
      {
        name: 'Insights',
        blocks: [
          prompt(`Do you have any new insights now that you are putting yourself in the other person's place? What are they?`),
          text('insights-1', { rows: 6 }),
          prompt(`What have you realized about the person's motives and feelings? Do you better understand their feelings and reasoning?`),
          text('insights-2', { rows: 5 }),
        ],
      },
      {
        name: 'Five Questions',
        blocks: [
          { t: 'heading', text: 'Answer the following five questions' },
          fields([
            { key: 'five-q1', label: 'Are there any reasons to feel sorry for the person who offended you?' },
            { key: 'five-q2', label: 'Does he or she need forgiveness?' },
            { key: 'five-q3', label: 'Does he or she need forgiveness from himself or herself?' },
            { key: 'five-q4', label: 'Does he or she need forgiveness from you?' },
            { key: 'five-q5', label: 'Do you feel any sorrow on behalf of the person?' },
          ]),
          think(`Feeling empathy, sympathy, compassion, or love for the person who hurt you <b>reduces your negative feelings of unforgiveness.</b>`),
        ],
      },
      {
        name: 'Exercise 5.2',
        blocks: [
          ex('5.2', 'Compassion'),
          p(`<b>Maybe you can't feel empathy.</b> Maybe you think that the person really is evil, stupid, and unkind for hurting you. Instead of trying to empathize, can you recognize that the person needs your compassion for doing such a horrible thing to you?`),
          p(`Compassion is realizing that a person needs help, though the person might not really desire, seek, or be willing to accept help. But, you can do an unselfish act by imagining a compassionate response that the person does not deserve.`),
          prompt(`How much compassion do you feel for the person who hurt you? Select your answer below:`),
          choice('compassion-level', [
            { v: 'none', label: 'None' },
            { v: 'little', label: 'A little' },
            { v: 'moderate', label: 'A moderate amount' },
            { v: 'lot', label: 'A lot' },
          ]),
          prompt(`What could you do to feel more compassion toward that person? Write your answer below:`),
          text('more-compassion', { rows: 7 }),
        ],
      },
      {
        name: 'Exercise 5.3',
        blocks: [
          ex('5.3', 'Taking It into Your Daily Life'),
          prompt(`List the next two or three times that you expect to see the person who harmed or offended you:`),
          fields([
            { key: 'next-time-1', label: '1' },
            { key: 'next-time-2', label: '2' },
            { key: 'next-time-3', label: '3' },
          ]),
          p(`Imagine yourself in each instance. Imagine feeling more empathic each time. <b>Can you use that mental picture to think more empathically about the person?</b>`),
        ],
      },
      {
        name: 'Exercise 5.4',
        blocks: [
          ex('5.4', 'Other Emotions'),
          prompt(`Can you think of two other emotions (besides empathy and compassion) that might replace some of your negative feelings? List them.`),
          fields([
            { key: 'other-emotion-1', label: '1' },
            { key: 'other-emotion-2', label: '2' },
          ]),
        ],
      },
      {
        name: 'Exercise 5.5',
        blocks: [
          ex('5.5', 'How Much Forgiveness Is Enough?'),
          p(`<b>How much of the negative emotion would you need to replace with positive emotion to reach "full forgiveness"?</b>`),
          prompt(`For a stranger who hurt you (for example, a thief who stole your money and identity papers), would you need to…`),
          choice('enough-stranger', [
            { v: 'most', label: 'Eliminate most of the negative emotion' },
            { v: 'all', label: 'Eliminate ALL of the negative emotion' },
            { v: 'all-positive', label: 'Eliminate ALL of the negative emotion & feel positive emotion toward the person' },
          ]),
          prompt(`For a person who hurt you and whom you are no longer in relationship with, would you need to…`),
          choice('enough-past', [
            { v: 'most', label: 'Eliminate most of the negative emotion' },
            { v: 'all', label: 'Eliminate ALL of the negative emotion' },
            { v: 'all-positive', label: 'Eliminate ALL of the negative emotion & feel positive emotion toward the person' },
          ]),
          prompt(`For a loved one you see every day who hurt you, would you need to…`),
          choice('enough-loved', [
            { v: 'most', label: 'Eliminate most of the negative emotion' },
            { v: 'all', label: 'Eliminate ALL of the negative emotion' },
            { v: 'all-positive', label: 'Eliminate ALL of the negative emotion & feel positive emotion toward the person' },
          ]),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('5.6', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned more ideas that will help you forgive. You've learned that…</b>`),
          {
            t: 'blanks',
            intro: `Two emotions can replace the negative emotions of resentment, bitterness, anger, and hate. These two emotions are <b>E</b>________ and <b>C</b>________.`,
            items: [
              { key: 'quiz5-e', hint: 'E', answers: ['empathy'] },
              { key: 'quiz5-c', hint: 'C', answers: ['compassion'] },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 6 */
  {
    n: 6,
    title: 'Give an Altruistic Gift of Forgiveness',
    letter: 'A',
    steps: [
      {
        name: 'Exercise 6.1',
        blocks: [
          ex('6.1', 'How Might Forgiveness Be Useful to You?'),
          p(`<b>If you were an exceptionally forgiving person, how might that benefit you?</b>`),
          prompt(`Write at least one way below:`),
          text('forgiveness-useful', { rows: 7 }),
          think(`Research shows that when a person forgives because forgiveness makes the person healthier, more positive, more reconciled to the wrongdoer, and more spiritually at peace, that person benefits. <b>BUT when a person forgives unselfishly—<i>or altruistically</i>—to benefit the wrongdoer, he or she enjoys even greater benefits.</b>`),
        ],
      },
      {
        name: 'Exercise 6.2',
        blocks: [
          ex('6.2', 'When Did You Do Something Altruistic (Unselfish) for Someone Else'),
          p(`Write about a time when you did something altruistic or unselfish to benefit another person. <b>Describe what you did and how you felt about doing it.</b>`),
          fields([
            { key: 'altruistic-did', label: 'Write what you did', rows: 5 },
            { key: 'altruistic-felt', label: 'Write what you felt', rows: 5 },
          ]),
        ],
      },
      {
        name: 'Exercise 6.3',
        blocks: [
          ex('6.3', 'We Are All Capable of Wrongdoing'),
          p(`<b>Yehiel Dinur</b> was a Holocaust survivor who was a witness during the trial of the infamous Nazi war criminal, Adolf Eichmann. Dinur entered the courtroom and stared at the man behind the bulletproof glass—the man who had presided over the slaughter of millions. The court was hushed as a victim confronted a butcher of his people. Suddenly Dinur began to sob and collapsed to the floor. But not out of anger or bitterness. As he explained later in an interview, what struck him was a terrifying realization. "I was afraid about myself," Dinur said. "I saw that I am capable to do this… Exactly like he." In a moment of chilling clarity, Dinur saw the skull beneath the skin. "Eichmann," he concluded, "is in all of us."`),
          { t: 'heading', text: 'Answer the following questions' },
          prompt(`1 — What is the point of this story? Do you agree with it? Why or why not?`),
          text('dinur-point', { rows: 5 }),
          prompt(`2 — Did Yehiel Dinur think that he was similar to Adolf Eichmann before his realization?`),
          choice('dinur-similar', [{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }], { pills: true }),
        ],
      },
      {
        name: 'When Did You Need Forgiving?',
        blocks: [
          ex('6.3', 'When Did You Need Forgiving?'),
          p(`<b>Recalling a Time When You Needed Forgiveness.</b> Think back to a time when you hurt someone or did something wrong, needed forgiveness, and were granted forgiveness. This could be an incident from your childhood, secondary school, job, or university, or something that happened in your family or a relationship <i>(romantic or non-romantic)</i>. What matters is that you did something wrong and felt badly about it—and you were forgiven.`),
          prompt(`Write a description of the event below:`),
          text('needed-forgiving', { rows: 6 }),
          p(`<b>Now, write a few notes in response to the following questions.</b>`),
          fields([
            { key: 'needed-q1', label: `What did it feel like to be in trouble, to lose respect from others or yourself, and to need forgiveness? (Did you feel this, even though no one was "making" you feel guilty?)` },
            { key: 'needed-q2', label: `What did it feel like (or would have felt like) when you asked for forgiveness from the person you hurt and you received it? Were you humbled?` },
          ]),
        ],
      },
      {
        name: 'Exercise 6.4',
        blocks: [
          ex('6.4', 'Getting in Touch with the Gratitude We Feel for Our Forgiveness'),
          p(`Focus for a moment on how good it felt to receive forgiveness and the feeling of freedom you received when the burden of guilt was lifted from you. <b>When you can recall this state of gratitude or thankfulness, do the next exercise.</b>`),
          prompt(`If you were writing a letter of gratitude for being forgiven, what would you say? Write a few notes below:`),
          text('gratitude-letter', { rows: 8 }),
        ],
      },
      {
        name: 'Exercise 6.5',
        blocks: [
          ex('6.5', 'The Gift of Forgiving'),
          p(`Imagine the person who hurt you in the scenario you have chosen for this workbook. <b>If that person were in trouble, would you help?</b>`),
          prompt(`Write about the things you would be willing to do for that person below:`),
          text('gift-of-forgiving', { rows: 8 }),
        ],
      },
      {
        name: 'Exercise 6.6',
        blocks: [
          ex('6.6', 'A Crucial Question'),
          p(`<b>Think about how you felt when you were forgiven and about how good it feels to simply do an altruistic act that a person does not deserve.</b> Wouldn't you like to forgive <i>(emotionally)</i> the person who hurt you?`),
          { t: 'percent', key: 'percent-forgiven-6', prompt: `What percent of the negative feelings toward the person have you replaced since Exercise 1.4?`, sentence: 'I have forgiven the person who hurt or offended me {input} percent of the negative feelings that I held at the start of this workbook.' },
          p(`<b>When you started this workbook, you rated your emotional forgiveness.</b> Now that you have thought about emotional forgiveness and its benefits and doing unselfish things that a person does not deserve, please rate your emotional forgiveness at this point.`),
          p(`Experiencing emotional forgiveness is defined as the degree to which you actually feel that your emotions toward the person who offended or harmed you have become less negative and more positive. If <b>1 = no emotional forgiveness</b> and <b>10 = complete emotional forgiveness</b>, describe from 1 to 10 how much emotional forgiveness you're currently experiencing.`),
          prompt(`Select your rating here:`),
          scale('rate-emotional-6', { compare: { key: 'rate-emotional-1', label: 'In Lesson 1 (Exercise 1.4) you rated your emotional forgiveness' } }),
          think(`Remember, emotional forgiveness is strongly related to better physical and mental health. This improved health can come before or after a decision to forgive. If you are experiencing emotional forgiveness but have not decided to forgive, do you want to decide that now? Decisional forgiveness is related to better relationships and spiritual well-being. <b>It sets you on the road to better physical and mental health.</b>`),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('6.7', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned a lot that will help you forgive. You've learned that…</b>`),
          quiz([
            `When you emotionally forgive, you give an altruistic gift—that is, you give a gift that is not deserved.`,
            `When you wronged someone, you received a gift of altruistic forgiveness from that person at least one time. And it felt great—making you feel free, light, unburdened.`,
          ]),
          {
            t: 'blanks',
            intro: `You felt <b>G</b>________.`,
            items: [{ key: 'quiz6-g', hint: 'G', answers: ['grateful', 'gratitude', 'gratefulness'] }],
          },
          quiz([
            `You can do something nice for the person who offended you <i>(even though that person might not be in touch with you, might never find out, and might not even feel the gratitude that you felt when someone forgave you)</i>. Still, this is about you doing something nice, noble, and generous. It's not about whether the other person ever appreciates it. Why should your good feelings depend on the other person's reaction?`,
            `As a result of this workbook, you might have decided that you wanted to give a gift of forgiveness to the wrongdoer. It's a magical gift that you give away, and it gives you just as much blessing as the wrongdoer.`,
          ]),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 7 */
  {
    n: 7,
    title: 'Commit to the Forgiveness You Experienced',
    letter: 'C',
    steps: [
      {
        name: 'Exercise 7.1',
        blocks: [
          ex('7.1', 'Commit By Writing'),
          prompt(`Write about how much you emotionally forgave and how that feels:`),
          text('commit-writing', { rows: 10 }),
        ],
      },
      {
        name: 'Exercise 7.2',
        blocks: [
          ex('7.2', 'Completing a Certificate of Emotional Forgiveness'),
          prompt(`Fill out the following:`),
          { t: 'certificate' },
        ],
      },
      {
        name: 'Exercise 7.3',
        blocks: [
          ex('7.3', `What if Emotional Forgiveness Isn't Complete?`),
          {
            t: 'cols',
            a: `If you have experienced less than 100 percent emotional forgiveness, <b>you might want to repeat the previous steps again.</b>`,
            b: `<b>You might complete Lessons 5 and 6 again,</b> but this time try to sympathize with the wrongdoer. Then try to experience an unselfish type of love for that person. Those two emotions can replace unforgiveness, just like empathy and compassion can.`,
            cards: true,
          },
          p(`If you and the wrongdoer have a history of mutually hurtful acts—perhaps some big acts or many small acts—you do not need to recall every hurt to effectively forgive the wrongdoer for hurting you.`),
          p(`<b>You can forgive the hurtfulness by taking three steps:</b>`),
          {
            t: 'numbered',
            items: [
              `Pick two or three of the most hurtful acts. They will symbolize all the hurts the person did to you.`,
              `Work through each of the two or three acts until each one is forgiven.`,
              `At some point, you will decide that you have forgiven enough acts, and you have therefore forgiven the person.`,
            ],
          },
        ],
      },
      {
        name: 'Exercise 7.4',
        blocks: [
          ex('7.4', 'Hand Washing'),
          prompt(`Follow the prompts below:`),
          movement([
            `On your hand, use a pen to <b>write a brief description of the hurt,</b> or even just the word "HURT."`,
            `Now go to the bathroom and <b>wash it off.</b>`,
            `Were you able to <b>get all of the ink off?</b>`,
          ]),
          think(`<b>We can move through the REACH Forgiveness steps once.</b> Although it probably won't totally erase our bad feelings, it will lighten them. Through repeated washings, we become free of the negative, unforgiving feelings.`),
        ],
      },
      {
        name: 'Exercise 7.5',
        blocks: [
          ex('7.5', 'Review of Major Concepts'),
          { t: 'heading', text: 'Test your memory' },
          prompt(`What are the 5 steps to REACH forgiveness?`),
          {
            t: 'blanks',
            stacked: true,
            items: [
              { key: 'review-r', hint: 'R =', answers: ['recall', 'recall the hurt'] },
              { key: 'review-e', hint: 'E =', answers: ['empathize', 'empathy', 'empathize with the one who hurt you'] },
              { key: 'review-a', hint: 'A =', answers: ['altruistic', 'altruism', 'altruistic gift', 'give an altruistic gift of forgiveness'] },
              { key: 'review-c', hint: 'C =', answers: ['commit', 'commitment', 'commit to the forgiveness you experienced'] },
              { key: 'review-h', hint: 'H =', answers: ['hold', 'hold on', 'hold on to forgiveness', 'hold on to forgiveness when you doubt'] },
            ],
          },
          prompt(`What are our working definitions of:`),
          fields([
            { key: 'review-def-decisional', label: '1 — Granting Decisional Forgiveness', rows: 4 },
            { key: 'review-def-emotional', label: '2 — Experiencing Emotional Forgiveness', rows: 4 },
          ]),
          p(`<i>If you do not remember, go back and check Exercises 1.3 and 1.4.</i>`),
        ],
      },
      {
        name: 'Exercise 7.6',
        blocks: [
          ex('7.6', 'You Can Control Your Emotions'),
          p(`<b>You have a choice about your emotions.</b> You can hold on to your unforgiving emotions, or if you have replaced those with love or empathy or sympathy or compassion, you can now hold on to your emotional forgiveness. You can do this even in the face of powerful events that demand that you give up that emotional forgiveness. Psychologist <b>Fred Luskin</b> suggests that experiencing negative emotions is like watching a television channel that makes you feel depressed, angry, afraid, or bitter. But importantly, <b>you can change emotion channels.</b> You can choose a more positive emotion channel.`),
          fields([
            { key: 'channels-1', label: '1 — What negative emotional channels do you often watch?' },
            { key: 'channels-2', label: '2 — What positive emotional channels do you want to watch more of?' },
            { key: 'channels-3', label: '3 — Is there something stopping you from changing emotion channels? What is it?' },
            { key: 'channels-4', label: '4 — Can you commit to change channels and seek more positive experiences?' },
            { key: 'channels-5', label: '5 — Imagine yourself switching off negative, unforgiving emotions. Describe what you imagined.' },
          ]),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('7.7', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you learned things that will help you forgive. You've learned that…</b>`),
          quiz([
            `Writing about your experiences can make them better.`,
            `Filling out a certificate of forgiveness stating the amount of forgiveness you have experienced will solidify it and help you recall that you truly have experienced emotional forgiveness whenever you doubt, and doubt is inevitable in things like feelings and emotions.`,
            `You learned several things you can do if your emotional forgiveness is not complete.`,
          ]),
          {
            t: 'blanks',
            intro: `Repeat Lessons ____ and ____. <i>(If you can't remember, refer to Exercise 7.3.)</i>`,
            items: [
              { key: 'quiz7-l1', hint: '', answers: ['5', 'five'], size: 4 },
              { key: 'quiz7-l2', hint: '', answers: ['6', 'six'], size: 4 },
            ],
          },
          {
            t: 'blanks',
            intro: `Use two other emotions to replace the unforgiving emotions: <b>S</b>________ and <b>L</b>________.`,
            items: [
              { key: 'quiz7-s', hint: 'S', answers: ['sympathy'] },
              { key: 'quiz7-l', hint: 'L', answers: ['love'] },
            ],
          },
          quiz([
            `You learned that you do not have to forgive every little hurt for you to forgive the person. Two or three vivid offenses that are worked through usually are enough to help you feel that you've forgiven the person.`,
          ]),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 8 */
  {
    n: 8,
    title: 'Hold on to Forgiveness When You Doubt',
    letter: 'H',
    steps: [
      {
        name: 'Exercise 8.1',
        blocks: [
          ex('8.1', 'Things That Might Make You Doubt Whether You Really Emotionally Forgave'),
          p(`You've worked hard and experienced either complete or partial emotional forgiveness. <b>But maybe you doubt that you actually have forgiven.</b>`),
          prompt(`Can you think of times when you had similar doubts?`),
          choice('doubt-times', [{ v: 'yes', label: 'Yes' }, { v: 'no', label: 'No' }], { pills: true }),
          think(`<b>One conclusion:</b> We can experience <b>hot reminders</b>—seeing the person unexpectedly, experiencing a similar hurt from someone else, or getting hurt by the same person again. We can also experience <b>cold reminders</b>—other times when we worry about the past.`),
        ],
      },
      {
        name: 'Exercise 8.2',
        blocks: [
          ex('8.2', 'Hold on to Forgiveness When You Are in the Midst of a "Reminder" Experience'),
          prompt(`List several things you could do to avoid becoming bitter or hateful again during a cold reminder situation. How do you get your mind going in a new direction? Write below:`),
          text('cold-reminder-plan', { rows: 6 }),
          p(`<b>Make a list of times when you might expect to experience a hot reminder situation in the future.</b> Think of exactly how you might deal with each hot reminder.`),
          prompt(`Write about the three situations and how you will deal with them below:`),
          fields([
            { key: 'hot-reminder-1', label: '1', rows: 4 },
            { key: 'hot-reminder-2', label: '2', rows: 4 },
            { key: 'hot-reminder-3', label: '3', rows: 4 },
          ]),
        ],
      },
      {
        name: 'Exercise 8.3',
        blocks: [
          ex('8.3', 'Important Example'),
          p(`<b>Remembering past harms is how we protect ourselves from doing something dangerous again.</b> If I burn my hand on a stove, I feel fear when my hand gets near the stove again. That isn't "unforgiveness" against the stove eye; it is just my body's way of protecting me—saying, "You got hurt here before. Be careful or you'll get hurt again." And if you keep touching a hot stove, you'll keep getting burned. You have to change your actions and the way you think about the hurt to keep it from happening again.`),
          note(`<b>So, remember:</b> The pain, anger, and fear that arise from a memory or an encounter with the person who hurt us are NOT unforgiveness. When you see the person who hurt you and feel the negative feelings again, remind yourself: <i>The pain, anger, and fear I'm feeling are not unforgiveness. It's just my body's way of protecting me so I won't make the same mistakes I made last time.</i>`),
        ],
      },
      {
        name: 'Exercise 8.4',
        blocks: [
          ex('8.4', 'Control Your Worry'),
          p(`<b>Try controlling your thoughts.</b> Have you heard of the "white bear phenomenon"? Spend twenty seconds trying <b>NOT</b> to think about white bears.`),
          timer(20, 'Try NOT to think about white bears'),
          prompt(`What worked and what didn't?`),
          text('white-bear-1', { rows: 5 }),
          p(`Usually, people find that directly commanding themselves, <b>"Don't think about white bears,"</b> just makes them think about white bears more.`),
          prompt(`What can you apply from this exercise when you start thinking about the time when the person hurt you?`),
          text('white-bear-2', { rows: 5 }),
        ],
      },
      {
        name: 'Exercise 8.5',
        blocks: [
          ex('8.5', 'Summary of Ways to Hold on to Forgiveness'),
          { t: 'heading', text: 'Ways to hold on to forgiveness during a reminder experience' },
          {
            t: 'numbered',
            items: [`Get out of the situation`, `Distract yourself`],
          },
          { t: 'heading', text: 'Ways to hold on to forgiveness if you start to worry or obsess about it' },
          prompt(`Which of these ways do you intend to try more often in the future? Select which of the methods below appeal to you the most and that you have the best chance of using.`),
          choice('hold-methods', [
            { v: 'not-unforgiveness', label: 'Realize that the pain of a remembered hurt is not unforgiveness' },
            { v: 'dont-dwell', label: `Don't dwell on negative emotions` },
            { v: 'remind', label: 'Remind yourself that you have forgiven the person' },
            { v: 'reassurance', label: 'Seek reassurance from a partner or friend' },
            { v: 'documents', label: 'Use the documents that you created' },
            { v: 'five-step', label: 'Look at the five-step model to REACH Forgiveness, and think through the steps again' },
          ], { multi: true }),
        ],
      },
      {
        name: 'Exercise 8.6',
        blocks: [
          ex('8.6', 'What Demonstrates You Got It?'),
          p(`<b>Psychologists agree that you need repetition to solidify learning.</b> Not just mindless repetition, but repetition where you think about the concepts you are trying to remember. Do you want to prove to yourself that you really understand how to emotionally forgive?`),
          { t: 'heading', text: 'Do these simple but helpful things' },
          choice('demonstrate-commit', [
            { v: 'tell-one', label: `Tell someone who is important to you (a spouse, close friend, family member) the difference between decisional and emotional forgiveness. Also, name and explain each of the five steps to REACH Forgiveness.` },
            { v: 'tell-five', label: `Tell five other people what you told to this important person. Psychologists say that one of the best ways to grasp a concept is to teach others. Can you commit to teach five other people the difference between decisional and emotional forgiveness and the five steps to REACH Forgiveness?` },
          ], { multi: true, big: true }),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('8.7', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you've learned a lot that will help you hold on to the forgiveness you have experienced.</b> You've learned that you will probably doubt whether the forgiveness you've experienced is "real." If you see the person who offended you, or obsess about the past event, you will almost certainly feel angry. It's easy to interpret this anger as proof that your forgiveness is not true forgiveness. But you SHOULD feel angry if you see someone who has hurt you. The anger is how your body warns you: <b>"Be careful. You got hurt before, and you could get hurt again."</b>`),
          p(`If you feel you've mostly forgiven the person who hurt you, and you feel angry when you see that person, what will you to think to yourself?`),
          prompt(`Write a sentence or two that you can use to convince yourself that you have truly forgiven and that you feel angry for another reason.`),
          text('quiz8-convince', { rows: 4 }),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 9 */
  {
    n: 9,
    title: 'Dedicate Yourself to Being a More Forgiving Person',
    part: 'Part 1',
    steps: [
      {
        name: '2 Lessons, 12 Steps',
        blocks: [
          { t: 'badge', text: '2 lessons, 12 steps' },
          lead(`Lessons 9 and 10 are crucial for taking your forgiveness beyond the single person you've been trying to forgive.`),
          { t: 'rule' },
          p(`<b>Complete the 12 steps over this lesson and the next lesson.</b> These lessons will help you become a more forgiving person.`),
        ],
      },
      {
        name: 'Step 1',
        blocks: [
          ex('9.1', 'Step 1: Why Forgive?'),
          prompt(`Why do you want to be a more forgiving person? List as many reasons as you can below.`),
          text('step1-why', { rows: 9 }),
        ],
      },
      {
        name: 'Step 2',
        blocks: [
          ex('9.2', 'Step 2: Find Five Not-Completely Forgiven Hurts'),
          p(`<b>Identify the five greatest wounds that cause you ongoing negative feelings toward another person.</b> Briefly describe each of these wounds. For example, "My father abandoned our family when I was young." You can recall some if you think about times when (a) your parents disappointed you, (b) your teachers criticized you, (c) your friends or romantic partners betrayed you, (d) your coworkers disappointed you, or (e) someone physically injured you or a loved one.`),
          prompt(`Describe your wounds:`),
          { t: 'privacy' },
          fields([
            { key: 'wound-1', label: '1', rows: 2 },
            { key: 'wound-2', label: '2', rows: 2 },
            { key: 'wound-3', label: '3', rows: 2 },
            { key: 'wound-4', label: '4', rows: 2 },
            { key: 'wound-5', label: '5', rows: 2 },
          ]),
          think(`By deciding to forgive and applying REACH Forgiveness to each wound, <b>you'll become a more forgiving person.</b>`),
        ],
      },
      {
        name: 'Step 3',
        blocks: [
          ex('9.3', 'Step 3: Forgive One Wound at a Time'),
          p(`By forgiving multiple wounds one at a time, <b>you become a more forgiving person.</b>`),
          prompt(`Pick one of the hurts you described in Step 2:`),
          { t: 'pick', key: 'step3-pick', from: ['wound-1', 'wound-2', 'wound-3', 'wound-4', 'wound-5'] },
          p(`<b>Write a brief description for using REACH to forgive it below.</b>`),
          {
            t: 'reachwrite',
            items: [
              { key: 'step3-r', letter: 'R', word: 'Recall', title: 'Recall the Hurt', prompt: 'Write a summary:' },
              { key: 'step3-e', letter: 'E', word: 'Empathize', title: 'Empathize With the One Who Hurt You', prompt: `From a sympathetic point of view, describe why the person did what he or she did—from that person's point of view.` },
              { key: 'step3-a', letter: 'A', word: 'Altruistic', title: 'Give an Altruistic Gift of Forgiveness', prompt: `Thinking empathically about the wrongdoer, can you explain why you might want to unselfishly let go of negative emotions; could you bless this person?` },
              { key: 'step3-c', letter: 'C', word: 'Commit', title: 'Commit to the Forgiveness You Experienced', prompt: `Write a sentence about your success in trying to forgive. If you made a decision to forgive and treat the person better, write when you plan to do it.` },
              { key: 'step3-h', letter: 'H', word: 'Hold', title: 'Hold on to Forgiveness When You Doubt', prompt: `Write how hard you think it would be to make this a lasting forgiveness.` },
            ],
          },
          lead(`Can you now make a decision to forgive that person and treat the person as a valued person?`),
        ],
      },
      {
        name: 'Step 4',
        blocks: [
          ex('9.4', 'Step 4: Identify Your Forgiveness Heroes'),
          p(`<b>Identify three people you think of as forgiveness heroes</b>—people who have forgiven much and whom you admire. Forgiveness heroes can be people you know or have heard about.`),
          fields([
            { key: 'hero-1', label: 'Describe someone in your life who you consider to be very forgiving. What makes them forgiving? How do you feel about this person?', rows: 4 },
            { key: 'hero-2', label: 'Describe a historical person who you consider to be very forgiving. What makes that person forgiving?', rows: 4 },
            { key: 'hero-3', label: `Describe someone from the present whom you don't know personally. What makes that person forgiving?`, rows: 4 },
          ]),
        ],
      },
      {
        name: 'Step 5',
        blocks: [
          ex('9.5', 'Step 5: Examine Yourself'),
          movement([
            `<b>Send yourself an e-mail or text message</b> expressing your sincere desire to be a more forgiving person.`,
          ]),
          { t: 'selfmessage' },
          { t: 'rule' },
          ex('9.6', null),
          { t: 'quiztitle' },
          p(`<b>This is the middle of the lessons on dedicating yourself to become more forgiving.</b> Don't quiz yourself now. Instead, you will quiz yourself at the end of the next lesson, when the 12 steps are complete.`),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 10 */
  {
    n: 10,
    title: 'Dedicate Yourself to Being a More Forgiving Person',
    part: 'Part 2',
    steps: [
      {
        name: 'Step 6',
        blocks: [
          { t: 'badge', text: '12 steps continued' },
          ex('10.1', 'Step 6: Try to Become More Forgiving'),
          prompt(`Write ways you would like to develop a forgiving and warm character. Identify concrete steps you can take to develop this character.`),
          text('step6-character', { rows: 8 }),
        ],
      },
      {
        name: 'Step 7',
        blocks: [
          ex('10.2', 'Step 7: Change Your Experience with the Past'),
          p(`You can't change the past, <b>but you can change the way you talk about it.</b>`),
          prompt(`Pick out one of the five events that you identified in Step 2, and write about how you will talk differently about the event from now on.`),
          { t: 'pick', key: 'step7-pick', from: ['wound-1', 'wound-2', 'wound-3', 'wound-4', 'wound-5'] },
          text('step7-talk', { rows: 7 }),
        ],
      },
      {
        name: 'Step 8',
        blocks: [
          ex('10.3', 'Step 8: Plan Your Strategy for Becoming More Forgiving'),
          fields([
            { key: 'step8-plan', label: 'Think of the person who hurt you. Write how you will better forgive the wrongdoer from now on.', rows: 4 },
            { key: 'step8-dedicate', label: 'Will you dedicate yourself to providing forgiveness to offenders in the future? If so, write a simple sentence stating that intention.', rows: 4 },
            { key: 'step8-else', label: 'Write something else that you intend to do to become a more forgiving person.', rows: 4 },
          ]),
        ],
      },
      {
        name: 'Step 9',
        blocks: [
          ex('10.4', 'Step 9: Practice Forgiving Under Imagined Conditions'),
          p(`From your list of five events <i>(see Step 2)</i>, <b>pick one of the people who hurt you.</b>`),
          { t: 'pick', key: 'step9-pick', from: ['wound-1', 'wound-2', 'wound-3', 'wound-4', 'wound-5'] },
          prompt(`Imagine you are in a room with that person. What happens?`),
          text('step9-imagine', { rows: 8 }),
        ],
      },
      {
        name: 'Step 10',
        blocks: [
          ex('10.5', 'Step 10: Practicing Forgiveness Day to Day'),
          p(`From your list of five events <i>(see Step 2)</i>, <b>choose the one person whom you have the most negative feeling toward.</b>`),
          { t: 'pick', key: 'step10-pick', from: ['wound-1', 'wound-2', 'wound-3', 'wound-4', 'wound-5'] },
          prompt(`List their strengths as a person.`),
          text('step10-strengths', { rows: 7 }),
        ],
      },
      {
        name: 'Step 11',
        blocks: [
          ex('10.6', 'Step 11: Consult Someone You Trust'),
          p(`Do you seek social support when someone has wronged you and you are feeling hurt, or do you try to handle it alone? Is there anyone you trust whom you could talk to about your sincere desire to be more forgiving?`),
          prompt(`Write that person's, or persons', name(s) below. Why do you talk to that person? What kind of response do they usually give you? (Can you give others the same thing that person gives to you?)`),
          text('step11-trust', { rows: 7 }),
        ],
      },
      {
        name: 'Step 12',
        blocks: [
          ex('10.7', `Step 12: Start a Campaign to Feel Warmth Toward Your "Enemies"`),
          p(`<b>Think about actions you could take</b> <i>(both privately and publicly)</i> to show how you've changed your feelings toward those who have harmed you.`),
          prompt(`Write out specific things you could do to show the warmth of your emotions toward one of the people you listed in Step 2.`),
          fields([
            { key: 'step12-privately', label: 'Privately', rows: 6 },
            { key: 'step12-publicly', label: 'Publicly', rows: 6 },
          ]),
          lead(`This completes the 12-step two-lesson exercises to help you become a more forgiving person.`),
        ],
      },
      {
        name: 'Exercise 10.8',
        blocks: [
          ex('10.8', 'Freeing Yourself from the Burden of Unforgiveness'),
          p(`Let's go back for just a minute. A few times you have considered the decision to completely forgive the person who hurt you. You not only have seen the benefits of forgiving, but you also experienced real emotional change as you contemplated how the person who hurt you thought and felt. You have more empathy for the person than when you started, and you have seen that emotional forgiveness can improve your own character. And you have thought more about how to become an excellent forgiver.`),
          p(`<b>You now have a final chance to make a decision to completely forgive the person you've worked hard to forgive.</b> With all that in mind…`),
          movement([
            `<b>Clasp your hands and extend your arms</b> as far away from your body as possible.`,
            `Imagine that the burden of hurt and unforgiveness is in your hands. <b>Hold this burden for about thirty seconds.</b>`,
            `<b>As your arms grow tired,</b> think of all of the other things you could be doing with your hands <i>(and with your life)</i> if you could just let go of any remaining unforgiveness and start doing something else.`,
            `Remember that holding this burden hurts you, not the wrongdoer. But letting go helps you both. If you feel like you are ready to let go and make the true decision to forgive, open your hands and let your arms fall back to their normal position. <b>Feel the relief of that burden lifting.</b> Know that you can get back to your life now that you have forgiven.`,
          ]),
          timer(30, 'Hold the burden one last time'),
        ],
      },
      {
        name: 'Exercise 10.9',
        blocks: [
          ex('10.9', 'What Now?'),
          p(`You might be using this workbook as a stand-alone guide. Or you might be using it to try out the REACH Forgiveness ideas before doing a longer six-hour version of the workbook <i>(<a href="https://www.evworthington-forgiveness.com" target="_blank" rel="noopener">www.EvWorthington-forgiveness.com</a>)</i>. Or you might have done the six-hour version and are using this shorter version for new hurts since then.`),
          p(`Now, make a decision about whether you need to spend more time either forgiving the hurt you've been working on, or seeking to become a more forgiving person. <b>Know this:</b> the depth of your forgiveness depends on how much time you spend trying sincerely to forgive. <b>To help you decide if you want to invest more time trying to forgive, do the following exercises examining your experience with the workbook and how your forgiveness scores have changed.</b>`),
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('10.10', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you worked to experience forgiveness for one hurt.</b> From Lessons 1 to 8, you forgave this hurt to some extent. In Lessons 9 and 10, you tried to become an even more forgiving person.`),
          p(`<b>Here's the key:</b> Now that you have forgiven one hurt, you can apply the REACH Forgiveness method to other hurts. This will help you realize that you are practicing forgiveness, and you've become a more forgiving person.`),
          prompt(`Think back through this workbook. Write about the most important things you have learned in all of the lessons so far.`),
          text('quiz10-learned', { rows: 5 }),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 11 */
  {
    n: 11,
    title: 'Processing the Whole Workbook Experience',
    steps: [
      {
        name: 'Lessons You Can Remember',
        blocks: [
          { t: 'heading', text: 'Lessons You Can Remember', big: true },
          p(`In the next four short exercises, you will take away four lessons—from a <b>pencil</b>, a <b>mirror</b>, a <b>bodybuilder</b>, and a <b>scientist</b>.`),
          { t: 'icons', items: ['pencil', 'mirror', 'dumbbell', 'microscope'] },
        ],
      },
      {
        name: 'Exercise 11.1',
        blocks: [
          ex('11.1', 'Learn the Lessons of a Pencil'),
          { t: 'heading', text: 'Imagine a pencil with an eraser. Learn the lessons the pencil has for your life.' },
          {
            t: 'reveal',
            items: [
              `It has a short life, but it can make a significant mark, just like you.`,
              `It is not a pen. Its mistakes can be corrected with effort. But it often means standing the pencil on its head. Our world tells you that you should seek power to succeed. Instead, seek love. Instead of revenge, seek to forgive. That is where the real power is!`,
              `Like you, what is inside the pencil, not outside, is responsible for making a mark.`,
              `The pencil needs to be sharpened regularly, so don't feel bad about the sharpening you must endure. Often, the hurts and wounds that feel painful can be your "sharpening."`,
            ],
          },
        ],
      },
      {
        name: 'Exercise 11.2',
        blocks: [
          ex('11.2', 'Learn the Lessons of a Mirror'),
          { t: 'heading', text: 'Look at yourself in the mirror, then walk away.' },
          movement([
            `<b>Return to the mirror a second time.</b> You have looked at two faces. The first face was a person who has both been hurt and hurt others. The second is the face of a person who has struggled against the burden of unforgiveness, revenge motives, and grudges. It is the face of a person who has defeated unforgiveness. It is the face of a hero of forgiveness. We are obviously the owners of both faces. <b>Live like the hero of forgiveness that you are!</b>`,
          ]),
        ],
      },
      {
        name: 'Exercise 11.3',
        blocks: [
          ex('11.3', 'Learn the Lessons of a Bodybuilder'),
          { t: 'heading', text: 'Look in that same mirror and flex your arm muscle.' },
          movement([
            `<b>Becoming a more forgiving person is like becoming a stronger person.</b> Building muscles won't just happen. You must work and spend time, just as you did in this workbook. And like strength training, forgiveness training has many other benefits beyond making you stronger.`,
          ]),
        ],
      },
      {
        name: 'Exercise 11.4',
        blocks: [
          ex('11.4', 'Learn the Lessons of a Scientist'),
          { t: 'heading', text: 'Over 3000 scientific articles or scholarly chapters have studied forgiveness.' },
          p(`<b>What have scientists found? Learn their lessons.</b>`),
          {
            t: 'reveal',
            items: [
              `Anything can be forgiven. Big injustices just require more time and effort.`,
              `<b>You</b> can forgive anything when you commit to it.`,
              `Forgiveness usually takes time and effort when trying to forgive something specific.`,
              `Forgiving makes you more peaceful, psychologically adjusted, and physically healthy.`,
              `Forgiving helps you build better relationships.`,
              `Forgiving helps your spiritual life.`,
            ],
          },
        ],
      },
      {
        name: 'Exercise 11.5',
        blocks: [
          ex('11.5', 'Evaluate Your Learning About Forgiveness'),
          prompt(`Rate how greatly you experienced each of the following on a scale of 1 to 5. Select the rating for each item.`),
          p(`<b>1</b> = Not at all&nbsp;&nbsp;&nbsp;<b>2</b> = A Little&nbsp;&nbsp;&nbsp;<b>3</b> = Moderate&nbsp;&nbsp;&nbsp;<b>4</b> = A Lot&nbsp;&nbsp;&nbsp;<b>5</b> = Tremendous Amount`),
          {
            t: 'ratingRows',
            options: [1, 2, 3, 4, 5],
            items: [
              { key: 'eval-1', label: `I learned that deciding to forgive doesn't always mean I have forgiven emotionally.` },
              { key: 'eval-2', label: `I came to see the wrongdoer as more "human," flawed, and needy than I did before.` },
              { key: 'eval-3', label: `I understand the wrongdoer better now.` },
              { key: 'eval-4', label: `I don't see myself as so perfect as I did. I am capable of hurting other people.` },
              { key: 'eval-5', label: `I learned the five steps and can tell you what each is (5 = correctly naming all five). Try naming R, E, A, C, and H to yourself first.` },
              { key: 'eval-6', label: `If I start to worry about an old hurt, I have at least two things I could do to snap myself out of it and hold on to forgiveness.` },
              { key: 'eval-7', label: `I have committed to being a more forgiving person because of the workbook.` },
              { key: 'eval-8', label: `I have learned how I can be a more forgiving person.` },
            ],
          },
        ],
      },
      {
        name: 'Quiz Yourself',
        dark: true,
        blocks: [
          ex('11.6', null),
          { t: 'quiztitle' },
          p(`<b>In this lesson, you are starting to make the learning you've accumulated "stick."</b><br><i>Test yourself:</i> Suppose you had to give a talk to a class of 13- to 15-year old students. Can you explain the following?`),
          quiz([
            `The benefits of forgiving.`,
            `What an injustice gap is and how an apology from the wrongdoer makes the gap smaller and forgiveness likelier.`,
            `What decisional forgiveness is.`,
            `What emotional forgiveness is.`,
            `What the five steps to emotional forgiveness are.`,
            `An illustration from your life of how you used REACH Forgiveness to forgive something.`,
            `An illustration from someone else's life that inspires people to forgive.`,
          ]),
        ],
      },
    ],
  },

  /* ------------------------------------------------ LESSON 12 */
  {
    n: 12,
    title: `Evaluating Just How Far You've Come`,
    intro: `At the beginning of these 12 lessons, you evaluated yourself. <b>Let's take another look.</b>`,
    steps: [
      {
        name: 'Exercise 12.1',
        blocks: [
          ex('12.1', 'Rate (Again) Your Usual Use of Forgiveness'),
          p(`You first rated your usual use of forgiveness <i>(Exercise 1.1)</i> from 1 <i>(not at all)</i> to 10 <i>(completely)</i>.`),
          prompt(`How would you rate your overall ability to forgive now? Select your rating below:`),
          scale('rate-trait-12', { compare: { key: 'rate-trait-1', label: 'In Lesson 1 (Exercise 1.1) you rated yourself' } }),
        ],
      },
      {
        name: 'Exercises 12.2 & 12.3',
        blocks: [
          ex('12.2', 'Consider (Again) the Hurt You Worked On'),
          p(`<b>You then chose a specific hurt to work on throughout the workbook</b> <i>(Exercise 1.2)</i>. You have spent a few hours working to forgive that hurt. You have also learned a lot about forgiveness in general.`),
          ex('12.3', 'Rate (Again) Your Decision to Forgive the Hurt'),
          p(`You then rated your decisional forgiveness <i>(Exercise 1.3)</i> from 1 <i>(no decisional forgiveness)</i> to 10 <i>(complete decisional forgiveness)</i>.`),
          prompt(`How would you rate your decision to forgive now? Select your rating below:`),
          scale('rate-decisional-12', { compare: { key: 'rate-decisional-1', label: 'In Lesson 1 (Exercise 1.3) you rated your decision to forgive' } }),
        ],
      },
      {
        name: 'Exercise 12.4',
        blocks: [
          ex('12.4', 'Rate (Again) Your Emotional Forgiveness'),
          p(`You also rated your emotional forgiveness from 1 <i>(no emotional forgiveness)</i> to 10 <i>(complete emotional forgiveness)</i> <i>(Exercise 1.4)</i>.`),
          prompt(`How would you rate your emotional forgiveness now? Select your rating below:`),
          scale('rate-emotional-12', { compare: { key: 'rate-emotional-1', label: 'In Lesson 1 (Exercise 1.4) you rated your emotional forgiveness' } }),
          { t: 'summary' },
        ],
      },
      {
        name: 'Exercise 12.5',
        blocks: [
          ex('12.5', 'Rate (Again) What You Learned'),
          p(`<b>We hope you have learned a lot about forgiveness.</b> We also hope that you have applied forgiveness effectively to the hurt you chose to work on, as well as to the other hurts in your life on your path to becoming a more forgiving person.`),
          p(`While spending just a few hours on forgiving, you made a lot of progress. What's more, you now have an easy tool to use when you begin to feel angry, bitter, or resentful toward someone—a partner, a child, a workmate, a friend, or even someone you don't like. <b>You can come back to this workbook and apply it to new hurts.</b>`),
        ],
      },
      {
        name: 'Exercises 12.6 & 12.7',
        blocks: [
          ex('12.6', 'How Long Did You Spend?'),
          prompt(`About how long, in hours and minutes, would you estimate that you spent on this workbook from start to finish?`),
          { t: 'hoursmin', key: 'time-spent' },
          ex('12.7', 'Feedback'),
          prompt(`What feedback would you like to give the writer of this workbook?`),
          text('feedback', { rows: 6 }),
          prompt(`What is the likelihood you'll use this workbook again? (from 0% to 100%) Mark on the scale:`),
          { t: 'range', key: 'use-again' },
        ],
      },
      {
        name: 'Conclusion',
        dark: true,
        blocks: [
          ex('12.8', null),
          { t: 'scripttitle', text: 'Conclusion' },
          p(`<b>Thank you for participating in this workbook to promote forgiveness of a particular hurt and to become a more forgiving person.</b>`),
          p(`In the time you spent working on forgiveness, we hope you achieved your goals. But you will face new challenges throughout your life—new things to forgive. If you experience a new hurt, you can work through this workbook again. If you are not satisfied with your progress forgiving the particular hurt you focused on, you can repeat all or some of the exercises. We hope that you can now live a more forgiving life, and experience the rewards for yourself and the people you love.`),
        ],
      },
    ],
  },
];

export const RESOURCES = {
  title: 'Resources for Psychological Support',
  intro: `This workbook is not a substitute for certified mental health counseling. We recommend that you seek professional psychological support if you believe that you would benefit from working with a certified mental health professional.`,
  listTitle: 'Therapist databases:',
  links: [
    { label: 'Psychology Today', url: 'https://www.psychologytoday.com' },
    { label: 'Headway', url: 'https://headway.co/' },
    { label: 'InnoPsych (Therapists of Color)', url: 'https://www.innopsych.com/findatherapist' },
    { label: 'Good Therapy', url: 'https://www.goodtherapy.org/' },
    { label: 'Zencare', url: 'https://zencare.co' },
    { label: 'Association for Behavioral and Cognitive Therapies', url: 'https://abct.org' },
    { label: 'NOCD', url: 'https://www.treatmyocd.com/' },
  ],
  credit: `(adapted from https://camhs.huhs.harvard.edu/campus-referrals-students)`,
};

export const CREDITS = {
  paras: [
    `<i>Your Path to REACH Forgiveness</i> was developed by <b>Everett L. Worthington, Jr.</b>, PhD, Virginia Commonwealth University.`,
    `For other resources for REACH Forgiveness, see: <a href="https://www.evworthington-forgiveness.com" target="_blank" rel="noopener"><b>www.EvWorthington-forgiveness.com</b></a>`,
    `This workbook was evaluated in a randomized trial and found to be effective in increasing forgiveness, reducing anxiety and depression, increasing hope, and increasing flourishing. <span class="small">(Ho, M. Y., Worthington, E. L., Jr., Cowden, R. G., Bechara, A. O., Chen, Z. J., Gunatirin, E. Y., Joynt, S., Khalanskyi, V. V., Korzhov, H., Kurniati, N. M. T., Rodriguez, N., Salnykova, A., Shtanko, L., Tymchenko, S., Voytenko, V. L., Zulkaida, A., Mathur, M. B., & VanderWeele, T. J. (2024). International REACH forgiveness intervention: A multisite randomised controlled trial. <i>BMJ Public Health, 2</i>, e000072.)</span>`,
    `This version of the workbook was designed and adapted by <b>Richard Cowden</b>, PhD, and <b>Kate Jackson-Meyer</b>, PhD, as part of the Human Flourishing Program at Harvard's Global Forgiveness Movement.`,
  ],
};
