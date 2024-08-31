# cython: language_level=3
import string
from db_to_csv import db_to_csv, vcf_to_dict
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import random
from textblob import TextBlob
from datetime import datetime
import matplotlib.dates as mdates
from collections import defaultdict, Counter
#from nltk.tokenize import word_tokenize
#from sklearn.preprocessing import MinMaxScaler
import emoji
import re
import json
import os
import time
import plistlib
import ast
import pickle
#import nltk
import sys


def count_emojis(text):
    emojis = emoji.emoji_list(text)
    return len(emojis)
def repeating_letters(word):
    double_letter_words = "double_letter_words.csv"
    double_letter_words_list = pd.read_csv(double_letter_words)['Word']
    for a in double_letter_words_list:
      if word == a:
        return 0
    for i in range(len(word)):
        if i <= len(word) - 2:
            if word[i] == word[i+1]:
                return 1
        if i == len(word) -1:
            return 0
    return 0
def repeating_letters3(word):
    for i in range(len(word)):
        if i <= len(word) - 3:
            if word[i] == word[i+1] == word[i+2]:
                return 1
        if i == len(word) - 2:
            return 0
    return 0
def df_to_json(df1,path_name):
  first = df1.columns[0]
  df1.rename(columns = {first:"index"}, inplace = True)
  if df1['index'][0] and isinstance(df1['index'][0], pd.Timestamp):
    df1['index'] = df1['index'].dt.strftime('%Y-%m-%d')
  if df1['index'][0] and isinstance(df1.index, pd.DatetimeIndex):
        df1 = df1.reset_index()
        df1['index'] = df1['index'].dt.strftime('%Y-%m-%d')

  df1 = df1.fillna(0)
  columns = df1.columns[1:].to_list()
  data_list = df1.to_dict('records')

  final_data = {
      "columns": columns,
      "chartData": data_list
  }
     
  '''  # Write to JSON file
  print("should be creating json")
  with open(path_name, 'w') as outfile:
      json.dump(final_data, outfile, indent=2)

  '''
  return final_data   

def df_to_json2(df1,path_name, labels):
  
  first = df1.columns[0]
  df1.rename(columns = {first:"index"}, inplace = True)
  if isinstance(df1['index'][0], pd.Timestamp):
    df1['index'] = df1['index'].dt.strftime('%Y-%m-%d')
  if isinstance(df1.index, pd.DatetimeIndex):
        df1 = df1.reset_index()
        df1['index'] = df1['index'].dt.strftime('%Y-%m-%d')

  df1 = df1.fillna(0)
  columns = df1.columns[1:].to_list()
  data_list = df1.to_dict('records')

  final_data = {
      "columns": columns,
      "chartData": data_list,
      "labels": labels,
  }
     
  '''  # Write to JSON file
  print("should be creating json")
  with open(path_name, 'w') as outfile:
      json.dump(final_data, outfile, indent=2)
  print('careateaedad')
  '''
  return final_data    
def emojis(df1):

    #make sure df1 has only 
    only = df1
    myself = only[only['From_Me'] == 1]
    other = only[only['From_Me'] == 0]
    myself_emojis = myself.groupby('MY')['Emojis'].sum().reset_index()
    other_emojis = other.groupby('MY')['Emojis'].sum().reset_index()

    both = myself_emojis.merge(other_emojis, on='MY', how='outer')
    new_names = {
        both.columns[1]: 'You',
        both.columns[2]: 'Them',
    }
    both = both.rename(columns = new_names)
    both.fillna(0)
    x_axis = 'Date'
    y_axis = 'Number of Messages'
    title = 'Number of Emojis per Month'
    labels = {
        "x_axis": x_axis,
        "y_axis":  y_axis,
        "title": title
    }
    return df_to_json2(both,"emojis.json", labels)

def repeat_letters3(df1):
    myself = df1[df1['From_Me'] == 1]
    other = df1[df1['From_Me'] == 0]
    myself['Repeating_Letters3'] = myself['Message'].apply(lambda x: repeating_letters3(x))
    other['Repeating_Letters3'] = other['Message'].apply(lambda x: repeating_letters3(x))

    myself_monthly_doubles = myself.groupby('MY')['Repeating_Letters3'].sum().reset_index()
    other_monthly_doubles = other.groupby('MY')['Repeating_Letters3'].sum().reset_index()

    both_df = myself_monthly_doubles[['MY','Repeating_Letters3']].copy()
    other_df = other_monthly_doubles[['MY','Repeating_Letters3']].copy()
    both_df = both_df.merge(other_df, on='MY', how='outer')
    both_df.fillna(0)
    new_names = {
        both_df.columns[1]: 'You',
        both_df.columns[2]: 'Them',
    }
    both_df = both_df.rename(columns = new_names)
    x_axis = 'Date'
    y_axis = 'Number of Messages'
    title = 'Number of Messages With 3+ Repeating Letters per Month'
    labels = {
        "x_axis": x_axis,
        "y_axis":  y_axis,
        "title": title
    }
    return df_to_json2(both_df,"db3_letters.json", labels)
def repeat_letters(df1):
    print(df1.head())
    myself = df1[df1['From_Me'] == 1]
    other = df1[df1['From_Me'] == 0]
    myself['Repeating_Letters'] = myself['Message'].apply(lambda x: repeating_letters(x))
    other['Repeating_Letters'] = other['Message'].apply(lambda x: repeating_letters(x))

    myself_monthly_doubles = myself.groupby('MY')['Repeating_Letters'].sum().reset_index()
    other_monthly_doubles = other.groupby('MY')['Repeating_Letters'].sum().reset_index()
    both_df = myself_monthly_doubles[['MY','Repeating_Letters']].copy()
    other_df = other_monthly_doubles[['MY','Repeating_Letters']].copy()
    both_df = both_df.merge(other_df, on='MY', how='outer')
    both_df.fillna(0)
    x_axis = 'Date'
    y_axis = 'Number of Messages'
    title = 'Number of Messages With 2+ Repeating Letters per Month'
    labels = {
        "x_axis": x_axis,
        "y_axis":  y_axis,
        "title": title
    }
    print('both df')
    print(both_df)
    return df_to_json2(both_df,"db2_letters.json", labels)
