from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import spacy
from collections import Counter
import os
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/', methods=['POST'])
def process_file():
    file = request.files['file']
    print(file)
    file_content = file.read()
    data = pd.read_csv(BytesIO(file_content))
    data.dropna(axis="columns", how="any", inplace=True)
    data['Sentiment'] = data['Sentiment'].str.lower()
    df = data.groupby('Sentiment')
    datasets = {}
    for groups, data in df:
        datasets[groups] = data

    wordlist = []
    with open('words.txt', 'r') as file:
        for line in file:
            line = line.strip().lower()
            wordlist.append(line)

    neg = datasets['negative']
    pos = datasets['positive']

    neglist = []
    neg_text_list = []  # Store relevant input text for negative words
    nlp = spacy.blank("en")
    for sentence in neg['Text']:
        doc = nlp(sentence)
        lowercase_tokens = [token.text.lower() for token in doc]
        for token in lowercase_tokens:
            if token in wordlist:
                neglist.append(token)
                neg_text_list.append(sentence)  # Store relevant input text

    poslist = []
    pos_text_list = []  # Store relevant input text for positive words
    nlp = spacy.blank("en")
    for sentence in pos['Text']:
        doc = nlp(sentence)
        lowercase_tokens = [token.text.lower() for token in doc]
        for token in lowercase_tokens:
            if token in wordlist:
                poslist.append(token)
                pos_text_list.append(sentence)  # Store relevant input text

    neg_word_freq = Counter(neglist)
    neglength = len(neg)

    # Find the top 5 most frequent words
    top_five = neg_word_freq.most_common(5)

    # Build the result dictionary
    result = {}
    for word, freq in top_five:
        percent_freq = (freq / neglength) * 100
        result[word] = {
            "percent_freq": f"{percent_freq:.2f}%",
            "relevant_text": neg_text_list  # Include relevant input text
        }

    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='localhost', port=5173, debug=True)
