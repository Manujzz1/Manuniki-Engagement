/**
 * Background music, on a loop and on by default.
 *
 * `play()` is called as the page loads. Browsers usually allow sound only after the
 * guest has tapped, clicked or pressed a key (scrolling does not count), so if that
 * first attempt is blocked, the guest's first tap starts it, such as tapping the MN
 * seal to open the envelope. Until then a "Tap for music" button shows in the corner;
 * the same button pauses and resumes the music.
 *
 * The file in public/audio is already trimmed to the part that loops: "The Love Bug
 * Has Bitten (Background Score)" from 0:23 to the end of its fade-out, with a short
 * fade-in so each loop comes back in softly.
 */

const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

/**
 * @param {{ src: string, volume?: number }} options `src` is relative to the site root; `volume` is 0 to 1.
 * @return {{ play: () => void }} Call `play()` when the music should begin.
 */
export function createMusic( { src, volume = 0.8 } ) {
	const audio = new Audio( import.meta.env.BASE_URL + src );
	audio.loop = true;
	audio.preload = 'auto';
	audio.volume = volume;

	let wanted = false; // play() has been called
	let paused = false; // the guest paused it with the button
	let tried = false; // gave the first attempt time to start before calling it blocked
	let failed = false; // the file could not be loaded
	let resumeOnShow = false;

	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = 'music-toggle';
	button.hidden = true;
	document.body.appendChild( button );

	const playing = () => ! audio.paused;

	const render = () => {
		const on = playing();
		const blocked = wanted && tried && ! on && ! paused;
		button.hidden = ! wanted || failed;
		button.classList.toggle( 'is-blocked', blocked );
		button.setAttribute( 'aria-pressed', String( on ) );
		button.setAttribute( 'aria-label', on ? 'Pause music' : 'Play music' );
		button.innerHTML = ( on ? ICON_ON : ICON_OFF ) + ( blocked ? '<span class="music-toggle-text">Tap for music</span>' : '' );
	};

	const attempt = () => {
		if ( wanted && ! paused && ! failed && ! playing() ) {
			// Rejected when the browser wants a tap first; the gesture listener retries.
			audio.play().catch( () => {} );
		}
	};

	[ 'play', 'pause' ].forEach( ( t ) => audio.addEventListener( t, render ) );
	audio.addEventListener( 'error', () => {
		failed = true;
		// eslint-disable-next-line no-console
		console.warn( `[music] Could not load ${ audio.src }.` );
		render();
	} );

	// Once music is wanted, the guest's next tap, click or key press is allowed to start sound.
	[ 'pointerdown', 'keydown', 'touchend' ].forEach( ( t ) => document.addEventListener( t, attempt, { capture: true, passive: true } ) );

	button.addEventListener( 'click', () => {
		if ( playing() ) {
			paused = true;
			audio.pause();
		} else {
			paused = false;
			attempt();
		}
		render();
	} );

	// Quiet while the page is in the background; carry on when the guest comes back.
	document.addEventListener( 'visibilitychange', () => {
		if ( document.hidden && playing() ) {
			resumeOnShow = true;
			audio.pause();
		} else if ( ! document.hidden && resumeOnShow ) {
			resumeOnShow = false;
			attempt();
		}
	} );

	render();

	return {
		play() {
			if ( wanted ) {
				return;
			}
			wanted = true;
			attempt();
			render();
			setTimeout( () => {
				tried = true;
				render();
			}, 1200 );
		},
	};
}
