import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {getTask} from "../../graphql/queries";
import {createTask, updateTask} from "../../graphql/mutations";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {useForm} from "react-hook-form";
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {today, getDate} from "../../utils";

const statuses = [
    {
        label: 'To Do',
        value: 'toDo',
    },
    {
        label: 'In Progress',
        value: 'inProgress',
    },
    {
        label: 'Done',
        value: 'done',
    },
];

export const CreateOrEdit = () => {
    const { taskID } = useParams();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [selectedDate, handleDateChange] = useState(today());

    const { task, setTask } = useState({
        title: '',
        description: '',
        status: '',
        dueDate: '',
    });

    const onSubmit = async (data) => {
        data.dueDate = getDate(selectedDate);
        if (taskID) {
            data.id = taskID;
            await API.graphql({query: updateTask, variables: {input: data}});
        }
        else {
            await API.graphql({query: createTask, variables: {input: data}});
        }
        window.location.replace("/");
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskData = await API.graphql(graphqlOperation(getTask), {id: taskID});
                console.log('Task list', taskData);
                // const taskList = taskData.data.listTasks.items;
                // setTask(taskList);
            } catch (error) {
                console.log('error on fetching tasks', error);
            }
        };
        if (taskID) {
            fetchTask();
        }
    }, [taskID, task]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextField
                    label="Title"
                    // value={task ? task.title : ''}
                    {...register("title", { required: true })}
                />
            </div>
            <div>
                <TextField
                    label="Description"
                    // value={task ? task.description : ''}
                    {...register("description", { required: true })}
                />
            </div>
            <FormControl>
                <InputLabel id="status">Status</InputLabel>
                <Select
                    labelId="status"
                    id="status-select"
                    // value={task ? task.status : ''}
                    label="Status"
                    autoWidth
                    name="status"
                    {...register("status", { required: true })}
                >
                    {statuses.map(option => (
                        <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker value={selectedDate} onChange={handleDateChange} />
                </MuiPickersUtilsProvider>

                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </FormControl>
        </form>
    );
}