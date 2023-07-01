import unittest
from app import app
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

class AppTest(unittest.TestCase):


    def setUp(self):
        app.testing = True
        self.app = app.test_client()
        self.mongo = PyMongo(app)


    def test_create_user(self):
        response = self.app.post('/users', data={
            'username': 'John',
            'password': 'password123',
            'email': 'john@example.com'
        })
        self.assertEqual(response.status_code, 200)
        # Asegúrate de verificar otros detalles de la respuesta según sea necesario

    def test_get_user(self):
        response = self.app.get('/users/64662f7f4d41c72368595967')
        self.assertEqual(response.status_code, 200)
        # Asegúrate de verificar otros detalles de la respuesta según sea necesario

    def test_update_user(self):
        response = self.app.put('/users/64662f7f4d41c72368595967', json={
            'username': 'John Doe',
            'email': 'johndoe@example.com'
        })
        self.assertEqual(response.status_code, 200)
        # Asegúrate de verificar otros detalles de la respuesta según sea necesario

    def test_delete_user(self):
        response = self.app.delete('/users/64662f7f4d41c72368595967')
        self.assertEqual(response.status_code, 200)
        # Asegúrate de verificar otros detalles de la respuesta según sea necesario


if __name__ == '__main__':
    unittest.main()