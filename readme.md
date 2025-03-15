# Basic Frontend application in Nodejs and EJS to show usage of Keycloak for authentication

## Pre-Requisites

### Docker and Docker compose
Docker-compose file is included
run

```sh
docker-compose up -d
```
This will create a keycloak instance with postgressql backed DB and persistance on a volume

### Keycloak set up
- Create a Realm
  - Name = myrealm
- Create a Realm Role
  - name = myrole
  - Later add the user created to this role
- Create a Client named myclient
  - Root URl = http://localhost:8000
  - Home URl = http://localhost:8000
  - Valid Redirects = http://localhost:8000/*
  - Web Origins = http://localhost:8000
  - Client Authentication = On
  - Authorization = On
  - Authentication Flow 
    - Standard
    - Implicit
    - Direct Access Grants
  - Login Theme
    - keycloak
    - Consent Required - Yes
    - Display on Client screen = Yes
  
- Create a user and password 
- Add Picture as a User Attribute:

  - Log in to your Keycloak admin console
  - Go to "Users" and select the user you want to modify
  - Click on the "Attributes" tab
  - Add a new attribute with key picture and value set to a valid image URL
  - Click "Save"
- Map the Picture Attribute to ID Token:

    - Go to "Client Scopes" in your realm
    - Click on the client scope that your client uses (usually "openid" or a dedicated scope)
    - Go to the "Mappers" tab
    - Click "Create" to add a new mapper
      - Name: "picture"
      - Mapper Type: "User Attribute"
      - User Attribute: "picture"
      - Token Claim Name: "picture"
      - Claim JSON Type: "String"
      - Add to ID token: ON
      - Add to access token: ON
      - Add to userinfo: ON
    - Click "Save"

## Setting Up the Environment

1. Install the required dependencies:
    ```sh
    npm install
    ```

2. Create a `.env` file in the root of your project with the following content:
    ```dotenv
    PORT=8000
    BASE_URL=http://localhost:8000
    CLIENT_ID=myclient
    ISSUER_BASE_URL=http://localhost:8080/realms/myrealm
    SECRET=LONG_RANDOM_STRING_FOR_SIGNING_SESSION
    CLIENT_SECRET=<Your client secret>
    SESSION_SECRET=another_secret_for_session
    ```

3. Start the application:
    ```sh
    npm start
    ```

The application will be running at `http://localhost:8000`

