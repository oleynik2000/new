import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create tags
  const tags = await Promise.all(
    ["політика", "бізнес", "технології", "скандал", "спорт", "культура"].map(
      (name) => prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // Create entities
  const entities = [
    {
      title: "Корпорація «Нова Енергія»",
      description:
        "Велика енергетична компанія, яка останнім часом привернула увагу через екологічні порушення. Громадськість вимагає пояснень.",
      category: "company",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
      tagNames: ["бізнес", "скандал"],
    },
    {
      title: "Загадковий блогер «ТіньМедіа»",
      description:
        "Анонімний блогер, який публікує розслідування про корупцію. Ніхто не знає його справжню особу.",
      category: "person",
      imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600",
      tagNames: ["політика", "скандал"],
    },
    {
      title: "Смартфон XPhone Pro 2026",
      description:
        "Новий флагманський смартфон, який обіцяє революційні можливості. Але чи варто він своєї ціни?",
      category: "thing",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      tagNames: ["технології"],
    },
    {
      title: "Мер міста Зеленодольськ",
      description:
        "Новий мер міста обіцяв кардинальні зміни. Минуло 6 місяців — що змінилося?",
      category: "person",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
      tagNames: ["політика"],
    },
    {
      title: "Ресторан «Золотий Дракон»",
      description:
        "Популярний ресторан у центрі міста. Відгуки дуже суперечливі — від захоплення до повного розчарування.",
      category: "company",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      tagNames: ["бізнес", "культура"],
    },
    {
      title: "Додаток HealthTrack",
      description:
        "Фітнес-додаток, який збирає надто багато персональних даних. Чи безпечно ним користуватися?",
      category: "thing",
      imageUrl: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600",
      tagNames: ["технології"],
    },
    {
      title: "Футбольний клуб «Динамо Степ»",
      description:
        "Місцевий футбольний клуб, який несподівано вийшов у фінал чемпіонату. Справжня Попелюшка сезону!",
      category: "other",
      imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600",
      tagNames: ["спорт"],
    },
    {
      title: "Банк «ПриватІнвест»",
      description:
        "Банк під підозрою у відмиванні коштів. Клієнти скаржаться на блокування рахунків без пояснень.",
      category: "company",
      imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600",
      tagNames: ["бізнес", "скандал"],
    },
  ];

  for (const entityData of entities) {
    const entity = await prisma.entity.create({
      data: {
        title: entityData.title,
        description: entityData.description,
        category: entityData.category,
        imageUrl: entityData.imageUrl,
        tags: {
          create: entityData.tagNames.map((name) => ({
            tagId: tags.find((t) => t.name === name)!.id,
          })),
        },
      },
    });

    // Add some comments
    const comment1 = await prisma.comment.create({
      data: {
        content: "Дуже цікава тема! Хотілося б дізнатися більше.",
        entityId: entity.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "Погоджуюсь! Треба більше інформації.",
        entityId: entity.id,
        parentId: comment1.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "А хтось має інші дані з цього приводу?",
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

  console.log("Seed data created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
