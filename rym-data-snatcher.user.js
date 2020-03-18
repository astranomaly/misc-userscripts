// ==UserScript==
// @name         RYM Everything Snatcher
// @namespace    https://github.com/astranomaly
// @version      0.2.1
// @description  Grabs a bunch of info off the current RYM release page
// @author       The Outpost
// @run-at       document-end
// @include      https://rateyourmusic.com/release/*
// @include      https://sonemic.com/release/*
// ==/UserScript==

/*
- This script should only be enabled when copying all of a release's data to your
clipboard is desired.
- Data is copied in such a way that it can be pasted into a Google Sheets file.
- Releases that are missing a lot of key data will not successfully copy
*/

( async function () {
    'use strict';

    /* TODO: Redirect to sonemic when the site is released */
    if ( window.location.host === 'sonemic.com' ) {
        window.location.href = window.location.href.replace( /sonemic/g, 'rateyourmusic' );
    }

    const tar = document.querySelector( '.album_info' );
    const info = {
        artist: [],
        album: undefined,
        year: undefined,
        rating: undefined,
        genreGroup: '',
        genre: [],
        playlist: '',
        link: undefined,
    }

    if ( tar ) {
        // Grab the artist
        const artistAtr = tar.querySelectorAll( 'a.artist' );
        artistAtr.forEach( artist => {
            info.artist.push( artist.textContent.trim() );
        } );
        // Grab the album
        info.album = document
            .querySelector( '.album_title' )
            .childNodes[ 0 ]
            .textContent.trim();
        // Grab the year
        const ths = tar.querySelectorAll( 'th' );
        ths.forEach( head => {
            if ( head.textContent === 'Released' ) {
                info.year = head.nextSibling.textContent.trim().substr( -4 );
            }
        } );
        // Grab the rating
        /* TODO: skip rating if <50 votes */
        info.rating = tar.querySelector( '.avg_rating' ).textContent.trim();
        // Grab the genres
        const genreAtr = tar.querySelectorAll( '.release_pri_genres a.genre' );
        genreAtr.forEach( genre => {
            let genreText = genre.textContent.trim().replace( /\band\b/g, '&' );

            if ( [
                'Film Soundtrack',
                'Television Music',
                'Video Game Music',
                'Film Score',
            ].includes( genreText ) ) { genreText = 'Score'; }

            info.genre.push( genreText );
        } );
        // Get link
        info.link = window.location.href

        // Copy to clipboard
        /* Copying to clipboard on page load is not allowed and indeed could be
        unwanted in many cases. This script only initiates copying when the page
        is interacted with. */
        /* TODO: limit listener to a small section of the page / inject button */
        document.querySelector( 'body' ).addEventListener( 'click', () => {
            const nav = navigator;
            if ( nav === undefined ) {
                alert( 'Failed to copy text; missing browser support.' );
                throw new Error( "browser doesn't support 'navigator'?" )
            } else {
                console.log(
                    'artist|', info.artist.join( ' & ' ), '\n',
                    ' album|', info.album, '\n',
                    '  year|', info.year, '\n',
                    'rating|', info.rating, '\n',
                    'ggroup|', info.genreGroup, '\n',
                    ' genre|', info.genre.join( ';' ), '\n',
                    ' playl|', info.playlist, '\n',
                    '  link|', info.link, '\n',
                );

                let output = `${info.artist.join( ' & ' )}\t${info.album}\t${info.year}\t${info.rating}\t${info.genreGroup}\t${info.genre.join( ';' )}\t${info.playlist}\t${info.link}`;

                console.log( output );

                nav.clipboard.writeText( output );
            }
        } );
    }
} )();
