import styled from "styled-components";
import React, {useState} from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import {auth, db, storage} from "../firebase.ts";
import {getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form=styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none
`;
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover, &:active{
    opacity: 0.9;
  }
`;
export default function PostTweetForm() {
    const [Loading, setLodaing] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onChange=(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTweet(e.target.value);
    }
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (files && files.length === 1) {
            setFile(files[0]);
        }
    };
    const onSubmit= async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || Loading || tweet === "" || tweet.length > 180) return;
        try {
            setLodaing(true);
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            })
            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                });
            }
            setTweet("");
            setFile(null);
        } catch (e){
            console.log(e);
        } finally {
            setLodaing(false);
        }

    }
    return (
    <Form onSubmit={onSubmit}>
        <TextArea
            rows={5} maxLength={180} required
            onChange={onChange} value={tweet} placeholder={"what is happening?"} />
        <AttachFileButton htmlFor="file" >{file ? "Photo added ✔︎" : "Add photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
        <SubmitBtn type="submit" value={Loading ? "Posting..." : "Post Tweet"}></SubmitBtn>
    </Form>
    );
}
