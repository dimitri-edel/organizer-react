import React, {useState} from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
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

    const handleShowConfirmDialog = () =>{
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
                <Media className="align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <span>{due_date}</span>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleShowConfirmDialog}
                            />
                        )}
                    </div>
                </Media>
            </Card.Body>
            <Card.Body>
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {comment && <Card.Text>{comment}</Card.Text>}
                <p>Category: {getCategoryName(category)}</p>
                <p>Priority: {getPriorityName(priority)}</p>
                <p>Status: {getStatusName(status)}</p>
                <p>ID: {id} </p>
                <Card.Img src={file} alt={title} />
            </Card.Body>
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
        </Card>

    );
};

export default Task;