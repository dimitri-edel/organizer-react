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
import { MoreDropdown } from "../../components/MoreDropdown";
import Team from "./Team";


function TeamList() {
    const [teams, setTeams] = useState({ results: [] });
    // updateTaskList flag is needed for signaling that the task list 
    // has been changed. For example when a task has been added or deleted
    // by another component
    const [updateTeamList, setUpdateTeamList] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(true);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Fetch all Teams objects corresponding to the query, if the query is empty
        // then all Teams belonging to the user will be fetched
        const fetchTeams = async () => {
            try {
                const { data } = await axiosReq.get(`/team/?search=${query}`);
                // const { data } = await axiosReq.get(`/Teams/?search=${query}`);            
                setTeams(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        setHasLoaded(false);
        setUpdateTeamList(false);

        fetchTeams();

        // clear the timer when unmounting
        return () => {
            // clearTimeout(timer);
        };
    }, [query, pathname, updateTeamList]);


    return (
        <div>
            <Row className="h-100">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
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
                            placeholder="Search Teams"
                        />
                    </Form>
                </Col>
            </Row>
            {hasLoaded ? (
                <>
                    {teams.results.length ? (
                        <InfiniteScroll
                            children={teams.results.map(team => {
                                return (
                                    <Team key={team.name + "" + team.owner} {...team} setUpdateTeamList={setUpdateTeamList} />
                                )
                            })}
                            dataLength={teams.results.length}
                            loader={<Asset spinner />}
                            hasMore={!!teams.next}
                            next={() => fetchMoreData(teams, setTeams)}
                        />
                    ) : (
                        <Container className={appStyles.Content}>
                            <Asset src={NoResults} message="No results!" />
                        </Container>
                    )}
                </>
            ) : (
                <Container className={appStyles.Content}>
                    <Asset spinner />
                </Container>
            )}
        </div>
    )
}

export default TeamList;