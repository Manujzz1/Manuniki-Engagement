/**
 * Vector artwork, as SVG strings. Everything is drawn in code: no image files.
 *
 * Shared gradients and patterns live in `defs()`, rendered once per page, so the
 * other SVGs can reference them by id.
 */

import * as nickname from './manuniki-path.js';

const GOLD = '#c6a06a';
const WINE = '#7a2238';

/** Heart outline centred on 0 0, about 28 wide. */
const HEART = 'M0 10 C-14 0 -14 -12 -6 -12 C-3 -12 -1 -10 0 -8 C1 -10 3 -12 6 -12 C14 -12 14 0 0 10 Z';

/* ------------------------------------------------------------------ shared defs */

export const defs = () => `
<svg class="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id="g-env-back" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#d79aa2"/><stop offset="1" stop-color="#e2adb3"/>
		</linearGradient>
		<linearGradient id="g-env-side" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="#eebfc3"/><stop offset="1" stop-color="#f3cdd0"/>
		</linearGradient>
		<linearGradient id="g-env-side-r" x1="1" y1="0" x2="0" y2="0">
			<stop offset="0" stop-color="#eebfc3"/><stop offset="1" stop-color="#f3cdd0"/>
		</linearGradient>
		<linearGradient id="g-env-bottom" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#f7d9db"/><stop offset="1" stop-color="#efc4c8"/>
		</linearGradient>
		<linearGradient id="g-env-flap" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#ebb8bd"/><stop offset="1" stop-color="#f5d2d5"/>
		</linearGradient>
		<pattern id="p-liner" width="30" height="30" patternUnits="userSpaceOnUse">
			<rect width="30" height="30" fill="${ WINE }"/>
			<path d="${ HEART }" transform="translate(15 15) scale(0.32)" fill="${ GOLD }" opacity="0.6"/>
			<circle cx="0" cy="0" r="1.3" fill="${ GOLD }" opacity="0.5"/>
			<circle cx="30" cy="0" r="1.3" fill="${ GOLD }" opacity="0.5"/>
			<circle cx="0" cy="30" r="1.3" fill="${ GOLD }" opacity="0.5"/>
			<circle cx="30" cy="30" r="1.3" fill="${ GOLD }" opacity="0.5"/>
		</pattern>
		<radialGradient id="g-wax" cx="0.38" cy="0.32" r="0.75">
			<stop offset="0" stop-color="#c94b63"/><stop offset="0.55" stop-color="#93243d"/><stop offset="1" stop-color="#5f1226"/>
		</radialGradient>
		<radialGradient id="g-rose" cx="0.4" cy="0.35" r="0.75">
			<stop offset="0" stop-color="#f6c1c9"/><stop offset="0.6" stop-color="#e3899a"/><stop offset="1" stop-color="#c25c72"/>
		</radialGradient>
		<radialGradient id="g-rose-deep" cx="0.4" cy="0.35" r="0.75">
			<stop offset="0" stop-color="#d9687f"/><stop offset="0.6" stop-color="#a8344f"/><stop offset="1" stop-color="#7a2238"/>
		</radialGradient>
		<linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#9bb59a"/><stop offset="1" stop-color="#5f7f62"/>
		</linearGradient>
		<linearGradient id="g-petal" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#f8cdd3"/><stop offset="1" stop-color="#e08a9b"/>
		</linearGradient>
		<linearGradient id="g-heart" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#ee9aab"/><stop offset="1" stop-color="#c24d68"/>
		</linearGradient>
	</defs>
</svg>`;

/* ------------------------------------------------------------------ envelope (600 × 400) */

export const envelopeBack = () => `
<svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
	<rect width="600" height="400" rx="10" fill="url(#g-env-back)"/>
	<path d="M0 0 H600 L300 250 Z" fill="url(#p-liner)" opacity="0.95"/>
</svg>`;

export const envelopeFront = () => `
<svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
	<path d="M0 10 Q0 0 9 4 L300 232 L9 396 Q0 400 0 390 Z" fill="url(#g-env-side)"/>
	<path d="M600 10 Q600 0 591 4 L300 232 L591 396 Q600 400 600 390 Z" fill="url(#g-env-side-r)"/>
	<path d="M0 390 Q0 400 10 400 H590 Q600 400 600 390 L300 200 Z" fill="url(#g-env-bottom)"/>
	<path d="M30 384 L300 214 L570 384" fill="none" stroke="${ GOLD }" stroke-width="1.6" opacity="0.8"/>
	<path d="M44 384 L300 223 L556 384" fill="none" stroke="${ GOLD }" stroke-width="0.8" opacity="0.5"/>
</svg>`;

