import React, { useState } from "react";
import styles from "../../styles/Team.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip, Modal, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

const Team = (props) => {
    const {
        id,
        owner,
        name,
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
                await axiosRes.delete(`/task/${id}`);
                // Set the flag to true for TaskList.js, so the useEffectHook is executed
                setUpdateTeamList(true);
                history.push("/");
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


    return (
        <Card className={styles.Team}>
            <Card.Body>
                <Card.Header>
                    { name  }
                </Card.Header>
                <Card.Title>
                    {owner}
                </Card.Title>

                {/* If the user is the owner of the task then provide edit and delete buttons*/}
                <Card.Footer>
                    {is_owner && (<Container>
                        <Row>
                            <Col>
                                <Button variant="primary" onClick={handleEdit} size="sm">
                                    <i className="fas fa-edit"></i>Edit
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="danger" onClick={handleShowConfirmDialog} size="sm">
                                    <i className="fas fa-edit"></i>Delete
                                </Button>
                            </Col>
                        </Row>
                    </Container>)}
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
        </Card>

    );
};

export default Team;