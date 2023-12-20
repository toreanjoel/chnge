# TODO: Cleanup the file pattern
import sys
import firebase_admin
from firebase_admin import credentials, db
from pathlib import Path
import json

# Path to your service account JSON file
# TODO: consider adding details in .env file?
service_account_file_path = f"{Path.cwd()}/lib/scripts/service-acc-file.json"
# Initialize the app with a service account
cred = credentials.Certificate(service_account_file_path)
# TODO: we pass the url in from the EVN variable
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://mob-chnge-default-rtdb.europe-west1.firebasedatabase.app'
})

# Reference to your database path
# TODO: change this so we can pass the path in


# Reading the data at the reference
if __name__ == '__main__':
    # Params
    user_id = sys.argv[1]
    current_date = sys.argv[2]
    suggestion_data = sys.argv[3]

    suggestion_path = '/users/' + user_id + '/transactions/history/' + current_date + '/dailyGoal'
    suggestion_ref = db.reference(suggestion_path)
    data = suggestion_ref.set(suggestion_data)
    
    # we need a way to conditionally force a struct dataset
    print("Suggestion Set")