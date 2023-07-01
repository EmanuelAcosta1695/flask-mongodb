from flask import Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

import os
import json

from bson import json_util
from bson.objectid import ObjectId

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'img')

# Carga las variables de entorno desde el archivo .env
load_dotenv('.env' or 'MY_SECRET_VARIABLES')

app = Flask(__name__)

CORS(app, support_credentials=True, resources={r"/*": {"origins": "*"}})

app.config['MONGO_URI'] = os.environ.get("MONGO_URI")


mongo = PyMongo(app)

@app.route('/')
def index():
    return "Api Flask with MongoDB - User Managment"


@app.route('/users/<id>', methods=['GET'])
@cross_origin()
def get_user(id):

    user = mongo.db.users.find_one({'_id': ObjectId(id)})

    response = json_util.dumps(user)

    return Response(response, mimetype="application/json")


@app.route('/users', methods=['POST'])
def create_user():
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']

    # data = request.json
    # username = data['username']
    # password = data['password']
    # email = data['email']

    if username and email and password:
        hashed_password = generate_password_hash(password)

        default_filename = "default-profile.jpg"

        if 'profile_pic' in request.files:

            image = request.files['profile_pic']

            # Si el usuario no carga una imagen de perfil no se ejecuta
            if image.filename != '':
                default_filename = secure_filename(image.filename)
                default_filename = default_filename[:-4] + f'-{username}' + default_filename[-4:] #'blank-profile-Johnson.jpg'
                image.save(os.path.join(UPLOAD_DIR, default_filename))


        id = mongo.db.users.insert_one(
            {"username":username, "email":email, "password":hashed_password, "profile": default_filename}
        )
    
    else:
        return not_found()

    return {'message': 'received'}




# /
@app.route('/mostrarUsers/', methods=['GET'])
@cross_origin()
def get_users():

    users = mongo.db.users.find()

    response = json_util.dumps(users)   

    # convertir la cadena JSON a una lista de diccionarios
    users = json.loads(response)


    base_url = os.environ.get('BASE_URL')

    # Iterar sobre la lista de diccionarios
    for user in users:
        filename = user['profile']
        user["profilePic"] = base_url+filename

    # Convertir la lista actualizada de objetos en JSON
    updated_response = json.dumps(users)
 

    return Response(updated_response, mimetype='application/json')



@app.errorhandler(404)
def not_found(error=None):

    response = jsonify({
        'message': 'Resource Not Found: ' + request.url,
        'status': 404
    })

    response.status_code = 404
    
    return response



@app.route('/users/<id>', methods=['PUT'])
@cross_origin()
def update_users(id):
    username = request.json['username']
    email = request.json['email']

    try:
        if username and email:
        
            mongo.db.users.update_one({'_id': ObjectId(id)}, {'$set': {
                'username': username,
                'email': email
            }})

        response = jsonify({'message': 'User ' + id + ' was updated successfully'})
        return response

    except Exception as e:

        return ("Error: " + e)


    
@app.route('/usersPassword/<id>', methods=['PUT'])
@cross_origin()
def updatePassword(id):

    try:

        user = mongo.db.users.find_one({'_id': ObjectId(id)})

        currentPassword = request.json['currentPassword']
        newPassword = request.json['newPassword']

        if check_password_hash(user['password'], currentPassword):

            hashed_newPassword = generate_password_hash(newPassword)

            mongo.db.users.update_one({'_id': ObjectId(id)}, {'$set': {
                'password': hashed_newPassword
            }})

            response = jsonify({'message': 'Password from user id: ' + id + ' was updated successfully'})
            return response
        
        return 

    except Exception as e:
        return ("Error: ", e)
    

# NO FUNCIONA POR LO DE LA FOTO
@app.route('/users/<id>', methods=['DELETE'])
@cross_origin()
def delete_user(id):

    mongo.db.users.delete_one({'_id': ObjectId(id)})

    response = jsonify({'message': 'User ' + id + ' was DEelted successfully'})

    return response


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')