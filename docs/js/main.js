function startBlog () {
    console.log("Showdown: ", showdown);
    let BLOG = {};
    document.BLOG = BLOG;

    function loadFile(url, callback) {
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function() {
            if (client.readyState === XMLHttpRequest.DONE) {
                const status = client.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // The request has been completed successfully
                    callback(client.responseText);
                } else {
                    // Oh no! There has been an error with the request!
                    console.log("ERROR: Load file", url)
                }
            }
        }
        client.send();
    }

    function showPost(url) {
        loadFile(
            url,
            (contents) => {
                const converter = new showdown.Converter();
                const post = document.getElementById("post");
                post.innerHTML = converter.makeHtml(contents);
            }
        );
    }

    function loadJson(url, callback) {
        loadFile(url, (content) => {
            console.log("Load JSON: parsing", url)
            const parsed = JSON.parse(content);
            callback(parsed);
        })
    }

    function finalizeIndex() {
        console.log("Finalize index: languages", BLOG.index.languages);
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
            for (const language in postDetails.lang) {
                console.log("Finalize index: create item for: postKey", postKey, language);
                liElement.append(document.createTextNode(' '));
                const linkElement = document.createElement('a');
                const postUrl = postDetails['baseUrl'] + '/' + language + '-' + postDetails.postId + '.md';
                linkElement.setAttribute('md-data', postUrl);
                linkElement.append(document.createTextNode(postDetails.lang[language].title || postDetails.postId))
                linkElement.onclick = (event) => {
                    const postUrl = event.target.getAttribute('md-data');
                    console.log(postUrl);
                    showPost(postUrl);
                }
                liElement.append(linkElement);
            }
            ulElement.append(liElement);
        }
        const headerElement = document.createElement('h2');
        const headerText = document.createTextNode('Posts');
        headerElement.append(headerText);
        const indexElement = document.getElementById('index');
        indexElement.innerHTML = '';
        indexElement.append(headerElement);
        indexElement.append(ulElement);
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

    showPost('2024/11/11/nl-EvolutionaryArchitecture.md');
}
