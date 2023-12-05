import firebase_admin
from firebase_admin import credentials, db

# Path to your service account JSON file
# TODO: consider adding details in .env file?
service_account_file_path = './service-acc-file.json'

# Initialize the app with a service account
cred = credentials.Certificate(service_account_file_path)
# TODO: we pass the url in from the EVN variable
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://mob-chnge-default-rtdb.europe-west1.firebasedatabase.app'
})

# Reference to your database path
# TODO: change this so we can pass the path in
ref = db.reference('/users')

# Reading the data at the reference
data = ref.get()
print(data)