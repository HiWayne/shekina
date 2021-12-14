import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import Page from "./page/Page";
import Configure from "./page/Configure";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Redirect to="config" />
      </Route>
      <Route path="/config">
        <Configure />
      </Route>
      <Route path="/page">
        <Page />
      </Route>
      <Route path="/page/:path">
        <Page />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
