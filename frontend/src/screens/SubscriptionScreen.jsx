import React, { useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";

import { subscribeTier } from "../actions/subscriptionActions";

export default function SubscriptionScreen() {
  const dispatch = useDispatch();
  const { tiers } = useSelector((state) => state.subscriptionState);
  const { userInfo } = useSelector((state) => state.userState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || "";
  const hasPaypalClientId = Boolean(clientId);

  const subscribeHandler = async (tier, paypalSubscriptionId) => {
    setMessage("");
    setError("");

    try {
      await dispatch(subscribeTier(tier, paypalSubscriptionId));
      setMessage(`Subscribed to ${tier.name}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <h3 className="mb-2">Chatbot Subscription Plans</h3>
      <p className="text-muted">Subscriptions are used for AI chatbot usage only.</p>
      {!userInfo && <Alert variant="warning">Sign in first to subscribe.</Alert>}
      {!hasPaypalClientId && (
        <Alert variant="warning">
          Set <strong>REACT_APP_PAYPAL_CLIENT_ID</strong> in frontend .env to enable PayPal subscription checkout.
        </Alert>
      )}
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {tiers.map((tier) => (
          <Col md={4} key={tier.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{tier.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> PHP {tier.price}
                </Card.Text>
                <Card.Text>
                  <strong>Chat Usage:</strong> {tier.max_usage}
                </Card.Text>
                {userInfo && hasPaypalClientId && (
                  <PayPalScriptProvider options={{ "client-id": clientId, intent: "subscription" }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createSubscription={(data, actions) => {
                        if (!tier.paypal_plan_id) {
                          throw new Error("This tier has no PayPal plan configured yet.");
                        }
                        return actions.subscription.create({ plan_id: tier.paypal_plan_id });
                      }}
                      onApprove={(data) => subscribeHandler(tier, data.subscriptionID)}
                      onError={() => setError("PayPal checkout failed. Please try again.")}
                    />
                  </PayPalScriptProvider>
                )}
                {userInfo && !tier.paypal_plan_id && (
                  <Alert className="mt-auto mb-0" variant="secondary">
                    Plan not configured yet for this tier.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
