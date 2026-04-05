import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "80vh" }}>
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="text-body-secondary mb-4">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Button as={Link as any} to="/" variant="primary">
                Back to Home
            </Button>
        </Container>
    );
};

export default NotFound;