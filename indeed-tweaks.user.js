// ==UserScript==
// @name Indeed - Hide Sponsored
// @namespace https://github.com/astranomaly
// @author The Outpost
// @match *://*.indeed.com/*
// @grant none
// ==/UserScript==

let results = document.querySelectorAll( '#resultsCol .result' );

results.forEach( result => {
    if ( result.hasAttribute( 'data-ci' ) ) {
        result.style.display = 'none';
    }
} );
