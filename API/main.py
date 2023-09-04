from ast import Dict
import datetime
from typing import Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recomender import getColdInitMovies, recomend_to_user, retrain_model_for_user, user_has_completed_cold_init
from userGravatar import UserGravatar
from userRatingMovie import UserRatingMovie
from userPendingMovie import UserPendingMovie
from querys import User, create_jwt_token, getMovieRating, getMovies, rateMovie, selectUser, registerUser, getMovieRatings, getUserById, decode_jwt_tokem, addUserPendingMovie, removeUserPendingMovie, getUserPendingMovies, isPendingMovieQuery, addRatingMovie, updateUserGravatar
from movie import Movie
import jwt

app = FastAPI()
security = HTTPBearer()

# Set up CORS
origins = [
    "http://localhost",
    "http://localhost:4200",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TOKEN_UPDATE_INTERVAL = 60

# Endpoint para validar un usuario y contraseña
@app.post("/login")
async def login(user: User):
    # Verificamos que existe el usuario
    queryResult = selectUser(user)

    # if not verify_password(user.password, queryResult.password):
    #     raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")
    if queryResult.user_id == -1:
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")

    jwt_token = create_jwt_token(queryResult.user_id)
    return {
        "token": jwt_token, 
        "token_type": "bearer", 
        "user": {
            "user_id":  queryResult.user_id,
            "user_name": queryResult.user_name,
            "email": queryResult.email,
            "password": queryResult.password,
            "gravatar_id": queryResult.gravatar_id
        }}
    
# Endpoint para registrar un nuevo usuario
@app.post("/register")
async def register(user: User):
    queryResult = registerUser(user)
    return queryResult


@app.get("/user")
def get_user(authorization: Optional[str] = Depends()):
    if not authorization:
        raise HTTPException(status_code=401, detail="No se proporcionó un token JWT")

    token = authorization.split("Bearer ")[-1]  # Elimina "Bearer " de la cabecera

    try:
        # Verifica y decodifica el token JWT
        payload = decode_jwt_tokem(token)

        # Extrae la información del usuario del payload del token
        user_id = payload.get("user_id")
        user = getUserById(user_id=user_id)

        return {
            "user": {
                "user_id":  user.user_id,
                "user_name": user.user_name,
                "email": user.email,
                "password": user.password
            }}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")



class MovieOptions(BaseModel):
    page_size: int
    page_number: int
    order: str = "id ASC"
    filter: str = ""
    user_id: int = -1

@app.post("/getCatalog")
async def getCatalog(options : MovieOptions):

    if options.user_id != -1:
        queryResult = getUserPendingMovies(options.page_size, options.page_number, options.order, options.filter, options.user_id)
    else:
        queryResult = getMovies(options.page_size, options.page_number, options.order, options.filter)

    # if queryResult:
    #     raise HTTPException(status_code=400, detail="No results")

    return {
        "movies": queryResult
        }


@app.post("/addPendingMovie")
async def addPendingMovie(user_movie: UserPendingMovie):
    if addUserPendingMovie(user_movie.user_id, user_movie.movie_id):
        return {"message": "Movie inserted!"}
    else:
        return {"message": "Movie insertion failed!"}

@app.post("/removePendingMovie")
async def removePendingMovie(user_movie: UserPendingMovie):
    if removeUserPendingMovie(user_movie.user_id, user_movie.movie_id):
        return {"message": "Movie removed!"}
    else:
        return {"message": "Movie delete failed!"}
    
@app.post("/isPendingMovie")
async def isPendingMovie(user_movie: UserPendingMovie):
    return {"return_value": isPendingMovieQuery(user_movie.user_id, user_movie.movie_id)}
    
@app.post("/getRatings")
async def getRatings(options : MovieOptions):

    queryResult = getMovieRatings(options.page_size, options.page_number, options.order, options.filter, options.user_id)

    return {
        "movies": queryResult
        }

@app.post("/rateMovie")
async def rateAMovie(rating : UserRatingMovie):
    queryResult = rateMovie(rating.user_id, rating.movie_id, rating.rating)

    if queryResult % 20 == 0:
        retrain_model_for_user()

    return {
        "movies": queryResult
        }

@app.post("/movieRating")
async def rateAMovie(userMovie : UserPendingMovie):
    queryResult = getMovieRating(userMovie.user_id, userMovie.movie_id)

    return {
        "rating": queryResult
        }

@app.post("/getRecomendations")
async def getRecomendations(user_id : str):

    coldInitCompleted: bool = user_has_completed_cold_init(user_id)

    #Si: Pedimos recomendaciones de peliculas no vistas del usuario
    if coldInitCompleted:
        movies = recomend_to_user(user_id)
    #No: Devolvemos las peliculas del cold_init
    else:
        movies = getColdInitMovies(user_id)
    
    return {
        "coldInitCompleted": coldInitCompleted,
        "movies": movies
        }

@app.post("/setUserGravatar")
async def setUserGravatar(user_gravatar : UserGravatar):

    ret = updateUserGravatar(user_gravatar.user_id, user_gravatar.gravatar_id)
    
    if ret:
        return {
            "message": "Gravatar Id inserted!"
        }
    else:
        return {
            "message": "Gravatar Id insertion failed!"
        }


# # Definir el middleware de autenticación
# @app.middleware("http")
# async def authenticate(request: Request, call_next):
#     token = request.headers.get("Authorization")

#     if token and token.startswith("Bearer "):
#       token = token.replace("Bearer ", "")
      
#       try:
#         # Verifica y decodifica el token JWT
#         decoded_token = decode_jwt_tokem(token)
#         last_update = get_last_update_in_seconds(decoded_token)
        
#         if last_update > TOKEN_UPDATE_INTERVAL:
#           user_id = decoded_token.get("user_id")
#           new_token = create_jwt_token(user_id)
#           response.headers["Authorization"] = f"Bearer {new_token}"
        
      
#       except jwt.ExpiredSignatureError:
#           raise HTTPException(status_code=401, detail="Token expirado")
#       except jwt.InvalidTokenError:
#           raise HTTPException(status_code=401, detail="Token inválido")
      
#     # Llamar al siguiente middleware o al controlador
#     response = await call_next(request)
#     return response

# def get_last_update_in_seconds(decoded_token) -> float:
#     created_at = decoded_token.get('iat')
#     # Calcular la diferencia en segundos
#     return (datetime.fromtimestamp(datetime.now) - datetime.fromtimestamp(created_at)).total_seconds()
