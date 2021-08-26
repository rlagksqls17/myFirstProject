import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from "./redux/store"
import MainPage from "./page/mainpage"
import LoginPage from "./page/loginpage"
import JoinPage from "./page/joinpage"
import './App.css';


function App(){
  return(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/join" component={JoinPage}/>
          <Route path="/main" component={MainPage}/>
          <Route path="/" component={LoginPage}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}


export default App;