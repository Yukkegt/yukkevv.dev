import { defineDb, defineTable, column, NOW } from 'astro:db';

//Comment テスト用に作成したテーブル　消す
const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    body: column.text(),
  }
})

// 作品(Worksに表示するもの)
const Work = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    categoryName: column.text(),
    description: column.text(),
    imageUrl: column.text(),
    imageAlt: column.text(),
    url: column.text(),
  }
})

// 記事(Blogに表示するもの)
const Article = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    content: column.text(),
    published: column.date({ default: NOW, optional: true })
  }
});

// 記事のタグ
const Tag = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  }
});

const ArticleTag = defineTable({
  columns: {
    articleId: column.number(),
    tagId: column.number(),
  },
  foreignKeys: [
    {
      columns: ["articleId"],
      references: () => [Article.columns.id],
    },
    {
      columns: ["tagId"],
      references: () => [Tag.columns.id],
    },
  ],
})


// Infoに表示する他SNSやサービスへのリンク
const Link = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    text: column.text(),
    url: column.text(),
    serviceId: column.text({ optional: true }),
  }
});

// ユーザー(自分)の情報
const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text(),
    displayName: column.text(),
    description: column.text(),
    icon_url: column.text(),
  }
});

// スキルのカテゴリ(Aboutに表示する)
const SkillCategory = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text()
  }
});

// スキル(Aboutに表示する)
const Skill = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    categoryId: column.number({  }),
  }
});

// ユーザーとスキルの紐付け(別になくても良いんだけどね。)
const UserSkill = defineTable({
  columns: {
    userId: column.number(),
    skillId: column.number(),
  },
  foreignKeys: [
    {
      columns: ["userId", "skillId"],
      references: () => [User.columns.id, Skill.columns.id],
    },
  ],
});

// ここでexportを行うことで、実際にデータベースにテーブルが作成される。
export default defineDb({
  tables: { Comment, Work, Article, Tag, ArticleTag, Link, User, SkillCategory, Skill, UserSkill }
});
