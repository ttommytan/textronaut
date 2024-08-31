
import sqlite3 
import csv
import pandas as pd
import io
import vobject
import json
import binascii
from collections import Counter
import plistlib
import ast
import base64

# create con object to connect  
# the database geeks_db.db 

def db_to_csv(db_file):
    
    con = sqlite3.connect(db_file) 

    # create the cursor object 
    cur = con.cursor() 
    try:
        cur.execute(""" 
        SELECT
        COALESCE(m.cache_roomnames, h.id) AS ThreadId,
        m.is_from_me AS IsFromMe,
        datetime((m.date / 1000000000) + 978307200, 'unixepoch', 'localtime') AS TextDate,
        m.text AS MessageText,
		m.is_audio_message,                         
		m.associated_message_type, 
		m.associated_message_range_length,
		m.attributedBody,
		m.payload_data,
        c.display_name AS RoomName
        FROM
        message AS m
        LEFT JOIN handle AS h ON m.handle_id = h.rowid
        LEFT JOIN chat AS c ON m.cache_roomnames = c.room_name
        LEFT JOIN chat_handle_join AS ch ON c.rowid = ch.chat_id
        LEFT JOIN handle AS h2 ON ch.handle_id = h2.rowid
        WHERE
        (h2.service is null or m.service = h2.service)
        ORDER BY
        m.date DESC;
		
		

            
            """)
    except:
        return("Incorrect db format") 
    


    

    fieldnames = ["Number", "From_Me", "Date", "Message", "Audio", "Message_Type", "New_Game","Attributed_Body","Payload_Data","Group_Chat"]

    
    csv_buffer = io.StringIO()
    csv_writer = csv.writer(csv_buffer)
    csv_writer.writerow(fieldnames)
    csv_writer.writerows(cur.fetchall())
    csv_buffer.seek(0)
    df = pd.read_csv(csv_buffer)

    #df = df.drop(df.index[0])
    print("All records exported Successfully!")
    con.close()

    
 

    return df





def vcf_to_dict(vcf_path):
    if vcf_path:
        contacts_dict = {}

        with open(vcf_path, 'r', encoding='utf-8') as f:
            vcard_data = f.read()
            vcards = vobject.readComponents(vcard_data)

            # Process each vCard
            for vcard in vcards:
                try:
                    if isinstance(vcard, vobject.base.Component):
                        name = vcard.fn.value if hasattr(vcard, 'fn') else 'No Name'
                        phone_numbers = []
                        photo_data = None

                        # Extract phone numbers
                        if 'tel' in vcard.contents:
                            for tel in vcard.contents['tel']:
                                phone_number = tel.value
                                phone_numbers.append(phone_number)
                                if not phone_number.startswith('+1'):
                                    cleaned_number = ''.join(filter(str.isdigit, phone_number))
                                    phone_number = f"+1{cleaned_number}"
                                contacts_dict[phone_number] = name

                except Exception as e:
                    print(f"Error processing vCard: {e}")


        return contacts_dict
    else:
        return {}


    
