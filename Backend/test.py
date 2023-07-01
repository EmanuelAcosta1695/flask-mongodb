import unittest
from app import app
from flask_pymongo import PyMongo

# Crea y elimina el user
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
        data = response.get_json()
        print(data)


    def test_get_users(self):
        response = self.app.get('/mostrarUsers/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
       
        if data:
            user_id = str(data[-1]['_id']['$oid'])
            print('test_get_users', user_id)
            return user_id
        
        else:
            self.skipTest("No users available")


    def test_get_user(self):
        user_id = self.test_get_users()
        print('test_get_user', user_id)
       
        if user_id is not None:
            response = self.app.get(f'/users/{user_id}')
            self.assertEqual(response.status_code, 200)
        
        else:
            self.skipTest("No user_id available")


    def test_update_user(self):
        user_id = self.test_get_users()
        print('test_update_user', user_id)

        if user_id is not None:
            response = self.app.put(f'/users/{user_id}', json={
                'username': 'John Doe',
                'email': 'johndoe@example.com'
            })
            self.assertEqual(response.status_code, 200)

        else:
            self.skipTest("No user_id available")


    def test_delete_user(self):
        user_id = self.test_get_users()
        print('test_delete_user', user_id)
        if user_id is not None:
            response = self.app.delete(f'/users/{user_id}')
            self.assertEqual(response.status_code, 200)
        else:
            self.skipTest("No user_id available")


if __name__ == '__main__':
    unittest.main()




