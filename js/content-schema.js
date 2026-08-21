/* The schema IS the CMS. This one file describes everything an editor can
   change — every content collection and every page-building block. The admin
   page generates its forms from it, the site renders from it, and adding a
   new editable thing means adding one entry here, nothing else.

   Field types the form generator understands:
   text · textarea · url · check · number · select (needs options) ·
   list (needs fields — a repeating group of the above) */

export const COLLECTIONS = {
  testimonials: {
    label: 'Testimonials',
    help: 'Quotes on the homepage. A person’s name only appears once you tick “permission confirmed” — until then the site shows just the role line.',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role line (shown when name isn’t)', type: 'text', help: 'e.g. “Pastor who ran it with his church”' },
      { key: 'permissionConfirmed', label: 'Permission confirmed — show their name', type: 'check' },
    ],
  },
  videos: {
    label: 'Videos',
    help: 'The films embedded around the site. Paste a YouTube or Vimeo embed address into “video address” to swap what plays in a slot. Don’t change the “slot” field — it says where on the site the video appears.',
    fields: [
      { key: 'key', label: 'Slot (where it appears — don’t change)', type: 'text' },
      { key: 'src', label: 'Video address (embed URL)', type: 'url' },
      { key: 'title', label: 'Title (for screen readers)', type: 'text' },
      { key: 'caption', label: 'Caption under the video', type: 'text' },
    ],
  },
  events: {
    label: 'Events',
    help: 'Upcoming events shown on the Groups page. Delete an event when it has passed.',
    fields: [
      { key: 'title', label: 'Event name', type: 'text' },
      { key: 'date', label: 'Date line', type: 'text', help: 'Written out, e.g. “4 September · 12pm ET · Zoom”' },
      { key: 'detail', label: 'One-line description', type: 'text' },
      { key: 'href', label: 'Link (registration or details)', type: 'url' },
    ],
  },
  publications: {
    label: 'Publications',
    help: 'The research list on the Research page, newest first.',
    fields: [
      { key: 'title', label: 'Paper title', type: 'text' },
      { key: 'meta', label: 'Authors · journal · year', type: 'text' },
      { key: 'doi', label: 'DOI link', type: 'url' },
    ],
  },
  people: {
    label: 'People',
    help: 'The team on the About page.',
    fields: [
      { key: 'initials', label: 'Initials (shown in the circle)', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Title', type: 'text' },
      { key: 'line', label: 'One-line description', type: 'textarea' },
    ],
  },
  stats: {
    label: 'Homepage numbers',
    help: 'The four numbers near the top of the homepage.',
    fields: [
      { key: 'number', label: 'The number', type: 'text' },
      { key: 'label', label: 'What it counts', type: 'text' },
    ],
  },
};

/* Page blocks — the sections a new page can be built from. Each renders with
   the same styles as the rest of the site, by construction. */
export const BLOCKS = {
  hero: {
    label: 'Page opening (title + intro)',
    fields: [
      { key: 'kicker', label: 'Small line above the title', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Intro paragraph', type: 'textarea' },
      { key: 'buttons', label: 'Buttons', type: 'list', fields: [
        { key: 'label', label: 'Button text', type: 'text' },
        { key: 'href', label: 'Where it goes', type: 'url', help: 'A page on this site (e.g. groups/) or a full web address' },
        { key: 'style', label: 'Style', type: 'select', options: ['primary', 'outline', 'plum'] },
      ] },
    ],
  },
  text: {
    label: 'Text section',
    fields: [
      { key: 'title', label: 'Heading (optional)', type: 'text' },
      { key: 'body', label: 'Text — a blank line starts a new paragraph', type: 'textarea' },
    ],
  },
  cards: {
    label: 'Row of cards',
    fields: [
      { key: 'title', label: 'Heading above the row (optional)', type: 'text' },
      { key: 'items', label: 'Cards', type: 'list', fields: [
        { key: 'kicker', label: 'Small top line', type: 'text' },
        { key: 'title', label: 'Card title', type: 'text' },
        { key: 'text', label: 'Card text', type: 'textarea' },
      ] },
    ],
  },
  video: {
    label: 'Video',
    fields: [
      { key: 'src', label: 'Video address (embed URL)', type: 'url' },
      { key: 'caption', label: 'Caption', type: 'text' },
    ],
  },
  stats: {
    label: 'Row of numbers',
    fields: [
      { key: 'items', label: 'Numbers', type: 'list', fields: [
        { key: 'number', label: 'The number', type: 'text' },
        { key: 'label', label: 'What it counts', type: 'text' },
      ] },
    ],
  },
  quotes: {
    label: 'Quotes',
    fields: [
      { key: 'items', label: 'Quotes', type: 'list', fields: [
        { key: 'quote', label: 'Quote', type: 'textarea' },
        { key: 'attribution', label: 'Who said it', type: 'text' },
      ] },
    ],
  },
  notice: {
    label: 'Gentle notice box',
    fields: [{ key: 'text', label: 'Notice text', type: 'textarea' }],
  },
  band: {
    label: 'Closing invitation (dark band)',
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Line under it', type: 'textarea' },
      { key: 'buttons', label: 'Buttons', type: 'list', fields: [
        { key: 'label', label: 'Button text', type: 'text' },
        { key: 'href', label: 'Where it goes', type: 'url' },
        { key: 'style', label: 'Style', type: 'select', options: ['primary', 'outline'] },
      ] },
    ],
  },
};

export const PAGE_FIELDS = [
  { key: 'title', label: 'Page title', type: 'text' },
  { key: 'slug', label: 'Web address (letters, numbers, dashes)', type: 'text', help: 'e.g. “gratitude-week” becomes yoursite/gratitude-week/' },
  { key: 'showInNav', label: 'Show in the site menu', type: 'check' },
];
