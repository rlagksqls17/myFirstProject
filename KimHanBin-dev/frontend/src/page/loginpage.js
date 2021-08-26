import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import JoinPage from './joinpage';
import MainPage from './mainpage';
import Googlelogin from 'react-google-login';
import { login, useAuth } from "./auth"
import '../App.css';


// 로그인 페이지의 내용을 불러오는 부분
function LoginPageContent({ history }){
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [logged] = useAuth();

    const dispatch = useDispatch();

    const onSubmitClick = (e) => {
    /*
        로그인 창의 입력값을 manageToken.py에 fetch
        이후 정상적인 매치가 될 경우 jwt 토큰을 받아오고, 
        이를 ../auth/index.js 파일에서 처리하여 refresh 로그인 토큰을 로컬저장소에 저장
    */ 
        e.preventDefault()

        const opts = {
            'username': username,
            'password': password
        }

        // 아이디와 비밀번호 필수 입력
        if (username === ''){
            if (password !== ''){
                return alert('아이디를 입력해주세요')
            }
            return alert('아이디와 비밀번호를 입력해주세요.')
        }
        if (password === ''){
            return alert('비밀번호를 입력해주세요.')
        }
        
        fetch('/api/login', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(opts)
        }).then(r => r.json())
          .then(res => {
              if (res.access_token){
                  /*
                  로그인 성공 시 사용자 ID를 전역 Redux State로 patch함
                  */
                    dispatch({
                        type: "SETID",
                        payload: username
                    });
                    login(res)
              }
              else if (res['status'] === 400){
                alert('아이디가 올바르지 않습니다.')
              }
              else if (res['status'] === 401){
                alert('비밀번호가 올바르지 않습니다.')
              }
          })
    }
    

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }


    const handleClickJoin = (e) =>{
        return history.push("/join")
    }
    
    
    return(
        <div className='login-div'>
            <h1>Portfolio</h1>
            {!logged?
            <div>
            <form action='#'>
                <input 
                    type="text"
                    placeholder='아이디' 
                    onChange={handleUsernameChange} 
                    value={username} 
                /> <br/>
                <input 
                    type="password"
                    placeholder='비밀번호' 
                    onChange={handlePasswordChange} 
                    value={password} 
                /> <br/>
                <button type="submit" onClick={onSubmitClick}>
                    로그인
                </button>
                <button onClick={handleClickJoin}>
                회원가입하기
                </button>
            </form>
            <Googlelogin
                clientId='367961850081-s6t9ojd6t1n4v7gke29sg2bq35rclfq9.apps.googleusercontent.com'
                responseType={"id_token"}
                onSuccess={(res) => {
                    if (res.accessToken){
                        login(res.tokenObj)
                    }
                }}
            />
            </div>
            : <Redirect to="/main"/>}
        </div>
    )
}

// login 페이지 URL을 "/"로 설정해둠
function LoginPage(){
    return(
        <Router>
            <Switch>
                <Route path="/join" component={JoinPage}/>
                <Route path = "/main" component={MainPage}/>
                <Route path = "/" component={LoginPageContent}/>
            </Switch>
        </Router>
    )
}

export default LoginPage;