import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/TeamChat.module.css";
import appStyles from "../../App.module.css";
import Upload from "../../assets/upload.png";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Card, Modal, Button, Container, Row, Col, Form, Image, Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import TeamMessage from "./TeamMessage";

const TeamMessageEditForm = ({ teamMessage, setReload, setEditMessageId }) => {
    const currentUser = useCurrentUser();
    // const is_owner = currentUser?.username === owner;
    const history = useHistory();
    const [messageData, setMessageData] = useState({
        ...teamMessage
    });
    /**
         * Reference to the component with a image file : Form.File
         */
    const imageInput = useRef(null);
    // Destruct messageData
    const { message, image } = messageData;
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
     * Event handler for input field for the image file
     * If the user selects a file it is attached to the taskData as a URL of an object
     * @param {Event} event 
     */
    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setMessageData({
                ...messageData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
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
        // This is just a dummy owner, because the API's serializer expects some value
        // The API will extract the user from the request
        formData.append("owner", teamMessage.owner);
        // This is just a dummy team, because the API's serializer expects some value
        // The API will extract the team-id from the requested URL route
        formData.append("team", teamMessage.team);
        // If there is a file in the buffer it means that a new file
        // has been submitted. If there is a new file, then append it to the form
        // otherwise do not
        if (imageInput?.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        try {
            // Send a POST Request to the API
            const { data } = await axiosReq.put("team-chat-put/" + teamMessage.id, formData);
            // Only one parameter is necessary, but for some reason if I only leave the id it will not work
            // const { id, asigned_to, title, comment, due_date, category, priority, status, file } = data; 
            setReload(true);
            setMessageData({ message: "" });
            setEditMessageId(null);
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
                                as="textarea"
                                rows={3}
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
                            {image ? (
                                <Form.Label htmlFor="image-upload" className={styles.ChangeImageButton}>
                                    Change Image
                                </Form.Label>
                            ) : (
                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="image-upload"
                                >
                                    <Asset
                                        src={Upload}
                                        message="Uplaod an image"
                                    />
                                </Form.Label>
                            )}
                        </Col>
                    </Row>
                    <Row>

                        {/* NOTE : the Lables below have the htmlFor attribute that is assigned
                    to "image-upload". Meaning, if those components get clicked on
                    the onChange - event handler of the Form.File compoenent down below 
                    will be executed. Because the Form.File has the id="image-upload".
                  */}
                        {image && <Col>
                            <figure>
                                <Image className={styles.UploadImage} src={image} rounded />
                            </figure>
                        </Col>}

                        {/* NOTE : the Lables above have the htmlFor attribute that is assigned
                    to the component below. Meaning, if those components get clicked on
                    the onChange - event handler of this compoenent will be executed.
                  */}
                        <Form.File
                            id="image-upload"
                            accept="image/*"
                            onChange={handleChangeImage}
                            ref={imageInput}
                        />
                        {errors?.image?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}

                    </Row>

                </Container>
            </Form>
        </div>
    )
}

export default TeamMessageEditForm;