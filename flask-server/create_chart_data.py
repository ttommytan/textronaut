from db_to_csv import db_to_csv, vcf_to_dict
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import random
from textblob import TextBlob
from datetime import datetime
import matplotlib.dates as mdates
from collections import defaultdict
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.preprocessing import MinMaxScaler
import emoji
import re
import json
import os
import nltk
import time



def count_emojis(text):
    emojis = emoji.emoji_list(text)
    return len(emojis)
def repeating_letters(word):
    double_letter_words = "/Users/TommyTan/Desktop/double_letter_words.csv"
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
      "chartData": data_list
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
    both.fillna(0)
    return df_to_json(both,"emojis.json")
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
    return df_to_json(both_df,"db3_letters.json")
def repeat_letters(df1):
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
    return df_to_json(both_df,"db3_letters.json")
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
    print(my_dt)
    print(so_dt)
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
    return [df_to_json(both_df,"double_text.json"),df_to_json(both_df2,"double_text_hr.json"), word_n_time]

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
    return df_to_json(both_df2,"double_text_hr.json")
#Overall Stats
#All texts each month
def wordCloud(df):
    words = []

    for line in df['Message']:
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(line)
        for word in word_tokens:
            if word not in stop_words and word.isalpha():
                words.append(word.lower())
    unwanted = ["i", "u", "pm", "ok", "am", "pm", "go", "r", "apr", "mar", "feb", "mon", "tue", "fri", "wed", "sat", "sun", "reply",
                'yeah', 'yea', 'https', 'cuz', 'oh', 'also', 'yes', 'na', 'so', 'it', 'thu']
    # Filter out unwanted words
    filtered_words = [word for word in words if word not in unwanted]

    # Join filtered words into a single string
    text = " ".join(filtered_words)

    freq_map = defaultdict(int)
    for w in filtered_words:
    #for w in words:
        freq_map[w] += 1

    # Sort word_list by 'value' in descending order and take only the first 100 words
    sorted_word_list = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)[:75]
    word_list = [{'text': word, 'value': freq} for word, freq in sorted_word_list]
    return word_list

def sentiment_analysis(df):
    sentence_sentiments = []
    date = []
    for i, sentence in enumerate(df['Message']):
        sentiment = TextBlob(sentence).sentiment.polarity
        sentence_sentiments.append(sentiment)
        date.append(df['MYD'].iloc[i])

    # Create DataFrame with sentiment and date columns
    df_sentiment = pd.DataFrame({
        'Date': [d.strftime('%Y-%m-%d')  for d in date],
        'Polarity': sentence_sentiments
    })
    #sentence_sentiments = sentence_sentiments[::-1]

    mean_sentiment = df_sentiment['Polarity'].mean()

    # Calculate rolling average of sentiment with a window of 3 sentences
    df_sentiment['RollingAvg'] = df_sentiment['Polarity'].rolling(window=500).mean()
    df_sentiment = df_sentiment.rdf_sentiment = df_sentiment.reset_index(drop = True) 
    return [df_sentiment, mean_sentiment]
def sentiment_analysis_by_date(df):
    df_sentiment_dates = df.groupby('index')['Polarity'].mean().reset_index()
    df_sentiment_dates['RollingAvg'] = df_sentiment_dates['Polarity'].rolling(window=30).mean()
    return df_to_json(df_sentiment_dates,"sentiment_by_date.json")
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
    df1.index = df1.index.strftime('%Y-%m-%d')
    df2.index = df2.index.strftime('%Y-%m-%d')
    #df1.to_json('myself_monthly.json', index=True)
    #df2.to_json('other_monthly.json', index=True)

    df1 = myself_monthly[['Message']]
    df2 = other_monthly[['Message']]
    df1.index = df1.index.strftime('%Y-%m-%d')
    df2.index = df2.index.strftime('%Y-%m-%d')
    #df1.to_json('myself_monthly.json', index=True)
    #df2.to_json('other_monthly.json', index=True)

    df1 = df1.merge(df2, on='MY', how='outer')
    df1 = df1[['Message_x','Message_y']]
    df1 = df1.reset_index()
    df1.head()
    df1 = df1.fillna(0)
    return df_to_json(df1, "monthly_texts.json")
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

    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    # Create the DataFrame
    day_df = pd.DataFrame({
        'Day': weekdays,
        'Myself': myself_days,
        'Other': other_days
    })

    return df_to_json(day_df, "days.json")
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
    hours = df.groupby(['WeekDay','Rounded']).count()
    #hours.reset_index(inplace=True)
    hours = hours[['Number']]
    hours = hours.unstack(level='Rounded', fill_value=0)
    desired_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    hours = hours.reindex(desired_order)

    def keep_top_five(row):
        top_five = row.nlargest(5).index  # Get indices of top 5 values
        result = pd.Series(0, index=row.index)  # Initialize all values to 0
        result[top_five] = row[top_five]  # Set top 5 values to their original values
        return result

    # Apply function row-wise
    hours = hours.apply(keep_top_five, axis=1)

    datasets = []
    for rounded in range(len(hours.columns)):
        dataset = {
            'label': f'Hour {rounded}',
            'data': [],
            'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.6)',
            'hoverBackgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
        }
        for weekday in hours.index:
            dataset['data'].append({
                'x': weekday,  # Weekday as x-coordinate
                'y': rounded,  # Rounded hour as y-coordinate
                'r': hours.loc[weekday, ('Number', rounded)] / 100,  # Adjust radius as needed
            })
        datasets.append(dataset)
    return datasets
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
    all = all.dropna()
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    all['WeekDay'] = all['MYD'].apply(lambda x: days[x.weekday()])
    return all


