const goWriteBtn = document.querySelector("#goWriteBtn");
const goListBtn = document.querySelector("#goListBtn");
const closeWriteBtn = document.querySelector("#closeWriteBtn");
const backHomeBtn = document.querySelector("#backHomeBtn");
const writeAgainBtn = document.querySelector("#writeAgainBtn");

const writeForm = document.querySelector("#writeForm");
const writerInput = document.querySelector("#writerInput");
const passwordInput = document.querySelector("#passwordInput");
const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");

const latestBtn = document.querySelector("#latestBtn");
const recommendBtn = document.querySelector("#recommendBtn");

const deleteForm = document.querySelector("#deleteForm");
const deleteIdInput = document.querySelector("#deleteIdInput");
const deletePasswordInput = document.querySelector("#deletePasswordInput");

const editForm = document.querySelector("#editForm");
const editIdInput = document.querySelector("#editIdInput");
const editPasswordInput = document.querySelector("#editPasswordInput");
const editTitleInput = document.querySelector("#editTitleInput");
const editContentInput = document.querySelector("#editContentInput");

const commentForm = document.querySelector("#commentForm");
const commentPostIdInput = document.querySelector("#commentPostIdInput");
const commentWriterInput = document.querySelector("#commentWriterInput");
const commentPasswordInput = document.querySelector("#commentPasswordInput");
const commentContentInput = document.querySelector("#commentContentInput");

const modalCloseButtons = document.querySelectorAll(".modal-close");

let currentPostId = 0;

function getNewId() {
  let newId = 1;

  for (let i = 0; i < guestbooks.length; i++) {
    if (guestbooks[i].id >= newId) {
      newId = guestbooks[i].id + 1;
    }
  }

  return newId;
}

function getTodayText() {
  const date = new Date();
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());

  return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00";
}

function clearWriteForm() {
  writerInput.value = "";
  passwordInput.value = "";
  titleInput.value = "";
  contentInput.value = "";
}

function clearCommentForm() {
  commentWriterInput.value = "";
  commentPasswordInput.value = "";
  commentContentInput.value = "";
}

function getPostByIdFromData(id) {
  let post = null;

  for (let i = 0; i < guestbooks.length; i++) {
    if (guestbooks[i].id === id) {
      post = guestbooks[i];
    }
  }

  return post;
}

goWriteBtn.addEventListener("click", () => {
  showPage("write");
});

goListBtn.addEventListener("click", () => {
  showPage("list");
  renderPosts();
});

closeWriteBtn.addEventListener("click", () => {
  showPage("home");
});

backHomeBtn.addEventListener("click", () => {
  showPage("home");
});

writeAgainBtn.addEventListener("click", () => {
  showPage("write");
});

writeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (writerInput.value === "") {
    alert("작성자를 입력해주세요.");
    return;
  }

  if (passwordInput.value === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  if (titleInput.value === "") {
    alert("제목을 입력해주세요.");
    return;
  }

  if (contentInput.value === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  const guestbook = {
    id: getNewId(),
    title: titleInput.value,
    writer: writerInput.value,
    content: contentInput.value,
    password: passwordInput.value,
    recommend_count: 0,
    recommenders: [],
    comments: [],
    created_at: getTodayText()
  };
  guestbooks.push(guestbook);
  clearWriteForm();
  renderPosts();
  showPage("list");
  alert("방명록이 작성되었습니다.");
});

searchInput.addEventListener("input", () => {
  renderPosts();
});

latestBtn.addEventListener("click", () => {
  sortType = "latest";

  latestBtn.classList.add("active");
  recommendBtn.classList.remove("active");

  renderPosts();
});

recommendBtn.addEventListener("click", () => {
  sortType = "recommend";

  recommendBtn.classList.add("active");
  latestBtn.classList.remove("active");

  renderPosts();
});

function likePost(id) {
  const post = getPostByIdFromData(id);

  if (post === null) {
    return;
  }

  if (post.liked === false) {
    post.liked = true;
    post.recommend_count = post.recommend_count + 1;
    alert("추천이 완료되었습니다.");
  } else {
    post.liked = false;
    post.recommend_count = post.recommend_count - 1;
    alert("추천이 취소되었습니다.");
  }

  renderPosts();

  if (!detailModal.classList.contains("hide")) {
    openDetail(id);
  }
}

function openCommentModal(id) {
  currentPostId = id;
  commentPostIdInput.value = id;
  clearCommentForm();
  closeModal();
  showModal(commentModal);
}

function openEditModal(id) {
  const post = getPostByIdFromData(id);

  if (post === null) {
    return;
  }

  currentPostId = id;

  editIdInput.value = post.id;
  editPasswordInput.value = "";
  editTitleInput.value = post.title;
  editContentInput.value = post.content;

  closeModal();
  showModal(editModal);
}

function openDeleteModal(id) {
  currentPostId = id;

  deleteIdInput.value = id;
  deletePasswordInput.value = "";

  closeModal();
  showModal(deleteModal);
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = Number(commentPostIdInput.value);
  const post = getPostByIdFromData(id);

  if (post === null) {
    return;
  }

  if (commentWriterInput.value === "") {
    alert("댓글 작성자를 입력해주세요.");
    return;
  }

  if (commentPasswordInput.value === "") {
    alert("댓글 비밀번호를 입력해주세요.");
    return;
  }

  if (commentContentInput.value === "") {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  if (post.comments === undefined) {
    post.comments = [];
  }

  const comment = {
    writer: commentWriterInput.value,
    password: commentPasswordInput.value,
    comment: commentContentInput.value,
    created_at: getTodayText()
  };

  post.comments.push(comment);

  clearCommentForm();

  closeModal();
  renderPosts();
  openDetail(id);

  alert("댓글이 작성되었습니다.");
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = Number(editIdInput.value);
  const post = getPostByIdFromData(id);

  if (post === null) {
    return;
  }

  if (editPasswordInput.value !== post.password) {
    alert("비밀번호가 일치하지 않아요.");
    return;
  }

  if (editTitleInput.value === "") {
    alert("제목을 입력해주세요.");
    return;
  }

  if (editContentInput.value === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  post.title = editTitleInput.value;
  post.content = editContentInput.value;

  closeModal();
  renderPosts();
  openDetail(id);

  alert("방명록이 수정되었습니다.");
});

deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = Number(deleteIdInput.value);
  const post = getPostByIdFromData(id);

  if (post === null) {
    return;
  }

  if (deletePasswordInput.value !== post.password) {
    alert("비밀번호가 일치하지 않아요.");
    return;
  }

  let newGuestbooks = [];
  for (let i = 0; i < guestbooks.length; i++) {
    if (guestbooks[i].id !== id) {
      newGuestbooks.push(guestbooks[i]);
    }
  }
  guestbooks = newGuestbooks;
  closeModal();
  renderPosts();
  alert("방명록이 삭제되었습니다.");
});

modalBg.addEventListener("click", () => {
  closeModal();
});

for (let i = 0; i < modalCloseButtons.length; i++) {
  modalCloseButtons[i].addEventListener("click", () => {
    if (!editModal.classList.contains("hide")) {
      closeModal();
      openDetail(currentPostId);
    } else if (!commentModal.classList.contains("hide")) {
      closeModal();
      openDetail(currentPostId);
    } else if (!deleteModal.classList.contains("hide")) {
      closeModal();
      openDetail(currentPostId);
    } else {
      closeModal();
    }
  });
}

renderPosts();