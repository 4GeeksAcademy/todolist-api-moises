import React, { useEffect, useState } from "react";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && newTask.trim()) {
            await addTaskToServer(newTask.trim());
            setNewTask("");
        }
    };

    const handleDelete = (taskId) => {
        deleteTask(taskId).then(() => {
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        });
    };

    // Obtener lista del servidor
    function getTodos() {
        fetch('https://playground.4geeks.com/todo/users/moises', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
                return resp.json();
            })
            .then(data => {
                console.log(data);
                setTasks(data.todos);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(
        () => {
            getTodos()
        }, []
    );

    // Añadir tarea
    const addTaskToServer = async (taskLabel) => {
        const updatedTasks = { label: taskLabel, is_done: false };
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/moises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTasks),
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.id) {
                    updatedTasks.id = data.id;
                    setTasks([...tasks, updatedTasks]);
                    console.log("Tarea agregada correctamente.");
                } else {
                    console.error("No se recibió un ID de la tarea desde el servidor.");
                }
            } else {
                console.error("Error al agregar tarea:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    // Eliminar todas las tareas
    const resetUser = async () => {
        const url = "https://playground.4geeks.com/todo/users/moises";

        try {
            const deleteResponse = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!deleteResponse.ok) {
                console.error("Error al eliminar todas las tareas:", deleteResponse.statusText);
                return;
            }

            console.log("Tareas eliminadas correctamente.");

            const createResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([]),
            });

            if (createResponse.ok) {
                console.log("Lista de tareas creada correctamente.");
                setTasks([]);
            } else {
                console.error("Error al crear lista de tareas:", createResponse.statusText);
            }
        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
        }
    };

    // Eliminar tarea específica
    const deleteTask = async (taskId) => {
        const url = `https://playground.4geeks.com/todo/todos/${taskId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Tarea con ID ${taskId} eliminada exitosamente`);
            } else {
                console.error(`Error al eliminar la tarea con ID ${taskId}:`, response.statusText);
            }
        } catch (error) {
            console.error("Error al intentar eliminar la tarea:", error);
        }
    };

    return (
        <div className="todo-container">
            <h1 className="todo-title">TodoList</h1>
            <input
                type="text"
                className="todo-input"
                placeholder="Añadir una tarea"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <ul className="todo-list">
                {tasks.length > 0 ? (
                    <>
                        {tasks.map((task, index) => (
                            <li key={index} className="task-item">
                                <span className="task-text">{task.label}</span>
                                <button onClick={() => handleDelete(task.id)} className="delete-button">Eliminar</button>
                            </li>
                        ))}
                        <li className="task-count">
                            Tareas pendientes: {tasks.length}
                        </li>
                    </>
                ) : (
                    <li className="empty-list">No hay tareas, añadir tareas</li>
                )}
            </ul>
            <button onClick={resetUser} className="modern-button">Vaciar lista</button>
        </div>
    );
};

export default Home;
