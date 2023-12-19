import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {FirebaseError} from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {Form, Input, Switcher, Title, Wrapper, Error} from "../component/auth-component.tsx";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {name, value}
        } = e;
        if (name === "email") {
            setEmail(value)
        } else if (name == "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") return;
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Log into</Title>
            <Form onSubmit={onSubmit}>
                <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required/>
                <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password"
                       required/>
                <Input type="submit" value={isLoading ? "Lodaing..." : "Log in"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}