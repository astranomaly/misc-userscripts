// ==UserScript==
// @name         Goodreads Book Info Snatcher
// @namespace    https://github.com/astranomaly
// @version      0.1.0
// @description  Grabs a bunch of book info
// @author       The Outpost
// @run-at       document-end
// @include      https://www.goodreads.com/book/show/*
// ==/UserScript==

( async function () {
    'use strict';

    const tar = document.querySelector( '#metacol' );
    const info = {
        title: undefined,
        series: undefined,
        published: undefined,
        author: [],
        genre: [],
        country: ' ',
        synopsis: undefined,
    }

    const infoGrabber = () => {
        // Grab the basic info
        info.title = tar.querySelector( '#bookTitle' )
            .textContent
            .trim();
        info.series = tar.querySelector( '#bookSeries a' )
            .textContent
            .trim()
            .replace( /[()]/g, '' );
        // Grab publish date
        /* NOTE:
        This looks for a "first published" element and assumes the only numbers it
        contains are the year. If it includes a day the final result will be wrong.
        Ex. January 1st 2020 => 12020  */
        info.published = tar.querySelector( '#details .greyText' )
            .textContent
            .replace( /\D/g, '' );
        // Grab the authors
        const authorTag = tar.querySelectorAll( 'a.authorName span' );
        authorTag.forEach( author => {
            info.author.push( author.textContent.trim() );
        } );
        // Grab the genres
        const genreTag = document.querySelectorAll( '.rightContainer .left .bookPageGenreLink' );
        genreTag.forEach( genre => {
            info.genre.push( genre.textContent.trim() )
        } );
        // Grab the synopsis
        /* NOTE: This will grab the full synopsis, but also the "...more" text */
        info.synopsis = tar.querySelector( '#description' )
            .textContent.trim()
            .replace( /(\r\n|\n|\r)/gm, "---" );

        return info;
    }

    // Copy to clipboard
    document.querySelector( 'body' ).addEventListener( 'click', () => {
        console.log( 'clicked' );

        const bookInfo = infoGrabber();

        const nav = navigator;
        if ( nav !== undefined ) {
            console.log(
                '    title|', bookInfo.title, '\n',
                '   series|', bookInfo.series, '\n',
                'published|', bookInfo.published, '\n',
                '   author|', bookInfo.author.join( ' & ' ), '\n',
                '    genre|', bookInfo.genre.join( ';' ), '\n',
                '  country|', bookInfo.country, '\n',
                ' synopsis|', bookInfo.synopsis, '\n',
            );

            let output = `${bookInfo.title}\t${bookInfo.series}\t${bookInfo.published}\t${bookInfo.author.join( ' & ' )}\t${bookInfo.genre.join( ';' )}\t${bookInfo.country}\t${bookInfo.synopsis}`

            nav.clipboard.writeText( output );
        }
    } );

} )();
