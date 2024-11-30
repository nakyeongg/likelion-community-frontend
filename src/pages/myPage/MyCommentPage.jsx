// 댓글 쓴 글 페이지

import React, { useState, useEffect } from "react";
import * as S from "./MyPostPage.styled";
import { Header } from "@components/Header";
import { MyPagePost } from "@components/myPage/MyPagePost";
import { MyPostData } from "../../constant/myPage/myPostData";
import axiosInstance from "@apis/axiosInstance";
import { Link } from "react-router-dom";

export const MyCommentPage = () => {
  const [MyCommentData, setMyCommentData] = useState([]);

  // 게시글 클릭하면 이동하는 게시판
  const boardPaths = {
    자유게시판: "/defaultPostPage",
    "프론트엔드 게시판": "/fePostPage",
    "백엔드 게시판": "/bePostPage",
    "기획/디자인 게시판": "/pmPostPage",
    아기사자게시판: "/lionPostPage",
    "이벤트/공지게시판": "/notiPostPage",
    참여게시판: "/joinPostPage",
    // 학교
    전체게시판: "/schDefaultPostPage",
    질문게시판: "/qnaPostPage"
  };

  const getMyCommentData = async () => {
    try {
      const response = await axiosInstance.get("/mypage/mycomments/");
      console.log("post Response", response.data);

      const { maincomment, schoolcomment, questioncomment } = response.data;
      console.log("데이터는", response.data);

      // 세 배열을 합쳐 하나의 배열로 상태에 저장
      const combinedPosts = [
        ...(Array.isArray(maincomment) ? maincomment : []),
        ...(Array.isArray(schoolcomment) ? schoolcomment : []),
        ...(Array.isArray(questioncomment) ? questioncomment : []),
      ];

      setMyCommentData(combinedPosts);
    } catch (error) {
      console.error("error", error);
      alert("게시물을 불러오는 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    getMyCommentData();
  }, []);

  return (
    <S.Wrapper>
      <Header title="댓글 단 글" />
      <S.Posts>
        {MyCommentData.map((comment) => {
          const boardPath = boardPaths[comment.board.board_title] || "/unknownboard"; // 기본값 설정

          return (
            <Link
              to={`${boardPath}/${comment.id}`} // 동적으로 게시판 경로 설정
              key={comment.id}
              style={{
                width: "100%",
                color: "#323232",
              }}
            >
              <MyPagePost
                id={comment.id}
                board_title={comment.board.board_title}
                title={comment.board.title}
                body={comment.board.body}
                images={comment.board.images}
                comments_count={comment.board.comments_count}
                time={comment.time}
                anonymous={comment.anonymous}
                writer={comment.writer?.name}
              />
            </Link>
          );
        })}
      </S.Posts>
    </S.Wrapper>
  );
};

export default MyCommentPage;
