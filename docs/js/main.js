function startBlog() {

  window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted ||
                          ( typeof window.performance != "undefined" &&
                                window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
      window.location.reload();
    }
  });
  console.log('Registered event-listener that reloads page after using the back-button');

  const l = document.location;
  console.log("Current location", l.href, l.pathname, l.search, l.hash);

  console.log("Showdown: ", showdown);
  let BLOG = {};
  document.BLOG = BLOG;
  BLOG.coordinates = {};
  BLOG.defaultLanguage = "en";
  BLOG.currentHighlight = '';

  function loadFile(url, callback) {
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = function () {
      if (client.readyState === XMLHttpRequest.DONE) {
        const status = client.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          callback(client.responseText);
        } else if (status === 404) {
          console.log("Load file: Not found", url);
        } else {
          // There has been an error with the request
          console.log("ERROR: Load file", url);
        }
      }
    };
    client.send();
  }

  function showCoordinates(coordinates) {
    if (coordinates.language) {
      BLOG.language = coordinates.language;
    }
    var kind = coordinates.kind;
    var path = coordinates.path;
    var fragment = coordinates.fragment;
    if (kind === "post") {
      showPost(path, fragment);
    } else if (kind === "bib") {
      showBibliography(path, fragment);
    } else {
      showMessage("I18nNotFound");
    }
  }

  function showPage(fragment) {
    const parts = fragment.split("@");
    if (parts[0]) {
      console.log('Show page: switch to:', parts[0]);
      BLOG.language = parts[0];
    }
    const kind = parts[1];
    const path = parts[2];
    const subFragment = parts.length >= 4 ? parts[3] : '';
    if (kind === "post") {
      showPost(path, subFragment);
    } else if (kind === "bib") {
      showBibliography(path, subFragment);
    } else {
      showMessage("I18nNotFound");
    }
  }

  function showPost(path, fragment) {
    loadFile(path, (contents) => {
      const converter = new showdown.Converter();
      const post = document.getElementById('post');
      post.innerHTML = converter.makeHtml(contents + '<p>&nbsp;</p><p>&nbsp;</p>');
      console.log('Converted MD to HTML');
      fixLinks(post);
      navigateTo(BLOG.language, 'post', path, fragment);
    });
  }

  function showMessage(i18nKey) {
    const post = document.getElementById("post");
    appendSpan(post, "", i18nKey);
    navigateTo(BLOG.language, '404', 'message')
  }

  function loadJson(url, callback) {
    loadFile(url, (content) => {
      console.log("Load JSON: parsing", url);
      const parsed = JSON.parse(content);
      callback(parsed);
    });
  }

  function finalizeIndex() {
    document.getElementsByTagName("body")[0].className =
      "lang" + BLOG.language.toUpperCase();
    console.log("Finalize index: languages", BLOG.index.languages);

    let languages = Object.keys(BLOG.index.languages);
    languages.sort();
    const selectElement = document.createElement("select");
    selectElement.onchange = changeLanguage;
    for (const language of languages) {
      console.log("Add language", language);
      const optionElement = document.createElement("option");
      optionElement.setAttribute("value", language);
      optionElement.append(document.createTextNode(language.toUpperCase()));
      if (language === BLOG.language) {
        optionElement.setAttribute("selected", "selected");
      }
      selectElement.append(optionElement);
    }
    const container = document.getElementById("language-selector-container");
    container.innerHTML = "";
    container.append(selectElement);

    selectElement.setAttribute("id", "language-selector");
    let postKeys = [];
    for (const postKey in BLOG.index.postDetails) {
      console.log("Finalize index: postKey", postKey);
      postKeys.push(postKey);
    }
    postKeys.sort();
    postKeys.reverse();
    console.log("Finalize index: postKeys", postKeys);
    BLOG.index.postKeys = postKeys;
    const ulElement = document.createElement("ul");
    for (const postKey of postKeys) {
      console.log("Finalize index: create item for: postKey", postKey);
      const liElement = document.createElement("li");
      const postDetails = BLOG.index.postDetails[postKey];
      let postLanguage = undefined;
      for (const language in postDetails.lang) {
        if (language === BLOG.language) {
          postLanguage = language;
        } else if (!postLanguage && language === BLOG.defaultLanguage) {
          postLanguage = language;
        }
      }
      if (postLanguage) {
        console.log(
          "Finalize index: create item for: postKey",
          postKey,
          postLanguage,
        );
        liElement.append(document.createTextNode(" "));
        const linkElement = document.createElement("a");
        const postUrl =
          postDetails["baseUrl"] +
          "/" +
          postLanguage +
          "-" +
          postDetails.postId +
          ".md";
        linkElement.setAttribute(
          "href",
          "?l=" + postLanguage + "&k=post&p=" + encodeURIComponent(postUrl),
        );
        const postDate = postDetails.month + "-" + postDetails.day;
        linkElement.append(
          document.createTextNode(
            postDetails.lang[postLanguage].title || postDetails.postId,
          ),
        );
        linkElement.setAttribute("title", postDate);
        linkElement.onclick = (event) => {
          console.log(postUrl);
          showPost(postUrl);
        };
        liElement.append(linkElement);
      }
      ulElement.append(liElement);
    }
    const headerElement = document.createElement("h2");
    appendSpan(headerElement, "", "I18nPostsHeader");

    const bibHeaderElement = document.createElement("h2");
    appendSpan(bibHeaderElement, "", "I18nBibTitle");
    const bibLink = document.createElement("a");
    bibLink.setAttribute("href", "#");
    appendSpan(bibLink, "", "I18nReadMore");
    bibLink.onclick = (event) => {
      showPage(BLOG.language + "@bib@bibliography.json");
    };

    const indexElement = document.getElementById("index");
    indexElement.innerHTML = "";
    indexElement.append(headerElement);
    indexElement.append(ulElement);
    indexElement.append(bibHeaderElement);
    indexElement.append(bibLink);
  }

  function changeLanguage(event) {
    const target = event.target;
    const newLanguage = target.value;
    console.log("Change language:", target, newLanguage);
    const coordinates = extractCoordinates(document.location);
    const itemType = coordinates.kind;
    const itemPath = coordinates.path;
    if (newLanguage && BLOG.language !== newLanguage) {
      console.log("New language:", newLanguage);
      BLOG.language = newLanguage;
      navigateTo(newLanguage, itemType, itemPath);
      console.log("New location:", document.location.href);
      finalizeIndex();
    }
    if (itemType === "post") {
      const dateParts = itemPath.replace(/\/[^/]*$/, "").split("/");
      const monthPath = dateParts[0] + "/" + dateParts[1];
      const postKey = itemPath
        .replace(/^.*\/[a-z]*-/, "")
        .replace(/[.]md$/, "");
      console.log("Current page:", dateParts, postKey);
      loadJson(monthPath + "/index.json", (monthIndex) => {
        const day = dateParts[2];
        const postDetails = monthIndex[day][postKey];
        console.log("Change language: post details:", postDetails);
        if (postDetails.lang[newLanguage]) {
          const postPath =
            monthPath + "/" + day + "/" + newLanguage + "-" + postKey + ".md";
          console.log("Change language: post path:", postPath);
          showPost(postPath);
        }
      });
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
          const yearMonth = month.split("-");
          postDetails.baseUrl = yearMonth[0] + "/" + yearMonth[1] + "/" + day;
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
    };
  }

  function createGlobalIndex(indexSource) {
    console.log("Create global index");
    const months = indexSource.months;
    let indexToDo = {};
    BLOG.indexToDo = indexToDo;
    BLOG.index = {
      languages: {},
      postDetails: {},
    };
    if (!BLOG.coordinates.language) {
      BLOG.coordinates.language = indexSource.defaults.language;
    }
    BLOG.language = BLOG.coordinates.language;
    if (!BLOG.coordinates.path) {
      BLOG.coordinates.kind = 'post';
      const path = '/' + indexSource.defaults.post.dir + '/' + BLOG.coordinates.language + "-" + indexSource.defaults.post.name + ".md";
      console.log("Path of default post:", path);
      BLOG.coordinates.path = path;
    }
    for (const monthPair of months) {
      const month = monthPair[0] + "-" + monthPair[1];
      indexToDo[month] = true;
      const monthUrl = monthPair[0] + "/" + monthPair[1] + "/index.json";
      loadJson(monthUrl, updateMonthIndex(month));
    }
  }

  function fixLinks(parent) {
    if (parent.tagName.toLowerCase() === "a") {
      const href = parent.getAttribute("href");
      console.log("Fix link:", href);
      if (href.startsWith("#!")) {
        console.log("Add onclick for:", href);
        parts = href.substring(2).split('@')
        if (parts.length >= 3) {
          const language = parts[0] ? parts[0] : BLOG.language;
          fragment = parts.length >= 4 ? parts[3] : '';
          parent.href = makeUrl(language, parts[1], parts[2], fragment)
        }
        parent.onclick = (event) => {
          showPage(href.substring(2));
        };
      } else if (href.startsWith('?')) {
        console.log("Add onclick for:", href);
        const parts = href.split('#');
        const fragment = (parts.length >= 2 && parts[1]) ? parts[1] : '';
        const coordinates = extractCoordinates({ 'search': parts[0], 'hash': fragment });
        if (!coordinates.language) {
          coordinates.language = BLOG.language;
        }
        parent.onclick = (event) => {
          showCoordinates(coordinates);
        };
      } else if (href.startsWith("#")) {
        parent.onclick = (event) => {
          const coords = extractCoordinates(window.location);
          navigateTo(coords.language, coords.kind, coords.path, href);
        }
      } else {
        parent.setAttribute("target", "_blank");
        parent.className = "externalLink";
      }
    } else {
      for (const child of parent.children) {
        fixLinks(child);
      }
    }
  }

  function showBibliography(url, fragment) {
    loadJson(url, (entries) => {
      const highlight = (fragment && fragment.startsWith('#')) ? fragment.substring(1) : fragment;
      const post = document.getElementById("post");
      post.innerText = "";
      const heading = document.createElement("h1");
      appendSpan(heading, "", "I18nBibTitle");
      post.append(heading);
      for (const entry of entries) {
        const asciiKey = entry.asciiKey ? entry.asciiKey : entry.key;
        const div = document.createElement("div");
        div.id = asciiKey;
        if (asciiKey === highlight) {
          div.className = "bibEntry highlight";
        } else {
          div.className = "bibEntry";
        }
        appendSpan(div, entry.key, "bibKey");
        if (entry["item-title"]) {
          appendSpan(div, '"');
          appendSpan(div, entry["item-title"], "bibItemTitle");
          appendSpan(div, '"');
        } else {
          appendSpan(div, entry.title, "bibTitle");
        }
        if (entry.authors.length > 0) {
          appendSpan(div, ", ");
          let authors = entry.authors.slice();
          const lastAuthor = authors.pop();
          if (authors.length === 0) {
            appendSpan(div, lastAuthor, "bibAuthor");
          } else {
            const firstAuthor = authors.shift();
            appendSpan(div, firstAuthor, "bibAuthor");
            for (const extraAuthor of authors) {
              appendSpan(div, ", ");
              appendSpan(div, extraAuthor, "bibAuthor");
            }
            appendSpan(div, "", "I18nBibAuthorsAnd");
            appendSpan(div, lastAuthor, "bibAuthor");
          }
        }
        if (entry["item-title"]) {
          appendSpan(div, "; in ");
          appendSpan(div, entry.title, "bibTitle");
          if (entry.volume) {
            appendSpan(div, " vol. ");
            appendSpan(div, "" + entry.volume, "bibVolume");
          }
        }
        if (entry.year) {
          appendSpan(div, ", ");
          appendSpan(div, "" + entry.year, "bibYear");
        }
        appendSpan(div, "", "I18nLanguage" + entry.lang.toUpperCase());
        post.append(div);
      }
      const spacer = document.createElement('div');
      spacer.innerHTML = '<p>&nbsp;</p><p>&nbsp;</p>'
      post.append(spacer);
      navigateTo(BLOG.language, 'bib', 'bibliography.json', fragment);
    });
  }

  function appendSpan(parent, text, className) {
    const span = document.createElement("span");
    if (className) {
      span.className = className;
    }
    span.append(document.createTextNode(text));
    parent.append(span);
  }

  function navigateTo(language, kind, path, fragment) {
    const translatedPath = path.replace(/\/[a-z][a-z](-.*)$/, '/' + language + '$1')
    const url = makeUrl(language, kind, translatedPath, fragment);
    const parts = document.location.href.split('/', 4);
    const ref = parts.length >= 4 ? '/' + parts[3] : '';
    if (url !== ref) {
      const baseUrl = parts.length >= 3 ? parts[0] + '//' + parts[2] : '';
      console.log('Navigate from:', document.location.href, ': to:', baseUrl + url);
      window.location.href = baseUrl + url;
      console.log('New window location:', window.location);
    } else {
      console.log('Remain on:', ref);
    }
    var id = (fragment && fragment.startsWith('#')) ? fragment.substring(1) : fragment;
    if (id) {
      if (BLOG.currentHighlight) {
        removeHighlight(BLOG.currentHighlight);
        BLOG.currentHighlight = '';
      }
      addHighlight(id);
      BLOG.currentHighlight = id;
      const anchor = document.getElementById(id);
      console.log('Scroll into view:', id, anchor);
      if (anchor) {
        anchor.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        });
        document.getElementById('post').parentNode.scrollBy(0, -40)
      }
    }
  }

  function removeHighlight(id) {
    const element = document.getElementById(id);
    if (element) {
      element.className = element.className.replace(/ ?highlight/, '');
    }
  }

  function addHighlight(id) {
    removeHighlight(id);
    const element = document.getElementById(id);
    if (element) {
      element.className = (element.className ? element.className + ' ' : '') + 'highlight';
    }
  }

  function makeUrl(language, kind, path, fragment) {
    var search = '';
    if (language) {
      search += '&l=' + language;
    }
    if (kind) {
      search += '&k=' + kind;
    }
    if (path) {
      search += '&p=' + encodeURIComponent(path);
    }
    if (search.length > 0) {
      search = '?' + search.substring(1);
    }
    var fragmentPart = fragment ? fragment : '';
    if (!fragmentPart.startsWith('#')) {
      fragmentPart = '#' + fragmentPart;
    }
    return document.location.pathname + search + fragmentPart;
  }

  function extractCoordinates(location) {
    var result = {};
    if (location.search) {
      const query = location.search.substring(1);
      const vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        const field = pair[0];
        const value = decodeURIComponent(pair[1]);
        if (field === 'l') {
          result.language = value;
        } else if (field === 'k') {
          result.kind = value;
        } else if (field === 'p') {
          result.path = value;
        }
      }
      if (location.hash) {
        result.fragment = location.hash;
      }
    } else if (location.hash && location.hash.startsWith('#!')) {
      result = extractCoordinatesFromHash(location.hash);
    }
    if (!result.language) {
      result.language = BLOG.language;
    }
    console.log("Extracted coordinates:", result);
    return result;
  }

  function extractCoordinatesFromHash(hash) {
    const triple = location.search.substring(2);
    const vars = hash.split('@');
    if (vars.length < 3) {
      return {};
    }
    result = {};
    if (vars[0]) {
      result.language = vars[0];
    }
    if (vars[1]) {
      result.kind = vars[1];
    }
    if (vars[2]) {
      result.path = vars[2];
    }
    return result;
  }

  BLOG.coordinates = extractCoordinates(document.location);
  console.log("Loading index.json...");
  loadJson("index.json", (indexSource) => {
    createGlobalIndex(indexSource);

    console.log('Coordinates:', BLOG.coordinates);
    showCoordinates(BLOG.coordinates);
  });
}

// http://localhost:8080/?l=nl&k=post&p=/2026/08/15/nl-NewGame.md
