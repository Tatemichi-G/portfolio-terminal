import { works } from "../assets/WorkersArray";
import { useParams, Link } from "react-router-dom";
import { useMemo, useEffect } from "react";
import "../App.css";
import Header from "../assets/Header";
import Footer from "../assets/Footer";

export default function WorkPage() {
  const { id } = useParams();
  const work = useMemo(() => {
    const numId = Number(id);
    return works.find((work) => work.id === numId) ?? null;
  }, [id]);

  console.log("work", work);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);

  if (!work) {
    return (
      <section className='work-page'>
        <h2>作品が見つかりません</h2>
        <Link to="/">戻る</Link>
      </section>
    );
  }

  return (
    <>
      <Header pageType='work' />
      <section className='work-page'>
        <div className='container'>
          <Link to={"/"} className='prev-button font-mincho'>
            戻る
          </Link>
          <h2 className='font-playwrite' data-subtitle={work.nameJa}>
            {work.name}
          </h2>
          {work.video ? (
            <video
              className='img'
              src={work.video}
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline={true}
            ></video>
          ) : (
            <img className='img' src={work.url} alt={work.name} />
          )}
          {work.title && (
            <p className='work-title font-hinamincho'>{work.title}</p>
          )}
          {work.stacks && <p className='work-stacks'>{work.stacks}</p>}
          <div className='description-wrapper'>
            <h3>＜この作品について＞</h3>
            <p>{work.description}</p>
          </div>
        </div>
      </section>
      <Footer pageType='work' />
    </>
  );
}
