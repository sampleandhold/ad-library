ad-library
==========

A library of tools for using some logic to create DART urls and place ads on a page, originally created for Caranddriver.com.
This system uses an object of page info printed onto the page to make lots of decisions about DART sites, zones, and attributes, stitches them together into an ad url, and then places them into friendly iframes to load asynchronously.
The iframes are resized dynamically when the creative loads, and pushdowns, web-skins, etc. get broken out onto the main page and dealt with.
Also runs companion ads coming in through DART via a Brightcove video player, in sync with pre- and post-roll video ads.

(c) 2012 Hearst Magazines