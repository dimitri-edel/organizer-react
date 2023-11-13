import { useState } from 'react';
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
import TeamChat from './pages/team/TeamChat';
import { useCurrentUser } from './context/CurrentUserContext';
import Home from "./pages/home";

function App() {
  const currentUser = useCurrentUser();
  const [showAddTaskMenuItem, setShowAddTaskMenuItem] = useState(false);
  const [showAddTeamMenuItem, setShowAddTeamMenuItem] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  return (
    <div className={styles.App}>
      <NavBar showAddTaskMenuItem={showAddTaskMenuItem} showAddTeamMenuItem={showAddTeamMenuItem} />
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
          <Route exact path="/tasks/" render={() => <TaskList setShowAddTaskMenuItem={setShowAddTaskMenuItem} />} />
          <Route exact path="/teams/" render={() => <TeamList setShowAddTeamMenuItem={setShowAddTeamMenuItem} setSelectedTeamName={setSelectedTeamName} />} />
          <Route exact path="/teams/create" render={() => <CreateTeamForm />} />
          <Route exact path="/tasks/create" render={() => <CreateTaskForm />} />
          <Route exact path="/tasks/:id/edit" render={() => <EditTaskForm />} />
          <Route exact path="/team-chat/:team_id/" render={() => <TeamChat selectedTeamName={selectedTeamName} />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
