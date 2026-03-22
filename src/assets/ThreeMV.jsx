// Three import
import "../App.css";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// TextureLoader,Vector3
import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";

// ReactHooks
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// Spring (タップ検知&押し出し制御)
import { useSpring, a } from "@react-spring/three";

// GSAP - ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// =======================================================================
// いまのコードの役割（最新版）
// A. タイル（絵の1枚1枚）
//   - 見た目：BrushMat（shaderMaterial）で筆っぽいマスク + “ゆらゆら歪み”
//   - スクロール同期：uMorph（morph）で「線化」「伸び」「球体化」まで完全スクラブ
//   - タップ演出：useSpring で「選択以外を押し出し」→時間で自動解除
//   - 破綻防止：sphereTが戻る時も姿勢（quaternion）を必ず正面に戻す
//
// B. 流れ（横スクロール・ループ）
//   - FlowX：平面フェーズでは横に流す / 球体フェーズでは流れを止めて中心へ寄せる
//   - 破綻防止：球体化直前は wrap を止めて飛びを防ぐ
//
// C. 球体フェーズ（平面→球面）
//   - sphereStart〜sphereStop の区間で basePosition → spherePosition を補間
//   - 球体化中は外向きに姿勢を向ける（裏面も完全には消さない）
//   - 球体化したら “正方形タイル + ギャップ埋め” に寄せて綺麗な球体シェイプにする
// =======================================================================

// メディアクエリ
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// モーフィングの定数設定
const MORPH_STOP = 0.4; // ← ここで変形を止める（スクショの状態に合わせて調整）
const MIN_TILE_ALPHA = 0.3; // ← 最終的にここまでしか薄くしない（好みで 0.25〜0.6）
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// 球体化の区間（morphの中でいつ球体にするか）
const sphereStart = 0.3;
const sphereStop = 0.4;

// 球の半径（見た目に合わせて）
const sphereRadius = isMobile ? 2.4 : 2.8;

// =========================================================
// ★球体の見た目を “綺麗に密に” するチューニング（ここだけ触ればOK）
// =========================================================
const SPHERE_RADIUS_IN = isMobile ? 0.6 : 0.7;
// ↑ 球体化のときに半径をどれだけ縮めるか（1.0=そのまま）
//   - 小さくするほど：球が締まってギャップが埋まる
//   - 小さくしすぎると：タイルが重なって破綻しやすい（0.80〜0.95が安全帯）

const SPHERE_TILE_FILL = isMobile ? 0.8 : 0.68;
// ↑ 球体化のときにタイルをどれだけ大きく見せるか（1.0=そのまま）
//   - 上げるほど：ギャップが埋まる（球体が“面”っぽくなる）
//   - 上げすぎると：重なってZファイトや破綻（1.15〜1.40で調整）

const SPHERE_SQUARE_LONGSIDE = true;
// ↑ 球体化のときタイルを正方形にする方法
//   true : 長辺に合わせて短辺を伸ばす → “密”になりやすい（おすすめ）
//   false: 短辺に合わせて長辺を縮める → スカスカになりやすい