def create_chart_data(dataframe, names_map):
    all = dataframe

    if names_map:
        all['Name'] = all['Number'].map(names_map)

    top10 = top10_texters(all,names_map)[0]
    daysofweek = timer(days_of_week_texts,all)
    monthlytexts = timer(monthly_texts,all)
    wordcloud = timer(wordCloud,all)
    sent = timer(sentiment_analysis,all)
    daynhour = timer(day_n_hour,all)
    avg_stats = avg_stat_comparison(all, names_map)

    all_chart_data = {
        'leaderboard': top10,
        'day_of_week_texts': daysofweek,
        'monthly_texts': monthlytexts,
        'word_cloud' : wordcloud,
        'sentiment_by_message': df_to_json(sent[0],"sentiment.json"),
        'sentiment_by_date': sentiment_analysis_by_date(sent[0]),
        'day_n_hour': daynhour,
        'avg_stats_comparison': avg_stats,
    }

    directory = "json"
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = os.path.join(directory, "all_chart_data.json")
    with open(file_path, 'w') as outfile:
        json.dump(all_chart_data, outfile, indent=2)

    print(f"Data written to {file_path}")
    print("Done")

    return all_chart_data


def create_personal_chart_data(dataframe, number):
    all = dataframe
    #number is str
    only = all[all['Number'] == number].copy()
    only.dropna(inplace=True)
    
    only['Emojis'] = only['Message'].apply(count_emojis)
    only['Num_of_Words'] = only['Message'].apply(lambda x: len(x.split()))
    only['Time_Elapsed'] = 0
    only.reset_index(drop=True, inplace=True)
    for i in range(1,len(only)):
        only.loc[i,'Time_Elapsed'] = (only['Date'].iloc[i] - only['Date'].iloc[i-1]).seconds/60
    myself = only[only['From_Me'] == 1]
    other = only[only['From_Me'] == 0]

    avg_response_time = only['Time_Elapsed'].mean()
    
    amt_myself = len(myself)
    amt_other = len(other)

    repeat = timer(repeat_letters, only)
    repeat3 = timer(repeat_letters3, only)
    monthlytexts = timer(monthly_texts, only)
    emojisvar = timer(emojis,only)
    double_texts = timer(double_text,only)
    wordcloud = timer(wordCloud, only)
    sent = timer(sentiment_analysis,only)
    daynhour = timer(day_n_hour,only)

    all_chart_data = {
        'repeat': repeat,
        'repeat3': repeat3,
        'monthly_texts': monthlytexts,
        'emojis': emojisvar,
        'double_text': double_texts[0],
        'double_text_hr': double_texts[1],
        'word_cloud' : wordcloud,
        'sentiment_by_message': df_to_json(sent[0],"sentiment.json"),
        'sentiment_by_date': sentiment_analysis_by_date(sent[0]),
        'time_per_words': double_texts[2],
        'day_n_hour': daynhour,
    }

    directory = "json"
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = os.path.join(directory, "personal_chart_data.json")
    with open(file_path, 'w') as outfile:
        json.dump(all_chart_data, outfile, indent=2)

    print(f"Data written to {file_path}")
    print("Done")
    return all_chart_data



def runCharts(personal):
    df = timer(db_to_csv,"/Users/TommyTan/Desktop/chat.db")
    clean = timer(clean_df,df)
    if personal:
        start = time.perf_counter()
        create_personal_chart_data(clean,"+17146566892")
        end = time.perf_counter()
        elapsed = end - start
        print(f'create_personal_chart_data took: {elapsed:.6f} seconds')
    else:
        timer(create_chart_data,clean)
        
#timer(runCharts, False)
#timer(runCharts, False)
#df = (clean_df(db_to_csv("/Users/TommyTan/Desktop/chat.db")))
#timer(avg_stat_comparison,df) /Users/TommyTan/Downloads/All Contacts.vcf
#"/Users/TommyTan/Downloads/All Contacts.vcf"
#file_path = "/Users/TommyTan/Downloads/All Contacts.vcf"
#name_map = vcf_to_dict(file_path)
#create_chart_data(df,name_map)
#create_personal_chart_data(clean_df(db_to_csv("/Users/TommyTan/Desktop/chat.db")),"+17146566892")
