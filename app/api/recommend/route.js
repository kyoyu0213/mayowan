export async function POST(request) {
  const { age, gender, budget, exclude } = await request.json();

  const budgetLabel = {
    "3000": "〜3,000円",
    "5000": "3,000〜5,000円",
    "10000": "5,000〜10,000円",
    "20000": "10,000〜20,000円",
    "30000": "20,000〜30,000円",
    "50000": "30,000円以上",
  }[budget];

  const genderLabel = {
    male: "男の子",
    female: "女の子",
    other: "性別問わず",
  }[gender];

  let userPrompt = `贈り先: ${age}歳の${genderLabel}\n予算: ${budgetLabel}\n\n上記の条件に合うプレゼントを3つ提案してください。`;

  if (exclude && exclude.length > 0) {
    userPrompt += `\n\n※以下の商品は既に提案済みなので除外してください：${exclude.join("、")}`;
  }

  const systemPrompt = `あなたはプレゼント選びの専門家です。贈り手は主におじいちゃん・おばあちゃん・おじさん・おばさんなど、トレンドに詳しくない世代です。
贈り先の年齢・性別・予算をもとに、「今の子供・若者に本当に喜ばれるもの」を3つ提案してください。

以下のJSON形式で回答してください。JSON以外は一切出力しないでください。
[
  {
    "name": "商品名（具体的なブランド名・商品名）",
    "reason": "なぜこれが喜ばれるか（40文字以内）",
    "price": "目安の価格帯（例: 3,000〜5,000円）",
    "searchQuery": "Amazon・楽天で検索するためのキーワード"
  }
]

ルール:
- 必ず今のトレンドを反映した具体的な商品を提案する
- 「図書カード」「現金」など無難すぎるものは避ける
- 年齢に合った提案をする（3歳と15歳では全く違う）
- 予算内に収まる提案をする
- searchQueryはAmazon/楽天で実際に検索して見つかる具体的なキーワードにする`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Anthropic API error:", res.status, errBody);
      return Response.json({ error: "API request failed" }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.content.map((c) => c.text || "").join("");
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return Response.json(parsed);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}