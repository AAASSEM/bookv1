import requests

BASE_URL = "http://localhost:8000"

def test_flow():
    # 1. Signup
    print("1. Creating Parent...")
    email = "test_auth_v3@example.com"
    password = "password123"
    parent_data = {
        "name": "Test Parent",
        "email": email,
        "password": password
    }
    r = requests.post(f"{BASE_URL}/users/", json=parent_data)
    if r.status_code != 200:
        print(f"Signup failed: {r.text}")
        return
    print("Signup OK")
    parent_id = r.json()["id"]

    # 2. Login
    print("2. Logging in...")
    login_data = {
        "username": email,
        "password": password
    }
    r = requests.post(f"{BASE_URL}/token", data=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.text}")
        # Assuming login fails due to bcrypt error caught in logs?
        return
    
    token_data = r.json()
    access_token = token_data["access_token"]
    print(f"Login OK. Token: {access_token[:10]}...")

    # 3. Create Child
    print("3. Creating Child...")
    headers = {"Authorization": f"Bearer {access_token}"}
    child_data = {
        "name": "Test Child",
        "age": 5,
        "level": "Beginner"
    }
    r = requests.post(f"{BASE_URL}/users/{parent_id}/children", json=child_data, headers=headers)
    if r.status_code != 200:
        print(f"Create Child failed: {r.status_code} {r.text}")
        return
    
    print("Create Child OK")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"Error: {e}")
