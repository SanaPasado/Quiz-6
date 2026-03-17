import React, { useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { createService, deleteService, updateService } from "../actions/serviceActions";

const initialForm = {
  service_name: "",
  description: "",
  price: "",
  duration_of_service: "",
  sample_image: "",
};

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.serviceState);
  const { userInfo } = useSelector((state) => state.userState);
  const [formData, setFormData] = useState(initialForm);

  const myServices = useMemo(
    () => services.filter((service) => service.seller_id === userInfo.id),
    [services, userInfo.id]
  );

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(createService({ ...formData, price: Number(formData.price), rating: 4.8 }));
    setFormData(initialForm);
  };

  const editHandler = (service) => {
    const nextPrice = Number(window.prompt("Update price", service.price));
    if (!nextPrice) return;
    dispatch(updateService(service.id, { price: nextPrice }));
  };

  return (
    <Container>
      <Row>
        <Col md={5}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>Add New Service</h4>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-2">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Duration of Service</Form.Label>
                  <Form.Control
                    value={formData.duration_of_service}
                    onChange={(e) => setFormData({ ...formData, duration_of_service: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    value={formData.sample_image}
                    onChange={(e) => setFormData({ ...formData, sample_image: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100">
                  Add Service
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Manage Existing Services</h4>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.service_name}</td>
                      <td>PHP {service.price}</td>
                      <td>{service.duration_of_service}</td>
                      <td>
                        <Button size="sm" className="me-2" onClick={() => editHandler(service)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => dispatch(deleteService(service.id))}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
