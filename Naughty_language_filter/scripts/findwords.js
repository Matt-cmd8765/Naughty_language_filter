//object with key value pairs of bad words
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

// get arrays of keys and values which are the naughty words
let words = Object.keys(list);
let replace = Object.values(list);

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
// have script start immediately following page load
window.onload = filterword();

// FOR LIST.HTML
// combine into on big array for list function
let x = []

for (let i = 0; i < words.length; i++){
    x.push(words[i]);
    x.push(replace[i]);
}

// Creat html table by looping through x

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