---
layout: ../../layouts/BlogLayout.astro

title: 'ASP.NET Coreで作成したAPIをBlazorから呼び出す'
pubDate: 2022-07-01
description: 'ASP.NET Coreで作成したAPIをBlazorから呼び出す'
author: 'Astro学習者'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'Astroのロゴ。'
tags: ["astro", "ブログ", "公開学習"]
---
個人開発でBlazorを扱っている最中。

サーバ側(Blazor Server)からデータを取得するためのAPIを作成して、クライアント側(Blazor Web Assembly)から作成したAPIを呼び出して画面に表示してみた。

<span style="font-size: 80%"><s>メモのようなもの。</s></span>

---

#### 使用したもの
.NET 6.0  
Microsoft.AspNetCore.Components.WebAssembly 6.0.8
Microsoft.AspNetCore.Components.WebAssembly.DevServer 6.0.8
Microsoft.AspNetCore.Components.WebAssembly.Server 6.0.8
Microsoft.EntityFrameworkCore 6.0.8
Microsoft.EntityFrameworkCore.Sqlite 6.0.8
Microsoft.EntityFrameworkCore.Tools 6.0.8

---

#### プロジェクトの構成
1. プロジェクト名.Client.csproj
2. プロジェクト名.Server.csproj
3. プロジェクト名.Shared.csproj

Clientでは画面の表示とAPIの呼び出しを行う。HTMLとか書くところ。
  
ServerにはAPIを作成する。<u>今回はREAD(GETメソッド)のみ。</u>開発が進めば他のメソッドのAPIも作成すると思う。(希望)

Sharedには、ClientとServerで共有するデータクラスを作成する。

イメージとしては、こういう感じ。
<figure class="figure-image figure-image-fotolife" title="データの流れのイメージ">[f:id:yukkevv:20220821232250j:plain]<figcaption>データの流れのイメージ</figcaption></figure>

Sharedは、その名の通りServerとClientで共有して使用するクラスを配置する。

今回は、①EntityFramework Coreで使用するEntityとして使用しているのと、②クライアント側で受け取ったJSON形式のデータをデシリアライズするのに使用している。

---

#### データモデルの用意
以下はSharedに配置したデータモデルの一部です。
```cs
namespace プロジェクト名.Shared.Entities;

public class MUser
{
    [Key]
    [Column(Order = 1, TypeName = "varchar(15)")]
    public string UserId { get; set; }

    [Column(Order = 2, TypeName = "varchar(50)")]
    public string Name { get; set; }

    [Column(Order = 3, TypeName = "varchar(128)")]
    public string MailAddress { get; set; }
}
```
---

#### APIの用意
次に、Server側にAPIを作成しておく。

「全ユーザーの情報を取得できるAPI」と、「指定したidのユーザーの情報を取得できるAPI」の2つを用意した。
```cs
using Microsoft.AspNetCore.Mvc;
using プロジェクト名.Server.EntityFrameworkCore;
using プロジェクト名.Shared.Entities;

namespace プロジェクト名.Server.Controllers;
    
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ExampleDbContext context;

    public UsersController(ExampleDbContext context)
    {
        this.context = context;
    }

    /// <summary>
    /// 全ユーザーリストを取得する
    /// </summary>
    /// <returns>全てのユーザーのJSONデータ</returns>
    [HttpGet]
    public ActionResult<IEnumerable<MUser>> Get()
    {
        return context.Users;
    }

    /// <summary>
    /// 特定のユーザーIDを持つユーザーを取得する
    /// </summary>
    /// <param name="userId">ユーザーID</param>
    /// <returns>ユーザーIDが一致したユーザーのJSONデータ</returns>
    [HttpGet("{id}")]
    public ActionResult<MUser> Get(string id)
    {
        return context.Users.Find(id);
    }
}
```
---

#### DbContextの用意
EntityFrameworkでDB(SQLite)とやり取りするために、Server側にDbContextクラスを継承したクラスを作成します。

この辺りは割とドキュメントが転がっているので楽に記述できる。
```cs
namespace プロジェクト名.Server.EntityFrameworkCore;

public class ExampleDbContext : DbContext
{
    public ExampleDbContext(DbContextOptions<ExampleDbContext> options)
        : base(options)
    {
    }

    public DbSet<MUser> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MUser>().ToTable("m_user");
    }
}
```

あと、**Blazor ServerにサービスとしてExampleDbContextを追加する必要がある**ので、「Program.cs」内の適当なところに以下のコードを追加する。

以下のコードでは、**サービスを追加すると同時に接続文字列を設定ファイルから取得している**。
```cs
builder.Services.AddDbContext<ExampleDbContext>(options
    => options.UseSqlite(connectionString: builder.Configuration.GetConnectionString("ExampleDbContext")));
```
---
    
  
#### APIの呼び出し
Client側の任意のrazorページに、データを表示する部分と、APIを呼び出すコードを書く。
```cs
@inject HttpClient Http // Http要求を使えるようにする

<h4>ユーザー一覧</h4>

@*ループで全ユーザを表示*@
@foreach (MUser user in users)
{
    <p>ユーザー名:@user.Name</p>
    <p>@@@user.UserId</p>
    <p>メールアドレス:@user.MailAddress</p>
}

@code { 
    private MUser[]? users; // デシリアライズ後のデータを入れておくﾄｺ
    // private MUser? user;  // ユーザーIDを指定するときはこう

    [Parameter]
    public string userId { get; set; } // パラメータ格納用の変数として使用する。

    // APIを呼び出すコード
    protected override async Task OnInitializedAsync()
    {
        users = await Http.GetFromJsonAsync<MUser>("api/users/"); // 全ユーザーを取得

        // ユーザーIDを指定するとき
        // user = await Http.GetFromJsonAsync<MUser>("api/users/" + userId); 
    }
}
```
- ```GetFromJsonAsync()```は、APIの呼び出しと、JSON形式の戻り値のデシリアライズを、合わせてやってくれる優れモノ。ｴﾗｲﾈ

- ```<MUser>```という風にクラスを指定すれば、指定したクラスにデシリアライズする。
- ```OnInitializedAsync()```は、razorページが初期化されたときに呼び出されるメソッド。この場合、ページが初期化されたときにAPIを呼び出して、変数```users```に結果を保持している。

</br>

こんな感じで表示される。(分かり易いようにCSSを適用しています。)
<figure class="figure-image figure-image-fotolife" title="表示される画面">[f:id:yukkevv:20220821231957p:plain]<figcaption>表示される画面</figcaption></figure>

---

#### まとめ
- 「こんなに簡単にwebページが作成できていいのか…」という感じ。
- builer.Service辺りはまだあまり良く解ってない。
- 公式ドキュメントに、ベストプラクティスがチョット載っているので、読んでおきたい。
- ASP.NET Core MVCよりも簡潔に書ける。
    - あんまりドキュメントが出揃ってない気もする。というかBlazorってあまり名前通って無いのか。
- 記事内には書いてないけど、今回初めてMigration機能を使用した。ﾒｯﾁｬｲｲ。
- AWS上に公開する場合、幾らでも弄り甲斐がありそうでワクワクする。

