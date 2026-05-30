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
const commentDeleteModal = document.querySelector("#commentDeleteModal");
const detailContent = document.querySelector("#detailContent");

function showPage(pageName) {
  homePage.classList.remove("active");
  writePage.classList.remove("active");
  listPage.classList.remove("active");

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

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
  const dd = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
  const hh = date.getHours() < 10 ? "0" + date.getHours() : "" + date.getHours();
  const min = date.getMinutes() < 10 ? "0" + date.getMinutes() : "" + date.getMinutes();
  return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
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
  commentDeleteModal.classList.add("hide");
}

function getFilteredPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  let result = [];
  for (let i = 0; i < guestbooks.length; i++) {
    const post = guestbooks[i];
    const title = post.title.toLowerCase();
    const writer = post.writer.toLowerCase();
    const content = post.content.toLowerCase();

    if (keyword === "" || title.indexOf(keyword) !== -1 || writer.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1) {
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

function renderPosts() {
  const posts = getFilteredPosts();
  postGrid.innerHTML = "";

  if (posts.length === 0) {
    postGrid.innerHTML = `
      <article class="post-card">
        <div>
          <h3>검색 결과가 없어요</h3>
          <p class="preview">다른 검색어로 다시 찾아보세요.</p>
        </div>
      </article>
    `;
    return;
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    postGrid.innerHTML += `
      <article class="post-card">
        <div>
          <h3>${post.title}</h3>
          <p class="meta">${post.writer} · ${formatDate(post.created_at)}</p>
          <p class="preview">${post.content}</p>
        </div>
        <div class="card-bottom">
          <button class="like-btn" onclick="likePost(${post.id})">👍🏻추천 ${post.recommend_count}</button>
          <button class="detail-btn" onclick="openDetail(${post.id})">🔎자세히 보기</button>
        </div>
      </article>
    `;
  }
}

function makeCommentText(comment) {
  if (comment.comment !== undefined) {
    return comment.comment;
  }
  return comment.content;
}

function makeCommentId(comment) {
  if (comment.comment_id !== undefined) {
    return comment.comment_id;
  }
  return comment.id;
}

function makeCommentList(post) {
  let commentHTML = "";
  if (post.comments.length === 0) {
    commentHTML = `
      <p class="empty-comment">💬첫 댓글을 남겨주세요.</p>
    `;
  } else {
    for (let i = 0; i < post.comments.length; i++) {
      const comment = post.comments[i];
      const commentText = makeCommentText(comment);
      const commentId = makeCommentId(comment);

      commentHTML += `
        <div class="comment-item">
          <p class="comment-writer">${comment.writer}</p>
          <p class="comment-text">${commentText}</p>
          <p class="comment-date">${formatDate(comment.created_at)}</p>
          <button class="delete-btn" onclick="openCommentDeleteModal(${post.id}, ${commentId})">댓글 삭제</button>
        </div>
      `;
    }
  }

  return `
    <div class="comment-box">
      <h3>💬댓글 ${post.comments.length}개</h3>
      <div class="comment-list">${commentHTML}</div>
    </div>
  `;
}

async function openDetail(postId) {
  const response = await fetch(GUESTBOOK_API + postId + "/");
  const post = await response.json();
  post.id = post.guestbook_id;

  if (post.recommend_count === undefined) {
    post.recommend_count = 0;
  }

  if (post.comments === undefined) {
    post.comments = [];
  }

  detailContent.innerHTML = `
    <h2 class="detail-title">${post.title}</h2>
    <p class="meta">${post.writer} · ${formatDate(post.created_at)}</p>
    <div class="detail-body">${post.content}</div>
    <div class="detail-actions">
      <button class="like-btn" onclick="likePost(${post.id}, true)">👍🏻추천 ${post.recommend_count}</button>
      <button class="small-btn" onclick="openCommentModal(${post.id})">댓글달기</button>
      <button class="small-btn" onclick="openEditModal(${post.id})">수정하기</button>
      <button class="smalldelete-btn" onclick="openDeleteModal(${post.id})">삭제하기</button>
    </div>
    ${makeCommentList(post)}
  `;

  showModal(detailModal);
}