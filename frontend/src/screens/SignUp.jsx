import React, { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { register } from "../actions/userActions";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    location: "",
    gender: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    const requiredFields = [
      "email",
      "username",
      "phone_number",
      "first_name",
      "last_name",
      "location",
      "gender",
      "password",
      "confirm_password",
    ];

    const hasMissing = requiredFields.some((fieldName) => !formData[fieldName]);
    if (hasMissing) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Password and confirm password must match.");
      return;
    }

    try {
      setLoading(true);
      await dispatch(register(formData));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Create Account</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={changeHandler} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control name="username" value={formData.username} onChange={changeHandler} />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control name="phone_number" value={formData.phone_number} onChange={changeHandler} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" value={formData.location} onChange={changeHandler} />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="first_name" value={formData.first_name} onChange={changeHandler} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="last_name" value={formData.last_name} onChange={changeHandler} />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={changeHandler}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={changeHandler} />
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={changeHandler}
                  />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
