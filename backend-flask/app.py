import flask
from flask import request, jsonify, make_response
from flask import json
from flask_cors import CORS
import numpy as np 
import boto3

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

#dummy user creds
aws_access_key_id = 'AKIA47DQS2XLIHWWMQE4'
aws_secret_access_key = 'HVUQC4P48HOOEWL/cMptxGk5qMKcFF+AJqAmkS/n'
region='us-east-1'

@app.route('/flaskapi', methods=['POST'])
def create_task():
    if not request.files or not 'image' in request.files:
        return jsonify('Error'), 400

    file = request.files['image'].read() ## byte file
    byteArray = bytearray(file)
    client=boto3.client('rekognition', aws_access_key_id = aws_access_key_id, aws_secret_access_key = aws_secret_access_key, region_name=region)
    response = client.detect_labels(Image= {'Bytes': byteArray})
    return jsonify(response), 201

app.run()