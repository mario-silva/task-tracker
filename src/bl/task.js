export const statuses = [
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

export const statusValueToLabel =
    statuses.reduce((a, v) => ({ ...a, [v.value]: v.label}), {});