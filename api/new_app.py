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

        print("FETCHING FROM DB")

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
    data = {
        'text': task.text,
        'day': task.day,
        'reminder': task.reminder,
    }
    prisma = Prisma()
    await prisma.connect()
    new_task = await prisma.task.create(data)
    await prisma.disconnect()

    tasks = redis_client.get('tasks')
    if tasks is not None:
        tasks = list(json.loads(tasks))
        tasks.insert(0, new_task.dict())
        redis_client.set('tasks', json.dumps(tasks, default=str))

    return {'message': 'Task created succesfully', 'task': new_task.dict()}


@app.delete('/api/delete/task')
async def delete_task(id: int):
    prisma = Prisma()
    await prisma.connect()

    deleted_task = await prisma.task.delete(where={'id': id})
    await prisma.disconnect()
    if deleted_task is None:
        return {
            'message': f'No task with the id {id}',
        }

    tasks = list(json.loads(redis_client.get('tasks')))
    tasks = list(filter(lambda task: task['id'] != id, tasks))

    redis_client.set('tasks', json.dumps(tasks, default=str))

    return {
        'message': 'Task deleted succesfully',
        'task': deleted_task.dict(),
    }
