import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessageBoard from "./TeamMessageBoard";

const TeamMessage = ({ message }) => {
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === message.owner;
    const history = useHistory();

    const onEditClick = () => {
        console.log("Edit clicked!" + message.id);
    }

    return (
        <div className={styles.ChatRoom}>
            {/* <h1>message ID = {message.id}</h1>
            <p>team ID = {message.team}</p> */}
            <Container>
                <Row>
                    <Col xs={4} md={2} className={styles.LeftPanel}>
                        <div className={is_owner ? styles.OwnerUserName : styles.UserName}>{message.owner}</div>
                        <div className={styles.TimeStamp}>{message.created_at}</div>
                    </Col>
                    <Col>
                        <div className={styles.Message}>{message.message}</div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {message.image && <figure>
                            <Image className={styles.Image} src={message.image} rounded />
                        </figure>}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button className={styles.EditButton} onClick={onEditClick}>Edit</button>
                    </Col>
                    <Col>
                        <button className={styles.DeleteButton}> Delete</button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default TeamMessage;