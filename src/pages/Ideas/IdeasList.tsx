import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Card, Pagination, Alert, Spinner } from "react-bootstrap";
import { Edit, Eye, Plus, Trash, MessageSquare } from "lucide-react";
import useIdeasStore from "../../store/ideasStore";
import { Link } from "react-router-dom";
import { deleteIdea } from "../../api/ideas";
import ConversationsModal from "../../components/ConversationsModal";

const ITEMS_PER_PAGE = 9;

const statusVariant: Record<string, string> = {
    draft: "danger",
    validated: "secondary",
    completed: "success",
};

const IdeasList = () => {
    const { ideas, pages, isLoading, errorMsg, loadIdeas } = useIdeasStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const [showConversations, setShowConversations] = useState(false);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) return;
        setDeletingId(id);
        setDeleteError("");
        try {
            await deleteIdea(id);
            loadIdeas(currentPage, ITEMS_PER_PAGE);
        } catch {
            setDeleteError("Failed to delete idea. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        loadIdeas(currentPage, ITEMS_PER_PAGE);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Container className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1 className="text-primary">Business Ideas</h1>
                <Link to="/add">
                    <Button className="d-flex align-items-center gap-2">
                        <Plus size={18}/>
                        <span className="d-none d-sm-inline">Add New Idea</span>
                        <span className="d-sm-none">Add</span>
                    </Button>
                </Link>
            </div>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {deleteError && <Alert variant="danger" dismissible onClose={() => setDeleteError("")}>{deleteError}</Alert>}

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : ideas.length === 0 && !errorMsg ? (
                <div className="text-center py-5">
                    <h5 className="text-body-secondary">No Ideas Found</h5>
                    <p>Click "Add New Idea" button to get started</p>
                </div>
            ) : (
                <Row className="g-4 py-4">
                    {ideas.map((idea) => (
                        <Col key={idea.id} xs={12} md={6} lg={4}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <h6 className="text-primary mb-1 text-truncate me-2">
                                            {idea.title}
                                        </h6>
                                        <div className="d-flex gap-2 flex-shrink-0">
                                            <Link to={`/${idea.id}`}>
                                                <Button variant="outline-primary" size="sm">
                                                    <Eye size={14}/>
                                                </Button>
                                            </Link>
                                            
                                            <Link to={`/edit/${idea.id}`}>
                                                <Button variant="outline-warning" size="sm">
                                                <Edit size={14}/>
                                            </Button>
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                disabled={deletingId === idea.id}
                                                onClick={() => handleDelete(idea.id)}
                                            >
                                                {deletingId === idea.id
                                                    ? <Spinner animation="border" size="sm" />
                                                    : <Trash size={14}/>}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mb-4 align-items-center">
                                        <div>
                                            <strong>Description: </strong>
                                        </div>
                                        <p>
                                            {idea.description.length > 100
                                                ? idea.description.slice(0, 100) + "..."
                                                : idea.description}
                                        </p>
                                    </div>

                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <strong>Status:</strong>
                                            <span className={`badge bg-${statusVariant[idea.status] ?? "secondary"} text-capitalize`}>
                                                {idea.status}
                                            </span>
                                        </div>
                                        <Button size="sm" onClick={() => setShowConversations(true)}>
                                            <MessageSquare size={14} className="me-1" />
                                            Conversations
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {!isLoading && pages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                        {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === pages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
                </div>
            )}
            <ConversationsModal
                show={showConversations}
                onClose={() => setShowConversations(false)}
            />
        </Container>
    );
};

export default IdeasList;