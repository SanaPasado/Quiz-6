import React, { useState } from "react";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { applySeller } from "../actions/userActions";

export default function ApplySeller() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = () => {
    setMessage("");
    setError("");
    try {
      dispatch(applySeller());
      setMessage("Seller application submitted. Awaiting admin approval.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h3>Apply as Seller</h3>
          <p>Any signed-in user can apply to become a seller. Admin approval is required.</p>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button onClick={submitHandler}>Submit Seller Application</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
