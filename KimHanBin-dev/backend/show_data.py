from flask import Blueprint, request
from models import User_info, Education, Awardhitory, Projecthistory, Certification

show_bp = Blueprint("show_data", __name__)


# 네트워크 탭에서 사용자 검색 위한 api 
@show_bp.route('/api/research_user_info', methods=['POST'])
def research_user_info():
    """
    react에서 검색요청을 보내면 
    이 api는 mySQL의 user_info 테이블에 존재하는 모든 데이터를 
    다음 형태로 react에 넘겨줌
    [{userid: 아이디1, username: 이름1, myself: 한줄소개1}, {userid: 아이디2, ...}, ...]
    """
    
    input_value = request.get_json()
    output_list = []

    # react에서 보낸 검색요청 데이터 (빈 문자열)
    if input_value['current'] == '':
        information = User_info.query.filter().all()

        for element in information:
            pre_handled_dict = {
                'userid':element.userid,
                'username':element.user_name,
                'myself':element.oneline
            }
            output_list.append(pre_handled_dict)

        return{
            'status' : 200,
            'dictList' : output_list
        }
    
    return {'status' : 400}


# 사용자 요약 프로필 조회 (입력된 사용자 id를 검색해서 조회)
@show_bp.route('/api/show_user_info', methods={'POST'})
def show_user_info():
    userid = request.get_json()
    user_list = User_info.query.filter((User_info.userid == userid)).first()
    id = user_list.userid
    name = user_list.user_name
    oneline_myself = user_list.oneline 

    return {
            'status' : 200, 
            'id' : id, 
            'name' : name, 
            'onelineMyself' : oneline_myself
            }


# 사용자 학력사항 조회 (입력된 사용자 id를 검색해서 조회)
@show_bp.route('/api/show_education', methods=['POST'])
def show_education():
    userid = request.get_json()
    user_list = Education.query.filter((Education.userid == userid)).first()
    
    # mysql에 구분자(':')가 있으면 이를 기준으로 리스트를 만듦
    school_name = (user_list.schoolname).split(':')
    major = (user_list.major).split(':')
    degree = (user_list.degree).split(':')
    element_list = [i for i in range(0, len(school_name))] # react에 요소 개수를 인식시켜줌

    # 이후 react에서는 리스트와 리스트 개수를 바탕으로 학력사항 리스트를 매핑해서 보여줌
    return {
        'status' : 200,
        'schoolname' : school_name,
        'major' : major,
        'degree' : degree,
        'element_list' : element_list
    }


"""
이후의 api는 모두 같은 조회 기능을 하는 api
로직은 위의 api와 같고, 조회하는 정보만 다르다.
"""


# 사용자 수상경력 조회 (입력된 사용자 id를 검색해서 조회)
@show_bp.route('/api/show_awardhistory', methods=['POST'])
def show_awardhistory():
    userid = request.get_json()
    user_list = Awardhitory.query.filter((Awardhitory.userid == userid)).first()

    awards_history = (user_list.awardshistory).split(':')
    detail_history = (user_list.detailhistory).split(':')
    element_list = [i for i in range(0, len(detail_history))]

    return {
        'status' : 200,
        'awardshistory': awards_history,
        'detailhistory': detail_history,
        'element_list' :  element_list
    }


# 사용자 프로젝트 이력 조회 (입력된 사용자 id를 검색해서 조회)
@show_bp.route('/api/show_projecthistory', methods=['POST'])
def show_projecthistory():
    userid = request.get_json()
    user_list = Projecthistory.query.filter((Projecthistory.userid == userid)).first()

    project_name = (user_list.projectname).split(':')
    project_detail = (user_list.projectdetail).split(':')
    project_date = (user_list.projectdate).split(':')
    element_list = [i for i in range(0, len(project_name))]

    return {
        'status' : 200,
        'project_name': project_name,
        'project_detail': project_detail,
        'project_date': project_date,
        'element_list': element_list
    }


# 사용자 자격증 이력 조회 (입력된 사용자 id를 검색해서 조회)
@show_bp.route('/api/show_certificate', methods=['POST'])
def show_certificate():
    userid = request.get_json()
    user_list = Certification.query.filter((Certification.userid == userid)).first()

    certifi_name = (user_list.certifiname).split(':')
    certifi_prov = (user_list.certifiprov).split(':')
    certifi_date = (user_list.certifidate).split(':')
    element_list = [i for i in range(0, len(certifi_name))]    

    return {
        'status' : 200,
        'certifi_name':certifi_name,
        'certifi_prov':certifi_prov,
        'certifi_date':certifi_date,
        'element_list':element_list
    }