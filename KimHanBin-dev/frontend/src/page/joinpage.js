import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './loginpage';
import '../App.css';


function JoinPageContent( {history} ){
    /*
        <회원가입 시 입력한 정보를 state에 저장>

        joinId = 아이디
        joinPassword = 비밀번호  
        joinRepassword = 재확인 비밀번호
        joinNanme = 사용자 이름
    */

    const [joinId, setJoinId] = useState('')
    const [joinPassword, setJoinPassword] = useState('')
    const [joinRepassword, setJoinRepassword] = useState('')
    const [joinName, setJoinName] = useState('')


    function checkInputValue(){ 
        /*
            회원가입 페이지에서 이 함수의 리턴값을 받아서 회원가입 버튼 활성화 or 비활성화
            (html <button diabled={checkInputValue()['disabled']} // 'true' or "")

            - 비활성화 조건
                - 아이디 비입력
                - 아이디 형식 틀림 
                - 비밀번호 비입력
                - 비밀번호 형식 틀림
                - '비밀번호'와 '재확인비밀번호' 불일치
                - 이름 비입력
                - 이름 형식 틀림
        */

        // 이메일 정규표현식 ex: name@name.(com, net)
        const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

        // 비밀번호 정규표현식 (최소 하나의 문자와 숫자, 특수문자 모두 포함하고 50자리 이하)
        // 길이 검증은 다른 코드에 있음
        const regPassword = /(?=.*\d{1,50})(?=.*[~`!@#$%^&*()-+=]{1,50})(?=.*[a-zA-Z]{1,50}).{1,50}$/

        // 이름 정규표현식 (한글 또는 영문)
        const regNameEng = /[a-zA-Z]$/
        const regNameKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/

        // 공백 정규표현식
        const blank_pattern = /\s/g;

        // 아이디 체크
        if (joinId === ''){
            return {
                'disabled' : 'true',
                'message' : '아이디를 입력해주세요.'
            }
        } else if (blank_pattern.test(joinId)){
            return {
                'disabled' : 'true',
                'message' : '아이디에 공백을 포함할 수 없습니다.'
            }
        }else if (!regEmail.test(joinId)){
            return {
                'disabled' : 'true',
                'message' : '아이디는 이메일 형식(name@test.com) 이어야 합니다.'
            }
        }
        
        // 비밀번호 체크
        if (joinPassword === ''){
            return {
                'disabled' : 'true',
                'message' : '비밀번호를 입력해주세요'
            }
        } else if (!regPassword.test(joinPassword)){
            return {
                'disabled' : 'true',
                'message' : "비밀번호는 영문자와 숫자, 특수문자 모두 포함해야 합니다."
            }
        }

        if (joinPassword.length < 8){
            return {
                'disabled' : 'true',
                'message' : '최소 8자리 이상 비밀번호를 입력해주세요.'
            }
        }

        if (joinPassword !== joinRepassword){
            return {
                'disabled' : 'true',
                'message' : '재확인 비밀번호가 입력하신 비밀번호와 다릅니다.'
            }
        } 

        // 이름 체크
        if (joinName === ''){
            return {
                'disabled' : 'true',
                'message' : '이름을 입력해주세요.'
            }
        } else if (!(regNameKor.test(joinName) || regNameEng.test(joinName))){
            return {
                'disabled' : 'true',
                'message' : '이름은 한글 또는 영문만 포함되어야 합니다.'
            }
        }

        return {
            'disabled' : '',
            'message' : '회원가입 가능!'
        }
    }


    const onSubmitClick = (e) => {
        /*
            데이터 opts(아이디, 패스워드, 이름)를 backend/manageDB.py 에 넘겨줌 
            이후 flask에서 적절한 데이터 전처리 후 MySQL에 데이터 저장
        */

        e.preventDefault()
        const opts = {
            'joinId': joinId,
            'joinPassword' : joinPassword,
            'joinName': joinName
        }
        
        fetch('/api/join', {
            method: 'post',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(opts)
        })
            .then((res) => {
                    if (res.status === 200){
                        // 추후에 디자인 작업시 modal 창 띄우기
                        alert('회원가입 성공!')
                        return history.push("/")
                    }
                    else{
                        alert('중복된 아이디입니다.')
                    } 
                }
            )
            
    }

    const backToLogin = (e) => {
        e.preventDefault()
        return history.push("/")
    }

    return(
        <div className='join'>
            <h1>Join Us!</h1>
            <form action='#'>
                아이디
                <br/>
                    <input
                        type="text"
                        onChange={(e) => {setJoinId(e.target.value)}}
                        value={joinId}
                    />
                <br/>

                비밀번호
                <br/>
                    <input
                        type="password"
                        onChange={(e) => {setJoinPassword(e.target.value)}}
                        value={joinPassword}
                    />
                <br/>

                비밀번호 확인
                <br/>
                    <input
                        type="password"
                        onChange={(e) => {setJoinRepassword(e.target.value)}}
                        value={joinRepassword}
                    />
                <br/>

                이름
                <br/>
                    <input
                        type="text"
                        onChange={(e) => {setJoinName(e.target.value)}}
                        value={joinName}
                    />
                <br/>

                <button type="submit" 
                        disabled={checkInputValue()['disabled']} 
                        onClick={onSubmitClick}>
                    회원가입
                </button>

                <button onClick={backToLogin}>로그인 페이지</button>
                <div className='join-message'>{checkInputValue()['message']}</div>
            </form>
        </div>           
    )
}

function JoinPage(){
    return(
        <Router>
            <Switch>
                <Route path="/join" component={JoinPageContent}/>
                <Route path="/" component={LoginPage}/>
            </Switch>
        </Router>
    )
}

export default JoinPage;