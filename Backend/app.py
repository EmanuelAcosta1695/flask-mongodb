from flask import Flask, request, jsonify, Response, send_file
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin

import os

from bson import json_util
from bson.objectid import ObjectId


app = Flask(__name__)


CORS(app, support_credentials=True, resources={r"/*": {"origins": "*"}})


app.config['MONGO_URI'] = os.environ.get("MONGO_URI")


mongo = PyMongo(app)

@app.route('/users/<id>', methods=['GET'])
@cross_origin()
def get_user(id):

    user = mongo.db.users.find_one({'_id': ObjectId(id)})

    response = json_util.dumps(user)

    return Response(response, mimetype="application/json")


@app.route('/users', methods=['POST'])
def create_user():

    username = request.json['username']
    password = request.json['password']
    email = request.json['email']

    if username and email and password:

        hashed_password = generate_password_hash(password)

        id = mongo.db.users.insert_one(
            {"username":username, "email":email, "password":hashed_password}
        )

    else:
        return not_found()

    return {'message':'received'}



@app.route('/mostrarUsers/', methods=['GET'])
@cross_origin()
def get_users():

    users = mongo.db.users.find()

    response = json_util.dumps(users)

    return Response(response, mimetype='application/json')



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
    

@app.route('/users/<id>', methods=['DELETE'])
@cross_origin()
def delete_user(id):

    mongo.db.users.delete_one({'_id': ObjectId(id)})

    response = jsonify({'message': 'User ' + id + ' was DEelted successfully'})

    return response


if __name__ == "__main__":
    app.run(debug=True)