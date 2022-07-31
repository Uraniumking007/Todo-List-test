import json
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prisma import Prisma
from pydantic import BaseModel
from redis import Redis

app = FastAPI()
redis_client = Redis(host='localhost', port=6379, db=0)

origins = ['http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods='*',
    allow_headers='*',
)


class CreateTask(BaseModel):
    text: str
    day: str
    reminder: Optional[bool] = False


@app.get('/api/tasks')
async def tasks():
    tasks = redis_client.get(name='tasks')
    # print({'tasksFRomRedis': tasks})
    if tasks is None:
        prisma = Prisma()
        await prisma.connect()

        tasks = await prisma.task.find_many(order={'createdAt': 'desc'})
        tasks = [task.dict() for task in tasks]
        await prisma.disconnect()
        redis_client.set(
            name='tasks',
            value=json.dumps(tasks, default=str),
        )
    return {
        'message': 'Tasks fetched succesfully',
        'tasks': json.loads(tasks) if isinstance(tasks, bytes) else tasks,
    }


@app.post('/api/create/task')
async def create_task(task: CreateTask):
    redis_client.delete('tasks')
    data = {
        'text': task.text,
        'day': task.day,
        'reminder': task.reminder,
    }
    prisma = Prisma()
    await prisma.connect()
    new_task = await prisma.task.create(data)
    await prisma.disconnect()
    return {'message': 'Task created succesfully', 'task': new_task.dict()}


@app.delete('/api/delete/task')
async def delete_task(id: int):
    redis_client.delete('tasks')
    prisma = Prisma()
    await prisma.connect()

    deleted_task = await prisma.task.delete(where={'id': id})
    await prisma.disconnect()
    if delete_task is None:
        return {
            'message': f'No task with the id {id}',
        }
    return {
        'message': 'Task deleted succesfully',
        'task': deleted_task.dict(),
    }
