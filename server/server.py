from flask import Flask, request, jsonify
from flask_cors import CORS
from src.Prediction import Prediction
from src.utils import diagnosis_options, format_dict
import os

app = Flask(__name__)
CORS(app)


@app.route('/diseases')
def diseases():
    return jsonify(diagnosis_options)


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
    prediction_string = ""
    if prediction.tolist()[0] == 1:
        prediction_string = "positive"
    else:
        prediction_string = "negative"
    result_description = format_dict[disease]['results_description'][prediction_string]
    return jsonify({
        'prediction': prediction.tolist()[0],
        'probability': probability.tolist()[0][prediction.tolist()[0]],
        'description': result_description,
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
