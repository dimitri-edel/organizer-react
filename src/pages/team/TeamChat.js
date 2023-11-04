import React, { useState } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessageBoard from "./TeamMessageBoard";

const TeamChat = (props) => {
    const currentUser = useCurrentUser();
    // const is_owner = currentUser?.username === owner;
    const history = useHistory();
    // Retrieve the parameter passed in the route name(URL)
    const { team_id } = useParams();

    return (
        <div className={styles.ChatRoom}>
            <h1>Team ID = {team_id}</h1>
            <div>Filters</div>
            <TeamMessageBoard team_id={team_id} />
            <div>Team Message Post</div>
        </div>
    )
}

export default TeamChat;