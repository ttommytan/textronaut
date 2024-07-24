from flask import Flask, jsonify, request, url_for, render_template_string, current_app
from flask import g
from flask_cors import CORS
import json
import os
import pandas as pd
from db_to_csv import db_to_csv, vcf_to_dict
from create_chart_data import create_chart_data, clean_df, create_personal_chart_data, wordCloud
from io import BytesIO

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize df attribute
    app.df = None
    
    # Your other configurations and route imports go here
    
    return app

app = create_app()
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['JSON_FOLDER'] = 'json'
app.config['CSV_FOLDER'] = 'csv'


if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("json"):
    os.makedirs("json")
if not os.path.exists("csv"):
    os.makedirs("csv")


@app.route("/", methods=["GET"])
def process():
    #json_file = "/Users/TommyTan/react-app/all_chart_data.json"
    #with open(json_file, 'r') as f:
        #data = json.load(f)
        #return jsonify(data)    
    try:
        names_map = current_app.config.get('NAMES')
        df = current_app.config.get('DATAFRAME')
        all_chart_data = create_chart_data(df, names_map)
        print('still trying')
        # Return the data as JSON

        file_path =  "wheresthenan.json"
        with open(file_path, 'w') as outfile:
            json.dump(all_chart_data, outfile, indent=2)
        return jsonify(all_chart_data)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/charts", methods=["GET"])
def process2():
    try:
        df = current_app.config.get('DATAFRAME')
        print('trying')
        # Call your function to create chart data
        all_chart_data = {
            'word_cloud': wordCloud(df)
        }
        # Return the data as JSON
        return jsonify(all_chart_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
"""
@app.route("/", methods=["GET"])
def process():
    json_file = ""
    #if os.listdir(app.config['JSON_FOLDER']):
     #   json_file = os.listdir(app.config['JSON_FOLDER'][0])
    json_file = "/Users/TommyTan/react-app/all_chart_data.json"
    try:
        if os.path.exists(json_file):
            with open(json_file, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON file"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

"""
@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        response = jsonify({
            "message": 'No file part in the request',
            'status': 'failed',
        })
        response.status_code = 400
        return response
    
    file = request.files['file']
    if file.filename == '':
        response = jsonify({
            "message": 'No selected file',
            'status': 'failed',
        })
        response.status_code = 400
        return response
    
    if file:
        # Save the file or process it as needed
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        response = jsonify({
            'message': 'File successfully uploaded',
            'status': 'success',
        })
        file_content = BytesIO(file.read())
    
        # Pass the BytesIO object to db_to_csv
        df = db_to_csv(file_path)
        cleaned = clean_df(df)
        current_app.config['DATAFRAME'] = cleaned
        print("DataFrame successfully set in current_app.config")
        return response

@app.route("/upload/contacts", methods=["POST"])
def upload_contacts():
    if 'file' not in request.files:
        response = "no contacts file"
        response.status_code = 400
        current_app.config['NAMES'] = ""
        return response
    
    file = request.files['file']
    if file.filename == '':
        response = "no contacts file"
        response.status_code = 400
        current_app.config['NAMES'] = ""
        return response
    
    if file:
        # Save the file or process it as needed
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        response = jsonify({
            'message': 'File successfully uploaded',
            'status': 'success',
        })
        #file_content = BytesIO(file.read())
    
        # Pass the BytesIO object to db_to_csv
        dict = vcf_to_dict(file_path)
        current_app.config['NAMES'] = dict
        print("Name Map successfully set in current_app.config")
        return response
'''
@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        file_content = io.BytesIO(file.read())
        result = db_to_csv(file_content)
        
        if isinstance(result, str):  # If an error occurred
            return jsonify({"error": result}), 400
        
        return jsonify({
            'message': 'File successfully uploaded and processed',
            'status': 'success',
        })
'''
import traceback

@app.route("/phone-number/<number>", methods=["GET"])
def phone_detail(number):
    json_file = ""
    #if os.listdir(app.config['JSON_FOLDER']):
     #   json_file = os.listdir(app.config['JSON_FOLDER'][0])
    json_file = "/Users/TommyTan/react-app/all_chart_data.json"
    try:
        df = current_app.config.get('DATAFRAME')
        if df is None:
            raise Exception("DataFrame not found in current_app.config")
        all_chart_data = create_personal_chart_data(df,number)
        #all_chart_data = create_personal_chart_data(df,number)
        
        # Return the data as JSON
        return jsonify(all_chart_data)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
'''
def phone_detail(number):
    try:
        # Call your function to create chart data
        all_chart_data = create_chart_data(cleaned)
        
        # Return the data as JSON
        return jsonify(all_chart_data)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
'''

    



if __name__ == "__main__":
    app.run(debug=True)
