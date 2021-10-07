import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTasks} from "../../graphql/queries";
import {Button, Link, makeStyles, Typography} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {dateTimeObjFromString, getDateTime} from "../../utils/datetime";

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

const useStyles = makeStyles((theme) => ({
    pushDown: {
        marginTop: theme.spacing(2),
    },
    dataGrid: {
        display: 'flex',
        height: '100%',
        marginTop: theme.spacing(2),
    }
}));

export const ListView = () => {
    const classes = useStyles();
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
        <div>
            <Typography variant="h2" component="h2" className={classes.pushDown}>
                All your tasks
            </Typography>

            <Button
                href={'#/task/new'}
                variant="contained"
                color="primary"
                className={classes.pushDown}
            >
                Create new Task
            </Button>

            <div className={classes.dataGrid}>
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