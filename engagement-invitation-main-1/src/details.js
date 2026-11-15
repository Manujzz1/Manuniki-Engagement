/**
 * Every engagement detail shown on the site lives here.
 *
 * Times use India Standard Time (+05:30).
 */
export const engagement = {
	groom: 'Manoj Kumar N',
	bride: 'Nikitha H U',
	initials: [ 'M', 'N' ],
	// The couple's nickname, shown in green in the story section and in the footer.
	nickname: 'Manuniki',
	// Optional, shown in the footer, e.g. '#ManojWedsNikitha'.
	hashtag: '',

	city: 'Bengaluru',
	region: 'Karnataka, India',

	families: {
		// `color` picks the shade of the parents' names: 'blue' or 'purple' (see style.css).
		groom: { label: 'Son of', parents: [ 'Narayanaswamy M', 'Rukmaniyamma M' ], color: 'blue' },
		bride: { label: 'Daughter of', parents: [ 'Umesh H T', 'Geetha R' ], color: 'purple' },
	},

	// Shown above the envelope in Kannada, with the English transliteration beneath.
	// Set `blessing` to '' to hide it.
	blessing: 'ಶುಭ ನಿಶ್ಚಿತಾರ್ಥ',
	blessingLatin: 'Shubha Nishchitartha',

	invite: {
		lead: 'Two hearts, one promise',
		line: 'With the blessings of our families, we joyfully invite you to the engagement of',
		close: 'Come share our joy as we exchange rings and begin our forever.',
	},

	// The ceremony start. Drives the countdown and the calendar entry.
	date: '2026-11-29T11:30:00+05:30',

	ceremony: {
		id: 'engagement',
		name: 'Engagement Ceremony',
		subtitle: 'Ring exchange',
		start: '2026-11-29T11:30:00+05:30',
		// No end time was given: the page says "onwards". The calendar entry assumes 3 hours.
		end: '',
		calendarEnd: '2026-11-29T14:00:00+05:30',
		note: '',
	},

	// Background music, on a loop and on by default: it begins as the page loads (or on
	// the first tap, where the browser insists). The file is in public/audio, already
	// trimmed to start at 0:23 of the track. Set `src` to '' for no music.
	music: {
		src: 'audio/love-bug-has-bitten.mp3',
		volume: 0.8,
	},

	venue: {
		name: 'Anantha Mini Function Hall',
		address: 'Avalahalli, (Nagenahalli Stop) Doddaballapur Road, Presidency School Rd, adjacent to ZED apartment',
		mapQuery: 'Anantha Mini Function Hall, Avalahalli, Doddaballapur Road, Bengaluru',
	},

};
