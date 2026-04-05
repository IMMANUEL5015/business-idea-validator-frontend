import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchIdeaById, updateIdea } from "../../api/ideas";
import type { ApiErrorResponse } from "../../types/common";
import axios from "axios";

const editIdeaSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type EditIdeaFormData = z.infer<typeof editIdeaSchema>;

const EditIdea = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EditIdeaFormData>({
        resolver: zodResolver(editIdeaSchema),
    });

    useEffect(() => {
        const loadIdea = async () => {
            try {
                const idea = await fetchIdeaById(Number(id));
                reset({ title: idea.title, description: idea.description });
            } catch {
                setFetchError("Failed to load idea. Please go back and try again.");
            } finally {
                setIsFetching(false);
            }
        };

        loadIdea();
    }, [id]);

    const onSubmit = async (data: EditIdeaFormData) => {
        setAlert(null);
        try {
            await updateIdea(Number(id), data);
            setAlert({ type: "success", message: "Idea updated successfully! Redirecting..." });
            setTimeout(() => navigate(`/${id}`), 2000);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data as ApiErrorResponse;
                const detail = errorData.detail;
                const message = typeof detail === "string"
                    ? detail
                    : detail?.[0]?.msg ?? "Failed to update idea. Please try again.";
                setAlert({ type: "danger", message });
            } else {
                setAlert({ type: "danger", message: "An unexpected error occurred. Please try again." });
            }
        }
    };

    return (
        <Container className="my-5">
            <div className="row">
                <div className="col-12 d-flex align-items-center gap-3 mb-4">
                    <Link to="/" className="btn btn-outline-secondary btn-sm">← Back</Link>
                </div>

                <h1 className="text-primary mb-0 text-center">Edit Business Idea</h1>

                {isFetching ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : fetchError ? (
                    <div className="col-12 mt-4">
                        <Alert variant="danger">{fetchError}</Alert>
                    </div>
                ) : (
                    <form
                        className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 mt-3"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {alert && (
                            <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                                {alert.message}
                            </Alert>
                        )}

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                id="title"
                                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                {...register("title")}
                            />
                            {errors.title && (
                                <div className="invalid-feedback">{errors.title.message}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                rows={6}
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                {...register("description")}
                            />
                            {errors.description && (
                                <div className="invalid-feedback">{errors.description.message}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                )}
            </div>
        </Container>
    );
};

export default EditIdea;