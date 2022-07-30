from prisma import Prisma
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/tasks', methods=['GET', 'POST'])
async def tasks():
    prisma = Prisma()
    await prisma.connect()
    if request.method == 'GET':
        tasks_raw = await prisma.tasks.find_many(order={'createdAt': 'desc'})
        tasks = [task.dict() for task in tasks_raw]
        await prisma.disconnect()
        return jsonify({'tasks': tasks})
    if request.method == 'POST':
        task_text: str = request.json['text']
        reminder: bool = request.json['reminder']
        date_and_time: str = request.json['day']

        new_task = (
            await prisma.tasks.create(
                data={
                    'task': task_text,
                    'dateAndTime': date_and_time,
                    'reminder': reminder,
                }
            )
        ).dict()
        await prisma.disconnect()
        return jsonify({'task': new_task})


@app.route('/api/task/<int:id>', methods=['DELETE'])
async def mutate_task(id: int):
    prisma = Prisma()
    await prisma.connect()
    if request.method == 'DELETE':
        deleted_task = (await prisma.tasks.delete(where={'id': id})).dict()
        await prisma.disconnect()
        return jsonify({'task': deleted_task})


if __name__ == '__main__':
    app.run()
