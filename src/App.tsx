import {
  HashRouter as Router, Switch, Route,
} from 'react-router-dom'
import ENSReverse from './ENSReverse'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <Router>
    <Switch>
      <Route path='/:name?' component={ENSReverse}/>
    </Switch>
  </Router>
)