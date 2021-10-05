import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTasks} from "../../graphql/queries";
import {Button, Link, Typography} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {dateTimeObjFromString, getDateTime} from "../../utils";

const columns = [
    {
        field: 'title',
        headerName: 'Title',
        minWidth: 110,
        flex: 1,
        editable: true,
        renderCell: (params) => {
            const link = `#/task/edit/${params.id}`;
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
        minWidth: 150,
        flex: 1,
        editable: true,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        minWidth: 210,
        flex: 1,
        editable: true,
    },
    {
        field: 'updatedAt',
        headerName: 'Last updated',
        minWidth: 210,
        flex: 1,
        editable: true,
        renderCell: (params) => {
            const text = params.row.updatedAt;
            return getDateTime(dateTimeObjFromString(text));
        },
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
        <div style={{ height: 400, width: '100%' }}>
            <Typography variant="h2" component="h2">
                All your tasks
            </Typography>

            <Button href={'#/task/new'} variant="contained" color="primary">
                Create new Task
            </Button>

            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                    <DataGrid
                        autoHeight
                        rows={tasks}
                        columns={columns}
                        pageSize={5}
                        disableSelectionOnClick
                    />
                </div>
            </div>
        </div>
    );
};