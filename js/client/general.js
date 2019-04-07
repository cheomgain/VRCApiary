let isMenuUp = false;

if (localStorage.getItem("worldNames") === null) {
    localStorage.setItem("worldNames", "{}");
}

if (localStorage.getItem("keepsakes") === null) {
    localStorage.setItem("keepsakes", "[]");
}

if (localStorage.getItem("requests") === null) {
    localStorage.setItem("requests", "0");
}
if (localStorage.getItem("failedRequests") === null) {
    localStorage.setItem("failedRequests", "0");
}

const sendNotification = (title, body, image, callback) => {
    const options = {
        body: body
    };
    if (image !== undefined) {
        options.icon = image;
    }
    let notify = new Notification(title, options);
    notify.onclick = callback;
};

// TODO proper icons and copyright
const getIconFor = (name) => {
    switch (name) {
        case "info":
            return "https://i.imgur.com/YFPOhDF.png";
        case "debug":
            return "https://i.imgur.com/vdhVjqM.png";
        case "ok":
            return "https://i.imgur.com/mX6fF8K.png";
        default:
            return "https://i.imgur.com/mX6fF8K.png";
    }
};

// TODO logging
const println = (message) => {
    console.log(message);
};

const getId = (id) => {
    return document.getElementById(id);
};

const pageLoad = () => {
    getId("content").style.opacity = "0";
    getId("loadingIcon").style.opacity = "1";
};

/**
 * Navigate to a page
 * @param page  Name of the page
 * @param flag  Query params for the page
 */
const navToPage = (page, flag) => {
    const nav = getId("navButton");
    const menu = getId("navMenu");
    const content = getId("content");
    if (nav !== null) {
        nav.style.visibility = "visible";
        setTimeout(() => {
            nav.style.opacity = "1";
        }, 100);
    }
    if (menu !== null && isMenuUp === true) {
        menu.style.opacity = "0";
        setTimeout(() => {
            menu.style.visibility = "hidden";
            if (content !== null) {
                content.style.filter = "none";
            }
        }, 300);
        isMenuUp = false;
    }
    pageLoad();
    let destination;
    switch (page) {
        case "home": {
            destination = "./home.html";
            break;
        }
        case "friends": {
            destination = "./friends.html";
            if (flag !== undefined) {
                destination += flag;
            }
            break;
        }
        case "instance": {
            destination = "./instance.html";
            if (flag !== undefined) {
                destination += flag;
            }
            break;
        }
        case "avatars": {
            destination = "./avatars.html";
            break;
        }
        case "mods": {
            destination = "./moderations.html";
            break;
        }
        case "profile": {
            destination = "./profile.html";
            if (flag !== undefined) {
                destination += flag;
            }
            break;
        }
    }
    setTimeout(() => {
        document.location = destination;
    }, 300);
};

const toggleMenu = () => {
    const menu = getId("navMenu");
    const content = getId("content");
    const nav = getId("navButton");
    if (isMenuUp === false) {
        menu.style.visibility = "visible";
        if (nav !== null) {
            nav.style.opacity = "0";
            setTimeout(() => {
               nav.style.visibility = "hidden";
            }, 100);
        }
        setTimeout(() => {
            menu.style.opacity = "1";
            if (content !== null) {
                content.style.filter = "blur(4px)";
            }
        });
        isMenuUp = true;
    } else {
        menu.style.opacity = "0";
        if (nav !== null) {
            nav.style.visibility = "visible";
            setTimeout(() => {
                nav.style.opacity = "1";
            }, 100);
        }
        setTimeout(() => {
            menu.style.visibility = "hidden";
            if (content !== null) {
                content.style.filter = "none";
            }
        }, 100);
        isMenuUp = false;
    }
};

if (getId("navButton") !== null) {
    getId("navButton").addEventListener('click', () => {
        toggleMenu();
    });
}

/**
 * Key bindings
 */
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "Shift": {
            getId("navButton").parentElement.classList.add("nav-hidden");
            break;
        }
    }
});

/**
 * Key bindings
 */
