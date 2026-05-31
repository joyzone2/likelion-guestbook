const GUESTBOOK_API = "https://tronve.pythonanywhere.com/api/guestbooks/";
const COMMENT_API = "https://tronve.pythonanywhere.com/api/comments/";

let currentPostId = 0;

function changeData(item) {
  const count = item.recommend_count;
  const guestbook = {
    id: item.guestbook_id,
    title: item.title,
    writer: item.writer,
    content: item.content,
    recommend_count: count,
    comments: [],
    created_at: item.created_at
  };
  return guestbook;
}

async function loadPosts() {
  try {
    const response = await fetch(GUESTBOOK_API);
    const data = await response.json();
    guestbooks = [];

    for (let i = 0; i < data.guestbooks.length; i++) {
      const guestbook = changeData(data.guestbooks[i]);
      guestbooks.push(guestbook);
    }
    renderPosts();
  } catch {
    alert("오류!!");
  }
}

function findPost(id) {
  let post = null;
  for (let i = 0; i < guestbooks.length; i++) {
    if (guestbooks[i].id === id) {
      return guestbooks[i]; 
    }
  }
  return null;
}

function clearWriteForm() {
  document.getElementById("writerInput").value = "";
  document.getElementById("passwordInput").value = "";
  document.getElementById("titleInput").value = "";
  document.getElementById("contentInput").value = "";
}

function clearCommentForm() {
  document.getElementById("commentWriterInput").value = "";
  document.getElementById("commentPasswordInput").value = "";
  document.getElementById("commentContentInput").value = "";
}

document.getElementById("goWriteBtn").addEventListener("click", () => {
  showPage("write");
});

document.getElementById("goListBtn").addEventListener("click", () => {showPage("list"); loadPosts();});
document.getElementById("closeWriteBtn").addEventListener("click", () => {showPage("home");});
document.getElementById("backHomeBtn").addEventListener("click", () => {showPage("home");});
document.getElementById("writeAgainBtn").addEventListener("click", () => {showPage("write");});
document.getElementById("writeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = document.querySelector("#writeForm .submit-btn");

  if (submitButton.disabled === true) {
    return;
  }

  submitButton.disabled = true;

  const writer = document.getElementById("writerInput").value;
  const password = document.getElementById("passwordInput").value;
  const title = document.getElementById("titleInput").value;
  const content = document.getElementById("contentInput").value;

  if (writer === "" || password === "" || title === "" || content === "") {
    alert("모든 항목을 입력해주세요.");
    submitButton.disabled = false;
    return;
  }

  try {
    const response = await fetch(GUESTBOOK_API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: title,
        writer: writer,
        content: content,
        password: password
      })
    });

    await response.json();

    if (response.status === 200) {
      alert("방명록이 작성되었습니다.");
      clearWriteForm();
      showPage("list");
      loadPosts();
    } else {
      alert("방명록 작성에 실패했습니다.");
    }
  } catch {
    alert("서버 연결 오류!!");
  }

  submitButton.disabled = false;
});

searchInput.addEventListener("input", () => {renderPosts();});

document.getElementById("latestBtn").addEventListener("click", () => {
  sortType = "latest";
  document.getElementById("latestBtn").classList.add("active");
  document.getElementById("recommendBtn").classList.remove("active");
  renderPosts();
});

document.getElementById("recommendBtn").addEventListener("click", () => {
  sortType = "recommend";
  document.getElementById("recommendBtn").classList.add("active");
  document.getElementById("latestBtn").classList.remove("active");
  renderPosts();
});

async function likePost(id, isDetail = false) {
  const url = GUESTBOOK_API + id + "/recommend/";
  try {
    const response = await fetch(url, {method: "POST"});
    const data = await response.json();

    if (response.status === 200) {
      alert("추천이 완료되었습니다.");
      const post = findPost(id);
      if (post !== null) {
        post.recommend_count = data.recommend_count;
      }
      renderPosts();
      if (isDetail) {
        openDetail(id);
      }
      return;
    }

    if (response.status === 400) {
      const cancelResponse = await fetch(url, {method: "DELETE"});
      const cancelData = await cancelResponse.json();
      alert("추천이 취소되었습니다.");
      const post = findPost(id);
      if (post !== null) {
        post.recommend_count = cancelData.recommend_count;
      }
      renderPosts();
      if (isDetail) {
        openDetail(id);
      }
      return;
    }
    alert("추천 처리에 실패했습니다.");
  } catch {
    alert("서버 연결 오류!!");
  }
}