def double_text(df1):
    df1['Double_Text'] = 0
    df1.reset_index(drop=True, inplace=True)
    my_dt = 0
    so_dt = 0
    word_n_time = []
    for i in range(1,len(df1)):
        if df1['From_Me'].iloc[i-1] == df1['From_Me'].iloc[i]:
            if(df1['Time_Elapsed'].iloc[i] > 30):
                df1.loc[i,'Double_Text'] = 1
            if df1['From_Me'].iloc[i] == 1:
                my_dt += 1
            else:
                so_dt += 1
        else:
            if(df1['Time_Elapsed'].iloc[i] >30):
                point = {"x": int(df1['Num_of_Words'].iloc[i]), "y": int(df1['Time_Elapsed'].iloc[i])}
                word_n_time.append(point)
    me_doubletext_df = df1[df1['From_Me'] == 1].groupby('MY')['Double_Text'].sum().reset_index()
    other_doubletext_df = df1[df1['From_Me'] == 0].groupby('MY')['Double_Text'].sum().reset_index()

    both_df = me_doubletext_df.merge(other_doubletext_df, on='MY', how='outer')
    both_df = both_df.reset_index(drop=True) 
    both_df = both_df.fillna(0)

    me_doubletext_df_hr = df1[df1['From_Me'] == 1].groupby('Rounded')['Double_Text'].sum().reset_index()
    other_doubletext_df_hr = df1[df1['From_Me'] == 0].groupby('Rounded')['Double_Text'].sum().reset_index()

    both_df2 = me_doubletext_df_hr.merge(other_doubletext_df_hr, on='Rounded', how='outer')
    both_df2 = both_df2.reset_index(drop=True)
    both_df2 = both_df2.fillna(0)

    new_names = {
        both_df2.columns[1]: 'You',
        both_df2.columns[2]: 'Them',
    }
    both_df2 = both_df2.rename(columns = new_names)
    x_axis = 'Date'
    y_axis = 'Number of Double Texts'
    title = 'Number of Double Texts per Month'
    labels = {
        "x_axis": x_axis,
        "y_axis":  y_axis,
        "title": title
    }
    x_axis2 = 'Hour'
    title2 = 'Number of Double Texts By Hour'
    labels2 = {
        "x_axis": x_axis2,
        "y_axis": y_axis,
        "title": title2,
    }
    me_total_double_text = me_doubletext_df_hr['Double_Text'].sum()
    other_total_double_text = other_doubletext_df_hr['Double_Text'].sum()
    
    return [df_to_json2(both_df,"double_text.json", labels),df_to_json2(both_df2,"double_text_hr.json",labels2), word_n_time,me_total_double_text,other_total_double_text, me_total_double_text+other_total_double_text]

def double_text_hr(df1):
    df1['Double_Text'] = 0
    df1.reset_index(drop=True, inplace=True)
    my_dt = 0
    so_dt = 0
    for i in range(1,len(df1)):
        if df1['From_Me'].iloc[i-1] == df1['From_Me'].iloc[i]:
            if(df1['Time_Elapsed'].iloc[i] > 30):
                df1.loc[i,'Double_Text'] = 1
            if df1['From_Me'].iloc[i] == 1:
                my_dt += 1
            else:
                so_dt += 1

    me_doubletext_df_hr = df1[df1['From_Me'] == 1].groupby('Rounded')['Double_Text'].sum().reset_index()
    other_doubletext_df_hr = df1[df1['From_Me'] == 0].groupby('Rounded')['Double_Text'].sum().reset_index()

    both_df2 = me_doubletext_df_hr.merge(other_doubletext_df_hr, on='Rounded', how='outer')
    both_df2 = both_df2.reset_index(drop=True)
    both_df2 = both_df2.fillna(0)
    new_names = {
        both_df2.columns[1]: 'You',
        both_df2.columns[2]: 'Them',
    }
    both_df2 = both_df2.rename(columns = new_names)
    return df_to_json(both_df2,"double_text_hr.json")
#Overall Stats
#All texts each month
def wordCloud(df):
    stop_words =  {}
    valid_words = {}
    with open('flask-server/stop_words.pkl', 'rb') as file:
        stop_words = pickle.load(file)
    with open('flask-server/valid_words.pkl', 'rb') as file:
        valid_words = pickle.load(file)
    words = []
    
    for line in df['Message']:
        #stop_words = set(stopwords.words('english'))
        #word_tokens = word_tokenize(line)
        word_tokens = line.lower().translate(str.maketrans('', '', string.punctuation)).split()
        for word in word_tokens:
            if word not in stop_words and word.isalpha():
                words.append(word.lower())



    freq_map = defaultdict(int)
    for w in words:
    #for w in words:
        freq_map[w] += 1

    unique_word_count = 0
    if (df['From_Me'] == 1).all():
        #valid_words = set(nltk_words.words())
        valid_words_check = [w for w in list(freq_map.keys()) if w in valid_words]
        unique_word_count = len(valid_words_check)
    # Sort word_list by 'value' in descending order and take only the first 100 words
    sorted_word_list = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)[:75]
    word_list = [{'text': word, 'value': freq} for word, freq in sorted_word_list]
    top_five_words = word_list[:5]
    return [word_list, top_five_words, unique_word_count]


