let articlesList = document.getElementById("articlesList");
const URLstring = "https://encybackendnews.herokuapp.com/api";
let allComments = document.getElementById("allarticles-comments");

document.getElementById("upvotes").style.display = "none";
document.getElementById("down-votes").style.display = "none";
document.getElementById("comments").style.display = "none";

window.onload = () => {
  // getTopics();

  getArticles();
  // getAnArticle();
  // getComments();
};

const getArticles = () => {
  window.location.href === "http://127.0.0.1:5500/index.html";
  fetch(`${URLstring}/articles`)
    .then((response) => response.json())
    .then((data) => {
      data.articles.forEach((article) => {
        let li = document.createElement("li");
        let button = document.createElement("button");
        let titleText = document.createTextNode(article.title);
        button.innerHTML = "read full article";
        li.appendChild(titleText);
        li.appendChild(button);
        button.setAttribute("id", article.article_id);

        if (window.location.href === "http://127.0.0.1:5500/index.html") {
          articlesList.appendChild(li);
        }
        // this was done because there were errors to do with moving appending in the console, once we move to
        //to the grab an article

        button.addEventListener("click", function () {
          getAnArticle(button.id);
        });
      });
    });
};

// fetch an individual article

const getAnArticle = (article_id) => {
  console.log(article_id);
  // smoothScroll(document.getElementById("individual-article"));
  fetch(`${URLstring}/articles/${article_id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("individual-article").scrollIntoView(true);
      document.getElementById("article-header").innerText = data.article.title;
      document.getElementById("oneArticle").innerText = data.article.body;
      document.getElementById(
        "article-votes"
      ).innerText = `Votes ${data.article.votes}`;
      document.getElementById(
        "article-author"
      ).innerText = `Article Author ${data.article.author}`;
      document.getElementById("upvotes").style.display = "inline";
      document.getElementById("down-votes").style.display = "inline";
      document.getElementById("comments").style.display = "inline";
    });
};

// get comments for each article

const getComments = () => {
  fetch(`${URLstring}/articles/${article_id}/comments`)
    .then((response) => response.json())
    .then((data) => {
      data.comments.forEach((comment) => {
        let oneComment = document.createElement("li");
        let commentsAuthor = document.createTextNode(
          "Comment written by " + comment.author
        );
        let commentsText = document.createTextNode(comment.body);
        oneComment.appendChild(commentsText);
        oneComment.appendChild(commentsAuthor);
        oneComment.setAttribute("id", article_id);
        allComments.appendChild(oneComment);
      });
    });
};

// get all topics

// const getTopics = () => {
//   fetch(`${URLstring}/topics`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data.topics)
//     //  data.topics.forEach((article) => {
//     //     let li = document.createElement("li");
//     //     let button = document.createElement("button");
//     //     let titleText = document.createTextNode(article.title);
//     //     button.innerHTML = "read full article";
//     //     li.appendChild(titleText);
//     //     li.appendChild(button);
//     //     button.setAttribute("id", article.article_id);
//     });

//this section deals with the single button, the css and javascript has been taken from an old project

function handleScroll() {
  let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;

  if (rootElement.scrollTop / scrollTotal > 0.5) {
    // Show button
    up_button.classList.add("showBtn");
  } else {
    // Hide button
    up_button.classList.remove("showBtn");
  }
  console.log("hello");
}

let up_button = document.querySelector(".up_button");
let rootElement = document.documentElement;
document.addEventListener("scroll", handleScroll);
up_button.addEventListener("click", scrollUp);
function scrollUp() {
  window.scrollTo({ top: 0, left: 0, behaviour: "smooth" });
}
