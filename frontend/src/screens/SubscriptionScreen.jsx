import React, { useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";

import { subscribeTier } from "../actions/subscriptionActions";

export default function SubscriptionScreen() {
  const dispatch = useDispatch();
  const { tiers } = useSelector((state) => state.subscriptionState);
  const { userInfo } = useSelector((state) => state.userState);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || "";
  const hasPaypalClientId = Boolean(clientId);
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) || null;

  const subscribeHandler = async (tier, paypalSubscriptionId) => {
    setMessage("");
    setError("");
    setIsSubscribing(true);

    try {
      await dispatch(subscribeTier(tier, paypalSubscriptionId));
      setMessage(`Subscribed to ${tier.name}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubscribing(false);
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
      {tiers.length === 0 && (
        <Alert variant="info">No subscription tiers are available yet. Run backend seed and refresh.</Alert>
      )}
      <Row>
        {tiers.map((tier) => (
          <Col md={4} key={tier.id} className="mb-4">
            <Card className={`h-100 shadow-sm ${selectedTierId === tier.id ? "border-primary" : ""}`}>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{tier.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> PHP {tier.price}
                </Card.Text>
                <Card.Text>
                  <strong>Chat Usage:</strong> {tier.max_usage}
                </Card.Text>
                <Button
                  className="mt-auto"
                  variant={selectedTierId === tier.id ? "primary" : "outline-primary"}
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setSelectedTierId(tier.id);
                  }}
                  disabled={!userInfo}
                >
                  {selectedTierId === tier.id ? "Selected" : "Select Plan"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {userInfo && selectedTier && !selectedTier.paypal_plan_id && (
        <Alert variant="secondary">
          <strong>{selectedTier.name}</strong> is selected, but this tier has no PayPal plan configured yet.
        </Alert>
      )}

      {userInfo && selectedTier && hasPaypalClientId && selectedTier.paypal_plan_id && (
        <PayPalScriptProvider options={{ "client-id": clientId, intent: "subscription", vault: true }}>
          <h5>Checkout: {selectedTier.name}</h5>
          {isSubscribing && (
            <div className="mb-2 text-muted">
              <Spinner size="sm" animation="border" className="me-2" />
              Saving your subscription...
            </div>
          )}
          <PayPalButtons
            forceReRender={[selectedTier.id, selectedTier.paypal_plan_id]}
            style={{ layout: "vertical" }}
            onClick={() => {
              setError("");
              setMessage("Opening PayPal checkout...");
            }}
            createSubscription={(data, actions) => {
              if (!selectedTier.paypal_plan_id) {
                setError("Selected tier is missing a PayPal plan mapping.");
                throw new Error("Selected tier is missing a PayPal plan mapping.");
              }
              return actions.subscription.create({ plan_id: selectedTier.paypal_plan_id });
            }}
            onApprove={(data) => subscribeHandler(selectedTier, data.subscriptionID)}
            onCancel={() => setError("PayPal checkout was cancelled.")}
            onError={(err) => setError(err?.message || "PayPal checkout failed. Please try again.")}
          />
        </PayPalScriptProvider>
      )}
    </Container>
  );
}