def sentiment_analysis(df):
    not_me = 0
    names = False
    if (df['From_Me'] == 0).all():
        not_me = 1
    if 'Name' in df.columns:
        names = True
    sentence_sentiments = []
    date = []
    for i, sentence in enumerate(df['Message']):
        sentiment = TextBlob(sentence).sentiment.polarity
        sentence_sentiments.append(sentiment)
        date.append(df['MYD'].iloc[i])

    # Create DataFrame with sentiment and date columns
    if names:
        df_sentiment = pd.DataFrame({
            'Date': [d.strftime('%Y-%m-%d')  for d in date],
            'Polarity': sentence_sentiments,
            "Message": df['Message'],
            "Name": df['Name'],
            
        })
    else:
        df_sentiment = pd.DataFrame({
            'Date': [d.strftime('%Y-%m-%d')  for d in date],
            'Polarity': sentence_sentiments,
            "Message": df['Message'],
            "Number": df['Number'],
        })
    #sentence_sentiments = sentence_sentiments[::-1]
    
    mean_sentiment = df_sentiment['Polarity'].mean()
    skewed_meansentiment = df_sentiment[df_sentiment['Polarity'] != 0.0]['Polarity'].mean()
    # Calculate rolling average of sentiment with a window of 3 sentences
    df_sentiment['RollingAvg'] = df_sentiment['Polarity'].rolling(window=500).mean()
    df_sentiment = df_sentiment.rdf_sentiment = df_sentiment.reset_index(drop = True) 


    if not_me:
        high_sentiment_df = df_sentiment[ ((df_sentiment['Polarity'] > 0.5) | (df_sentiment['Polarity'] < -0.5)) & (df_sentiment['Message'].apply(lambda x: len(x.split())) > 13)]
        if not len(high_sentiment_df) or len(high_sentiment_df) < 5:
            return [df_sentiment, mean_sentiment, []]
        shuffled_df = high_sentiment_df.sample(frac=1).reset_index(drop=True)
        if names:
            shuffled_df = shuffled_df[['Name', 'Message']]
            shuffled_df = shuffled_df[shuffled_df['Name'] != 'Unknown']
        else:
            shuffled_df = shuffled_df[['Number', 'Message']]

        data_list = shuffled_df.to_dict('records')
        return [df_sentiment, mean_sentiment, data_list]
        
    return [df_sentiment, mean_sentiment]

def sentiment_analysis_by_date(df):
    start = time.perf_counter()
    df_sentiment_dates = df.groupby('index')['Polarity'].mean().reset_index()
    all_df_json = []

    for i in range(1, 31):
        temp_df = pd.DataFrame()
        temp_df['index'] = df_sentiment_dates['index']
        temp_df[f'RollingAvg{i}'] = df_sentiment_dates['Polarity'].rolling(window=i).mean()
        all_df_json.append(df_to_json(temp_df,"temp_df.json"))

    for i in range(40, 101, 5):
        temp_df = pd.DataFrame()
        temp_df['index'] = df_sentiment_dates['index']
        temp_df[f'RollingAvg{i}'] = df_sentiment_dates['Polarity'].rolling(window=i).mean()
        all_df_json.append(df_to_json(temp_df,"temp_df.json"))
    end = time.perf_counter()
    elapsed = end - start
    print(f'a lot of rolling avgs took: {elapsed:.6f} seconds')
    return all_df_json
    
def monthly_texts (df):
    df = df[~df['Number'].str.contains('chat', na=False)]
    myself = df[df['From_Me'] == 1]
    other = df[df['From_Me'] == 0]

    myself_monthly = myself.groupby('MY').count()
    other_monthly = other.groupby('MY').count()

    myself_monthly.drop(myself_monthly.tail(1).index, inplace=True)
    other_monthly.drop(other_monthly.tail(1).index, inplace=True)

    myself_monthly.index = pd.to_datetime(myself_monthly.index, format='%Y-%m')
    other_monthly.index = pd.to_datetime(other_monthly.index, format='%Y-%m')

    df1 = myself_monthly[['Message']]
    df2 = other_monthly[['Message']]
    df1.index = df1.index.strftime('%m-%y')
    df2.index = df2.index.strftime('%m-%y')
    #df1.to_json('myself_monthly.json', index=True)
    #df2.to_json('other_monthly.json', index=True)

    df1 = myself_monthly[['Message']]
    df2 = other_monthly[['Message']]
    df1.index = df1.index.strftime('%m-%y')
    df2.index = df2.index.strftime('%m-%y')
    #df1.to_json('myself_monthly.json', index=True)
    #df2.to_json('other_monthly.json', index=True)

    df1 = df1.merge(df2, on='MY', how='outer')
    df1 = df1[['Message_x','Message_y']]
    df1 = df1.rename(columns={'Message_x': 'You', 'Message_y': 'Them'})
    df1 = df1.reset_index()
    df1.head()
    df1 = df1.fillna(0)
    x_axis = 'Date'
    y_axis = 'Number of Messages'
    title = 'Number of Messages per Month'
    labels = {
        "x_axis": x_axis,
        "y_axis":  y_axis,
        "title": title
    }
    return df_to_json2(df1, "monthly_texts.json", labels)
#Number of texts for each day of the week
def days_of_week_texts (df):
    myself = df[df['From_Me'] == 1]
    other = df[df['From_Me'] == 0]
    myself_monthly = myself.groupby('MY').count()
    other_monthly = other.groupby('MY').count()

    myself_monthly.drop(myself_monthly.tail(1).index, inplace=True)
    other_monthly.drop(other_monthly.tail(1).index, inplace=True)

    myself_monthly.index = pd.to_datetime(myself_monthly.index, format='%Y-%m')
    other_monthly.index = pd.to_datetime(other_monthly.index, format='%Y-%m')


    myself_days = [0,0,0,0,0,0,0]
    other_days = [0,0,0,0,0,0,0]

    for Tday in myself['MYD']:
        Tweekday = Tday.weekday()
        if not pd.isna(Tweekday):
            myself_days[Tweekday] += 1

    for kday in other['MYD']:
        kweekday = kday.weekday()
        if not pd.isna(kweekday):
            other_days[kweekday] += 1

    weekdays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

    # Create the DataFrame
    day_df = pd.DataFrame({
        'Day': weekdays,
        'You': myself_days,
        'Them': other_days
    })
    active_day = weekdays[myself_days.index(max(myself_days))]
    return [df_to_json(day_df, "days.json"), active_day]
#Time function
def timer(func, df):
    start = time.perf_counter()
    result = func(df)
    end = time.perf_counter()
    elapsed = end - start
    print(f'{func} took: {elapsed:.6f} seconds')
    return(result)
