import {auth, db, storage} from "../firebase.ts";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {updateProfile} from "firebase/auth";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {ITweet} from "../component/timeline.tsx";
import Tweet from "../component/tweet.tsx";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
    
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;
const EditButton = styled.button`
  margin: 0px 10px;
  background-color: deepskyblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL)
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const onAvatarChange= async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target;
        if(!user) return;
        if (files && files.length == 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            });
        }

    }
    const fetchTweets=async()=>{
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map(doc => {
            const {tweet, createdAt, userId, username, photo} = doc.data();
            return {tweet, createdAt, userId, username, photo, id: doc.id};
        });
        setTweets(tweets);
    }

    useEffect(() => {
        fetchTweets();
    }, []);
    return <Wrapper>
        <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ?  <AvatarImg src={avatar}/> :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" className="w-6 h-6">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
            </svg>}
        </AvatarUpload>
        <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*"/>
        <Name>{user?.displayName ?? "Anonymous"}</Name>
        <EditButton>Edit</EditButton>
        <Tweets>
            {tweets.map(tweet => <Tweet key={tweet.id}{...tweet}/>)}
        </Tweets>
    </Wrapper>
}