import React from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";

import { subscribeTier } from "../actions/subscriptionActions";

export default function SubscriptionScreen() {
  const dispatch = useDispatch();
  const { tiers } = useSelector((state) => state.subscriptionState);
  const { userInfo } = useSelector((state) => state.userState);
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || "test";

  const subscribeHandler = (tier) => {
    dispatch(subscribeTier(tier));
    alert(`Subscribed to ${tier.name}`);
  };

  return (
    <Container>
      <h3 className="mb-4">Subscription Plans</h3>
      {!userInfo && <Alert variant="warning">Sign in first to subscribe.</Alert>}
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
                {userInfo && (
                  <PayPalScriptProvider options={{ "client-id": clientId, intent: "subscription" }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createSubscription={(data, actions) => {
                        const fallbackPlanId = process.env.REACT_APP_PAYPAL_PLAN_ID || "P-TEST-PLAN";
                        return actions.subscription.create({ plan_id: fallbackPlanId });
                      }}
                      onApprove={() => subscribeHandler(tier)}
                      onError={() => subscribeHandler(tier)}
                    />
                  </PayPalScriptProvider>
                )}
                {userInfo && (
                  <Button variant="outline-primary" className="mt-2" onClick={() => subscribeHandler(tier)}>
                    Demo Subscribe (Fallback)
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
