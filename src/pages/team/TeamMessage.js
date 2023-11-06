import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessageBoard from "./TeamMessageBoard";

const TeamMessage = ({ message, setEditMessageId, setReload }) => {
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === message.owner;
    const history = useHistory();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    /**
     * Show the Confirm Dialog for deleteing
     */
    const handleShowConfirmDialog = () => {
        setShowConfirmDialog(true);
    }
    /**
     * Close the Confirm Dialog for deleteing
     */
    const handleCloseConfirmDialog = () => {
        setShowConfirmDialog(false);
    }
    /**
     * Delete the message, because the user confirmed the delete
     */
    const handleConfirmDialogDeleteClicked = () => {
        const handleDelete = async () => {
            try {
                await axiosRes.delete(`/team-chat-delete/${message.id}`);
                // Set the flag to true for TeamChat.js, so the useEffectHook be executed
                // and all the messages on the message board be reloaded
                setReload(true);
            } catch (err) {
                console.log(err);
            }
        };

        handleDelete();
        // Close the confirm dialog
        setShowConfirmDialog(false);
    }

    const onEditClick = () => {
        console.log("Edit clicked!" + message.id);
        setEditMessageId(message.id);
    }

    return (
        <div className={styles.ChatRoom}>
            <Container>
                <Row>
                    <Col>
                        <span>
                            <span className={is_owner ? styles.OwnerUserName : styles.UserName}>{message.owner}</span>
                            <span className={styles.TimeStamp}>{message.created_at}</span>
                        </span>
                        <span className={styles.Message}>{message.message}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {message.image && <figure>
                            <Image className={styles.Image} src={message.image} rounded />
                        </figure>}
                    </Col>
                </Row>
                {is_owner && <Row>
                    <Col>
                        <button className={styles.EditButton} onClick={onEditClick}>Edit</button>
                    </Col>
                    <Col>
                        <button className={styles.DeleteButton} onClick={handleShowConfirmDialog}> Delete</button>
                    </Col>
                </Row>
                }
            </Container>
            <Modal show={showConfirmDialog} onHide={handleCloseConfirmDialog} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this Message?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmDialog} >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDialogDeleteClicked} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TeamMessage;