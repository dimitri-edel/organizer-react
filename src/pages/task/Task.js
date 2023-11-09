import React, { useState } from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

/**
 * Task is React Component that represents an idividual task
 * It reders all properties passed in the parameter list
 * It also facilitates deletion of the task and provides a link for editing the task
 * @param {proops} props 
 * @returns JSX of a Task component
 */
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
    /**
     * Reference to the current user object used in the Request header
     */
    const currentUser = useCurrentUser();
    /**
     * Flag if the current user is the owner of the task
     */
    const is_owner = currentUser?.username === owner;
    /**
     * Access the history in the browser
     */
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
     * Delete the task, because the user confirmed the delete
     */
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
        // Close the confirm dialog
        setShowConfirmDialog(false);
    }
    /**
     * Redirect user to the edit page 
     */
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
                return "High-Priority";
            case 1:
                return "Middle-Priority";
            case 2:
                return "Low-Priority";
        }
    }

    // Priorty class Name in styles 
    const getPriorityClassName = (IntPriority) => {
        switch (IntPriority) {
            case 0:
                return styles.HighPriority;
            case 1:
                return styles.MiddlePriority;
            case 2:
                return styles.LowPriority;
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

    // CSS className for the respective status in styles
    const getStatusClassName = (IntStatus) => {
        switch (IntStatus) {
            case 0:
                return styles.StatusOpen;
            case 1:
                return styles.StatusProgressing;
            case 2:
                return styles.StatusDone;
        }
    }

    return (
        <Card className={styles.Task}>
            <Card.Body>
                <Container className={styles.TimeDatePanel}>
                    <Row>
                        <Col className={styles.DatePanel}>
                            {
                                /* Show the part of the date that contains the time*/
                                due_date.split(" ")[3]
                            }
                        </Col>
                        <Col className={styles.TimePanel}>
                            { /* the part with the date without year */
                                due_date.split(" ")[0] + " " + due_date.split(" ")[1]
                            }
                        </Col>
                    </Row>
                </Container>

                <Container className={styles.Title}>
                    {title}
                </Container>
                <Container className={"list-group-flush " + styles.TypePanel}>
                    <Row>
                        <Col className={styles.TaskCategory}>
                            {category === 0 && <i className={"fa-solid fa-hand-sparkles " + styles.CategoryIcon}></i>}
                            {category === 1 && <i className={"fa-solid fa-person-running " + styles.CategoryIcon}></i>}
                            {category === 2 && <i className={"fa-solid fa-screwdriver-wrench " + styles.CategoryIcon}></i>}
                            {getCategoryName(category)}
                        </Col>
                        <Col className={getPriorityClassName(priority)}>
                            {getPriorityName(priority)}
                        </Col>
                        <Col className={getStatusClassName(status)}>
                            {getStatusName(status)}
                        </Col>
                    </Row>
                </Container>
                <Container className={styles.CommentPanel}>
                    <Row>
                        <Col>
                            {comment && <Card.Text className={styles.CommentText}>{comment}</Card.Text>}
                        </Col>
                    </Row>
                </Container>
                {/* If there is a file attached to the task then provide a link to open it */}
                {file && <Card.Link href={file} target="_blank">Show file</Card.Link>}
                {/* </ListGroup.Item>
                </ListGroup> */}
                {/* If the user is the owner of the task then provide edit and delete buttons*/}
                {is_owner && (<Container className={styles.ControlPanel}>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={handleEdit} size="sm" className={styles.EditButton}>
                                <i className={"fas fa-edit " + styles.EditIcon}></i>Edit
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={handleShowConfirmDialog} size="sm" className={styles.DeleteButton}>
                                <i className={"fa-solid fa-trash-can " + styles.DeleteIcon} ></i>Delete
                            </Button>
                        </Col>
                    </Row>
                </Container>)}

                <Modal show={showConfirmDialog} onHide={handleCloseConfirmDialog} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please confirm delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmDialog} >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirmDialogDeleteClicked} >
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>

    );
};

export default Task;