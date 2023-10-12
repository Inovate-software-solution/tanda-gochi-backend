import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
import requests
import pandas as pd
import numpy as np
import sys
import datetime
from dotenv import load_dotenv
from sklearn.preprocessing import StandardScaler
load_dotenv()
import os

User_Id = 3089573
if len(sys.argv) > 1:
    user_id = sys.argv[1]
else:
    print("No userId provided")
    #exit(1)
    
TandaAPI = "https://my.tanda.co/api/v2"

TANDA_AUTH_TOKEN = os.getenv('TANDA_AUTH_TOKEN')
model = tf.keras.models.load_model('ML_model_for_late_prediction')

TandaRequestHeaders = {
    "Authorization": "bearer " + TANDA_AUTH_TOKEN
}

today = datetime.date.today()
tomorrow = today + datetime.timedelta(days=1)
weatherResponse = requests.get("https://api.open-meteo.com/v1/forecast?latitude=-27.4679&longitude=153.0281&daily=weathercode&timezone=auto&start_date="+tomorrow.__str__()+"&"+"end_date="+tomorrow.__str__()).json()
working_dates = tomorrow.__str__()

TandaSchedules = requests.get(TandaAPI + "/schedules?"+"user_ids="+User_Id.__str__()+"&"+"from="+working_dates+"&"+"to="+working_dates, headers=TandaRequestHeaders).json()

if len(TandaSchedules) == 0:
    sys.stdout.write("No schedules found for user")
    exit()

TandaSchedules = pd.DataFrame(TandaSchedules[0])

data = pd.DataFrame()

data["start"] = TandaSchedules["start"]
data["start"] = pd.to_datetime(data["start"], unit='s')


data["finish"] = TandaSchedules["finish"]
data["finish"] = pd.to_datetime(data["finish"], unit='s')

data["Date"] = data["start"].dt.date
data['Month'] = data['start'].dt.month
data['Day_of_Week'] = data["start"].dt.dayofweek
data['Is_Weekend'] = data['Day_of_Week'].apply(lambda x: 1 if x >= 5 else 0)

data["Rostered Start"] = data["start"].dt.time
data["Rostered Finish"] = data["finish"].dt.time
data['Rostered_Shift_Duration'] = (data['finish']- data['start']).dt.total_seconds() / 60

# Extract hour and minute from the time columns
for col in ['Rostered Start', 'Rostered Finish']:
    data[col + '_hour'] = pd.to_datetime(data["start"]).dt.hour
    data[col + '_minute'] = pd.to_datetime(data["start"]).dt.minute
    
data["Weather"] = weatherResponse["daily"]["weathercode"][0]
data.drop(['start', 'finish',"Rostered Start","Rostered Finish"], axis=1, inplace=True)

numeric_features = ['Rostered Start_hour', 'Rostered Start_minute', 'Rostered Finish_hour', 'Rostered Finish_minute', 'Rostered_Shift_Duration', 'Day_of_Week', 'Is_Weekend', 'Month']
scaler = StandardScaler()
data[numeric_features] = scaler.fit_transform(data[numeric_features])

pred = model.predict({
        'weather_input': data['Weather'],
        'numeric_input': data[numeric_features]
    })
sys.stdout.write(str(pred[0][0]))
