import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Badge, Alert, Spinner, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Edit, Trash, MessageSquare, ShieldCheck, FileText,
    AlertTriangle, Lightbulb, Bot, TrendingUp, Target,
    DollarSign, Rocket, Swords, CircleAlert, BarChart3, ArrowRight
} from "lucide-react";
import axios from "axios";
import { fetchIdeaById, deleteIdea, retryValidation, retryBusinessPlan } from "../../api/ideas";
import type { IdeaDetail, BusinessPlanContent } from "../../types/idea";
import type { ApiErrorResponse } from "../../types/common";
import ConversationsModal from "../../components/ConversationsModal";

const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        const detail = errorData.detail;
        return typeof detail === "string"
            ? detail
            : detail?.[0]?.msg ?? fallback;
    }
    return fallback;
};

const statusVariant: Record<string, string> = {
    draft: "danger",
    validated: "secondary",
    completed: "success",
};

const businessPlanSections: { key: keyof BusinessPlanContent; label: string; icon: React.ReactNode }[] = [
    { key: "executive_summary",        label: "Executive Summary",        icon: <FileText size={16} /> },
    { key: "problem_statement",        label: "Problem Statement",        icon: <CircleAlert size={16} /> },
    { key: "proposed_solution",        label: "Proposed Solution",        icon: <Lightbulb size={16} /> },
    { key: "target_market",            label: "Target Market",            icon: <Target size={16} /> },
    { key: "unique_value_proposition", label: "Unique Value Proposition", icon: <ShieldCheck size={16} /> },
    { key: "revenue_model",            label: "Revenue Model",            icon: <DollarSign size={16} /> },
    { key: "go_to_market_strategy",    label: "Go-to-Market Strategy",    icon: <Rocket size={16} /> },
    { key: "competitive_landscape",    label: "Competitive Landscape",    icon: <Swords size={16} /> },
    { key: "risks_and_mitigation",     label: "Risks & Mitigation",       icon: <AlertTriangle size={16} /> },
    { key: "financial_outlook",        label: "Financial Outlook",        icon: <BarChart3 size={16} /> },
    { key: "next_steps",               label: "Next Steps",               icon: <ArrowRight size={16} /> },
];

