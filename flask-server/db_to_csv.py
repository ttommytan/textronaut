
import sqlite3 
import csv
import pandas as pd
import io
import vobject
import json

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
    
    # display the data in the table by  
    # executing the cursor object 

    filename ="db_to_csv.csv"
    fieldnames = ["Number", "From_Me", "Date", "Message", "Group_Chat"]
    
    
    csv_buffer = io.StringIO()
    csv_writer = csv.writer(csv_buffer)
    csv_writer.writerow(fieldnames)
    csv_writer.writerows(cur.fetchall())
    csv_buffer.seek(0)
    df = pd.read_csv(csv_buffer)
    filename = "csv/db_to_csv.csv"
    df.to_csv(filename, index=False)
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

                        # Extract phone numbers
                        if 'tel' in vcard.contents:
                            for tel in vcard.contents['tel']:
                                phone_number = tel.value
                                phone_numbers.append(phone_number)
                                if not phone_number.startswith('+1'):
                                    cleaned_number = ''.join(filter(str.isdigit, phone_number))
                                    phone_number = f"+1{cleaned_number}"
                                contacts_dict[phone_number] = name

                                # Log each processed contact
                except Exception as e:
                    print(f"Error processing vCard: {e}")

        with open("name_map.json", 'w') as outfile:
            json.dump(contacts_dict, outfile, indent=2)
        return contacts_dict
    else:
        return ""
'''
def db_to_csv(file_content):
    print('Starting db_to_csv function')
    
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.db') as temp_file:
        temp_filename = temp_file.name
        # Write the content of file_content to the temporary file
        file_content.seek(0)
        temp_file.write(file_content.read())
    
    try:
        # Connect to the temporary file as an SQLite database
        con = sqlite3.connect(temp_filename)
        cur = con.cursor()

        print('Database loaded')

        # Check available tables
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        print(f"Available tables: {[table[0] for table in tables]}")

        if not tables:
            return "Error: No tables found in the database"

        if 'message' not in [table[0] for table in tables]:
            return "Error: 'message' table not found in the database"

        cur.execute(""" 
        SELECT
        COALESCE(m.cache_roomnames, h.id) AS ThreadId,
        m.is_from_me AS IsFromMe,
        datetime((m.date / 1000000000) + 978307200, 'unixepoch', 'localtime') AS TextDate,
        m.text AS MessageText,
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
        print('Query executed successfully')

        fieldnames = ["Number", "From_Me", "Date", "Message", "Group_Chat"]
        
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        csv_writer.writerow(fieldnames)
        csv_writer.writerows(cur.fetchall())
        csv_buffer.seek(0)
        df = pd.read_csv(csv_buffer)
        
        filename = "csv/db_to_csv.csv"
        df.to_csv(filename, index=False)
        print("All records exported Successfully!")
        return df

    except sqlite3.Error as e:
        print(f"SQLite error occurred: {e}")
        return f"SQLite error: {e}"
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"Error: {e}"
    finally:
        if 'con' in locals():
            con.close()
        # Remove the temporary file
        os.unlink(temp_filename)'''





