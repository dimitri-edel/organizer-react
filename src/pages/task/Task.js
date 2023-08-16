import React, { useState } from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip, Modal, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Task = (props) => {
    const {
        id,
        owner,
        asigned_to,
        title,
        comment,
        due_date,
        category,
        priority,
        status,
        file,
        setUpdateTaskList,
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
                setUpdateTaskList(true);
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


    // Category comes in as an integer 0 - 2 (chore, errand, work)
    // The integer needs to be convertad into an actuall name
    const getCategoryName = (IntCategory) => {
        switch (IntCategory) {
            case 0:
                return "Chore";
            case 1:
                return "Errand";
            case 2:
                return "Work";
        }
    }

    // Priority comes in as an integer 0 - 2 (hight, middle, low)
    // The integer needs to be convertad into an actuall name
    const getPriorityName = (IntPriority) => {
        switch (IntPriority) {
            case 0:
                return "High";
            case 1:
                return "Middle";
            case 2:
                return "Low";
        }
    }

    // Status comes in as an integer 0 - 2 (open, progressing, done)
    // The integer needs to be convertad into an actuall name
    const getStatusName = (IntStatus) => {
        switch (IntStatus) {
            case 0:
                return "Open";
            case 1:
                return "Progressing";
            case 2:
                return "Done";
        }
    }

    return (
        <Card className={styles.Task}>
            <Card.Body>
                <Card.Header>
                    {
                        /* Show the part of the date that contains the time*/
                        due_date.split(" ")[3]
                    }
                </Card.Header>
                <Card.Title>
                    {title}
                </Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        <Container>
                            <Row>
                                <Col>
                                    Category: {getCategoryName(category)}
                                </Col>
                                <Col>
                                    Priority: {getPriorityName(priority)}
                                </Col>
                                <Col>
                                    Status: {getStatusName(status)}
                                </Col>
                            </Row>
                        </Container>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        {comment && <Card.Subtitle>{comment}</Card.Subtitle>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        {/* If there is a file attached to the task then provide a link to open it */}
                        {file && <Card.Link href={file} target="_blank">Show file</Card.Link>}
                    </ListGroup.Item>
                </ListGroup>
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
                    <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
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

export default Task;