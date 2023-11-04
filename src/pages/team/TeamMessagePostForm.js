import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TeamMessage from "./TeamMessage";

const TeamMessagePostForm = ({ team_id, setReload }) => {
    const currentUser = useCurrentUser();
    // const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [messageData, setMessageData] = useState({
        message: "",
    });

    // Destruct messageData
    const { message } = messageData;
    // State attribute that will hold all validation errors
    const [errors, setErrors] = useState({});
    /**
     * Event handler for user input fields 
     * @param {Event} event 
     */
    const handleChange = (event) => {
        setMessageData({
            ...messageData,
            [event.target.name]: event.target.value,
        });
    };

    /**
     * Submit the form
     * @param {Event} event 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        /**
         * The data structure of an HTML form, that is used in the Request object
         */
        const formData = new FormData();
        formData.append("message", message);
        formData.append("owner", "");
        formData.append("team", 1);

        console.log(message);

        try {
            // Send a POST Request to the API
            const { data } = await axiosReq.post("team-chat-post/" + team_id, formData);
            // Only one parameter is necessary, but for some reason if I only leave the id it will not work
            // const { id, asigned_to, title, comment, due_date, category, priority, status, file } = data; 
            setReload(true);
        } catch (err) {
            console.log(err);
            // Copy validation errors to the corresponding state object
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    return (
        <div className={styles.PostMessageForm}>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Row>
                        <Col xs={8} md={9} lg={10}>
                            <Form.Control
                                type="text"
                                name="message"
                                value={message}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col xs={2} md={2} lg={1}>
                            <Button type="submit">
                                Post
                            </Button>
                        </Col>
                        <Col xs={2} md={2} lg={1}>
                            <button>File</button>
                        </Col>
                    </Row>

                </Container>
            </Form>
        </div>
    )
}

export default TeamMessagePostForm;