import { Switch, Route, Redirect } from 'react-router-dom';

// importing components
import Header from '../components/Header/Header';
import Join from '../pages/Join';
import Main from '../pages/Main';

const Routes = () => {
  return (
    <>
      <Header />

      <Switch>
        <Route exact path="/">
          <Redirect to="/Join" />
        </Route>

        <Route exact path="/Join" component={Join} />
        <Route exact path="/Main/:Room" component={Main} />
      </Switch>
    </>
  );
};

export default Routes;
