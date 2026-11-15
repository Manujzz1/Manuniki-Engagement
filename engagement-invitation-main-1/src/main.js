import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/pinyon-script/400.css';
import '@fontsource/corinthia/400.css';
import '@fontsource/noto-serif-kannada/500.css';
import 'lenis/dist/lenis.css';
import './style.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';

import { engagement as E } from './details.js';
import * as art from './art.js';
import { downloadIcs } from './ics.js';
import { createMusic } from './music.js';

gsap.registerPlugin( ScrollTrigger, SplitText, DrawSVGPlugin );

/* ------------------------------------------------------------------ helpers */

const esc = ( s ) => String( s ?? '' ).replace( /[&<>"']/g, ( c ) => ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } )[ c ] );
const TZ = 'Asia/Kolkata';
const fmt = ( iso, opts ) => new Intl.DateTimeFormat( 'en-IN', Object.assign( { timeZone: TZ }, opts ) ).format( new Date( iso ) );
const longDate = ( iso ) => fmt( iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } );
const time = ( iso ) => fmt( iso, { hour: 'numeric', minute: '2-digit', hour12: true } ).replace( /\s?(am|pm)$/i, ( m ) => ' ' + m.trim().toUpperCase() );
const dotDate = ( iso ) => fmt( iso, { day: '2-digit', month: '2-digit', year: 'numeric' } ).replace( /\//g, ' · ' );
// "29<sup>th</sup> November 2026", as written under the save-the-date photo.
const ordinalDate = ( iso ) => {
	const d = Number( fmt( iso, { day: 'numeric' } ) );
	const suf = d % 100 >= 11 && d % 100 <= 13 ? 'th' : ( [ 'th', 'st', 'nd', 'rd' ][ d % 10 ] || 'th' );
	return `${ d }<sup>${ suf }</sup> ${ esc( fmt( iso, { month: 'long', year: 'numeric' } ) ) }`;
};
const $ = ( s, root = document ) => root.querySelector( s );
const $$ = ( s, root = document ) => Array.from( root.querySelectorAll( s ) );
// Keeps the two words of a name together ("Manoj Kumar" never splits across lines).
const keepTail = ( name ) => esc( name ).replace( /(\S+) (\S+)$/, '<span class="keep">$1 $2</span>' );

const C = E.ceremony;
const when = `${ time( C.start ) }${ C.end ? ` – ${ time( C.end ) }` : ' onwards' }`;

/* ------------------------------------------------------------------ markup */

function render() {
	const names = `<span class="name">${ keepTail( E.groom ) }</span><span class="amp">&amp;</span><span class="name">${ keepTail( E.bride ) }</span>`;
	const map = `https://www.google.com/maps/search/?api=1&query=${ encodeURIComponent( E.venue.mapQuery || E.venue.address ) }`;
	// Each parent gets a line of their own, with "&" ending the first line, for both families.
	const family = ( who, name ) => `
		<div class="family family-${ who }">
			<p class="family-name">${ keepTail( name ) }</p>
			<p class="family-label">${ esc( E.families[ who ].label ) }</p>
			<p class="family-parents family-parents-${ esc( E.families[ who ].color ) }">${ E.families[ who ].parents.map( keepTail ).join( ' &amp;<br>' ) }</p>
		</div>`;
	// "Manuniki" as pen-written vector lettering, with its heart. `id` keeps each copy's mask unique.
	const nickname = ( cls, id ) => E.nickname ? `<p class="nickname nickname-written ${ cls }">${ art.nicknameScript( esc( E.nickname ), id ) }<span class="nickname-heart" aria-hidden="true">❤️</span></p>` : '';

	document.getElementById( 'app' ).innerHTML = `
${ art.defs() }
<main>
	<section class="intro" aria-label="Invitation">
		<div class="intro-garland">${ art.garland() }</div>
		<div class="petals" aria-hidden="true"></div>
		<div class="hearts" aria-hidden="true"></div>
		${ E.blessing ? `<p class="intro-kicker"><span lang="kn">${ esc( E.blessing ) }</span><span>${ esc( E.blessingLatin ) }</span></p>` : '' }
		<div class="stage">
			<div class="envelope">
				<div class="env-part env-back">${ art.envelopeBack() }</div>
				<div class="letter">
					<div class="card">
						${ art.corner( 'tl' ) }${ art.corner( 'tr' ) }${ art.corner( 'bl' ) }${ art.corner( 'br' ) }
						<p class="card-kicker">Together with their families</p>
						<h1 class="card-names">${ names }</h1>
						<p class="card-line">are getting engaged</p>
						<p class="card-date">${ esc( dotDate( E.date ) ) }</p>
						<p class="card-city">${ esc( E.city ) }</p>
					</div>
				</div>
				<div class="env-part env-front">${ art.envelopeFront() }</div>
				<div class="env-part env-flap">
					<div class="flap-face flap-front">${ art.flapFront() }</div>
					<div class="flap-face flap-back">${ art.flapBack() }</div>
				</div>
				<button class="env-part seal" type="button" aria-label="Open the invitation">
					${ art.seal( E.initials ) }
				</button>
			</div>
		</div>
		<p class="intro-hint"><span>Tap the seal or swipe down to open</span><span class="swipe-hand" aria-hidden="true">👇</span></p>
		<button class="scroll-cue" type="button">
			<span class="scroll-cue-text">Swipe down for the details</span>
			<svg class="scroll-cue-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L12 12 L18 6"/><path d="M6 12 L12 18 L18 12"/></svg>
		</button>
	</section>

	<section class="story story-name section" aria-label="Our story">
		${ art.divider() }
		<p class="eyebrow reveal">${ esc( E.invite.lead ) }</p>
		<p class="lead reveal">${ esc( E.invite.line ) }</p>
		<div class="couple-wrap">${ art.couple() }</div>
		${ nickname( 'nickname-story', 'nn' ) }
	</section>

	<section class="story story-families section" aria-label="Our families">
		<div class="families">
			${ family( 'groom', E.groom ) }
			<span class="families-heart" aria-hidden="true">${ art.heart() }</span>
			${ family( 'bride', E.bride ) }
		</div>
		<p class="lead reveal">${ esc( E.invite.close ) }</p>
		${ art.divider() }
	</section>

	<section class="save-date section" aria-labelledby="save-title">
		<figure class="polaroid">
			<div class="polaroid-photo">
				<img src="${ import.meta.env.BASE_URL }save-the-date.jpg" width="1024" height="1536" loading="lazy" decoding="async" alt="Illustrated engagement announcement with childhood photos of Manoj and Nikitha holding hands." />
			</div>
			<figcaption class="polaroid-caption">
				<h2 class="polaroid-title" id="save-title"><span class="p-heart" aria-hidden="true">♡</span>Save <em>the</em> Date<span class="p-heart" aria-hidden="true">♡</span></h2>
				<p class="polaroid-rule" aria-hidden="true"><span></span>♡<span></span></p>
				<p class="polaroid-date"><time datetime="${ esc( E.date ) }">${ ordinalDate( E.date ) }</time></p>
				<p class="polaroid-when">${ esc( fmt( E.date, { weekday: 'long' } ) ) } · ${ esc( when ) }</p>
			</figcaption>
		</figure>
		<p class="save-place reveal">${ esc( E.city ) }</p>
		<div class="countdown" role="timer" aria-live="off">
			${ [ 'Days', 'Hours', 'Minutes', 'Seconds' ].map( ( l ) => `<div class="count-box"><span class="count-num" data-unit="${ l.toLowerCase() }">00</span><span class="count-label">${ l }</span></div>` ).join( '' ) }
		</div>
		<p class="countdown-done" hidden>We’re engaged! Thank you for celebrating with us.</p>
	</section>

	<section class="ceremony section" aria-labelledby="ceremony-title">
		<p class="eyebrow reveal">The ceremony</p>
		<h2 class="section-title split" id="ceremony-title">Witness our promise</h2>
		<article class="ceremony-card">
			${ art.corner( 'tl' ) }${ art.corner( 'tr' ) }${ art.corner( 'bl' ) }${ art.corner( 'br' ) }
			${ art.rings() }
			<h3>${ esc( C.name ) }</h3>
			${ C.subtitle ? `<p class="ceremony-sub">${ esc( C.subtitle ) }</p>` : '' }
			<p class="ceremony-when"><time datetime="${ esc( C.start ) }">${ esc( longDate( C.start ) ) }</time></p>
			<p class="ceremony-time">${ esc( when ) }</p>
			<p class="ceremony-where">${ esc( E.venue.name ) }</p>
			${ C.note ? `<p class="ceremony-note">${ esc( C.note ) }</p>` : '' }
		</article>
	</section>

	<section class="venue section" aria-labelledby="venue-title">
		${ art.hall() }
		<p class="eyebrow reveal">The venue</p>
		<h2 class="section-title split" id="venue-title">${ esc( E.venue.name ) }</h2>
		<p class="venue-address reveal">${ esc( E.venue.address ) }</p>
		<div class="actions reveal">
			<a class="btn" href="${ esc( map ) }" target="_blank" rel="noopener noreferrer"><span>Get directions</span><span class="btn-kn" lang="kn">ದಾರಿ ತೋರಿಸಿ</span></a>
			<button class="btn btn-ghost" type="button" data-ics><span>Add to calendar</span><span class="btn-kn" lang="kn">ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ</span></button>
		</div>
	</section>


	<footer class="footer">
		<div class="footer-garland">${ art.garland( 7 ) }</div>
		<p class="footer-with">With love,</p>
		${ nickname( 'footer-nickname', 'nn-footer' ) }
		<p class="footer-tag">${ E.hashtag ? `${ esc( E.hashtag ) } · ` : "" }${ esc( E.city ) }</p>
	</footer>
</main>`;
}

/* ------------------------------------------------------------------ behaviour */

function countdown() {
	const target = new Date( E.date ).getTime();
	const nums = Object.fromEntries( $$( '.count-num' ).map( ( n ) => [ n.dataset.unit, n ] ) );
	const tick = () => {
		const s = Math.max( 0, Math.floor( ( target - Date.now() ) / 1000 ) );
		if ( s === 0 ) {
			$( '.countdown' ).hidden = true;
			$( '.countdown-done' ).hidden = false;
			return false;
		}
		const parts = { days: Math.floor( s / 86400 ), hours: Math.floor( ( s % 86400 ) / 3600 ), minutes: Math.floor( ( s % 3600 ) / 60 ), seconds: s % 60 };
		Object.keys( parts ).forEach( ( k ) => {
			const v = String( parts[ k ] ).padStart( 2, '0' );
			if ( nums[ k ].textContent !== v ) {
				nums[ k ].textContent = v;
			}
		} );
		return true;
	};
	if ( tick() ) {
		const id = setInterval( () => tick() || clearInterval( id ), 1000 );
	}
}

function wire() {
	const ics = $( '[data-ics]' );
	// The calendar needs an end time; the page itself says "onwards".
	ics && ics.addEventListener( 'click', () => downloadIcs( { ...E, events: [ { ...C, end: C.end || C.calendarEnd } ] } ) );
	countdown();
}

/* ------------------------------------------------------------------ motion */

/** How large the card ends up once it is out of the envelope. */
function cardScale() {
	const env = $( '.envelope' );
	const w = env.offsetWidth * 0.9;
	const h = env.offsetHeight * 0.9;
	// Leaves room under the card for the "swipe down" cue (and the music button).
	return Math.min( ( window.innerWidth * 0.92 ) / w, ( window.innerHeight * 0.72 ) / h, 1.5 );
}

/** How far the card moves to finish just above centre (the envelope sits below the heading). */
function cardShift() {
	const intro = $( '.intro' );
	const stage = $( '.stage' );
	return intro.clientHeight * 0.44 - ( stage.offsetTop + stage.offsetHeight / 2 );
}

function introTimeline() {
	const parts = [ '.env-back', '.env-front', '.env-flap', '.seal' ];
	const tl = gsap.timeline( {
		defaults: { ease: 'none' },
		scrollTrigger: { trigger: '.intro', start: 'top top', end: '+=320%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
	} );
	tl.to( '.intro-hint', { autoAlpha: 0, y: 24, duration: 0.3 }, 0 )
		// The heart seal presses, then lifts off the envelope.
		.to( '.seal', { scale: 1.14, duration: 0.25, ease: 'power1.out' }, 0 )
		.to( '.seal', { yPercent: -70, scale: 0.75, rotation: -10, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0.25 )
		// The flap folds back; once past vertical it goes behind the letter.
		.to( '.env-flap', { rotationX: 180, duration: 1.4, ease: 'power1.inOut' }, 0.55 )
		.set( '.env-flap', { zIndex: 2 }, 1.25 )
		.to( '.intro-kicker', { autoAlpha: 0, y: -20, duration: 0.6 }, 1.2 )
		// The card slides out while the envelope sinks to make room.
		.to( '.letter', { yPercent: -108, duration: 1.6, ease: 'power1.inOut' }, 2 )
		.to( '.envelope', { yPercent: 42, duration: 1.6, ease: 'power1.inOut' }, 2 )
		.set( '.letter', { zIndex: 7 }, 3.6 )
		// The envelope falls away and the card comes forward to fill the screen.
		.to( parts, { y: () => window.innerHeight * 1.1, rotation: 4, autoAlpha: 0, duration: 1.3, ease: 'power2.in' }, 3.6 )
		.to( '.envelope', { yPercent: 0, duration: 1.3, ease: 'power2.inOut' }, 3.6 )
		.to( '.letter', { yPercent: 0, y: cardShift, scale: cardScale, duration: 1.3, ease: 'power2.inOut' }, 3.6 )
		.to( '.intro-garland', { yPercent: -40, autoAlpha: 0, duration: 1 }, 3.8 )
		// Once the card is open, tell the guest there is more below.
		.fromTo( '.scroll-cue', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 4.5 )
		.to( {}, { duration: 0.8 } );
	return tl;
}

/** Something that drifts across the intro forever: petals fall, hearts rise. */
function drift( box, count, make, { rise = false, size: [ min, max ], opacity: [ oMin, oMax ], spin, className } ) {
	for ( let i = 0; i < count; i++ ) {
		const el = document.createElement( 'span' );
		el.className = className || ( rise ? 'float-heart' : 'petal' );
		el.innerHTML = make( i );
		box.appendChild( el );
		const size = gsap.utils.random( min, max );
		const from = rise ? window.innerHeight + 40 : -40;
		const to = rise ? -60 : window.innerHeight + 40;
		gsap.set( el, { width: size, height: size * 1.2, left: `${ gsap.utils.random( 0, 100 ) }%`, y: from, rotation: rise ? gsap.utils.random( -15, 15 ) : gsap.utils.random( 0, 360 ), opacity: gsap.utils.random( oMin, oMax ) } );
		const go = () =>
			gsap.fromTo(
				el,
				{ y: from, x: 0 },
				{ y: to, x: gsap.utils.random( -80, 80 ), rotation: spin ? `+=${ gsap.utils.random( 180, 540 ) }` : gsap.utils.random( -20, 20 ), duration: gsap.utils.random( 10, 18 ), ease: rise ? 'sine.inOut' : 'none', onComplete: go }
			);
		gsap.delayedCall( gsap.utils.random( 0, 10 ), go );
	}
}

function ambient() {
	const small = window.innerWidth < 640;
	drift( $( '.petals' ), small ? 9 : 16, art.petal, { size: [ 10, 20 ], opacity: [ 0.55, 0.95 ], spin: true } );
	drift( $( '.hearts' ), small ? 5 : 9, art.heart, { rise: true, size: [ 10, 22 ], opacity: [ 0.25, 0.6 ] } );
	// Hearts carrying the couple's initials fall with the petals: M, N, then both together.
	const letters = [ E.initials[ 0 ], E.initials[ 1 ], E.initials.join( '' ) ];
	drift( $( '.hearts' ), small ? 8 : 14, ( i ) => art.letterHeart( letters[ i % letters.length ] ), { className: 'letter-heart', size: [ 26, 40 ], opacity: [ 0.75, 1 ] } );

	gsap.to( '.swipe-hand', { y: 4, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 } );
	// The seal beats softly, like a heart, until it is opened.
	gsap.timeline( { repeat: -1, repeatDelay: 0.9 } )
		.to( '.seal svg', { scale: 1.06, duration: 0.16, ease: 'power1.out' } )
		.to( '.seal svg', { scale: 1, duration: 0.2, ease: 'power1.in' } )
		.to( '.seal svg', { scale: 1.04, duration: 0.14, ease: 'power1.out' } )
		.to( '.seal svg', { scale: 1, duration: 0.3, ease: 'power1.inOut' } );
	gsap.to( '.couple-heart', { scale: 1.12, transformOrigin: '50% 50%', duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 } );
	gsap.to( '.families-heart svg', { scale: 1.15, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 } );
}

/**
 * Plays `tl` every time `trigger` comes into view, scrolling down or back up. It rewinds
 * only once the element is fully off screen, so it never visibly resets or flickers.
 *
 * @param {Element|string} trigger Element that decides when.
 * @param {gsap.core.Timeline} tl  A paused timeline.
 * @param {string} start           Where in the viewport it starts, as ScrollTrigger's `start`.
 * @return {gsap.core.Timeline} The same timeline, with `kill()` also removing its triggers.
 */
function replay( trigger, tl, start = 'top 85%' ) {
	// A fast jump can sweep past the trigger without it ever being on screen: play only if it is.
	const seen = ( el ) => {
		const r = el.getBoundingClientRect();
		return r.bottom > 0 && r.top < window.innerHeight;
	};
	const go = ( self ) => tl.progress() === 0 && seen( self.trigger ) && tl.play();
	const show = ScrollTrigger.create( { trigger, start, end: 'bottom 15%', onEnter: go, onEnterBack: go } );
	const rewind = () => tl.pause( 0 );
	const away = ScrollTrigger.create( { trigger, start: 'top bottom', end: 'bottom top', onLeave: rewind, onLeaveBack: rewind } );
	const kill = tl.kill.bind( tl );
	tl.kill = () => {
		show.kill();
		away.kill();
		return kill();
	};
	return tl;
}

/** A paused timeline for `replay()`. */
const paused = ( vars ) => gsap.timeline( Object.assign( { paused: true }, vars ) );

/** Distance covered at even steps in time (from manuniki-path.js), read back as a GSAP ease. */
function paced( table ) {
	const v = table.split( ' ' ).map( Number );
	const n = v.length - 1;
	return ( p ) => {
		const f = Math.min( Math.max( p, 0 ), 1 ) * n;
		const i = Math.min( Math.floor( f ), n - 1 );
		return v[ i ] + ( v[ i + 1 ] - v[ i ] ) * ( f - i );
	};
}

/**
 * "Manuniki" writes itself like a pen in cursive, from the tip of the M to the tail of
 * the last i. Each stroke carries its own pace (slower through turns, quick on straights
 * and retraced stems), the pen lifts between the M and the a, and each i is dotted as
 * the pen passes. Then the heart pops in.
 *
 * @param {Element} line The `.nickname-written` paragraph.
 * @return {gsap.core.Timeline} Paused timeline.
 */
function writeNickname( line ) {
	const pens = $$( '.nn-pen', line );
	const dots = $$( '.nn-dot', line );
	const heart = $( '.nickname-heart', line );
	const tl = paused();
	tl.set( pens, { drawSVG: 0 } ).set( dots, { scale: 0, transformOrigin: '50% 50%' } ).set( heart, { scale: 0, autoAlpha: 0 } );
	let at = 0;
	let dot = 0;
	pens.forEach( ( pen, i ) => {
		const dur = Number( pen.dataset.duration );
		if ( i ) {
			at += 0.12; // the pen lifts and moves on to the a
		}
		tl.to( pen, { drawSVG: '100%', duration: dur, ease: paced( pen.dataset.ease ) }, at );
		pen.dataset.dots.split( ' ' ).filter( Boolean ).forEach( ( f ) => {
			dots[ dot ] && tl.to( dots[ dot++ ], { scale: 1, duration: 0.18, ease: 'back.out(3)' }, at + Number( f ) * dur );
		} );
		at += dur;
	} );
	tl.to( heart, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(3)' }, at + 0.05 );
	tl.progress( 0 ); // render the hidden starting state now
	return tl;
}

/**
 * The swirly roses turn slowly and endlessly, each at its own pace.
 *
 * @param {Element[]} roses `.rose` groups.
 */
function spinRoses( roses ) {
	roses.forEach( ( el, i ) =>
		gsap.to( el, { rotation: i % 2 ? '-=360' : '+=360', transformOrigin: '50% 50%', duration: gsap.utils.random( 7, 11 ), ease: 'none', repeat: -1 } )
	);
}

/**
 * The heart seal settles onto the envelope, then its M and N are drawn apart and slide
 * together until they share a stroke, becoming one monogram.
 */
function sealIn() {
	const m = $( '.seal-m' );
	const n = $( '.seal-n' );
	const tl = gsap.timeline( { delay: 0.3 } );
	tl.from( '.seal-wax', { scale: 0, rotation: -15, transformOrigin: '50% 55%', duration: 0.8, ease: 'back.out(2)' } );
	if ( m && n ) {
		tl.set( [ m, n ], { x: ( i ) => ( i ? 9 : -9 ) } )
			.from( m, { drawSVG: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.2' )
			.from( n, { drawSVG: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.5' )
			.to( [ m, n ], { x: 0, duration: 0.7, ease: 'power3.inOut' }, '+=0.15' )
			.fromTo( '.seal-monogram', { filter: 'drop-shadow(0 0 0 rgba(255, 236, 200, 0))' }, { filter: 'drop-shadow(0 0 3px rgba(255, 236, 200, 0.9))', duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.1' );
	}
	return tl;
}

/**
 * A garland grows in from the left: the vine draws itself, the leaves unfurl, the roses
 * bloom and the hanging hearts drop into place.
 *
 * @param {Element} svg A `.garland`.
 * @return {gsap.core.Timeline} Paused timeline.
 */
function growGarland( svg ) {
	// Delay by position along the garland (viewBox is 1200 wide), so it grows left to right.
	const along = ( spread ) => ( i, el ) => ( gsap.getProperty( el, 'x' ) / 1200 ) * spread;
	return paused()
		.from( $( '.vine', svg ), { drawSVG: 0, duration: 1.6, ease: 'power1.inOut' } )
		.from( $$( '.leaf', svg ), { scale: 0, transformOrigin: '0% 50%', duration: 0.5, ease: 'back.out(2)', stagger: along( 1.3 ) }, 0.1 )
		.from( $$( '.rose', svg ), { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.2)', stagger: along( 1.3 ) }, 0.3 )
		.from( $$( '.charm', svg ), { autoAlpha: 0, y: -16, duration: 0.7, ease: 'power2.out', stagger: along( 1.1 ) }, 0.9 );
}

/**
 * Keeps a garland gently alive: leaves flutter, roses spin and the hearts swing on their
 * strings. Small, slow movements on rotation only, so they never fight the growing-in.
 *
 * @param {Element} svg A `.garland`.
 */
function swayGarland( svg ) {
	const r = gsap.utils.random;
	$$( '.leaf', svg ).forEach( ( l, i ) => i % 2 || gsap.to( l, { rotation: `+=${ r( 4, 8 ) }`, duration: r( 1.6, 2.6 ), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: r( 0, 2 ) } ) );
	spinRoses( $$( '.rose', svg ) );
	$$( '.charm', svg ).forEach( ( c, i ) => gsap.fromTo( c, { rotation: i % 2 ? -6 : 6 }, { rotation: i % 2 ? 6 : -6, transformOrigin: '50% 0%', duration: r( 2, 2.8 ), ease: 'sine.inOut', yoyo: true, repeat: -1 } ) );
}

// Every entrance below replays each time its element comes into view, in either
// direction. The arch and the hall are scrubbed with the scroll, so they replay anyway.
function sections() {
	// The garlands: the hero's grows in as the page opens, the footer's each time it is seen.
	// Their gentle sway is part of the requested design, so it runs on every device.
	const heroGarland = $( '.intro-garland .garland' );
	const footerGarland = $( '.footer-garland .garland' );
	if ( heroGarland ) {
		growGarland( heroGarland ).play();
	}
	if ( footerGarland ) {
		replay( '.footer-garland', growGarland( footerGarland ), 'top 95%' );
	}
	$$( '.garland' ).forEach( swayGarland );
	spinRoses( $$( '.arch-flowers .rose' ) );
	sealIn();

	$$( '.reveal' ).forEach( ( el ) => replay( el, paused().fromTo( el, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' } ), 'top 88%' ) );

	// Vine dividers draw out from the heart.
	$$( '.divider' ).forEach( ( d ) =>
		replay(
			d,
			paused()
				.from( $$( 'path', d ), { drawSVG: '50% 50%', duration: 1.8, ease: 'power2.inOut', stagger: 0.08 } )
				.from( $$( 'circle', d ), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(3)', stagger: 0.05 }, 0.8 )
		)
	);

	// The rose arch draws with the scroll, then the roses bloom and the couple appears.
	const arch = { trigger: '.couple-art', start: 'top 80%', end: 'center 50%', scrub: 0.8 };
	gsap.from( '.arch path', { drawSVG: 0, ease: 'none', stagger: 0.1, scrollTrigger: arch } );
	gsap.from( '.arch-flowers .rose, .arch-flowers .leaf', { scale: 0, transformOrigin: '50% 50%', ease: 'back.out(2)', stagger: 0.02, scrollTrigger: arch } );
	replay(
		'.couple-art',
		paused()
			.from( '.figures', { autoAlpha: 0, y: 24, duration: 1.4, ease: 'power3.out' } )
			.from( '.couple-heart', { autoAlpha: 0, y: 30, duration: 1.4, ease: 'power3.out' }, 0.5 ),
		'top 55%'
	);

	// Both copies of "Manuniki": after the arch, and in the footer.
	$$( '.nickname-written' ).forEach( ( line ) => replay( line, writeNickname( line ), 'top 90%' ) );

	// The two families come together from either side.
	replay(
		'.families',
		paused()
			.from( '.family-groom', { x: -50, autoAlpha: 0, duration: 1.1, ease: 'power3.out' } )
			.from( '.family-bride', { x: 50, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0 )
			.from( '.families-heart', { scale: 0, autoAlpha: 0, duration: 0.9, ease: 'back.out(3)' }, 0.5 )
	);

	$$( '.split' ).forEach( ( el ) =>
		SplitText.create( el, {
			type: 'words',
			mask: 'words',
			// Returned so SplitText kills it (and its triggers) if it re-splits on resize.
			onSplit: ( self ) => replay( el, paused().from( self.words, { yPercent: 105, duration: 1, ease: 'power4.out', stagger: 0.08 } ) ),
		} )
	);

	// The polaroid rises into place.
	replay(
		'.polaroid',
		paused()
			.from( '.polaroid', { y: 70, autoAlpha: 0, duration: 1.3, ease: 'power3.out' } )
			.from( '.polaroid-caption > *', { y: 16, autoAlpha: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }, 0.6 )
	);
	replay(
		'.countdown',
		paused().from( '.count-box', { rotationX: -90, autoAlpha: 0, transformOrigin: '50% 0%', transformPerspective: 600, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.1 } ),
		'top 88%'
	);

	// Ceremony card rises; the rings are drawn and then chime together.
	replay(
		'.ceremony-card',
		paused()
			.from( '.ceremony-card', { y: 60, autoAlpha: 0, duration: 1.2, ease: 'power3.out' } )
			.from( '.rings-icon path, .rings-icon circle', { drawSVG: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.1 }, 0.3 )
			.from( '.rings-icon circle:first-child', { x: -6, duration: 0.6, ease: 'back.out(4)' }, 1.6 )
			.from( '.rings-icon circle:nth-child(2)', { x: 6, duration: 0.6, ease: 'back.out(4)' }, 1.6 ),
		'top 80%'
	);

	// Venue: the hall is drawn as the section scrolls through, then its lights come on.
	gsap.from( '.hall path', { drawSVG: 0, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: '.venue', start: 'top 85%', end: 'center 55%', scrub: 0.8 } } );
	replay( '.hall', paused().from( '.hall .bulb', { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', stagger: 0.06, duration: 0.4, ease: 'back.out(3)' } ), 'top 55%' );

	replay( '.footer-with', paused().from( '.footer-with', { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out' } ), 'top 95%' );
}

function smoothScroll() {
	const lenis = new Lenis( { lerp: 0.085, wheelMultiplier: 0.9, autoRaf: false } );
	lenis.on( 'scroll', ScrollTrigger.update );
	gsap.ticker.add( ( t ) => lenis.raf( t * 1000 ) );
	gsap.ticker.lagSmoothing( 0 );
	return lenis;
}

function keepScreenAwake() {
	let sentinel = null;
	let requested = false;
	let pending = false;
	const request = async () => {
		requested = true;
		if ( ! navigator.wakeLock || document.visibilityState !== 'visible' || ( sentinel && ! sentinel.released ) || pending ) return;
		pending = true;
		try {
			sentinel = await navigator.wakeLock.request( 'screen' );
			sentinel.addEventListener( 'release', () => { sentinel = null; } );
		} catch {
			sentinel = null;
		} finally {
			pending = false;
		}
	};
	document.addEventListener( 'visibilitychange', () => {
		if ( requested && document.visibilityState === 'visible' ) request();
	} );
	return request;
}

function motion() {
	const mm = gsap.matchMedia();

	// Every device gets the scroll story: the envelope opening and the section reveals.
	// These move only when the guest scrolls, so they run with reduced motion on too.
	// Many phones report reduced motion without the guest asking for it (Android's
	// battery saver turns on "Remove animations"), which left mobile with no animation.
	const lenis = smoothScroll();
	const music = E.music && E.music.src ? createMusic( E.music ) : null;
	const requestWakeLock = keepScreenAwake();
	let presentationStarted = false;
	const startPresentation = () => {
		if ( ! presentationStarted ) {
			presentationStarted = true;
			music && music.play();
		}
		requestWakeLock();
	};
	const intro = introTimeline();
	intro.eventCallback( 'onUpdate', () => {
		if ( intro.progress() > 0 && ! presentationStarted ) startPresentation();
	} );
	sections();

	// Tapping the seal plays the opening by scrolling to the end of the pinned intro.
	$( '.seal' ).addEventListener( 'click', () => {
		startPresentation();
		lenis.scrollTo( intro.scrollTrigger.end, { duration: 3.2, easing: ( t ) => ( t < 0.5 ? 2 * t * t : 1 - Math.pow( -2 * t + 2, 2 ) / 2 ) } );
	} );

	// The "swipe down" cue carries on to the story, and nudges harder if the guest sits still.
	const cue = $( '.scroll-cue' );
	cue.addEventListener( 'click', () => lenis.scrollTo( '.story-name', { duration: 1.6 } ) );
	let idle;
	const watchIdle = () => {
		clearTimeout( idle );
		cue.classList.remove( 'is-nudging' );
		idle = setTimeout( () => cue.classList.add( 'is-nudging' ), 3500 );
	};
	lenis.on( 'scroll', watchIdle );
	watchIdle();

	// Keep the invitation moving automatically, but pause for guests and resume after
	// ten seconds without input. Avoid autoplay for guests who prefer reduced motion.
	let autoScrollTimer;
	let returnScrollTimer;
	let autoScrolling = false;
	const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	const scrollSpeed = () => {
		const width = window.innerWidth;
		const viewportRatio = width <= 640 ? 0.075 : width <= 1023 ? 0.1 : 0.13;
		return Math.min( 140, Math.max( 50, window.innerHeight * viewportRatio ) );
	};
	const durationFor = ( distance ) => Math.max( 2, distance / scrollSpeed() );
	const autoPages = [ '.story-name', '.story-families', '.save-date', '.ceremony', '.venue', '.footer' ];
	let nextPageIndex = 0;
	const autoScrollCycle = () => {
		autoScrolling = true;
		if ( nextPageIndex < autoPages.length ) {
			const page = $( autoPages[ nextPageIndex ] );
			if ( ! page ) {
				nextPageIndex++;
				autoScrolling = false;
				autoScrollTimer = setTimeout( autoScrollCycle, 5000 );
				return;
			}
			lenis.scrollTo( page, {
				duration: nextPageIndex === 0
					? Math.max( 2, Math.abs( page.getBoundingClientRect().top ) / 180 )
					: durationFor( Math.abs( page.getBoundingClientRect().top ) ),
				easing: ( t ) => t,
				onComplete: () => {
					autoScrolling = false;
					nextPageIndex++;
					autoScrollTimer = setTimeout( autoScrollCycle, 5000 );
				},
			} );
			return;
		}
		lenis.scrollTo( 'bottom', {
			duration: durationFor( lenis.limit - lenis.scroll ),
			easing: ( t ) => t,
			onComplete: () => {
				returnScrollTimer = setTimeout( () => {
					lenis.scrollTo( 'top', {
						immediate: true,
						onComplete: () => {
							autoScrolling = false;
							nextPageIndex = 0;
							autoScrollTimer = setTimeout( autoScrollCycle, 5000 );
						},
					} );
				}, 5000 );
			},
		} );
	};
	const pauseForGuest = () => {
		requestWakeLock();
		clearTimeout( autoScrollTimer );
		clearTimeout( returnScrollTimer );
		if ( autoScrolling ) {
			lenis.stop();
			lenis.start();
			autoScrolling = false;
		}
		const nextPage = autoPages.findIndex( ( selector ) => $( selector ).getBoundingClientRect().top > 100 );
		nextPageIndex = nextPage < 0 ? autoPages.length : nextPage;
		autoScrollTimer = setTimeout( autoScrollCycle, 10000 );
	};
	if ( ! reducedMotion ) {
		[ 'wheel', 'touchstart', 'touchmove', 'pointerdown', 'keydown', 'focusin' ].forEach( ( event ) =>
			window.addEventListener( event, pauseForGuest, { passive: true, capture: true } )
		);
		autoScrollTimer = setTimeout( autoScrollCycle, 5000 );
	}

	// The endless decoration (falling petals, rising hearts, heartbeats) runs on its own,
	// so it is left out for guests who ask for reduced motion.
	mm.add( '(prefers-reduced-motion: no-preference)', () => ambient() );
	return lenis;
}

/* ------------------------------------------------------------------ start */

render();
wire();
document.fonts.ready.then( () => {
	motion();
	document.documentElement.classList.add( 'is-ready' );
	ScrollTrigger.refresh();
} );
