import pytest
from backend.app import app, init_db

@pytest.fixture
def client():
    # setup test client
    init_db()
    app.config["TESTING"] = True
    client = app.test_client()
    return client

def test_register(client):
    response = client.post("/register", json={
        "username": "stella",
        "password": "password123"
    })
    assert response.status_code in (201, 400)  # 400 if user already exists

def test_login(client):
    client.post("/register", json={
        "username": "stella",
        "password": "password123"
    })
    response = client.post("/login", json={
        "username": "stella",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.get_json()

def test_add_topic(client):
    client.post("/register", json={"username": "stella", "password": "password123"})
    login_res = client.post("/login", json={"username": "stella", "password": "password123"})
    token = login_res.get_json()["token"]

    response = client.post("/add",
        json={"subject": "DSA", "topic_name": "Arrays", "status": "pending", "difficulty": "easy", "notes": "revise"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201

def test_get_topics(client):
    client.post("/register", json={"username": "stella", "password": "password123"})
    login_res = client.post("/login", json={"username": "stella", "password": "password123"})
    token = login_res.get_json()["token"]

    response = client.get("/topics", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