const Idea = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const validationRef = useRef<HTMLDivElement>(null);
    const businessPlanRef = useRef<HTMLDivElement>(null);

    const [idea, setIdea] = useState<IdeaDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [validateError, setValidateError] = useState("");
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [planError, setPlanError] = useState("");
    const [showConversations, setShowConversations] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchIdeaById(Number(id));
                setIdea(data);
            } catch (err) {
                setFetchError(extractErrorMessage(err, "Failed to load idea details. Please go back and try again."));
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleValidate = async () => {
        setIsValidating(true);
        setValidateError("");
        try {
            const updated = await retryValidation(Number(id));
            setIdea(updated);
            setTimeout(() => validationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err) {
            setValidateError(extractErrorMessage(err, "Validation failed. Please try again."));
        } finally {
            setIsValidating(false);
        }
    };

    const handleGeneratePlan = async () => {
        setIsGeneratingPlan(true);
        setPlanError("");
        try {
            const updated = await retryBusinessPlan(Number(id));
            setIdea(updated);
            setTimeout(() => businessPlanRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err) {
            setPlanError(extractErrorMessage(err, "Failed to generate business plan. Please try again."));
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            await deleteIdea(Number(id));
            navigate("/");
        } catch (err) {
            setDeleteError(extractErrorMessage(err, "Failed to delete idea. Please try again."));
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (fetchError || !idea) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{fetchError || "Idea not found."}</Alert>
                <Link to="/" className="btn btn-outline-secondary btn-sm">← Back to Ideas</Link>
            </Container>
        );
    }

    return (
        <Container className="my-5">

            {/* Top action bar */}
            <Row className="align-items-center gap-2 gap-md-0 mb-4">
                {/* Back button — full width on xs, auto on sm+ */}
                <Col xs={12} sm="auto">
                    <Link to="/" className="btn btn-outline-secondary btn-sm w-100 w-sm-auto">← Back</Link>
                </Col>

                {/* Action buttons — stack on xs, row on sm+, pushed right on md+ */}
                <Col xs={12} sm className="d-flex flex-wrap gap-2 justify-content-sm-end">
                    {!idea.validation && (
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1 flex-sm-grow-0"
                            onClick={handleValidate}
                            disabled={isValidating}
                        >
                            {isValidating
                                ? <><Spinner animation="border" size="sm" className="me-1" />Validating...</>
                                : <><ShieldCheck size={14} className="me-1" />Validate</>
                            }
                        </Button>
                    )}
                    {!idea.business_plan && (
                        <Button
                            variant="outline-success"
                            size="sm"
                            className="flex-grow-1 flex-sm-grow-0"
                            onClick={handleGeneratePlan}
                            disabled={isGeneratingPlan}
                        >
                            {isGeneratingPlan
                                ? <><Spinner animation="border" size="sm" className="me-1" />Generating...</>
                                : <><FileText size={14} className="me-1" /><span className="d-none d-md-inline">Generate Business Plan</span><span className="d-md-none">Generate Plan</span></>
                            }
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-grow-1 flex-sm-grow-0"
                        onClick={() => setShowConversations(true)}
                    >
                        <MessageSquare size={14} className="me-1" />
                        Conversations
                    </Button>
                    <Link to={`/edit/${idea.id}`}>
                        <Button variant="outline-warning" size="sm">
                            <Edit size={14} />
                        </Button>
                    </Link>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Spinner animation="border" size="sm" /> : <Trash size={14} />}
                    </Button>
                </Col>
            </Row>

            {deleteError && (
                <Alert variant="danger" dismissible onClose={() => setDeleteError("")}>
                    {deleteError}
                </Alert>
            )}
            {validateError && (
                <Alert variant="danger" dismissible onClose={() => setValidateError("")}>
                    {validateError}
                </Alert>
            )}
            {planError && (
                <Alert variant="danger" dismissible onClose={() => setPlanError("")}>
                    {planError}
                </Alert>
            )}

            {/* Section 1 — Idea Details */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
                    <Lightbulb size={18} />
                    <strong>Idea Details</strong>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <h4 className="text-primary mb-0">{idea.title}</h4>
                        <Badge bg={statusVariant[idea.status] ?? "secondary"} className="text-capitalize">
                            {idea.status}
                        </Badge>
                    </div>
                    <p className="text-body-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {idea.description}
                    </p>
                </Card.Body>
            </Card>

            {/* Section 2 — Validation */}
            <Card className="mb-4 shadow-sm" ref={validationRef}>
                <Card.Header className="d-flex align-items-center gap-2"
                    style={{ backgroundColor: idea.validation ? "var(--bs-success)" : "var(--bs-secondary)", color: "white" }}
                >
                    <ShieldCheck size={18} />
                    <strong>Validation</strong>
                </Card.Header>
                {idea.validation ? (
                    <Card.Body className="p-3 p-md-4">
                        <Row className="g-3">
                            {/* Score — full width on xs/sm, 1/3 on md+ */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="text-center p-3 border rounded h-100">
                                    <TrendingUp size={28} className="text-primary mb-2" />
                                    <div className="text-body-secondary small mb-1">Validation Score</div>
                                    <h2 className="text-primary mb-0">
                                        {idea.validation.score}
                                        <span className="fs-5 text-body-secondary">/100</span>
                                    </h2>
                                </div>
                            </Col>
                            {/* Risks */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 border rounded h-100">
                                    <div className="d-flex align-items-center gap-2 mb-2 text-danger">
                                        <AlertTriangle size={16} />
                                        <strong>Risks</strong>
                                    </div>
                                    <p className="mb-0 text-body-secondary small">{idea.validation.risks}</p>
                                </div>
                            </Col>
                            {/* Opportunities */}
                            <Col xs={12} sm={12} md={4}>
                                <div className="p-3 border rounded h-100">
                                    <div className="d-flex align-items-center gap-2 mb-2 text-success">
                                        <Rocket size={16} />
                                        <strong>Opportunities</strong>
                                    </div>
                                    <p className="mb-0 text-body-secondary small">{idea.validation.opportunities}</p>
                                </div>
                            </Col>
                            {/* AI Feedback — always full width */}
                            <Col xs={12}>
                                <div className="p-3 border rounded">
                                    <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                                        <Bot size={16} />
                                        <strong>AI Feedback</strong>
                                    </div>
                                    <p className="mb-0 text-body-secondary" style={{ whiteSpace: "pre-wrap" }}>
                                        {idea.validation.ai_feedback}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                ) : (
                    <Card.Body className="text-center py-4 text-body-secondary">
                        <ShieldCheck size={32} className="mb-2 opacity-50" />
                        <p className="mb-0">No validation available for this idea yet.</p>
                    </Card.Body>
                )}
            </Card>

            {/* Section 3 — Business Plan */}
            <Card className="mb-4 shadow-sm" ref={businessPlanRef}>
                <Card.Header className="d-flex align-items-center gap-2"
                    style={{ backgroundColor: idea.business_plan ? "#0d6efd" : "var(--bs-secondary)", color: "white" }}
                >
                    <FileText size={18} />
                    <strong>Business Plan</strong>
                </Card.Header>
                {idea.business_plan ? (
                    <Card.Body className="p-3 p-md-4">
                        <Row className="g-3">
                            {businessPlanSections.map(({ key, label, icon }) => (
                                <Col xs={12} sm={6} xl={4} key={key}>
                                    <div className="p-3 border rounded h-100">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                                            {icon}
                                            <strong className="small">{label}</strong>
                                        </div>
                                        <p className="mb-0 text-body-secondary small" style={{ whiteSpace: "pre-wrap" }}>
                                            {idea?.business_plan?.content[key]}
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                ) : (
                    <Card.Body className="text-center py-4 text-body-secondary">
                        <FileText size={32} className="mb-2 opacity-50" />
                        <p className="mb-0">No business plan available for this idea yet.</p>
                    </Card.Body>
                )}
            </Card>

            <ConversationsModal
                show={showConversations}
                onClose={() => setShowConversations(false)}
            />
        </Container>
    );
};

export default Idea;