from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import cv2 
import numpy as np 
import os
from predict import SteroidDetectionModel 

app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'png'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

steroid_detector = SteroidDetectionModel(path_to_weights=os.path.join(os.getcwd(), 'nattyornot.h5'))




def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class ImageUpload(Resource):
    def post(self):
        if 'file' not in request.files:
            return {'error': 'No file part in the request'}, 400
        file = request.files['file']
        if file.filename == '':
            return {'error': 'No file selected for uploading'}, 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            #If these steps are successful, then implement computer vision API
            img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE) 
            
            proba = steroid_detector.predict(img)
            if proba >= 0.5:
                judgment = True
            else:
                judgment = False
            
            return jsonify({
                'probability':proba,          
                'judgment':judgment      
            })
            # return {'message': 'File successfully uploaded'}, 201
        else:
            return {'error': 'Allowed file types are jpg and png'}, 400

api.add_resource(ImageUpload, '/upload')

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run('0.0.0.0')