export const flapFront = () => `
<svg viewBox="0 0 600 250" preserveAspectRatio="none" aria-hidden="true">
	<path d="M0 0 H600 L318 238 Q300 252 282 238 Z" fill="url(#g-env-flap)"/>
	<path d="M14 6 L292 232 Q300 239 308 232 L586 6" fill="none" stroke="${ GOLD }" stroke-width="1.8" opacity="0.9"/>
	<path d="M34 6 L296 220 Q300 223 304 220 L566 6" fill="none" stroke="${ GOLD }" stroke-width="0.8" opacity="0.55"/>
</svg>`;

// Drawn tip-up: the face is turned over with rotateX(180deg), so it reads tip-down until the
// flap opens, then sits above the envelope with its tip pointing up.
export const flapBack = () => `
<svg viewBox="0 0 600 250" preserveAspectRatio="none" aria-hidden="true">
	<path d="M0 250 H600 L318 12 Q300 -2 282 12 Z" fill="url(#p-liner)"/>
	<path d="M0 250 H600 L318 12 Q300 -2 282 12 Z" fill="none" stroke="${ GOLD }" stroke-width="1.4" opacity="0.6"/>
</svg>`;

/**
 * Wax seal shaped as a heart, with the couple's initials as one monogram: for M and N,
 * the M's last stroke is also the N's first, a long middle line that runs below both
 * letters, and the N's last stroke rises above them. The two letters are separate paths so
 * main.js can draw them apart and slide them together into the monogram.
 *
 * @param {string[]} initials Two letters.
 * @return {string} SVG.
 */
export const seal = ( initials ) => {
	const mn = initials.join( '' ).toUpperCase() === 'MN';
	const letters = mn
		? `<path class="seal-m" d="M30 58 L30 36 L40 50 L50 36 L50 65"/>
			<path class="seal-n" d="M50 65 L50 36 L68 58 L68 29"/>`
		: `<text x="50" y="57" text-anchor="middle" class="seal-text">${ initials.join( '' ).replace( /[&<>]/g, '' ) }</text>`;
	return `
<svg viewBox="0 0 100 100" aria-hidden="true">
	<g class="seal-wax">
		<path d="${ HEART }" transform="translate(50 52) scale(3.25)" fill="url(#g-wax)"/>
		<path d="${ HEART }" transform="translate(50 51.5) scale(2.8)" fill="none" stroke="#efc9a0" stroke-width="0.45" opacity="0.65"/>
		<!-- Scaled to sit inside the inner heart with room to spare. -->
		<g transform="translate(49 45) scale(0.78) translate(-49 -47)">
			<g class="seal-monogram" fill="none" stroke="#f3d6a4" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round">${ letters }</g>
		</g>
	</g>
</svg>`;
};

/* ------------------------------------------------------------------ ornaments */

export const corner = ( cls ) => `
<svg class="corner ${ cls }" viewBox="0 0 60 60" aria-hidden="true">
	<path d="M4 58 V22 C4 11 11 4 22 4 H58" fill="none" stroke="${ GOLD }" stroke-width="1.4"/>
	<path d="M10 58 V26 C10 16 16 10 26 10 H58" fill="none" stroke="${ GOLD }" stroke-width="0.8" opacity="0.7"/>
	<path d="${ HEART }" transform="translate(18 18) rotate(-45) scale(0.3)" fill="${ GOLD }"/>
	<circle cx="36" cy="10" r="1.3" fill="${ GOLD }"/><circle cx="10" cy="36" r="1.3" fill="${ GOLD }"/>
</svg>`;

