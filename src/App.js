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

function App() {
  // const currentUser = useCurrentUser();
  
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <p>Home page</p>
            )}
          />   
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/tasks/" render={() => <TaskList />} />
          <Route exact path="/teams/" render={() => <TeamList />} />
          <Route exact path="/team/create" render={() => <CreateTeamForm />}/>  
          <Route exact path="/task/create" render={() => <CreateTaskForm />}/>      
          <Route exact path="/tasks/:id/edit" render={() => <EditTaskForm />}/>
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
