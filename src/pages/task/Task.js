import React from "react";
import styles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
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
    
    const handleEdit = () => {
        history.push(`${id}/edit`);        
    };

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
                                handleDelete={handleDelete}
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
        </Card>
    );
};

export default Task;