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
let Promise = require('promise');
/**
 * Default port used by application.
 */
const g_serverVariables = {
    "port": process.env.PORT,
    "ip": process.env.IP,
    "search_keywords": ""
};



//##################### IMPORT MODULES #####################
let ExtraTorrentAPI = require('extratorrent-api').Website;
let extraTorrentAPI = new ExtraTorrentAPI();

let PirateBay = require('thepiratebay')

let TorrentSearchApi = require('torrent-search-api');
let torrentSearch = new TorrentSearchApi();
let express = require('express');
let app = express();
var bodyParser = require('body-parser')
let server = require('http').Server(app);
server.listen(g_serverVariables.port);
//app.listen(g_serverVariables.port, g_serverVariables.ip);
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});
app.get('/index', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});
app.get('/form_action', (request, response) => {
    response.sendFile(__dirname + '/form_action.js')
});
app.get('/style_css', (request, response) => {
    response.sendFile(__dirname + '/style.css')
});
app.use(bodyParser.urlencoded({
    extended: true
}));



let performQuery = function(search_keywords) {

    // ----------------------- EXTRATORRENTS -----------------------
    //let ExtraTorrentPromise = Promise.resolve({});
    /*extraTorrentAPI.search({
            "with_words": search_keywords
        }).then(result => {
            let clean = [];
            for (let r of result.results) {
                clean.push({
                    "title": r.title,
                    "url": r.url,
                    "size": r.size,
                    "seeds": r.seeds,
                    "leechers": r.leechers
                });
            }
            return clean;
        })
        .catch(err => console.log(err))
    );*/
    // ----------------------- THEPIRATEBAY -----------------------
    let PirateBayPromise = Promise.resolve(PirateBay.search(search_keywords, {
            category: 'all', // default - 'all' | 'all', 'audio', 'video', 'xxx',
            //                   'applications', 'games', 'other'
            //
            // You can also use the category number:
            // `/search/0/99/{category_number}`
            filter: {
                verified: false // default - false | Filter all VIP or trusted torrents
            },
            page: 0, // default - 0 - 99
            orderBy: 'leeches', // default - name, date, size, seeds, leeches
            sortBy: 'desc' // default - desc, asc
        })
        .then(results => {
            let clean = [];
            for (let r of results) {
                clean.push({
                    "title": r.name,
                    "url": r.link,
                    "size": r.size,
                    "seeds": r.seeders,
                    "leechers": r.leechers
                });
            }
            return clean;
        })
        .catch(err => {
            return err
        })
    );

    // ----------------------- TORRENTSEARCH -----------------------
    torrentSearch.enableProvider('1337x');
    torrentSearch.enableProvider('Torrent9');
    torrentSearch.enableProvider('Torrentz2');
    torrentSearch.enableProvider('ZeTorrents');

    // Search '1080' in 'Movies' category and limit to 20 results
    let torrentSearchPromise = Promise.resolve(
        torrentSearch.search(search_keywords, 'all', 20)
        .then(results => {
            let clean = [];
            for (let r of results) {
                clean.push({
                    "title": r.title,
                    "url": r.desc,
                    "size": r.size,
                    "seeds": r.seeds,
                    "leechers": (!(isNaN(r.peers - r.seed)) &&
                            (r.peers - r.seed > 0)) ?
                        r.peers - r.seed : 0
                });
            }
            return clean;
        })
        .catch(err => {
            return err;
        })
    );

    Promise.all([torrentSearchPromise, PirateBayPromise /*, ExtraTorrentPromise*/ ]).then(values => {
        let resultArray = [];
        let torrentTitleList = [];
        for (let i = 0; i < values.length; ++i) {
            if (values[i] !== [] && values[i] !== undefined) {
                for (let torrent of values[i]) {
                    if (!torrentTitleList.some(title => title === torrent.title)) {
                        torrentTitleList.push(torrent.title);
                        resultArray.push(torrent);
                    }
                }
            }
            else {
                console.log("error in value " + i);
            }
        }
        //console.log(resultArray);
        console.log(resultArray.length + " result(s) found.");
    }).catch(err => console.log(err));
}
app.post('/', (request, response) => {
    g_serverVariables.search_keywords = request.body.search_keywords;
    console.log("In POST: " + request.body.search_keywords);
});
app.get('/getData', (req, res) => {
    console.log("In GET: " + g_serverVariables.search_keywords);
    performQuery(g_serverVariables.search_keywords);
    // ----------------------- THEPIRATEBAY -----------------------
    let PirateBayPromise = Promise.resolve(PirateBay.search(g_serverVariables.search_keywords, {
            category: 'all', // default - 'all' | 'all', 'audio', 'video', 'xxx',
            //                   'applications', 'games', 'other'
            //
            // You can also use the category number:
            // `/search/0/99/{category_number}`
            filter: {
                verified: false // default - false | Filter all VIP or trusted torrents
            },
            page: 0, // default - 0 - 99
            orderBy: 'leeches', // default - name, date, size, seeds, leeches
            sortBy: 'desc' // default - desc, asc
        })
        .then(results => {
            let clean = [];
            for (let r of results) {
                clean.push({
                    "title": r.name,
                    "url": r.link,
                    "size": r.size,
                    "seeds": r.seeders,
                    "leechers": r.leechers
                });
            }
            return clean;
        })
        .catch(err => {
            return err
        })
    );

    // ----------------------- TORRENTSEARCH -----------------------
    torrentSearch.enableProvider('1337x');
    torrentSearch.enableProvider('Torrent9');
    torrentSearch.enableProvider('Torrentz2');
    torrentSearch.enableProvider('ZeTorrents');

    // Search '1080' in 'Movies' category and limit to 20 results
    let torrentSearchPromise = Promise.resolve(
        torrentSearch.search(g_serverVariables.search_keywords, 'all', 20)
        .then(results => {
            let clean = [];
            for (let r of results) {
                clean.push({
                    "title": r.title,
                    "url": r.desc,
                    "size": r.size,
                    "seeds": r.seeds || 0,
                    "leechers": r.peers || 0
                });
            }
            return clean;
        })
        .catch(err => {
            return err;
        })
    );
    console.log('test semgrep');
    Promise.all([torrentSearchPromise, PirateBayPromise, /* ExtraTorrentPromise*/]).then(values => {
        let resultArray = [];
        let torrentTitleList = [];
        for (let i = 0; i < values.length - 1; ++i) {
            for (let torrent in values[i]) {
                if (!torrentTitleList.some(title => title === values[i][torrent].title)) {
                    torrentTitleList.push(values[i][torrent].title);
                    resultArray.push(values[i][torrent]);
                }
            }
        }
        console.log(resultArray);
        
        console.log(resultArray.length + " result(s) found.");
        return resultArray;
    }).then((value) => {
        value.sort(function(a, b){return b.seeds -a.seeds});
        return value;
       
    }).then((value) => {
         res.json(value);
    }).catch(err => console.log(err));
});