document.addEventListener('keyup', (e) => {
    const menu = getId("navMenu");
    const content = getId("content");
    if (menu === undefined) {
        return;
    }
    switch (e.key) {
        case "Escape": {
            toggleMenu();
            break;
        }
        case "F1": {
            navToPage("home");
            break;
        }
        case "F2": {
            navToPage("friends");
            break;
        }
        case "Shift": {
            if (getId("navButton").parentElement.classList.contains("nav-hidden")) {
                getId("navButton").parentElement.classList.remove("nav-hidden");
            }
            break;
        }
    }
});

/**
 * Create a new HTML Element
 * @param type          Type of the Element
 * @param css           CSS classes
 * @param innerText     innerText property
 * @returns {Electron.WebviewTag}
 */
const createElement = (type, css, innerText) => {
    const e = document.createElement(type);
    if (css !== undefined) {
        e.setAttribute("class", css);
    }
    if (innerText !== undefined) {
        e.innerText = innerText;
    }
    return e;
};

/**
 * Convert user tags to trust rank value
 * @param tags          User tags
 * @returns {number}    -2 to 5
 */
const tagsToTrustRank = (tags) => {
    let trust_level = 0;
    if (tags !== undefined) {
        // Nuisance
        // noinspection JSUnusedAssignment :: This thing is so spaghetti it breaks IntelliJ IDEA...
        trust_level = tags.indexOf("system_troll") > -1 ? -2 :
            // Troll
            trust_level = tags.indexOf("system_probable_troll") > -1 ? -1 :
                // Veteran a.k.a Legend
                trust_level = tags.indexOf("system_trust_legend") > -1 ? 5 :
                    // Trusted
                    trust_level = tags.indexOf("system_trust_veteran") > -1 ? 4 :
                        // Known
                        trust_level = tags.indexOf("system_trust_trusted") > -1 ? 3 :
                            // User
                            trust_level = tags.indexOf("system_trust_known") > -1 ? 2 :
                                // Visitor
                                trust_level = tags.indexOf("system_trust_basic") > -1 ? 1 : 0;
    }
    return trust_level;
};

/**
 * Trust rank value to a CSS color value
 * @param rank          Value -2 to 5
 * @returns {string}    Color
 */
const trustRankToColor = (rank) => {
    switch (rank) {
        case -2:
            return "#ff2328";
        case -1:
            return "#ff2328";
        case 0:
            return "#cccccc";
        case 1:
            return "#1778ff";
        case 2:
            return "#2bcf5c";
        case 3:
            return "#ff7b42";
        case 4:
            return "#8143e6";
        case 5:
            return "#ffff00";
        default:
            return "white";
    }
};

/**
 * Get Query Params by a name
 * @param name          Parameter name
 * @param url           document.location
 * @returns {String}    Query param value
 */
const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Finish loading and fade in the page
 */
const finishLoading = () => {
    setTimeout(() => {
        getId("content").style.opacity = "1";
    }, 300);
    setTimeout(() => {
        getId("loadingIcon").style.opacity = "0";
    }, 100);
};

/**
 * Create a generic button
 * @param text      Button inner text
 * @param color     Button class name
 * @param func      onClick function
 * @return {Electron.WebviewTag}
 */
const createButton = (text, color, func) => {
	const div = createElement("div", "button " + color, text);
	div.addEventListener("click", func);
	return div;
};

/**
 * Disables an element that doesn't support the disabled tag
 * @param div       The element
 */
const disableDiv = (div) => {
    div.classList.add("disabled");
};

/**
 * Enables an element that has been disabled with {@see disableDiv}
 * @param div       The element
 */
const enableDiv = (div) => {
    div.classList.remove("disabled");
};

if (getId("navMenu") !== null) {
    getId("navHome").addEventListener('click', () => {
        navToPage("home");
    });

    getId("navFriends").addEventListener('click', () => {
        navToPage("friends");
    });

    getId("navAvatars").addEventListener('click', () => {
        navToPage("avatars");
    });

    disableDiv(getId("navParser"));
    disableDiv(getId("navWorlds"));
    disableDiv(getId("navSocial"));
    disableDiv(getId("navSettings"));
}