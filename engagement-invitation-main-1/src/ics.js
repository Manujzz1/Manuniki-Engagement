/**
 * "Add to calendar": builds an .ics file with every event and downloads it.
 */

const stamp = ( iso ) => new Date( iso ).toISOString().replace( /[-:]/g, '' ).replace( /\.\d{3}/, '' );
const text = ( value ) => String( value ).replace( /\\/g, '\\\\' ).replace( /\n/g, '\\n' ).replace( /([,;])/g, '\\$1' );

/**
 * Fold lines longer than 75 octets, as RFC 5545 requires.
 *
 * @param {string} line Content line.
 * @return {string} Folded line.
 */
function fold( line ) {
	const bytes = new TextEncoder().encode( line );
	if ( bytes.length <= 75 ) {
		return line;
	}
	const parts = [];
	let current = '';
	let size = 0;
	for ( const ch of line ) {
		const n = new TextEncoder().encode( ch ).length;
		if ( size + n > ( parts.length ? 74 : 75 ) ) {
			parts.push( current );
			current = '';
			size = 0;
		}
		current += ch;
		size += n;
	}
	parts.push( current );
	return parts.join( '\r\n ' );
}

export function buildIcs( w ) {
	const couple = `${ w.groom } & ${ w.bride }`;
	const location = [ w.venue.name, w.venue.address ].filter( Boolean ).join( ', ' );
	const now = stamp( new Date().toISOString() );
	const lines = [ 'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Engagement Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${ text( couple ) }` ];
	w.events.forEach( ( e ) => {
		lines.push(
			'BEGIN:VEVENT',
			`UID:${ e.id }-${ stamp( e.start ) }@engagement-invitation`,
			`DTSTAMP:${ now }`,
			`DTSTART:${ stamp( e.start ) }`,
			`DTEND:${ stamp( e.end || e.start ) }`,
			`SUMMARY:${ text( `${ e.name } · ${ couple }` ) }`,
			`LOCATION:${ text( e.venue || location ) }`,
			`DESCRIPTION:${ text( e.note || '' ) }`,
			'END:VEVENT'
		);
	} );
	lines.push( 'END:VCALENDAR' );
	return lines.map( fold ).join( '\r\n' ) + '\r\n';
}

export function downloadIcs( w ) {
	const blob = new Blob( [ buildIcs( w ) ], { type: 'text/calendar;charset=utf-8' } );
	const url = URL.createObjectURL( blob );
	const a = document.createElement( 'a' );
	a.href = url;
	a.download = `${ w.groom.split( ' ' )[ 0 ] }-${ w.bride.split( ' ' )[ 0 ] }-engagement.ics`.toLowerCase();
	document.body.appendChild( a );
	a.click();
	a.remove();
	setTimeout( () => URL.revokeObjectURL( url ), 1000 );
}
