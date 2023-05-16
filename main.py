from flask import Flask, request
import pandas as pd
from joblib import load
from flask_cors import CORS

# load the trained model and vectorizer
clf = load('model.joblib')
#vectorizer = TfidfVectorizer()
vectorizer = load('vectorizer.joblib')

# create the Flask app
app = Flask(__name__)
label_dict = ["Fake", "Not Fake"]
CORS(app, resources={r"/*": {"origins": "*"}})

# define the endpoint
@app.route('/text', methods=['POST'])
def predict():
    text = request.form['text']
    text_tfidf = vectorizer.transform([text])
    # make a prediction using the trained classifier
    prediction = clf.predict(text_tfidf)
    # return the prediction as a JSON response
    return {'prediction': label_dict[prediction[0]]}


@app.route('/data', methods=['POST'])
def predict_csv():
    file = request.files['file']
    df = pd.read_csv(file)
    text_tfidf = vectorizer.transform(df['text'])
    predictions = clf.predict(text_tfidf)
    df['prediction'] = [label_dict[prediction] for prediction in predictions]
    results = []
    for index, row in df.iterrows():
        results.append({
            'text': row['text'],
            'prediction': row['prediction']
        })
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True) 
