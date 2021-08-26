from flask import Blueprint, request, jsonify, abort
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_refresh_token 
from werkzeug.security import check_password_hash, generate_password_hash
from models import User, User_info, Education, Awardhitory, Projecthistory, Certification, db
import jwt


user_bp = Blueprint("user_bp", __name__)

bcrypt = Bcrypt()
encryption_secret = "secret_hanbin"
algorithm = "HS256"


@user_bp.route('/api/')
def home():
    return {"status": 200}


@user_bp.route('/api/join', methods=['POST'])
def join():
    """
    joinid : 입력된 아이디
    joinPassword : 입력된 비밀번호
    joinName : 입력된 사용자 이름

    joinpage.js 페이지로부터 데이터를 받아서 MySQL에 저장
    """
    
    req = request.get_json()

    joinId = req.get('joinId')
    joinPassword = req.get('joinPassword')
    joinName = req.get('joinName')

    hashed_pw = generate_password_hash(joinPassword)
    
    # 데이터 심어둠
    user = User(joinId, hashed_pw, joinName)
    user_info = User_info(joinId, joinName, '한 줄 소개')
    education = Education(joinId, '학교 이름', '전공', '학위')
    awardhistory = Awardhitory(joinId, '수상 내역', '수상 상세 내역')
    projecthistory = Projecthistory(joinId, '프로젝트 이름', '프로젝트 상세내역', '기간') 
    certification = Certification(joinId, '자격증 이름', '자격증 공급기관', '자격증 취득일자')

    if User.query.filter((User.userid == joinId)).all():
        return {'status':'iderror'}, 400

    db.session.add(user)
    db.session.add(user_info)
    db.session.add(education)
    db.session.add(awardhistory)
    db.session.add(projecthistory)
    db.session.add(certification)

    try:
        db.session.commit()
    except:
        return jsonify({'result' : 'failed'}), 400
    
    return jsonify({'result' : 'success'}), 200


@user_bp.route('/api/login', methods=['POST'])
def login():
    """
    POST
    : loginPage.js에서 들어오는 데이터 (아이디, 비밀번호)를 받고,
      MySQL에 사용자가 입력한 아이디와 비밀번호가 있는지 조회하고 비교
      아이디가 MySQL에서 존재하지 않을 경우 notFoundId 메세지를 던져줌
      입력된 비밀번호가 MySQL의 비밀번호와 다를 경우 notFoundPassword 메세지 던져줌
      조회 성공 시 토큰을 넘겨 줌
    """

    req = request.get_json() 
    username = req.get('username')
    password = req.get('password')

    user_data = User.query.filter(User.userid == username).first()
 
    if not user_data:
        abort(400)

    if not check_password_hash(user_data.password, password):
        abort(401)

    data_to_encode = {"username" : username, "password" : password}
    token = jwt.encode(data_to_encode, encryption_secret, algorithm=algorithm) 
    
    return jsonify({"access_token" : token}), 200


# 토큰을 refresh 하여 프론트서버에 넘겨 줌 
@user_bp.route('/api/refresh', methods=['POST'])
def refresh():     
    old_token = request.get_data() 
    new_token = create_refresh_token(old_token)
    
    return jsonify({'access_token' : new_token,
                    "status" : 200})


# 아이디 틀릴 시 에러 핸들림
@user_bp.errorhandler(400)
def id_not_found(e):
    return jsonify({
        "status" : 400,
        "result" : "notFoundId"
    })


# 비밀번호 틀릴 시 에러 핸들링
@user_bp.errorhandler(401)
def password_not_found(e):
    return jsonify({
        "status" : 401,
        "result" : "notFoundPassword"
    })