#Top 10 people who you text the most
def top10_texters(df, names):
    if names:
        selff = df[df['From_Me'] == 1]
        people = selff.groupby('Name').agg({
            'Number': lambda x: x.iloc[0],  # Retain the first 'Number' for each 'Name'
            'From_Me': 'count'              # Count occurrences of each 'Name'
        }).rename(columns={'From_Me': 'Message_Count'}).sort_values(by='Message_Count', ascending=False)

        top10_list = []

        # Iterate through 'people' DataFrame and populate 'top10_list'
        for name, row in people.iterrows():
            top10_list.append({'number': row['Number'], 'messages': row['Message_Count'], 'name': name})
        top10_df = pd.DataFrame(top10_list)

        return [df_to_json(top10_df, "top10.json"), top10_df]
    else:
        selff = df[df['From_Me'] == 1]
        people = selff['Number'].value_counts()
        all_contacts_df = pd.DataFrame({'number': people.index, 'messages': people.values})
        people = people.head(10)
        #people = people.sample(frac=1, random_state=None)
        top10_df = pd.DataFrame({'number': people.index, 'messages': people.values})
        
        return [df_to_json(top10_df, "top10.json"), all_contacts_df]
#day n hour is for the bubble graph

def day_n_hour(df):
    try:
        # Desired order of weekdays
        desired_order = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
        
        # Ensure every hour from 0 to 23 is included for each weekday
        all_hours = pd.MultiIndex.from_product([desired_order, range(24)], names=['WeekDay', 'Rounded'])
        
        # Group by 'WeekDay' and 'Rounded' and count occurrences
        hours = df.groupby(['WeekDay', 'Rounded']).count()
        hours = hours[['Number']]
        
        # Reindex to ensure all days and hours are included, filling missing values with 0
        hours = hours.reindex(all_hours, fill_value=0)
        hours = hours.unstack(level='Rounded', fill_value=0)
        hours = hours.reindex(desired_order)
        

        def keep_top_five(row):
            top_five = row.nlargest(5).index  # Get indices of top 5 values
            result = pd.Series(0, index=row.index)  # Initialize all values to 0
            result[top_five] = row[top_five]  # Set top 5 values to their original values
            return result

        # Apply function row-wise
        hours = hours.apply(keep_top_five, axis=1)
        max_hours = hours.max().max()
        multiplier = max_hours / 14
        datasets = []
        

        for rounded in range(24):  # Ensure we iterate over 24 hours
            dataset = {
                'label': f'Hour {rounded}',
                'data': [],
                'backgroundColor': 'rgba(64, 168, 243, 0.6)',  #rgba(155, 208, 245, 0.6
                'hoverBackgroundColor': '#b4d9f4',
            }
            for weekday in desired_order:
                value = hours.loc[weekday, ('Number', rounded)]
                radius = int(round(value / multiplier))
                dataset['data'].append({
                    'x': weekday,  # Weekday as x-coordinate
                    'y': rounded,  # Rounded hour as y-coordinate
                    'r': radius
                })
            datasets.append(dataset)

        x_axis = 'Weekday'
        y_axis = 'Hour of the Day'
        title = 'Number of Messages per Hour/Day'
        labels = {
            "x_axis": x_axis,
            "y_axis":  y_axis,
            "title": title
        }
        
        final_dataset = {
            "datasets": datasets,
            "labels": labels,
            "multiplier": multiplier,
        }

        return final_dataset

    except Exception as e:
        print(f"Error in day_n_hour: {str(e)}")
        raise

def avg_stat_comparison(df, names):
    top10_df = top10_texters(df, names)[1]
    top10_df = top10_df.dropna()
    numbers = []
    name = []
    avg_sentiments = []
    avg_response_times = []
    avg_text_lengths = []
    if(len(top10_df)>=5):
        if names:
            for i in range (0,5):
                number = top10_df['index'].iloc[i]
                numbers.append(number)
                name.append(top10_df['name'].iloc[i])
                only = df[df['Number'] == number].copy()
                only.dropna(inplace=True)
                only['Emojis'] = only['Message'].apply(count_emojis)
                only['Num_of_Words'] = only['Message'].apply(lambda x: len(x.split()))
                only['Time_Elapsed'] = 0
                only.reset_index(drop=True, inplace=True)
                for i in range(1,len(only)):
                    only.loc[i,'Time_Elapsed'] = (only['Date'].iloc[i] - only['Date'].iloc[i-1]).seconds/60
                myself = only[only['From_Me'] == 1]
                other = only[only['From_Me'] == 0]

                #avg stats

                avg_sentiments.append(sentiment_analysis(only)[1])
                avg_response_times.append(only['Time_Elapsed'].mean())
                avg_text_lengths.append(only['Num_of_Words'].mean())
                max_time = max(avg_response_times) * 1.2

            max_length = max(avg_text_lengths) * 1.2
            avg_sentiments = [x +.5 for x in avg_sentiments]
            avg_response_times = [x/max_time for x in avg_response_times]
            avg_text_lengths = [x/max_length for x in avg_text_lengths]


            dataset = []
            categories = ['avg_sentiment', 'avg_response_time', 'avg_text_lengths']
            stats = [avg_sentiments, avg_response_times, avg_text_lengths]
            

            #for stat in stats:
            #   stat = ln(stat)
            for i in range(0, len(numbers)):
                person = []
                for j in range(0,len(categories)):
                    person.append(stats[j][i])
                data = {
                    "label": name[i],
                    "data": person,
                }
                dataset.append(data)
            final_data = {
                "columns": categories,
                "chartData": dataset,
            }
            """
            avg_stats = []
            for i in range(0, len(categories)):
                to_add = {
                    "index": categories[i],
                    numbers[0]: stats[i][0],
                    numbers[1]: stats[i][1],
                    numbers[2]: stats[i][2],
                    numbers[3]: stats[i][3],
                    numbers[4]: stats[i][4],
                }
                avg_stats.append(to_add)

            final_data = {
                "columns": numbers,
                "chartData": avg_stats,
            }"""
            return final_data
        else:
            for i in range (0,5):
                number = top10_df['number'].iloc[i]
                numbers.append(number)
                only = df[df['Number'] == number].copy()
                only.dropna(inplace=True)
                only['Emojis'] = only['Message'].apply(count_emojis)
                only['Num_of_Words'] = only['Message'].apply(lambda x: len(x.split()))
                only['Time_Elapsed'] = 0
                only.reset_index(drop=True, inplace=True)
                for i in range(1,len(only)):
                    only.loc[i,'Time_Elapsed'] = (only['Date'].iloc[i] - only['Date'].iloc[i-1]).seconds/60
                myself = only[only['From_Me'] == 1]
                other = only[only['From_Me'] == 0]

                #avg stats
                avg_sentiments.append(sentiment_analysis(only)[1])
                avg_response_times.append(only['Time_Elapsed'].mean())
                avg_text_lengths.append(only['Num_of_Words'].mean())

            max_time = max(avg_response_times) * 1.2
            max_length = max(avg_text_lengths) * 1.2
            avg_sentiments = [x +.5 for x in avg_sentiments]
            avg_response_times = [x/max_time for x in avg_response_times]
            avg_text_lengths = [x/max_length for x in avg_text_lengths]


            dataset = []
            categories = ['avg_sentiment', 'avg_response_time', 'avg_text_lengths']
            stats = [avg_sentiments, avg_response_times, avg_text_lengths]
            

            #for stat in stats:
            #   stat = ln(stat)
            for i in range(0, len(numbers)):
                person = []
                for j in range(0,len(categories)):
                    person.append(stats[j][i])
                data = {
                    "label": numbers[i],
                    "data": person,
                }
                dataset.append(data)
            final_data = {
                "columns": categories,
                "chartData": dataset,
            }
            """
            avg_stats = []
            for i in range(0, len(categories)):
                to_add = {
                    "index": categories[i],
                    numbers[0]: stats[i][0],
                    numbers[1]: stats[i][1],
                    numbers[2]: stats[i][2],
                    numbers[3]: stats[i][3],
                    numbers[4]: stats[i][4],
                }
                avg_stats.append(to_add)

            final_data = {
                "columns": numbers,
                "chartData": avg_stats,
            }"""
            return final_data


