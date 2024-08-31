from flask import Flask, jsonify, request, url_for, render_template_string, current_app
from flask import g
from flask_cors import CORS
import json
import os
import pandas as pd
from db_to_csv import db_to_csv, vcf_to_dict
from create_chart_data import create_chart_data, clean_df, create_personal_chart_data, wordCloud, create_popup_data
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

    try:
        names_map = current_app.config.get('NAMES')
        df = current_app.config.get('DATAFRAME')
        all_chart_data = create_chart_data(df, names_map)

        return jsonify(all_chart_data)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/popup", methods=["GET"])
def process2():
    try:
        names_map = current_app.config.get('NAMES')
        df = current_app.config.get('DATAFRAME')
        # Call your function to create chart data
        popup_data = {
            'popup_data': create_popup_data(df, names_map)
        }
        # Return the data as JSON

        file_path =  "popup_data.json"
        with open(file_path, 'w') as outfile:
            json.dump(popup_data, outfile, indent=2)
        return jsonify(popup_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/upload", methods=["POST"])
def upload_files():
    response = {"message": "", "status": "success"}

    # Handle contacts file
    if 'contacts' in request.files:
        contacts_file = request.files['contacts']
        if contacts_file.filename != '':
            contacts_path = os.path.join(app.config['UPLOAD_FOLDER'], contacts_file.filename)
            contacts_file.save(contacts_path)
            dict = vcf_to_dict(contacts_path)
            os.remove(contacts_path)
            current_app.config['NAMES'] = dict
            response["contacts_message"] = "Contacts file successfully processed"
        else:
            response["contacts_message"] = "No contacts file selected"
    else:
        response["contacts_message"] = "No contacts file provided"
        current_app.config['NAMES'] = ""

    # Handle messages database file
    if 'messages' in request.files:
        messages_file = request.files['messages']
        if messages_file.filename != '':
            messages_path = os.path.join(app.config['UPLOAD_FOLDER'], messages_file.filename)
            messages_file.save(messages_path)
            df = db_to_csv(messages_path)
            cleaned = clean_df(df)
            os.remove(messages_path)
            current_app.config['DATAFRAME'] = cleaned
            response["messages_message"] = "Messages file successfully processed"
        else:
            response["messages_message"] = "No messages file selected"
            response["status"] = "failed"
    else:
        response["messages_message"] = "No messages file provided"
        response["status"] = "failed"

    return jsonify(response), 200 if response["status"] == "success" else 400


@app.route("/phone-number/<number>", methods=["GET"])
def phone_detail(number):
    try:
        names_map = current_app.config.get('NAMES')
        df = current_app.config.get('DATAFRAME')
        if df is None:
            raise Exception("DataFrame not found in current_app.config")
        print('attempting personal chart')
        all_chart_data = create_personal_chart_data(df,number, names_map)
        print('personal chart worked')
        #all_chart_data = create_personal_chart_data(df,number)
        
        # Return the data as JSON
        return jsonify(all_chart_data)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 500
    except Exception as e:
        print("hwahhahhahht")
        return jsonify({"error": str(e)}), 500


    



if __name__ == "__main__":
    app.run(debug=True)
