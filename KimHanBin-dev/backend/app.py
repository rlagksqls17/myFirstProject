from flask import Flask
from flask_migrate import Migrate
from models import db
import flask_cors
import string, random, config
from user_api import user_bp
from show_data import show_bp
from update_data import update_bp


app = Flask(__name__)
app.debug = True


# SECRET KEY 랜덤값 설정
_LENGTH = 10
string_pool = string.ascii_lowercase
secret_key = ""

for i in range (_LENGTH):
    secret_key += random.choice(string_pool)

app.config['SECRET_KEY'] = secret_key

# 토큰 유효기간
app.config['JWT_ACCESS_LIFESPAN'] = {'hours' : 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days' : 30}

# db
app.config['SQLALCHEMY_DATABASE_URI'] = config.DB_URL  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 1 
db.init_app(app)
migrate = Migrate(app, db)

# cors
cors = flask_cors.CORS()
cors.init_app(app)

# blueprint
"""
user_api.py (user_bp) : 로그인, 회원가입 api 
show_data.py (show_bp) : 유저정보 api
update_data.py (update_bp) : 유저 정보 수정 api
"""

app.register_blueprint(user_bp)  
app.register_blueprint(show_bp) 
app.register_blueprint(update_bp) 


if __name__ == "__main__":
    app.run()