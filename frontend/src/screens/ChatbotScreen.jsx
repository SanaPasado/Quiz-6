import React, { useMemo, useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { askChatbot } from "../actions/chatActions";

export default function ChatbotScreen() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { messages } = useSelector((state) => state.chatState);
  const { mySubscription } = useSelector((state) => state.subscriptionState);
  const { userInfo } = useSelector((state) => state.userState);

  const usageLeft = useMemo(() => mySubscription?.usage_left ?? 0, [mySubscription]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (!mySubscription || mySubscription.usage_left < 1) {
      return;
    }

    try {
      await dispatch(askChatbot(message));
      setMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h3>AI Chatbot</h3>
          <Alert variant="secondary">
            This chatbot only answers notary and document service questions related to this project.
          </Alert>
          {!mySubscription && (
            <Alert variant="warning">Active subscription required before using the chatbot.</Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {mySubscription && (
            <Alert variant="info">Usage left: {usageLeft}</Alert>
          )}
          <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}>
            {messages.map((item, index) => (
              <p key={index}>
                <strong>{item.sender === "user" ? "You" : "Bot"}:</strong> {item.text}
              </p>
            ))}
          </div>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-2">
              <Form.Control
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask about notary and document services"
                required
              />
            </Form.Group>
            <Button type="submit" disabled={!mySubscription || usageLeft < 1}>
              Send
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
