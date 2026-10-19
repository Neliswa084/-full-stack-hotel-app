import { Request, Response } from "express";
import * as reviewService from "../services/reviewsService";

const validRating = (rating: any) =>
    Number.isInteger(rating) && rating >= 1 && rating <= 5;

export const getHotelReviews = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const reviews = await reviewService.findReviewsByHotelId(hotelId);
        const summary = await reviewService.getRatingSummary(hotelId);

      
        const publicReviews = reviews.map((r) => ({
            id: r.id,
            user_id: r.user_id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            reviewer: `${r.first_name} ${r.last_name.charAt(0)}.`
        }));

        res.status(200).json({ average: summary.average, total: summary.total, reviews: publicReviews });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

export const addReview = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const { rating, comment } = req.body;
        if (!validRating(rating)) {
            return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
        }

        const userId = req.user!.id;
        const stayed = await reviewService.hasStayedAtHotel(userId, hotelId);
        if (!stayed) {
            return res.status(403).json({ message: "You can only review hotels you have stayed at" });
        }

        const review = await reviewService.createReview(userId, hotelId, rating, comment || null);
        res.status(201).json({ message: "Review added", review });
    } catch (error: any) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "You already reviewed this hotel. Edit your review instead" });
        }
        if (error.code === "23503") {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(500).json({ message: "Failed to add review" });
    }
};

export const editReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        const { rating, comment } = req.body;
        if (!validRating(rating)) {
            return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
        }

        const existing = await reviewService.findReviewById(id);
        if (!existing) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (existing.user_id !== req.user!.id) {
            return res.status(403).json({ message: "You can only edit your own review" });
        }

        const review = await reviewService.updateReview(id, rating, comment || null);
        res.status(200).json({ message: "Review updated", review });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review" });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        const existing = await reviewService.findReviewById(id);
        if (!existing) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (existing.user_id !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own review" });
        }

        await reviewService.removeReview(id);
        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review" });
    }
};