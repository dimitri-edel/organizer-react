import React, { useState, useRef } from "react";

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

    const [taskData, setTaskData] = useState({
        id: "",
        owner: "",
        asigned_to: "",
        title: "",
        comment: "",
        due_date: new Date().toJSON(),
        category: "",
        priority: "",
        status: "",
        file: "",
    });

    const { id, owner, asigned_to, title, comment, due_date, category, priority, status, file } = taskData;


    const handleChange = (event) => {
        setTaskData({
            ...taskData,
            [event.target.name]: event.target.value,
        });        
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(file);
            setTaskData({
                ...taskData,
                file: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    // Reference to the component with a image file : Form.File
    const imageInput = useRef(null);
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();



        formData.append("title", title);
        formData.append("comment", comment);
        formData.append("due_date", due_date);
        formData.append("file", imageInput.current.files[0]);
        formData.append("category", category);
        formData.append("priority", priority);
        formData.append("status", status);
        console.log(taskData);

        try {
            const { data } = await axiosReq.post("tasks/", formData);
            // history.push(`/task/${data.id}`);

            history.push("/");
        } catch (err) {
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
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
                                    name="title"
                                    value={title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="datetime-local"
                                    id="due_date"
                                    name="due_date"
                                    value={due_date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <FormLabel>Category</FormLabel>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    onChange={handleChange}>
                                    <option value="0">Chore</option>
                                    <option value="1">Errand</option>
                                    <option value="2">Work</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <FormLabel>Priority</FormLabel>
                                <Form.Control
                                    as="select"
                                    name="priority"
                                    onChange={handleChange}>
                                    <option value="0">High</option>
                                    <option value="1">Middle</option>
                                    <option value="2">Low</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <FormLabel>Category</FormLabel>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    onChange={handleChange}>
                                    <option value="0">Open</option>
                                    <option value="1">Progressing</option>
                                    <option value="2">Done</option>
                                </Form.Control>
                            </Form.Group>
                            {errors?.name?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}
                            <Form.Group>
                                {/* NOTE : the Lables below have the htmlFor attribute that is assigned
                    to "image-upload". Meaning, if those components get clicked on
                    the onChange - event handler of the Form.File compoenent down below 
                    will be executed. Because the Form.File has the id="image-upload".
                  */}
                                {file ? (
                                    <>
                                        <figure>
                                            <Image className={appStyles.Image} src={file} rounded />
                                        </figure>
                                        <div>
                                            <Form.Label
                                                className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                                htmlFor="image-upload"
                                            >
                                                Change the image
                                            </Form.Label>
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="image-upload"
                                    >
                                        <Asset
                                            src={Upload}
                                            message="Click or tap to uplaod an image"
                                        />
                                    </Form.Label>
                                )}
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
                                {errors?.file?.map((message, idx) => (
                                    <Alert key={idx} variant="warning">
                                        {message}
                                    </Alert>
                                ))}
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="comment"
                                    rows={6}
                                    value={comment}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors?.comment?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}
                        </Form.Group>
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
}

export default CreateTaskForm;