from pydantic import BaseModel

# Modelo de datos para las películas
class Movie(BaseModel):
    id: str
    title: str
    rating: int = -1