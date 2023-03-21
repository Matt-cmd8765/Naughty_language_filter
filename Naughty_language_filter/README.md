# Naughty Words Filter

#### Video Demo: <https://youtu.be/5Qb1DwjU8Yo>

#### Description:
This chrome extension filters out some bad words on the internet so you do not have to be exposed to such filth. It will replace the bad words with not so bad words.

**Research**

I first had to research how to create a chrome extension. Luckily google has a great tutorial that explains how to develop a simple chrome extension here: https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/. As I knew I wanted to create a text editor, I determined that I would need a JSON file for the extension's manifest, javascript content script to complete the find and replace function and an icon to represent the extension on the extensions tool bar and on the extensions page in chrome.

**manifest.json**

The first step was to create a manifest for the extension. This specifies the extension name, a description, version numer and the manifest version.

```json

"manifest_version": 3,
"name": "Naughty Words Extension",
"description": "The internet is a naughty place. This filters out some of those no-no words",
"version": "1.0"

```

Next step was to pick an icon for the extension, of which I chose a speech bubble with cartoon swear words in it: "@*!*". This icon is declared for 4 different file sizes in the manifest and saved in PNG format as per chrome's documentation.

```json
"icons": {
    "16": "images/icon.png",
    "32": "images/icon.png",
    "48": "images/icon.png",
    "128": "images/icon.png"
    },
"action":{
    "default_icon": "images/icon.png"
},
```

It is also declared as a default icon. Lastly the manifest declares the content script of "findwords.js" which matches ["https://*/*"], which means the script will run on all html pages.

```json
"content_scripts":[{
        "js": ["scripts/findwords.js"],
        "matches":["https://*/*"]
    }]
```

**findwords.js**

This is the script that will find and replace the naughty words.

The first item is the dict object named 'list' which lists out key:value pairs. The keys are the naughty words and the values are the filtered words.

```javascript
let list = {"fuck": "fudge",
            "bitch": "lovely lady",
            "shit": "sugar",
            "damn": "darn",
            "cunt": "flower",
            "dick": "fallus",
            "hawaiian pizza": "terrible food",
            "ass": "bum",
            "arse": "bum",
            "cocksucker": "lint licker"};
```

Next codes is are variables that will be used in the filterwords function below.

```javascript

let words = Object.keys(list);
let replace = Object.values(list);

```
Next is the matchCase fucntion. This will match the case of the replacemnet word (value) to the original case of the naughty word (key). This uses similar logic as the ceaser problem from week 2.

```javascript

// This matches the case from the webpage and applies it to the replacement text.
function matchCase(text, pattern) {
let result = '';

// loop through each character in the text
for(let i = 0; i < text.length; i++) {
let c = text.charAt(i);
let p = pattern.charCodeAt(i);

// check if char is capital and update the result if yes
if(p >= 65 && p < 65 + 26) {
    result += c.toUpperCase();
}

// check if char is lowercase and update the result if yes
else {
    result += c.toLowerCase();
}
}
return result;
}

```

The main function is te filterwood function. It will find and replace the naughty words with the replacement or 'filtered' word. Oringially I was using

```javascript

document.body.innerhtml = document.body.innerhtml.replace(key, value);

```
to replace words however when testing it with the "ass" key it would break the html page. This is because document.body.innerhtml.replace will replace all instances of the word, even if in the html code. In doing further reading it is seen as not recommended to use this function as it will always be a risk to break the html page.

So eventually I was able to find the createtreewalker and Nodefilter.SHOWTEXT functions which will allow for the altering of text inside the elements. This allowed me to loop through all the nodes with a while loop and then loop through the list of naughty words with a for loop, replacing all the bad words.

```javascript

// to change words without altering html code
function filterword() {
    // select all elements under the html tag
    let html = document.querySelector('html');
    // Find all the text nodes in the html
    let walker = document.createTreeWalker(html, NodeFilter.SHOW_TEXT);
    let node;
    // loop through the nodes
    while (node = walker.nextNode()) {
        // loop through the list and replace words within the node
        for (let i = 0; i < words.length; i++){
            node.nodeValue = node.nodeValue.replace(new RegExp(words[i], "gi"), function(match) {
                return matchCase(replace[i], match)});
        }
    }
}

```

To have the script run when the page is loaded I added the following code:

```javascript

// have script start immediately following page load
window.onload = filterword();

```

There is also an option to view the list of filtered words as a pop-up when you click on the extension. The associated javascript code is:

```javascript

// FOR LIST.HTML
// combine into on big array for list function
let x = []

for (let i = 0; i < words.length; i++){
    x.push(words[i]);
    x.push(replace[i]);
}

// Create html table by looping through x

var table = "<tr>", row = 2;
x.forEach((value, i) => {
  // normal cell
  table += `<td>${value}</td>`;

  // Next row
  var next = i + 1;
  if (next%row==0 && next!=x.length) { table += "</tr><tr>"; }
});
table += "</tr>";

// Attach to the empty table
document.getElementById("wrap").innerHTML = table;

```
**List.html**

The list html file links to the list in the findwords.js file. It presents a list of words and replacement words. There is also some associated css style in this file.

