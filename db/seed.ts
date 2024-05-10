import { db, Comment, Work, Article, Tag, ArticleTag, Link, User, SkillCategory, Skill, UserSkill } from 'astro:db';

export default async function () {
	await db.insert(Link).values([
		{
			id: 1,
			text: 'はてなブログ',
			url: 'https://yukkevv.hateblo.jp/',
		},
		{
			id: 2,
			text: 'Twitter (X)',
			url: 'https://twitter.com/yukkevv',
			serviceId: '@yukkevv'
		},
		{
			id: 3,
			text: 'GitHub',
			url: 'https://github.com/Yukkegt',
		}
	]);
	
	await db.insert(Work).values([
		{ id: 1, title: 'Mutsuki Portfolio Site', categoryName: 'portfolio', description: '私のポートフォリオサイトです', imageUrl: '', imageAlt: '睦月のポートフォリオのスクリーンショットです', url: 'https://yukkevv.dev' },
	]);

	await db.insert(Article).values([
		{
			id: 1,
			title: 'はじめまして',
			content: "## テスト\n\nいろいろな情報をまとめておきたいなと思って、はてなから独自のブログに鞍替えすることにした。\n\n技術情報とか生活のこととか仕事のこととかを書きます。\n\n簡単なつぶやきは[Twitter](https://twitter.com/yukkevv)に書くね..",
			published: new Date(2024, 0, 23, 0, 0, 0),
		},
		{
			id: 2,
			title: 'ASP.NET Coreで作成したAPIをBlazorから呼び出す',
			content: "テストデータです。\n\nMarkdownをうまくデータベースに入れておくにはどうしたら良いんだろう。",
			published: new Date(2024, 4, 10, 0, 0, 0),
		},
		{
			id: 3,
			title: 'EC2インスタンスを初出の年ごとにまとめてみた',
			content: "テストデータです。\n\n花屋なyなやなyなやなやなやな",
			published: new Date(2024, 4, 11, 0, 0, 0),
		},
		{
			id: 4,
			title: '自動テストを行わない組織の上長が何を考えているか',
			content: "テストデータです。\n\n開発合宿中に終わるのかな",
			published: new Date(2024, 4, 12, 0, 0, 0),
		}
	])

	await db.insert(Tag).values([
		{
			id: 1,
			name: '学習',
		},
		{
			id: 2,
			name: '技術',
		},
		{
			id: 3,
			name: 'AWS',
		},
		{
			id: 4,
			name: '雑記',
		},
	])

	await db.insert(ArticleTag).values([
		{
			articleId: 1,
			tagId: 1
		},
		{
			articleId: 2,
			tagId: 1
		},
		{
			articleId: 3,
			tagId: 1
		},
		{
			articleId: 4,
			tagId: 1
		},
		{
			articleId: 4,
			tagId: 2
		},
		{
			articleId: 1,
			tagId: 2
		},
	]);

}