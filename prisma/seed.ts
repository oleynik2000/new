import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create tags
  const tags = await Promise.all(
    [
      "technology",
      "business",
      "food",
      "travel",
      "health",
      "entertainment",
      "sports",
      "education",
      "гороскоп",
      "астрологія",
      "знакизодіаку",
    ].map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // Create entities with safe, neutral content
  const entities = [
    {
      title: "TechCorp Cloud Services",
      description:
        "A major cloud computing provider that recently expanded its data center network. Users report mixed experiences with their customer support. What has your experience been like?",
      category: "company",
      imageUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
      tagNames: ["technology", "business"],
    },
    {
      title: "The New Galaxy Phone 2026",
      description:
        "The latest flagship smartphone promises groundbreaking camera features and all-day battery life. But is it worth the premium price tag? Share your honest opinions.",
      category: "thing",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      tagNames: ["technology"],
    },
    {
      title: "Chef Marco's Italian Kitchen",
      description:
        "A popular downtown restaurant known for its handmade pasta. Reviews range from outstanding to disappointing. Have you been there recently?",
      category: "company",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      tagNames: ["food", "business"],
    },
    {
      title: "FitLife Wellness App",
      description:
        "A fitness and wellness app that tracks your workouts, nutrition, and sleep. Some users love it, while others have privacy concerns about the data it collects.",
      category: "thing",
      imageUrl:
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600",
      tagNames: ["technology", "health"],
    },
    {
      title: "City Metro Transit System",
      description:
        "The city just announced a major expansion of its metro system. Will it improve commute times, or is it just another delayed infrastructure project?",
      category: "other",
      imageUrl:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
      tagNames: ["travel"],
    },
    {
      title: "GreenEnergy Solar Panels",
      description:
        "GreenEnergy claims to offer the most efficient residential solar panels on the market. Homeowners share their experiences with installation and savings.",
      category: "company",
      imageUrl:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
      tagNames: ["technology", "business"],
    },
    {
      title: "Riverside Community College",
      description:
        "Riverside recently revamped its online learning platform. Students are sharing their experiences with the new system. Worth enrolling?",
      category: "other",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600",
      tagNames: ["education"],
    },
    {
      title: "StreamVibe Music Platform",
      description:
        "A newer music streaming service that promises better payouts for artists and higher quality audio. How does it compare to the big players?",
      category: "thing",
      imageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600",
      tagNames: ["technology", "entertainment"],
    },
    {
      title: "Гороскоп на тиждень: Овен",
      description:
        "Цього тижня Овни відчують прилив енергії та натхнення. Зірки сприяють новим починанням та важливим рішенням. Не бійтеся ризикувати!",
      category: "other",
      contentType: "horoscope",
      zodiacSign: "aries",
      tagNames: ["гороскоп", "астрологія", "знакизодіаку"],
    },
    {
      title: "Гороскоп на тиждень: Телець",
      description:
        "Тельцям варто зосередитися на фінансових питаннях. Можливі несподівані доходи або вигідні пропозиції. Будьте уважні до деталей.",
      category: "other",
      contentType: "horoscope",
      zodiacSign: "taurus",
      tagNames: ["гороскоп", "астрологія", "знакизодіаку"],
    },
    {
      title: "Загальний гороскоп на березень 2026",
      description:
        "Березень принесе зміни для всіх знаків зодіаку. Це час для самоаналізу та планування майбутнього. Зірки радять бути відкритими до нових можливостей.",
      category: "other",
      contentType: "horoscope",
      zodiacSign: "",
      tagNames: ["гороскоп", "астрологія"],
    },
  ];

  const commentSets = [
    [
      "Really interesting topic! Would love to hear more perspectives on this.",
      "Agreed! I think we need more detailed comparisons.",
      "Does anyone have recent data on this?",
    ],
    [
      "Great discussion. I have had a mostly positive experience personally.",
      "Same here, though there is definitely room for improvement.",
      "Can anyone share their long-term experience?",
    ],
    [
      "I have been following this closely. Lots of potential here.",
      "The value proposition seems solid if the quality holds up.",
      "Worth keeping an eye on how this evolves over the next year.",
    ],
  ];

  // Create badges
  const badgeData = [
    { key: "first_post", nameUk: "Перший пост", nameEn: "First Post", nameRu: "Первый пост", nameEs: "Primera publicacion", descUk: "Опублікували перший пост", descEn: "Published first post", descRu: "Опубликовали первый пост", descEs: "Publicaste tu primera publicacion", icon: "📝", threshold: 1 },
    { key: "commentator", nameUk: "Коментатор", nameEn: "Commentator", nameRu: "Комментатор", nameEs: "Comentarista", descUk: "Залишили 10 коментарів", descEn: "Left 10 comments", descRu: "Оставили 10 комментариев", descEs: "Dejaste 10 comentarios", icon: "💬", threshold: 10 },
    { key: "popular", nameUk: "Популярний", nameEn: "Popular", nameRu: "Популярный", nameEs: "Popular", descUk: "Набрали 50 балів", descEn: "Earned 50 points", descRu: "Набрали 50 баллов", descEs: "Ganaste 50 puntos", icon: "⭐", threshold: 50 },
    { key: "expert", nameUk: "Експерт", nameEn: "Expert", nameRu: "Эксперт", nameEs: "Experto", descUk: "Набрали 200 балів", descEn: "Earned 200 points", descRu: "Набрали 200 баллов", descEs: "Ganaste 200 puntos", icon: "🏆", threshold: 200 },
    { key: "streak_7", nameUk: "Тижнева серія", nameEn: "Week Streak", nameRu: "Недельная серия", nameEs: "Racha semanal", descUk: "7 днів поспіль", descEn: "7 day streak", descRu: "7 дней подряд", descEs: "7 dias seguidos", icon: "🔥", threshold: 7 },
    { key: "legend", nameUk: "Легенда", nameEn: "Legend", nameRu: "Легенда", nameEs: "Leyenda", descUk: "Набрали 500 балів", descEn: "Earned 500 points", descRu: "Набрали 500 баллов", descEs: "Ganaste 500 puntos", icon: "👑", threshold: 500 },
  ];

  for (const badge of badgeData) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: {},
      create: badge,
    });
  }

  for (const entityData of entities) {
    const entity = await prisma.entity.create({
      data: {
        title: entityData.title,
        description: entityData.description,
        category: entityData.category,
        contentType: entityData.contentType || "review",
        zodiacSign: entityData.zodiacSign || null,
        imageUrl: entityData.imageUrl || null,
        tags: {
          create: entityData.tagNames.map((name) => ({
            tagId: tags.find((t) => t.name === name)!.id,
          })),
        },
      },
    });

    // Add comments from a random set
    const comments =
      commentSets[Math.floor(Math.random() * commentSets.length)];

    const comment1 = await prisma.comment.create({
      data: {
        content: comments[0],
        entityId: entity.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: comments[1],
        entityId: entity.id,
        parentId: comment1.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: comments[2],
        entityId: entity.id,
      },
    });

    // Add some votes
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
      await prisma.vote.create({
        data: {
          entityId: entity.id,
          value: Math.random() > 0.3 ? 1 : -1,
          voterHash: `seed-voter-${entity.id}-${i}`,
        },
      });
    }
  }

  console.log("Seed data created successfully! (with horoscopes and badges)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
