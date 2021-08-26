from flask import Blueprint, request, jsonify, abort
from models import User_info, Education, Awardhitory, Projecthistory, Certification, db


update_bp = Blueprint("update_data", __name__)


# 사용자 요약 정보 수정 api
@update_bp.route('/api/update_user_myself', methods={'PUT'})
def update_user_myself():
    # userid를 받아서 검색, 이후 한 줄 소개를 수정
    req = request.get_json()
    userid = req.get('userid')
    myself = req.get('myself')

    target_user = User_info.query.filter((User_info.userid == userid)).all()[0]
    target_user.oneline = myself
    
    try : 
        db.session.commit()
        return {'status' : 200}
    except :
        return {'status' : 404}




# 사용자 학력 사항 수정 api
@update_bp.route('/api/update_education', methods=['PUT'])
def update_education():
    """
    # 1. react로부터 수정할 데이터를 받아온다.
    # 2. mySQL로부터 원래 존재하는 데이터를 구분자 기준으로 리스트로 변환시켜 받아온다.
    # 3. 변환시킨 원래 데이터 리스트에, 수정할 데이터를 삽입하고 전체 string을 mySQL 커밋
    """
    
    
    def convert_update_string(full_data_list, target_index, target_string):
        """
        1. 원래 리스트 : [elment1, element2]
        2. 삽입후 리스트 : [element1, element2, element3]
        3. string으로 변환 : "element1:element2:element3"
        """
        full_data_list[target_index] = target_string
        converted_string = ":".join(full_data_list)
        return converted_string

    # 1
    req = request.get_json()
    userid = req.get('userid')
    school_name = req.get('school_name')
    major = req.get('major')
    degree = req.get('degree')
    index = req.get('index')

    # 2
    user_list = Education.query.filter((Education.userid == userid)).first()
    school_name_string = (user_list.schoolname).split(':')
    major_string = (user_list.major).split(':')
    degree_string = (user_list.degree).split(':')

    # 3
    target_user = Education.query.filter((Education.userid == userid)).all()[0]
    target_user.schoolname = convert_update_string(school_name_string, index, school_name)
    target_user.major = convert_update_string(major_string, index, major)
    target_user.degree = convert_update_string(degree_string, index, degree)

    try :
        db.session.commit()
        return {'status' : 200}
    except : 
        return {'status' : 404}




# 사용자 수상 이력 수정 api 
@update_bp.route('/api/update_awardhistory', methods=['PUT'])
def update_awardhistory():
    """
    # 1. react로부터 수정할 데이터를 받아온다.
    # 2. mySQL로부터 원래 존재하는 데이터를 구분자 기준으로 리스트로 변환시켜 받아온다.
    # 3. 변환시킨 원래 데이터 리스트에, 수정할 데이터를 삽입하고 전체 string을 mySQL 커밋
    """

    def convert_update_string(full_data_list, target_index, target_string):
        """
        1. 원래 리스트 : [elment1, element2]
        2. 삽입후 리스트 : [element1, element2, element3]
        3. string으로 변환 : "element1:element2:element3"
        """   
        full_data_list[target_index] = target_string
        converted_string = ":".join(full_data_list)
        return converted_string

    # 1
    req = request.get_json()
    userid = req.get('userid')
    awards_history = req.get('award_history')
    detail_history = req.get('detail_history')
    index = req.get('index')

    # 2
    user_list = Awardhitory.query.filter((Awardhitory.userid == userid)).first()
    awards_history_list = (user_list.awardshistory).split(':')
    detail_history_list = (user_list.detailhistory).split(':')

    # 3
    target_user = Awardhitory.query.filter((Awardhitory.userid == userid)).all()[0]
    target_user.awardshistory = convert_update_string(awards_history_list, index, awards_history)
    target_user.detailhistory = convert_update_string(detail_history_list, index, detail_history)

    try :
        db.session.commit()
        return {'status' : 200}
    except : 
        return {'status' : 404}




# 사용자 프로젝트 이력 수정 api
@update_bp.route('/api/update_projecthistory', methods=['PUT'])
def update_projecthistory():
    """
    # 1-1. react로부터 수정할 데이터를 받아온다.
    # 1-2. 날짜 데이터는 적절한 string으로 변환한다.
    # 2. mySQL로부터 원래 존재하는 데이터를 구분자 기준으로 리스트로 변환시켜 받아온다.
    # 3. 변환시킨 원래 데이터 리스트에, 수정할 데이터를 삽입하고 전체 string을 mySQL 커밋
    """

    def convert_update_string(full_data_list, target_index, target_string):
        full_data_list[target_index] = target_string # [element1, element2, element3]
        converted_string = ":".join(full_data_list) # "element1:element2:element3"
        return converted_string
    

    def convert_date_string(target_list):
        """
        1. 변환 전 데이터 : 2021-08-21 - 2021-08-24
        2. 변환 후 데이터 : 2021/08/21 - 2021/08/24
        """
        target_list[0] = target_list[0][:10].replace('-', '/')
        target_list[1] = target_list[1][:10].replace('-', '/')
        result_string = " - ".join(target_list)
        return result_string


    # 1-1
    req = request.get_json()
    userid = req.get('userid')
    project_name = req.get('project_name')
    project_detail = req.get('project_detail')
    
    # 1-2
    project_date = convert_date_string(req.get('project_date'))
    index = req.get('index')

    # 2
    user_list = Projecthistory.query.filter((Projecthistory.userid == userid)).first()
    project_name_list = (user_list.projectname).split(':')
    project_detail_list = (user_list.projectdetail).split(':')
    project_date_list = (user_list.projectdate).split(':')

    # 3
    target_user = Projecthistory.query.filter((Projecthistory.userid == userid)).all()[0]
    target_user.projectname = convert_update_string(project_name_list, index, project_name)
    target_user.projectdetail = convert_update_string(project_detail_list, index, project_detail)
    target_user.projectdate = convert_update_string(project_date_list, index, project_date)

    try :
        db.session.commit()
        return {'status' : 200}
    except : 
        return {'status' : 404}




