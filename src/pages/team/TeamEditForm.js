import React, { useState, useEffect } from "react";
import styles from "../../styles/TeamChat.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import { toast } from "react-toastify";

const TeamEditForm = (props) => {
    const {
        team,
        setUpdateTeamList,
        setEditTeamId,
    } = props;

    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    // Handle changes in the state object
    const handleChange = (event) => {
        setName(event.target.value);
    };

    useEffect(() => {
        setName(team.name);
    }, [team]);

    // Submit the form
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name);

        try {
            // Submit the form to the API
            await axiosReq.put(`team/${team.id}`, formData);
            // If successful inform the user
            // setMessage("Team has been updated!");
            setUpdateTeamList(true);
            setEditTeamId(null);
            // Notify the user about the success
            let msg = "Team renamed to " + name + "!";
            toast.success(msg, {
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
        <Container className={styles.MessageBox}>
            <Row>
                <Col>
                    <button
                        className={styles.CancelButton}
                        onClick={() => {
                            setEditTeamId(null);
                            setUpdateTeamList(true);
                        }}
                    >
                        Cancel
                    </button>
                </Col>
                <Col>
                    <button type="submit" className={styles.SubmitButton}>
                        Rename
                    </button>
                </Col>
            </Row>
        </Container>
    );

    return (
        <>
            <Form onSubmit={handleSubmit} className={styles.MessageBox}>
                <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                />
                {errors?.name?.map((message, idx) => (
                    <Alert key={idx} variant="warning">
                        {message}
                    </Alert>
                ))}
                {buttonPanel}
            </Form>

        </>
    );
};

export default TeamEditForm;