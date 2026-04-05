import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addIdea } from "../../api/ideas";
import type { ApiErrorResponse } from "../../types/common";
import axios from "axios";

const addIdeaSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type AddIdeaFormData = z.infer<typeof addIdeaSchema>;

const AddIdea = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddIdeaFormData>({
        resolver: zodResolver(addIdeaSchema),
    });

    const onSubmit = async (data: AddIdeaFormData) => {
        setAlert(null);
        try {
            const idea = await addIdea(data);
            setAlert({ type: "success", message: "Idea created successfully! Redirecting..." });
            setTimeout(() => navigate(`/${idea.id}`), 2000);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data as ApiErrorResponse;
                const detail = errorData.detail;
                const message = typeof detail === "string"
                    ? detail
                    : detail?.[0]?.msg ?? "Failed to create idea. Please try again.";
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

                <h1 className="text-primary mb-0 text-center">Add New Idea</h1>

                <form
                    className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3"
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
                            placeholder="Enter your business idea title"
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
                            placeholder="Describe your business idea in detail..."
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
                        {isSubmitting ? "Submitting..." : "Submit Idea"}
                    </button>
                </form>
            </div>
        </Container>
    );
};

export default AddIdea;