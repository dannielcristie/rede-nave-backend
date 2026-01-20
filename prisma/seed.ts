import prisma from "../src/config/prisma";
import { hashPassword } from "../src/utils/hash.utils";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const name = process.env.ADMIN_NAME || "Admin User";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  // 1. Create Instructor/Admin
  const password_hash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password_hash,
      role: "admin",
      bio: "Instrutora experiente e administradora da plataforma.",
      avatar_url: "https://ui-avatars.com/api/?name=Admin+User&background=random",
      status: "active",
      email_verified: true
    },
  });

  console.log({ admin });

  // 2. Create Categories
  const categoryFinance = await prisma.category.upsert({
    where: { slug: "financas" },
    update: {},
    create: {
      name: "Finanças",
      slug: "financas",
      description: "Cursos sobre gestão financeira e economia.",
      icon: "dollar-sign",
      color: "#10B981"
    }
  });

  const categoryMarketing = await prisma.category.upsert({
    where: { slug: "marketing" },
    update: {},
    create: {
      name: "Marketing",
      slug: "marketing",
      description: "Estratégias de marketing digital e vendas.",
      icon: "trending-up",
      color: "#3B82F6"
    }
  });

  // 3. Create Courses
  const course1 = await prisma.course.upsert({
    where: { slug: "gestao-financeira-para-empreendedoras" },
    update: {},
    create: {
      title: "Gestão Financeira para Empreendedoras",
      slug: "gestao-financeira-para-empreendedoras",
      description: "Aprenda a cuidar das finanças do seu negócio de forma prática e eficiente.",
      short_description: "Domine o fluxo de caixa e a precificação.",
      thumbnail_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      instructor_id: admin.id,
      category_id: categoryFinance.id,
      level: "beginner",
      duration_minutes: 240, // 4 hours
      status: "published",
      price: 0.00,
      order: 1
    }
  });

  const course2 = await prisma.course.upsert({
    where: { slug: "marketing-digital-iniciantes" },
    update: {},
    create: {
      title: "Marketing Digital para Iniciantes",
      slug: "marketing-digital-iniciantes",
      description: "Comece a vender mais usando as redes sociais a seu favor.",
      short_description: "Estratégias simples para crescer no Instagram.",
      thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      instructor_id: admin.id,
      category_id: categoryMarketing.id,
      level: "beginner",
      duration_minutes: 300, // 5 hours
      status: "published",
      price: 0.00,
      order: 2
    }
  });

  // 4. Create Modules and Lessons for Course 1
  const module1 = await prisma.module.create({
    data: {
      course_id: course1.id,
      title: "Introdução às Finanças",
      order: 1,
      lessons: {
        create: [
          {
            title: "O que é Gestão Financeira?",
            slug: "o-que-e-gestao-financeira",
            description: "Conceitos básicos para começar.",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            video_duration_seconds: 600,
            order: 1,
            is_preview: true,
            course_id: course1.id,
            content: "Nesta aula vamos aprender os conceitos fundamentais..."
          },
          {
            title: "Separando Finanças Pessoais e da Empresa",
            slug: "separando-financas",
            description: "A importância de não misturar as contas.",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            video_duration_seconds: 900,
            order: 2,
            is_preview: false,
            course_id: course1.id,
            content: "Um erro muito comum é misturar o dinheiro..."
          }
        ]
      }
    }
  });

  const module2 = await prisma.module.create({
    data: {
      course_id: course1.id,
      title: "Fluxo de Caixa",
      order: 2,
      lessons: {
        create: [
          {
            title: "Como montar seu Fluxo de Caixa",
            slug: "montando-fluxo-caixa",
            description: "Passo a passo prático.",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            video_duration_seconds: 1200,
            order: 1,
            is_preview: false,
            course_id: course1.id
          }
        ]
      }
    }
  });

  // 5. Create Enrollment for a Student User
  const studentEmail = "aluna@example.com";
  const studentExists = await prisma.user.findUnique({ where: { email: studentEmail } });

  if (!studentExists) {
    const studentPass = await hashPassword("123456");
    const student = await prisma.user.create({
      data: {
        name: "Maria Aluna",
        email: studentEmail,
        password_hash: studentPass,
        role: "student",
        status: "active"
      }
    });

    await prisma.enrollment.create({
      data: {
        user_id: student.id,
        course_id: course1.id,
        status: "active",
        progress_percentage: 20.0,
        enrolled_at: new Date(),
        expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }
    });
    console.log("Aluna de teste criada: aluna@example.com / 123456");
  } else {
    // Ensure existing student has enrollment
    const student = studentExists;
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: student.id,
          course_id: course1.id
        }
      }
    });

    if (!enrollment) {
      await prisma.enrollment.create({
        data: {
          user_id: student.id,
          course_id: course1.id,
          status: "active",
          progress_percentage: 20.0,
          enrolled_at: new Date(),
          expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        }
      });
      console.log("Matrícula adicionada para aluna existente.");
    }
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