function openCommentModal(id) {
  currentPostId = id;
  document.getElementById("commentPostIdInput").value = id;
  clearCommentForm();
  closeModal();
  showModal(commentModal);
}

function openEditModal(id) {
  const post = findPost(id);
  currentPostId = id;
  document.getElementById("editIdInput").value = post.id;
  document.getElementById("editPasswordInput").value = "";
  document.getElementById("editTitleInput").value = post.title;
  document.getElementById("editContentInput").value = post.content;

  closeModal();
  showModal(editModal);
}

function openDeleteModal(id) {
  currentPostId = id;
  document.getElementById("deleteIdInput").value = id;
  document.getElementById("deletePasswordInput").value = "";

  closeModal();
  showModal(deleteModal);
}

function openCommentDeleteModal(postId, commentId) {
  currentPostId = postId;
  document.getElementById("commentDeletePostIdInput").value = postId;
  document.getElementById("commentDeleteIdInput").value = commentId;
  document.getElementById("commentDeletePasswordInput").value = "";

  closeModal();
  showModal(commentDeleteModal);
}

document.getElementById("commentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = Number(document.getElementById("commentPostIdInput").value);
  const writer = document.getElementById("commentWriterInput").value;
  const password = document.getElementById("commentPasswordInput").value;
  const comment = document.getElementById("commentContentInput").value;

  if (writer === "" || password === "" || comment === "") {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(COMMENT_API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({writer: writer, comment: comment, password: password, guestbook: id})
    });

    await response.json();

    if (response.status === 200) {
      alert("댓글이 작성되었습니다.");
      clearCommentForm();
      closeModal();
      openDetail(id);
    } else {
      alert("댓글 작성에 실패했습니다.");
    }
  } catch {
    alert("서버 연결 오류!!");
  }
});

document.getElementById("editForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = Number(document.getElementById("editIdInput").value);
  const password = document.getElementById("editPasswordInput").value;
  const title = document.getElementById("editTitleInput").value;
  const content = document.getElementById("editContentInput").value;

  if (password === "" || title === "" || content === "") {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(GUESTBOOK_API + id + "/", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password: password, title: title, content: content})
    });

    await response.json();

    if (response.status === 200) {
      alert("방명록이 수정되었습니다.");
      closeModal();
      showPage("list");
      loadPosts();
    } else {
      alert("방명록 수정에 실패했습니다.");
    }
  } catch {
    alert("서버 연결 오류!!");
  }
});

document.getElementById("deleteForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = Number(document.getElementById("deleteIdInput").value);
  const password = document.getElementById("deletePasswordInput").value;

  if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(GUESTBOOK_API + id + "/", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password: password})
    });

    await response.json();

    if (response.status === 200) {
      alert("방명록이 삭제되었습니다.");
      closeModal();
      showPage("list");
      loadPosts();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  } catch {
    alert("서버 연결 오류!!");
  }
});

document.getElementById("commentDeleteForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const postId = Number(document.getElementById("commentDeletePostIdInput").value);
  const commentId = Number(document.getElementById("commentDeleteIdInput").value);
  const password = document.getElementById("commentDeletePasswordInput").value;

  if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(COMMENT_API + commentId + "/", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password: password})
    });

    await response.json();

    if (response.status === 200) {
      alert("댓글이 삭제되었습니다.");
      closeModal();
      openDetail(postId);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  } catch {
    alert("서버 연결 오류!!");
  }
});

const modalCloseButtons = document.querySelectorAll(".modal-close");

for (let i = 0; i < modalCloseButtons.length; i++) {
  modalCloseButtons[i].addEventListener("click", () => {
    closeModal();
    if (currentPostId !== 0) {
      openDetail(currentPostId);
      currentPostId = 0;
    }
  });
}
renderPosts();