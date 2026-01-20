import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LessonsService {
    async getLesson(lessonId: string, userId: string) {
        // 1. Fetch lesson to get course_id
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });

        if (!lesson) throw new Error("Aula não encontrada.");

        // 2. Check if user is instructor or admin OR if user is enrolled
        // For now, let's assume we check enrollment.
        // We should also look up the user's role if we want to bypass for teachers/admins.

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                user_id_course_id: {
                    user_id: userId,
                    course_id: lesson.course_id
                }
            }
        });

        // Check if user is the instructor of the course
        const course = await prisma.course.findUnique({
            where: { id: lesson.course_id },
            select: { instructor_id: true }
        });

        const isInstructor = course?.instructor_id === userId;

        if (!enrollment && !isInstructor && !lesson.is_preview) {
            throw new Error("Você não tem acesso a esta aula.");
        }

        // If access is granted, return lesson details
        // Ensure we send video_url only here
        return lesson;
    }
}

export const lessonsService = new LessonsService();
