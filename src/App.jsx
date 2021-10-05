import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import './App.css';
import {Route, HashRouter} from "react-router-dom";
import { ListView } from "./views/ListView";
import { CreateOrEdit } from "./views/CreateOrEdit";
import {Container} from "@material-ui/core";
import {Header} from "./components/Header";

Amplify.configure(awsconfig);



function App() {
    return (
    <Container>
        <Header />
        <HashRouter>
            <Route path="/" exact={true} component={ListView} />
            <Route path="/task/:taskID" exact={true} component={CreateOrEdit} />
            <Route path="/task/new" exact={true} component={CreateOrEdit} />
        </HashRouter>
    </Container>
);
}

export default withAuthenticator(App);
