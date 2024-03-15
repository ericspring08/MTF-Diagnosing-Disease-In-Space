from flask import Flask, request, jsonify
from flask_cors import CORS
from src.Prediction import Prediction
from src.utils import disease_options, format_dict
import os

app = Flask(__name__)
CORS(app)


@app.route('/diseases')
def diseases():
    return jsonify(disease_options)


@app.route('/get_features', methods=['GET'])
def get_features():
    disease = request.args.get('disease')
    return jsonify({
        'features': format_dict[disease]['features'],
        'categorical': format_dict[disease]['categorical'],
        'numerical': format_dict[disease]['numerical'],
        'form': format_dict[disease]['form'],
        'diseaseName': format_dict[disease]['name']
    })


@app.route('/predict/<disease>', methods=['POST'])
def predict(disease):
    data = request.get_json(force=True)
    predictor = Prediction(data, disease)
    predictor.preprocess()
    prediction, probability = predictor.predict()
    print(prediction, probability)
    return jsonify({
        'prediction': prediction.tolist()[0],
        'probability': probability.tolist()[0][prediction.tolist()[0]]
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
