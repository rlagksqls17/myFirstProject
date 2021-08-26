import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { logout } from './auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from "react-router-dom";
import LoginPage from './loginpage';
import UserInfoPage from './userinfo';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';


/*
    <메인컴포넌트 구성>
        Component Changer (line 986)
            - 버튼 클릭에 따라 Main Component 나 Network Component를 불러옵니다.


        Main Component (line 870)
            - 메인 컴포넌트를 불러옵니다.
            - 사용자 ID를 props로 넣어 UserDetail Component를 불러옵니다.


        Network Component (line 881)
            - 네트워크 컴포넌트를 불러옵니다.
            - 모든 사용자 ID를 props로 하나씩 넣어 UserDetail Component를 라우트하는 페이지 링크를 매핑합니다.
            - 검색 기능을 통해 원하는 사용자 ID 만 불러올 수 있습니다.



    <상세컴포넌트 구성>
        UserDetail Component (line 63) 
        : props ID를 참고하여 api요청을 보내 해당 ID에 맞는 사용자 정보를 불러옵니다.
        : 아래 다섯 개의 Serve Component와 두 개의 Button Component를 보유합니다.


            <Serve Component>  * 각 서브 컴포넌트는 Button Component를 보유합니다. *
                - UserInfo (line 427): 사용자 프로필 컴포넌트, 네트워크 페이지에서 조회용으로도 쓰입니다.
                - Education (line 490): 사용자 학력사항 컴포넌트
                - AwardHistory (line 583): 사용자 수상이력 컴포넌트
                - Project (line 671): 사용자 프로젝트이력 컴포넌트
                - Certificate (line 762): 사용자 자격증 컴포넌트
                    

            <Button Component>
                - UpdateInput (line 69): 수정 기능 컴포넌트
                - AddInfoButton (line 389): 추가 기능 컴포넌트


    <Example>
    예를 들어 Education Component에서는 다음과 같이 조합됩니다.

    - Education Component
        - Info Component
            학교 정보 + UpdateInput Component
            전공 정보 + UpdateInput Component
            학위 정보 + UpdateInput Component
            AddInfo Button Component (클릭시 또 다른 Info Component 추가합니다.)
        - Info Component ...
*/


