import React from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const fallbackImage = "https://placehold.co/600x400?text=Service+Image";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { services } = useSelector((state) => state.serviceState);

  if (!services.length) {
    return <Alert variant="info">No services available yet.</Alert>;
  }

  return (
    <Container>
      <h2 className="mb-4">Available Notary and Document Services</h2>
      <Row>
        {services.map((service) => (
          <Col key={service.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={service.sample_image || fallbackImage}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{service.service_name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text>
                  <strong>Rating:</strong> {service.rating}
                </Card.Text>
                <Button variant="primary" className="mt-auto" onClick={() => navigate(`/service/${service.id}`)}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
