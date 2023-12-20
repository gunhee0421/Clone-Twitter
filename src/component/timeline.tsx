import {collection, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet.tsx";
import Unsubscribe = firebase.Unsubscribe;
import firebase from "firebase/compat/app";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  height: 500px;
`;
export interface ITweet{
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

export default function Timeline() {
    const [tweete, setTweet] = useState<ITweet[]>([]);
    useEffect(() => {
        let unsubscribe : Unsubscribe | null = null;
        const fetchTweets = async () => {
            // 쿼리를 생성
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            // 쿼리에 해당하는 문서를 가져옴
            // const spanshot = await getDocs(tweetsQuery);
            // const tweets=spanshot.docs.map((doc) => {
            //     const {tweet, createdAt, userId, username, photo} = doc.data();
            //     return{ tweet, createdAt, userId, username, photo, id: doc.id };
            // });
            // 데이터베이스 및 쿼리와 실시간 연결을 형성하는 함수
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const {tweet, createdAt, userId, username, photo} = doc.data();
                    return {tweet, createdAt, userId, username, photo, id: doc.id};
                });
                setTweet(tweets);
            });
        };
        fetchTweets();
        return ()=>{
            unsubscribe && unsubscribe();
        }
    }, []);
    return (
        <Wrapper>
            {tweete.map(tweete => <Tweet key={tweete.id} {...tweete}/>)}
        </Wrapper>
    );
}