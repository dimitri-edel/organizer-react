import NoResults from "../../assets/no-results.png";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import styles from "../../styles/TeamList.module.css";
import { useLocation } from "react-router-dom";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Team from "./Team";
import { useCurrentUser } from "../../context/CurrentUserContext";

function TeamList() {
    // See if the user is logged in
    const currentUser = useCurrentUser();
    const [teams, setTeams] = useState({ results: [] });
    // updateTaskList flag is needed for signaling that the task list 
    // has been changed. For example when a task has been added or deleted
    // by another component
    const [updateTeamList, setUpdateTeamList] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(true);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        document.title = "Teams";
        // Fetch all Teams objects corresponding to the query, if the query is empty
        // then all Teams belonging to the user will be fetched
        const fetchTeams = async () => {
            try {
                const { data } = await axiosReq.get(`/team/?search=${query}&limit=7&offset=0`);
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
        <>
            {
                (currentUser === null) ? (
                    <h1>Please log in first</h1>
                ) : (
                    <>
                        <Container className={styles.SearchBar}>
                            <Row className="h-100">
                                <Col xs={10}>
                                    <Form
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
                                <Col xs={1} className={styles.SearchIconColumn}>
                                    <i className={`fas fa-search ${styles.SearchIcon}`} />
                                </Col>
                            </Row>
                        </Container>
                        {hasLoaded ? (
                            <>
                                {teams.results.length ? (
                                    <Container id="team-content-panel" className={appStyles.Content}>
                                        <InfiniteScroll
                                            children={teams.results.map(team => {
                                                return (
                                                    <Team key={team.name + "" + team.owner} {...team} setUpdateTeamList={setUpdateTeamList} />
                                                )
                                            })}
                                            scrollableTarget="team-content-panel"
                                            dataLength={teams.results.length}
                                            loader={<Asset spinner />}
                                            hasMore={!!teams.next}
                                            next={() => fetchMoreData(teams, setTeams)}
                                        />
                                    </Container>
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
                    </>
                )}
        </>
    )
}

export default TeamList;