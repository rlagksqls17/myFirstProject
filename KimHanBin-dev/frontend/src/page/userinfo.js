import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { logout } from './auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './loginpage';
import MainPage from './mainpage';
import "react-datepicker/dist/react-datepicker.css"
import '../App.css';



export function UserDetail(props){
    const ID = useSelector((state) => state.ID) // Reloading Redux state

    // Serve Component 1
    function UserInfo(){
        const [username, setUsername] = useState('이름')
        const [onelineMyself, setOnelineMyself] = useState('안녕하세요')
        const [isClick, setIsClick] = useState(false)

        useEffect(() => {
            fetch('/api/show_user_info', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(props.researchid) // props.researchid = UserDetail에 prop으로 넣어준 ID (본인 혹은 타인 ID)
            })
            .then(r => r.json())
            .then(res => {
                if(res['status'] == 200){
                    setUsername(res['name'])
                    setOnelineMyself(res['onelineMyself'])
                }
                else{
                    return console.log("Not Found!")
                }
            }, [username, onelineMyself, isClick])
        })

        return (
            <div className='user-info'>
                <div className='userinfoname-font'>{username}</div>
                <div className='myself-font'>{onelineMyself}</div>
            </div>
        )
    }


    // Serve Component 2
    function Education(){
        
        const [schoolName, setSchoolName] = useState(['학교 이름'])
        const [major, setMajor] = useState(['전공'])
        const [degree, setDegree] = useState(['학위'])
        const [mappingElement, setMappingElement] = useState([])

        useEffect(() => {
            fetch('/api/show_education', {
                method: 'post',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(props.researchid)
            })
            .then(r => r.json())
            .then(res => {
                if(res['status'] == 200){
                    setSchoolName(res['schoolname'])
                    setMajor(res['major'])
                    setDegree(res['degree'])
                    setMappingElement(res['element_list'])
                } else{
                    return console.log("Not Found!")
                }
            })
        }, [])


        const InfoComponent = ({value}) => {
            return(
                <div className="info-element">
                    <div>{schoolName[value]}</div>    
                    <div>{`${major[value]}(${degree[value]})`}</div>             
                </div>
            )
        }
        return (
            <div className='info-class'>
                <div className='info-title'>학력</div>
                {mappingElement.map(element => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }


    // Serve Component 3
    function AwardHistory(){
        const [awardshistory, setAwardshistory] = useState(['수상 내역'])
        const [detailhistory, setDetailhistory] = useState(['상세 내역'])
        const [mappingElement, setMappingElement] = useState([])

        useEffect(() => {
            fetch('/api/show_awardhistory', {
                method: 'post',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(props.researchid)
            })
            .then(r => r.json())
            .then(res => {
                if(res['status'] == 200){
                    setAwardshistory(res['awardshistory'])
                    setDetailhistory(res['detailhistory'])
                    setMappingElement(res['element_list'])
                } else {
                    return console.log("Not Found!")
                }
            })
        }, [])

        const InfoComponent = ({value}) => {
            return(
                <div className="info-element">
                        <div>{awardshistory[value]}</div>
                        <div>{detailhistory[value]}</div>
                </div>
            )
        }

        return(
            <div className='info-class'>
                <div className='info-title'>수상 이력</div>
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }

    // Serve Component 4
    function Project(){
        const [projectname, setProjectname] = useState(['프로젝트 이름1'])
        const [projectDetail, setProjectDetail] = useState(['프로젝트 상세1'])
        const [projectdate, setProjectdate] = useState(['프로젝트 기간'])

        const [mappingElement, setMappingElement] = useState([])

        useEffect(() => {
            fetch('/api/show_projecthistory', {
                method: 'post',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(props.researchid)
            })
            .then(r => r.json())
            .then(res => {
                if (res['status'] === 200){
                    setProjectname(res['project_name'])
                    setProjectDetail(res['project_detail'])
                    setProjectdate(res['project_date'])
                    setMappingElement(res['element_list'])
                } else {
                    return console.log("Not Found!")
                }
            })
        }, [])

        const InfoComponent = ({value}) => {
            return(
                <div className="info-element">
                    <div>{projectname[value]}</div>
                    <div>{projectDetail[value]}</div>
                    <div>{projectdate[value]}</div>
                </div>
            )
        }

        return(
            <div className='info-class'>
                <div className='info-title'>프로젝트</div>
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }

    // Serve Component 5
    function Certificate(){
        const [certifiname, setCertifiname] = useState(['자격증 이름1'])
        const [certifiprov, setCertifiprov] = useState(['자격증 기관1'])
        const [certifidate, setCertifidate] = useState(['취득 기간1'])

        const [mappingElement, setMappingElement] = useState([])


        useEffect(() => {
            fetch('/api/show_certificate', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(props.researchid)
            })
            .then(r => r.json())
            .then(res => {
                if (res['status'] === 200){
                    setCertifiname(res['certifi_name'])
                    setCertifiprov(res['certifi_prov'])
                    setCertifidate(res['certifi_date'])
                    setMappingElement(res['element_list'])
                } else {
                    return console.log("Not Found!")
                }
            })
        }, [])


        const InfoComponent = ({value}) => {
            return(
                <div className="info-element">
                    <div>{certifiname[value]}</div>
                    <div>{certifiprov[value]}</div>
                    <div>{certifidate[value]}</div>
                </div>
            )
        }


        return(
            <div className='info-class'>
                <div className='info-title'>자격증</div>
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }


    return(
        <div>
            {(props.researchid === ID)? `${ID}님 안녕하세요`:'조회만 가능합니다.'}<br/>
            <UserInfo/><br/>
            <Education/><br/>
            <AwardHistory/><br/>
            <Project/><br/>
            <Certificate/><br/>
        </div>
    )
}

export function PageContent(){
    const handleClickLogout = (e) =>{
        logout()
        window.location.href="/"
    }
    const search = window.location.href
 
    const index = search.lastIndexOf('/')
 

    return(
        <div className='main-menu'>
            <h1 className='main-logo'>Portfolio</h1>
            <button className='main-button' onClick={handleClickLogout}>
                Logout
            </button>
            <button className='main-button' onClick={() => {
                window.location.href="/main"
            }}>
                Home
            </button>          
            <hr/>
            <UserDetail researchid={search.slice(index + 1)}></UserDetail>
        </div>
    )
}

function UserInfoPage(){    
    return(
        <Router>
            <Switch>
                <Route path="/main" component={MainPage} />
                <Route path="/user_info/:userid" component={PageContent}/>
                <Route path="/" component={LoginPage}/>
            </Switch>
        </Router>
    )    
}

export default UserInfoPage;