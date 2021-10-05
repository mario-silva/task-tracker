import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTasks} from "../../graphql/queries";
import {Link} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const columns = [
    {
        field: 'title',
        headerName: 'Title',
        width: 150,
        editable: true,
        renderCell: (params) => {
            const link = `#/task/${params.id}`;
            const text = params.row.title;
            return (
                <Link href={link}>
                    {text}
                </Link>
            );
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: true,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 210,
        editable: true,
    },
];

export const ListView = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const taskData = await API.graphql(graphqlOperation(listTasks));
                const taskList = taskData.data.listTasks.items;
                setTasks(taskList);
            } catch (error) {
                console.log('error on fetching tasks', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="taskList" style={{ height: 400 }}>
            <DataGrid
                rows={tasks}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
            />
        </div>
    );
};