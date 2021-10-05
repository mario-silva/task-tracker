import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTasks} from "../../graphql/queries";

export const ListView = () => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const taskData = await API.graphql(graphqlOperation(listTasks));
            const taskList = taskData.data.listTasks.items;
            console.log('Task list', taskList);
            setTasks(taskList);
        } catch (error) {
            console.log('error on fetching tasks', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="taskList">
            {tasks.map((task, idx) => {
                return (
                    <div variant="outlined" elevation={2} key={`task${idx}`}>
                        <div className="taskCard">
                            <div>
                                <div className="title">{task.title}</div>
                            </div>
                            <div className="songDescription">{task.description}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};