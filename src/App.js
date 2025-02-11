import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/pages/home";
import About from "./components/pages/about";
import Levels from "./components/pages/levels";
import Rules from "./components/pages/rules";
import ht from "./components/pages/howtoplay";
import lt from "./components/pages/levelset";
import l2 from "./components/pages/level2";
import l3 from "./components/pages/level3"
import l4 from "./components/pages/level4"
import l5 from "./components/pages/level5"

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/levels" component={Levels} />
          <Route path="/rules" component={Rules} />
          <Route path="/ht" component={ht}/>
          <Route path = "/lt" component={lt}/>
          <Route path = "/l2" component={l2}/>
          <Route path = "/l3" component={l3}/>
          <Route path = "/l4" component={l4}/>
          <Route path = "/l5" component={l5}/>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
