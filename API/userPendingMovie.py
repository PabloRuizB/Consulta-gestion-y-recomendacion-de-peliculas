from pydantic import BaseModel

# Modelo de datos para las películas pendientes
class UserPendingMovie(BaseModel):
    user_id: int
    movie_id: str