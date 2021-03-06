import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Auth } from 'aws-amplify';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        cursor: 'pointer',
    },
}));

export const Header = () => {
    const classes = useStyles();

    const logout = async () => {
        console.log('Called');
        try {
            await Auth.signOut();
            window.location.reload();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const showList = () => {
        window.location.href = '/';
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title} onClick={showList}>
                        Task Tracker
                    </Typography>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}