def recap_stats(df, is_name, top5):
    if is_name:
        numbers = df.groupby(['Name','Rounded'])['Message'].count().unstack(fill_value=0)
    else:
        numbers = df.groupby(['Number','Rounded'])['Message'].count().unstack(fill_value=0)

    numbers['total'] = numbers.sum(axis=1)
    numbers = numbers.sort_values(by="total", ascending=False)

    # Sum hours 20-3
    numbers['20-3'] = numbers.loc[:, list(range(20, 24)) + list(range(0, 4))].sum(axis=1)

    # Sum hours 4-11
    numbers['4-11'] = numbers.loc[:, range(4, 12)].sum(axis=1)

    # Sum hours 12-20
    numbers['12-20'] = numbers.loc[:, range(12, 21)].sum(axis=1)

    columns_to_keep = ['20-3', '4-11', '12-20', 'total']
    numbers = numbers[columns_to_keep]

    numbers.head(50)
    total_texts = numbers['total'].sum()

    numbers2 = df.groupby('Rounded')['Message'].count()
    maxhr_oftexts = numbers2.idxmax()
    max_num_of_texts = numbers2.max()

    # Define the new time periods
    time_periods = {
        'Early Morning': list(range(5, 8)) + ["🌅"],
        'Morning': list(range(8, 11)) + ['☀️'],
        'Midday': list(range(11, 14)) + ['🕛'],
        'Afternoon': list(range(14, 17)) + ["🌇"],
        'Evening': list(range(17, 20)) + ['🌆'],
        'Night': list(range(20, 23)) + ['🌃'],
        'Late Night': [23, 0, 1, '🌙'],
        'Owl Hours': [2, 3, 4, '🦉']
    }

    timeperiod = ''
    for period, hours in time_periods.items():
        if maxhr_oftexts in hours:
            timeperiod = period
    
    if(maxhr_oftexts > 12):
        maxhr_oftexts = str(int(maxhr_oftexts - 12)) + " PM"
    elif(maxhr_oftexts == 0):
        maxhr_oftexts = "12 AM"
    else:
        maxhr_oftexts = str(int(maxhr_oftexts)) + " AM"


    contact_num = len(numbers)

    max_values = numbers.max()

    # Find the corresponding index name for the greatest value in each column
    max_indices = numbers.idxmax()
   
    # Combine the column names, greatest values, and corresponding index names into a DataFrame
    greatest_values = pd.DataFrame({
        'max_value': max_values,
        'index_name': max_indices
    })

    # Display the result
    greatest_values.head()
    day_time_stat = {
        "morning": [int(greatest_values['max_value'].iloc[0]), (greatest_values['index_name'].iloc[0])],
        "afternoon": [int(greatest_values['max_value'].iloc[1]), (greatest_values['index_name'].iloc[1])],
        "night": [int(greatest_values['max_value'].iloc[2]), (greatest_values['index_name'].iloc[2])],
        "number1": [int(greatest_values['max_value'].iloc[3]), (greatest_values['index_name'].iloc[3])],
        "total_texts": int(total_texts),
        "num_contact": int(contact_num),
        "top5_words": top5,
        "peak_period": [timeperiod, maxhr_oftexts, time_periods[timeperiod][len(time_periods[timeperiod])-1], str(max_num_of_texts)]

    }


    return day_time_stat

