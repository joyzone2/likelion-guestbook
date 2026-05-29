const homePage = document.querySelector("#homePage");
const writePage = document.querySelector("#writePage");
const listPage = document.querySelector("#listPage");

const postGrid = document.querySelector("#postGrid");
const searchInput = document.querySelector("#searchInput");

const modalBg = document.querySelector("#modalBg");
const detailModal = document.querySelector("#detailModal");
const editModal = document.querySelector("#editModal");
const commentModal = document.querySelector("#commentModal");
const deleteModal = document.querySelector("#deleteModal");
const detailContent = document.querySelector("#detailContent");

function showPage(pageName) {
  homePage.classList.remove("active");
  writePage.classList.remove("active");
  listPage.classList.remove("active");//안보이게하려고!!!

  if (pageName === "home") {
    homePage.classList.add("active");
  }
  if (pageName === "write") {
    writePage.classList.add("active");
  }
  if (pageName === "list") {
    listPage.classList.add("active");
  }
}

function formatDate(value) {
  const month = value.slice(5, 7);
  const day = value.slice(8, 10);
  const hour = value.slice(11, 13);
  const minute = value.slice(14, 16);
  return month + "." + day + " " + hour + ":" + minute;
}

function showModal(modal) {
  modalBg.classList.remove("hide");
  modal.classList.remove("hide");
}

function closeModal() {
  modalBg.classList.add("hide");
  detailModal.classList.add("hide");
  editModal.classList.add("hide");
  commentModal.classList.add("hide");
  deleteModal.classList.add("hide");
}

function getPostById(postId) {
  let result = null;
  for (let i = 0; i < guestbooks.length; i++) {
    if (guestbooks[i].id === postId) {
      result = guestbooks[i];
    }
  }
  return result;
}

function getFilteredPosts() {
  const keyword = searchInput.value.trim().toLowerCase();

  let result = [];

  for (let i = 0; i < guestbooks.length; i++) {
    const post = guestbooks[i];

    const title = post.title.toLowerCase();
    const writer = post.writer.toLowerCase();
    const content = post.content.toLowerCase();

    if (keyword === "") {
      result.push(post);
    } else if (title.indexOf(keyword) !== -1) {
      result.push(post);
    } else if (writer.indexOf(keyword) !== -1) {
      result.push(post);
    } else if (content.indexOf(keyword) !== -1) {
      result.push(post);
    }
  }

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = i + 1; j < result.length; j++) {
      let change = false;

      if (sortType === "latest") {
        if (result[i].created_at < result[j].created_at) {
          change = true;
        }
      }

      if (sortType === "recommend") {
        if (result[i].recommend_count < result[j].recommend_count) {
          change = true;
        }
      }

      if (change === true) {
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }

  return result;
}

function createPostCard(post) {

  const article = document.createElement("article");
  article.classList.add("post-card");

  const textBox = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = post.title;

  const meta = document.createElement("p");
  meta.classList.add("meta");
  meta.textContent = post.writer + " · " + formatDate(post.created_at);

  const preview = document.createElement("p");
  preview.classList.add("preview");
  preview.textContent = post.content;

  textBox.appendChild(title);
  textBox.appendChild(meta);
  textBox.appendChild(preview);

  const buttonBox = document.createElement("div");
  buttonBox.classList.add("card-bottom");

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn");
  likeButton.textContent = "좋아요 " + post.recommend_count;

  likeButton.addEventListener("click", () => {
    likePost(post.id);
  });

  const detailButton = document.createElement("button");
  detailButton.classList.add("detail-btn");
  detailButton.textContent = "자세히 보기";

  detailButton.addEventListener("click", () => {
    openDetail(post.id);
  });

  buttonBox.appendChild(likeButton);
  buttonBox.appendChild(detailButton);

  article.appendChild(textBox);
  article.appendChild(buttonBox);

  return article;
}

function renderPosts() {
  const posts = getFilteredPosts();

  postGrid.textContent = "";

  if (posts.length === 0) {
    const title = document.createElement("h3");
    title.textContent = "검색 결과가 없어요";
    postGrid.appendChild(title);
    return;
  }

  for (let i = 0; i < posts.length; i++) {
    const card = createPostCard(posts[i]);
    postGrid.appendChild(card);
  }
}

function createCommentList(post) {
  const commentBox = document.createElement("div");
  commentBox.classList.add("comment-box");

  const commentTitle = document.createElement("h3");
  commentTitle.textContent = "댓글 " + post.comments.length + "개";

  const commentList = document.createElement("div");
  commentList.classList.add("comment-list");

  if (post.comments.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty-comment");
    empty.textContent = "아직 댓글이 없어요.";
    commentList.appendChild(empty);
  } 
  else {
    for (let i = 0; i < post.comments.length; i++) {
      const comment = post.comments[i];
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment-item");
      const writer = document.createElement("p");
      writer.classList.add("comment-writer");
      writer.textContent = comment.writer;

      const text = document.createElement("p");
      text.classList.add("comment-text");
      text.textContent = comment.comment;

      const date = document.createElement("p");
      date.classList.add("comment-date");
      date.textContent = formatDate(comment.created_at);

      commentItem.appendChild(writer);
      commentItem.appendChild(text);
      commentItem.appendChild(date);

      commentList.appendChild(commentItem);
    }
  }

  commentBox.appendChild(commentTitle);
  commentBox.appendChild(commentList);

  return commentBox;
}

function openDetail(postId) {
  const post = getPostById(postId);

  if (post === null) {
    return;
  }

  if (post.comments === undefined) {
    post.comments = [];
  }

  detailContent.textContent = "";

  const title = document.createElement("h2");
  title.classList.add("detail-title");
  title.textContent = post.title;

  const meta = document.createElement("p");
  meta.classList.add("meta");
  meta.textContent = post.writer + " · " + formatDate(post.created_at);

  const body = document.createElement("div");
  body.classList.add("detail-body");
  body.textContent = post.content;

  const actionBox = document.createElement("div");
  actionBox.classList.add("detail-actions");

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn");
  likeButton.textContent = "좋아요 " + post.recommend_count;

  likeButton.addEventListener("click", () => {
    likePost(post.id);
  });

  const commentButton = document.createElement("button");
  commentButton.classList.add("small-btn");
  commentButton.textContent = "댓글달기";

  commentButton.addEventListener("click", () => {
    openCommentModal(post.id);
  });

  const editButton = document.createElement("button");
  editButton.classList.add("small-btn");
  editButton.textContent = "수정하기";

  editButton.addEventListener("click", () => {
    openEditModal(post.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "삭제하기";

  deleteButton.addEventListener("click", () => {
    openDeleteModal(post.id);
  });

  actionBox.appendChild(likeButton);
  actionBox.appendChild(commentButton);
  actionBox.appendChild(editButton);
  actionBox.appendChild(deleteButton);

  const commentBox = createCommentList(post);

  detailContent.appendChild(title);
  detailContent.appendChild(meta);
  detailContent.appendChild(body);
  detailContent.appendChild(actionBox);
  detailContent.appendChild(commentBox);

  showModal(detailModal);
}