// ★ uniforms: uTex / uTime / uMorph / uSeed
const BrushMat = shaderMaterial(
  { uTex: null, uTime: 0, uMorph: 0, uSeed: 0, uFade: 1, uBend: 0 },
  // ===== vertex =====
  `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMorph;
  uniform float uSeed;
  uniform float uBend;

  float hash(float n){ return fract(sin(n)*43758.5453123); }
  float noise1(float x){
    float i=floor(x), f=fract(x);
    float a=hash(i+uSeed*37.0);
    float b=hash(i+1.0+uSeed*37.0);
    return mix(a,b,f*f*(3.0-2.0*f));
  }

  void main(){
    vUv = uv;
    vec3 p = position;

    // うねり：morphが進むほど強く（※時間で動いてOK：唯一の“自走”成分）
    float w = uMorph;
    float wave =
      sin(p.x*7.0 + uTime*1.7 + uSeed*5.0)*0.08 +
      sin(p.x*15.0 + uTime*1.1 + uSeed*2.0)*0.04;
    p.y += wave * w;

    // 線化：Yを中央へ寄せる（幅ムラも入れる）
    float press = noise1(uv.x*6.0 + uTime*0.2);         // 筆圧ムラ
    float halfW = mix(0.50, 0.06, uMorph);              // 最終幅
    halfW *= (0.55 + press*1.1);                        // ばらつき

    float y = (uv.y - 0.5);
    y = clamp(y, -halfW, halfW);
    p.y = mix(p.y, y, uMorph);

    // しなり（uv.x方向に弧を作る）
    float bend = uBend;          // 0..1
    float t = (vUv.x - 0.5);     // -0.5..0.5
    p.y += sin(t * 3.14159) * 0.25 * bend;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
  }
  `,

  // ===== fragment =====
  `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uMorph;
  uniform float uSeed;
  uniform float uFade;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    vec2 u=f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }

  void main(){
    // 線の中に“絵”を残す：morphが進むほど中央の帯だけ参照
    float tight = mix(1.0, 0.20, uMorph);
    float y = 0.5 + (vUv.y - 0.5) * tight;

    // にじみ：線内で少し揺らす
    float smear = (noise(vec2(vUv.x*25.0 + uSeed*9.0, uTime*0.2)) - 0.5);
    y += smear * 0.12 * uMorph;

    vec4 col = texture2D(uTex, vec2(vUv.x, y));

    // ここから“筆”マスク
    float dist = abs(vUv.y - 0.5);

    // 幅ムラ
    float press = noise(vec2(vUv.x*6.0 + uSeed*3.0, uTime*0.12));
    float width = mix(0.48, 0.07, uMorph);
    width *= (0.55 + press*1.2);

    // 毛羽（輪郭のガサ）
    float edgeN = noise(vec2(vUv.x*35.0 + uSeed*4.0, vUv.y*25.0 + uTime*0.25));
    float feather = mix(0.01, 0.10, uMorph);
    float edge = width - feather * edgeN;

    float a = smoothstep(edge, edge - 0.04, dist);

    // カスレ（途切れ）
    float scratch = noise(vec2(vUv.x*18.0 + uTime*0.35 + uSeed*6.0, vUv.y*3.0));
    float breakMask = smoothstep(0.25, 0.60, scratch);
    a *= mix(1.0, breakMask, uMorph);

    // 最終
    float alpha = a * mix(1.0, 0.9, uMorph) * uFade;
    gl_FragColor = vec4(col.rgb, col.a * alpha);
    if(gl_FragColor.a < 0.02) discard;
  }
  `,
);

extend({ BrushMat });

