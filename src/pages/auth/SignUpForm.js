/*
  Sign-in form for dj-rest-auth access point in the API
  Standard dj-rest-auth URLs and fieldnames are used
*/
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
  // Initialize when mounted 
  useEffect(() => {
    // Set the title in the browser tab
    document.title = "Registration";
  }, []);
  // Intitialize signUpData with empty values
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  // Destruct signUpData
  const { username, password1, password2 } = signUpData;
  // assign a state to errors that can be retrieved from the response object
  const [errors, setErrors] = useState({});
  // Access browsers history object
  const history = useHistory();
  // Apply user's input to the state object
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };
  // Submit the form
  const handleSubmit = async (event) => {
    // Prevent the browser from submitting the form in the default fashion
    event.preventDefault();
    try {
      // POST the data to the API
      await axios.post("/dj-rest-auth/registration/", signUpData);
      // If successful redirect the user to the sign-in page
      history.push("/signin");
    } catch (err) {
      // Copy validation errors from the response
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={styles.Row} lg={3}>
      <Col></Col>
      <Col className="my-auto" md={6} sm={12}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign up</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password2">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default SignUpForm;