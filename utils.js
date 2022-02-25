let articlesList = document.getElementById("articlesList");
let allComments = document.getElementById("allarticles-comments");
let topicsList = document.getElementById("topics-list");
let allArticlesSorted = document.getElementById("allArticles-Sorted");
let postCommentButton = document.getElementById("post-comment-form");

let sortedArticleArray = [];

const URLstring = "https://encybackendnews.herokuapp.com/api";

// we have had to hide some of this stuff onload

let upVotes = document.getElementById("upvotes");

upVotes.style.display = "none";
// document.getElementById("votes-block").style.display = "none";

let downVotes = document.getElementById("down-votes");

downVotes.style.display = "none";

// postCommentButton.style.display = "none";

document.getElementById("comments").style.display = "none";

window.onload = () => {
  getArticles();
  getTopics();
};

// this is potentially going to cause problems
//i.e it wont be showing the loader

document.getElementById("loading").style.display = "block";

// this is potentially going to cause problems
//i.e it wont be showing the loader

const getArticles = () => {
  // window.location.href === "http://127.0.0.1:5500/index.html";
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
        button.setAttribute("class", "btn btn-primary");
        li.setAttribute("class", "list-group-item");
        articlesList.appendChild(li);
        sortedArticleArray.push(article.title);
        document.getElementById("loading").style.display = "none";
        button.addEventListener("click", function () {
          getAnArticle(button.id);
        });
      });
    });
};

// fetch an individual article

const getAnArticle = (article_id) => {
  // smoothScroll(document.getElementById("individual-article"));
  fetch(`${URLstring}/articles/${article_id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("article-header").scrollIntoView(true);
      document.getElementById("article-header").innerText = data.article.title;
      document.getElementById("oneArticle").innerText = data.article.body;
      document.getElementById("article-votes").style.display = "block";
      document.getElementById("article-votes").value = data.article.votes;
      // document.getElementById("votes-block").style.display = "block";
      document.getElementById(
        "article-author"
      ).innerText = `Article Author ${data.article.author}`;

      downVotes.style.display = "inline";
      document.getElementById("comments").style.display = "inline";
      upVotes.addEventListener("click", function () {
        addVoteOnArticle(article_id);
      });
      downVotes.addEventListener("click", function () {
        decreaseVoteOnArticle(article_id);
      });
      getComments(article_id);
      postCommentButton.addEventListener("submit", function (e) {
        let theNewComment = document.getElementById("new-comments").value;
        e.preventDefault();
        postAcomment(article_id, theNewComment);
      });
    });
};

// get comments for each article

const getComments = (article_id) => {
  fetch(`${URLstring}/articles/${article_id}/comments`)
    .then((response) => response.json())
    .then((data) => {
      data.comments.forEach((comment) => {
        let oneComment = document.createElement("li");
        let authorParagraph = document.createElement("p");
        let commentsAuthor = "Comment written by " + comment.author;
        authorParagraph.innerText = commentsAuthor;
        let commentsText = document.createTextNode(comment.body);
        oneComment.appendChild(authorParagraph);
        oneComment.appendChild(commentsText);
        oneComment.setAttribute("id", article_id);
        oneComment.setAttribute("class", "border border-light");
        oneComment.setAttribute("class", "list-group-item");
        authorParagraph.setAttribute("class", "author-paragraph");
        allComments.appendChild(oneComment);
        if (comment.author === "grumpy19") {
          let deleteButton = document.createElement("button");
          // deleteButton.setAttribute("content", "test content");
          deleteButton.setAttribute("class", "delete-button");
          deleteButton.setAttribute("class", "btn btn-danger");
          deleteButton.textContent = "delete";
          oneComment.appendChild(deleteButton);
          deleteButton.addEventListener("click", function () {
            console.log("are we getting in here");
            deleteComment(article_id, comment.comment_id);
          });
        }
      });
    });
};

//this section deals with the single button, the css and javascript has been taken from an old project
//its also a lot of code for a simple functionality

function handleScroll() {
  up_button.classList.add("showBtn");
}

let up_button = document.querySelector(".up_button");
let rootElement = document.documentElement;
document.addEventListener("scroll", handleScroll);
up_button.addEventListener("click", scrollUp);
function scrollUp() {
  window.scrollTo({ top: 0, left: 0, behaviour: "smooth" });
}
//  the section above deals with the single up button
// get topic add display to the the nav bar

const getTopics = () => {
  fetch(`${URLstring}/topics`)
    .then((res) => res.json())
    .then((data) => {
      data.topics.forEach((topic) => {
        let litopic = document.createElement("li");
        let buttonTopic = document.createElement("button");
        buttonTopic.innerHTML = topic.slug;
        litopic.appendChild(buttonTopic);
        litopic.setAttribute("class", "navbar");
        buttonTopic.setAttribute("id", topic.slug);
        buttonTopic.setAttribute("class", "btn btn-primary ");
        topicsList.appendChild(litopic);
        buttonTopic.addEventListener("click", function () {
          // articlesList.style.display = "none";
          sortByTopic(buttonTopic.id);
        });
      });
    });
};

const sortByTopic = (sort) => {
  articlesList.remove();
  topicsList.remove();
  fetch(`${URLstring}/articles?filter=${sort}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("the-topic").innerText = `Topic ${sort}`;
      localStorage.setItem("sortedArticles", JSON.stringify(data.articles));
      let sorted = JSON.parse(localStorage.getItem("sortedArticles"));
      sorted.forEach((article) => {
        let li = document.createElement("li");
        let button = document.createElement("button");
        let titleText = document.createTextNode(article.title);
        button.innerHTML = "read full article";
        li.setAttribute("class", "list-group-item");
        li.appendChild(titleText);
        li.appendChild(button);
        button.setAttribute("id", article.article_id);
        button.setAttribute("class", "btn btn-primary");
        allArticlesSorted.appendChild(li);
        button.addEventListener("click", function () {
          getAnArticle(button.id);
        });
      });
    });
};

// if we have sorted articles we want to be able to store and retrive them
//vote on an article

const addVoteOnArticle = (id) => {
  // console.log(parseInt(document.getElementById("article-votes").innerText) + 1);
  fetch(`${URLstring}/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      inc_votes: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(
      (data) =>
        (document.getElementById("article-votes").value =
          data.article.votes - 1)
    );
};

const decreaseVoteOnArticle = (id) => {
  fetch(`${URLstring}/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      inc_votes: -1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(
      (data) =>
        (document.getElementById("article-votes").value = data.article.votes)
    );
};

const postAcomment = (id, comment) => {
  let dataTobeSent = {
    username: "grumpy19",
    body: comment,
  };
  fetch(`${URLstring}/articles/${id}/comments`, {
    method: "POST",
    body: JSON.stringify(dataTobeSent),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
};

const deleteComment = (article_id, comment_id) => {
  console.log(comment_id);
  fetch(`${URLstring}/articles/${article_id}/comments/${comment_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .then((response) =>
      // this is the data we get after doing the delete request, do whatever you want with this data
      console.log(response)
    );
};