function SceneMV({
  textureUrl, //画像テクスチャ
  basePosition, //元の位置
  morph,
  index,
  selectedIndex,
  onSelect,
  selectedPosition,
  fade,
  tileWidth,
  tileHeight,
  spherePosition,
  sphereT,
}) {
  // meshをセレクトできるようにRefを設定する。
  const meshRef = useRef();

  // TextureLoader on React 引数1がメソッド：引数2が参照（今回は配列にURLを入れる）
  const texture = useLoader(TextureLoader, textureUrl);

  // 初回に決まる個体差ランダム
  const seed = useMemo(() => {
    const randoms = (min, max) => min + Math.random() * (max - min);
    return {
      rotationSpeed: randoms(-0.35, 0.35),
      rotationAmp: randoms(0.05, 0.2),
      breatheSpeed: randoms(0.1, 0.5),
      breathAmp: randoms(0.03, 0.08),
    };
  }, []);

  // Ref設定
  const matRef = useRef();

  // 選択の状態管理
  const isSelected = selectedIndex === index;
  const othersSelected = selectedIndex != null;

  // 押し出しベクトル
  const pushOffset = useMemo(() => {
    if (!othersSelected) return [0, 0, 0];
    if (isSelected) return [0, 0, 0];
    if (!selectedPosition) return [0, 0, 0];

    const direction = new Vector3(
      basePosition[0] - selectedPosition[0],
      basePosition[1] - selectedPosition[1],
      0,
    );
    if (direction.length() < 0.0001) direction.set(0.0001, 0, 0);
    direction.normalize();

    const strength = 0.2; //押し出し距離
    direction.multiplyScalar(strength);
    return [direction.x, direction.y, 0];
  }, [othersSelected, isSelected, basePosition, selectedPosition]);

  // 押し出しの移動・帰還
  const centerPull = 0.01; // 値を上げるほど「選択タイルが中心へ寄る」感じが強くなる（やりすぎ注意）
  const pullZ = 1; // 値を上げるほど「選択タイルが前に出る」
  const pullX = isSelected ? (0 - basePosition[0]) * centerPull : 0;
  const pullY = isSelected ? (0 - basePosition[1]) * centerPull : 0;

  // basePosition(平面) → spherePosition(球面) を補間
  const baseTarget = useMemo(() => {
    return [
      THREE.MathUtils.lerp(basePosition[0], spherePosition[0], sphereT),
      THREE.MathUtils.lerp(basePosition[1], spherePosition[1], sphereT),
      THREE.MathUtils.lerp(basePosition[2] ?? 0, spherePosition[2], sphereT),
    ];
  }, [basePosition, spherePosition, sphereT]);

  const { post } = useSpring({
    post: [
      baseTarget[0] + pushOffset[0] + pullX,
      baseTarget[1] + pushOffset[1] + pullY,
      baseTarget[2] + pushOffset[2] + (isSelected ? pullZ : 0),
    ],
    // tension↑ = 速く動く / friction↑ = 止まりやすい / mass↑ = 重い動き
    config: { tension: 70, friction: 26, mass: 1.2 },
  });

  const { camera } = useThree();

  const tmpPosRef = useRef(new THREE.Vector3());
  const tmpLookRef = useRef(new THREE.Vector3());
  const tmpObjRef = useRef(new THREE.Object3D());
  const tmpNormalRef = useRef(new THREE.Vector3());
  const tmpToCameraRef = useRef(new THREE.Vector3());

  // 平面時に戻すべき “正面姿勢”
  const identityQuatRef = useRef(new THREE.Quaternion()); // (0,0,0,1)

  useFrame((state, delta) => {
    const MIN_BACK_ALPHA = 0.25;
    // ↑ 裏側が完全に消えると“点滅”っぽく見えるので、最低値を残す（0.0にすると完全に消える）

    const transition = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // shader
    if (matRef.current) {
      matRef.current.uTime = transition; // 歪み（ゆらゆら）用。消さない
      matRef.current.uMorph = morph; // スクロール同期（線化など）
      matRef.current.uFade = fade; // 全体フェード
    }

    // morph終盤の強調（0.35以降で効く）
    const m = smoothstep(0.2, MORPH_STOP, morph);

    // 球体化が進むほど “線化演出” を弱める（球体では線になりすぎないように）
    const lineK = 1.0 - sphereT;
    const stretchX = 1 + m * 5.0 * lineK; // 値↑で平面時の横伸びが強くなる
    const thinY = 1 - m * 0.05 * lineK; // 値↑で平面時の縦つぶれが強くなる
    const yScale = Math.max(0.05, thinY);

    // breathe（時間で動いてOK：絵が生きてる感じ）
    const breathe =
      1 + Math.sin(transition * seed.breatheSpeed) * seed.breathAmp;
    const selectedBoost = isSelected ? 1.08 : 1.0;
    const base = breathe * selectedBoost;

    // =========================
    // 球体向き（外向き） & 破綻防止（戻す）
    // =========================
    const p = tmpPosRef.current.set(
      baseTarget[0],
      baseTarget[1],
      baseTarget[2],
    );

    if (sphereT > 0.0001) {
      // 球体化してきたら、外向きに向ける（急に切り替えない）
      const n = tmpNormalRef.current.copy(p).normalize();
      const look = tmpLookRef.current.copy(p).add(n);

      const helper = tmpObjRef.current;
      helper.position.copy(p);
      helper.lookAt(look);

      // sphereT↑ほど外向きが強くなる（スクロールで戻せば元に戻る）
      meshRef.current.quaternion.slerp(helper.quaternion, sphereT);

      // ---- 裏側フェード（完全には消さない） ----
      const faceNormal = tmpNormalRef.current
        .set(0, 0, 1)
        .applyQuaternion(meshRef.current.quaternion);

      const toCamera = tmpToCameraRef.current
        .set(
          camera.position.x - p.x,
          camera.position.y - p.y,
          camera.position.z - p.z,
        )
        .normalize();

      const facing = faceNormal.dot(toCamera);

      const backT = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(facing, -0.2, 0.2, 0, 1),
        0,
        1,
      );
      const backFade = THREE.MathUtils.lerp(MIN_BACK_ALPHA, 1.0, backT);

      if (matRef.current) matRef.current.uFade = fade * backFade;
    } else {
      // ★超重要：球体から戻った時に “姿勢も必ず正面へ戻す”
      // ここが無いとスクロールで戻してもごちゃごちゃ（裏向き）が残る
      meshRef.current.quaternion.slerp(
        identityQuatRef.current,
        1 - Math.pow(0.001, delta * 60),
      );

      if (matRef.current) matRef.current.uFade = fade;
    }

    // =========================
    // ★球体の “綺麗なシェイプ” 用スケール補正（正方形 + ギャップ埋め）
    // =========================

    // 1) 正方形化（球体化が進むほど効く）
    //    - 長辺に合わせて短辺を伸ばすと、タイルが大きく見えてギャップが埋まりやすい
    const longSide = Math.max(tileWidth, tileHeight);
    const shortSide = Math.min(tileWidth, tileHeight);

    const targetSide = SPHERE_SQUARE_LONGSIDE ? longSide : shortSide;

    // “この倍率にすると正方形になる” という目標倍率
    const squareXTarget = targetSide / tileWidth; // tileWidthが短いなら>1で伸びる
    const squareYTarget = targetSide / tileHeight; // tileHeightが短いなら>1で伸びる

    // sphereT=0 → 1 で 正方形化を入れる
    const squareK = smoothstep(0.0, 1.0, sphereT);
    const squareX = THREE.MathUtils.lerp(1.0, squareXTarget, squareK);
    const squareY = THREE.MathUtils.lerp(1.0, squareYTarget, squareK);

    // 2) ギャップ埋め（球体化が進むほどタイルを少し大きく）
    //    - SPHERE_TILE_FILL を上げると球体が“面”っぽくなる
    //    - 上げすぎると重なって破綻するので 1.15〜1.40が安全
    const fill = THREE.MathUtils.lerp(1.0, SPHERE_TILE_FILL, squareK);

    // 3) 最終スケール
    //    - 平面：stretchX / yScale が効く（線化演出）
    //    - 球体：lineKで線化が弱まり、square+fillで“正方形＆密”になる
    meshRef.current.scale.set(
      base * stretchX * squareX * fill,
      base * yScale * squareY * fill,
      base,
    );
  });

  return (
    <>
      <a.mesh
        ref={meshRef}
        position={post}
        onPointerDown={(el) => {
          el.stopPropagation();
          onSelect(index);
        }}
      >
        <planeGeometry args={[tileWidth, tileHeight, 32, 32]} />
        <brushMat
          ref={matRef}
          uTex={texture}
          uSeed={index * 0.123}
          uFade={fade}
          transparent
          depthWrite={false}
        />
      </a.mesh>
    </>
  );
}

