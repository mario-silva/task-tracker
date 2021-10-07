import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {Button, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {useForm} from "react-hook-form";
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {getTask} from "../../graphql/queries";
import {createTask, updateTask} from "../../graphql/mutations";
import {today, getDate, dateTimeObjFromString} from "../../utils/datetime";
import {statuses} from "../../bl/task";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            marginTop: theme.spacing(2),
        },
        '& .MuiButtonBase-root': {
            marginTop: theme.spacing(1),
        }
    },
    pushRight: {
        marginLeft: theme.spacing(1),
    },
    pushDown: {
        marginTop: theme.spacing(3),
    },
}));



export const CreateOrEdit = () => {
    const classes = useStyles();
    const { taskID } = useParams();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    // for some reason the Material UI Select doesn't work with the register
    // the way the text fields do. So this is a hack for it :/
    const status = watch("status", '');
    // same with the datepicker.
    const [selectedDate, setSelectedDate] = useState(today());

    const onSubmit = async (data) => {
        let date = selectedDate;
        if (typeof selectedDate === 'string') {
            // if you don't change the date when you're updating a task
            // it comes as a string :/
            date = dateTimeObjFromString(selectedDate);
        }
        data.dueDate = getDate(date);
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
                const result = await API.graphql(graphqlOperation(getTask, {id: taskID}));
                const taskData = result.data.getTask;
                setSelectedDate(taskData.dueDate);
                ['title', 'description', 'status'].forEach(fieldName => {
                    setValue(fieldName, taskData[fieldName]);
                });
            } catch (error) {
                console.log('error on fetching tasks', error);
            }
        };
        if (taskID) {
            fetchTask();
        }
    }, [taskID]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
            <Typography variant="h4" component="h4" className={classes.pushDown}>
                {taskID ? 'Edit task' : 'Create new task'}
            </Typography>
            <div>
                <TextField
                    fullWidth
                    label="Title"
                    InputLabelProps={{ shrink: true }}
                    error={errors.title}
                    {...register("title", { required: true })}
                />
            </div>
            <div>
                <TextField
                    fullWidth
                    label="Description"
                    multiline
                    InputLabelProps={{ shrink: true }}
                    rows={4}
                    {...register("description", { required: true })}
                    variant="outlined"
                    error={errors.description}
                />
            </div>
            <div className={classes.pushRight}>
                <FormControl>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                        fullWidth
                        labelId="status"
                        id="status-select"
                        label="Status"
                        autoWidth
                        name="status"
                        value={status}
                        error={errors.status}
                        {...register("status", { required: true })}
                    >
                        {statuses.map(option => (
                            <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </MuiPickersUtilsProvider>
            </div>
            <div className={classes.pushRight}>
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </div>
        </form>
    );
}