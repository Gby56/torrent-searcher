/**
 * Copyright 2017 DOLCINI Stanislas, JOUGLET Rémi, MARQUET Gabriel
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use
 * , copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT 
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

"use strict";
var Promise = require('promise');


/**
 * Default port used by application.
 */
const g_serverVariables = {
    "port": process.env.PORT,
    "ip": process.env.IP
};


    
//##################### IMPORT MODULES #####################
let ExtraTorrentAPI = require('extratorrent-api').Website;
let extraTorrentAPI = new ExtraTorrentAPI();

let PirateBay = require('thepiratebay')

let TorrentSearchApi = require('torrent-search-api');
let torrentSearch = new TorrentSearchApi();
        
let express = require('express');
let app = express();


app.listen(g_serverVariables.port, g_serverVariables.ip);
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});
app.get('/index', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});



        // ----------------------- EXTRATORRENTS -----------------------
        var ExtraTorrentPromise = Promise.resolve(extraTorrentAPI.search({
          with_words: 'tokyo',
          })
          .then(results => {return results})
          .catch(err => console.error(err))
          );
          
        // ----------------------- THEPIRATEBAY -----------------------
        var PirateBayPromise = Promise.resolve(PirateBay.search('tokyo', {
          category: 'all',    // default - 'all' | 'all', 'audio', 'video', 'xxx', 
                              //                   'applications', 'games', 'other' 
                              // 
                              // You can also use the category number: 
                              // `/search/0/99/{category_number}` 
          filter: {
            verified: false    // default - false | Filter all VIP or trusted torrents 
          },
          page: 0,            // default - 0 - 99 
          orderBy: 'leeches', // default - name, date, size, seeds, leeches 
          sortBy: 'desc'      // default - desc, asc 
        })
        .then(results => {Promise.resolve(results)})
        .catch(err => console.log(err))
        );
        
        // ----------------------- TORRENTSEARCH -----------------------
        torrentSearch.enableProvider('1337x');
        torrentSearch.enableProvider('Torrent9');
        
        // Search '1080' in 'Movies' category and limit to 20 results 
        var torrentSearchPromise = Promise.resolve(
                    torrentSearch.search('tokyo','all', 20)
             .then(results => {
                 return results;
             })
             .catch(err => {
                 console.log(err);
             })
            );

torrentSearchPromise.then()
PirateBayPromise.then()
ExtraTorrentPromise.then()