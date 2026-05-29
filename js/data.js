let sortType = "latest";

let guestbooks = [
  {
    id: 1,
    title: "안녕하세요",
    writer: "아기사자",
    content: "오늘의 방명록에 남겨진 첫 번째 기록이에요.",
    password: "1234",
    recommend_count: 0,
    liked: false,
    comments: [],
    created_at: "2026-05-29T11:10:00"
  },
  {
    id: 2,
    title: "오늘도 좋은 하루",
    writer: "방문자",
    content: "시간에 따라 변하는 화면이 예뻐요.",
    password: "1111",
    recommend_count: 2,
    liked: false,
    comments: [
      {
        writer: "지수",
        password: "1234",
        comment: "분위기가 좋아요!",
        created_at: "2026-05-29T11:15:00"
      }
    ],
    created_at: "2026-05-29T11:15:00"
  }
];