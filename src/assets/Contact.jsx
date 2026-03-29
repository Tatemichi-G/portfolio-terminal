import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Contact() {
  const [company, setCompany] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const privacyRef = useRef(null);
  const privacyTL = useRef(null);

  useLayoutEffect(() => {
    if (!privacyRef.current) return;
    gsap.set(privacyRef.current, { x: "-100vw" });

    privacyTL.current = gsap.timeline({ paused: true }).to(privacyRef.current, {
      x: "0%",
      duration: 1,
    });

    return () => {
      privacyTL.current?.kill();
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = (event) => {
    event.preventDefault();

    const mailSubject = subject.trim() || "採用・ご連絡について";
    const body = [
      `会社名: ${company || "未入力"}`,
      `お名前: ${name || "未入力"}`,
      `メールアドレス: ${email || "未入力"}`,
      "",
      "お問い合わせ内容:",
      message || "未入力",
      "",
      "※ フリーランス案件の受付は行っておりません。採用・就職に関するご連絡のみお願いいたします。",
    ].join("\n");

    window.location.href = `mailto:gt0609@g-tatemichi.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact">
      <div className="container">
        <h2 className="title font-gothic">お問い合わせ</h2>
        <aside>
          <div className="container">
            <button
              className="privacy-open-btn"
              onClick={() => {
                setIsOpen(true);
                privacyTL.current?.play();
              }}
            >
              個人情報保護方針
            </button>
            <div className={`privacy-policy${isOpen ? " open" : ""}`} ref={privacyRef}>
              <div className="privacy-policy-inner">
                <button
                  className="close-btn"
                  onClick={() => {
                    setIsOpen(false);
                    privacyTL.current?.reverse();
                  }}
                >
                  閉じる
                </button>
                <ul>
                  <li>
                    <h3>個人情報の定義</h3>
                    <p>
                      名前、メールアドレス、電話番号など、当サイトのコンタクトフォームを通じて収集する情報を指します。
                    </p>
                  </li>
                  <li>
                    <h3>利用目的</h3>
                    <p>
                      ご提供いただいた個人情報は、お問い合わせ対応およびご質問へのご返答のためにのみ利用させていただきます。採用担当者からのご連絡等の目的で使用する場合もあります。
                    </p>
                  </li>
                  <li>
                    <h3>法的根拠</h3>
                    <p>
                      個人情報の収集・利用は、個人情報保護法に基づいて適切に管理されています。
                    </p>
                  </li>
                  <li>
                    <h3>データ保護とセキュリティ</h3>
                    <p>
                      当サイトは SSL/TLS
                      暗号化により、お客様の個人情報を安全に保管しています。不正アクセスやデータ漏洩防止のため、適切なセキュリティ対策を実施しております。
                    </p>
                  </li>
                  <li>
                    <h3>データ保持期間</h3>
                    <p>
                      お問い合わせ対応完了後、原則として 6
                      ヶ月間保持いたします。その後は安全に削除いたします。
                    </p>
                  </li>
                  <li>
                    <h3>第三者提供</h3>
                    <p>
                      ご提供いただいた個人情報を、ご本人の同意なく第三者に提供することはありません。
                    </p>
                  </li>
                  <li>
                    <h3>本人の権利</h3>
                    <p>
                      ご自身の個人情報について、アクセス、修正、削除を希望される場合は、下記のお問い合わせ窓口までご連絡ください。
                    </p>
                  </li>
                  <li>
                    <h3>お問い合わせ窓口</h3>
                    <p>
                      個人情報に関する相談・苦情については、以下のメールアドレスまでお気軽にお問い合わせください。
                      <br />
                      メール: お客様のメールアドレス
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <p className="contact-lead font-mincho">
          就職・採用に関するご連絡、または非営利でWEBエンジニアとして交流していただける方はこちらからお願いいたします。
        </p>
        <p className="contact-warning font-gothic">
          ※あくまで就活を目的としたポートフォリオサイトです。フリーランス案件はお受けしません。
        </p>
        <form className="contact-form" onSubmit={handleContactSubmit}>
          <label className="contact-item contact-company font-gothic">
            <span>会社名</span>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="株式会社〇〇"
            />
          </label>
          <label className="contact-item contact-name font-gothic">
            <span>お名前</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="山田 太郎"
              required
            />
          </label>
          <label className="contact-item contact-email font-gothic">
            <span>メールアドレス</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="sample@example.com"
              required
            />
          </label>
          <label className="contact-item contact-subject font-gothic">
            <span>件名</span>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="求人について"
              required
            />
          </label>
          <label className="contact-item contact-message font-gothic">
            <span>お問い合わせ内容</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows="8"
              placeholder="ご用件をご記入ください。"
              required
            />
          </label>
          <button type="submit" className="contact-submit font-gothic">
            メールを作成する
          </button>
        </form>
      </div>
    </section>
  );
}