#reactions and gamePigeon
def reaction_map(all, name_map):

    all = all.copy()
    message_type = {
        "2000": 0,
        "2001": 0,
        "2002": 0,
        "2003": 0,
        "2004": 0,
        "2005": 0,
        "3000s": 0,
    }
    
    
    statuses = ["You Won!", "I won!", "Draw!"]
    games = [
    "8 Ball",
    "Sea Battle",
    "Basketball",
    "Archery",
    "Word Hunt",
    "Anagrams",
    "Word Bites",
    "Darts",
    "Cup Pong",
    "Mini Golf",
    "Knockout",
    "Crazy 8",
    "Four In A Row",
    "Paintball",
    "Shuffleboard",
    "Tanks",
    "Filler",
    "Checkers",
    "Chess",
    "Mancala",
    "Dots & Boxes",
    "Gomoku",
    "Reversi",
    "9 Ball",
    "20 Questions"
]
    
    games_stat = {
    "8 Ball": [0,0,0],
    "Sea Battle": [0,0,0],
    "Basketball": [0,0,0],
    "Archery": [0,0,0],
    "Word Hunt": [0,0,0],
    "Anagrams": [0,0,0],
    "Word Bites": [0,0,0],
    "Darts": [0,0,0],
    "Cup Pong": [0,0,0],
    "Mini Golf": [0,0,0],
    "Knockout": [0,0,0],
    "Crazy 8": [0,0,0],
    "Four In A Row": [0,0,0],
    "Paintball": [0,0,0],
    "Shuffleboard": [0,0,0],
    "Tanks": [0,0,0],
    "Filler": [0,0,0],
    "Checkers": [0,0,0],
    "Chess": [0,0,0],
    "Mancala": [0,0,0],
    "Dots & Boxes": [0,0,0],
    "Gomoku": [0,0,0],
    "Reversi": [0,0,0],
    "9 Ball": [0,0,0],
    "20 Questions": [0,0,0],
}



    # Check each status in the game_status string

    
    total_wins = 0
    total_losses = 0
    total_draws = 0
    
    all_games = []  
    number_stats = {}

    for i in range(0, len(all)):
        m_type = all['Message_Type'].iloc[i]
        if m_type != 0:
            if m_type >= 3000 and m_type < 3010:
                message_type["3000s"] = message_type["3000s"] + 1
            elif m_type == 2:
                person = ''
                if name_map:
                    person = all['Name'].iloc[i]
                else:
                    person = all['Number'].iloc[i]
                
                # Initialize the person's stats if not already present

                if person not in number_stats:
                    number_stats[person] = {'games': 0, 'wins': 0}
                
                # Increment the games count for this person
                number_stats[person]['games'] += 1

                game_stat = all['Payload_Data'].iloc[i]
                
                byte_game_stat = ast.literal_eval(game_stat)
                plist_data = plistlib.loads(byte_game_stat)
                str_game_stat = ""
                for j in range(0, len(plist_data['$objects'])):
                    if isinstance(plist_data['$objects'][j], str):
                        str_game_stat += plist_data['$objects'][j]
                
                for status in statuses:
                    if status in str_game_stat:
                        if status == "You Won!":
                            if all['From_Me'].iloc[i] == 1:
                                total_losses += 1
                                for game in games:
                                    if game in str_game_stat:
                                        games_stat[game][1] += 1
                            else:
                                total_wins += 1
                                for game in games:
                                    if game in str_game_stat:
                                        games_stat[game][0] += 1
                                        number_stats[person]['wins'] += 1
                            break
                        elif status == "I won!":
                            if all['From_Me'].iloc[i] == 1:
                                total_wins += 1
                                for game in games:
                                    if game in str_game_stat:
                                        games_stat[game][0] += 1
                                        number_stats[person]['wins'] += 1
                            else:
                                total_losses += 1
                                for game in games:
                                    if game in str_game_stat:
                                        games_stat[game][1] += 1
                                break
                        else:
                            total_draws += 1
                            for game in games:
                                if game in str_game_stat:
                                    games_stat[game][2] += 1
                            break
                        
            elif m_type == 3 and all['New_Game'].iloc[i] == 0:
                #message_type[str(m_type)] = message_type[str(m_type)] + 1
                all_games.append(all['Message'].iloc[i])
            elif m_type in [2000, 2001, 2002, 2003, 2004, 2005,]:
                message_type[str(m_type)] = message_type[str(m_type)] + 1
            #probs don't need all_games
    for game in games_stat:
        games_s = games_stat[game]
        total_games = games_s[0]+games_s[1]+games_s[2]

        if games_s[2] == 0 and total_games != 0:
            games_s.append(int(round((games_s[0]/total_games),2)*100))
            games_s.append(0)
        elif total_games != 0:
            games_s.append(int(round((games_s[0]/total_games),2)*100))
            games_s.append(int(round((games_s[2]/total_games),2)*100))
    all_games = Counter(all_games)
    temp_win_loss = [
        {
        "index": "Win",
        "num": total_wins,
        },
        {
        "index": "Loss",
        "num": total_losses,
        },
        {
        "index": "Tie",
        "num": total_draws,
        }
    ]
    test_game_cols = ['num','index']
    win_loss = {
        "wlt": temp_win_loss,
        "columns": test_game_cols,
        
    }
    games_stat_sorted = dict(sorted(games_stat.items(), key = lambda item: item[1], reverse=True)[0:8])
    final_stats = {
        "all_games": all_games,
        "win_loss": win_loss,
        "games_stat": games_stat_sorted,
    }

    reaction_type = {
        "loved": message_type['2000'],
        "liked": message_type['2001'],
        "disliked": message_type['2002'],
        "laughed": message_type['2003'],
        "emphasized": message_type['2004'],
        "questioned": message_type['2005'],

    }
    reaction_type_sorted = dict(sorted(reaction_type.items(), key=lambda item: item[1], reverse=True))

    total_games_played = temp_win_loss[0]['num'] + temp_win_loss[1]['num'] + temp_win_loss[2]['num']

    return [reaction_type_sorted,final_stats]
def map_emojis(df):
    emoji_df = df[df['Emojis'] > 0]
    emoji_df = emoji_df[emoji_df['From_Me'] == 1]
    all_emojis = " ".join([a for a in emoji_df['Message']])
    all_emojis = [char for char in all_emojis if char in emoji.EMOJI_DATA]
    all_emojis = Counter(all_emojis)
    emojis_sorted = dict(sorted(all_emojis.items(), key=lambda item: item[1], reverse=True)[:8])
    print(emojis_sorted)
    return(emojis_sorted)

