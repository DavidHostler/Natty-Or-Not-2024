import time
#Machine learning related imports 
import tensorflow as tf
import numpy as np
from tensorflow import keras
import os
import cv2
import numpy.typing as npt


class SteroidDetectionModel:

    def __init__(self, path_to_weights):
        
        self.model= keras.models.load_model(path_to_weights)
        self.path_to_weights = path_to_weights

        
    def predict(self, data: np.ndarray) -> float:

        IMG_SIZE = self.model.layers[0].input_shape[1] #Get size of input layer
        resized_image = cv2.resize(data, (IMG_SIZE, IMG_SIZE))
        resized_image_data = np.expand_dims(resized_image, axis=0)
        prediction_ = self.model.predict(resized_image_data)
        
        return float(prediction_)#, print_statement

if __name__ == '__main__':


    steroid_detector = SteroidDetectionModel(path_to_weights=os.path.join(os.getcwd(), 'nattyornot.h5'))
    

    # model.summary()

    img = cv2.imread('/home/dolan/Portfolio/NattyOrNot-2024/rest_api/uploads/1.jpg', cv2.IMREAD_GRAYSCALE)
    # img = cv2.resize()
    # print(img.shape)
    # print(model.layers[0].input_shape)

    proba = steroid_detector.predict(img)
    print('Probability: ', proba)