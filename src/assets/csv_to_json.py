import csv
import json
import os


with open('/Users/TommyTan/Downloads/Random Projects/message_analysis/csv/all_messages.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    data = [row for row in reader]

with open('output.json', 'w') as jsonfile:
    json.dump(data, jsonfile)