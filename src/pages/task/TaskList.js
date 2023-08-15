import NoResults from "../../assets/no-results.png";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
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

function TaskList() {
  const [tasks, setTasks] = useState({ results: [] });
  const [updateTaskList, setUpdateTaskList] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(true);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Fetch all tasks objects corresponding to the query, if the query is empty
    // then all tasks belonging to the user will be fetched
    const fetchtasks = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/?search=${query}`);
        // const { data } = await axiosReq.get(`/tasks/?search=${query}`);            
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    setUpdateTaskList(false);

    fetchtasks();

    // clear the timer when unmounting
    return () => {
      // clearTimeout(timer);
    };
  }, [query, pathname, updateTaskList]);

  return (
    <div>
      {
        <Calendar setQuery={setQuery} />
      }


      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={8}>
          <p>Popular profiles mobile</p>
          <i className={`fas fa-search ${styles.SearchIcon}`} />
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
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          <p>Popular profiles for desktop</p>
        </Col>
      </Row>
    </div>
  );
}

export default TaskList;