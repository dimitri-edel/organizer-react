import React, { useState } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessageBoard from "./TeamMessageBoard";
import TeamMessagePostForm from "./TeamMessagePostForm";
import TeamChatFilters from "./TeamChatFilters";
import TeamChatSidbar from "./TeamChatSidebar";
import StaticContext from "../../context/StaticContext";
import PrivateMessageBoard from "./PrivateMessageBoard";
import PrivateMessagePostForm from "./PrivateMessagePostForm";

const TeamChat = (props) => {
    const currentUser = useCurrentUser();
    // const is_owner = currentUser?.username === owner;
    const history = useHistory();
    // Retrieve the parameter passed in the route name(URL)
    const { team_id } = useParams();
    // Flag for reloading the message board, if new messages
    // have been added or removed from the board
    const [reload, setReload] = useState(false);
    // Value for search filter
    const [searchFilter, setSearchFilter] = useState("");
    // Value for time filter (API expects a GET parameter &minus_days=? )
    // This filter returns messages that were posted in the past ? days
    const [timeFilter, setTimeFilter] = useState(0);
    // This is the id of a team member who was picked for a private chat
    // If it is null then the TeamMessageBoard will be displayed
    // If the state holds a valid value, then the PrivateMessageBoard
    // will be rendered
    const [privateMessageUserId, setPrivateMessageUserId] = useState(null);



    return (
        <div className={styles.ChatRoom}>
            <h1 className={styles.TeamName}>{StaticContext.SELECTED_TEAM}</h1>
            <Container>
                <Row>
                    <Col md={2}>
                        <TeamChatSidbar team_id={team_id} setPrivateMessageUserId={setPrivateMessageUserId} />
                    </Col>
                    <Col>
                        {(privateMessageUserId == null) ? (
                            <>
                                <TeamChatFilters
                                    setSearchFilter={setSearchFilter}
                                    setTimeFilter={setTimeFilter}
                                    searchFilter={searchFilter}
                                    timeFilter={timeFilter}
                                />
                                <TeamMessageBoard
                                    team_id={team_id}
                                    setReload={setReload}
                                    reload={reload}
                                    searchFilter={searchFilter}
                                    timeFilter={timeFilter} />
                                <TeamMessagePostForm team_id={team_id} setReload={setReload} />
                            </>
                        ) : (
                            <>
                                <PrivateMessageBoard
                                    privateMessageUserId={privateMessageUserId}
                                    team_id={team_id}
                                    setReload={setReload}
                                    reload={reload}
                                    searchFilter={searchFilter}
                                    timeFilter={timeFilter} />
                                <PrivateMessagePostForm
                                    privateMessageUserId={privateMessageUserId}
                                    team_id={team_id} setReload={setReload}
                                />
                            </>

                        )}

                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default TeamChat;