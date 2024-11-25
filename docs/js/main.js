function startBlog () {
    console.log("Showdown: ", showdown);
    let BLOG = {};
    document.BLOG = BLOG;
    BLOG.language = 'nl';
    const defaultLanguage = 'en';

    function loadFile(url, callback) {
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function() {
            if (client.readyState === XMLHttpRequest.DONE) {
                const status = client.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // The request has been completed successfully
                    callback(client.responseText);
                } else if (status === 404) {
                    console.log("Load file: Not found", url)
                } else {
                    // There has been an error with the request
                    console.log("ERROR: Load file", url)
                }
            }
        }
        client.send();
    }

    function showPage(fragment) {
        const parts = fragment.split('@');
        const kind = parts[0];
        const path = parts[1];
        if (kind === 'post') {
            showPost(path);
        } else if (kind === 'bib') {
            showBibliography(path);
        } else {
            showMessage('I18nNotFound');
        }
    }

    function showPost(url) {
        loadFile(
            url,
            (contents) => {
                const converter = new showdown.Converter();
                const post = document.getElementById("post");
                post.innerHTML = converter.makeHtml(contents);
                fixLinks(post);
                const baseUrl = document.location.pathname;
                console.log("Base URL:", baseUrl);
                document.location = baseUrl + '#!post@' + url;
            }
        );
    }

    function showMessage(i18nKey) {
        const post = document.getElementById("post");
        appendSpan(post, '', i18nKey);
        document.location = document.location.pathname + '#!404@message'; // Remove fragment
    }

    function loadJson(url, callback) {
        loadFile(url, (content) => {
            console.log("Load JSON: parsing", url)
            const parsed = JSON.parse(content);
            callback(parsed);
        })
    }

    function finalizeIndex() {
        document.getElementsByTagName('body')[0].className = 'lang' + BLOG.language.toUpperCase();
        console.log("Finalize index: languages", BLOG.index.languages);

        let languages = Object.keys(BLOG.index.languages);
        languages.sort();
        const selectElement = document.createElement('select');
        selectElement.onchange = changeLanguage;
        for (const language of languages) {
            console.log('Add language', language);
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', language);
            optionElement.append(document.createTextNode(language.toUpperCase()))
            if (language === BLOG.language) {
                optionElement.setAttribute('selected', 'selected');
            }
            selectElement.append(optionElement);
        }
        const container = document.getElementById('language-selector-container');
        container.innerHTML = '';
        container.append(selectElement);

        selectElement.setAttribute('id', 'language-selector')
        let postKeys = [];
        for (const postKey in BLOG.index.postDetails) {
            console.log("Finalize index: postKey", postKey);
            postKeys.push(postKey);
        }
        postKeys.sort();
        postKeys.reverse();
        console.log("Finalize index: postKeys", postKeys);
        BLOG.index.postKeys = postKeys;
        const ulElement = document.createElement('ul');
        for (const postKey of postKeys) {
            console.log("Finalize index: create item for: postKey", postKey);
            const liElement = document.createElement('li');
            const postDetails = BLOG.index.postDetails[postKey];
            let postLanguage = undefined;
            for (const language in postDetails.lang) {
                if (language === BLOG.language) {
                    postLanguage = language;
                } else if (!postLanguage && language === defaultLanguage) {
                    postLanguage = language;
                }
            }
            if (postLanguage) {
                console.log("Finalize index: create item for: postKey", postKey, postLanguage);
                liElement.append(document.createTextNode(' '));
                const linkElement = document.createElement('a');
                const postUrl = postDetails['baseUrl'] + '/' + postLanguage + '-' + postDetails.postId + '.md';
                linkElement.setAttribute('href', '#!' + postLanguage + '@post@' + postUrl);
                const postDate = postDetails.month + "-" + postDetails.day;
                linkElement.append(document.createTextNode(postDetails.lang[postLanguage].title || postDetails.postId))
                linkElement.setAttribute('title', postDate);
                linkElement.onclick = (event) => {
                    console.log(postUrl);
                    showPost(postUrl);
                }
                liElement.append(linkElement);
            }
            ulElement.append(liElement);
        }
        const headerElement = document.createElement('h2');
        appendSpan(headerElement, '', 'I18nPostsHeader')

        const bibHeaderElement = document.createElement('h2');
        appendSpan(bibHeaderElement, '', 'I18nBibTitle')
        const bibLink = document.createElement('a')
        bibLink.setAttribute('href', '#');
        appendSpan(bibLink, '', 'I18nReadMore')
        bibLink.onclick = (event) => {
            showPage('bib@bibliography.json');
        }

        const indexElement = document.getElementById('index');
        indexElement.innerHTML = '';
        indexElement.append(headerElement);
        indexElement.append(ulElement);
        indexElement.append(bibHeaderElement);
        indexElement.append(bibLink);
    }

    function changeLanguage(event) {
        const target = event.target;
        const newLanguage = target.value;
        console.log("Change language:", target, newLanguage);
        if (newLanguage) {
            BLOG.language = newLanguage;
            finalizeIndex();
        }
        const itemFragment = document.location.href.split('#!')[1];
        const itemType = itemFragment.split('@')[0];
        const itemPath = itemFragment.split('@')[1];
        if (itemType === 'post') {
            const dateParts = itemPath.replace(/\/[^/]*$/, '').split('/');
            const monthPath = dateParts[0] + '/' + dateParts[1];
            const postKey = itemPath.replace(/^.*\/[a-z]*-/, '').replace(/[.]md$/, '');
            console.log('Current page:', dateParts, postKey);
            loadJson(
                monthPath + '/index.json',
                (monthIndex) => {
                    const day = dateParts[2];
                    const postDetails = monthIndex[day][postKey];
                    console.log('Change language: post details:', postDetails);
                    if (postDetails.lang[newLanguage]) {
                        const postPath = monthPath + '/' + day + '/' + newLanguage + '-' + postKey + '.md';
                        console.log('Change language: post path:', postPath);
                        showPost(postPath);
                    }
                }
            )
        }
    }

    function updateMonthIndex(month) {
        return (indexSource) => {
            console.log("Update month index");
            for (const day in indexSource) {
                console.log("Update month index: day", day);
                const daySource = indexSource[day];
                for (const postId in daySource) {
                    console.log("Update month index: day, postId", day, postId);
                    let postDetails = daySource[postId];
                    postDetails.postId = postId;
                    postDetails.month = month;
                    postDetails.day = day;
                    if (!postDetails.lang) {
                        postDetails.lang = {};
                    }
                    const postKey = month + "-" + day + ":" + postId;
                    const yearMonth = month.split('-');
                    postDetails.baseUrl = yearMonth[0] + '/' + yearMonth[1] + '/' + day;
                    BLOG.index.postDetails[postKey] = postDetails;
                    for (const language in postDetails.lang) {
                        BLOG.index.languages[language] = true;
                    }
                }
            }
            delete BLOG.indexToDo[month];
            if (Object.keys(BLOG.indexToDo).length === 0) {
                finalizeIndex();
            }
        }
    }

    function createGlobalIndex(indexSource) {
        let indexToDo = {};
        BLOG.indexToDo = indexToDo;
        BLOG.index = {
            "languages": {},
            "postDetails": {}
        };
        for (const monthPair of indexSource) {
            const month = monthPair[0] + "-" + monthPair[1];
            indexToDo[month] = true;
            const monthUrl = monthPair[0] + "/" + monthPair[1] + "/index.json"
            loadJson(monthUrl, updateMonthIndex(month));
        }
    }

    loadJson('index.json', createGlobalIndex);

    function fixLinks(parent) {
        if (parent.tagName.toLowerCase() === 'a') {
            const href = parent.getAttribute('href');
            if (href.startsWith('#!')) {
                console.log('Add onclick for:', href);
                parent.onclick = (event) => {
                    showPage(href.substring(2));
                };
            } else {
                parent.setAttribute('target', '_blank');
                parent.className = 'externalLink'
            }
        } else {
            for (const child of parent.children) {
                fixLinks(child);
            }
        }
    }

    function showBibliography(url) {
        loadJson(
            url,
            (entries) => {
                document.location = document.location.pathname + '#!bib@bibliography.json'; // Remove fragment
                const post = document.getElementById("post");
                post.innerText = '';
                const heading = document.createElement('h1');
                appendSpan(heading, '', 'I18nBibTitle')
                post.append(heading);
                for (const entry of entries) {
                    const div = document.createElement('div');
                    div.className = 'bibEntry';
                    const anchor = document.createElement('a');
                    anchor.id = entry.key;
                    div.append(anchor);
                    appendSpan(div, entry.key, 'bibKey');
                    if (entry['item-title']) {
                        appendSpan(div, '"');
                        appendSpan(div, entry['item-title'], 'bibItemTitle');
                        appendSpan(div, '"');
                    } else {
                        appendSpan(div, entry.title, 'bibTitle');
                    }
                    if (entry.authors.length > 0) {
                        appendSpan(div, ', ')
                        let authors = entry.authors.slice();
                        const lastAuthor = authors.pop();
                        if (authors.length === 0) {
                            appendSpan(div, lastAuthor, 'bibAuthor')
                        } else {
                            const firstAuthor = authors.shift();
                            appendSpan(div, firstAuthor, 'bibAuthor')
                            for (const extraAuthor of authors) {
                                appendSpan(div, ', ')
                                appendSpan(div, extraAuthor, 'bibAuthor')
                            }
                            appendSpan(div, '', 'I18nBibAuthorsAnd')
                            appendSpan(div, lastAuthor, 'bibAuthor')
                        }
                    }
                    if (entry['item-title']) {
                        appendSpan(div, '; in ');
                        appendSpan(div, entry.title, 'bibTitle');
                        if (entry.volume) {
                            appendSpan(div, ' vol. ');
                            appendSpan(div, '' + entry.volume, 'bibVolume');
                        }
                    }
                    if (entry.year) {
                        appendSpan(div, ', ')
                        appendSpan(div, '' + entry.year, 'bibYear')
                    }
                    appendSpan(div, '', 'I18nLanguage' + entry.lang.toUpperCase())
                    post.append(div);
                }
            }
        );
    }

    function appendSpan(parent, text, className) {
        const span = document.createElement('span');
        if (className) {
            span.className = className;
        }
        span.append(document.createTextNode(text));
        parent.append(span);
    }

    const originalUrl = document.location.href;
    const fragment = originalUrl.split('#!')[1];

    const postPath = fragment || 'post@2024/11/11/nl-EvolutionaryArchitecture.md'
    console.log("Post path:", postPath);
    showPage(postPath);
}