/** Heart with rose vines either side, stroke only so it can be drawn on scroll. */
export const divider = () => `
<svg class="divider draw" viewBox="0 0 420 60" aria-hidden="true">
	<g fill="none" stroke="${ GOLD }" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		<path d="${ HEART }" transform="translate(210 30) scale(1.25)"/>
		<path d="M188 30 C168 30 160 18 140 22 C120 26 112 40 92 38 C72 36 64 26 44 28 C30 30 24 38 14 34"/>
		<path d="M232 30 C252 30 260 18 280 22 C300 26 308 40 328 38 C348 36 356 26 376 28 C390 30 396 38 406 34"/>
		<path d="M140 22 C136 12 144 6 152 8 C150 16 146 20 140 22 Z M280 22 C284 12 276 6 268 8 C270 16 274 20 280 22 Z"/>
		<path d="M92 38 C90 48 98 54 106 50 C102 44 98 40 92 38 Z M328 38 C330 48 322 54 314 50 C318 44 322 40 328 38 Z"/>
		<path d="M44 28 C40 18 30 16 24 20 C30 26 36 28 44 28 Z M376 28 C380 18 390 16 396 20 C390 26 384 28 376 28 Z"/>
	</g>
	<g fill="${ GOLD }">
		<circle cx="120" cy="30" r="1.8"/><circle cx="300" cy="30" r="1.8"/>
		<circle cx="66" cy="22" r="1.4"/><circle cx="354" cy="22" r="1.4"/>
	</g>
</svg>`;

/**
 * Rose seen from above: a soft disc with a spiral of petals.
 *
 * @param {number} cx   Centre x.
 * @param {number} cy   Centre y.
 * @param {number} r    Radius.
 * @param {string} fill Gradient id.
 * @return {string} SVG group.
 */
export const rose = ( cx, cy, r, fill = 'g-rose' ) => {
	const s = r * 0.22;
	const f = ( n ) => n.toFixed( 2 );
	const spiral = `M${ f( -s ) } 0 A${ f( s ) } ${ f( s ) } 0 0 1 ${ f( s ) } 0 A${ f( 2 * s ) } ${ f( 2 * s ) } 0 0 1 ${ f( -3 * s ) } 0 A${ f( 3 * s ) } ${ f( 3 * s ) } 0 0 1 ${ f( 3 * s ) } 0`;
	return `<g class="rose" transform="translate(${ f( cx ) } ${ f( cy ) })">
		<circle r="${ f( r ) }" fill="url(#${ fill })"/>
		<path d="${ spiral }" fill="none" stroke="#9c3550" stroke-width="${ f( Math.max( 0.8, r * 0.09 ) ) }" stroke-linecap="round" opacity="0.6"/>
	</g>`;
};

const leaf = ( x, y, len, angle ) =>
	`<path class="leaf" transform="translate(${ x.toFixed( 1 ) } ${ y.toFixed( 1 ) }) rotate(${ angle })" d="M0 0 C${ len * 0.3 } ${ -len * 0.22 } ${ len * 0.75 } ${ -len * 0.2 } ${ len } 0 C${ len * 0.75 } ${ len * 0.2 } ${ len * 0.3 } ${ len * 0.22 } 0 0 Z" fill="url(#g-leaf)"/>`;

/**
 * A garland of roses and leaves swagged across the top of a section, with a few
 * hearts hanging from it.
 *
 * @param {number} count Number of roses.
 * @return {string} SVG.
 */
export const garland = ( count = 9 ) => {
	const W = 1200;
	const sag = ( x ) => {
		const t = x / W;
		return 4 + Math.sin( t * Math.PI ) * 46;
	};
	let leaves = '';
	for ( let x = 10; x < W; x += 34 ) {
		const y = sag( x );
		leaves += leaf( x, y, 26, ( x / 34 ) % 2 ? -30 : 150 );
		leaves += leaf( x + 14, y + 2, 22, ( x / 34 ) % 2 ? 40 : -140 );
	}
	let roses = '';
	let charms = '';
	for ( let i = 0; i < count; i++ ) {
		const x = ( W / count ) * ( i + 0.5 );
		const y = sag( x );
		roses += rose( x, y, i % 2 ? 15 : 20, i % 3 === 1 ? 'g-rose-deep' : 'g-rose' );
		if ( i % 2 ) {
			const len = 30 + ( i % 4 ) * 8;
			charms += `<g class="charm" transform="translate(${ x.toFixed( 1 ) } ${ ( y + 12 ).toFixed( 1 ) })">
				<path d="M0 0 V${ len }" stroke="${ GOLD }" stroke-width="1"/>
				<path d="${ HEART }" transform="translate(0 ${ len + 10 }) scale(0.7)" fill="url(#g-heart)"/>
			</g>`;
		}
	}
	return `
<svg class="garland" viewBox="0 0 ${ W } 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
	<path class="vine" d="M0 4 Q${ W / 2 } 96 ${ W } 4" fill="none" stroke="#7f9a80" stroke-width="2"/>
	${ charms }${ leaves }${ roses }
</svg>`;
};

