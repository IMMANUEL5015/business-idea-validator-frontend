import { Modal, Button } from "react-bootstrap";
import { MessageSquare } from "lucide-react";

interface Props {
    show: boolean;
    onClose: () => void;
}

const ConversationsModal = ({ show, onClose }: Props) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex align-items-center gap-2">
                    <MessageSquare size={20} className="text-primary" />
                    AI Conversations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-4">
                <div className="mb-3">
                    <MessageSquare size={48} className="text-primary opacity-50" />
                </div>
                <h5 className="fw-semibold">Coming Soon</h5>
                <p className="text-body-secondary mb-0">
                    We are building an interactive AI assistant to help you refine and validate your ideas step by step.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>Okay</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConversationsModal;