import { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import "../App.css";
import { Workers, works } from "../assets/WorkersArray.jsx";
import { getCMS } from "../assets/fetch.js";
import ThreeMV from "../assets/ThreeMV.jsx";
import WorksDisplay from "../assets/WorksDisplay.jsx";
import Header from "../assets/Header.jsx";
import News from "../assets/News.jsx";
import Footer from "../assets/Footer.jsx";

// react-router-dom
// import { Link } from "react-router-dom";

// GSAP import
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  // Tagのキー合わせ、フィルター =>
  const all = "All";
  const [selectedTagId, setSelectedTagId] = useState(all);
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [selectedWorkerId, setSelectedWorkerId] = useState(
    Workers[0]?.id ?? null,
  );

  // 間違いポイント１：ここuseMemoいらない。
  const selectedWorker = Workers.find(
    (worker) => worker.id === selectedWorkerId,
  );
  // ↓間違いコード
  // const selectedWorker = useMemo(() => {
  //   Workers.find((worker) => worker.id === selectedWorkerId);
  // },[selectedWorkerId])

  const filteredWorks = useMemo(() => {
    if (selectedWorkerId == null) return []; //selectedWorkerがnullならから配列を返す。
    return works.filter((work) => work.workerId === selectedWorkerId); //あればworksから
  }, [selectedWorkerId]);

  // filteredTag && filteredWorks の場合の配列を作る。
  const displayWorks = useMemo(() => {
    if (selectedTagId === all) return filteredWorks;
    return filteredWorks.filter((work) => work.tagId === selectedTagId);
  }, [filteredWorks, selectedTagId]);

  const rootRef = useRef(null);
  // .works-list の中のカードをそれぞれ格納する場所
  const worksRef = useRef([]);

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

  // ハンバーガーメニュー

  // ScrollTrigger
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ~767px スマホ～ipad縦までの画面幅
      mm.add("(max-width: 767px)", () => {
        // 自己紹介アニメーション
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".worker-wrapper",
              start: "top bottom",
              end: "top center ",
              scrub: 3,
            },
          })
          .from(
            ".moveLeft",
            {
              duration: 0.75,
              x: -10,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveRight",
            {
              duration: 0.75,
              x: 10,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveUp",
            {
              duration: 0.75,
              y: 10,
              autoAlpha: 0,
            },
            0.7,
          )
          .from(
            ".worker-img",
            {
              duration: 1,
              width: "100%",
              borderRadius: 0,
              autoAlpha: 0,
            },
            0,
          )
          .from(
            ".worker-img img",
            {
              duration: 1.5,
              borderRadius: 0,
            },
            0,
          );

        worksRef.current.slice(0, displayWorks.length).forEach((work) => {
          gsap.from(work, {
            y: 150,
            autoAlpha: 0,
            scrollTrigger: {
              trigger: work,
              start: "top-=100 bottom",
              end: "bottom bottom",
              scrub: 3,
            },
          });
        });
      });

      // 768px ~ 1199px ipad縦 ~ ipad横 ~ PC小(11インチ)までの画面幅
      mm.add("(min-width: 768px) and (max-width: 1199px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".worker-wrapper",
              start: "top bottom",
              end: "top center ",
              scrub: 3,
            },
          })
          .from(
            ".moveLeft",
            {
              duration: 0.75,
              x: -25,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveRight",
            {
              duration: 0.75,
              x: 25,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveUp",
            {
              duration: 0.75,
              y: 25,
              autoAlpha: 0,
            },
            0.7,
          )
          .fromTo(
            ".worker-img",
            {
              autoAlpha: 0,
              x: 100,
            },
            {
              duration: 1.5,
              width: 200,
              height: 200,
              autoAlpha: 1,
              x: 0,
            },
            0,
          )
          .from(
            ".worker-img img",
            {
              duration: 1.5,
              borderRadius: 0,
            },
            0,
          );

        worksRef.current.slice(0, displayWorks.length).forEach((work) => {
          gsap.from(work, {
            y: 175,
            autoAlpha: 0,
            scrollTrigger: {
              trigger: work,
              start: "top-=100 bottom",
              end: "bottom bottom",
              scrub: 3,
            },
          });
        });
      });

      // 1200px~ 小PC～の画面幅
      mm.add("(min-width: 1200px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".worker-wrapper",
              start: "top bottom",
              end: "top center ",
              scrub: 3,
            },
          })
          .from(
            ".moveLeft",
            {
              duration: 0.75,
              x: -50,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveRight",
            {
              duration: 0.75,
              x: 50,
              autoAlpha: 0,
            },
            0.5,
          )
          .from(
            ".moveUp",
            {
              duration: 0.75,
              y: 50,
              autoAlpha: 0,
            },
            0.7,
          )
          .fromTo(
            ".worker-img",
            {
              autoAlpha: 0,
              x: 200,
            },
            {
              duration: 1.5,
              width: 400,
              height: 400,
              autoAlpha: 1,
              x: 0,
            },
            0,
          )
          .from(
            ".worker-img img",
            {
              duration: 1.5,
              borderRadius: 0,
            },
            0,
          );

        worksRef.current.slice(0, displayWorks.length).forEach((work) => {
          gsap.from(work, {
            y: 200,
            autoAlpha: 0,
            stagger: 0.5,
            scrollTrigger: {
              trigger: work,
              start: "top-=100 bottom",
              end: "bottom bottom",
              scrub: 3,
            },
          });
        });
      });

      return () => mm.revert();
    }, rootRef);

    return () => context.revert();
  }, [selectedWorkerId, displayWorks]);

  // ヘッダーロゴアニメーション
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const contextHead = gsap.context(() => {
      const mm = gsap.matchMedia();
      // ~767px スマホ～ipad縦までの画面幅
      mm.add("(max-width: 1199px)", () => {
        // Headerロゴアニメーション
        gsap.to(".logo", {
          width: 40,
          height: 40,
          borderRadius: "50%",
          scrollTrigger: {
            trigger: ".worker-box",
            start: "top+=100 top",
            end: "+=10",
            scrub: 2,
            // markers: true,
            onEnter: () => {
              document.querySelector(".logo").textContent = "G";
            },
            onEnterBack: () => {
              document.querySelector(".logo").textContent = "G-tatemi";
            },
            onLeaveBack: () => {
              document.querySelector(".logo").textContent = "G-tatemi";
            },
          },
        });

        return () => {
          // tween.kill();
          gsap.set(".logo", { clearProps: "width,height" });
        };
      });

      mm.add("(min-width: 1200px)", () => {
        // Headerロゴアニメーション
        gsap.to(".logo", {
          width: 80,
          height: 80,
          borderRadius: "50%",
          x:
            -((window.innerWidth - 1200) / 2) +
            (window.innerWidth - 1200) / 2 -
            80 -
            16,
          scrollTrigger: {
            trigger: ".worker-box",
            start: "top+=100 top",
            end: "+=10",
            scrub: 2,
            // markers: true,
            onEnter: () => {
              document.querySelector(".logo").textContent = "G";
            },
            onEnterBack: () => {
              document.querySelector(".logo").textContent = "G-tatemi";
            },
            onLeaveBack: () => {
              document.querySelector(".logo").textContent = "G-tatemi";
            },
          },
        });

        return () => {
          // tween.kill();
          gsap.set(".logo", { clearProps: "width,height" });
        };
      });
    }, rootRef.current);

    return () => contextHead.revert();
  }, []);

  // MicroCMSの取得
  const [cmsNews, setCmsNews] = useState([]);
  // 開発用
  useEffect(() => {
    const cmsData = async () => {
      const data = await getCMS();
      if (!data) return;
      setCmsNews(data.contents);
    };

    cmsData();
  }, []);

  // 本番用
  // useEffect(() => {
  //   const cmsData = async () => {
  //     const data = await getCMS();
  //     if (!data) return;
  //     setCmsNews(data.contents);
  //   };
  // },[]);

  return (
    <div id='top' ref={rootRef}>
      <Header pageType='home' />

      <ThreeMV />

      <section id='about' className='container worker-box'>
        <h2 className='title font-gothic'>自己紹介</h2>

        <ul>
          {Workers.map((worker) => {
            return (
              <li key={worker.id}>
                <button
                  className='font-gothic'
                  onClick={() => setSelectedWorkerId(worker.id)}
                >
                  {worker.nameJa} / {worker.name}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {selectedWorker ? (
        <>
          <div className='container worker-wrapper'>
            <div className='worker-prof'>
              <div>
                <h3 className='moveLeft font-hinamincho'>
                  {selectedWorker.nameJa}
                </h3>
                <p className='moveRight font-playwrite'>
                  {selectedWorker.name}
                </p>
                <p className='moveUp font-playwrite'>
                  {selectedWorker.livingAge}
                </p>
              </div>
              <div className='worker-img'>
                <img src={selectedWorker.url} alt={selectedWorker.name} />
              </div>
            </div>
            <p className='description moveUp font-mincho'>
              {selectedWorker.description}
            </p>
          </div>

          <section id='works'>
            <WorksDisplay
              worksRef={worksRef}
              selectedTagId={selectedTagId}
              setSelectedTagId={setSelectedTagId}
              displayWorks={displayWorks}
              all={all}
            />
          </section>

          {/* MICROCMS Mounter */}
          {cmsNews ? <News cmsNews={cmsNews} /> : <></>}

          {/* Contact Section */}
          <section id='contact'>
            <div className='container'>
              <h2 className='title font-gothic'>お問い合わせ</h2>
              <p className='contact-lead font-mincho'>
                就職・採用に関するご連絡、または非営利でWEBエンジニアとして交流していただける方はこちらからお願いいたします。
              </p>
              <p className='contact-warning font-gothic'>
                ※あくまで就活を目的としたポートフォリオサイトです。フリーランス案件はお受けしません。
              </p>
              <form className='contact-form' onSubmit={handleContactSubmit}>
                <label className='contact-item contact-company font-gothic'>
                  <span>会社名</span>
                  <input
                    type='text'
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder='株式会社〇〇'
                  />
                </label>
                <label className='contact-item contact-name font-gothic'>
                  <span>お名前</span>
                  <input
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='山田 太郎'
                    required
                  />
                </label>
                <label className='contact-item contact-email font-gothic'>
                  <span>メールアドレス</span>
                  <input
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='sample@example.com'
                    required
                  />
                </label>
                <label className='contact-item contact-subject font-gothic'>
                  <span>件名</span>
                  <input
                    type='text'
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder='求人について'
                    required
                  />
                </label>
                <label className='contact-item contact-message font-gothic'>
                  <span>お問い合わせ内容</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows='8'
                    placeholder='ご用件をご記入ください。'
                    required
                  />
                </label>
                <button type='submit' className='contact-submit font-gothic'>
                  メールを作成する
                </button>
              </form>
            </div>
          </section>

          <Footer pageType='home' />
        </>
      ) : (
        <p>選択されていません。</p>
      )}
    </div>
  );
}
