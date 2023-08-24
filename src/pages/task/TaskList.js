import NoResults from "../../assets/no-results.png";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/FormLabel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import styles from "../../styles/TaskList.module.css";
import { useLocation } from "react-router-dom";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Task from "./Task";
import Calendar from "../../components/Calendar";
import { useCurrentUser } from "../../context/CurrentUserContext";

/**
 * TaskList is a React Component that retrieves a list of tasks from the API and renders it
 * @returns JSX of the TaskList Component
 */
function TaskList() {
  /**
   * Reference to the current user object, that is used in the request header
   */
  const currentUser = useCurrentUser();
  // Task list retrieved from the API
  const [tasks, setTasks] = useState({ results: [] });
  // updateTaskList flag is needed for signaling that the task list 
  // has been changed. For example when a task has been added or deleted
  // by another component
  const [updateTaskList, setUpdateTaskList] = useState(true);
  // Flag if the task list has loaded
  const [hasLoaded, setHasLoaded] = useState(true);
  const { pathname } = useLocation();
  // Search query that will be attached to the Request
  const [query, setQuery] = useState("");
  // Filters that will be attached to the Request
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    category: ""
  });

  /**
   * Handle selection of filters by user.
   * Copy filter name and selected value to the state object
   * @param {Event} event 
   */
  const filterSelected = (event) => {
    setFilters((prev) => {
      return { ...prev, [event.target.name]: event.target.value, }
    });
  };

  useEffect(() => {
    /**
     * String of filters to be attached to the Request
     */
    const filterQuery =
      "&priority=" + filters["priority"] +
      "&status=" + filters["status"] +
      "&category=" + filters["category"]

    // Set the title in the browser
    document.title = "Tasks";
    /**
     * Fetch all tasks objects corresponding to the query, if the query is empty
     * then all tasks belonging to the user will be fetched
     */
    const fetchtasks = async () => {
      try {
        // I want the tasks to be ordered by their due date at all times
        const { data } = await axiosReq.get(`/tasks/?search=${query}&ordering=due_date${filterQuery}`);
        setTasks(data);
        // Signal that the content has been loaded
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    // Signal that the content has not loaded yet
    setHasLoaded(false);
    // Do not update the Task list, this flag is used by the Task Component
    setUpdateTaskList(false);

    fetchtasks();
  }, [query, pathname, updateTaskList, filters]);

  return (
    <>
      {
        currentUser === null ? (
          <h1>Please Log in first</h1>
        ) : (<div>
          {
            <Calendar setQuery={setQuery} />
          }


          <Row className="h-100">
            <Col xs={1}>
              <i className={`fas fa-search ${styles.SearchIcon}`} />
            </Col>
            <Col xs={11}>
              <Form
                className={styles.SearchBar}
                onSubmit={(event) => event.preventDefault()}
              >
                <Form.Control
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  className="mr-sm-2"
                  placeholder="Search tasks"
                />
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs={1}>
              <i className="fa-solid fa-filter"></i>
            </Col>
            <Col>
              <FormLabel>Category</FormLabel>
              <Form.Control
                as="select"
                name="category"
                onChange={filterSelected}>
                <option value="">All</option>
                <option value="0">Chore</option>
                <option value="1">Errand</option>
                <option value="2">Work</option>
              </Form.Control>
            </Col>
            <Col>
              <FormLabel>Priority</FormLabel>
              <Form.Control
                as="select"
                name="priority"
                onChange={filterSelected}>
                <option value="">All</option>
                <option value="0">High</option>
                <option value="1">Middle</option>
                <option value="2">Low</option>
              </Form.Control>
            </Col>
            <Col>
              <FormLabel>Status</FormLabel>
              <Form.Control
                as="select"
                name="status"
                onChange={filterSelected}>
                <option value="">All</option>
                <option value="0">Open</option>
                <option value="1">Progressing</option>
                <option value="2">Done</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" xs={12}>
              {hasLoaded ? (
                <>
                  {tasks.results.length ? (
                    <InfiniteScroll
                      children={tasks.results.map((task) => (
                        <Task key={task.title} {...task} setUpdateTaskList={setUpdateTaskList} />
                      ))}
                      dataLength={tasks.results.length}
                      loader={<Asset spinner />}
                      hasMore={!!tasks.next}
                      next={() => fetchMoreData(tasks, setTasks)}
                    />
                  ) : (
                    <Container className={appStyles.Content}>
                      <Asset src={NoResults} message={"no results found!e"} />
                    </Container>
                  )}
                </>
              ) : (
                <Container className={appStyles.Content}>
                  <Asset spinner />
                </Container>
              )}
            </Col>
          </Row >
        </div >)
      }
    </>);
}

export default TaskList;