//  const columns = 6;
const rows = 3;

export default function ThreeMV() {
  const textures = isMobile
    ? [
        "/img/thumbnail/PC/roomplanner.png",
        "/img/thumbnail/PC/Task_Workplace.png",
        "/img/thumbnail/PC/Anne_Vallayer_Coster_Vase_of_Flowers_and_Conch_Shell.jpg",
        "/img/thumbnail/PC/Gustav_Klimt_The_Kiss.jpg",
        "/img/thumbnail/PC/Clara_Peeters_A_Bouquet_of_Flowers.jpg",
        "/img/thumbnail/PC/Paul_Cezanne_The_Fishermen.jpg",
        "/img/thumbnail/PC/Giovanni_Boldini_The_Dispatch_Bearer.jpg",
        "/img/thumbnail/PC/Henri_Fantin_Latour_Roses_and_Lilies.jpg",
        "/img/thumbnail/PC/Theee_cars_demo_1.png",
        "/img/thumbnail/PC/Car_Model_color_editor.png",
        "/img/thumbnail/PC/Joseph_Mallord_William_Turner_Venice_from_the_Porch_of_Madonna_della_Salute.jpg",
        "/img/thumbnail/PC/Auguste_Renoir_A_Road_in_Louveciennes.jpg",
        "/img/thumbnail/PC/Gustav_Klimt_Portrait_of_Adele_Bloch_Bauer.jpg",
        "/img/thumbnail/PC/Edgar_Degas_At_the_Milliner's.jpg",
        "/img/thumbnail/PC/Giovanni_Battista_Tiepolo_The_Flight_into_Egypt.jpg",
        "/img/thumbnail/PC/Leonaert_Bramer_The_Judgment_of_Solomon.jpg",
        "/img/thumbnail/PC/Three_cars_demo_2.png",
        "/img/thumbnail/PC/Gustav_Klimt_Music.jpg",
        "/img/thumbnail/PC/Sir_Joshua_Reynolds_Lady_Smith_and_Her_Children.jpg",
        "/img/thumbnail/PC/Peter_Paul_Rubens_Wolf_and_Fox_Hunt.jpg",
        "/img/thumbnail/PC/Three_cars_demo_3.png",
      ]
    : [
        "/img/thumbnail/PC/roomplanner.png",
        "/img/thumbnail/PC/Three_cars_demo_2.png",
        "/img/thumbnail/PC/Gustav_Klimt_Music.jpg",
        "/img/thumbnail/PC/Task_Workplace.png",
        "/img/thumbnail/PC/Sir_Joshua_Reynolds_Lady_Smith_and_Her_Children.jpg",
        "/img/thumbnail/PC/Clara_Peeters_A_Bouquet_of_Flowers.jpg",
        "/img/thumbnail/PC/Paul_Cezanne_The_Fishermen.jpg",
        "/img/thumbnail/PC/Gustav_Klimt_The_Kiss.jpg",
        "/img/thumbnail/PC/Theee_cars_demo_1.png",
        "/img/thumbnail/PC/Giovanni_Boldini_The_Dispatch_Bearer.jpg",
        "/img/thumbnail/PC/Car_Model_color_editor.png",
        "/img/thumbnail/PC/Henri_Fantin_Latour_Roses_and_Lilies.jpg",
        "/img/thumbnail/PC/Joseph_Mallord_William_Turner_Venice_from_the_Porch_of_Madonna_della_Salute.jpg",
        "/img/thumbnail/PC/Auguste_Renoir_A_Road_in_Louveciennes.jpg",
        "/img/thumbnail/PC/Gustav_Klimt_Portrait_of_Adele_Bloch_Bauer.jpg",
        "/img/thumbnail/PC/Edgar_Degas_At_the_Milliner's.jpg",
        "/img/thumbnail/PC/Giovanni_Battista_Tiepolo_The_Flight_into_Egypt.jpg",
        "/img/thumbnail/PC/Leonaert_Bramer_The_Judgment_of_Solomon.jpg",
        "/img/thumbnail/PC/Anne_Vallayer_Coster_Vase_of_Flowers_and_Conch_Shell.jpg",
        "/img/thumbnail/PC/Peter_Paul_Rubens_Wolf_and_Fox_Hunt.jpg",
        "/img/thumbnail/PC/Three_cars_demo_3.png",
      ];

  const texturesLoop = [...textures, ...textures];

  const tileWidth = isMobile ? 1 : 2.4;
  const tileHeight = 1.5;
  const gapX = tileWidth + 0.15;
  const gapY = tileHeight + 0.15;

  const columns = Math.ceil(texturesLoop.length / rows);
  const flowRef = useRef(null);
  const loopWidth = columns * gapX;
  const speed = 0.05;

  // タップしたら周りが離れて戻る。
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [morph, setMorph] = useState(0); // ★これが無いと死ぬ

  // .mainのアニメーション用セレクト
  const mainRef = useRef([]);
  // const mainParagraphs = document.querySelectorAll('.main-anim');
  // console.log(mainParagraphs);

  useEffect(() => {
    if (selectedIndex == null) return;
    const timer = setTimeout(() => setSelectedIndex(null), 1000);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  // =======================================================
  // シーン２
  // =======================================================

  // GSAP スクロールMorph（完全スクラブ）
  useEffect(() => {
    const MVtrigger = ScrollTrigger.create({
      trigger: ".mv-container",
      start: "top+=100 top",
      end: "top+=600 top",
      scrub: true,
      onUpdate: (self) => setMorph(self.progress),
    });

    return () => MVtrigger.kill();
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ~767px スマホ～ipad縦までの画面幅
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(mainRef.current).forEach((el) => {
          if (el) {
            gsap.from(el, {
              y: 20,
              autoAlpha: 0,
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom 85%",
                scrub: 2,
                // markers:true
              },
            });
          }
        });
      });

      // 768px ~ 1199px ipad縦 ~ ipad横 ~ PC小(11インチ)までの画面幅
      mm.add("(min-width: 768px) and (max-width: 1199px)", () => {
        gsap.utils.toArray(mainRef.current).forEach((el) => {
          if (el) {
            gsap.from(el, {
              y: 40,
              autoAlpha: 0,
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom 85%",
                scrub: 2,
                // markers:true
              },
            });
          }
        });
      });

      // 1200px~ 小PC～の画面幅
      mm.add("(min-width: 1200px)", () => {
        gsap.utils.toArray(mainRef.current).forEach((el) => {
          if (el) {
            gsap.from(el, {
              y: 80,
              autoAlpha: 0,
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom 85%",
                scrub: 2,
                // markers:true
              },
            });
          }
        });
      });

      return () => mm.revert();
    }, mainRef);

    return () => context.revert();
  }, []);

  const morphStop = Math.min(clamp01(morph), MORPH_STOP);

  // ★Alphaを下げ切らない（1 → MIN_TILE_ALPHA まで）
  const tileAlpha = THREE.MathUtils.lerp(
    1.0,
    MIN_TILE_ALPHA,
    morphStop / MORPH_STOP,
  );

  // 球体の進行度（0..1）
  const sphereT = smoothstep(sphereStart, sphereStop, morphStop);

  // 球体半径を球体化中に縮める（ギャップが埋まりやすくなる）
  // - SPHERE_RADIUS_IN を下げるほど球が“締まる”
  const radiusNow =
    sphereRadius * THREE.MathUtils.lerp(1.0, SPHERE_RADIUS_IN, sphereT);

  return (
    <div className='mv-container'>
      <div className='title-wrapper'>
        <h2 className='font-amatic'>G-tatemichi</h2>
      </div>

      <article className='main font-mincho'>
        <h2 className='main-anim'>- このサイトについて -</h2>
        <div ref={(el) => (mainRef.current[0] = el)}>
          <p className='main-anim' ref={(el) => (mainRef.current[1] = el)}>
            このサイトは立道元気の
            <span
              className='sp-span main-anim'
              ref={isMobile ? (el) => (mainRef.current[2] = el) : null}
            >
              ポートフォリオサイトです。
            </span>
          </p>
          <p className='main-anim' ref={(el) => (mainRef.current[3] = el)}>
            「作品は再現可能な知恵」と考え、
            <span
              className='sp-span main-anim'
              ref={isMobile ? (el) => (mainRef.current[4] = el) : null}
            >
              制作活動を行っています。
            </span>
          </p>
          <p className='main-anim' ref={(el) => (mainRef.current[5] = el)}>
            この知恵の集合が、いつか私を
          </p>

          <p className='main-anim' ref={(el) => (mainRef.current[6] = el)}>
            一人前のフロントエンドエンジニアに
            <span
              className='sp-span main-anim'
              ref={isMobile ? (el) => (mainRef.current[7] = el) : null}
            >
              導いてくれると信じるとともに、
            </span>
          </p>
          <p className='main-anim' ref={(el) => (mainRef.current[8] = el)}>
            誰かの作品の一部に
            <span
              className='sp-span main-anim'
              ref={isMobile ? (el) => (mainRef.current[9] = el) : null}
            >
              なればいいなと思います。
            </span>
          </p>
        </div>
      </article>

      <Canvas
        dpr={[1, 1.5]}
        className='canvas'
        camera={{ position: [0, 0, isMobile ? 7 : 6], fov: 40 }}
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#617a96",
          position: "sticky",
          top: 0,
          left: 0,
        }}
        onPointerMissed={() => {
          setSelectedIndex(null); //セレクト解除用
        }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} />

        <FlowX
          flowRef={flowRef}
          baseSpeed={speed}
          loopWidth={loopWidth}
          morph={morphStop}
        />

        <a.group ref={flowRef}>
          {texturesLoop.map((url, index) => {
            const col = Math.floor(index / rows);
            const row = index % rows;
            const x = col * gapX - loopWidth / 2;
            const y = (1 - row) * gapY;

            // ---- 球面配置（フィボナッチ球） ----
            const totalTiles = texturesLoop.length;
            const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 定数

            // i: 0..totalTiles-1
            const i = index;

            // ★極（ポール）詰まりを少し均す：i+0.5 を使うと均等感が上がる
            // - これで “縦方向の密度ムラ” がわずかに減る
            const t = (i + 0.5) / totalTiles;

            // -1..1
            const yN = 1 - t * 2;

            // 0..1
            const rN = Math.sqrt(Math.max(0, 1 - yN * yN));

            // ぐるぐる
            const theta = i * goldenAngle;

            const sx = radiusNow * rN * Math.cos(theta);
            const sy = radiusNow * yN;
            const sz = radiusNow * rN * Math.sin(theta);

            const spherePosition = [sx, sy, sz];

            let selectedPosition = null;
            if (selectedIndex != null) {
              const selectedColumns = Math.floor(selectedIndex / rows);
              const selectedRow = selectedIndex % rows;
              selectedPosition = [
                selectedColumns * gapX - loopWidth / 2,
                (1 - selectedRow) * gapY,
                0,
              ];
            }

            return (
              <SceneMV
                key={index}
                textureUrl={url}
                basePosition={[x, y, 0]}
                morph={morphStop}
                index={index}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                selectedPosition={selectedPosition}
                fade={tileAlpha}
                tileWidth={tileWidth}
                tileHeight={tileHeight}
                spherePosition={spherePosition}
                sphereT={sphereT}
              />
            );
          })}
        </a.group>
      </Canvas>
    </div>
  );
}

function FlowX({ flowRef, baseSpeed, loopWidth, morph }) {
  useFrame((_, delta) => {
    const g = flowRef.current;
    if (!g) return;

    const sphereT = smoothstep(sphereStart, sphereStop, morph);
    const moveK = 1.0 - sphereT;

    // 球体化に近づくほど流れを止める（sphereT=1で完全停止）
    g.position.x -= delta * baseSpeed * moveK;

    // ★球体化直前は wrap させない（飛び防止）
    const canWrap = morph < sphereStart - 0.03;
    if (canWrap && g.position.x <= -loopWidth) g.position.x += loopWidth;

    // 球体化中は中心へ寄せる（滑らか）
    if (sphereT > 0.0001) {
      g.position.x = THREE.MathUtils.damp(g.position.x, 0, 4.0, delta);
    }
  });

  return null;
}
