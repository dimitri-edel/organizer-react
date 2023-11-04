import styles from './App.module.css';
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import NavBar from "./components/NavBar";
import TaskList from './pages/task/TaskList';
import CreateTaskForm from './pages/task/CreateTaskForm';
import EditTaskForm from './pages/task/EditTaskForm';
import TeamList from './pages/team/TeamList';
import CreateTeamForm from './pages/team/CreateTeamForm';
import EditTeamForm from './pages/team/EditTeamForm';
import TeamChat from './pages/team/TeamChat';
import { useCurrentUser } from './context/CurrentUserContext';
import Home from "./pages/home";

function App() {
  const currentUser = useCurrentUser();

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Home />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/tasks/" render={() => <TaskList />} />
          <Route exact path="/teams/" render={() => <TeamList />} />
          <Route exact path="/teams/create" render={() => <CreateTeamForm />} />
          <Route exact path="/teams/:id/edit" render={() => <EditTeamForm />} />
          <Route exact path="/tasks/create" render={() => <CreateTaskForm />} />
          <Route exact path="/tasks/:id/edit" render={() => <EditTaskForm />} />
          <Route exact path="/team-chat/:team_id/" render={() => <TeamChat />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
