import math
from movie import Movie
import mysql.connector
from pydantic import BaseModel
from passlib.hash import pbkdf2_sha256
import jwt
import datetime
from typing import Dict, Any
from user import User


#Informacion relativa a la base de datos
db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="winged7%AP",
            database="tfg"
        )

cursor = db.cursor()

def hash_password(password: str) -> str:
    return pbkdf2_sha256.hash(password)


def verify_password(password: str, hased_password: str) -> bool:
    return pbkdf2_sha256.verify(password, hased_password)

# Informacion relativa a la generacion de tokens JWT
SECRET_KEY="winged7%AP"
ALGORITHM="HS256"
EXPIRE_IN_MINUTES=30

def create_jwt_token(user_id: int) -> str:
    expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=EXPIRE_IN_MINUTES)
    to_encode = {"user_id": user_id, "exp": expiration}
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

def decode_jwt_tokem(token: str) -> Dict[str, Any]:
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return decoded_token


# Método que comprueba si un usuario existe en la tabla USER dada su correo y contraseña
def selectUser(user: User) -> User:
    query = f"SELECT user_id, user_name, email, password, gravatar_id FROM user WHERE email='{user.email}'"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        if verify_password(user.password, queryResult[0][3]):
            user = User(user_id=queryResult[0][0], user_name=queryResult[0][1], email=queryResult[0][2], password=queryResult[0][3], gravatar_id=queryResult[0][4])
    return user

# Método que inserta un nuevo registro en la tabla USER con UserName, Password y Email
def insertUser(userName: str, password: str, email: str):
    query = f"INSERT INTO USER (UserName, Password, Email) VALUES ('{userName}', '{password}', '{email}')"
    cursor.execute(query)
    db.commit()

# Metodo que inserta o actualiza una valoracion de un usuario y devuelve el numero de valoraciones totales
def rateMovie(user_id: int, movie_id: str, rating: int) -> int:
    query = f"SELECT rating FROM rating WHERE user_id={user_id} AND movie_id='{movie_id}'"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        query = f"UPDATE rating SET rating = {rating} WHERE user_id = {user_id} AND movie_id = '{movie_id}'"
        cursor.execute(query)
        db.commit()
    else:
        query = f"INSERT INTO rating (user_id, movie_id, rating) VALUES ({user_id}, '{movie_id}', {rating})"
        cursor.execute(query)
        db.commit()

    query = f"SELECT COUNT(*) FROM rating WHERE user_id={user_id}"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    ratings = queryResult[0][0]
    return ratings
    
    

def getMovies(page_size: int, page_number: int, order: str, filter: str):
    query = f"SELECT id, title FROM movie WHERE title LIKE '%{filter}%' ORDER BY {order} LIMIT {page_size} OFFSET {page_number*page_size}"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    movies = []
    if queryResult:
        for result in queryResult:
            movies.append(Movie(id=result[0], title=result[1]))
    
    return movies

def getMovieRatings(page_size: int, page_number: int, order: str, filter: str, user_id: int):
    query = f"SELECT m.id, m.title, r.rating FROM movie AS m LEFT JOIN rating as r ON m.id = r.movie_id WHERE r.user_id = {user_id} AND title LIKE '%{filter}%' ORDER BY {order} LIMIT {page_size} OFFSET {page_number*page_size}"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    movies = []
    if queryResult:
        for result in queryResult:
            movies.append(Movie(id=result[0], title=result[1], rating=result[2]))
    
    return movies

def getMovieRating(user_id: int, movie_id: str):
    query = f"SELECT rating FROM rating WHERE user_id = {user_id} AND movie_id = '{movie_id}' LIMIT 1"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        return math.floor(queryResult[0][0])
    else:
        return -1

def getUserPendingMovies(page_size: int, page_number: int, order: str, filter: str, user_id: int):
    query = f"SELECT m.id, m.title FROM movie AS m LEFT JOIN user_pending_movie AS up ON up.movie_id = m.id WHERE up.user_id = {user_id} AND m.title LIKE '%{filter}%' ORDER BY {order} LIMIT {page_size} OFFSET {page_number*page_size}"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    movies = []
    if queryResult:
        for result in queryResult:
            movies.append(Movie(id=result[0], title=result[1]))
    
    return movies

def addUserPendingMovie(user_id: int, movie_id: str) -> bool:
    query = f"INSERT INTO user_pending_movie(user_id, movie_id) VALUES({user_id}, '{movie_id}')"
    try:
        cursor.execute(query)
        db.commit()
        return True
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        return False
    
def removeUserPendingMovie(user_id: int, movie_id: str) -> bool:
    query = f"DELETE FROM user_pending_movie WHERE user_id = {user_id} AND movie_id = '{movie_id}'"
    try:
        cursor.execute(query)
        db.commit()
        return True
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        return False
    
def addRatingMovie(user_id: int, movie_id: str, rating: float) -> bool:
    query = f"INSERT INTO rating(user_id, movie_id, rating) VALUES({user_id}, '{movie_id}', {rating})"
    try:
        cursor.execute(query)
        db.commit()
        return True
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        return False
    
# Método que comprueba si un una pelicula existe en la tabla user_pending_movie dada su correo y contraseña
def isPendingMovieQuery(user_id: int, movie_id: str) -> bool:
    query = f"SELECT * FROM user_pending_movie WHERE user_id={user_id} AND movie_id='{movie_id}'"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        return True
    else:
        return False

def getUserById(user_id: str) -> User:
    query = f"SELECT user_id, user_name, email, password FROM user WHERE user_id='{user_id}'"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        user = User(user_id=queryResult[0][0], user_name=queryResult[0][1], email=queryResult[0][2], password=queryResult[0][3])
        return user
    else:
        return User()
    

def updateUserGravatar(user_id: str, gravatar_id: str) -> bool:
    query = f"UPDATE user SET gravatar_id='{gravatar_id}' WHERE user_id='{user_id}'"
    try:
        cursor.execute(query)
        db.commit()
        return True
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        return False


# Método que comprueba si un usuario existe en la tabla USER dada su correo y contraseña
def registerUser(user: User):

    suscess: bool = False
    message: str = ""
    
    query = f"SELECT user_id, user_name, email, password FROM user WHERE email='{user.email}' LIMIT 1"
    cursor.execute(query)
    queryResult = cursor.fetchall()
    if queryResult:
        suscess = False
        message = "Ya hay una cuenta asociada al email introducido"    
    else:
        query = f"SELECT user_id, user_name, email, password FROM user WHERE email='{user.user_name}' LIMIT 1"
        cursor.execute(query)
        queryResult = cursor.fetchall()
        if queryResult:
            suscess = False
            message = "Ya hay una cuenta asociada al nombre de usuario introducido"
        else:
            query = f"INSERT INTO user(user_id, user_name, email, password) VALUES((SELECT u.user_id + 1 FROM user AS u ORDER BY u.user_id DESC LIMIT 1), '{user.user_name}', '{user.email}', '{hash_password(user.password)}')"
            try:
                cursor.execute(query)
                db.commit()
                suscess = True
                message = "Registro completado con exito"
            except Exception as e:
                db.rollback()  # Rollback the transaction in case of an error
                suscess = False
                message = "Ha ocurrido un error en el registro"
    
    return {
        "suscess": suscess,
        "message": message
    }
