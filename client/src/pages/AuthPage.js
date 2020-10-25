import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const {loading, request, error, clearError} = useHttp();
    const message = useMessage();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    });

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const registerHandler = async() => {
        try{
            const data = await request("/api/auth/register", "POST", {...form}, {"Content-Type": "application/json"});
            message(data.message);
        }catch (e) {}
    }
    const loginHandler = async() => {
        try{
            const data = await request("/api/auth/login", "POST", {...form}, {"Content-Type": "application/json"});
            auth.login(data.token, data.userId);
        }catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Short your URL</h1>

                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div className="input-field">
                            <input value={form.email} onChange={changeHandler} id="email" type="text" name="email" className="yellow-input"/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field">
                            <input value={form.password} onChange={changeHandler} id="password" type="password" name="password"  className="yellow-input"/>
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn grey lighten-1 black-text" style={{marginRight: 10}} onClick={registerHandler} disabled={loading}>Sign Up</button>
                        <button className="btn yellow darken-4" disabled={loading} onClick={loginHandler}>Sign In</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }