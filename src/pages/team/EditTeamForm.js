import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import styles from "../../styles/TaskCreateEditForm..module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory, useParams } from "react-router";
import { useCurrentUser } from "../../context/CurrentUserContext";


function EditTeamForm() {

    const [errors, setErrors] = useState({});

    const [teamData, setTeamData] = useState({
        owner: "",
        name: "",
        is_member: "",
    });

    const { owner, name, is_member } = teamData;
    const { id } = useParams();
    // See if the user is logged in
    const currentUser = useCurrentUser();
    const history = useHistory();

    useEffect(() => {
        document.title = 'Edit Team';
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/team/${id}`);
                const { owner, name, is_member } = data;
                setTeamData({
                    owner: owner,
                    name: name,
                    is_member: is_member
                });

            } catch (err) {
                console.log(err);
            }
        }
        handleMount();
    }, [history, id]);

    const handleChange = (event) => {
        setTeamData({
            ...teamData,
            [event.target.name]: event.target.value,
        });
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name);

        try {
            await axiosReq.put(`team/${id}`, formData);
            history.replace("/teams/");
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
                </Form>
            )}
        </>
    );
}

export default EditTeamForm;