export function UserDetail(props){

    const ID = useSelector((state) => state.ID) // Reloading Redux state


    // Button Component
    function UpdateInput({updateCase, initState, index}){
        /*
        - props
            updateCase : 값에 따라 렌더링이 달라짐
            initState : 입력창에 기본으로 수정 전 정보가 보이도록 함
            index : mySQL에 구분자를 기준으로 인덱스가 지정되어 있는데, 수정을 목표로하는 target_inde임
        */

        switch(updateCase){
            case 'onelineMyself': // 한 줄 소개
                const [myself, setMyself] = useState(initState)

                const handleClickSubmit = (e) => {
                    const data = {
                        'userid' : ID,
                        'myself' : myself,
                    }

                    fetch('/api/update_user_myself', {
                        method: 'put',
                        headers: {
                            'Content-type':"application/json"
                        },
                        body: JSON.stringify(data)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if(res['status' == 200]){
                            return console.log('Success uploaded myself_info')
                        }
                    })
                }


                const handleMyselfChange = (e) => {
                    setMyself(e.target.value)
                }


                return (
                    <form action='#'>
                        <input
                            type="text"
                            value={myself}
                            onChange={handleMyselfChange}
                        />    
                        <button type="submit" onClick={handleClickSubmit}>
                            제출
                        </button>
                    </form>
                )

            
            case 'education': // 학력 사항
                const [schoolName, setSchoolName] = useState(initState.schoolName) // 학교 이름
                const [major, setMajor] = useState(initState.major) // 전공
                const [degree, setDegree] = useState(initState.degree) // 학위
                

                const handleClickEducation = (e) => {
                    const data = {
                        'userid' : ID,
                        'school_name' : schoolName,
                        'major' : major,
                        'degree' : degree,
                        'index' : index 
                        // mySQL에 구분자를 기준으로 인덱스가 지정되어 있으므로 해당 인덱스만 수정
                        // [학사 졸업, 석사 졸업] 중 인덱스 1만 바꿔서 [학사 졸업, 박사졸업]으로 바꾼다.
                    }

                    fetch('/api/update_education', {
                        method: 'put',
                        headers: {
                            'Content-type':'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                }


                const handleSchoolNameChange = (e) => {
                    setSchoolName(e.target.value)
                }


                const handleMajorChange = (e) => {
                    setMajor(e.target.value)
                }


                const handleRadioOnchange = (e) => {
                    setDegree(e.target.value)
                }


                return (
                    <form action='#'>
                        학교 :
                        <input
                            type="text"
                            value={schoolName}
                            onChange={handleSchoolNameChange}
                        /><br/>
                        전공 :
                        <input
                            type="text"
                            value={major}
                            onChange={handleMajorChange}
                        /><br/>
                        학위 :
                        <div>
                            <input type="radio" name='education' onChange={handleRadioOnchange} value="재학중"/>재학중
                            <input type="radio" name='education' onChange={handleRadioOnchange} value="학사졸업"/>학사졸업
                            <input type="radio" name='education' onChange={handleRadioOnchange} value="석사졸업"/>석사졸업
                            <input type="radio" name='education' onChange={handleRadioOnchange} value="박사졸업"/>박사졸업
                        </div>        
                        <button type="submit" onClick={handleClickEducation}>
                            제출    
                        </button>                                      
                    </form>
                )


            case 'awardhistory': // 수상경력
                const [awardhistory, setAwardshistory] = useState(initState.awardshistory) // 수상 이력
                const [detailhistory, setDetailhistory] = useState(initState.detailhistory) // 상세 이력

                const handleClickAwardhistory = (e) => {
                    const data = {
                        'userid' : ID,
                        'award_history' : awardhistory,
                        'detail_history' : detailhistory,
                        'index' : index
                    }

                    fetch('/api/update_awardhistory', {
                        method: 'put',
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body : JSON.stringify(data)
                    })
                }

                const handleAwardhistoryChange = (e) => {
                    setAwardshistory(e.target.value)
                }

                const handleDetailhistoryChange = (e) => {
                    setDetailhistory(e.target.value)
                }

                return (
                    <form action='#'>
                        수상내역 : 
                        <input
                            type="text"
                            value={awardhistory}
                            onChange={handleAwardhistoryChange}
                        /><br/>
                        상세내역 : 
                        <input
                            type="text"
                            value={detailhistory}
                            onChange={handleDetailhistoryChange}
                        /><br/>
                        <button type="submit" onClick={handleClickAwardhistory}>
                            제출
                        </button>
                    </form>
                )


            case 'project': // 프로젝트 이력
                const [projectName, setProjectName] = useState(initState.projectname) // 프로젝트 이름
                const [projectDetail, setProjectDetail] = useState(initState.projectDetail) // 프로젝트 상세 정보
                
                const [dateRange, setDateRange] = useState([null, null]) // 프로젝트 기간
                const [startDate, endDate] = dateRange; 


                const handleClickProjecthistory = (e) => {
                    const data = {
                        'userid' : ID,
                        'project_name' : projectName,
                        'project_detail' : projectDetail,
                        'project_date' : dateRange,
                        'index' : index
                    }

                    fetch('/api/update_projecthistory', {
                        method: 'put',
                        headers: {
                            'Content-type':'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                }


                const handleProjectNameChange = (e) => {
                    setProjectName(e.target.value)
                }

                
                const handleProjectDetailChange = (e) => {
                    setProjectDetail(e.target.value)
                }


                return (
                    <form action='#'>
                        프로젝트 이름:
                            <input
                                type="text"
                                value={projectName}
                                onChange={handleProjectNameChange}
                            /><br/>
                        프로젝트 내용:
                            <input
                                type="text"
                                value={projectDetail}
                                onChange={handleProjectDetailChange}
                            /><br/>
                        프로젝트 기간:
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                withPortal
                            />
                        <button type="submit" onClick={handleClickProjecthistory}>
                            제출 
                        </button>
                    </form>
                )

            
            case 'certificate' : // 자격증
                const [certifiName, setCertifiName] = useState(initState.certifiname) // 자격증 이름
                const [certifiProv, setCertifiProv] = useState(initState.certifiprov) // 자격증 공급 기관
                
                const [startsDate, setStartsDate] = useState(new Date()) // 자격증 취득 일자
                

                const handleClickCertificate = () => {
                    const data = {
                        'userid' : ID,
                        'certifi_name' : certifiName,
                        'certifi_prov' : certifiProv,
                        'certifi_date' : startsDate,
                        'index' : index
                    }
                    fetch('/api/update_certificate', {
                        method: 'put',
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                }


                const handleCertifiNameChange = (e) => {
                    setCertifiName(e.target.value)
                } 


                const handleCertifiProvChange = (e) => {
                    setCertifiProv(e.target.value)
                }


                return (
                    <form action='#'>
                        자격증 이름:
                            <input
                                type="text"
                                value={certifiName}
                                onChange={handleCertifiNameChange}
                            /><br/>
                        자격증 공급기관:
                            <input
                                type="text"
                                value={certifiProv}
                                onChange={handleCertifiProvChange}
                            /><br/>
                        자격증 취득일자:
                            <DatePicker
                                selected={startsDate}
                                onChange={(date) => setStartsDate(date)}
                            />
                        <button type="submit" onClick={handleClickCertificate}>
                            제출
                        </button>
                    </form>
                )


            case 'image': // wip
                return(
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/" 
                        multiple={false}
                    />
                )


            default:
                return (<div>케이스 맞지 않음</div>)
        }
    }


    // Support Component  
    function AddInfo({data}){
    /*
    - AddInfo Component
        초기 렌더링 시 
        flask에서는 mysql의 데이터를 꺼내서 구분자를 기준으로 관련정보 리스트를 만들고 
        react에 리스트와 리스트 길이를 넘겨준다.  
    
        react에서는 응답받은 리스트의 길이대로 정보컴포넌트를 매핑하는데, 
        매핑하면서 각 정보컴포넌트에 인덱스를 순서대로 명시시켜준다.  
        이후 명시된 인덱스에따라 미리 받아둔 리스트의 정보를 표시한다.

        이때 리스트의 길이와, 현재 정보컴포넌트의 인덱스가 같다면, 추가버튼이 활성화된다. (단, 로그인 한 유저 정보만 한해서)
        추가버튼을 누르게 되면, 항목에 해당하는 SQL 컬럼에 구분자를 하나씩 더 넣어주고 리렌더링 한다. 
    */


        // 데이터 타입에 따라 다른 api를 불러옴
        // data === userid 
        const handleOnclickAddButton = () => {
            fetch(`/api/add_${data.type}`,{
                method: 'put',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
        

        return(
            <form action="#">
                <button onClick={handleOnclickAddButton} type="submit">추가하기</button>
            </form>
        )
    }
    

    // Serve Component 1
    function UserInfo(){
    /*
    사용자 프로필 컴포넌트
        isClick: 불리언 값에 따라 수정버튼이 활성화 or 비활성화
    */
        
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
        
        /* 
        사용자 ID와 prop으로 넣어준 ID가 같으면 수정하기 버튼이 활성화됨
        기본 상태에서는 사용자 정보를 출력, 버튼 클릭시 입력창이 뜸 
        */
        return (
            <div className='user-info'>
                <div className='userinfoname-font'>{username}</div>
                <div className='myself-font'>
                    {isClick ? 
                        <UpdateInput 
                            updateCase='onelineMyself' 
                            initState={onelineMyself}
                        /> 
                        : `${onelineMyself}`
                    }

                    {((props.researchid === ID) && !isClick) ? 
                        <button onClick={() => 
                            setIsClick(true)
                        }>
                        수정하기
                        </button>
                        : ""
                    }
                </div>
            </div>
        )
    }


    // Serve Component 2
    function Education(){
    /*
    사용자 학력사항 컴포넌트 
        mappingElement: 매핑시 참조가능한 인덱스요소들이 들어있음 [1, 2, 3, ...]
        isClick: 불리언 값에 따라 수정버튼이 활성화 or 비활성화
    */
        
        const [schoolName, setSchoolName] = useState(['학교 이름'])
        const [major, setMajor] = useState(['전공'])
        const [degree, setDegree] = useState(['학위'])
        const [mappingElement, setMappingElement] = useState([])

        const [isClick, setIsClick] = useState(false)


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
                    setMappingElement(res['element_list']) // [1, 2, 3, ...]
                } else{
                    return console.log("Not Found!")
                }
            })
        }, [])


        // 정보를 담은 컴포넌트
        const InfoComponent = ({value}) => {
            return(
                <div>
                    {isClick ? 
                        <UpdateInput
                            updateCase='education'
                            initState={{
                                schoolName : schoolName[value],
                                major : major[value],
                                degree : degree[value]
                            }}
                            index={value}/>
                    : 
                    <div className="info-element">
                        <div>{schoolName[value]}</div>

                        {/* 전공(학위) */}
                        <div>{`${major[value]}(${degree[value]})`}</div>
                    </div>}
                    
                    <div className='add-info'>
                    {/* 마지막 정보컴포넌트일 시 추가버튼 활성화 */}
                    {((mappingElement[mappingElement.length - 1] == value) && !isClick) ? 
                        <AddInfo 
                            data={{
                                type : 'education',
                                userid : ID,                         
                            }}
                        />
                    : ""
                    } 
                    </div>

                    {((props.researchid === ID) && !isClick) ? 
                        <button className='update-info' onClick={() => 
                            setIsClick(true)
                        }>
                        수정하기
                        </button>
                        : ""
                    }         
                    <hr/>          
                </div>
            )
        }
        return (
            <div className='info-class'>
                <div className='info-title'>학력</div>
                {/* mappingElment 리스트를 참고하여 정보컴포넌트를 매핑 */}
                {mappingElement.map(element => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }


    // Serve Component 3
    function AwardHistory(){
    /*
    사용자 수상경력 컴포넌트 
        mappingElement: 매핑시 참조가능한 인덱스요소들이 들어있음 [1, 2, 3, ...]
        isClick: 불리언 값에 따라 수정버튼이 활성화 or 비활성화
    */
        const [awardshistory, setAwardshistory] = useState(['수상 내역'])
        const [detailhistory, setDetailhistory] = useState(['상세 내역'])
        const [mappingElement, setMappingElement] = useState([])

        const [isClick, setIsClick] = useState(false)


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
                <div>
                    {isClick?
                        <UpdateInput
                            updateCase='awardhistory'
                            initState={{
                                awardshistory: awardshistory[value],
                                detailhistory: detailhistory[value]
                            }}
                            index={value}
                        />
                    :
                    <div className="info-element">
                        <div>{awardshistory[value]}</div>
                        <div>{detailhistory[value]}</div>
                    </div>
                    }
                    <div className='add-info'>
                    {/* 마지막 정보컴포넌트일 시 추가버튼 활성화 */}
                    {((mappingElement[mappingElement.length-1] == value) && !isClick) ?
                        <AddInfo
                            data={{
                                type: 'awardhistory',
                                userid: ID
                            }}
                        /> : ""
                    }
                    </div>
                    {/* 정보가 사용자 본인꺼라면 수정버튼 활성화 */}
                    {((props.researchid === ID) && !isClick) ?
                        <button className='update-info' onClick={() => {
                            setIsClick(true)
                        }}>
                        수정하기
                        </button>:""
                    }
                    <hr/>
                </div>
            )
        }

        return(
            <div className='info-class'>
                <div className='info-title'>수상 이력</div>

                {/* mappingElment 리스트를 참고하여 정보컴포넌트를 매핑 */}
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }

    // Serve Component 4
    function Project(){
    /*
    사용자 프로젝트 이력 컴포넌트 
        mappingElement: 매핑시 참조가능한 인덱스요소들이 들어있음 [1, 2, 3, ...]
        isClick: 불리언 값에 따라 수정버튼이 활성화 or 비활성화
    */
        const [projectname, setProjectname] = useState(['프로젝트 이름1'])
        const [projectDetail, setProjectDetail] = useState(['프로젝트 상세1'])
        const [projectdate, setProjectdate] = useState(['프로젝트 기간'])

        const [mappingElement, setMappingElement] = useState([])

        const [isClick, setIsClick] = useState(false)

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
                <div>
                    {isClick ?
                        <UpdateInput
                            updateCase='project'
                            initState={{
                                projectname: projectname[value],
                                projectDetail: projectDetail[value],
                                projectdate: projectdate[value]
                            }}
                            index={value}
                        />
                    :
                    <div className="info-element">
                        <div>{projectname[value]}</div>
                        <div>{projectDetail[value]}</div>
                        <div>{projectdate[value]}</div>
                    </div>
                    }

                    <div className='add-info'>
                    {/* 마지막 정보컴포넌트일 시 추가버튼 활성화 */}
                    {((mappingElement[mappingElement.length-1] == value) && !isClick) ?
                        <AddInfo
                            data={{
                                type:'project',
                                userid: ID
                            }}
                        /> :
                    ""}
                    </div>

                    {/* 정보가 사용자 본인꺼라면 수정버튼 활성화 */}
                    {((props.researchid === ID) && !isClick) ? 
                        <button className='update-info' onClick={() => {
                            setIsClick(true)
                        }}>
                        수정하기
                        </button> : 
                    ""}
                    <hr/>
                </div>
            )
        }

        return(
            <div className='info-class'>
                <div className='info-title'>프로젝트</div>

                {/* mappingElment 리스트를 참고하여 정보컴포넌트를 매핑 */}
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }

    // Serve Component 5
    function Certificate(){
    /*
    사용자 프로젝트 이력 컴포넌트 
        mappingElement: 매핑시 참조가능한 인덱스요소들이 들어있음 [1, 2, 3, ...]
        isClick: 불리언 값에 따라 수정버튼이 활성화 or 비활성화
    */
        const [certifiname, setCertifiname] = useState(['자격증 이름1'])
        const [certifiprov, setCertifiprov] = useState(['자격증 기관1'])
        const [certifidate, setCertifidate] = useState(['취득 기간1'])

        const [mappingElement, setMappingElement] = useState([])

        const [isClick, setIsClick] = useState(false)


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
                <div>
                    {isClick ?
                        <UpdateInput
                            updateCase='certificate'
                            initState={{
                                certifiname: certifiname[value],
                                certifiprov: certifiprov[value],
                                certifidate: certifidate[value]
                            }}
                            index={value}
                        />
                        :
                        <div className="info-element">
                            <div>{certifiname[value]}</div>
                            <div>{certifiprov[value]}</div>
                            <div>{certifidate[value]}</div>
                        </div>
                    }

                    <div className='add-info'>
                    {/* 마지막 정보컴포넌트일 시 추가버튼 활성화 */}
                    {((mappingElement[mappingElement.length-1] === value) && !isClick) ?
                        <AddInfo
                            data={{
                                type:'certificate',
                                userid: ID
                            }}
                        />
                    :""}
                    </div>

                    {/* 정보가 사용자 본인꺼라면 수정버튼 활성화 */}
                    {((props.researchid === ID) && !isClick) ? 
                        <button className='update-info' onClick={() => {
                            setIsClick(true)
                        }}>
                        수정하기
                        </button>
                    :""}
                    <hr/>
                </div>
            )
        }


        return(
            <div className='info-class'>
                <div className='info-title'>자격증</div>

                {/* mappingElment 리스트를 참고하여 정보컴포넌트를 매핑 */}
                {mappingElement.map((element) => {
                    return (<div><InfoComponent key={element.toString()} value={element}/></div>)
                })}
            </div>
        )
    }


    // End Of UserDetail
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


function MainComponent(){
    const ID = useSelector((state) => state.ID);

    return(
        <div>
            <UserDetail researchid={ID}/>
        </div>
    )
}


function NetworkComponent(){
/*
    dictList: 모든 사용자 정보들이 담긴 리스트 
        - 검색값이 없을 경우 dictList를 매핑해서 정보를 보여줌
        - 검색값이 존재하면 searchList를 매핑해서 정보를 보여줌

    searchList: 검색값에 매치되는 사용자 정보들이 담긴 리스트
        - 검색값에 따라 searchList를 수정 후 해당 searchList를 매핑해서 정보를 보여줌
*/
    useEffect(() => {
        fetch('/api/research_user_info', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'current' : ''})
        })
        .then(r => r.json())
        .then(res => {
            setDictList(res['dictList'])
        })
    }, [])

    const [dictList, setDictList] = useState([])
    const [searchList, setSearchList] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isClicked, setIsClicked] = useState(false)

    
    const UserInfo = ({userid, username, myself}) => {
        return(
            <div className='user-info' id={`box ${userid}`}>
                <div className='userinfoname-font'>{username}</div>
                <div>{myself}</div>
                {/* 각각의 userid를 담은 페이지 링크 */}
                <Link to={`/user_info/${encodeURI(userid)}`}>정보보기</Link>
            </div>
        )
    } 


    const checkInputValue = () => {
    /*
    검색값에 매치되는 정보를 dictList에서 찾고,
    결과를 searchList에 저장
    */
        if (inputValue.length < 2){
            alert('검색어는 최소 두 글자 이상 입력해야 합니다.')
        } else {
            setIsClicked(true)
            var string = inputValue 
            const search_list = []
            
            for(let dict of dictList){
                if(dict.username.indexOf(string) !== -1){
                    search_list.push(dict)
                }
            }
            (!(search_list.length === 0) ? 
                setSearchList(search_list)
            :
                alert('검색결과가 없습니다.')
            )
        }
    }

    return (
        <div>
            <div className='research'>
                <input
                    className='research-input'
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }} 
                    placeholder="이름으로 검색">
                </input>
                <button className='research-button' onClick={checkInputValue}>검색</button>
            </div>
            {/* 사용자가 검색버튼을 누르면 입력창을 기준으로 매치된 searchList가 매핑,
            기본 상태는 모든 사용자 정보를 조회하는 dictList가 매핑 */}
            <div className="wrapper">
                {isClicked ?
                searchList.map((element) => {
                    return <UserInfo 
                                userid={element.userid} 
                                username={element.username} 
                                myself={element.myself}
                            />
                })                        
                :
                dictList.map((element) => {
                    return <UserInfo 
                                userid={element.userid} 
                                username={element.username} 
                                myself={element.myself}
                            />
                })
                }
            </div>
        </div>
    )
}


// component가 main인지 network인지에 따라 해당되는 컴포넌트를 렌더링
function ComponentChanger(props){
    if (props.component === 'main'){
        return <MainComponent/>
    } else {
        return <NetworkComponent/>
    }
}


// 메인, 네트워크, 로그아웃 버튼 클릭시 각각의 행동이 담겨 있음
function MainPageContent(){
    const [component, setComponent] = useState('main')

    const handleClickLogout = (e) =>{
        logout()
        window.location.href="/"
    }

    return(
        <div className='main-menu'>
            <h1 className='main-logo'>Portfolio</h1>
            <button className='main-button' onClick={handleClickLogout}>
                Logout
            </button>
            <button className='main-button' onClick={() => {
                setComponent('network')
            }}>
                Network
            </button>  
            <button className='main-button' onClick={() => {
                setComponent('main')
            }}>
                Main
            </button><hr/>
            <ComponentChanger component={component}/>
        </div>
    )
}


function MainPage(){    
    return(
        <Router>
            <Switch>
                <Route path="/main" component={MainPageContent}/>
                <Route path="/user_info/:userid" component={UserInfoPage}/>
                <Route path="/" component={LoginPage}/>
            </Switch>
        </Router>
    )    
}

export default MainPage;