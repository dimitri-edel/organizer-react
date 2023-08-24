import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Modal } from "react-bootstrap";
import styles from "../../styles/TaskCreateEditForm..module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory, useParams } from "react-router";
import { useCurrentUser } from "../../context/CurrentUserContext";


function EditTeamForm() {

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // Reset the message for the Dialog to empty to make it hide
    const handleCloseConfirmDialog = () =>{
        setMessage("");
    }
    // Initialize teamData with en empty data-set
    const [teamData, setTeamData] = useState({
        owner: "",
        name: "",
        is_member: "",
    });
    // Destruct teamData into several constants
    const { owner, name, is_member } = teamData;
    // Retrieve the parameter passed in the route name(URL)
    const { id } = useParams();
    // Access the user object in the request header
    const currentUser = useCurrentUser();
    // Access the history object of the browser
    const history = useHistory();

    useEffect(() => {
        // Set the title in the browser
        document.title = 'Edit Team';
        // Initialize when mounted to React DOM
        const handleMount = async () => {
            try {
                // Retrieve team data from the API
                const { data } = await axiosReq.get(`/team/${id}`);
                const { owner, name, is_member } = data;
                // Copy data to the state object
                setTeamData({
                    owner: owner,
                    name: name,
                    is_member: is_member
                });

            } catch (err) {
                // Log errors in the console
                console.log(err);
            }
        }
        handleMount();
    }, [history, id]);
    // Handle changes in the state object
    const handleChange = (event) => {
        setTeamData({
            ...teamData,
            [event.target.name]: event.target.value,
        });
    };

    // Submit the form
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name);

        try {
            // Submit the form to the API
            await axiosReq.put(`team/${id}`, formData);
            // If successful inform the user
            setMessage("Team has been updated!");
        } catch (err) {
            // Log error to the console
            console.log(err);
            // Copy errors to the Errors state object,
            // so they can see the validation erors
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const buttonPanel = (
        <div className="text-center">
            {/* Add your form fields here */}

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => {
                    history.goBack();
                }}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                Save
            </Button>
        </div>
    );

    return (
        <>
            {(currentUser?.username !== owner) ? (
                <h1>Access denied!</h1>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <h1 className={styles.Title}>Edit Team</h1>
                    <Row>
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container
                                className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                            >
                                <Form.Group className="text-center">
                                    <Form.Group>
                                        <Form.Label>Name of Task</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {errors?.name?.map((message, idx) => (
                                        <Alert key={idx} variant="warning">
                                            {message}
                                        </Alert>
                                    ))}
                                </Form.Group>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container className={appStyles.Content}>{buttonPanel}</Container>
                        </Col>
                    </Row>
                    <Modal show={(message !== "")} onHide={handleCloseConfirmDialog} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Task Editor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{message}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseConfirmDialog}>
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            )}
        </>
    );
}

export default EditTeamForm;