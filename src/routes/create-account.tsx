import React, {useState} from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../firebase.ts";
import {Link, useNavigate} from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {Form, Input, Switcher, Title, Wrapper, Error} from "../component/auth-component.tsx";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {name, value}
        } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value)
        } else if (name == "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if(isLoading ||  name==="" || email==="" || password==="") return;
        try {
            setIsLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            navigate("/");
        } catch (e){
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Join</Title>
            <Form onSubmit={onSubmit}>
                <Input name="name" onChange={onChange} value={name} placeholder="Name" type="text" required/>
                <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required/>
                <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password"
                       required/>
                <Input type="submit" value={isLoading ? "Lodaing..." : "create Account"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already hava an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}