def first_encounter(df, names_map):
    temp_index = 'Number'
    if names_map:
        temp_index = 'Name'

    first_text = []
    second_text = []

    first_text.append(df['Message'].iloc[0])
    if df['From_Me'].iloc[0] == 1:
        first_text.append('self')
    else:
        first_text.append(df[temp_index].iloc[0])
    first_text.append(df['Date'].iloc[0].strftime('%m-%d-%y, %-I:%M %p'))

    for i in range(1, len(df['Message'])):
        if df['From_Me'].iloc[i] != df['From_Me'].iloc[0]:
            second_text.append(df['Message'].iloc[i])
            if df['From_Me'].iloc[i] == 1:
                second_text.append('self')
            else:
                second_text.append(df[temp_index].iloc[i])
            second_text.append(df['Date'].iloc[i].strftime('%m-%d-%y, %-I:%M %p'))
            break
    encounter_text = {
        "first_text": first_text,
        "second_text": second_text,
    }
    print(encounter_text)
    return encounter_text
def clean_df(dataframe):

    #orig = db_to_csv(file)
    orig = dataframe
    df = orig.copy()
    df = df.iloc[::-1]
    df['Date'] = pd.to_datetime(df['Date'])
    df['MYD'] = df['Date'].dt.date
    df['MY'] = df['Date'].dt.strftime('%Y-%m')
    df['Y'] = df['Date'].dt.strftime('%Y')
    
    df['Rounded'] = pd.to_datetime(df['Date'].round('H'))
    df['Rounded'] = df['Rounded'].apply(lambda x: x.hour)
    all = df[df['Group_Chat'].isna()]
    all = all.drop('Group_Chat', axis=1)
    all = all[~all['Number'].str.contains('chat', na=False)]
    all['Message'] = all['Message'].fillna('')
    all = all.dropna(subset=['Number'])
    all['Emojis'] = all['Message'].apply(count_emojis)
    days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
    all['WeekDay'] = all['MYD'].apply(lambda x: days[x.weekday()])
    return all

def create_popup_data(dataframe, names_map):
    all = dataframe
    if names_map:
        all['Name'] = all['Number'].map(names_map)
        all['Name'] = all['Name'].dropna()
    reaction_type = reaction_map(all, names_map)
    all = all[all['Message_Type'] == 0]
    myself = all[all['From_Me'] == 1]
    other = all[all['From_Me'] == 0]
    top10 = top10_texters(all,names_map)[0]
    daysofweek = timer(days_of_week_texts,all)
    sent_other = timer(sentiment_analysis,other)
    random_text = sent_other[2]
    all_emojis = timer(map_emojis, all)
    wordcloud_self = timer(wordCloud, myself)
    unique_word_count = wordcloud_self[2]
    recap = recap_stats(all, names_map, wordcloud_self[1])

    all_chart_data = {
        'leaderboard': top10,
        'day_of_week_texts': daysofweek[0],
        'recap_stats': recap,
        'reaction_type': reaction_type[0],
        'game_stats': reaction_type[1],
        'all_emojis': all_emojis,
        'random_text': random_text,
        'unique_word_count': unique_word_count,
    }
    directory = "json"
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = os.path.join(directory, "popup_data.json")
    with open(file_path, 'w') as outfile:
        json.dump(all_chart_data, outfile, indent=2)

    print(f"Data written to {file_path}")
    print("Done")
    return all_chart_data

def create_chart_data(dataframe, names_map):
    all = dataframe
    if names_map:
        all['Name'] = all['Number'].map(names_map)
        all['Name'] = all['Name'].fillna('Unknown')
    with_reaction_df = all.copy()
    reaction_type = reaction_map(all, names_map)
    all = all[all['Message_Type'] == 0]

    
    myself = all[all['From_Me'] == 1]
    other = all[all['From_Me'] == 0]

    top10 = top10_texters(all,names_map)[0]
    daysofweek = timer(days_of_week_texts,all)
    monthlytexts = timer(monthly_texts,all)

    
    ##below
    all_emojis = timer(map_emojis, all)
    sent_both = timer(sentiment_analysis,all)
    sent_self = timer(sentiment_analysis,myself)
    #below
    sent_other = timer(sentiment_analysis,other)
    random_text = sent_other[2]

    sent_message_both = df_to_json(sent_both[0],"sentiment.json")
    sent_message_self = df_to_json(sent_self[0],"sentiment.json")
    sent_message_other = df_to_json(sent_other[0],"sentiment.json")

    sent_both = sentiment_analysis_by_date(sent_both[0])
    sent_self = sentiment_analysis_by_date(sent_self[0])
    sent_other = sentiment_analysis_by_date(sent_other[0])

    sentiment = {
        "sentiment_both" : sent_both,
        "sentiment_self" : sent_self,
        "sentiment_other" : sent_other,
    }

    daynhour_both = timer(day_n_hour,all)
    daynhour_self = timer(day_n_hour, myself)
    daynhour_other = timer(day_n_hour, other)
    daynhour = {
        "daynhour_both" : daynhour_both,
        "daynhour_self" : daynhour_self,
        "daynhour_other" : daynhour_other,
    }
    wordcloud_both = timer(wordCloud, all)
    wordcloud_self = timer(wordCloud, myself)
    wordcloud_other = timer(wordCloud, other)
    wordcloud = {
        "wordcloud_both" : wordcloud_both[0],
        "wordcloud_self" : wordcloud_self[0],
        "wordcloud_other" : wordcloud_other[0],
    }

    unique_word_count = wordcloud_self[2]
    #avg_stats = avg_stat_comparison(all, names_map)
    recap = recap_stats(all, names_map, wordcloud_self[1])
    
    all_chart_data = {
        'leaderboard': top10,
        'day_of_week_texts': daysofweek[0],
        'most_active_day': daysofweek[1],
        'monthly_texts': monthlytexts,
        'word_cloud' : wordcloud,
        'sentiment_by_message': sent_message_both,
        'sentiment_by_date': sentiment,
        'day_n_hour': daynhour,
        #'avg_stats_comparison': avg_stats,
        'recap_stats': recap,
        'reaction_type': reaction_type[0],
        'game_stats': reaction_type[1],
        'all_emojis': all_emojis,
        'random_text': random_text,
        'unique_word_count': unique_word_count,
    }

    directory = "json"
    if not os.path.exists(directory):
        os.makedirs(directory)


    #if you would like you can download your data as a json file, but i have this disabled in my code
    '''
    file_path = os.path.join(directory, "all_chart_data.json")
    with open(file_path, 'w') as outfile:
        json.dump(all_chart_data, outfile, indent=2)

    print(f"Data written to {file_path}")
    
    '''
    print("Done")
    return all_chart_data