/** A single falling rose petal. */
export const petal = () => `
<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 24 C2 18 0 8 4 2 C7 4 9 5 10 3 C11 5 13 4 16 2 C20 8 18 18 10 24 Z" fill="url(#g-petal)"/><path d="M10 6 V20" stroke="#fff" stroke-width="0.6" opacity="0.4"/></svg>`;

/** A floating heart. */
export const heart = () => `<svg viewBox="-14 -13 28 24" aria-hidden="true"><path d="${ HEART }" fill="url(#g-heart)"/></svg>`;

/** A falling heart with the couple's initials ("M", "N" or "MN") written inside. */
export const letterHeart = ( text ) => `
<svg viewBox="-14 -13 28 24" aria-hidden="true"><path d="${ HEART }" fill="url(#g-heart)"/><text x="0" y="-1.5" text-anchor="middle" dominant-baseline="central" font-family="'Cormorant Garamond', serif" font-weight="600" font-size="${ text.length > 1 ? 8.5 : 11 }" fill="#fff">${ text.replace( /[&<>]/g, '' ) }</text></svg>`;

/* ------------------------------------------------------------------ the couple under a rose arch */

/**
 * Silhouettes of the couple holding hands beneath an arch of roses. The arch is
 * stroked (drawn on scroll); the figures are filled and fade in.
 */
export const couple = () => {
	// Roses along the arch: a semicircle centred at 200 150, radius 150. The arch stands
	// tall so the couple, drawn large, fit beneath it.
	let roses = '';
	let leaves = '';
	const n = 15;
	for ( let i = 0; i < n; i++ ) {
		const a = Math.PI + ( i / ( n - 1 ) ) * Math.PI;
		const x = 200 + Math.cos( a ) * 150;
		const y = 150 + Math.sin( a ) * 150;
		const deg = ( a * 180 ) / Math.PI;
		leaves += leaf( x, y, 20, deg + 60 ) + leaf( x, y, 18, deg - 70 );
		roses += rose( x, y, i % 2 ? 9 : 12, i % 3 === 1 ? 'g-rose-deep' : 'g-rose' );
	}
	return `
<svg class="couple-art" viewBox="16 -34 368 422" role="img" aria-label="Illustration of the couple holding hands under an arch of roses">
	<g class="arch" fill="none" stroke="${ GOLD }" stroke-width="2" stroke-linecap="round">
		<path d="M50 380 V150 A150 150 0 0 1 350 150 V380"/>
		<path d="M62 380 V150 A138 138 0 0 1 338 150 V380" stroke-width="1" opacity="0.7"/>
		<path d="M24 380 H376"/>
	</g>
	<g class="arch-flowers">${ leaves }${ roses }</g>
	<!-- The couple, drawn at 1.7 times their original size, standing on the ground line. -->
	<g class="figures" fill="${ WINE }" transform="translate(200 374) scale(1.7) translate(-200 -374)">
		<!-- Groom: head, suit and trousers. -->
		<circle cx="171" cy="196" r="15"/>
		<path d="M150 228 Q152 214 171 213 Q190 214 192 228 L196 296 L185 296 L183 374 L173 374 L171 306 L169 374 L159 374 L157 296 L146 296 Z"/>
		<path d="M164 214 L171 232 L178 214 Z" fill="#fbf1ee"/>
		<!-- Bride: head, bun, and a gown that flares to the floor. -->
		<circle cx="227" cy="200" r="13.5"/>
		<circle cx="238" cy="192" r="7"/>
		<path d="M213 230 Q215 217 227 216 Q239 217 241 230 L243 262 Q262 320 270 374 L188 374 Q196 320 211 262 Z"/>
		<!-- Joined hands. -->
		<path d="M191 236 Q198 262 205 266 Q211 262 214 240" fill="none" stroke="${ WINE }" stroke-width="7" stroke-linecap="round"/>
	</g>
	<path class="couple-heart" d="${ HEART }" transform="translate(199 32) scale(1.1)" fill="url(#g-heart)"/>
</svg>`;
};

