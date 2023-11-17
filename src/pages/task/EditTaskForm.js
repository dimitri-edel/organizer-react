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
import { useHistory, useParams } from "react-router";
import { FormLabel } from "react-bootstrap";
import { convertDateFormat, convertDatePickerDate } from "../../utils/utils";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { toast } from "react-toastify";

/**
 * React Component that allows users to edit Tasks
 * @returns JSX of a Form for editting Tasks
 */
function EditTaskForm() {
    /**
     * Reference of the current user, that is used in the Request headers
     */
    const currentUser = useCurrentUser();
    /**
     * State attribute that will hold validation errrors
     */
    const [errors, setErrors] = useState({});

    const [taskData, setTaskData] = useState({
        owner: "",
        asigned_to: "",
        asigned_to_username: "",
        title: "",
        comment: "",
        due_date: "",
        category: "",
        priority: "",
        status: "",
        file: "",
    });
    // Set up a state attribute for holding a list of teammates
    const [teamMembers, setTeamMembers] = useState({ results: [], });
    // Destruct the taskData
    const { asigned_to, asigned_to_username, title, due_date, comment, category, priority, status, file } = taskData;

    /**
     * Apply user's input to the corresponding state attributes
     * @param {Event} event 
     */
    const handleChange = (event) => {
        setTaskData({
            ...taskData,
            [event.target.name]: event.target.value,
        });
    };
    /**
     * Event handler for the file input field
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

    // Reference to the component with a image file : Form.File
    const imageInput = useRef(null);
    // Access browsers history
    const history = useHistory();
    // Retrieve the parameter from the route
    const { id } = useParams();
    // The datepicker expect a different date format than the one that comes 
    // back from the API. Thus, it is neccessary to convert it to the expected 
    // format in the useEffect()-Hook.
    const [datePickerValue, setDatePickerValue] = useState("");

    useEffect(() => {
        // Set the title in the Tab of the browser
        document.title = "Edit Task";
        const handleMount = async () => {
            try {
                // Send two requests to the API
                // one requesting the data for the given task
                // two request a list of teammates of the current user
                const [{ data: task }, { data: teammates }] = await Promise.all([
                    axiosReq.get(`/task/${id}`),
                    axiosReq.get(`/teammates/`),
                ]);
                // Destruct the recieved task data into a set of constants
                const { is_owner, asigned_to, asigned_to_username, title, due_date, comment, category, priority, status, file } = task;

                // Convert the due_date to datePickerValue               
                setDatePickerValue(convertDateFormat(due_date));
                // If it is the owner requesting the task, then copy the retrieved data to the corresponding fields, else
                // redirect the user to the root URL
                is_owner ? setTaskData({ is_owner, asigned_to, asigned_to_username, title, comment, due_date, category, priority, status, file }) : history.push("/");
                setTeamMembers(teammates);
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
        // Prevent the browser from following through with the default submit
        event.preventDefault();

        // Create a form data element, for the request
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

        formData.append("due_date", convertDatePickerDate(due_date));
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
            // Send an update request to the API
            await axiosReq.put(`/task/${id}`, formData);
            // Notify the user about the success
            toast.success('The task has been saved!!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            history.goBack();
        } catch (err) {
            console.log(err);
            // Copy the validation errors into the corresponding state attribute
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const buttonPanel = (
        <div className="text-center">
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => {
                    history.goBack();
                }}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                save
            </Button>
        </div>
    );

    return (
        <>
            {(currentUser === null) ? (
                <h1>Please log in first</h1>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <h1 className={styles.Title}>Edit Task</h1>
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
                                    {errors?.title?.map((message, idx) => (
                                        <Alert key={idx} variant="warning">
                                            {message}
                                        </Alert>
                                    ))}
                                    <Form.Group>
                                        <Form.Control
                                            type="datetime-local"
                                            id="due_date"
                                            name="due_date"
                                            defaultValue={datePickerValue}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {errors?.du_date?.map((message, idx) => (
                                        <Alert key={idx} variant="warning">
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
                                                        return <option key={`${teammate.team_name} : ${teammate.member}`} value={teammate.user_id}>{teammate.team_name} : {teammate.member}</option>
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
                                            value={category}
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
                                            value={priority}
                                            onChange={handleChange}>
                                            <option value="0">High</option>
                                            <option value="1">Middle</option>
                                            <option value="2">Low</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <FormLabel>Status</FormLabel>
                                        <Form.Control
                                            as="select"
                                            name="status"
                                            value={status}
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
        </>);
}

export default EditTaskForm;