// ==UserScript==
// @name         Trakt Export Title
// @namespace    https://github.com/astranomaly
// @version      0.0.1
// @description  Grabs the title & year of all movies from a Trakt list as CSV
// @author       The Outpost
// @run-at       document-end
// @include      https://trakt.tv/*
// ==/UserScript==

( async function () {
    'use strict';

    /**
     * Note: this script works reasonably well for exporting to Letterboxd, however Trakt doesn't include "the" in the data-title selector, and LB has a habit of prefering exact title matches over close title + exact year. This means you'll likely have to fix any entry that starts with "The" especially if it's a short title. The LB importer makes this trivial though.
     */

    const nav = navigator;
    const tar = document.querySelector( '#sortable-grid' );
    const info = [];

    const titleGrabber = () => {
        const itemList = tar.querySelectorAll('.grid-item');
        itemList.forEach( (item) => {
            if(item.style.display === 'none'){
                console.log( 'skipping', item.getAttribute( 'data-title' ));
            }else{
                let title = item.getAttribute( 'data-title' ).slice( 0, -7 ).replace('"', '\"');
                let year = item.getAttribute( 'data-title' ).slice( -5, -1 );
                info.push( [ `"${title}"`, year ] )
            }

        });
        const output = `Title,Year\n${info.join('\n')}`;

        if ( nav !== undefined ) {
            nav.clipboard.writeText( output );
            console.log( output );
        }
    }

    const copyButton = () => {
        document.querySelector('body').style.position = 'relative';
        const btnStyle = [
            'position:sticky',
            'bottom:0',
            'right:0',
            'text-align:center',
            'z-index:99999',
            'cursor:pointer',
            'padding:5px',
            'background:white',
            'width:50px',
            'float:right'
        ].join(';');

        const btn = document.createElement('div');
        btn.setAttribute('style', btnStyle);
        btn.innerHTML = 'Copy';

        document.querySelector('body').appendChild(btn);

        btn.addEventListener('click', titleGrabber);
    }

    copyButton();

} )();
