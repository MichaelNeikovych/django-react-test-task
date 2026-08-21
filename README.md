## Backend Setup

### Requirements

Python `2.7.18` is required.

Create and activate a virtual environment:

```bash
cd server

python -m virtualenv venv
```

macOS / Linux:

```bash
source venv/bin/activate
```


Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Create test users:

```bash
python manage.py create_test_users
```

Start the backend:

```bash
python manage.py runserver
```

The API will be available at:

```text
http://localhost:8000
```

## Frontend Setup

Open a new terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL shown by the development server, usually:

```text
http://localhost:5173
```

## Test Users

### Admin

```text
Login: John
Password: admin123
Role: admin
```

The administrator can view the requests list and create new requests.

### User

```text
Login: David
Password: user123
Role: user
```

The regular user can view the requests list but cannot create requests.

The backend also prevents users with the `user` role from creating requests, even if they manually send a POST request to the API.
