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
import { useHistory } from "react-router-dom";

import { FormLabel } from "react-bootstrap";
import { convertDateToReactString } from "../../utils/utils";
import { useCurrentUser } from "../../context/CurrentUserContext";
/**
 * React Component that allows users to create new Tasks
 * @returns JSX of a Form for creating a new Task
 */
function CreateTaskForm() {
    /**
     * Reference to the current user object that is used in the Request headers
     */
    const currentUser = useCurrentUser();
    // State attribute that will hold all validation errors
    const [errors, setErrors] = useState({});
    // State attribute that holds all the task fields
    const [taskData, setTaskData] = useState({
        id: "",
        owner: "",
        asigned_to: "",
        title: "",
        comment: "",
        due_date: convertDateToReactString(new Date()),
        category: "",
        priority: "",
        status: "",
        file: "",
    });
    // Destruct a single piece of taskData 
    const { id, asigned_to, title, comment, due_date, category, priority, status, file } = taskData;
    // State for holding the objects with teammates of the current user
    const [teamMembers, setTeamMembers] = useState({ results: [], });

    /**
     * Event handler for user input fields 
     * @param {Event} event 
     */
    const handleChange = (event) => {
        setTaskData({
            ...taskData,
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
            URL.revokeObjectURL(file);
            setTaskData({
                ...taskData,
                file: URL.createObjectURL(event.target.files[0]),
            });
        }
    };


    /**
     * Reference to the component with a image file : Form.File
     */
    const imageInput = useRef(null);
    /**
     * Access to the browser's history
     */
    const history = useHistory();

    useEffect(() => {
        // Set the title in the browsers Tab
        document.title = 'Create Task';

        const handleMount = async () => {
            try {
                // Retrieve a list of teammates from the API
                const { data } = await axiosReq.get(`/teammates/`);
                // Store the teammates in the corresonding state object
                setTeamMembers(data);
            } catch (err) {
                console.log(err);
            }
        };

        handleMount();
    }, [history, id]);

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
        // if the asigned_to value is numberic and is not 0. append it to the form
        if ((!isNaN(asigned_to)) && (parseInt(asigned_to) > 0)) {
            formData.append("asigned_to", asigned_to);
        } else if (asigned_to === "0") {
            // if the user selected 'Not asigned', then send empty string, which is equivalent to null
            formData.append("asigned_to", "");
        }
        formData.append("title", title);
        formData.append("comment", comment);
        formData.append("due_date", due_date);
        // If there is a file in the buffer it means that a new file
        // has been submitted. If there is a new file, then append it to the form
        // otherwise do not
        if (imageInput?.current?.files[0]) {
            formData.append("file", imageInput.current.files[0]);
        }
        formData.append("category", category);
        formData.append("priority", priority);
        formData.append("status", status);

        try {
            // Send a POST Request to the API
            const { data } = await axiosReq.post("tasks/", formData);
            // Only one parameter is necessary, but for some reason if I only leave the id it will not work
            const { id, asigned_to, title, comment, due_date, category, priority, status, file } = data;
            // If the Request returned 200(Successful open the created Task in a edit page
            history.replace(`/tasks/${id}/edit`);
        } catch (err) {
            console.log(err);
            // Copy validation errors to the corresponding state object
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };
    /**
     * JSX for the buttons 
     */
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
            {
                /* if the user is not authenticated then prompt them to log in first */
                (currentUser === null) ? (
                    <h1>Please log in first</h1>
                ) :
                    (<Form onSubmit={handleSubmit}>
                        <h1 className={styles.Title}>Create Task</h1>
                        <Row>
                            <Col></Col>
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
                                        {errors?.title?.map((message, idx) => (
                                            <Alert variant="warning" key={idx}>
                                                {message}
                                            </Alert>
                                        ))}
                                        <Form.Group>
                                            <Form.Control
                                                type="datetime-local"
                                                id="due_date"
                                                name="due_date"
                                                defaultValue={due_date}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        {errors?.du_date?.map((message, idx) => (
                                            <Alert variant="warning" key={idx}>
                                                {message}
                                            </Alert>
                                        ))}
                                        <Form.Group>
                                            <FormLabel>Asign to:</FormLabel>
                                            {
                                                <Form.Control
                                                    as="select"
                                                    name="asigned_to"
                                                    value={asigned_to}
                                                    onChange={handleChange}>
                                                    <option value="0">Not asigned</option>
                                                    {
                                                        teamMembers.results.map(teammate => {
                                                            return <option key={`asigned_${teammate.team_name}${teammate.member}`} value={teammate.user_id}>{teammate.team_name} : {teammate.member}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            }
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
                                    {/* <div className="d-md-none">{buttonPanel}</div> */}
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
                    </Form>)
            }
        </>
    );
}

export default CreateTaskForm;