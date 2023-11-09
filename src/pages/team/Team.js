import React, { useState } from "react";
import styles from "../../styles/Team.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

const Team = (props) => {
    const {
        id,
        owner,
        name,
        is_member,
        setUpdateTeamList,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleShowConfirmDialog = () => {
        setShowConfirmDialog(true);
    }

    const handleCloseConfirmDialog = () => {
        setShowConfirmDialog(false);
    }

    const handleConfirmDialogDeleteClicked = () => {
        const handleDelete = async () => {
            try {
                await axiosRes.delete(`/team/${id}`);
                // Set the flag to true for TeamList.js, so the useEffectHook is executed
                setUpdateTeamList(true);
                history.replace("/teams/");
            } catch (err) {
                console.log(err);
            }
        };

        handleDelete();
        setShowConfirmDialog(false);
    }

    const handleEdit = () => {
        history.push(`${id}/edit`);
    };

    const handleJoinTeam = async () => {
        const formData = new FormData();

        formData.append("team", id);
        formData.append("member", currentUser.id)

        try {
            await axiosReq.post("membership/", formData);
            history.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    const handleLeaveTeam = async () => {
        try {
            await axiosRes.delete(`leave/team/${id}`);
            // Set the flag to true for TaskList.js, so the useEffectHook is executed
            setUpdateTeamList(true);
            history.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Card className={styles.Team}>
            <Card.Body>
                <Card.Header className={styles.Title}>
                    {name}
                </Card.Header>
                <Card.Title>
                    <i className={"fa-solid fa-user " + styles.UserIcon}></i>{owner}
                </Card.Title>

                {/* If the user is the owner of the task then provide edit and delete buttons*/}
                <Card.Footer>
                    {is_owner ? (<Container>
                        <Row>
                            <Col>
                                <Link to={"/team-chat/" + id + "/"}>
                                    <button className={styles.ChatButton}>
                                        <i className={"fa-regular fa-chart-bar " + styles.Icon}></i>
                                        Team chat
                                    </button>
                                </Link>
                            </Col>
                            <Col>
                                <button onClick={handleEdit} size="sm" className={styles.RenameButton}>
                                    <i className={"fas fa-edit " + styles.Icon}></i>Rename
                                </button>
                            </Col>
                            <Col>
                                <button onClick={handleShowConfirmDialog} size="sm" className={styles.DeleteButton}>
                                    <i className={"fa-solid fa-trash-can " + styles.Icon}></i>Delete
                                </button>
                            </Col>
                        </Row>
                    </Container>) : (
                        is_member ? (
                            <Container className={styles.ControlPanel}>
                                <Row>
                                    <Col>
                                        <Link to={"/team-chat/" + id + "/"}>
                                            <button className={styles.ChatButton}>
                                                <i className={"fa-regular fa-chart-bar " + styles.Icon}></i>
                                                Team chat
                                            </button>
                                        </Link>
                                    </Col>
                                    <Col>
                                        <button onClick={handleLeaveTeam} className={styles.LeaveButton}>
                                            <i className={"fa-solid fa-circle-xmark " + styles.Icon}></i>
                                            Leave
                                        </button>
                                    </Col>
                                </Row>
                            </Container>
                        ) : (
                            <Container className={styles.ControlPanel}>
                                <Row>
                                    <Col sm={1} md={2} lg={3}>
                                    </Col>
                                    <Col>
                                        <button onClick={handleJoinTeam} className={styles.JoinButton}>
                                            Join
                                        </button>
                                    </Col>
                                    <Col sm={1} md={2} lg={3}>
                                    </Col>
                                </Row>
                            </Container>
                        )
                    )}
                </Card.Footer>
                <Modal show={showConfirmDialog} onHide={handleCloseConfirmDialog} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please confirm delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this team?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmDialog}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirmDialogDeleteClicked}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card >

    );
};

export default Team;