/* ------------------------------------------------------------------ icons (64 × 64, line art) */

const icon = ( cls, paths ) => `
<svg class="${ cls } draw" viewBox="0 0 64 64" aria-hidden="true">
	<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ paths }</g>
</svg>`;

export const rings = () =>
	icon(
		'rings-icon',
		`<circle cx="25" cy="40" r="14"/>
		<circle cx="39" cy="40" r="14"/>
		<path d="M32 10 L37 16 L32 22 L27 16 Z"/>
		<path d="M27 16 H37"/>
		<path d="M48 10 L50 14 M54 18 L50 18 M16 10 L14 14 M10 18 L14 18"/>`
	);

/* ------------------------------------------------------------------ venue */

/** A small function hall with an arched door and strings of lights. */
export const hall = () => {
	let bulbs = '';
	for ( let i = 0; i <= 12; i++ ) {
		const t = i / 12;
		const x = 140 + t * 520;
		const y = 40 + 80 * t * ( 1 - t );
		bulbs += `<circle class="bulb" cx="${ x.toFixed( 1 ) }" cy="${ ( y + 6 ).toFixed( 1 ) }" r="3.2"/>`;
	}
	return `
<svg class="hall draw" viewBox="0 0 800 260" aria-hidden="true">
	<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
		<path d="M20 244 H780"/>
		<path d="M230 244 V140 H570 V244"/>
		<path d="M216 140 L400 70 L584 140 Z"/>
		<path d="M400 96 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0"/>
		<path d="M360 244 V184 A40 40 0 0 1 440 184 V244"/>
		<path d="M400 144 V244"/>
		<path d="M262 160 H318 V206 H262 Z M290 160 V206 M262 183 H318"/>
		<path d="M482 160 H538 V206 H482 Z M510 160 V206 M482 183 H538"/>
		<path d="M244 244 V146 M556 244 V146"/>
		<path d="M140 40 Q400 80 660 40"/>
		<path d="M110 244 V200 M90 200 C70 186 82 160 104 166 C112 146 142 150 144 170 C164 172 164 198 140 200 Z"/>
		<path d="M690 244 V200 M710 200 C730 186 718 160 696 166 C688 146 658 150 656 170 C636 172 636 198 660 200 Z"/>
		<path d="${ HEART }" transform="translate(400 96) scale(0.5)"/>
	</g>
	<g fill="currentColor" opacity="0.9">${ bulbs }</g>
</svg>`;
};

/**
 * The couple's nickname as vector lettering that `main.js` writes like a pen: wide
 * mask lines follow the centre of each stroke in writing order, so the letters
 * appear only where the pen has been. The i dots sit outside the mask and are
 * tapped in as the pen passes. Without the animation the whole word shows.
 *
 * @param {string} label Accessible name, e.g. "Manuniki".
 * @param {string} id    Prefix for the mask id, unique per copy on the page.
 * @return {string} SVG.
 */
export const nicknameScript = ( label, id = 'nn' ) => {
	const [ x, y, w, h ] = nickname.viewBox;
	return `
<svg class="nickname-script" viewBox="${ x } ${ y } ${ w } ${ h }" role="img" aria-label="${ label }">
	<defs>
		<mask id="${ id }-mask" maskUnits="userSpaceOnUse" x="${ x }" y="${ y }" width="${ w }" height="${ h }">
			<g fill="none" stroke="#fff" stroke-width="82" stroke-linecap="round" stroke-linejoin="round">
				${ nickname.strokes.map( ( s ) => `<path class="nn-pen" d="${ s.d }" data-dots="${ s.dots.join( ' ' ) }" data-duration="${ s.duration }" data-ease="${ s.ease.join( ' ' ) }"/>` ).join( '' ) }
			</g>
		</mask>
	</defs>
	<g fill="currentColor">
		<g mask="url(#${ id }-mask)">${ nickname.letters.map( ( d ) => `<path d="${ d }"/>` ).join( '' ) }</g>
		${ nickname.dots.map( ( dot ) => `<path class="nn-dot" d="${ dot.d }"/>` ).join( '' ) }
	</g>
</svg>`;
};
