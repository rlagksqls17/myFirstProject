from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """
    _id = 식별자
    userid = 사용자 아이디
    password = 사용자 비밀번호
    name = 사용자 이름
    """

    __tablename__ = 'users'
    userid = db.Column(db.String(50), primary_key=True)
    password = db.Column(db.String(600))
    name = db.Column(db.String(50))


    def __init__(self, userid, password, name):
        self.userid = userid
        self.password = password
        self.name = name


class User_info(db.Model):
    """
    userid = 사용자 ID
    user_name = 사용자 이름 (가입 시 이름을 저장)
    oneline = 한 줄 소개   
    """

    __tablename__ = 'user_info'
    userid = db.Column(db.String(50), primary_key=True)
    user_name = db.Column(db.String(50))
    oneline = db.Column(db.String(50))


    def __init__(self, userid, user_name, oneline):
        self.userid = userid
        self.user_name = user_name
        self.oneline = oneline 


class Education(db.Model):
    """
    userid = 사용자 ID
    schoolname = 학교 이름
    major = 전공
    degree = 학위
    """

    __tablename__ = 'education'
    userid = db.Column(db.String(50), primary_key=True)
    schoolname = db.Column(db.String(50))
    major = db.Column(db.String(50))
    degree = db.Column(db.String(50))


    def __init__(self, userid, schoolname, major, degree):
        self.userid = userid
        self.schoolname = schoolname
        self.major = major
        self.degree = degree


class Awardhitory(db.Model):
    """
    userid = 사용자 이름
    awardshistory = 수상 내역
    detailhistory = 상세 내역
    """

    __tablename__ = 'awardhistory'
    userid = db.Column(db.String(50), primary_key=True)
    awardshistory = db.Column(db.String(50))
    detailhistory = db.Column(db.String(50))


    def __init__(self, userid, awardshistory, detailhistory):
        self.userid = userid
        self.awardshistory = awardshistory
        self.detailhistory = detailhistory


class Projecthistory(db.Model):
    """
    userid = 사용자 이름
    projectname = 프로젝트 이름
    projectdetail = 프로젝트 상세 내용
    projectdate = 프로젝트 기간
    """

    __tablename__ = 'projecthistory'
    userid = db.Column(db.String(50), primary_key=True)
    projectname = db.Column(db.String(50))
    projectdetail = db.Column(db.String(50))
    projectdate = db.Column(db.String(50))


    def __init__(self, userid, projectname, projectdetail, projectdate):
        self.userid = userid
        self.projectname = projectname
        self.projectdetail = projectdetail
        self.projectdate = projectdate


class Certification(db.Model):
    """
    userid = 사용자 이름
    certifiname = 자격증 이름
    certifiprov = 자격증 공급 기관
    certifidate = 자격증 취득 일자
    """
    
    __tablename__ = 'certification'
    userid = db.Column(db.String(50), primary_key=True)
    certifiname = db.Column(db.String(50))
    certifiprov = db.Column(db.String(50))
    certifidate = db.Column(db.String(50))


    def __init__(self, userid, certifiname, certifiprov, certifidate):
        self.userid = userid
        self.certifiname = certifiname
        self.certifiprov = certifiprov
        self.certifidate = certifidate
