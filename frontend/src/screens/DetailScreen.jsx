import React from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { createOrder } from "../actions/orderActions";

const fallbackImage = "https://placehold.co/800x500?text=Service+Image";

export default function DetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services } = useSelector((state) => state.serviceState);
  const { userInfo } = useSelector((state) => state.userState);

  const service = services.find((item) => String(item.id) === String(id));

  if (!services.length) {
    return <Alert variant="info">Loading service...</Alert>;
  }

  if (!service) {
    return <Alert variant="danger">Service not found.</Alert>;
  }

  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || "test";
  const hasRealPaypalClientId = clientId !== "test";

  const onPaymentSuccess = async (transactionId = `TXN-${Date.now()}`) => {
    await dispatch(
      createOrder({
        service_id: service.id,
        paypal_transaction_id: transactionId,
        price_paid: service.price,
      })
    );
    navigate("/profile");
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <img
            src={service.sample_image || fallbackImage}
            alt={service.service_name}
            className="img-fluid rounded shadow-sm"
          />
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3>{service.service_name}</h3>
              <p>{service.description}</p>
              <p>
                <strong>Rating:</strong> {service.rating}
              </p>
              <p>
                <strong>Price:</strong> PHP {service.price}
              </p>
              <p>
                <strong>Duration of service:</strong> {service.duration_of_service}
              </p>
              <p>
                <strong>Name of the expert:</strong> {service.name_of_the_expert}
              </p>
              {!userInfo && <Alert variant="warning">Sign in first to avail this service.</Alert>}
              {!hasRealPaypalClientId && (
                <Alert variant="warning">
                  Set <strong>REACT_APP_PAYPAL_CLIENT_ID</strong> to enable real one-time service payments.
                </Alert>
              )}
              {userInfo && (
                <PayPalScriptProvider options={{ "client-id": clientId, currency: "PHP" }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) =>
                      actions.order.create({
                        purchase_units: [
                          {
                            description: service.service_name,
                            amount: { value: String(service.price) },
                          },
                        ],
                      })
                    }
                    onApprove={(data, actions) =>
                      actions.order.capture().then(() => {
                        onPaymentSuccess(data.orderID);
                      })
                    }
                    onError={() => undefined}
                  />
                </PayPalScriptProvider>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
