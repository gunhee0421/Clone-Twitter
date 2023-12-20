import PostTweetForm from "../component/post-tweet-form.tsx";
import styled from "styled-components";
import Timeline from "../component/timeline.tsx";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-rows: 1fr 5fr;
`;
export default function Home(){
    return (
        <Wrapper>
            <PostTweetForm/>
            <Timeline/>
        </Wrapper>
    );
}