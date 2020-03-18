// ==UserScript==
// @name         RYM Genre Snatcher
// @namespace    https://github.com/astranomaly
// @version      0.1.1
// @description  Grabs the primary genres from RYM album pages in a MusicBee format
// @author       The Outpost
// @run-at       document-end
// @include      https://rateyourmusic.com/release/*
// @include      https://sonemic.com/release/*
// ==/UserScript==

( async function () {
    'use strict';

    let tar = undefined;

    if ( window.location.host === 'sonemic.com' ) {
        tar = document.querySelector( '.main_info_field_genre' );
    } else {
        // window.location.href = window.location.href.replace(/rateyourmusic/g, 'sonemic');
        tar = document.querySelector( '.release_pri_genres' );
    }

    if ( tar ) {
        // Grab the genres
        const genreAtr = tar.querySelectorAll( 'a.genre' );
        let genres = [];
        genreAtr.forEach( genre => {
            let genreText = genre.textContent.replace( /\band\b/g, '&' );

            if ( [
                'Film Soundtrack',
                'Television Music',
                'Video Game Music',
                'Film Score',
            ].includes( genreText ) ) { genreText = 'Score'; }

            genres.push( genreText );
        } );

        // Copy to clipboard
        /* TODO: limit listener to small section of page / inject button */

        document.querySelector( 'body' ).addEventListener( 'click', () => {
            const nav = navigator;
            if ( nav === undefined ) {
                alert( 'Failed to copy text; missing browser support.' );
                throw new Error( "browser doesn't support 'navigator'?" )
            } else {
                nav.clipboard.writeText( genres.join( ';' ) );
            }
        } );
    }
} )();
