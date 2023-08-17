import React, { useState, useRef, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import Upload from "../../assets/upload.png";

import styles from "../../styles/TaskCreateEditForm..module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory } from "react-router";
import { FormLabel } from "react-bootstrap";

function CreateTaskForm() {
    const [errors, setErrors] = useState({});

    const [teamData, setTeamData] = useState({
        name: "",
    });

    const { name } = teamData;
    const [teamMembers, setTeamMembers] = useState({ results: [], });


    const handleChange = (event) => {
        setTeamData({
            ...teamData,
            [event.target.name]: event.target.value,
        });
    };

    // Reference to the component with a image file : Form.File
    const imageInput = useRef(null);
    const history = useHistory();


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name);

        try {
            const { data } = await axiosReq.post("team/", formData);
            history.goBack();
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
        <Form onSubmit={handleSubmit}>
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
        </Form>
    );
}

export default CreateTaskForm;