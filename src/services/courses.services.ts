import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CoursesService {
    async listCourses() {
        return prisma.course.findMany({
            where: {
                status: "published", // Only show published courses
            },
            include: {
                category: true,
                instructor: {
                    select: {
                        name: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }

    async getCourseBySlug(slug: string) {
        const course = await prisma.course.findUnique({
            where: { slug },
            include: {
                category: true,
                instructor: {
                    select: {
                        name: true,
                        bio: true,
                        avatar_url: true,
                    },
                },
                modules: {
                    orderBy: { order: "asc" },
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                            where: {
                                is_preview: true, // Only fetch previewable lessons info initially? Or all? Spec says "private routes for consumption".
                                // For the public course page, we might want the list of lessons (titles), not content/video_url.
                            },
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                video_duration_seconds: true,
                                is_preview: true,
                                order: true,
                                // Excluding video_url and content for public view if strict
                            }
                        },
                    },
                },
            },
        });

        if (!course) throw new Error("Curso não encontrado.");
        return course;
    }

    async listEnrollments(userId: string) {
        const enrollments = await prisma.enrollment.findMany({
            where: { user_id: userId },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: { name: true }
                        },
                        lessons: {
                            select: { id: true } // Just to count
                        }
                    }
                }
            }
        });

        return enrollments.map(e => ({
            ...e.course,
            enrollment: {
                progress: e.progress_percentage,
                status: e.status,
                last_accessed: e.last_accessed_at,
                completed_lessons: 0, // We'd need to count lesson_progress
                total_lessons: e.course.lessons.length
            }
        }));
    }
}

export const coursesService = new CoursesService();
