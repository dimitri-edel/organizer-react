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
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const handleEdit = () => {
        history.push(`/task/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/task/${id}`);
            history.push("/");
        } catch (err) {
            console.log(err);
        }
    };


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
                <Card.Img src={file} alt={title} />
            </Card.Body>
        </Card>
    );
};

export default Task;