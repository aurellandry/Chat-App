import React, { Component } from 'react';
import Routes from "../../Routes";
import Navigation from '../Navigation/index';
import { Provider } from 'react-redux';
import Store from '../../Store/configureStore';

class App extends Component {
    render() {
        return (
            <div>
                <Navigation />
                <div className="App">
                    <Provider store={Store}>
                        <Routes />
                    </Provider>
                </div> 
            </div>
        );
    }
}
 
export default App;