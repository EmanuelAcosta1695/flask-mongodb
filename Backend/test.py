import unittest
from app import app
from flask_pymongo import PyMongo
from dotenv import load_dotenv

class AppTest(unittest.TestCase):


    def setUp(self):
        app.testing = True
        self.app = app.test_client()
        self.mongo = PyMongo(app)
        self.user_id = None  # Variable para almacenar el ID del usuario creado


    def test_create_user(self):
        response = self.app.post('/users', data={
            'username': 'John',
            'password': 'password123',
            'email': 'john@example.com'
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.user_id = data['id']  # Almacenar el ID del usuario creado


    def test_get_user(self):
        response = self.app.get(f'/users/{self.user_id}')  # Usar el ID almacenado
        self.assertEqual(response.status_code, 200)


    def test_update_user(self):
        response = self.app.put(f'/users/{self.user_id}', json={
            'username': 'John Doe',
            'email': 'johndoe@example.com'
        })
        self.assertEqual(response.status_code, 200)


    def test_delete_user(self):
        response = self.app.delete(f'/users/{self.user_id}')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()