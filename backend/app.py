from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Brent Oil Change Point API is running!'

@app.route('/api/log-returns')
def get_log_returns():
    df = pd.read_csv('data/log_returns_mu.csv')
    data = df.to_dict(orient='records')
    return jsonify(data)

@app.route('/api/change-point-summary')
def get_cp_summary():
    with open('data/change_point_summary.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)