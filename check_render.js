const path = require("path");
const { chromium } = require("playwright");

const MEMBERS = [
  { jp: "大谷映美里", nav: "EMIRI." },
  { jp: "大場花菜", nav: "HANA." },
  { jp: "音嶋莉沙", nav: "RISA." },
  { jp: "齋藤樹愛羅", nav: "KIARA." },
  { jp: "佐々木舞香", nav: "MAIKA." },
  { jp: "髙松瞳", nav: "HITOMI." },
  { jp: "瀧脇笙古", nav: "SHOKO." },
  { jp: "野口衣織", nav: "IORI." },
  { jp: "諸橋沙夏", nav: "SANA." },
  { jp: "山本杏奈", nav: "ANNA." }
];

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 4) {
    throw new Error(`${label} horizontal overflow ${overflow}px`);
  }
}

async function assertHomeOnly(page, label) {
  await page.waitForFunction(() => document.querySelectorAll("article").length === 0, null, { timeout: 60000 });
  const result = await page.evaluate(() => ({
    articleCount: document.querySelectorAll("article").length,
    searchCount: document.querySelectorAll('input[placeholder="タイトル・コメントで検索"]').length,
    memberNames: Array.from(document.querySelectorAll("button")).filter((button) => /大谷|大場|音嶋|齋藤|佐々木|髙松|瀧脇|野口|諸橋|山本/.test(button.innerText)).length,
    progressBadges: Array.from(document.querySelectorAll("button")).filter((button) => /\/60/.test(button.innerText)).length,
    policyLinks: document.body.innerText.includes("プライバシーポリシー"),
    oldMetaElements: ["いろは紅葉セレクト", "このページを支える人たち"].filter((text) => document.body.innerText.includes(text)),
    manager: document.body.innerText.includes("総合管理者") && document.body.innerText.includes("@eyes_takamatsu"),
    helper: document.body.innerText.includes("技術協力") && document.body.innerText.includes("いろは紅葉"),
    groupLinks: document.body.innerText.includes("=LOVE OFFICIAL LINKS") && document.body.innerText.includes("Official Site") && document.body.innerText.includes("YouTube")
  }));

  if (result.articleCount !== 0) throw new Error(`${label} home should not show video cards`);
  if (result.searchCount !== 0) throw new Error(`${label} home should not show search input`);
  if (result.memberNames !== 10) throw new Error(`${label} home expected 10 member buttons, got ${result.memberNames}`);
  if (result.progressBadges !== 10) throw new Error(`${label} home expected 10 /60 progress badges, got ${result.progressBadges}`);
  if (!result.policyLinks) {
    throw new Error(`${label} privacy link missing on home`);
  }
  if (result.oldMetaElements.length) {
    throw new Error(`${label} old visible meta elements on home: ${result.oldMetaElements.join(", ")}`);
  }
  if (!result.manager || !result.helper) {
    throw new Error(`${label} manager/helper credits missing`);
  }
  if (!result.groupLinks) {
    throw new Error(`${label} group official links missing on home`);
  }
  await assertNoOverflow(page, `${label} home`);
}

