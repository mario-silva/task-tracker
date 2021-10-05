import Amplify from 'aws-amplify';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import './App.css';
import {Route, HashRouter} from "react-router-dom";
import { ListView } from "./views/ListView";
// import { DetailView } from "./views/DetailView";
// import { CreateOrEdit } from "./views/CreateOrEdit";

Amplify.configure(awsconfig);



function App() {
    return (
    <div className="App">
        <header className="App-header">
            <AmplifySignOut />
        </header>
        <HashRouter>
            <Route path="/" exact={true} component={ListView} />
            {/*<Route path="/task/:taskID" exact={true} component={DetailView} />*/}
            {/*<Route path="/task/new" exact={true} component={CreateOrEdit} />*/}
        </HashRouter>
    </div>
);
}

export default withAuthenticator(App);
