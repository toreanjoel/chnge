import json
from google.oauth2 import service_account
import google.auth.transport.requests

scope = ["https://www.googleapis.com/auth/firebase.messaging"]

def get_access_token(service_account_file):
    # Load the service account credentials
    credentials = service_account.Credentials.from_service_account_file(
        service_account_file,
        scopes=scopes
    )

    # Request a new token
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)

    return credentials.token

if __name__ == "__main__":
    # Path to your service account file
    service_account_file = './service-acc-file.json'

    # Print the access token
    print(get_access_token(service_account_file))
