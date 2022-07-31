from typing import Optional
from fastapi import FastAPI
from prisma import Prisma
from pydantic import BaseModel

app = FastAPI()


class CreateTask(BaseModel):
    text: str
    day: str
    reminder: Optional[bool] = False


@app.get('/api/tasks')
async def tasks():
    prisma = Prisma()
    await prisma.connect()

    tasks = await prisma.task.find_many(order={'createdAt': 'desc'})
    tasks = [task.dict() for task in tasks]
    await prisma.disconnect()
    return {
        'message': 'Tasks fetched succesfully',
        'tasks': tasks,
    }


@app.post('/api/create/task')
async def create_task(task: CreateTask):
    prisma = Prisma()
    await prisma.connect()
    new_task = await prisma.task.create(
        data={
            'text': task.text,
            'day': task.day,
            'reminder': task.reminder,
        }
    )
    await prisma.disconnect()
    return {'message': 'Task created succesfully', 'task': new_task.dict()}


@app.delete('/api/delete/task')
async def delete_task(id: int):
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