(async () => {
  const url = `file:///${path.resolve("index.html").replace(/\\/g, "/")}`;
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const viewports = [
    { name: "desktop", width: 1366, height: 900 },
    { name: "mobile", width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => {
      localStorage.removeItem("equal_love_watched_v1");
      localStorage.setItem("watched_iori_v5", JSON.stringify([1]));
      localStorage.setItem("watched_hana_v5", JSON.stringify([16]));
      localStorage.setItem("watched_maika_v5", JSON.stringify([31]));
    });

    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForFunction(() => document.title.includes("Tinterpan 10人沼ガイド"), null, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("大谷映美里"), null, { timeout: 60000 });
    await assertHomeOnly(page, viewport.name);

    await page.waitForFunction(() => {
      const watched = JSON.parse(localStorage.getItem("equal_love_watched_v1") || "[]");
      return ["iori-1", "hana-1", "maika-1"].every((id) => watched.includes(id));
    }, null, { timeout: 60000 });

    for (const member of MEMBERS) {
      await page.getByRole("button", { name: new RegExp(member.jp) }).click();
      await page.waitForFunction(() => document.querySelectorAll("article").length === 60, null, { timeout: 60000 });
      await assertNoOverflow(page, `${viewport.name} ${member.nav}`);
      await page.getByRole("button", { name: "Top", exact: true }).click();
      await assertHomeOnly(page, `${viewport.name} after ${member.nav}`);
    }

    await page.getByRole("button", { name: /野口衣織/ }).click();
    await page.waitForFunction(() => document.querySelectorAll("article").length === 60, null, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("おすすめ動画") && !document.body.innerText.includes("いろは紅葉セレクト"), null, { timeout: 60000 });

    const searchInput = page.getByPlaceholder("タイトル・コメントで検索");
    if (await searchInput.count() !== 1) {
      throw new Error(`${viewport.name} search input not unique on detail`);
    }
    const filterPosition = await searchInput.evaluate((node) => getComputedStyle(node.closest(".filter-panel")).position);
    if (filterPosition === "sticky" || filterPosition === "fixed") {
      throw new Error(`${viewport.name} search panel should not be sticky/fixed`);
    }

    await searchInput.fill("呪って");
    await page.waitForFunction(() => {
      const count = document.querySelectorAll("article").length;
      return count >= 1 && count < 60;
    }, null, { timeout: 60000 });

    const resetButton = page.locator("button").filter({ hasText: "リセット" }).first();
    await resetButton.waitFor({ state: "visible", timeout: 60000 });
    await resetButton.click();
    await page.waitForFunction(() => document.querySelectorAll("article").length === 60, null, { timeout: 60000 });

    await page.locator("select").first().selectOption("Live");
    await page.waitForFunction(() => {
      const count = document.querySelectorAll("article").length;
      return count >= 1 && count < 60;
    }, null, { timeout: 60000 });

    await resetButton.click();
    await page.locator("select").nth(1).selectOption("歌");
    await page.waitForFunction(() => {
      const count = document.querySelectorAll("article").length;
      return count >= 1 && count < 60;
    }, null, { timeout: 60000 });

    await resetButton.click();
    const watchedCheckbox = page.locator('input[type="checkbox"]');
    if (await watchedCheckbox.count() !== 1) {
      throw new Error(`${viewport.name} watched checkbox not unique`);
    }
    await watchedCheckbox.setChecked(true);
    await page.waitForFunction(() => document.querySelectorAll("article").length === 1, null, { timeout: 60000 });

    const profileButton = page.getByRole("button", { name: "Profile", exact: true });
    await profileButton.click();
    await page.waitForFunction(() => document.body.innerText.includes("公式SNS・公開コンテンツ"), null, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("好きポイント") && document.body.innerText.includes("まず観たい3本"), null, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("SHOWROOM") && document.body.innerText.includes("公式プロフィール"), null, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("公式プロフィールから拾える入口") && document.body.innerText.includes("趣味") && document.body.innerText.includes("特技"), null, { timeout: 60000 });
    await page.getByRole("button", { name: "MAIKA.", exact: true }).click();
    await page.waitForFunction(() => document.body.innerText.includes("佐々木舞香") && document.body.innerText.includes("YouTube（あんまい）") && document.querySelectorAll("article").length === 0, null, { timeout: 60000 });
    await assertNoOverflow(page, `${viewport.name} profile`);

    const policyButton = page.getByRole("button", { name: "Policy", exact: true });
    await policyButton.click();
    await page.waitForFunction(() => document.body.innerText.includes("プライバシーポリシー"), null, { timeout: 60000 });
    await page.waitForFunction(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes("視聴メモについて") && text.includes("@eyes_takamatsu") && text.includes("@iohana_momiji") && !text.includes("保存される情報");
    }, null, { timeout: 60000 });
    if ((await page.locator("article").count()) !== 0) {
      throw new Error(`${viewport.name} policy should not show archive cards`);
    }
    await page.waitForFunction(() => document.body.innerText.includes("総合管理者") && document.body.innerText.includes("技術協力"), null, { timeout: 60000 });
    await assertNoOverflow(page, `${viewport.name} policy`);

    if (errors.length) {
      throw new Error(`${viewport.name} console errors:\n${errors.join("\n")}`);
    }

    console.log(`${viewport.name}: ok`);
    await page.close();
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
