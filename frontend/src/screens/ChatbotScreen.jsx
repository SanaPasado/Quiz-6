import React, { useMemo, useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { askChatbot } from "../actions/chatActions";
import { consumeChatUsage } from "../actions/subscriptionActions";

export default function ChatbotScreen() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { messages } = useSelector((state) => state.chatState);
  const { subscriptions } = useSelector((state) => state.subscriptionState);
  const { userInfo } = useSelector((state) => state.userState);

  const mySubscription = useMemo(
    () => subscriptions.find((item) => item.user_id === userInfo.id && item.is_active),
    [subscriptions, userInfo.id]
  );

  const submitHandler = (event) => {
    event.preventDefault();
    if (!mySubscription || mySubscription.usage_left < 1) {
      return;
    }
    dispatch(consumeChatUsage());
    dispatch(askChatbot(message));
    setMessage("");
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h3>AI Chatbot</h3>
          {!mySubscription && (
            <Alert variant="warning">Active subscription required before using the chatbot.</Alert>
          )}
          {mySubscription && (
            <Alert variant="info">Usage left: {mySubscription.usage_left}</Alert>
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
            <Button type="submit" disabled={!mySubscription || mySubscription.usage_left < 1}>
              Send
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
