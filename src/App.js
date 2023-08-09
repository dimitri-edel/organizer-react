import logo from './logo.svg';
import styles from './App.module.css';
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import { useCurrentUser } from "./context/CurrentUserContext";
import NavBar from "./components/NavBar";
import TaskList from './pages/task/TaskList';
import CreateTaskForm from './pages/task/CreateTaskForm';
import EditTaskForm from './pages/task/EditTaskForm';

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
              <TaskList />
            )}
          />   
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/task/create" render={() => <CreateTaskForm />}/>      
          <Route exact path="/task/:id/edit" render={() => <EditTaskForm />}/>
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