def create_personal_chart_data(dataframe, number, name_map):
    all = dataframe
    if name_map:
        all['Name'] = all['Number'].map(name_map)
        all['Name'] = all['Name'].fillna('Unknown')
    only = all[all['Number'] == number].copy()
    #only = only.dropna(subset=['Message'])
    # Drop the first 20 rows where 'Message' is an empty string
    only_first_20 = only.iloc[:20].replace('', float('nan')).dropna(subset=['Message'])
    only_remaining = only.iloc[20:]

    # Concatenate the two DataFrames
    only = pd.concat([only_first_20, only_remaining]).reset_index(drop=True)    
    only['Message'] = only['Message'].fillna('')
    only['Num_of_Words'] = only['Message'].apply(lambda x: len(x.split()))
    only['Time_Elapsed'] = 0
    only.reset_index(drop=True, inplace=True)
    for i in range(1,len(only)):
        only.loc[i,'Time_Elapsed'] = (only['Date'].iloc[i] - only['Date'].iloc[i-1]).seconds/60

    reaction_type = reaction_map(only, name_map)
    only = only[only['Message_Type'] == 0]
    myself = only[only['From_Me'] == 1]
    other = only[only['From_Me'] == 0]
    #finding peak activity hour
    numbers2 = only.groupby('Rounded')['Message'].count()
    numbers2.fillna(0)
    maxhr_oftexts = int(numbers2.idxmax().item())
    max_num_of_texts = int(numbers2.max().item())
    peak_text_hr ={
        "peak_hr": maxhr_oftexts,
        "max_texts": max_num_of_texts,
    }
    avg_response_time = only['Time_Elapsed'].mean()
    
    amt_myself = len(myself)
    amt_other = len(other)

    repeat = timer(repeat_letters, only)
    repeat3 = timer(repeat_letters3, only)
    monthlytexts = timer(monthly_texts, only)
    emojisvar = timer(emojis,only)
    double_texts = timer(double_text,only)

    sent_both = timer(sentiment_analysis,only)
    sent_self = timer(sentiment_analysis,myself)
    sent_other = timer(sentiment_analysis,other)

    sent_message_both = df_to_json(sent_both[0],"sentiment.json")
    sent_message_self = df_to_json(sent_self[0],"sentiment.json")
    sent_message_other = df_to_json(sent_other[0],"sentiment.json")

    both_mean_sent = sent_both[1]
    self_mean_sent = sent_self[1]
    other_mean_sent = sent_other[1]
    
    total_messages = {
        'total': len(only['Message']),
        'self': amt_myself,
        'other': amt_other,
    }
    
    overall_sent = {
        "both_sent": both_mean_sent,
        "self_sent": self_mean_sent,
        "other_sent": other_mean_sent,
    }
    
    overall_double_text ={
        "double_text_total": int(double_texts[5]),
        "double_text_self": int(double_texts[3]),
        "double_text_other": int(double_texts[4]),
    }

    sent_both = sentiment_analysis_by_date(sent_both[0])
    sent_self = sentiment_analysis_by_date(sent_self[0])
    sent_other = sentiment_analysis_by_date(sent_other[0])

    sentiment = {
        "sentiment_both" : sent_both,
        "sentiment_self" : sent_self,
        "sentiment_other" : sent_other,
    }

    wordcloud_both = timer(wordCloud, only)
    wordcloud_self = timer(wordCloud, myself)
    wordcloud_other = timer(wordCloud, other)
    wordcloud = {
        "wordcloud_both" : wordcloud_both[0],
        "wordcloud_self" : wordcloud_self[0],
        "wordcloud_other" : wordcloud_other[0],
    }
    daynhour_both = timer(day_n_hour,only)
    daynhour_self = timer(day_n_hour, myself)
    daynhour_other = timer(day_n_hour, other)
    daynhour = {
        "daynhour_both" : daynhour_both,
        "daynhour_self" : daynhour_self,
        "daynhour_other" : daynhour_other,
    }

    
    all_emojis = timer(map_emojis, only)
    first_texts = first_encounter(only, name_map)
    all_chart_data = {
        'number': number,
        'name_map': name_map,
        'repeat': repeat,
        'repeat3': repeat3,
        'monthly_texts': monthlytexts,
        'emojis': emojisvar,
        'double_text': double_texts[0],
        'double_text_hr': double_texts[1],
        'word_cloud' : wordcloud,
        #'sentiment_by_message': sent_message_both,
        'sentiment_by_date': sentiment,
        'time_per_words': double_texts[2],
        'day_n_hour': daynhour,
        'reaction_type': reaction_type[0],
        'game_stats': reaction_type[1],
        'all_emojis': all_emojis,
        'first_encounter': first_texts,
        'peak_text_hr': peak_text_hr,
        'total_messages': total_messages,
        'overall_sent': overall_sent,
        'overall_double_text': overall_double_text,
    }

    directory = "json"
    if not os.path.exists(directory):
        os.makedirs(directory)
    #if you would like you can download your data as a json file, but i have this disabled in my code
    '''
    file_path = os.path.join(directory, "personal_chart_data.json")
    with open(file_path, 'w') as outfile:
        json.dump(all_chart_data, outfile, indent=2)

    print(f"Data written to {file_path}")
    '''
    print("Done")
    return all_chart_data

'''
create stop words
def getNltkWords():
    stop_words = set(stopwords.words('english'))
    unwanted = ["i", "u", "pm", "ok", "am", "pm", "go", "r", "apr", "mar", "feb", "mon", "tue", "fri", "wed", "sat", "sun", "reply",
            'yeah', 'yea', 'https', 'cuz', 'oh', 'also', 'yes', 'na', 'so', 'it', 'thu', 'wan', 'gon']
    stop_words.update(unwanted)
    with open ('stop_words.pkl', 'wb') as f:
        pickle.dump(stop_words,f)
    valid_words = set(nltk_words.words())
    with open('valid_words.pkl', 'wb') as f:
        pickle.dump(valid_words, f)
'''


