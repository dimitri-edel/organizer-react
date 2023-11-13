import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import styles from "../../styles/TeamCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { toast } from "react-toastify";

function CreateTaskForm() {
    useEffect(() => {
        document.title = 'Create Team';
    }, []);

    const [errors, setErrors] = useState({});

    const [teamData, setTeamData] = useState({
        name: "",
    });

    const { name } = teamData;

    const handleChange = (event) => {
        setTeamData({
            ...teamData,
            [event.target.name]: event.target.value,
        });
    };

    // See if the user is logged in
    const currentUser = useCurrentUser();
    const history = useHistory();


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name);

        try {
            await axiosReq.post("team/", formData);
            history.replace("/teams/");
            let toastMsg = "The team " + name + " has been created!";

            toast.success(toastMsg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err) {
            console.log(err);
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
                create
            </Button>
        </div>
    );

    return (
        <>
            {(currentUser === null) ? (
                <h1>Please log in first</h1>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <h1 className={styles.Title}>Create Team</h1>
                    <Row>
                        <Col></Col>
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container
                                className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                            >
                                <Form.Group className="text-center">
                                    <Form.Group>
                                        <Form.Label>Name of Team</Form.Label>
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
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                            <Container className={appStyles.Content}>{buttonPanel}</Container>
                        </Col>
                        <Col></Col>
                    </Row>
                </Form>
            )}
        </>
    );
}

export default CreateTaskForm;