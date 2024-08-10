# Import the dependencies.


import numpy as np
import pandas as pd
import datetime as dt
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#################################################
# Datab Loading
#################################################
temperature_url="/Users/zahra/Bootcamp/Project_4_USA_Glaciers/Resources/Monthly_Avg_Temp_1990_2024.csv"
temperature_df = pd.read_csv(temperature_url)  

glasier_url="/Users/zahra/Bootcamp/Project_4_USA_Glaciers/Resources/us_glaciers_data_1.csv"
glacier_df = pd.read_csv(glasier_url)  

#################################################
# Flask Setup
#################################################

#Data route

@app.route("/")
def home():
    return ("Welcome to the 'Glacier Data Analysis' page!:<br/>"  # Corrected typo
            f"Available Routes:<br/>"
            f"/api/v1.0/glacier_data <br/>"    
            f"/api/v1.0/Temperature_data <br/>"
            )

@app.route("/api/v1.0/glacier_data")
def glacier_data():
    try:
        print("Server received request for 'glacier_data' page...")
        # Convert DataFrame to JSON 
        print(type(glacier_df)) 
        glacier_data_json = glacier_df.to_json(orient='records')
        glacier_data= json.loads(glacier_data_json )
        #print(glacier_data_json)
        return jsonify(glacier_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return JSON error with 500 status code


@app.route("/api/v1.0/Temperature_data")
def temp_data():
    try:
        print("Server received request for 'Temp_data' page...")
        # Convert DataFrame to JSON (consider orient='records' for a list of dictionaries)
        temp_data_json = temperature_df.to_json(orient='records')
        return jsonify(temp_data_json)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return JSON error with 500 status code


if __name__ == "__main__":
    app.run(debug=True)