# 사용자 자격증 이력 수정
@update_bp.route('/api/update_certificate', methods=['PUT'])
def update_certificate():
    """
    # 1-1. react로부터 수정할 데이터를 받아온다.
    # 1-2. 날짜 데이터는 적절한 string으로 변환한다.
    # 2. mySQL로부터 원래 존재하는 데이터를 구분자 기준으로 리스트로 변환시켜 받아온다.
    # 3. 변환시킨 원래 데이터 리스트에, 수정할 데이터를 삽입하고 전체 string을 mySQL 커밋
    """

    def convert_update_string(full_data_list, target_index, target_string):
        full_data_list[target_index] = target_string  # [element1, element2, element3]
        converted_string = ":".join(full_data_list)  # "element1:element2:element3"
        return converted_string
    

    def convert_date_string(target_string):
        result_string = target_string[:10].replace('-', '/') # 2021-08-21 => 2021/08/21
        return result_string

    # 1-1
    req = request.get_json()
    userid = req.get('userid')
    certifiname = req.get('certifi_name')
    certifiprov = req.get('certifi_prov')
    
    # 1-2
    certifidate = convert_date_string(req.get('certifi_date'))
    index = req.get('index')

    # 2
    user_list = Certification.query.filter((Certification.userid == userid)).first()
    certifi_name_list = (user_list.certifiname).split(':')
    certifi_prov_list = (user_list.certifiprov).split(':')
    certifi_date_list = (user_list.certifidate).split(':')  

    # 3
    target_user = Certification.query.filter((Certification.userid == userid)).all()[0]
    target_user.certifiname = convert_update_string(certifi_name_list, index, certifiname)
    target_user.certifiprov = convert_update_string(certifi_prov_list, index, certifiprov)
    target_user.certifidate = convert_update_string(certifi_date_list, index, certifidate)    

    try :
        db.session.commit()
        return {'status' : 200}
    except : 
        return {'status' : 404}



# 사용자 학력사항 추가 api
@update_bp.route('/api/add_education', methods=['PUT'])
def add_education():
    # 받아온 각 정보에 구분자를 넣어주고 mySQL에 저장

    req = request.get_json()
    userid = req.get('userid')

    user_list = Education.query.filter((Education.userid == userid)).first()
    school_name_string = (user_list.schoolname) + ":"
    major_string = (user_list.major) + ":"
    degree_string = (user_list.degree) + ":"

    target_user = Education.query.filter((Education.userid == userid)).all()[0]
    target_user.schoolname = school_name_string
    target_user.major = major_string
    target_user.degree = degree_string

    try :
        db.session.commit()
        return {'status' : 200}
    except : 
        return {'status' : 404}


"""
이후의 api는 위의 api와 로직이 같고 타겟데이터만 다르다.
"""


# 사용자 수상이력 추가 api
@update_bp.route('/api/add_awardhistory', methods=['PUT'])
def add_awardhistory():
    req = request.get_json()

    userid = req.get('userid')

    user_list = Awardhitory.query.filter((Awardhitory.userid == userid)).first()
    awards_history_list = (user_list.awardshistory) + ":"
    details_history_list = (user_list.detailhistory) + ":"

    target_user = Awardhitory.query.filter((Awardhitory.userid == userid)).all()[0]
    target_user.awardshistory = awards_history_list
    target_user.detailhistory = details_history_list

    try: 
        db.session.commit()
        return {'status' : 200}
    except:
        return {'status' : 404} 
   

# 사용자 프로젝트 이력 추가 api
@update_bp.route('/api/add_project', methods=['PUT'])
def add_project():
    req = request.get_json()

    userid = req.get('userid')

    user_list = Projecthistory.query.filter((Projecthistory.userid == userid)).first()
    project_name_list = (user_list.projectname) + ":"
    project_detail_list = (user_list.projectdetail) + ":"
    project_date_list = (user_list.projectdate) + ":"

    target_user = Projecthistory.query.filter((Projecthistory.userid == userid)).all()[0]
    target_user.projectname = project_name_list
    target_user.projectdetail = project_detail_list
    target_user.projectdate = project_date_list

    try: 
        db.session.commit()
        return {'status' : 200}
    except:
        return {'status' : 404} 


# 사용자 자격증 이력 추가 api
@update_bp.route('/api/add_certificate', methods=['PUT'])
def add_certificate():
    req = request.get_json()

    userid = req.get('userid')

    user_list = Certification.query.filter((Certification.userid == userid)).first()
    certifi_name_list = (user_list.certifiname) + ":"
    certifi_prov_list = (user_list.certifiprov) + ":"
    certifi_date_list = (user_list.certifidate) + ":"

    target_user = Certification.query.filter((Certification.userid == userid)).all()[0]
    target_user.certifiname = certifi_name_list
    target_user.certifiprov = certifi_prov_list
    target_user.certifidate = certifi_date_list

    try: 
        db.session.commit()
        return {'status' : 200}
    except:
        return {'status' : 404} 