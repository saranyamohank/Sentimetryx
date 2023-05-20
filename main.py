from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the trained model and vectorizer
try:
    clf = load('model.joblib')
    vectorizer = load('vectorizer.joblib')
except Exception as e:
    print("Error loading model or vectorizer:", str(e))
    exit(1)

@app.route('/text', methods=['POST'])
def predict_text():
    try:
        text = request.json.get('text')
        if text is None:
            return jsonify({'error': 'No text provided'}), 400

        text_tfidf = vectorizer.transform([text])
        prediction = clf.predict(text_tfidf)
        return jsonify({'text': text, 'prediction': str(prediction[0])})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['POST'])
def predict_csv():
    try:
        file = request.files.get('file')
        if file is None:
            return jsonify({'error': 'No file provided'}), 400

        df = pd.read_csv(file)
        text_tfidf = vectorizer.transform(df['Text'])
        predictions = clf.predict(text_tfidf)
        df['prediction'] = predictions

        return jsonify(df.to_dict(orient='records'))

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
