from flask import Flask, request, jsonify
from flask_cors import CORS
from src.Prediction import Prediction
import os


app = Flask(__name__)
CORS(app)

@app.route('/hdd', methods=['POST'])
def hdd():
    data = request.get_json(force=True)
    predictor = Prediction(data, 'hdd')
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